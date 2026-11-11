/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/* Options menu > ZhiThemes > Quick settings / Tools / About: the menu's
   extra data (address of the editor, version, cache size...), the on/off
   fields the menu may change, and the tools (backup and logs to a USB
   stick, screen dump, picture cache, reload). */
#include "zt_storage.hpp"
#include "zt_brand.hpp"
#include "zt_log.hpp"
#include "theme_web.hpp"
#include <onion/net.h>
#include <dirent.h>
#include <errno.h>
#include <fcntl.h>
#include <pthread.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>
#include <atomic>
#include <mutex>
#include <string>
#include <vector>

namespace {

std::mutex g_tool_lock;
std::string g_tool_busy; /* the tool running now, "" = none */

/* the on/off fields the Quick settings may write (the rest is the editor's) */
const char *const kQuickFields[] = {"wallpaperOn", "tileAnimOn", "customTilesOn", "tabRecentOn",
                                    "tabFavOn", "tabNeverOn", "debugOverlay"};

bool is_dir(const std::string &p) {
  struct stat st = {};
  return stat(p.c_str(), &st) == 0 && S_ISDIR(st.st_mode);
}

/* the first USB stick ShellUI can write to (/usbN; /mnt/usbN is the
   payload's view), "" when none */
std::string usb_target() {
  for (int i = 0; i < 8; ++i) {
    const std::string root = "/usb" + std::to_string(i);
    if (!is_dir(root))
      continue;
    const std::string dir = root + "/ZhiThemes";
    if (mkdir(dir.c_str(), 0777) == 0 || errno == EEXIST)
      return root;
    zt_log("tools: %s not writable (errno %d)", root.c_str(), errno);
  }
  return "";
}

bool usb_present() {
  for (int i = 0; i < 8; ++i)
    if (is_dir("/usb" + std::to_string(i)))
      return true;
  return false;
}

std::string stamp() {
  const time_t now = time(nullptr);
  struct tm tm = {};
  gmtime_r(&now, &tm);
  char b[32];
  strftime(b, sizeof(b), "%Y-%m-%d_%H%M%S", &tm);
  return b;
}

bool copy_file(const std::string &from, const std::string &to, long long *bytes) {
  const int in = open(from.c_str(), O_RDONLY);
  if (in < 0)
    return false;
  const int out = open(to.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (out < 0) {
    close(in);
    return false;
  }
  std::vector<char> buf(1 << 16);
  bool ok = true;
  for (;;) {
    const ssize_t n = read(in, buf.data(), buf.size());
    if (n < 0)
      ok = false;
    if (n <= 0)
      break;
    if (write(out, buf.data(), (size_t)n) != n) {
      ok = false;
      break;
    }
    *bytes += n;
  }
  close(in);
  close(out);
  if (!ok)
    unlink(to.c_str());
  return ok;
}

struct Count {
  int files = 0, failed = 0;
  long long bytes = 0;
};

/* cp -r from to (to is made); .part / .tmp left out */
void copy_tree(const std::string &from, const std::string &to, Count &c, int depth = 0) {
  if (depth > 8)
    return;
  mkdir(to.c_str(), 0777);
  DIR *d = opendir(from.c_str());
  if (!d)
    return;
  std::vector<std::string> names;
  while (dirent *e = readdir(d))
    if (strcmp(e->d_name, ".") != 0 && strcmp(e->d_name, "..") != 0)
      names.push_back(e->d_name);
  closedir(d);
  for (const std::string &n : names) {
    const std::string a = from + "/" + n, b = to + "/" + n;
    struct stat st = {};
    if (stat(a.c_str(), &st) != 0)
      continue;
    if (S_ISDIR(st.st_mode)) {
      copy_tree(a, b, c, depth + 1);
    } else if (S_ISREG(st.st_mode)) {
      const size_t dot = n.rfind('.');
      const std::string ext = dot == std::string::npos ? "" : n.substr(dot);
      if (ext == ".part" || ext == ".tmp")
        continue;
      if (copy_file(a, b, &c.bytes))
        c.files++;
      else
        c.failed++;
    }
  }
}

/* size and number of the files under dir */
void walk(const std::string &dir, long long &bytes, int &files, int depth = 0) {
  if (depth > 8)
    return;
  DIR *d = opendir(dir.c_str());
  if (!d)
    return;
  while (dirent *e = readdir(d)) {
    if (strcmp(e->d_name, ".") == 0 || strcmp(e->d_name, "..") == 0)
      continue;
    const std::string p = dir + "/" + e->d_name;
    struct stat st = {};
    if (stat(p.c_str(), &st) != 0)
      continue;
    if (S_ISDIR(st.st_mode))
      walk(p, bytes, files, depth + 1);
    else if (S_ISREG(st.st_mode)) {
      bytes += st.st_size;
      files++;
    }
  }
  closedir(d);
}

/* deletes the files under dir (the folders stay) */
int clear_tree(const std::string &dir, int depth = 0) {
  if (depth > 8)
    return 0;
  int n = 0;
  DIR *d = opendir(dir.c_str());
  if (!d)
    return 0;
  std::vector<std::string> names;
  while (dirent *e = readdir(d))
    if (strcmp(e->d_name, ".") != 0 && strcmp(e->d_name, "..") != 0)
      names.push_back(e->d_name);
  closedir(d);
  for (const std::string &name : names) {
    const std::string p = dir + "/" + name;
    struct stat st = {};
    if (stat(p.c_str(), &st) != 0)
      continue;
    if (S_ISDIR(st.st_mode))
      n += clear_tree(p, depth + 1);
    else if (unlink(p.c_str()) == 0)
      n++;
  }
  return n;
}

std::string mb(long long bytes) {
  char b[32];
  snprintf(b, sizeof(b), bytes < (10LL << 20) ? "%.1f MB" : "%.0f MB", bytes / 1048576.0);
  return b;
}

std::string jstr(const std::string &s) {
  std::string out = "\"";
  for (unsigned char c : s) {
    if (c == '"' || c == 92) {
      out += (char)92;
      out += (char)c;
    } else if (c >= 0x20)
      out += (char)c;
  }
  return out + "\"";
}

struct Job {
  std::string tool;
  void (*reload)();
};

void finish() {
  std::lock_guard<std::mutex> lock(g_tool_lock);
  g_tool_busy.clear();
}

/* a copy to the stick: Count, or the error text */
std::string to_usb(const std::string &what, const std::vector<std::pair<std::string, std::string>> &items,
                   std::string *where, Count &c) {
  const std::string usb = usb_target();
  if (usb.empty())
    return usb_present() ? "cannot write to the USB stick" : "no USB stick found";
  const std::string base = usb + "/ZhiThemes/" + what;
  mkdir(base.c_str(), 0777);
  const std::string dir = base + "/" + stamp();
  if (mkdir(dir.c_str(), 0777) != 0 && errno != EEXIST)
    return "cannot make " + dir + " (errno " + std::to_string(errno) + ")";
  for (const auto &it : items) {
    struct stat st = {};
    if (stat(it.first.c_str(), &st) != 0)
      continue;
    const std::string to = dir + "/" + it.second;
    if (S_ISDIR(st.st_mode))
      copy_tree(it.first, to, c);
    else if (copy_file(it.first, to, &c.bytes))
      c.files++;
    else
      c.failed++;
  }
  *where = dir;
  if (!c.files && c.failed)
    return "nothing could be copied (USB stick full or read only?)";
  return "";
}

void *tool_thread(void *arg) {
  Job *job = (Job *)arg;
  const std::string tool = job->tool;
  void (*reload)() = job->reload;
  delete job;
  Count c;
  std::string where, err;
  const time_t t0 = time(nullptr);
  if (tool == "backup") {
    zt_menu_notify("backing up the themes to the USB stick...");
    err = to_usb("Backup", {{ZT_THEMES, "Themes"}, {ZT_FAVORITES_FILE, "favorites.txt"},
                            {ZT_DIR "/active_theme.txt", "active_theme.txt"}},
                 &where, c);
  } else if (tool == "logs") {
    err = to_usb("Logs", {{ZT_LOGS, "Logs"}}, &where, c);
  } else if (tool == "dump") {
    zt_menu_notify("copying the screen dump to the USB stick...");
    err = to_usb("Dumps", {{ZT_DIR "/Dumps", "Dumps"}}, &where, c);
    if (err.empty()) {
      /* done: the dump goes off again (it slows every app down) */
      theme_set_bool("screenDump", false);
    }
  }
  if (!err.empty()) {
    zt_log("tools: %s failed: %s", tool.c_str(), err.c_str());
    zt_menu_notify(tool + ": " + err);
  } else {
    zt_log("tools: %s -> %s: %d files, %lld bytes, %d failed, %ld s", tool.c_str(), where.c_str(), c.files,
           c.bytes, c.failed, (long)(time(nullptr) - t0));
    /* the stick as the user sees it: /usb1/x -> USB: ZhiThemes/... */
    const size_t z = where.find("/ZhiThemes/");
    const std::string shown = z == std::string::npos ? where : where.substr(z + 1);
    zt_menu_notify((tool == "backup" ? "themes backed up" : tool == "logs" ? "logs copied" : "screen dump copied") +
                   std::string(" to USB: ") + shown + " (" + std::to_string(c.files) + " files, " + mb(c.bytes) +
                   (c.failed ? ", " + std::to_string(c.failed) + " failed" : "") + ")");
  }
  (void)reload;
  finish();
  return nullptr;
}

} // namespace

std::string zt_tools_json() {
  char ip[ONION_NET_IP_ADDRESS_SIZE] = {};
  const bool net = onion_net_get_ip_address(ip, sizeof(ip)) == ONION_NET_IP_OK;
  long long cache = 0, dumps = 0;
  int cacheFiles = 0, dumpFiles = 0;
  walk(ZT_CACHE, cache, cacheFiles);
  walk(ZT_DIR "/Dumps", dumps, dumpFiles);
  std::string busy;
  {
    std::lock_guard<std::mutex> lock(g_tool_lock);
    busy = g_tool_busy;
  }
  std::string out = "{\"ip\":" + jstr(net ? ip : "") + ",\"port\":4444";
  out += ",\"version\":" + jstr(ZT_VERSION) + ",\"fw\":" + jstr(zt_fw_text());
  out += ",\"usb\":";
  out += usb_present() ? "true" : "false";
  out += ",\"cache\":" + jstr(mb(cache)) + ",\"cacheFiles\":" + std::to_string(cacheFiles);
  out += ",\"dumpFiles\":" + std::to_string(dumpFiles);
  out += ",\"busy\":" + jstr(busy) + "}";
  return out;
}

std::string zt_quick_set(const std::string &key, bool on) {
  bool known = false;
  for (const char *k : kQuickFields)
    if (key == k)
      known = true;
  if (!known)
    return "not a quick setting: " + key;
  if (zt_stock_on())
    return "ZhiThemes is off";
  if (!theme_set_bool(key, on))
    return "cannot write the theme file";
  return "";
}

std::string zt_tool_run(const std::string &tool, void (*reload)()) {
  if (tool == "reload") {
    zt_menu_notify("reloading the theme...");
    reload();
    return "";
  }
  if (tool == "cache") {
    long long bytes = 0;
    int files = 0;
    walk(ZT_CACHE, bytes, files);
    const int n = clear_tree(ZT_CACHE);
    zt_log("tools: picture cache cleared: %d of %d files, %lld bytes", n, files, bytes);
    zt_menu_notify("picture cache cleared (" + std::to_string(n) + " files, " + mb(bytes) +
                   "). The Home makes what it needs again.");
    reload();
    return "";
  }
  if (tool == "dumpon") {
    if (!theme_set_bool("screenDump", true))
      return "cannot write the theme file";
    zt_menu_notify("screen dump on. Open the screens you want, then Tools > Screen dump to USB again.");
    reload();
    return "";
  }
  if (tool != "backup" && tool != "logs" && tool != "dump")
    return "unknown tool " + tool;
  {
    std::lock_guard<std::mutex> lock(g_tool_lock);
    if (!g_tool_busy.empty())
      return "wait, " + g_tool_busy + " is still running";
    g_tool_busy = tool;
  }
  pthread_t t;
  Job *job = new Job{tool, reload};
  if (pthread_create(&t, nullptr, tool_thread, job) != 0) {
    delete job;
    finish();
    return "cannot start " + tool;
  }
  pthread_detach(t);
  return "";
}
