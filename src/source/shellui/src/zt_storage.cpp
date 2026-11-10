/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/*
 * ZhiThemes' folders.
 * in older versions /data/ZhiThemes/backgrounds held everything: the user's
 * wallpapers and icons, the folder mosaics and folder backgrounds made by
 * ZhiThemes (a new name for every change, never deleted). Each kind got its
 * folder (zt_storage.hpp), the made ones live under cache/ and the Home
 * tells which ones it uses, so the rest can go. The SteamGridDB key moved
 * out of the theme into steamgrid.key.
 * several themes. /data/ZhiThemes keeps Assets/ (the user's files,
 * shared by every theme), Themes/<Name>.ztheme + Themes/<Name>/ (the
 * wallpapers, icons and fonts of that theme: deleting a theme deletes its
 * folder) and Logs/. active_theme.txt names the theme in use. A file that
 * two themes have is one file on disk (hard link, zt_dedupe).
 */

#include "zt_storage.hpp"
#include "zt_log.hpp"
#include "theme_web.hpp"
#include "zt_particle_textures.hpp"

#include <ctype.h>
#include <errno.h>
#include <dirent.h>
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>

#include <algorithm>
#include <mutex>
#include <set>
#include <string>
#include <vector>

/* the factory theme (homeui_js_inject.cpp) */
const char *theme_default_text();

namespace {

std::mutex g_theme_lock;
std::string g_theme = "Default"; /* the active theme */

/* the personal values: they follow the user from theme to theme (never in
   a pack, see the editor's PACK_PERSONAL) */
const char *const kPersonal[] = {"folders", "foldersIcon", "customTileChoice", "customBgChoice"};
/* the folders of a theme */
const char *const kThemeKinds[] = {"wallpapers", "icons", "fonts"};

std::string read_all(const char *path) {
  std::string out;
  const int fd = open(path, O_RDONLY);
  if (fd < 0)
    return out;
  char buf[4096];
  ssize_t n;
  while ((n = read(fd, buf, sizeof(buf))) > 0 && out.size() < (8u << 20))
    out.append(buf, (size_t)n);
  close(fd);
  return out;
}

bool write_all(const char *path, const std::string &data) {
  const int fd = open(path, O_WRONLY | O_CREAT | O_TRUNC, 0600);
  if (fd < 0)
    return false;
  bool ok = write(fd, data.data(), data.size()) == (ssize_t)data.size();
  ok = fsync(fd) == 0 && ok;
  close(fd);
  return ok;
}

/* `key: '...'` of the THEME block, raw (escapes kept), or "" (whole-word keys only) */
std::string raw_field(const std::string &src, const char *key, bool *found = nullptr) {
  const size_t klen = strlen(key);
  auto ident = [](char c) { return isalnum((unsigned char)c) || c == '_'; };
  if (found)
    *found = false;
  for (size_t at = 0; (at = src.find(key, at)) != std::string::npos;) {
    size_t p = at + klen;
    const bool word = (at == 0 || !ident(src[at - 1])) && (p >= src.size() || !ident(src[p]));
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
      return "";
    if (found)
      *found = true;
    return src.substr(p + 1, end - p - 1);
  }
  return "";
}

/* the same without escapes (file names, keys) */
std::string string_field(const std::string &src, const char *key) {
  const std::string raw = raw_field(src, key);
  std::string out;
  for (size_t i = 0; i < raw.size(); ++i)
    out += raw[i] == '\\' && i + 1 < raw.size() ? raw[++i] : raw[i];
  return out;
}

bool exists(const std::string &p) {
  struct stat st;
  return stat(p.c_str(), &st) == 0;
}

bool is_dir(const std::string &p) {
  struct stat st;
  return stat(p.c_str(), &st) == 0 && S_ISDIR(st.st_mode);
}

std::vector<std::string> list_dir(const std::string &dir) {
  std::vector<std::string> out;
  if (DIR *d = opendir(dir.c_str())) {
    while (dirent *e = readdir(d))
      if (e->d_name[0] != '.')
        out.push_back(e->d_name);
    closedir(d);
  }
  return out;
}

bool starts(const std::string &s, const char *p) { return s.rfind(p, 0) == 0; }

bool ends(const std::string &s, const char *t) {
  const size_t n = strlen(t);
  return s.size() >= n && s.compare(s.size() - n, n, t) == 0;
}

/* the file names a folders field ('Name|icon|pos|space|#col|alpha: IDs; ...') uses as icons */
std::set<std::string> folder_icons(const std::string &folders) {
  std::set<std::string> out;
  size_t at = 0;
  while (at <= folders.size()) {
    size_t semi = folders.find(';', at);
    if (semi == std::string::npos)
      semi = folders.size();
    const std::string part = folders.substr(at, semi - at);
    const size_t colon = part.rfind(':');
    if (colon != std::string::npos) {
      const std::string head = part.substr(0, colon);
      const size_t b1 = head.find('|');
      if (b1 != std::string::npos) {
        std::string icon = head.substr(b1 + 1, head.find('|', b1 + 1) == std::string::npos
                                                   ? std::string::npos
                                                   : head.find('|', b1 + 1) - b1 - 1);
        while (!icon.empty() && icon[0] == ' ')
          icon.erase(0, 1);
        while (!icon.empty() && icon.back() == ' ')
          icon.pop_back();
        const size_t slash = icon.rfind('/');
        if (!icon.empty())
          out.insert(slash == std::string::npos ? icon : icon.substr(slash + 1));
      }
    }
    at = semi + 1;
  }
  return out;
}

void move_file(const std::string &from, const std::string &dir, const std::string &name, int &moved) {
  const std::string to = dir + "/" + name;
  if (exists(to))
    return;
  if (rename(from.c_str(), to.c_str()) == 0)
    ++moved;
  else
    zt_log("storage: %s NOT moved to %s", from.c_str(), dir.c_str());
}

/* a whole folder to its new place: renamed when the new one is not there
   yet, else file by file (a name already there stays as it is) */
void move_dir(const std::string &from, const std::string &to, int &moved) {
  if (!is_dir(from))
    return;
  if (!exists(to)) {
    zt_mkdirs(to.substr(0, to.rfind('/')));
    if (rename(from.c_str(), to.c_str()) == 0) {
      moved += 1;
      return;
    }
  }
  zt_mkdirs(to);
  for (const std::string &n : list_dir(from)) {
    const std::string f = from + "/" + n;
    if (is_dir(f))
      move_dir(f, to + "/" + n, moved);
    else
      move_file(f, to, n, moved);
  }
  rmdir(from.c_str());
}

/* rm -r (two levels are enough for a theme folder; deeper ones too) */
void remove_tree(const std::string &path, int depth = 0) {
  if (depth > 6)
    return;
  if (!is_dir(path)) {
    unlink(path.c_str());
    return;
  }
  if (DIR *d = opendir(path.c_str())) {
    std::vector<std::string> names;
    while (dirent *e = readdir(d))
      if (strcmp(e->d_name, ".") != 0 && strcmp(e->d_name, "..") != 0)
        names.push_back(e->d_name);
    closedir(d);
    for (const std::string &n : names)
      remove_tree(path + "/" + n, depth + 1);
  }
  rmdir(path.c_str());
}

bool copy_file(const std::string &from, const std::string &to) {
  const int in = open(from.c_str(), O_RDONLY);
  if (in < 0)
    return false;
  const std::string temp = to + ".part";
  const int out = open(temp.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (out < 0) {
    close(in);
    return false;
  }
  std::vector<char> buf(256u << 10);
  bool ok = true;
  for (ssize_t n; ok && (n = read(in, buf.data(), buf.size())) > 0;)
    ok = write(out, buf.data(), (size_t)n) == n;
  ok = fsync(out) == 0 && ok;
  close(in);
  close(out);
  if (!ok || rename(temp.c_str(), to.c_str()) != 0) {
    unlink(temp.c_str());
    return false;
  }
  return true;
}

/* the same bytes (sizes already equal) */
bool same_bytes(const std::string &a, const std::string &b) {
  const int fa = open(a.c_str(), O_RDONLY);
  const int fb = fa < 0 ? -1 : open(b.c_str(), O_RDONLY);
  bool same = fa >= 0 && fb >= 0;
  std::vector<char> ba(same ? 128u << 10 : 0), bb(same ? 128u << 10 : 0);
  while (same) {
    const ssize_t na = read(fa, ba.data(), ba.size());
    const ssize_t nb = read(fb, bb.data(), bb.size());
    if (na != nb || na < 0) {
      same = false;
      break;
    }
    if (na == 0)
      break;
    same = memcmp(ba.data(), bb.data(), (size_t)na) == 0;
  }
  if (fa >= 0)
    close(fa);
  if (fb >= 0)
    close(fb);
  return same;
}

/* to = a hard link to from (a copy when the PS5 refuses the link) */
bool link_or_copy(const std::string &from, const std::string &to, bool *linked = nullptr) {
  if (linked)
    *linked = false;
  unlink(to.c_str());
  if (link(from.c_str(), to.c_str()) == 0) {
    if (linked)
      *linked = true;
    return true;
  }
  static int told = 0;
  if (told++ < 3)
    zt_log("storage: hard link refused (errno %d), copying %s", errno, to.c_str());
  return copy_file(from, to);
}

std::string trim(std::string s) {
  while (!s.empty() && isspace((unsigned char)s.back()))
    s.pop_back();
  while (!s.empty() && isspace((unsigned char)s[0]))
    s.erase(0, 1);
  return s;
}

/* a folder name from a free text name ("My theme!" -> "My-theme") */
std::string safe_name(const std::string &text) {
  std::string out;
  for (char c : text) {
    if (isalnum((unsigned char)c) || c == '-' || c == '_' || c == '.')
      out += c;
    else if (!out.empty() && out.back() != '-')
      out += '-';
    if (out.size() >= 40)
      break;
  }
  while (!out.empty() && (out[0] == '.' || out[0] == '-'))
    out.erase(0, 1);
  while (!out.empty() && out.back() == '-')
    out.pop_back();
  return out;
}

void set_active(const std::string &name) {
  {
    std::lock_guard<std::mutex> lock(g_theme_lock);
    g_theme = name;
  }
  write_all(ZT_ACTIVE_FILE, name + "\n");
}

/* the active theme from active_theme.txt; its .ztheme missing (deleted by
   the user to get out of a crash loop, or never there) -> Default. With no
   Default.ztheme either, ZhiThemes stays off (zt_stock_on): the factory
   theme is never written on its own; Apply in the editor makes the file */
void load_active() {
  std::string name = trim(read_all(ZT_ACTIVE_FILE));
  if (!zt_theme_name_ok(name) || !exists(zt_theme_file(name))) {
    if (!name.empty())
      zt_log("storage: theme %s not found; Default is used if it exists", name.c_str());
    name = "Default";
  }
  set_active(name);
}

void dir_size(const std::string &dir, int &files, long long &bytes, int depth = 0) {
  for (const std::string &n : list_dir(dir)) {
    const std::string p = dir + "/" + n;
    struct stat st;
    if (stat(p.c_str(), &st) != 0 || depth > 4)
      continue;
    if (S_ISDIR(st.st_mode))
      dir_size(p, files, bytes, depth + 1);
    else if (!ends(n, ".part")) {
      ++files;
      bytes += st.st_size;
    }
  }
}

void make_theme_dirs(const std::string &name) {
  for (const char *k : kThemeKinds)
    zt_mkdirs(zt_theme_dir_of(name, k));
}

} // namespace

void zt_mkdirs(const std::string &path) {
  for (size_t at = strlen(ZT_DIR) + 1; at <= path.size(); ++at)
    if (at == path.size() || path[at] == '/')
      mkdir(path.substr(0, at).c_str(), 0777);
}

/* ---------------- themes ---------------- */

std::string zt_theme_name() {
  std::lock_guard<std::mutex> lock(g_theme_lock);
  return g_theme;
}

std::string zt_theme_file(const std::string &name) {
  return std::string(ZT_THEMES "/") + (name.empty() ? zt_theme_name() : name) + ".ztheme";
}

std::string zt_theme_dir_of(const std::string &name, const char *kind) {
  return std::string(ZT_THEMES "/") + (name.empty() ? zt_theme_name() : name) + "/" + kind;
}

std::string zt_theme_dir(const char *kind) { return zt_theme_dir_of(std::string(), kind); }

bool zt_theme_name_ok(const std::string &name) {
  if (name.empty() || name.size() > 40 || name[0] == '.' || name[0] == '-')
    return false;
  for (char c : name)
    if (!(isalnum((unsigned char)c) || c == '.' || c == '-' || c == '_'))
      return false;
  return !ends(name, ".ztheme") && !ends(name, ".part") && !ends(name, ".tmp");
}

void zt_carry_personal(const std::string &from_text, const std::string &to_file) {
  for (const char *k : kPersonal) {
    bool found = false;
    const std::string v = raw_field(from_text, k, &found);
    if (found && raw_field(read_all(to_file.c_str()), k) != v && !theme_set_field_in(to_file, k, v))
      zt_log("storage: %s not carried to %s", k, to_file.c_str());
  }
}

std::string zt_themes_json() {
  std::vector<std::string> names;
  for (const std::string &n : list_dir(ZT_THEMES))
    if (ends(n, ".ztheme") && zt_theme_name_ok(n.substr(0, n.size() - 7)))
      names.push_back(n.substr(0, n.size() - 7));
  std::sort(names.begin(), names.end(), [](const std::string &a, const std::string &b) {
    return strcasecmp(a.c_str(), b.c_str()) < 0;
  });
  std::string out = "{\"active\":\"" + zt_theme_name() + "\",\"themes\":[";
  for (size_t i = 0; i < names.size(); ++i) {
    int files = 0;
    long long bytes = 0;
    dir_size(std::string(ZT_THEMES "/") + names[i], files, bytes);
    struct stat st = {};
    stat(zt_theme_file(names[i]).c_str(), &st);
    /* every file with its folder and size, so the editor can count
       only the ones the theme uses: [["wallpapers","x.mp4",123],...] */
    std::string list;
    for (const char *k : kThemeKinds)
      for (const std::string &n : list_dir(zt_theme_dir_of(names[i], k))) {
        struct stat fs = {};
        if (ends(n, ".part") || stat((zt_theme_dir_of(names[i], k) + "/" + n).c_str(), &fs) != 0 || S_ISDIR(fs.st_mode))
          continue;
        std::string q;
        for (char c : n)
          if (c != '"' && c != '\\' && (unsigned char)c >= 32)
            q += c;
        list += (list.empty() ? "[\"" : ",[\"") + std::string(k) + "\",\"" + q + "\"," + std::to_string((long long)fs.st_size) + "]";
      }
    out += (i ? ",{\"name\":\"" : "{\"name\":\"") + names[i] + "\",\"files\":" + std::to_string(files) +
           ",\"bytes\":" + std::to_string(bytes) + ",\"modified\":" + std::to_string((long long)st.st_mtime) +
           ",\"list\":[" + list + "]}";
  }
  return out + "]}";
}

std::string zt_theme_use(const std::string &name) {
  if (!zt_theme_name_ok(name) || !exists(zt_theme_file(name)))
    return "no theme " + name;
  const std::string old = zt_theme_name();
  /* the folders and the custom tile choices follow the user */
  if (name != old)
    zt_carry_personal(read_all(zt_theme_file(old).c_str()), zt_theme_file(name));
  make_theme_dirs(name);
  set_active(name);
  zt_log("storage: theme %s in use (was %s)", name.c_str(), old.c_str());
  return "";
}

std::string zt_theme_new(const std::string &name, const std::string &from, bool *created) {
  if (created)
    *created = false;
  if (!zt_theme_name_ok(name))
    return "invalid name (letters, digits, . - _ only)";
  if (exists(zt_theme_file(name)) || exists(std::string(ZT_THEMES "/") + name))
    return "a theme called " + name + " already exists";
  std::string text;
  if (from.empty())
    text = theme_default_text();
  else if (!zt_theme_name_ok(from) || (text = read_all(zt_theme_file(from).c_str())).empty())
    return "no theme " + from;
  make_theme_dirs(name);
  int linked = 0, copied = 0;
  if (!from.empty())
    for (const char *k : kThemeKinds)
      for (const std::string &n : list_dir(zt_theme_dir_of(from, k))) {
        if (ends(n, ".part"))
          continue;
        bool hard = false;
        if (link_or_copy(zt_theme_dir_of(from, k) + "/" + n, zt_theme_dir_of(name, k) + "/" + n, &hard))
          ++(hard ? linked : copied);
      }
  if (!write_all(zt_theme_file(name).c_str(), text)) {
    remove_tree(std::string(ZT_THEMES "/") + name);
    return "cannot write " + zt_theme_file(name);
  }
  if (created)
    *created = true;
  zt_log("storage: theme %s made from %s (%d files linked, %d copied)", name.c_str(),
         from.empty() ? "the factory theme" : from.c_str(), linked, copied);
  return "";
}

std::string zt_theme_rename(const std::string &name, const std::string &to) {
  if (!zt_theme_name_ok(name) || !exists(zt_theme_file(name)))
    return "no theme " + name;
  if (!zt_theme_name_ok(to))
    return "invalid name (letters, digits, . - _ only)";
  if (to == name)
    return "";
  if (exists(zt_theme_file(to)) || exists(std::string(ZT_THEMES "/") + to))
    return "a theme called " + to + " already exists";
  if (rename(zt_theme_file(name).c_str(), zt_theme_file(to).c_str()) != 0)
    return "cannot rename (errno " + std::to_string(errno) + ")";
  const std::string dir = std::string(ZT_THEMES "/") + name;
  if (is_dir(dir) && rename(dir.c_str(), (std::string(ZT_THEMES "/") + to).c_str()) != 0)
    zt_log("storage: folder of %s NOT renamed (errno %d)", name.c_str(), errno);
  rename((std::string(ZT_THEME_BACKUPS "/") + name + ".ztheme").c_str(),
         (std::string(ZT_THEME_BACKUPS "/") + to + ".ztheme").c_str());
  if (zt_theme_name() == name)
    set_active(to);
  make_theme_dirs(to);
  zt_log("storage: theme %s renamed %s", name.c_str(), to.c_str());
  return "";
}

std::string zt_theme_delete(const std::string &name) {
  if (!zt_theme_name_ok(name) || !exists(zt_theme_file(name)))
    return "no theme " + name;
  if (name == zt_theme_name())
    return "the theme in use cannot be deleted: use another one first";
  unlink(zt_theme_file(name).c_str());
  remove_tree(std::string(ZT_THEMES "/") + name);
  unlink((std::string(ZT_THEME_BACKUPS "/") + name + ".ztheme").c_str());
  zt_log("storage: theme %s deleted with its files", name.c_str());
  return "";
}

std::string zt_theme_clear(const std::string &name) {
  if (!zt_theme_name_ok(name))
    return "invalid name";
  for (const char *k : kThemeKinds)
    for (const std::string &n : list_dir(zt_theme_dir_of(name, k)))
      unlink((zt_theme_dir_of(name, k) + "/" + n).c_str());
  make_theme_dirs(name);
  zt_log("storage: files of theme %s cleared", name.c_str());
  return "";
}

std::string zt_theme_clean(const std::string &name, const std::string &list, int *removed) {
  *removed = 0;
  if (!zt_theme_name_ok(name) || !exists(zt_theme_file(name)))
    return "no theme " + name;
  size_t at = 0;
  while (at < list.size()) {
    size_t end = list.find('\n', at);
    if (end == std::string::npos)
      end = list.size();
    std::string line = list.substr(at, end - at);
    at = end + 1;
    while (!line.empty() && (line.back() == '\r' || line.back() == ' '))
      line.pop_back();
    const size_t slash = line.find('/');
    if (slash == std::string::npos)
      continue;
    const std::string kind = line.substr(0, slash), file = line.substr(slash + 1);
    bool ok = kind == "wallpapers" || kind == "icons" || kind == "fonts";
    ok = ok && !file.empty() && file.size() < 200 && file[0] != '.' && file.find('/') == std::string::npos;
    if (!ok)
      continue;
    const std::string path = zt_theme_dir_of(name, kind.c_str()) + "/" + file;
    if (unlink(path.c_str()) == 0)
      ++*removed;
  }
  zt_log("storage: theme %s: %d unused files deleted", name.c_str(), *removed);
  return "";
}

void zt_dedupe(const std::string &file) {
  /* <ZT_THEMES>/<theme>/<kind>/<name> */
  const std::string base = ZT_THEMES "/";
  if (!starts(file, base.c_str()))
    return;
  const std::string rest = file.substr(base.size());
  const size_t s1 = rest.find('/'), s2 = s1 == std::string::npos ? s1 : rest.find('/', s1 + 1);
  if (s2 == std::string::npos)
    return;
  const std::string self = rest.substr(0, s1), kind = rest.substr(s1 + 1, s2 - s1 - 1), name = rest.substr(s2 + 1);
  struct stat me;
  if (stat(file.c_str(), &me) != 0 || me.st_size <= 0)
    return;
  /* the same name first, then any file of that kind with the same size */
  std::vector<std::string> cands;
  for (const std::string &t : list_dir(ZT_THEMES)) {
    if (t == self || !is_dir(base + t))
      continue;
    const std::string dir = base + t + "/" + kind;
    if (exists(dir + "/" + name))
      cands.insert(cands.begin(), dir + "/" + name);
    for (const std::string &n : list_dir(dir))
      if (n != name && !ends(n, ".part"))
        cands.push_back(dir + "/" + n);
  }
  for (const std::string &c : cands) {
    struct stat st;
    if (stat(c.c_str(), &st) != 0 || st.st_size != me.st_size || !S_ISREG(st.st_mode))
      continue;
    if (st.st_ino == me.st_ino && st.st_dev == me.st_dev)
      return; /* already one file */
    if (!same_bytes(c, file))
      continue;
    const std::string temp = file + ".lnk";
    unlink(temp.c_str());
    if (link(c.c_str(), temp.c_str()) == 0 && rename(temp.c_str(), file.c_str()) == 0) {
      zt_log("storage: %s/%s/%s is the same file as %s (hard link, %lld bytes saved)", self.c_str(),
             kind.c_str(), name.c_str(), c.c_str() + base.size(), (long long)me.st_size);
    } else {
      unlink(temp.c_str());
      zt_log("storage: hard link to %s refused (errno %d); %s kept as a copy", c.c_str(), errno, file.c_str());
    }
    return;
  }
}

/* ---------------- start ---------------- */

void zt_storage_migrate() {
  zt_mkdirs(ZT_ASSETS);
  zt_mkdirs(ZT_THEME_BACKUPS);
  int moved = 0;
  /* the user's files */
  for (const char *k : {"customtile", "custombg", "folders", "avatars", "cache", "backgrounds"})
    move_dir(std::string(ZT_DIR "/") + k, std::string(ZT_ASSETS "/") + k, moved);

  /* the one theme in older versions */
  const std::string old = ZT_DIR "/theme.ztheme";
  std::string name = trim(read_all(ZT_ACTIVE_FILE));
  if (exists(old)) {
    const std::string text = read_all(old.c_str());
    std::string want = safe_name(string_field(text, "themeName"));
    if (want.empty() || !zt_theme_name_ok(want))
      want = "My-theme";
    name = want;
    for (int n = 2; exists(zt_theme_file(name)) && n < 100; ++n)
      name = want + "-" + std::to_string(n);
    if (rename(old.c_str(), zt_theme_file(name).c_str()) == 0) {
      set_active(name);
      zt_log("storage: theme.ztheme is now Themes/%s.ztheme (new layout)", name.c_str());
      ++moved;
    } else {
      zt_log("storage: theme.ztheme NOT moved (errno %d)", errno);
    }
    const std::string backup = ZT_DIR "/theme.backup.ztheme";
    if (exists(backup) && rename(backup.c_str(), (std::string(ZT_THEME_BACKUPS "/") + name + ".ztheme").c_str()) != 0)
      unlink(backup.c_str());
  }
  unlink(ZT_DIR "/theme.ztheme.tmp");
  load_active();
  /* the wallpapers, icons and fonts belonged to that theme */
  for (const char *k : kThemeKinds)
    move_dir(std::string(ZT_DIR "/") + k, zt_theme_dir(k), moved);
  make_theme_dirs(zt_theme_name());
  if (moved)
    zt_log("storage: %d files/folders moved to Assets/ and Themes/ (new layout)", moved);
  zt_log("storage: active theme %s", zt_theme_name().c_str());
}

void zt_storage_setup() {
  const std::string wallpapers = zt_theme_dir("wallpapers"), icons_dir = zt_theme_dir("icons");
  for (const std::string &d : {wallpapers, icons_dir, std::string(ZT_FOLDERS), std::string(ZT_CUSTOMTILE),
                               std::string(ZT_CUSTOMBG), std::string(ZT_CACHE_MOSAICS),
                               std::string(ZT_CACHE_FOLDERBG), std::string(ZT_CACHE_ICONS)})
    zt_mkdirs(d);
  const std::string theme = read_all(zt_theme_file().c_str());

  /* the user's icons: what the icon fields name */
  std::set<std::string> icons;
  for (const char *k : {"searchIcon", "settingsIcon", "deco1Icon", "deco2Icon", "deco3Icon", "deco4Icon",
                        "tabsGroupLeft", "tabsGroupRight", "footerIcon1", "footerIcon2", "footerIcon3"}) {
    const std::string v = string_field(theme, k);
    if (!v.empty())
      icons.insert(v.substr(v.rfind('/') == std::string::npos ? 0 : v.rfind('/') + 1));
  }
  std::set<std::string> folders = folder_icons(string_field(theme, "folders"));
  const std::string fi = string_field(theme, "foldersIcon");
  if (!fi.empty())
    folders.insert(fi.substr(fi.rfind('/') == std::string::npos ? 0 : fi.rfind('/') + 1));

  int moved = 0;
  for (const std::string &n : list_dir(ZT_LEGACY)) {
    const std::string from = std::string(ZT_LEGACY "/") + n;
    if (ends(n, ".part"))
      continue;
    if (starts(n, "zt_folder_"))
      move_file(from, ZT_CACHE_MOSAICS, n, moved);
    else if (starts(n, "zt_fbg_"))
      move_file(from, ZT_CACHE_FOLDERBG, n, moved);
    else if (starts(n, "zt_sys_"))
      move_file(from, ZT_CACHE_ICONS, n, moved);
    else if (starts(n, "zt_up_") || folders.count(n))
      move_file(from, ZT_FOLDERS, n, moved);
    else if (icons.count(n))
      move_file(from, icons_dir, n, moved);
    else
      move_file(from, wallpapers, n, moved);
  }
  /* folder icons uploaded  went to customtile */
  for (const std::string &n : list_dir(ZT_CUSTOMTILE))
    if (starts(n, "zt_up_"))
      move_file(std::string(ZT_CUSTOMTILE "/") + n, ZT_FOLDERS, n, moved);
  if (moved)
    zt_log("storage: %d files moved out of backgrounds/ (one folder per kind)", moved);
  if (list_dir(ZT_LEGACY).empty())
    rmdir(ZT_LEGACY);

  /* folder icons kept as full paths (customtile / backgrounds): only the name now */
  const std::string fv = string_field(theme, "folders");
  std::string nv = fv;
  for (const char *p : {ZT_DIR "/customtile/", ZT_DIR "/backgrounds/", ZT_CUSTOMTILE "/", ZT_LEGACY "/"})
    for (size_t at = 0; (at = nv.find(p, at)) != std::string::npos;)
      nv.erase(at, strlen(p));
  if (nv != fv && theme_set_field("folders", nv))
    zt_log("storage: folders field: icon paths made names");

  /* the SteamGridDB key leaves the theme */
  const std::string key = string_field(theme, "steamGridKey");
  if (!key.empty()) {
    if (zt_sgdb_key().empty())
      zt_sgdb_key_set(key);
    if (theme_set_field("steamGridKey", ""))
      zt_log("storage: SteamGridDB key moved from the theme to steamgrid.key");
  }

  /* favourites leave the themes: one list for the console (the active
     theme's first, then the other themes') */
  if (!exists(ZT_FAVORITES_FILE)) {
    std::vector<std::string> files{zt_theme_file()};
    for (const std::string &n : list_dir(ZT_THEMES))
      if (ends(n, ".ztheme") && std::string(ZT_THEMES "/") + n != files[0])
        files.push_back(std::string(ZT_THEMES "/") + n);
    std::string all = ",";
    for (const std::string &f : files) {
      const std::string v = string_field(read_all(f.c_str()), "favorites");
      size_t at = 0;
      while (at <= v.size()) {
        size_t c = v.find(',', at);
        if (c == std::string::npos)
          c = v.size();
        std::string id = v.substr(at, c - at);
        id.erase(std::remove(id.begin(), id.end(), ' '), id.end());
        if (!id.empty() && all.find("," + id + ",") == std::string::npos)
          all += id + ",";
        at = c + 1;
      }
    }
    const std::string list = all.size() > 1 ? all.substr(1, all.size() - 2) : "";
    if (zt_favorites_set(list))
      zt_log("storage: favourites now console wide (%s)", list.empty() ? "none" : list.c_str());
  }
}

void zt_particles_install() {
  zt_mkdirs(ZT_PARTICLES);
  int written = 0, failed = 0;
  for (const ZtParticleTexture &t : kZtParticleTextures) {
    const std::string path = std::string(ZT_PARTICLES "/") + t.name + ".png";
    struct stat st;
    if (stat(path.c_str(), &st) == 0 && (size_t)st.st_size == t.size)
      continue;
    const std::string part = path + ".part";
    if (write_all(part.c_str(), std::string((const char *)t.data, t.size)) && rename(part.c_str(), path.c_str()) == 0)
      written++;
    else {
      unlink(part.c_str());
      failed++;
    }
  }
  if (written || failed)
    zt_log("particles: %d textures written to Assets/particles (%d failed)", written, failed);
}

std::string zt_legacy_js() {
  std::string out = "[";
  int n = 0;
  for (const std::string &f : list_dir(ZT_LEGACY)) {
    if (f.find_first_of("\"\\") != std::string::npos || n >= 2000)
      continue;
    out += (n++ ? ",\"" : "\"") + f + "\"";
  }
  return out + "]";
}

void zt_cache_keep(const std::string &text) {
  const size_t bar = text.find('|');
  const std::string kind = text.substr(0, bar);
  const char *dir = kind == "mosaics" ? ZT_CACHE_MOSAICS : kind == "folderbg" ? ZT_CACHE_FOLDERBG
                  : kind == "icons" ? ZT_CACHE_ICONS : nullptr;
  if (!dir || bar == std::string::npos)
    return;
  std::set<std::string> keep;
  const std::string csv = text.substr(bar + 1);
  for (size_t at = 0; at <= csv.size();) {
    size_t c = csv.find(',', at);
    if (c == std::string::npos)
      c = csv.size();
    if (c > at)
      keep.insert(csv.substr(at, c - at));
    at = c + 1;
  }
  const time_t now = time(nullptr);
  int gone = 0, kept = 0;
  for (const std::string &n : list_dir(dir)) {
    const std::string p = std::string(dir) + "/" + n;
    struct stat st;
    if (keep.count(n) || stat(p.c_str(), &st) != 0 || now - st.st_mtime < 600) {
      ++kept;
      continue;
    }
    if (unlink(p.c_str()) == 0)
      ++gone;
  }
  zt_log("storage: cache/%s: %d in use, %d kept, %d old ones deleted", kind.c_str(), (int)keep.size(), kept, gone);
}

std::string zt_sgdb_key() {
  std::string k = read_all(ZT_SGDB_KEY_FILE);
  while (!k.empty() && (k.back() == '\n' || k.back() == '\r' || k.back() == ' '))
    k.pop_back();
  return k.size() < 200 ? k : "";
}

std::string zt_favorites() {
  std::string out;
  for (char c : read_all(ZT_FAVORITES_FILE))
    if (isalnum((unsigned char)c) || c == ',')
      out += (char)toupper((unsigned char)c);
  return out.size() < 60000 ? out : "";
}

bool zt_favorites_set(const std::string &list) {
  std::string clean;
  for (char c : list)
    if (isalnum((unsigned char)c) || c == ',')
      clean += (char)toupper((unsigned char)c);
  if (clean.size() >= 60000)
    return false;
  const std::string part = std::string(ZT_FAVORITES_FILE) + ".part";
  return write_all(part.c_str(), clean) && rename(part.c_str(), ZT_FAVORITES_FILE) == 0;
}

bool zt_sgdb_key_set(const std::string &key) {
  if (key.empty())
    return unlink(ZT_SGDB_KEY_FILE) == 0 || !exists(ZT_SGDB_KEY_FILE);
  for (char c : key)
    if (!isalnum((unsigned char)c) && c != '-' && c != '_')
      return false;
  const bool ok = key.size() < 200 && write_all(ZT_SGDB_KEY_FILE, key);
  zt_log("storage: SteamGridDB key %s", ok ? "saved" : "NOT saved");
  return ok;
}
