/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/* themes dropped in /data/ZhiThemes/Install (FTP, USB copy...) are
   installed when the module starts, the same way as the editor's Install:
   a .ztheme pack (ZIP: theme.ztheme, zhitheme.json, assets/<kind>/<file>)
   or the theme text alone. The theme becomes Themes/<name>.ztheme +
   Themes/<name>/{wallpapers,icons,fonts} (a theme with that name is
   replaced), the folders / custom tile choices of the theme in use are
   kept, and it becomes the theme in use. The file is then deleted from
   Install/; one that is not a theme becomes <file>.failed (kept, not tried
   again). */

#include "zt_storage.hpp"
#include "zt_log.hpp"
#include "external_symbols.hpp"

#include <ctype.h>
#include <dirent.h>
#include <errno.h>
#include <fcntl.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>
#include <zlib.h>

#include <pthread.h>

#include <algorithm>
#include <atomic>
#include <string>
#include <vector>

#define ZT_INSTALL ZT_DIR "/Install"

namespace {

const size_t kMaxText = 8u << 20;

bool ends_with(const std::string &s, const char *e) {
  const size_t n = strlen(e);
  return s.size() >= n && s.compare(s.size() - n, n, e) == 0;
}

uint16_t le16(const unsigned char *p) { return (uint16_t)(p[0] | p[1] << 8); }
uint32_t le32(const unsigned char *p) {
  return (uint32_t)p[0] | (uint32_t)p[1] << 8 | (uint32_t)p[2] << 16 | (uint32_t)p[3] << 24;
}

bool read_at(int fd, void *buf, size_t size, off_t at) {
  size_t got = 0;
  while (got < size) {
    const ssize_t n = pread(fd, (char *)buf + got, size - got, at + (off_t)got);
    if (n <= 0)
      return false;
    got += (size_t)n;
  }
  return true;
}

bool write_out(int fd, const char *data, size_t size) {
  for (size_t off = 0; off < size;) {
    const ssize_t n = write(fd, data + off, size - off);
    if (n <= 0)
      return false;
    off += (size_t)n;
  }
  return true;
}

/* the editor's foldHash (djb2 xor, base 36) */
std::string fold_hash(const std::string &t) {
  uint32_t h = 5381;
  for (unsigned char c : t)
    h = (h * 33) ^ c;
  std::string out;
  do {
    out.insert(out.begin(), "0123456789abcdefghijklmnopqrstuvwxyz"[h % 36]);
    h /= 36;
  } while (h);
  return out;
}

/* the editor's uploadName: a file name the PS5 accepts (A-Z a-z 0-9 . _ -,
   not starting with . _ -, at most 60 letters with a short hash) */
std::string upload_name(const std::string &name) {
  std::string n;
  for (unsigned char c : name) {
    const char k = isalnum(c) || c == '.' || c == '_' || c == '-' ? (char)c : '_';
    if (k == '_' && !n.empty() && n.back() == '_')
      continue;
    n += k;
  }
  size_t lead = 0;
  while (lead < n.size() && (n[lead] == '.' || n[lead] == '_' || n[lead] == '-'))
    ++lead;
  n.erase(0, lead);
  std::string ext;
  const size_t dot = n.rfind('.');
  if (dot != std::string::npos && n.size() - dot >= 2 && n.size() - dot <= 6) {
    bool ok = true;
    for (size_t i = dot + 1; i < n.size(); ++i)
      ok = ok && isalnum((unsigned char)n[i]);
    if (ok)
      ext = n.substr(dot);
  }
  std::string base = n.substr(0, n.size() - ext.size());
  if (n.size() > 60) {
    base = base.substr(0, 60 - ext.size() - 8);
    while (!base.empty() && (base.back() == '.' || base.back() == '_' || base.back() == '-'))
      base.pop_back();
    std::string h = "000000" + fold_hash(name);
    base += "_" + h.substr(h.size() - 6);
  }
  return (base.empty() ? "file" : base) + ext;
}

bool name_ok(const std::string &name) {
  if (name.empty() || name.size() >= 80 || name[0] == '.' || name[0] == '_' || name[0] == '-')
    return false;
  for (char c : name)
    if (!(isalnum((unsigned char)c) || c == '.' || c == '-' || c == '_'))
      return false;
  return true;
}

/* a theme name from any text: other letters become '-', at most 40 */
std::string theme_safe(const std::string &s) {
  std::string n;
  for (unsigned char c : s) {
    const char k = isalnum(c) || c == '.' || c == '_' || c == '-' ? (char)c : '-';
    if (k == '-' && !n.empty() && n.back() == '-')
      continue;
    n += k;
  }
  while (!n.empty() && (n[0] == '.' || n[0] == '-'))
    n.erase(0, 1);
  if (n.size() > 40)
    n.resize(40);
  while (!n.empty() && (n.back() == '-' || n.back() == '.'))
    n.pop_back();
  return zt_theme_name_ok(n) ? n : std::string();
}

/* 'value' of `key: '...'` (themeName) or of "key":"..." (zhitheme.json) */
std::string quoted_after(const std::string &text, const char *key, char quote) {
  const size_t at = text.find(key);
  if (at == std::string::npos)
    return std::string();
  const size_t colon = text.find(':', at + strlen(key));
  if (colon == std::string::npos)
    return std::string();
  size_t q1 = colon + 1;
  while (q1 < text.size() && (text[q1] == ' ' || text[q1] == '\t'))
    ++q1;
  if (q1 >= text.size() || text[q1] != quote)
    return std::string();
  const size_t q2 = text.find(quote, q1 + 1);
  if (q2 == std::string::npos || q2 - q1 > 80)
    return std::string();
  return text.substr(q1 + 1, q2 - q1 - 1);
}

bool is_theme_text(const std::string &t) { return t.find("var THEME") != std::string::npos; }

bool write_text(const std::string &file, const std::string &text) {
  const std::string temp = file + ".tmp";
  const int fd = open(temp.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (fd < 0)
    return false;
  bool ok = write_out(fd, text.data(), text.size()) && fsync(fd) == 0;
  close(fd);
  ok = ok && rename(temp.c_str(), file.c_str()) == 0;
  if (!ok)
    unlink(temp.c_str());
  return ok;
}

std::string read_text(const char *path) {
  std::string out;
  const int fd = open(path, O_RDONLY);
  if (fd < 0)
    return out;
  char buf[16384];
  ssize_t n;
  while (out.size() < kMaxText && (n = read(fd, buf, sizeof(buf))) > 0)
    out.append(buf, (size_t)n);
  close(fd);
  return out;
}

/* ---- ZIP (stored or deflated entries; the editor's packs are stored) ---- */
struct Entry {
  std::string name;
  uint16_t method = 0;
  uint32_t csize = 0, usize = 0, local = 0;
};

bool zip_list(int fd, off_t size, std::vector<Entry> &out) {
  const size_t tail = size < 65557 ? (size_t)size : 65557;
  if (tail < 22)
    return false;
  std::vector<unsigned char> t(tail);
  if (!read_at(fd, t.data(), tail, size - (off_t)tail))
    return false;
  long end = -1;
  for (long i = (long)tail - 22; i >= 0; --i)
    if (le32(&t[(size_t)i]) == 0x06054b50) {
      end = i;
      break;
    }
  if (end < 0)
    return false;
  const uint16_t count = le16(&t[(size_t)end + 10]);
  const uint32_t csize = le32(&t[(size_t)end + 12]), at = le32(&t[(size_t)end + 16]);
  if ((off_t)at + (off_t)csize > size || csize > (16u << 20))
    return false;
  std::vector<unsigned char> c(csize);
  if (!read_at(fd, c.data(), csize, at))
    return false;
  size_t p = 0;
  for (uint16_t n = 0; n < count; ++n) {
    if (p + 46 > c.size() || le32(&c[p]) != 0x02014b50)
      return false;
    Entry e;
    e.method = le16(&c[p + 10]);
    e.csize = le32(&c[p + 20]);
    e.usize = le32(&c[p + 24]);
    const uint16_t nlen = le16(&c[p + 28]), xlen = le16(&c[p + 30]), clen = le16(&c[p + 32]);
    e.local = le32(&c[p + 42]);
    if (p + 46 + nlen > c.size())
      return false;
    e.name.assign((const char *)&c[p + 46], nlen);
    p += 46 + (size_t)nlen + xlen + clen;
    if (!e.name.empty() && e.name.back() != '/')
      out.push_back(e);
  }
  return true;
}

/* the entry's bytes to `sink` a piece at a time (big videos never whole in memory) */
template <typename Sink> bool zip_read(int fd, const Entry &e, Sink sink) {
  unsigned char h[30];
  if (!read_at(fd, h, sizeof(h), e.local) || le32(h) != 0x04034b50)
    return false;
  off_t at = (off_t)e.local + 30 + le16(h + 26) + le16(h + 28);
  std::vector<unsigned char> in(256u << 10);
  uint32_t left = e.csize;
  if (e.method == 0) {
    while (left) {
      const size_t n = left < in.size() ? left : in.size();
      if (!read_at(fd, in.data(), n, at) || !sink((const char *)in.data(), n))
        return false;
      at += (off_t)n;
      left -= (uint32_t)n;
    }
    return true;
  }
  if (e.method != 8)
    return false;
  z_stream zs = {};
  if (inflateInit2(&zs, -15) != Z_OK)
    return false;
  std::vector<unsigned char> out(256u << 10);
  bool ok = true, done = false;
  while (ok && !done) {
    if (zs.avail_in == 0 && left) {
      const size_t n = left < in.size() ? left : in.size();
      ok = read_at(fd, in.data(), n, at);
      at += (off_t)n;
      left -= (uint32_t)n;
      zs.next_in = in.data();
      zs.avail_in = (uInt)n;
    }
    zs.next_out = out.data();
    zs.avail_out = (uInt)out.size();
    const int r = inflate(&zs, Z_NO_FLUSH);
    if (r != Z_OK && r != Z_STREAM_END)
      ok = false;
    const size_t made = out.size() - zs.avail_out;
    if (ok && made && !sink((const char *)out.data(), made))
      ok = false;
    done = r == Z_STREAM_END;
    if (ok && !done && !left && zs.avail_in == 0 && made == 0)
      ok = false; /* cut short */
  }
  inflateEnd(&zs);
  return ok;
}

bool zip_text(int fd, const Entry &e, std::string &out) {
  out.clear();
  return zip_read(fd, e, [&](const char *d, size_t n) {
    if (out.size() + n > kMaxText)
      return false;
    out.append(d, n);
    return true;
  });
}

bool zip_file(int fd, const Entry &e, const std::string &dest) {
  const std::string temp = dest + ".part";
  const int out = open(temp.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (out < 0)
    return false;
  bool ok = zip_read(fd, e, [&](const char *d, size_t n) { return write_out(out, d, n); });
  ok = fsync(out) == 0 && ok;
  close(out);
  ok = ok && rename(temp.c_str(), dest.c_str()) == 0;
  if (!ok)
    unlink(temp.c_str());
  return ok;
}

void tell(const std::string &text) {
  zt_log("install: %s", text.c_str());
  if (!sceKernelSendNotificationRequest)
    return;
  OrbisNotificationRequest req = {};
  snprintf(req.message, sizeof(req.message), "ZhiThemes: %s", text.c_str());
  sceKernelSendNotificationRequest(0, &req, sizeof(req), 0);
}

/* "" when installed (*name = the theme), else the reason */
std::string install_one(const std::string &path, const std::string &stem, std::string *name) {
  const int fd = open(path.c_str(), O_RDONLY);
  if (fd < 0)
    return "cannot open";
  struct stat st = {};
  fstat(fd, &st);
  unsigned char head[4] = {};
  const bool zip = st.st_size >= 22 && read_at(fd, head, 4, 0) && le32(head) == 0x04034b50;
  std::string text, info;
  std::vector<Entry> entries, assets;
  if (zip) {
    if (!zip_list(fd, st.st_size, entries)) {
      close(fd);
      return "broken ZIP file";
    }
    for (const Entry &e : entries) {
      if (e.name == "theme.ztheme" && !zip_text(fd, e, text)) {
        close(fd);
        return "cannot read theme.ztheme";
      }
      if (e.name == "zhitheme.json")
        zip_text(fd, e, info);
      if (e.name.rfind("assets/", 0) == 0) {
        const size_t s1 = e.name.find('/', 7);
        if (s1 == std::string::npos || e.name.find('/', s1 + 1) != std::string::npos)
          continue;
        const std::string kind = e.name.substr(7, s1 - 7);
        if (kind == "wallpapers" || kind == "icons" || kind == "fonts")
          assets.push_back(e);
      }
    }
    if (text.empty()) {
      close(fd);
      return "no theme.ztheme in this pack";
    }
  } else {
    if (st.st_size > (off_t)kMaxText) {
      close(fd);
      return "not a theme (too big for a theme text)";
    }
    text = read_text(path.c_str());
  }
  if (!is_theme_text(text)) {
    close(fd);
    return "no \"var THEME = {...}\" block: not a ZhiThemes theme";
  }
  /* the editor's order: zhitheme.json name, themeName, the file's name */
  std::string n = theme_safe(quoted_after(info, "\"name\"", '"'));
  if (n.empty())
    n = theme_safe(quoted_after(text, "themeName", '\''));
  if (n.empty())
    n = theme_safe(stem);
  if (n.empty())
    n = "New-theme";
  *name = n;
  const std::string active = zt_theme_name();
  const bool there = access(zt_theme_file(n).c_str(), F_OK) == 0;
  const std::string before = n == active ? read_text(zt_theme_file(active).c_str()) : std::string();
  std::string err = there ? zt_theme_clear(n) : zt_theme_new(n, std::string());
  if (!err.empty()) {
    close(fd);
    return err;
  }
  int files = 0;
  for (const Entry &e : assets) {
    const size_t s1 = e.name.find('/', 7);
    const std::string kind = e.name.substr(7, s1 - 7), orig = e.name.substr(s1 + 1);
    std::string file = name_ok(orig) ? orig : upload_name(orig);
    if (file != orig)
      for (size_t at = 0; (at = text.find(orig, at)) != std::string::npos; at += file.size())
        text.replace(at, orig.size(), file);
    const std::string dir = zt_theme_dir_of(n, kind.c_str());
    zt_mkdirs(dir);
    const std::string dest = dir + "/" + file;
    if (!zip_file(fd, e, dest)) {
      zt_log("install: %s FAILED (method %u, %u bytes)", e.name.c_str(), e.method, e.csize);
      continue;
    }
    zt_dedupe(dest);
    ++files;
  }
  close(fd);
  if (!write_text(zt_theme_file(n), text))
    return "cannot write " + zt_theme_file(n);
  if (n == active) {
    if (!before.empty())
      zt_carry_personal(before, zt_theme_file(n));
  } else if (!(err = zt_theme_use(n)).empty())
    return err;
  zt_log("install: %s -> theme %s (%s, %d of %zu files%s)", path.c_str(), n.c_str(),
         zip ? "pack" : "text", files, assets.size(), there ? ", replaced the old one" : "");
  return "";
}

} // namespace

void zt_install_dropped() {
  mkdir(ZT_INSTALL, 0777);
  std::vector<std::string> names;
  if (DIR *d = opendir(ZT_INSTALL)) {
    while (dirent *e = readdir(d)) {
      const std::string f = e->d_name;
      if (f.empty() || f[0] == '.' || ends_with(f, ".failed") || ends_with(f, ".part") || ends_with(f, ".tmp"))
        continue;
      struct stat st = {};
      if (stat((std::string(ZT_INSTALL "/") + f).c_str(), &st) == 0 && S_ISREG(st.st_mode))
        names.push_back(f);
    }
    closedir(d);
  }
  if (names.empty())
    return;
  std::sort(names.begin(), names.end());
  std::string last;
  int done = 0;
  for (const std::string &f : names) {
    const std::string path = std::string(ZT_INSTALL "/") + f;
    const size_t dot = f.rfind('.');
    const std::string stem = dot == std::string::npos || dot == 0 ? f : f.substr(0, dot);
    std::string theme;
    const time_t t0 = time(nullptr);
    const std::string err = install_one(path, stem, &theme);
    if (err.empty()) {
      unlink(path.c_str());
      last = theme;
      ++done;
      zt_log("install: %s done in %ld s, deleted from Install", f.c_str(), (long)(time(nullptr) - t0));
    } else {
      rename(path.c_str(), (path + ".failed").c_str());
      tell(f + " not installed: " + err + " (now " + f + ".failed)");
    }
  }
  /* a theme dropped in Install/ turns ZhiThemes back on */
  if (done)
    unlink(ZT_DIR "/no_theme");
  if (done == 1)
    tell("theme " + last + " installed from the Install folder and in use");
  else if (done > 1)
    tell(std::to_string(done) + " themes installed from the Install folder; in use: " + zt_theme_name());
}

/* ---- the Home's Options menu > ZhiThemes ----
   The list of themes, the theme files found on a USB stick
   (/mnt/usbN/ZhiThemes/<file>, or /mnt/usbN/<file>.ztheme) and in Install/,
   "PS5 default" (no_theme: ZhiThemes off, only this menu stays) and the
   safe mode (a USB stick with ZhiThemes/no_theme). */
namespace {

const char *const kStockFile = ZT_DIR "/no_theme";
std::atomic<bool> g_menu_installing{false};

bool exists(const std::string &p) {
  struct stat st = {};
  return stat(p.c_str(), &st) == 0;
}

bool ends_nocase(const std::string &s, const char *e) {
  const size_t n = strlen(e);
  if (s.size() < n)
    return false;
  for (size_t i = 0; i < n; ++i)
    if (tolower((unsigned char)s[s.size() - n + i]) != e[i])
      return false;
  return true;
}

/* ShellUI sees the USB drives as /usb0../usb7 (AniketosHEN's package_files:
   "ShellUI has its own view of the file system"); /mnt/usbN as well, for safety */
std::string usb_root(int i) { return (i < 8 ? "/usb" : "/mnt/usb") + std::to_string(i % 8); }

bool usb_off() {
  for (int i = 0; i < 16; ++i) {
    const std::string b = usb_root(i) + "/ZhiThemes/no_theme";
    if (exists(b) || exists(b + ".txt"))
      return true;
  }
  return false;
}

struct Found {
  std::string path, name, from;
  long long size = 0, mtime = 0;
  /* USB files: "new", "installed" (same name, size and date as a
     file installed before, its theme still there) or "update" (same name,
     other size or date) */
  std::string state = "new", theme;
};

/* Themes/.installed, one line per USB file installed:
   <file name>|<size>|<mtime>|<theme> (the last install of that name) */
#define ZT_INSTALLED ZT_THEMES "/.installed"
struct Record {
  std::string file, theme;
  long long size, mtime;
};

std::vector<Record> records() {
  std::vector<Record> out;
  FILE *fp = fopen(ZT_INSTALLED, "r");
  if (!fp)
    return out;
  char line[512];
  while (fgets(line, sizeof(line), fp)) {
    std::string l = line;
    while (!l.empty() && (l.back() == 10 || l.back() == 13))
      l.pop_back();
    const size_t a = l.find('|'), b = a == std::string::npos ? a : l.find('|', a + 1),
                 c = b == std::string::npos ? b : l.find('|', b + 1);
    if (c == std::string::npos)
      continue;
    out.push_back({l.substr(0, a), l.substr(c + 1), atoll(l.c_str() + a + 1), atoll(l.c_str() + b + 1)});
  }
  fclose(fp);
  return out;
}

void record_install(const Found &f, const std::string &theme) {
  std::vector<Record> list = records();
  list.erase(std::remove_if(list.begin(), list.end(), [&](const Record &r) { return r.file == f.name; }),
             list.end());
  list.push_back({f.name, theme, f.size, f.mtime});
  if (list.size() > 200)
    list.erase(list.begin(), list.begin() + (list.size() - 200));
  const std::string temp = std::string(ZT_INSTALLED) + ".tmp";
  FILE *fp = fopen(temp.c_str(), "w");
  if (!fp)
    return;
  for (const Record &r : list)
    fprintf(fp, "%s|%lld|%lld|%s\n", r.file.c_str(), r.size, r.mtime, r.theme.c_str());
  fclose(fp);
  rename(temp.c_str(), ZT_INSTALLED);
}

/* any: the Install/ filter (every file but .x, .failed, .part, .tmp);
   else only .ztheme / .zip (a USB stick has other files) */
void scan_dir(const std::string &dir, const char *from, int kind, std::vector<Found> &out) {
  DIR *d = opendir(dir.c_str());
  if (!d)
    return;
  std::vector<std::string> names;
  while (dirent *e = readdir(d)) {
    const std::string f = e->d_name;
    if (f.empty() || f[0] == '.' || ends_with(f, ".failed") || ends_with(f, ".part") || ends_with(f, ".tmp"))
      continue;
    if (kind == 1 && !ends_nocase(f, ".ztheme") && !ends_nocase(f, ".zip"))
      continue;
    if (kind == 2 && !ends_nocase(f, ".ztheme"))
      continue;
    struct stat st = {};
    if (stat((dir + "/" + f).c_str(), &st) == 0 && S_ISREG(st.st_mode))
      names.push_back(f);
  }
  closedir(d);
  std::sort(names.begin(), names.end());
  for (size_t i = 0; i < names.size() && i < 20; ++i) {
    Found f;
    f.path = dir + "/" + names[i];
    f.name = names[i];
    f.from = from;
    struct stat st = {};
    if (stat(f.path.c_str(), &st) == 0) {
      f.size = (long long)st.st_size;
      f.mtime = (long long)st.st_mtime;
    }
    out.push_back(f);
  }
}

/* what ShellUI sees of each /mnt/usbN (logged when it changes): the
   an older menu showed no USB files with a stick in usb1 */
void usb_report() {
  static std::string last;
  std::string now;
  for (int i = 0; i < 16; ++i) {
    const std::string usb = usb_root(i);
    struct stat st = {};
    if (stat(usb.c_str(), &st) != 0) {
      if (errno != ENOENT)
        now += usb + ": stat errno " + std::to_string(errno) + "; ";
      continue;
    }
    DIR *d = opendir(usb.c_str());
    if (!d) {
      now += usb + ": opendir errno " + std::to_string(errno) + "; ";
      continue;
    }
    now += usb + ":";
    int n = 0;
    while (dirent *e = readdir(d)) {
      if (e->d_name[0] == '.')
        continue;
      if (n++ < 25)
        now += std::string(" ") + e->d_name + (e->d_type == DT_DIR ? "/" : "");
    }
    closedir(d);
    if (n > 25)
      now += " (+" + std::to_string(n - 25) + ")";
    now += "; ";
  }
  if (now.empty())
    now = "no USB drive (/usbN, /mnt/usbN)";
  if (now != last) {
    last = now;
    zt_log("menu: usb: %.900s", now.c_str());
  }
}

std::vector<Found> found_files() {
  std::vector<Found> out;
  usb_report();
  for (int i = 0; i < 16; ++i) {
    if (i == 8 && !out.empty())
      break; /* the same drives seen as /usbN: not twice */
    const std::string usb = usb_root(i);
    /* ZhiThemes/ (also ZhiThemes/Themes/ and Themes/, like the console
       layout): .ztheme and .zip; the stick's root: .ztheme only */
    scan_dir(usb + "/ZhiThemes", "usb", 1, out);
    scan_dir(usb + "/ZhiThemes/Themes", "usb", 1, out);
    scan_dir(usb + "/Themes", "usb", 1, out);
    scan_dir(usb, "usb", 2, out);
  }
  /* a USB file installed before (Themes/.installed) */
  const std::vector<Record> done = records();
  for (Found &f : out) {
    if (f.from != "usb")
      continue;
    for (const Record &r : done) {
      if (r.file != f.name || !zt_theme_name_ok(r.theme) || !exists(zt_theme_file(r.theme)))
        continue;
      f.theme = r.theme;
      f.state = r.size == f.size && r.mtime == f.mtime ? "installed" : "update";
    }
  }
  scan_dir(ZT_INSTALL, "install", 0, out);
  return out;
}

std::string jstr(const std::string &s) {
  std::string out = "\"";
  for (unsigned char c : s) {
    if (c == '"' || c == 92) {
      out += (char)92;
      out += (char)c;
    } else if (c < 0x20) {
      char b[8];
      snprintf(b, sizeof(b), "%cu%04x", 92, c);
      out += b;
    } else
      out += (char)c;
  }
  return out + "\"";
}

void menu_tell(const std::string &text) {
  zt_log("menu: %s", text.c_str());
  if (!sceKernelSendNotificationRequest)
    return;
  OrbisNotificationRequest req = {};
  snprintf(req.message, sizeof(req.message), "ZhiThemes: %s", text.c_str());
  sceKernelSendNotificationRequest(0, &req, sizeof(req), 0);
}

struct InstallJob {
  Found file;
  void (*done)();
};

void *install_thread(void *arg) {
  InstallJob *job = (InstallJob *)arg;
  const Found f = job->file;
  void (*done)() = job->done;
  delete job;
  const size_t dot = f.name.rfind('.');
  const std::string stem = dot == std::string::npos || dot == 0 ? f.name : f.name.substr(0, dot);
  const bool usb = f.from == "usb";
  menu_tell("installing " + f.name + (usb ? " from USB..." : " from the Install folder..."));
  std::string theme;
  const time_t t0 = time(nullptr);
  const std::string err = install_one(f.path, stem, &theme);
  if (err.empty()) {
    /* the USB stick is left as it is; Install/ is emptied as at the start */
    if (!usb)
      unlink(f.path.c_str());
    else
      record_install(f, theme); /* shown as "(installed)" from now on */
    zt_stock_set(false);
    zt_log("menu: %s -> %s in %ld s", f.path.c_str(), theme.c_str(), (long)(time(nullptr) - t0));
    menu_tell("theme " + theme + " installed" + (usb ? " from USB" : "") + " and in use" +
              (usb_off() ? " (a USB stick with ZhiThemes/no_theme keeps ZhiThemes off)" : ""));
    if (done)
      done();
  } else {
    if (!usb)
      rename(f.path.c_str(), (f.path + ".failed").c_str());
    menu_tell(f.name + " not installed: " + err);
  }
  g_menu_installing.store(false);
  return nullptr;
}

} // namespace

bool zt_stock_on() { return exists(kStockFile) || usb_off(); }

void zt_stock_set(bool on) {
  if (on) {
    const int fd = open(kStockFile, O_WRONLY | O_CREAT | O_TRUNC, 0666);
    if (fd >= 0)
      close(fd);
  } else
    unlink(kStockFile);
}

std::string zt_theme_menu_json() {
  std::string out = "{\"off\":";
  out += exists(kStockFile) ? "true" : "false";
  out += ",\"usbOff\":";
  out += usb_off() ? "true" : "false";
  out += ",\"installing\":";
  out += g_menu_installing.load() ? "true" : "false";
  out += ",\"list\":" + zt_themes_json() + ",\"files\":[";
  bool first = true;
  for (const Found &f : found_files()) {
    out += first ? "" : ",";
    first = false;
    out += "{\"path\":" + jstr(f.path) + ",\"name\":" + jstr(f.name) + ",\"from\":" + jstr(f.from) +
           ",\"state\":" + jstr(f.state) + ",\"theme\":" + jstr(f.theme) + "}";
  }
  return out + "]}";
}

std::string zt_theme_menu_use(const std::string &name) {
  if (!zt_theme_name_ok(name) || !exists(zt_theme_file(name)))
    return "no theme " + name;
  if (name != zt_theme_name()) {
    const std::string err = zt_theme_use(name);
    if (!err.empty())
      return err;
  }
  zt_stock_set(false);
  menu_tell("theme " + name + " in use" +
            (usb_off() ? " (a USB stick with ZhiThemes/no_theme keeps ZhiThemes off)" : ""));
  return "";
}

std::string zt_theme_menu_install(const std::string &path, void (*done)()) {
  if (g_menu_installing.load())
    return "another theme is being installed";
  for (const Found &f : found_files()) {
    if (f.path != path)
      continue;
    g_menu_installing.store(true);
    pthread_t t;
    InstallJob *job = new InstallJob{f, done};
    if (pthread_create(&t, nullptr, install_thread, job) != 0) {
      delete job;
      g_menu_installing.store(false);
      return "cannot start the install";
    }
    pthread_detach(t);
    return "";
  }
  return "file not found (USB stick taken out?)";
}

void zt_menu_notify(const std::string &text) { menu_tell(text); }
