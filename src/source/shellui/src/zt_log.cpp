/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#include "zt_log.hpp"
#include "zt_brand.hpp"
#include "zt_paths.hpp"

#include "defs.h"
#include <onion/platform.h>

#include <algorithm>
#include <ctype.h>
#include <dirent.h>
#include <errno.h>
#include <fcntl.h>
#include <mutex>
#include <stdarg.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>
#include <vector>

namespace {

constexpr const char *kLogDir = ZT_LOGS; /* Logs/ (logs/ before) */
constexpr const char *kLog = ZT_LOGS "/zhithemes.log";
constexpr const char *kPrevious = ZT_LOGS "/previous.log";
constexpr const char *kDebugFlag = ZT_LOGS "/debug.on";
/* written at the start, deleted at a clean end: still there at the next
   start = the session before did not close */
constexpr const char *kOpenMark = ZT_LOGS "/session.open";
/* past this the log starts again (the start of it kept as previous.log) */
constexpr off_t kMaxLog = 8 << 20;
/* debug-*.log and crash-*.log kept of each kind */
constexpr size_t kKeepSaved = 5;

std::mutex g_lock;
timespec g_start = {};
time_t g_started = 0;
int g_debug = -1; /* -1 = not read yet, 0 off, 1 on, 2 on + sys */
std::string g_fw;
unsigned g_fw_hex = 0;

/* logs/ -> Logs/ (the folder renamed, or file by file when the
   payload already made Logs/; a name already in Logs/ stays) */
void move_old_logs() {
  static bool done = false;
  if (done)
    return;
  done = true;
  const std::string old = ZT_DIR "/logs";
  struct stat st;
  if (stat(old.c_str(), &st) != 0 || !S_ISDIR(st.st_mode))
    return;
  if (stat(kLogDir, &st) != 0 && rename(old.c_str(), kLogDir) == 0)
    return;
  mkdir(kLogDir, 0777);
  if (DIR *d = opendir(old.c_str())) {
    std::vector<std::string> names;
    while (dirent *e = readdir(d))
      if (strcmp(e->d_name, ".") != 0 && strcmp(e->d_name, "..") != 0)
        names.push_back(e->d_name);
    closedir(d);
    for (const std::string &n : names) {
      const std::string from = old + "/" + n;
      std::string to = std::string(kLogDir) + "/" + n;
      if (stat(to.c_str(), &st) == 0)
        to = std::string(kLogDir) + "/old-" + n; /* the new one stays */
      if (rename(from.c_str(), to.c_str()) != 0)
        unlink(from.c_str());
    }
  }
  rmdir(old.c_str());
}

void ensure_dir() {
  mkdir("/user/data", 0777);
  mkdir(ZT_DIR, 0777);
  move_old_logs();
  mkdir(kLogDir, 0777);
}

off_t file_size(const char *path) {
  struct stat st;
  return stat(path, &st) == 0 ? st.st_size : -1;
}

bool copy_file(const char *from, const char *to) {
  const int in = open(from, O_RDONLY);
  if (in < 0)
    return false;
  const int out = open(to, O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (out < 0) {
    close(in);
    return false;
  }
  std::vector<char> buf(16384); /* on the heap: module threads have small stacks */
  bool ok = true;
  for (ssize_t n; (n = read(in, buf.data(), buf.size())) > 0;)
    if (write(out, buf.data(), (size_t)n) != n) {
      ok = false;
      break;
    }
  close(in);
  close(out);
  return ok;
}

/* "20261030-154001" (UTC) */
std::string stamp(time_t t) {
  struct tm at = {};
  gmtime_r(&t, &at);
  char buf[32];
  snprintf(buf, sizeof(buf), "%04d%02d%02d-%02d%02d%02d", at.tm_year + 1900,
           at.tm_mon + 1, at.tm_mday, at.tm_hour, at.tm_min, at.tm_sec);
  return buf;
}

/* only the newest kKeepSaved files starting with prefix stay */
void prune(const char *prefix) {
  std::vector<std::string> names;
  if (DIR *d = opendir(kLogDir)) {
    while (dirent *e = readdir(d))
      if (strncmp(e->d_name, prefix, strlen(prefix)) == 0)
        names.push_back(e->d_name);
    closedir(d);
  }
  std::sort(names.begin(), names.end()); /* names carry the date: oldest first */
  for (size_t i = 0; i + kKeepSaved < names.size(); ++i)
    unlink((std::string(kLogDir) + "/" + names[i]).c_str());
}

/* In older versions the logs and dumps were in rnps_dump/: everything goes to
   logs/ as old-<name> (shown in the editor's Logs tab) and the folder goes. */
void move_rnps_dump() {
  const std::string old = ZT_DIR "/rnps_dump";
  DIR *d = opendir(old.c_str());
  if (!d)
    return;
  std::vector<std::string> names;
  while (dirent *e = readdir(d))
    if (e->d_name[0] != '.')
      names.push_back(e->d_name);
  closedir(d);
  for (const std::string &n : names) {
    const std::string from = old + "/" + n;
    const std::string to = std::string(kLogDir) + "/old-" + n;
    if (rename(from.c_str(), to.c_str()) != 0)
      unlink(from.c_str());
  }
  rmdir(old.c_str());
}

void read_debug_flag() {
  /* the diagnostic build: debug mode with the Settings/Trophies map, always */
  if (ZT_DIAG) {
    g_debug = 2;
    return;
  }
  char buf[16] = {};
  const int fd = open(kDebugFlag, O_RDONLY);
  if (fd < 0) {
    g_debug = 0;
    return;
  }
  (void)!read(fd, buf, sizeof(buf) - 1);
  close(fd);
  g_debug = strstr(buf, "sys") ? 2 : 1;
}

void write_line(const char *text, size_t len) {
  timespec now = {};
  clock_gettime(CLOCK_REALTIME, &now);
  struct tm at = {};
  gmtime_r(&now.tv_sec, &at);
  double since = 0;
  if (g_start.tv_sec)
    since = (double)(now.tv_sec - g_start.tv_sec) + (now.tv_nsec - g_start.tv_nsec) / 1e9;
  char line[1024];
  int n = snprintf(line, sizeof(line), "%04d-%02d-%02d %02d:%02d:%02d.%03d +%.3f  ",
                   at.tm_year + 1900, at.tm_mon + 1, at.tm_mday, at.tm_hour, at.tm_min,
                   at.tm_sec, (int)(now.tv_nsec / 1000000), since);
  if (n < 0)
    return;
  size_t used = (size_t)n;
  const size_t room = sizeof(line) - used - 1;
  if (len > room)
    len = room;
  memcpy(line + used, text, len);
  used += len;
  line[used++] = '\n';

  std::lock_guard<std::mutex> guard(g_lock);
  ensure_dir();
  if (file_size(kLog) > kMaxLog) {
    rename(kLog, kPrevious);
  }
  const int fd = open(kLog, O_WRONLY | O_CREAT | O_APPEND, 0666);
  if (fd < 0)
    return;
  (void)!write(fd, line, used);
  close(fd);
}

std::string json_text(const std::string &s) {
  std::string out = "\"";
  for (char c : s) {
    if (c == '"' || c == '\\')
      out += '\\';
    if ((unsigned char)c >= 32)
      out += c;
  }
  return out + "\"";
}

} // namespace

void zt_log(const char *fmt, ...) {
  char text[960];
  va_list ap;
  va_start(ap, fmt);
  const int n = vsnprintf(text, sizeof(text), fmt, ap);
  va_end(ap);
  if (n <= 0)
    return;
  const size_t len = (size_t)n < sizeof(text) ? (size_t)n : sizeof(text) - 1;
  write_line(text, len);
  LOG_INFO("zhithemes: %.*s", (int)len, text);
}

void zt_log_session_start(const char *fw_text, unsigned fw_hex) {
  {
    std::lock_guard<std::mutex> guard(g_lock);
    ensure_dir();
    clock_gettime(CLOCK_REALTIME, &g_start);
    g_started = g_start.tv_sec;
    /* "9.60" from the version number (0x09600004 -> 9.60); the system's
       text (" 9.600.004", a fixed 0x1C-byte field) only when it is 0 */
    g_fw_hex = fw_hex;
    if (fw_hex >> 16) {
      char buf[16];
      snprintf(buf, sizeof(buf), "%x.%02x", (fw_hex >> 24) & 0xff, (fw_hex >> 16) & 0xff);
      g_fw = buf;
    } else {
      g_fw = fw_text ? std::string(fw_text, strnlen(fw_text, 0x1C)) : "";
      while (!g_fw.empty() && (g_fw.back() == ' ' || g_fw.back() == 0))
        g_fw.pop_back();
      while (!g_fw.empty() && g_fw.front() == ' ')
        g_fw.erase(0, 1);
    }
    read_debug_flag();
    move_rnps_dump();
    const bool unclosed = file_size(kOpenMark) >= 0;
    /* the session before becomes previous.log; while debugging, one that
       did not close is also kept as a crash log */
    if (file_size(kLog) > 0) {
      if (unclosed && g_debug > 0) {
        const std::string crash = std::string(kLogDir) + "/crash-" + stamp(g_started) + ".log";
        copy_file(kLog, crash.c_str());
        prune("crash-");
      }
      rename(kLog, kPrevious);
    }
    const int mark = open(kOpenMark, O_WRONLY | O_CREAT | O_TRUNC, 0666);
    if (mark >= 0)
      close(mark);
  }
  zt_log("==== %s%s %s (build %d, %s %s) by %s ====", ZT_NAME, ZT_EDITION, ZT_VERSION, ZT_BUILD,
         __DATE__, __TIME__, ZT_AUTHOR);
  zt_log("PS5: firmware %s (0x%08x) | ShellUI pid %d", g_fw.empty() ? "unknown" : g_fw.c_str(),
         g_fw_hex, (int)getpid());
  if (g_debug < 0)
    read_debug_flag();
  zt_log("debug mode: %s | times are UTC, +seconds since this start",
         ZT_DIAG ? "on (diagnostic build: everything is logged)"
                 : g_debug == 2 ? "on (+ Settings/Trophies map)" : g_debug == 1 ? "on" : "off");
}

void zt_log_session_end() {
  zt_log("==== session closed ====");
  unlink(kOpenMark);
}

bool zt_debug_on() {
  if (g_debug < 0)
    read_debug_flag();
  return g_debug > 0;
}

bool zt_debug_sys() {
  if (g_debug < 0)
    read_debug_flag();
  return g_debug == 2;
}

std::string zt_debug_set(bool on, bool sys) {
  std::string saved;
  const bool was = zt_debug_on();
  if (on) {
    ensure_dir();
    const int fd = open(kDebugFlag, O_WRONLY | O_CREAT | O_TRUNC, 0666);
    if (fd >= 0) {
      const char *text = sys ? "1 sys\n" : "1\n";
      (void)!write(fd, text, strlen(text));
      close(fd);
    }
    g_debug = sys ? 2 : 1;
    zt_log("debug mode: on%s", sys ? " (+ Settings/Trophies map)" : "");
    return saved;
  }
  if (was) {
    zt_log("debug mode: stopped");
    std::lock_guard<std::mutex> guard(g_lock);
    const std::string name = "debug-" + stamp(time(nullptr)) + ".log";
    if (copy_file(kLog, (std::string(kLogDir) + "/" + name).c_str()))
      saved = name;
    prune("debug-");
  }
  unlink(kDebugFlag);
  g_debug = 0;
  return saved;
}

const std::string &zt_fw_text() { return g_fw; }

std::string zt_sysinfo_json() {
  char buf[64];
  snprintf(buf, sizeof(buf), "0x%08x", g_fw_hex);
  return std::string("{\"name\":") + json_text(ZT_NAME) + ",\"version\":" + json_text(ZT_VERSION) +
         ",\"build\":" + std::to_string(ZT_BUILD) + ",\"author\":" + json_text(ZT_AUTHOR) +
         ",\"home\":" + json_text(ZT_HOME) + ",\"kofi\":" + json_text(ZT_KOFI) +
         ",\"fw\":" + json_text(g_fw) + ",\"fwHex\":" + json_text(buf) +
         ",\"debug\":" + (zt_debug_on() ? "true" : "false") +
         ",\"sys\":" + (zt_debug_sys() ? "true" : "false") +
         ",\"started\":" + std::to_string((long long)g_started) + "}";
}

std::string zt_log_list_json() {
  struct Item {
    std::string name;
    long long size, time;
  };
  std::vector<Item> items;
  if (DIR *d = opendir(kLogDir)) {
    while (dirent *e = readdir(d)) {
      const std::string n = e->d_name;
      if (n.size() < 5 || (n.compare(n.size() - 4, 4, ".log") != 0 &&
                           n.compare(n.size() - 4, 4, ".txt") != 0))
        continue;
      struct stat st;
      if (stat((std::string(kLogDir) + "/" + n).c_str(), &st) != 0)
        continue;
      items.push_back({n, (long long)st.st_size, (long long)st.st_mtime});
    }
    closedir(d);
  }
  std::sort(items.begin(), items.end(), [](const Item &a, const Item &b) { return a.time > b.time; });
  std::string out = "[";
  for (const Item &i : items)
    out += std::string(out.size() > 1 ? "," : "") + "{\"name\":" + json_text(i.name) +
           ",\"size\":" + std::to_string(i.size) + ",\"time\":" + std::to_string(i.time) + "}";
  return out + "]";
}

std::string zt_log_path(const std::string &name) {
  if (name.empty() || name[0] == '.' || name.size() > 80)
    return "";
  for (char c : name)
    if (!isalnum((unsigned char)c) && c != '-' && c != '_' && c != '.')
      return "";
  const std::string path = std::string(kLogDir) + "/" + name;
  return file_size(path.c_str()) >= 0 ? path : "";
}
