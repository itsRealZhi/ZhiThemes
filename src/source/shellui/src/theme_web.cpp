/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#include "theme_web.hpp"
#include "zt_paths.hpp"
#include "homeui_js_inject.hpp"

#if SHELLUI_THEME_WEB == 1

#include "hooked_funcs.hpp"
#include "zt_brand.hpp"
#include "zt_log.hpp"
#include "theme_web_page.hpp"
#include "zt_sgdb.hpp"
#include "zt_mosaic.hpp"
#include "zt_storage.hpp"

#include <algorithm>
#include <ctype.h>
#include <dirent.h>
#include <errno.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <string>
#include <vector>
#include <strings.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <sys/time.h>
#include <time.h>
#include <unistd.h>

/*
 * A small HTTP/1.0 server in ShellUI, one request per connection:
 *
 *   GET  /            the editor page (THEME/editor.html, built in)
 *   GET  /theme.js    current theme script
 *   POST /theme.js    replace it (body = new script)
 *   POST /reload      reload HomeUI and the game hub, which evaluate theme.js
 *                     again
 *   GET  /log         tail of logs/zhithemes.log (this session)
 *   GET  /log/find?q= every line of the log with one of the words a|b
 *   GET  /sysinfo     ZhiThemes version, PS5 model and firmware, debug mode
 *   GET  /logs        the files of logs/ (JSON)
 *   GET  /logs/file?name=   one of them, as a download
 *   POST /logs/delete?name= delete one (not the current log)
 *   POST /debug?on=1&sys=0  debug mode on/off (off saves debug-<date>.log)
 *   GET|POST /injectdelay?s=  seconds the watcher waits after a ShellUI restart (5-120, 15)
 *   POST /quit        take the theme hooks out and stop (a newer ZhiThemes
 *                     is about to replace this one)
 *   GET  /version     which build answers (zhithemes / onionhen)
 *   GET  /games       the Games row sent by the Home (folders tab)
 *   GET  /icon?p=...  a tile icon (.png under /user/app, /user/appmeta, /system_ex/rnps/apps)
 *   GET  /layout      the "THEME [app] layout ..." lines (visual editor)
 *   POST /log/clear   empty the current log
 *
 * The reload is only queued here; ShellUI runs it on its UI thread
 * (shellui_poll_home_reload), as for the reload after injection.
 */

namespace {

constexpr int kPort = 4444;
/* the theme file is Themes/<active>.ztheme (zt_theme_file()) */
constexpr const char *kLogPath = ZT_LOGS "/zhithemes.log";
bool g_web_quit = false; /* set by POST /quit */
time_t g_started = time(nullptr); /* when this copy of the module started */
constexpr size_t kMaxHeader = 16u << 10;
constexpr size_t kMaxBody = 24u << 20; /* font files can be a few MB */
constexpr size_t kMaxUpload = (size_t)2u << 30; /* fonts, images, wallpaper videos */
constexpr size_t kLogTail = 24u << 10;

bool send_all(int fd, const char *data, size_t size) {
  while (size > 0) {
    const ssize_t n = send(fd, data, size, 0);
    if (n <= 0)
      return false;
    data += n;
    size -= (size_t)n;
  }
  return true;
}

/* reads and throws away the rest of a request body, so a refused or
   failed upload still gets its answer (the browser only shows "Failed to
   fetch" when we close while it is still sending) */
void drain(int fd, size_t left) {
  std::vector<char> junk(64u << 10);
  while (left > 0) {
    const ssize_t n = recv(fd, junk.data(), left < junk.size() ? left : junk.size(), 0);
    if (n <= 0)
      return;
    left -= (size_t)n;
  }
}

void reply(int fd, int code, const char *status, const char *type,
           const std::string &body) {
  char head[256];
  const int n = snprintf(head, sizeof(head),
                         "HTTP/1.0 %d %s\r\n"
                         "Content-Type: %s\r\n"
                         "Content-Length: %zu\r\n"
                         "Cache-Control: no-store\r\n"
                         "Connection: close\r\n\r\n",
                         code, status, type, body.size());
  if (n > 0 && send_all(fd, head, (size_t)n))
    send_all(fd, body.data(), body.size());
}

/* Whole file (or its last max_tail bytes); empty when missing. */
std::string read_file(const char *path, size_t max_tail = 0) {
  std::string out;
  const int fd = open(path, O_RDONLY);
  if (fd < 0)
    return out;
  if (max_tail) {
    struct stat st;
    if (fstat(fd, &st) == 0 && (size_t)st.st_size > max_tail)
      lseek(fd, st.st_size - (off_t)max_tail, SEEK_SET);
  }
  char buf[4096];
  ssize_t n;
  while ((n = read(fd, buf, sizeof(buf))) > 0 && out.size() < kMaxBody)
    out.append(buf, (size_t)n);
  close(fd);
  return out;
}

/* Written to a temp file first, so a cut connection never leaves half a script. */
bool write_script(const std::string &body, std::string file = std::string()) {
  if (file.empty())
    file = zt_theme_file();
  const std::string temp = file + ".tmp";
  zt_mkdirs(ZT_THEMES);
  const int fd = open(temp.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (fd < 0)
    return false;
  bool ok = true;
  for (size_t off = 0; ok && off < body.size();) {
    const ssize_t n = write(fd, body.data() + off, body.size() - off);
    ok = n > 0;
    off += ok ? (size_t)n : 0;
  }
  /* on disk before the rename: without it a reboot soon after a save
     left no theme.js at all (the default one came back) */
  ok = ok && fsync(fd) == 0;
  close(fd);
  if (!ok || rename(temp.c_str(), file.c_str()) != 0)
    return false;
  const int dir = open(ZT_THEMES, O_RDONLY);
  if (dir >= 0) {
    fsync(dir);
    close(dir);
  }
  return true;
}

/* %XX and '+' of a query value */
std::string url_decode(const std::string &s) {
  std::string out;
  for (size_t i = 0; i < s.size(); ++i) {
    if (s[i] == '+')
      out += ' ';
    else if (s[i] == '%' && i + 2 < s.size() && isxdigit((unsigned char)s[i + 1]) && isxdigit((unsigned char)s[i + 2])) {
      out += (char)strtol(s.substr(i + 1, 2).c_str(), nullptr, 16);
      i += 2;
    } else
      out += s[i];
  }
  return out;
}

/* one value of a query string (decoded) */
std::string query_value(const std::string &query, const char *name) {
  const std::string want = std::string(name) + "=";
  for (size_t at = 0; at <= query.size();) {
    size_t amp = query.find('&', at);
    if (amp == std::string::npos)
      amp = query.size();
    if (query.compare(at, want.size(), want) == 0)
      return url_decode(query.substr(at + want.size(), amp - at - want.size()));
    at = amp + 1;
  }
  return "";
}

/* a path segment for the SteamGridDB API */
std::string url_encode(const std::string &s) {
  static const char *hex = "0123456789ABCDEF";
  std::string out;
  for (unsigned char c : s)
    if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~')
      out += (char)c;
    else {
      out += '%';
      out += hex[c >> 4];
      out += hex[c & 15];
    }
  return out;
}

size_t content_length(const std::string &head) {
  for (size_t at = 0; (at = head.find("\r\n", at)) != std::string::npos;) {
    at += 2;
    if (strncasecmp(head.c_str() + at, "Content-Length:", 15) == 0)
      return strtoul(head.c_str() + at + 15, nullptr, 10);
  }
  return 0;
}

/* GET /asset sends its file from a thread (see there) */
bool g_fd_taken = false; /* handle() gave fd to a thread: not closed after */
pthread_mutex_t g_asset_lock = PTHREAD_MUTEX_INITIALIZER;
int g_asset_clients = 0;
struct AssetJob {
  int fd, in;
  std::string head;
};
void asset_send(int fd, AssetJob &j) {
  bool sent = !j.head.empty() && send_all(fd, j.head.data(), j.head.size());
  std::vector<char> chunk(256u << 10);
  for (ssize_t got; sent && !g_web_quit && (got = read(j.in, chunk.data(), chunk.size())) > 0;)
    sent = send_all(fd, chunk.data(), (size_t)got);
  close(j.in);
}
void *asset_client(void *arg) {
  AssetJob *j = (AssetJob *)arg;
  asset_send(j->fd, *j);
  close(j->fd);
  delete j;
  pthread_mutex_lock(&g_asset_lock);
  --g_asset_clients;
  pthread_mutex_unlock(&g_asset_lock);
  return nullptr;
}

void video_stop(); /* below */

void handle(int fd) {
  std::string req;
  char buf[4096];
  size_t header_end = std::string::npos;
  while (header_end == std::string::npos && req.size() < kMaxHeader) {
    const ssize_t n = recv(fd, buf, sizeof(buf), 0);
    if (n <= 0)
      return;
    req.append(buf, (size_t)n);
    header_end = req.find("\r\n\r\n");
  }
  if (header_end == std::string::npos)
    return reply(fd, 431, "Header Too Large", "text/plain", "header too large");

  const std::string head = req.substr(0, header_end);
  std::string body = req.substr(header_end + 4);
  const size_t sp1 = head.find(' ');
  const size_t sp2 = head.find(' ', sp1 + 1);
  if (sp1 == std::string::npos || sp2 == std::string::npos)
    return reply(fd, 400, "Bad Request", "text/plain", "bad request");
  const std::string method = head.substr(0, sp1);
  std::string path = head.substr(sp1 + 1, sp2 - sp1 - 1);
  const size_t qmark = path.find('?');
  const std::string query = qmark == std::string::npos ? "" : path.substr(qmark + 1);
  path = path.substr(0, qmark);

  const size_t want = content_length(head);
  /* POST /font?name=my.otf -> <dir>/fonts/, POST /background?name=x.png ->
     <dir>/backgrounds/ (the theme's own wallpaper; also .mp4 videos of a
     few hundred MB): written to the file while it arrives, never whole in
     memory. POST /customtile?name=x.png -> <dir>/customtile/ (folder
     icons uploaded in the editor; later the SteamGridDB covers) */
  /* POST /background?kind=wallpapers|icons|folders&name= (zt_folder_*
     from the editor -> cache/mosaics) */
  if (method == "POST" && (path == "/font" || path == "/background" || path == "/customtile" || path == "/custombg")) {
    const std::string kind = query_value(query, "kind");
    std::string sub = path == "/font" ? "fonts" : path == "/customtile" ? "customtile"
                    : path == "/custombg" ? "custombg"
                    : kind == "icons" ? "icons" : kind == "folders" ? "folders"
                    : kind == "avatars" ? "avatars" : "wallpapers";
    std::string name = query_value(query, "name");
    if (path == "/background" && name.rfind("zt_folder_", 0) == 0)
      sub = "cache/mosaics";
    bool ok_name = !name.empty() && name.size() < 80 && name[0] != '.';
    for (char c : name)
      if (!(isalnum((unsigned char)c) || c == '.' || c == '-' || c == '_'))
        ok_name = false;
    /* wallpapers, icons and fonts go to a theme's folder (&theme=
       when a pack is installed as another theme; else the active one);
       the rest to Assets/ */
    const bool theme_kind = sub == "fonts" || sub == "icons" || sub == "wallpapers";
    const std::string theme = query_value(query, "theme");
    if (!theme.empty() && !zt_theme_name_ok(theme))
      ok_name = false;
    if (!ok_name || want == 0 || want > kMaxUpload) {
      if (want <= kMaxUpload)
        drain(fd, want > body.size() ? want - body.size() : 0);
      return reply(fd, 400, "Bad Request", "text/plain",
                   name.size() >= 80 ? "file name too long (79 letters at most)"
                   : want == 0 ? "empty file" : want > kMaxUpload ? "file too big"
                   : "invalid file name (only A-Z a-z 0-9 . _ -)");
    }
    const std::string folder = theme_kind ? zt_theme_dir_of(theme, sub.c_str()) : std::string(ZT_ASSETS "/") + sub;
    zt_mkdirs(folder);
    const std::string dest = folder + "/" + name;
    const std::string temp = dest + ".part";
    const int lf = open(temp.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0666);
    bool ok = lf >= 0;
    size_t got = 0;
    auto put = [&](const char *data, size_t size) {
      for (size_t off = 0; ok && off < size;) {
        const ssize_t n = write(lf, data + off, size - off);
        ok = n > 0;
        off += ok ? (size_t)n : 0;
      }
      got += size;
    };
    put(body.data(), body.size() < want ? body.size() : want);
    std::vector<char> chunk(256u << 10);
    while (ok && got < want) {
      const size_t room = want - got < chunk.size() ? want - got : chunk.size();
      const ssize_t n = recv(fd, chunk.data(), room, 0);
      if (n <= 0)
        break;
      put(chunk.data(), (size_t)n);
    }
    if (!ok && got < want) /* write error: still answer */
      drain(fd, want - got);
    ok = ok && got == want;
    if (lf >= 0) {
      fsync(lf);
      close(lf);
    }
    if (ok && rename(temp.c_str(), dest.c_str()) != 0)
      ok = false;
    if (!ok)
      unlink(temp.c_str());
    zt_log("web: %s %s (%zu of %zu bytes) %s", sub.c_str(), dest.c_str(), got, want,
                   ok ? "saved" : "FAILED");
    if (ok && theme_kind)
      zt_dedupe(dest);
    return reply(fd, ok ? 200 : 500, ok ? "OK" : "Error", "text/plain",
                 ok ? "saved" : "write error");
  }
  if (want > kMaxBody)
    return reply(fd, 413, "Too Large", "text/plain", "body too large");
  while (body.size() < want) {
    const ssize_t n = recv(fd, buf, sizeof(buf), 0);
    if (n <= 0)
      break;
    body.append(buf, (size_t)n);
  }
  body.resize(body.size() < want ? body.size() : want);

  if (method == "GET" && (path == "/" || path == "/index.html"))
    return reply(fd, 200, "OK", "text/html; charset=utf-8", kThemeWebPage);
  if (method == "GET" && path == "/theme.js")
    return reply(fd, 200, "OK", "text/plain; charset=utf-8",
                 theme_script());
  if (method == "POST" && path == "/theme.js") {
    if (body.size() != want || body.empty())
      return reply(fd, 400, "Bad Request", "text/plain", "incomplete body");
    /* ?name=<theme> writes that theme (a pack installed as a new
       theme); without it the active one */
    const std::string name = query_value(query, "name");
    if (!name.empty() && !zt_theme_name_ok(name))
      return reply(fd, 400, "Bad Request", "text/plain", "invalid theme name");
    const std::string file = zt_theme_file(name);
    /* &personal=1 (an installed pack): the folders and custom tile choices
       of the theme in use stay */
    const std::string before = query_value(query, "personal") == "1" ? read_file(zt_theme_file().c_str()) : std::string();
    if (!write_script(body, file))
      return reply(fd, 500, "Error", "text/plain", "cannot write " + file);
    if (!before.empty())
      zt_carry_personal(before, file);
    zt_log("web: %s saved (%zu bytes)", file.c_str(), body.size());
    /* Apply in the editor turns ZhiThemes back on (PS5 default off) */
    if (name.empty() || name == zt_theme_name())
      zt_stock_set(false);
    return reply(fd, 200, "OK", "text/plain", "saved");
  }
  /* themes:
       GET  /themes                       {"active":"X","themes":[{name,files,bytes,modified}]}
       POST /themes/use?name=             switch (the Home and the hub reload)
       POST /themes/new?name=&from=       new theme: a copy of from (its files
                                          linked), or the factory theme
       POST /themes/rename?name=&to=
       POST /themes/delete?name=          with its folder (not the active one)
       POST /themes/clear?name=           empty its folder (a pack replaces it) */
  if (method == "GET" && path == "/themes")
    return reply(fd, 200, "OK", "application/json", zt_themes_json());
  /* GET /themes/text?name= : that theme's file (the editor counts the
     files it uses) */
  if (method == "GET" && path == "/themes/text") {
    const std::string name = query_value(query, "name");
    if (!zt_theme_name_ok(name))
      return reply(fd, 400, "Bad Request", "text/plain", "invalid theme name");
    const std::string text = read_file(zt_theme_file(name).c_str());
    if (text.empty())
      return reply(fd, 404, "Not Found", "text/plain", "no such theme");
    return reply(fd, 200, "OK", "text/plain; charset=utf-8", text);
  }
  if (method == "POST" && path.rfind("/themes/", 0) == 0) {
    const std::string name = query_value(query, "name");
    std::string err;
    bool reload = false;
    if (path == "/themes/use") {
      err = zt_theme_use(name);
      reload = err.empty();
      if (reload)
        zt_stock_set(false);
    } else if (path == "/themes/new")
      err = zt_theme_new(name, query_value(query, "from"));
    else if (path == "/themes/rename") {
      const bool active = name == zt_theme_name();
      err = zt_theme_rename(name, query_value(query, "to"));
      reload = err.empty() && active; /* the theme's folder moved */
    } else if (path == "/themes/delete")
      err = zt_theme_delete(name);
    else if (path == "/themes/clear")
      err = zt_theme_clear(name);
    else if (path == "/themes/clean") { /* body = the unused files, one per line */
      int removed = 0;
      err = zt_theme_clean(name, body, &removed);
    }
    else
      return reply(fd, 404, "Not Found", "text/plain", "not found");
    if (!err.empty()) {
      zt_log("web: %s %s: %s", path.c_str(), name.c_str(), err.c_str());
      return reply(fd, 400, "Bad Request", "text/plain", err);
    }
    if (reload) {
      shellui_request_hub_reload();
      shellui_request_home_reload();
    }
    return reply(fd, 200, "OK", "application/json", zt_themes_json());
  }
  if (method == "POST" && path == "/reload") {
    zt_log("web: HomeUI + game hub reload requested");
    shellui_request_hub_reload();
    shellui_request_home_reload();
    return reply(fd, 200, "OK", "text/plain", "reload queued");
  }
  if (method == "GET" && path == "/log")
    return reply(fd, 200, "OK", "text/plain; charset=utf-8",
                 read_file(kLogPath, kLogTail));
  if (method == "GET" && path == "/log/find") {
    /* every line of the whole log (and previous.log) that has one of the words of q
       (q=rename|folder, '+' or %20 = space): the tail of /log is only 24 KB */
    std::string q = query.rfind("q=", 0) == 0 ? query.substr(2) : "";
    std::string dec;
    for (size_t i = 0; i < q.size(); ++i) {
      if (q[i] == '+') dec += ' ';
      else if (q[i] == '%' && i + 2 < q.size()) {
        dec += (char)strtol(q.substr(i + 1, 2).c_str(), nullptr, 16);
        i += 2;
      } else dec += q[i];
    }
    std::vector<std::string> words;
    for (size_t at = 0; at <= dec.size();) {
      size_t bar = dec.find('|', at);
      if (bar == std::string::npos) bar = dec.size();
      if (bar > at) words.push_back(dec.substr(at, bar - at));
      at = bar + 1;
    }
    /* the session before first */
    const std::string log = read_file(ZT_LOGS "/previous.log", kMaxBody) +
                            "--- zhithemes.log ---\n" + read_file(kLogPath, kMaxBody);
    std::string out;
    for (size_t at = 0; at < log.size() && !words.empty();) {
      size_t end = log.find('\n', at);
      if (end == std::string::npos)
        end = log.size();
      const std::string line = log.substr(at, end - at);
      for (const std::string &w : words)
        if (line.find(w) != std::string::npos || line.rfind("--- zhithemes.log", 0) == 0) {
          out += line + "\n";
          break;
        }
      at = end + 1;
    }
    return reply(fd, 200, "OK", "text/plain; charset=utf-8", out);
  }
  if (method == "GET" && path == "/layout") {
    /* where theme.js measured each element; only the newest lines matter */
    const std::string log = read_file(kLogPath, kMaxBody);
    std::string out;
    for (size_t at = 0; at < log.size();) {
      size_t end = log.find('\n', at);
      if (end == std::string::npos)
        end = log.size();
      const std::string line = log.substr(at, end - at);
      if (line.find("] layout ") != std::string::npos)
        out += line + "\n";
      at = end + 1;
    }
    if (out.size() > kLogTail)
      out.erase(0, out.find('\n', out.size() - kLogTail) + 1);
    return reply(fd, 200, "OK", "text/plain; charset=utf-8", out);
  }
  /*
   * SteamGridDB (Tiles tab), the PS5 asks and answers the editor:
   *   GET  /sgdb/search?q=<name>            games with that name (API JSON)
   *   GET  /sgdb/grids?id=<game>&fmt=2x3|1x1|92x43|16x9|logo&page=<n>  pictures (API JSON)
   *   GET  /sgdb/img?u=<cdn url>            a thumbnail or a full picture
   *   POST /sgdb/save?u=<cdn url>&id=<titleId>&fmt=2x3|1x1|92x43
   *        -> customtile/<titleId>_<fmt>_<n>.<png|jpg>, n = the highest + 1
   * The API key comes in the X-Key header (the editor's steamGridKey field).
   */
  /* the key lives on the PS5 (steamgrid.key): GET /sgdb/key says if
     there is one (never the key), POST /sgdb/key saves the body ("" removes) */
  if (path == "/sgdb/key") {
    if (method == "POST") {
      std::string k = body.substr(0, std::min<size_t>(body.size(), want));
      while (!k.empty() && (k.back() == '\n' || k.back() == '\r' || k.back() == ' '))
        k.pop_back();
      while (!k.empty() && k[0] == ' ')
        k.erase(0, 1);
      if (!zt_sgdb_key_set(k))
        return reply(fd, 400, "Bad Request", "text/plain", "not a key");
    }
    return reply(fd, 200, "OK", "application/json", zt_sgdb_key().empty() ? "{\"set\":false}" : "{\"set\":true}");
  }
  if (path.rfind("/sgdb/", 0) == 0) {
    const std::string key = zt_sgdb_key();
    const std::string api = "https://www.steamgriddb.com/api/v2/";
    std::string out, err, url;
    long http = 0;
    const std::string fmt = query_value(query, "fmt");
    if (method == "GET" && (path == "/sgdb/search" || path == "/sgdb/grids")) {
      if (key.empty())
        return reply(fd, 400, "Bad Request", "text/plain", "no SteamGridDB API key on the PS5 (Tiles tab)");
      if (path == "/sgdb/search") {
        const std::string q = query_value(query, "q");
        if (q.empty() || q.size() > 120)
          return reply(fd, 400, "Bad Request", "text/plain", "bad name");
        url = api + "search/autocomplete/" + url_encode(q);
      } else {
        const std::string id = query_value(query, "id"), page = query_value(query, "page");
        bool num = !id.empty() && id.size() < 12;
        for (char c : id + page)
          if (c < '0' || c > '9')
            num = false;
        if (!num || (fmt != "2x3" && fmt != "1x1" && fmt != "92x43" && fmt != "16x9" && fmt != "logo"))
          return reply(fd, 400, "Bad Request", "text/plain", "bad game or format");
        /* anim=1 -> only the animated pictures (Steam Deck style:
           animated WebP or APNG on SteamGridDB) */
        const bool anim = query_value(query, "anim") == "1";
        const std::string kind = anim ? "&types=animated&mimes=image/webp,image/png"
                                      : "&types=static&mimes=image/png,image/jpeg";
        /* 16x9: game backgrounds from the heroes. every size and
           PNG or JPEG (asked for 3840x1240/1920x620 PNG only and
           many games had none); the editor makes the 1920x1080 picture */
        if (fmt == "16x9")
          url = api + "heroes/game/" + id + "?nsfw=false&humor=any&limit=12" + kind;
        /* game logos (transparent PNG; the editor trims them and
           uploads <ID>_logo_<n>.png to customtile) */
        else if (fmt == "logo")
          url = api + "logos/game/" + id + "?nsfw=false&humor=any&limit=12" +
                (anim ? kind : "&types=static&mimes=image/png");
        else
          /* 92x43 = the Steam horizontal capsule (460x215 / 920x430) */
          url = api + "grids/game/" + id + "?dimensions=" +
                (fmt == "2x3" ? "600x900" : fmt == "92x43" ? "460x215,920x430" : "512x512,1024x1024") +
                "&nsfw=false&humor=any&limit=12" + kind;
        url += page.empty() ? "" : "&page=" + page;
      }
      if (!zt_sgdb_get(url, key, out, http, err, 4u << 20))
        return reply(fd, 502, "Bad Gateway", "text/plain", "SteamGridDB: " + err);
      return reply(fd, http == 200 ? 200 : 502, http == 200 ? "OK" : "Bad Gateway", "application/json", out);
    }
    if ((method == "GET" && path == "/sgdb/img") || (method == "POST" && path == "/sgdb/save")) {
      url = query_value(query, "u");
      const size_t dot = url.rfind('.');
      std::string ext = dot == std::string::npos ? "" : url.substr(dot + 1);
      for (char &c : ext)
        c = (char)tolower((unsigned char)c);
      if (ext == "jpeg")
        ext = "jpg";
      /* the animated pictures (webp, and their thumbnails) are only
         shown in the editor; the editor sends the PS5 a PNG */
      const bool anim_ext = ext == "webp" || ext == "gif" || ext == "webm" || ext == "mp4";
      if (ext != "png" && ext != "jpg" && !(anim_ext && path == "/sgdb/img"))
        return reply(fd, 400, "Bad Request", "text/plain", "png or jpg pictures only");
      if (path == "/sgdb/img") {
        /* also the full picture (the editor cuts the 16:9 background from it) */
        const char *mime = ext == "png" ? "image/png" : ext == "jpg" ? "image/jpeg" : ext == "webp" ? "image/webp"
                         : ext == "gif" ? "image/gif" : ext == "webm" ? "video/webm" : "video/mp4";
        if (!zt_sgdb_get(url, "", out, http, err, 24u << 20) || http != 200) {
          /* bigger (animated heroes): through a file, sent in pieces */
          if (err != "answer too large")
            return reply(fd, 502, "Bad Gateway", "text/plain", "SteamGridDB: " + (err.empty() ? std::to_string(http) : err));
          static int big_n = 0;
          zt_mkdirs(ZT_CACHE);
          const std::string tmp = std::string(ZT_CACHE "/sgdb_big_") + std::to_string(++big_n % 4) + ".tmp";
          size_t size = 0;
          err.clear();
          if (!zt_sgdb_get_file(url, tmp, size, http, err, 400u << 20) || http != 200) {
            unlink(tmp.c_str());
            return reply(fd, 502, "Bad Gateway", "text/plain", "SteamGridDB: " + (err.empty() ? std::to_string(http) : err));
          }
          zt_log("sgdb: big picture %zu bytes through %s", size, tmp.c_str());
          char head[256];
          const int hn = snprintf(head, sizeof(head),
                                  "HTTP/1.0 200 OK\r\nContent-Type: %s\r\nContent-Length: %zu\r\n"
                                  "Cache-Control: no-store\r\nConnection: close\r\n\r\n", mime, size);
          const int bf = open(tmp.c_str(), O_RDONLY);
          bool ok = bf >= 0 && hn > 0 && send_all(fd, head, (size_t)hn);
          std::vector<char> chunk(256u << 10);
          while (ok) {
            const ssize_t n = read(bf, chunk.data(), chunk.size());
            if (n <= 0)
              break;
            ok = send_all(fd, chunk.data(), (size_t)n);
          }
          if (bf >= 0)
            close(bf);
          unlink(tmp.c_str());
          return;
        }
        return reply(fd, 200, "OK", mime, out);
      }
      std::string id = query_value(query, "id");
      bool ok_id = id.size() == 9;
      for (size_t i = 0; ok_id && i < 9; ++i)
        ok_id = i < 4 ? isalpha((unsigned char)id[i]) : isdigit((unsigned char)id[i]);
      if (!ok_id || (fmt != "2x3" && fmt != "1x1" && fmt != "92x43" && fmt != "16x9"))
        return reply(fd, 400, "Bad Request", "text/plain", "bad title id or format");
      if (fmt == "16x9" && ext != "png")
        return reply(fd, 400, "Bad Request", "text/plain", "png heroes only");
      for (char &c : id)
        c = (char)toupper((unsigned char)c);
      if (!zt_sgdb_get(url, "", out, http, err, 24u << 20) || http != 200 || out.empty())
        return reply(fd, 502, "Bad Gateway", "text/plain", "SteamGridDB: " + (err.empty() ? std::to_string(http) : err));
      /* the next n of this game and format (any extension, any case);
         backgrounds (16x9) go to custombg */
      const std::string dir = fmt == "16x9" ? ZT_CUSTOMBG : ZT_CUSTOMTILE;
      zt_mkdirs(dir);
      int max = 0;
      const std::string pre = id + "_" + fmt + "_";
      if (DIR *d = opendir(dir.c_str())) {
        while (dirent *e = readdir(d))
          if (strncasecmp(e->d_name, pre.c_str(), pre.size()) == 0)
            max = std::max(max, atoi(e->d_name + pre.size()));
        closedir(d);
      }
      const std::string name = pre + std::to_string(max + 1) + "." + ext;
      const std::string dest = dir + "/" + name, temp = dest + (fmt == "16x9" ? ".hero" : ".part");
      const int lf = open(temp.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0666);
      bool ok = lf >= 0;
      for (size_t off = 0; ok && off < out.size();) {
        const ssize_t n = write(lf, out.data() + off, out.size() - off);
        ok = n > 0;
        off += ok ? (size_t)n : 0;
      }
      if (lf >= 0)
        close(lf);
      /* a hero becomes the 1920x1080 background (written straight to dest) */
      /* pos = where the 16:9 window of the zoomed hero sits (editor) */
      const std::string pos = query_value(query, "pos");
      ok = ok && (fmt == "16x9" ? zt_hero_background(temp, dest, pos.empty() ? 0.5 : atof(pos.c_str()))
                                : rename(temp.c_str(), dest.c_str()) == 0);
      if (fmt == "16x9")
        unlink(temp.c_str());
      zt_log("sgdb: %s %s (%zu bytes)", name.c_str(), ok ? "saved" : "NOT saved", out.size());
      if (!ok) {
        unlink(temp.c_str());
        return reply(fd, 500, "Error", "text/plain", "cannot write " + name);
      }
      return reply(fd, 200, "OK", "text/plain", name);
    }
    return reply(fd, 404, "Not Found", "text/plain", "not found");
  }
  /* POST /avatar/delete?name=<file>: one file of <dir>/avatars */
  if (method == "POST" && path == "/avatar/delete") {
    const std::string name = query.rfind("name=", 0) == 0 ? query.substr(5) : "";
    bool ok_name = !name.empty() && name.size() < 80 && name[0] != '.';
    for (char c : name)
      if (!(isalnum((unsigned char)c) || c == '.' || c == '-' || c == '_'))
        ok_name = false;
    if (!ok_name)
      return reply(fd, 400, "Bad Request", "text/plain", "invalid name");
    const bool gone = unlink((std::string(ZT_AVATARS "/") + name).c_str()) == 0;
    zt_log("web: avatar %s %s", name.c_str(), gone ? "deleted" : "NOT deleted");
    return gone ? reply(fd, 200, "OK", "text/plain", "deleted") : reply(fd, 404, "Not Found", "text/plain", "missing");
  }
  /* GET /customtile?name=<file>: one picture of <dir>/customtile (the
     editor's Tiles tab shows them); /custombg the same for the game
     backgrounds. POST /customtile/delete?name=, /custombg/delete?name=
     remove one */
  if ((method == "GET" && (path == "/customtile" || path == "/custombg")) ||
      (method == "POST" && (path == "/customtile/delete" || path == "/custombg/delete"))) {
    const bool bg = path.rfind("/custombg", 0) == 0;
    const std::string name = query.rfind("name=", 0) == 0 ? query.substr(5) : "";
    bool ok_name = !name.empty() && name.size() < 80 && name[0] != '.';
    for (char c : name)
      if (!(isalnum((unsigned char)c) || c == '.' || c == '-' || c == '_'))
        ok_name = false;
    const size_t dot = name.rfind('.');
    std::string ext = dot == std::string::npos ? "" : name.substr(dot + 1);
    for (char &c : ext)
      c = (char)tolower((unsigned char)c);
    /* customtile <name>.mp4 = the animated version of <name>.png */
    if (!ok_name || (ext != "png" && ext != "jpg" && ext != "jpeg" && ext != "mp4"))
      return reply(fd, 400, "Bad Request", "text/plain", "pictures only");
    const std::string file = std::string(bg ? ZT_CUSTOMBG "/" : ZT_CUSTOMTILE "/") + name;
    if (method == "POST") {
      const bool gone = unlink(file.c_str()) == 0;
      zt_log("web: %s %s %s", bg ? "custombg" : "customtile", name.c_str(), gone ? "deleted" : "NOT deleted");
      return gone ? reply(fd, 200, "OK", "text/plain", "deleted") : reply(fd, 404, "Not Found", "text/plain", "missing");
    }
    const std::string data = read_file(file.c_str());
    if (data.empty())
      return reply(fd, 404, "Not Found", "text/plain", "missing");
    return reply(fd, 200, "OK", ext == "png" ? "image/png" : ext == "mp4" ? "video/mp4" : "image/jpeg", data);
  }
  /* GET /fonts, GET /backgrounds, GET /customtiles: the files sent
     above, as a JSON list of names */
  if (method == "GET" && (path == "/fonts" || path == "/backgrounds" || path == "/customtiles" || path == "/custombgs")) {
    std::string json = "[";
    /* /backgrounds?kind=wallpapers|icons|folders (wallpapers when left out) */
    const std::string kind = query_value(query, "kind");
    /* wallpapers, icons, fonts of the active theme (&theme= another one) */
    const std::string theme = query_value(query, "theme");
    const std::string tn = zt_theme_name_ok(theme) ? theme : std::string();
    const std::string dir = path == "/customtiles" ? std::string(ZT_CUSTOMTILE) : path == "/custombgs" ? std::string(ZT_CUSTOMBG)
                          : path == "/fonts" ? zt_theme_dir_of(tn, "fonts")
                          : kind == "icons" ? zt_theme_dir_of(tn, "icons") : kind == "folders" ? std::string(ZT_FOLDERS)
                          : kind == "avatars" ? std::string(ZT_AVATARS)
                          : kind == "mosaics" ? std::string(ZT_CACHE_MOSAICS) : zt_theme_dir_of(tn, "wallpapers");
    if (DIR *d = opendir(dir.c_str())) {
      while (dirent *e = readdir(d)) {
        const std::string name = e->d_name;
        if (name[0] == '.' || name.find_first_of("\"\\") != std::string::npos ||
            (name.size() > 5 && name.compare(name.size() - 5, 5, ".part") == 0))
          continue;
        json += (json.size() > 1 ? ",\"" : "\"") + name + "\"";
      }
      closedir(d);
    }
    return reply(fd, 200, "OK", "application/json", json + "]");
  }
  if (method == "POST" && path == "/quit") {
    const int n = theme_unload();
    g_web_quit = true;
    video_stop();
    /* /asset threads stop at their next piece (5 s send timeout at most)
       before this module's code goes away */
    for (int i = 0; i < 70; ++i) {
      pthread_mutex_lock(&g_asset_lock);
      const int left = g_asset_clients;
      pthread_mutex_unlock(&g_asset_lock);
      if (left == 0)
        break;
      usleep(100000);
    }
    return reply(fd, 200, "OK", "text/plain", "bye " + std::to_string(n));
  }
  /*
   * GET /system/fonts: every font folder ShellUI can see. /system/common
   * cannot be listed from ShellUI, but it opens its fonts through its own
   * sandbox mount ("/<random>/common/font/..."): every top folder is tried
   * with common/font, common/font2, common_ex/font, common_ex/font2.
   * GET /system/f/<path> downloads one of them (only paths
   * with "/font" and a font extension).
   */
  if (method == "GET" && path == "/system/fonts") {
    std::string html = "<!doctype html><meta charset=utf-8><title>PS5 fonts</title>"
                       "<body style='font-family:sans-serif;background:#111;color:#eee'>"
                       "<h2>Fonts ShellUI can read</h2>";
    static const char *const subs[] = {"common/font", "common/font2", "common_ex/font",
                                       "common_ex/font2"};
    int found = 0;
    std::vector<std::string> roots = {"/system", "/system_ex", "/preinst"};
    if (DIR *top = opendir("/")) {
      while (dirent *e = readdir(top))
        if (e->d_name[0] != '.')
          roots.push_back(std::string("/") + e->d_name);
      closedir(top);
    }
    for (const std::string &root : roots)
      for (const char *sub : subs) {
        const std::string dir = root + "/" + sub;
        DIR *d = opendir(dir.c_str());
        if (!d)
          continue;
        html += "<h3>" + dir + "</h3><ul>";
        while (dirent *e = readdir(d)) {
          if (e->d_name[0] == '.')
            continue;
          const std::string file = dir + "/" + e->d_name;
          struct stat st = {};
          stat(file.c_str(), &st);
          html += "<li><a style='color:#6cf' href='/system/f" + file + "'>" +
                  e->d_name + "</a> (" + std::to_string((long)st.st_size) + " bytes)</li>";
          ++found;
        }
        closedir(d);
        html += "</ul>";
      }
    if (!found)
      html += "<p>No font folder is accessible.</p>";
    return reply(fd, 200, "OK", "text/html; charset=utf-8", html);
  }
  /* /system/f/<path>: the browser saves it with the font's own name */
  if (method == "GET" && path.rfind("/system/f/", 0) == 0) {
    const std::string file = path.substr(9);
    const size_t dot = file.rfind('.');
    const std::string ext = dot == std::string::npos ? "" : file.substr(dot);
    const bool font_ext = ext == ".otf" || ext == ".ttf" || ext == ".ttc" || ext == ".pfb";
    if (file.find("/font") == std::string::npos || !font_ext ||
        file.find("..") != std::string::npos)
      return reply(fd, 400, "Bad Request", "text/plain", "font files only");
    const std::string data = read_file(file.c_str());
    if (data.empty())
      return reply(fd, 404, "Not Found", "text/plain", "no access");
    return reply(fd, 200, "OK", "application/octet-stream", data);
  }
  /* GET /games: the Games row (folders tab of the editor) */
  if (method == "GET" && path == "/games")
    return reply(fd, 200, "OK", "application/json; charset=utf-8", theme_games());
  /* GET /icon?p=/user/app/<id>/sce_sys/icon0.png: a tile icon for the editor
     (only .png under the app folders) */
  if (method == "GET" && path == "/icon") {
    const std::string file = query.rfind("p=", 0) == 0 ? query.substr(2) : "";
    const bool app_dir = file.rfind("/user/app/", 0) == 0 || file.rfind("/user/appmeta/", 0) == 0 ||
                         file.rfind("/system_ex/rnps/apps/", 0) == 0;
    const bool png = file.size() > 4 && file.compare(file.size() - 4, 4, ".png") == 0;
    if (!app_dir || !png || file.find("..") != std::string::npos)
      return reply(fd, 400, "Bad Request", "text/plain", "app icons only");
    const std::string data = read_file(file.c_str());
    if (data.empty())
      return reply(fd, 404, "Not Found", "text/plain", "no access");
    return reply(fd, 200, "OK", "image/png", data);
  }
  /* the system's icon font (controller buttons), to read its glyph codes */
  if (method == "GET" && path == "/system/PS4Icon.ttf") {
    const std::string font = read_file("/system_ex/common_ex/font2/PS4Icon.ttf");
    if (font.empty())
      return reply(fd, 404, "Not Found", "text/plain", "no access");
    return reply(fd, 200, "OK", "font/ttf", font);
  }
  if (method == "GET" && path == "/version") {
    /* which build, when this copy started and its hooks: after sending a
       new ELF the start time must change, hooks stay the same count and
       "doubles" must be 0 (the old copy left) */
    int hooks = 0, doubles = 0;
    theme_status(&hooks, &doubles);
    char text[240];
    const long ago = (long)(time(nullptr) - g_started);
    struct tm at = {};
    gmtime_r(&g_started, &at);
    snprintf(text, sizeof(text),
             "%s " ZT_VERSION " (build " ZT_BUILD_TEXT ") %s %s | started %02d:%02d:%02d UTC, %ld min %ld s ago | hooks=%d doubles=%d",
#if defined(ZHITHEMES) && ZHITHEMES
             "zhithemes",
#else
             "onionhen",
#endif
             __DATE__, __TIME__, at.tm_hour, at.tm_min, at.tm_sec, ago / 60, ago % 60,
             hooks, doubles);
    return reply(fd, 200, "OK", "text/plain", text);
  }
  /* GET /asset?kind=wallpapers|icons|fonts&name=x: one file the theme uses,
     for the editor's theme pack (Download); sent a piece at a time (videos
     can be big). Older files may still be in backgrounds/. */
  if (method == "GET" && path == "/asset") {
    const std::string kind = query_value(query, "kind");
    const std::string name = url_decode(query_value(query, "name"));
    bool ok_name = !name.empty() && name.size() < 80 && name[0] != '.';
    for (char c : name)
      if (!(isalnum((unsigned char)c) || c == '.' || c == '-' || c == '_'))
        ok_name = false;
    const std::string dir = kind == "wallpapers" || kind == "icons" || kind == "fonts" ? zt_theme_dir(kind.c_str())
                          : kind == "avatars" ? std::string(ZT_AVATARS) : std::string();
    if (!ok_name || dir.empty())
      return reply(fd, 400, "Bad Request", "text/plain", "invalid kind or name");
    std::string file = dir + "/" + name;
    int in = open(file.c_str(), O_RDONLY);
    if (in < 0 && kind != "fonts")
      in = open((std::string(ZT_LEGACY "/") + name).c_str(), O_RDONLY);
    struct stat st;
    if (in < 0 || fstat(in, &st) != 0) {
      if (in >= 0)
        close(in);
      return reply(fd, 404, "Not Found", "text/plain", "no such file");
    }
    char head[256];
    const int n = snprintf(head, sizeof(head),
                           "HTTP/1.0 200 OK\r\n"
                           "Content-Type: application/octet-stream\r\n"
                           "Content-Length: %lld\r\n"
                           "Cache-Control: no-store\r\n"
                           "Connection: close\r\n\r\n",
                           (long long)st.st_size);
    /* sent from a thread of its own: the editor's Visual tab asks for
       the wallpaper video here (tens of MB, the browser reads it slowly) and
       everything else (Use theme, Apply…) waited behind it */
    auto *job = new AssetJob{fd, in, n > 0 ? std::string(head, (size_t)n) : std::string()};
    pthread_t t;
    pthread_mutex_lock(&g_asset_lock);
    const bool room = g_asset_clients < 4;
    if (room)
      ++g_asset_clients;
    pthread_mutex_unlock(&g_asset_lock);
    if (room && pthread_create(&t, nullptr, asset_client, job) == 0) {
      pthread_detach(t);
      g_fd_taken = true;
      return;
    }
    if (room) {
      pthread_mutex_lock(&g_asset_lock);
      --g_asset_clients;
      pthread_mutex_unlock(&g_asset_lock);
    }
    job->fd = -1; /* sent here; the server thread closes fd */
    asset_send(fd, *job);
    delete job;
    return;
  }
  if (method == "GET" && path == "/sysinfo")
    return reply(fd, 200, "OK", "application/json", zt_sysinfo_json());
  if (method == "GET" && path == "/logs")
    return reply(fd, 200, "OK", "application/json", zt_log_list_json());
  if (method == "GET" && path == "/logs/file") {
    const std::string name = url_decode(query_value(query, "name"));
    const std::string file = zt_log_path(name);
    if (file.empty())
      return reply(fd, 404, "Not Found", "text/plain", "no such log");
    const std::string data = read_file(file.c_str());
    char head[384];
    const int n = snprintf(head, sizeof(head),
                           "HTTP/1.0 200 OK\r\n"
                           "Content-Type: text/plain; charset=utf-8\r\n"
                           "Content-Disposition: attachment; filename=\"%s\"\r\n"
                           "Content-Length: %zu\r\n"
                           "Cache-Control: no-store\r\n"
                           "Connection: close\r\n\r\n",
                           name.c_str(), data.size());
    if (n > 0 && send_all(fd, head, (size_t)n))
      send_all(fd, data.data(), data.size());
    return;
  }
  if (method == "POST" && path == "/logs/delete") {
    const std::string name = url_decode(query_value(query, "name"));
    const std::string file = zt_log_path(name);
    if (file.empty() || name == "zhithemes.log" || name == "debug.on" || name == "session.open")
      return reply(fd, 400, "Bad Request", "text/plain", "cannot delete that");
    unlink(file.c_str());
    return reply(fd, 200, "OK", "text/plain", "deleted");
  }
  if (method == "POST" && path == "/debug") {
    const bool on = query_value(query, "on") == "1";
    const bool sys = query_value(query, "sys") == "1";
    const std::string saved = zt_debug_set(on, sys);
    /* the Home and the hub run theme.js again, with the new __ztDebug */
    shellui_request_hub_reload();
    shellui_request_home_reload();
    return reply(fd, 200, "OK", "application/json",
                 std::string("{\"debug\":") + (on ? "true" : "false") + ",\"saved\":\"" + saved + "\"}");
  }
  /* seconds the payload's watcher waits after a ShellUI restart before
     injecting again (inject_delay, read by the watcher each time; 15 when
     missing) */
  if ((method == "GET" || method == "POST") && path == "/injectdelay") {
    const std::string file = ZT_DIR "/inject_delay";
    if (method == "POST") {
      int s = atoi(query_value(query, "s").c_str());
      s = s < 5 ? 5 : s > 120 ? 120 : s;
      const int out = open(file.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0666);
      if (out >= 0) {
        const std::string text = std::to_string(s);
        (void)write(out, text.data(), text.size());
        close(out);
      }
      zt_log("web: inject delay %d s", s);
    }
    int s = atoi(read_file(file.c_str()).c_str());
    if (s < 5 || s > 120)
      s = 15;
    return reply(fd, 200, "OK", "application/json", "{\"seconds\":" + std::to_string(s) + "}");
  }
  if (method == "POST" && path == "/log/clear") {
    const int lf = open(kLogPath, O_WRONLY | O_TRUNC);
    if (lf >= 0)
      close(lf);
    return reply(fd, 200, "OK", "text/plain", "cleared");
  }
  reply(fd, 404, "Not Found", "text/plain", "not found");
}

/* port 4444, or -1 (logged once per kind of failure) */
int open_server(int *last_error) {
  const int srv = socket(AF_INET, SOCK_STREAM, 0);
  if (srv < 0) {
    if (*last_error != errno)
      zt_log("web: socket failed (errno %d); retrying", errno);
    *last_error = errno;
    return -1;
  }
  const int one = 1;
  setsockopt(srv, SOL_SOCKET, SO_REUSEADDR, &one, sizeof(one));
  sockaddr_in addr = {};
  addr.sin_family = AF_INET;
  addr.sin_port = htons(kPort);
  addr.sin_addr.s_addr = htonl(INADDR_ANY);
  if (bind(srv, reinterpret_cast<sockaddr *>(&addr), sizeof(addr)) != 0 ||
      listen(srv, 4) != 0) {
    if (*last_error != errno)
      zt_log("web: cannot listen on port %d (errno %d); retrying", kPort,
                     errno);
    *last_error = errno;
    close(srv);
    return -1;
  }
  *last_error = 0;
  zt_log("web: theme editor on port %d", kPort);
  return srv;
}

/*
 * The editor must stay reachable: without it the watcher cannot ask this
 * module to leave, and a new one went in on top of it (double hooks, the
 * ShellUI fell). After a ShellUI restart accept() failed once with errno 163
 * and the server used to stop for good; now the socket is made again.
 */
void *server_thread(void *) {
  int last_error = 0;
  while (!g_web_quit) {
    const int srv = open_server(&last_error);
    if (srv < 0) {
      sleep(2);
      continue;
    }
    for (;;) {
      const int fd = accept(srv, nullptr, nullptr);
      if (fd < 0) {
        if (errno == EINTR)
          continue;
        zt_log("web: accept failed (errno %d); a reabrir a porta", errno);
        break;
      }
      timeval tv = {5, 0};
      setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv));
      setsockopt(fd, SOL_SOCKET, SO_SNDTIMEO, &tv, sizeof(tv));
      g_fd_taken = false;
      handle(fd);
      if (!g_fd_taken)
        close(fd);
      g_fd_taken = false;
      if (g_web_quit)
        break; /* frees port 4444 for the new module */
    }
    close(srv);
    if (!g_web_quit)
      sleep(1);
  }
  return nullptr;
}

/*
 * Video wallpaper: the Home's RCTVideoPS (ReactVideoView -> Sce.Vsh.VideoPlayer)
 * plays http URIs, so the .mp4 files of backgrounds/ are served on
 * 127.0.0.1:4445 (only this console):
 *
 *   GET|HEAD /v/<name>.mp4   whole file (200) or a byte range (206)
 *
 * One thread per connection (the player opens several and reads them
 * slowly); each one ends when the player goes, after 30 s without reading,
 * or when this module leaves (POST /quit).
 */
constexpr int kVideoPort = 4445;
constexpr int kVideoMaxClients = 8;
int g_video_clients = 0;
pthread_mutex_t g_video_lock = PTHREAD_MUTEX_INITIALIZER;
/* accept() on the PS5 does not time out (SO_RCVTIMEO is ignored), so
   after POST /quit the old module's video server kept port 4445 until the
   next request (log: the new module's player got "missing" from the old
   one, 30 s after the quit, and the wallpaper video started ~12 s late) */
volatile bool g_video_running = false;
int g_video_logs = 0;

void video_log(const char *what, const std::string &name, long long a, long long b,
               long long size) {
  pthread_mutex_lock(&g_video_lock);
  const bool show = g_video_logs < 40;
  g_video_logs += show;
  pthread_mutex_unlock(&g_video_lock);
  if (show)
    zt_log("video: %s %s bytes %lld-%lld of %lld", what, name.c_str(), a, b, size);
}

void video_handle(int fd) {
  std::string req;
  char buf[4096];
  while (req.find("\r\n\r\n") == std::string::npos && req.size() < kMaxHeader) {
    const ssize_t n = recv(fd, buf, sizeof(buf), 0);
    if (n <= 0)
      return;
    req.append(buf, (size_t)n);
  }
  const size_t sp1 = req.find(' ');
  const size_t sp2 = sp1 == std::string::npos ? sp1 : req.find(' ', sp1 + 1);
  if (sp2 == std::string::npos)
    return reply(fd, 400, "Bad Request", "text/plain", "bad request");
  const std::string method = req.substr(0, sp1);
  std::string path = req.substr(sp1 + 1, sp2 - sp1 - 1);
  path = path.substr(0, path.find('?'));
  const bool head_only = method == "HEAD";
  /* /t/<name>.mp4 = an animated custom tile (customtile/); /b/<name>.mp4 = an animated game background (custombg/) */
  const bool tile = path.rfind("/t/", 0) == 0, gbg = path.rfind("/b/", 0) == 0;
  if ((method != "GET" && !head_only) || (path.rfind("/v/", 0) != 0 && !tile && !gbg))
    return reply(fd, 404, "Not Found", "text/plain", "not found");
  const std::string name = path.substr(3);
  bool ok_name = !name.empty() && name.size() < 80 && name[0] != '.';
  for (char c : name)
    if (!(isalnum((unsigned char)c) || c == '.' || c == '-' || c == '_'))
      ok_name = false;
  int vf = ok_name ? open(((tile ? std::string(ZT_CUSTOMTILE) : gbg ? std::string(ZT_CUSTOMBG) : zt_theme_dir("wallpapers")) + "/" + name).c_str(),
                           O_RDONLY) : -1;
  if (ok_name && vf < 0 && !tile && !gbg) /* not moved yet */
    vf = open((std::string(ZT_LEGACY "/") + name).c_str(), O_RDONLY);
  struct stat st = {};
  if (vf < 0 || fstat(vf, &st) != 0 || st.st_size <= 0) {
    if (vf >= 0)
      close(vf);
    video_log("missing", name, 0, 0, 0);
    return reply(fd, 404, "Not Found", "text/plain", "no such video");
  }
  const long long size = (long long)st.st_size;
  long long first = 0, last = size - 1;
  bool ranged = false;
  /* Range: bytes=a-b | bytes=a- | bytes=-n (one range only) */
  for (size_t at = 0; (at = req.find("\r\n", at)) != std::string::npos;) {
    at += 2;
    if (strncasecmp(req.c_str() + at, "Range:", 6) != 0)
      continue;
    const char *r = strstr(req.c_str() + at, "bytes=");
    if (!r)
      break;
    r += 6;
    char *end = nullptr;
    if (*r == '-') {
      const long long n = strtoll(r + 1, &end, 10);
      if (n > 0) {
        first = n < size ? size - n : 0;
        ranged = true;
      }
    } else {
      first = strtoll(r, &end, 10);
      if (end && *end == '-') {
        ranged = true;
        if (isdigit((unsigned char)end[1]))
          last = strtoll(end + 1, nullptr, 10);
      }
    }
    break;
  }
  if (last >= size)
    last = size - 1;
  if (ranged && (first < 0 || first >= size || first > last)) {
    close(vf);
    char head[160];
    const int n = snprintf(head, sizeof(head),
                           "HTTP/1.1 416 Range Not Satisfiable\r\n"
                           "Content-Range: bytes */%lld\r\nContent-Length: 0\r\n"
                           "Connection: close\r\n\r\n", size);
    send_all(fd, head, (size_t)n);
    return;
  }
  char head[400];
  const long long length = last - first + 1;
  const int hn = ranged
      ? snprintf(head, sizeof(head),
                 "HTTP/1.1 206 Partial Content\r\nContent-Type: video/mp4\r\n"
                 "Accept-Ranges: bytes\r\nContent-Range: bytes %lld-%lld/%lld\r\n"
                 "Content-Length: %lld\r\nConnection: close\r\n\r\n",
                 first, last, size, length)
      : snprintf(head, sizeof(head),
                 "HTTP/1.1 200 OK\r\nContent-Type: video/mp4\r\nAccept-Ranges: bytes\r\n"
                 "Content-Length: %lld\r\nConnection: close\r\n\r\n", size);
  video_log(head_only ? "head" : "send", name, first, last, size);
  bool ok = send_all(fd, head, (size_t)hn);
  std::vector<char> chunk(256u << 10);
  for (long long at = first; ok && !head_only && at <= last && !g_web_quit;) {
    const size_t want = (size_t)(last - at + 1 < (long long)chunk.size() ? last - at + 1
                                                                       : (long long)chunk.size());
    const ssize_t n = pread(vf, chunk.data(), want, (off_t)at);
    if (n <= 0)
      break;
    ok = send_all(fd, chunk.data(), (size_t)n);
    at += n;
  }
  close(vf);
}

void *video_client(void *arg) {
  const int fd = (int)(intptr_t)arg;
  video_handle(fd);
  close(fd);
  pthread_mutex_lock(&g_video_lock);
  --g_video_clients;
  pthread_mutex_unlock(&g_video_lock);
  return nullptr;
}

void *video_server(void *) {
  g_video_running = true;
  bool told = false;
  while (!g_web_quit) {
    const int srv = socket(AF_INET, SOCK_STREAM, 0);
    const int one = 1;
    sockaddr_in addr = {};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(kVideoPort);
    addr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    if (srv >= 0)
      setsockopt(srv, SOL_SOCKET, SO_REUSEADDR, &one, sizeof(one));
    if (srv < 0 || bind(srv, reinterpret_cast<sockaddr *>(&addr), sizeof(addr)) != 0 ||
        listen(srv, 8) != 0) {
      if (!told)
        zt_log("video: cannot listen on 127.0.0.1:%d (errno %d); retrying",
                       kVideoPort, errno);
      told = true;
      if (srv >= 0)
        close(srv);
      sleep(2);
      continue;
    }
    zt_log("video: wallpaper videos on 127.0.0.1:%d", kVideoPort);
    told = false;
    /* accept with a 1 s timeout, so POST /quit frees the port */
    timeval wait = {1, 0};
    setsockopt(srv, SOL_SOCKET, SO_RCVTIMEO, &wait, sizeof(wait));
    while (!g_web_quit) {
      const int fd = accept(srv, nullptr, nullptr);
      if (fd < 0) {
        if (errno == EINTR || errno == EAGAIN || errno == EWOULDBLOCK)
          continue;
        zt_log("video: accept failed (errno %d); a reabrir a porta", errno);
        break;
      }
      if (g_web_quit) { /* the wake-up connection of video_stop() */
        close(fd);
        break;
      }
      pthread_mutex_lock(&g_video_lock);
      const bool room = g_video_clients < kVideoMaxClients;
      g_video_clients += room;
      pthread_mutex_unlock(&g_video_lock);
      if (!room) {
        close(fd);
        continue;
      }
      timeval tv = {30, 0};
      setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv));
      setsockopt(fd, SOL_SOCKET, SO_SNDTIMEO, &tv, sizeof(tv));
      pthread_t client;
      if (pthread_create(&client, nullptr, video_client, (void *)(intptr_t)fd) != 0) {
        close(fd);
        pthread_mutex_lock(&g_video_lock);
        --g_video_clients;
        pthread_mutex_unlock(&g_video_lock);
        continue;
      }
      pthread_detach(client);
    }
    close(srv);
  }
  g_video_running = false;
  return nullptr;
}

/* wakes the accept() of the video server (a connection to itself) and waits
   up to 3 s for it and its clients to stop */
void video_stop() {
  for (int i = 0; i < 30; ++i) {
    pthread_mutex_lock(&g_video_lock);
    const int clients = g_video_clients;
    pthread_mutex_unlock(&g_video_lock);
    if (!g_video_running && clients == 0)
      break;
    if (g_video_running) {
      const int c = socket(AF_INET, SOCK_STREAM, 0);
      if (c >= 0) {
        sockaddr_in addr = {};
        addr.sin_family = AF_INET;
        addr.sin_port = htons(kVideoPort);
        addr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
        timeval tv = {0, 300000};
        setsockopt(c, SOL_SOCKET, SO_SNDTIMEO, &tv, sizeof(tv));
        connect(c, reinterpret_cast<sockaddr *>(&addr), sizeof(addr));
        close(c);
      }
    }
    usleep(100000);
  }
  zt_log("video: server %s", g_video_running ? "still running after 3 s" : "stopped");
}

} // namespace

void theme_web_start() {
  pthread_t thread;
  if (pthread_create(&thread, nullptr, server_thread, nullptr) != 0) {
    zt_log("web: pthread_create failed (errno %d)", errno);
    return;
  }
  pthread_detach(thread);
  pthread_t video;
  if (pthread_create(&video, nullptr, video_server, nullptr) == 0)
    pthread_detach(video);
  else
    zt_log("video: pthread_create failed (errno %d)", errno);
}

/* `key: '...'` of the THEME block in theme.ztheme gets value (added at the
   top of the block when missing). The Home's Options menu writes the folders
   this way. */
bool theme_set_field(const std::string &key, const std::string &value) {
  return theme_set_field_in(zt_theme_file(), key, value);
}

bool theme_set_field_in(const std::string &file, const std::string &key, const std::string &value) {
  std::string src = read_file(file.c_str());
  const size_t th = src.find("var THEME");
  if (src.empty() || th == std::string::npos)
    return false;
  size_t block_end = src.find("\n  };", th);
  if (block_end == std::string::npos)
    block_end = src.size();
  auto ident = [](char c) { return isalnum((unsigned char)c) || c == '_'; };
  for (size_t at = th; (at = src.find(key, at)) != std::string::npos && at < block_end;) {
    size_t p = at + key.size();
    const bool word = !ident(src[at - 1]) && (p >= src.size() || !ident(src[p]));
    at = p;
    if (!word)
      continue;
    while (p < src.size() && isspace((unsigned char)src[p]))
      ++p;
    if (p >= src.size() || src[p] != ':')
      continue;
    ++p;
    while (p < src.size() && isspace((unsigned char)src[p]))
      ++p;
    if (p >= src.size() || src[p] != '\'')
      continue;
    size_t end = p + 1;
    while (end < src.size() && src[end] != '\'' && src[end] != '\n')
      end += src[end] == '\\' ? 2 : 1;
    if (end >= src.size() || src[end] != '\'')
      return false;
    src.replace(p + 1, end - p - 1, value);
    return write_script(src, file);
  }
  const size_t brace = src.find('{', th);
  if (brace == std::string::npos)
    return false;
  src.insert(brace + 1, "\n    " + key + ": '" + value + "',");
  return write_script(src, file);
}

#else

void theme_web_start() {}
bool theme_set_field(const std::string &, const std::string &) { return false; }
bool theme_set_field_in(const std::string &, const std::string &, const std::string &) { return false; }

#endif /* SHELLUI_THEME_WEB == 1 */
