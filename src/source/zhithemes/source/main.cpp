/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/* ZhiThemes — PS5 home screen theme, standalone payload.
 *
 * Based on OnionHEN (GPL-3.0). Only the theme is kept: this payload injects
 * zt_shellui.elf (the theme module) into SceShellUI and watches for ShellUI
 * restarts (rest mode) to inject it again.
 *
 * Replacing a running copy without rebooting: the module already in ShellUI
 * answers on 127.0.0.1:4444; POST /quit makes it take its hooks out (atomic
 * swap back to the original bytes) and close the port, then the new module is
 * injected. A previous watcher process is stopped through its pid file.
 *
 * Files: /data/ZhiThemes/Themes/<active>.ztheme; logs in /data/ZhiThemes/Logs/
 * (zhithemes.log from the module, payload.log from this payload).
 */

#include <onion/proc_query.h>

#include <arpa/inet.h>
#include <ifaddrs.h>
#include <net/if.h>
#include <dirent.h>
#include <errno.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <signal.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/sysctl.h>
#include <sys/time.h>
#include <time.h>
#include <unistd.h>

#include <string>

#include "../../shellui/include/zt_brand.hpp"

extern "C" {
bool Inject_Toolbox(int pid, uint8_t *elf);
extern uint8_t zt_shellui_elf_start[];
int sceKernelSendNotificationRequest(int, void *, size_t, int);
}

namespace {

constexpr const char *kDir = "/user/data/ZhiThemes";
constexpr const char *kPidFile = "/user/data/ZhiThemes/watcher.pid";
constexpr const char *kLog = "/user/data/ZhiThemes/Logs/payload.log";
constexpr int kPort = 4444;

struct NotifyRequest {
  char useless1[45];
  char message[3075];
};

void notify(const char *fmt, ...) {
  NotifyRequest req = {};
  va_list ap;
  va_start(ap, fmt);
  vsnprintf(req.message, sizeof(req.message), fmt, ap);
  va_end(ap);
  sceKernelSendNotificationRequest(0, &req, sizeof(req), 0);
}

/* one line with its UTC time; past 1 MB the file starts again */
void logf(const char *fmt, ...) {
  struct stat st;
  if (stat(kLog, &st) == 0 && st.st_size > (1 << 20))
    unlink(kLog);
  const int fd = open(kLog, O_WRONLY | O_CREAT | O_APPEND, 0666);
  if (fd < 0)
    return;
  char line[600];
  const time_t now = time(nullptr);
  struct tm at = {};
  gmtime_r(&now, &at);
  int head = snprintf(line, sizeof(line), "%04d-%02d-%02d %02d:%02d:%02d  ", at.tm_year + 1900,
                      at.tm_mon + 1, at.tm_mday, at.tm_hour, at.tm_min, at.tm_sec);
  if (head < 0)
    head = 0;
  va_list ap;
  va_start(ap, fmt);
  int n = vsnprintf(line + head, sizeof(line) - 1 - head, fmt, ap);
  va_end(ap);
  if (n < 0)
    n = 0;
  n += head;
  if (n > (int)sizeof(line) - 2)
    n = sizeof(line) - 2;
  line[n++] = '\n';
  (void)write(fd, line, n);
  close(fd);
}

/* One HTTP request to the module in ShellUI; returns the body ("" = no
   answer, nothing listening). */
std::string ask_module(const char *method, const char *path) {
  const int fd = socket(AF_INET, SOCK_STREAM, 0);
  if (fd < 0)
    return "";
  timeval tv = {3, 0};
  setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv));
  setsockopt(fd, SOL_SOCKET, SO_SNDTIMEO, &tv, sizeof(tv));
  sockaddr_in addr = {};
  addr.sin_family = AF_INET;
  addr.sin_port = htons(kPort);
  addr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
  std::string out;
  if (connect(fd, reinterpret_cast<sockaddr *>(&addr), sizeof(addr)) == 0) {
    char req[160];
    const int n = snprintf(req, sizeof(req),
                           "%s %s HTTP/1.0\r\nContent-Length: 0\r\n\r\n",
                           method, path);
    (void)send(fd, req, n, 0);
    char buf[512];
    ssize_t got;
    while ((got = recv(fd, buf, sizeof(buf), 0)) > 0)
      out.append(buf, (size_t)got);
  }
  close(fd);
  const size_t body = out.find("\r\n\r\n");
  return body == std::string::npos ? out : out.substr(body + 4);
}

/* A module already in ShellUI leaves (hooks out, port closed). False when
   something answers that cannot leave (an old OnionHEN theme build). */
bool replace_running_module() {
  const std::string version = ask_module("GET", "/version");
  if (version.empty()) {
    logf("no module answering on :%d", kPort);
    return true;
  }
  logf("running module: '%s'", version.c_str());
  const std::string bye = ask_module("POST", "/quit");
  logf("quit -> '%s'", bye.c_str());
  if (bye.rfind("bye", 0) != 0)
    return false;
  sleep(2); /* the old server closes :4444 after answering */
  return true;
}

void stop_previous_watcher() {
  const int fd = open(kPidFile, O_RDONLY);
  if (fd >= 0) {
    char buf[16] = {};
    (void)read(fd, buf, sizeof(buf) - 1);
    close(fd);
    const pid_t old = (pid_t)atoi(buf);
    if (old > 1 && old != getpid() && kill(old, 0) == 0) {
      kill(old, SIGKILL);
      logf("stopped previous watcher pid %d", old);
    }
  }
  const int out = open(kPidFile, O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (out >= 0) {
    char buf[16];
    const int n = snprintf(buf, sizeof(buf), "%d", getpid());
    (void)write(out, buf, n);
    close(out);
  }
}

/* the console's address on the network (first IPv4 that is not loopback) */
std::string console_ip() {
  std::string ip;
  struct ifaddrs *list = nullptr;
  if (getifaddrs(&list) == 0) {
    for (struct ifaddrs *i = list; i && ip.empty(); i = i->ifa_next) {
      if (!i->ifa_addr || i->ifa_addr->sa_family != AF_INET || (i->ifa_flags & IFF_LOOPBACK))
        continue;
      char buf[INET_ADDRSTRLEN] = {};
      const auto *in = reinterpret_cast<const struct sockaddr_in *>(i->ifa_addr);
      if (inet_ntop(AF_INET, &in->sin_addr, buf, sizeof(buf)) && strcmp(buf, "127.0.0.1") != 0)
        ip = buf;
    }
    freeifaddrs(list);
  }
  return ip;
}

/* how many themes wait in Install/ (the module installs them when it
   starts; same filter as zt_install.cpp). 0 = none or already installed. */
int themes_to_install() {
  int n = 0;
  if (DIR *d = opendir((std::string(kDir) + "/Install").c_str())) {
    while (dirent *e = readdir(d)) {
      const std::string f = e->d_name;
      auto ends = [&](const char *x) {
        const size_t l = strlen(x);
        return f.size() >= l && f.compare(f.size() - l, l, x) == 0;
      };
      if (f.empty() || f[0] == '.' || ends(".failed") || ends(".part") || ends(".tmp"))
        continue;
      struct stat st = {};
      if (stat((std::string(kDir) + "/Install/" + f).c_str(), &st) == 0 && S_ISREG(st.st_mode))
        ++n;
    }
    closedir(d);
  }
  return n;
}

/* "PS5 default" (Options menu > ZhiThemes) writes no_theme; a USB
   stick with ZhiThemes/no_theme does the same while it is in (safe mode) */
bool stock_mode() {
  struct stat st = {};
  if (stat((std::string(kDir) + "/no_theme").c_str(), &st) == 0)
    return true;
  for (int i = 0; i < 8; ++i) {
    const std::string b = "/mnt/usb" + std::to_string(i) + "/ZhiThemes/no_theme";
    if (stat(b.c_str(), &st) == 0 || stat((b + ".txt").c_str(), &st) == 0)
      return true;
  }
  return false;
}

/* the theme that will load: the name in `themeName: '...'` of theme.ztheme
   (or of theme.js, renamed by the module); "default" without one */
std::string current_theme() {
  /* Themes/<active_theme.txt>.ztheme (theme.ztheme before the
     module moves it) */
  std::string active;
  int fd = open((std::string(kDir) + "/active_theme.txt").c_str(), O_RDONLY);
  if (fd >= 0) {
    char nb[64] = {};
    const ssize_t got = read(fd, nb, sizeof(nb) - 1);
    close(fd);
    for (ssize_t i = 0; i < got && nb[i] != '\n' && nb[i] != '\r'; ++i)
      active += nb[i];
  }
  /* the theme's own name (Rename in the editor), not themeName */
  if (!active.empty() && active.find('/') == std::string::npos)
    return active;
  fd = -1;
  if (!active.empty() && active.find('/') == std::string::npos)
    fd = open((std::string(kDir) + "/Themes/" + active + ".ztheme").c_str(), O_RDONLY);
  if (fd < 0)
    fd = open((std::string(kDir) + "/theme.ztheme").c_str(), O_RDONLY);
  if (fd < 0)
    return active.empty() ? "default" : active;
  std::string text;
  char buf[4096];
  ssize_t n;
  while (text.size() < 65536 && (n = read(fd, buf, sizeof(buf))) > 0)
    text.append(buf, (size_t)n);
  close(fd);
  const size_t key = text.find("themeName:");
  if (key != std::string::npos) {
    const size_t q1 = text.find('\'', key);
    const size_t q2 = q1 == std::string::npos ? q1 : text.find('\'', q1 + 1);
    if (q2 != std::string::npos && q2 > q1 + 1 && q2 - q1 < 60)
      return text.substr(q1 + 1, q2 - q1 - 1);
  }
  return "default";
}

/* this watcher is still the one in watcher.pid. On 30/10 two watchers
   ran (the SIGKILL of stop_previous_watcher did not stop the old one): each
   ShellUI restart was logged twice and got two modules (port 4444 busy for 3
   hours, then a crash; later one of two injections failed and ShellUI fell
   18 s after). A watcher that is no longer in the file stops by itself. */
bool still_the_watcher() {
  const int fd = open(kPidFile, O_RDONLY);
  if (fd < 0)
    return true;
  char buf[16] = {};
  (void)read(fd, buf, sizeof(buf) - 1);
  close(fd);
  const pid_t in_file = (pid_t)atoi(buf);
  return in_file <= 0 || in_file == getpid();
}

/* seconds to wait after a ShellUI restart (inject_delay, set in the
   editor's Logs tab; 15 when missing) */
int inject_delay() {
  const std::string path = std::string(kDir) + "/inject_delay";
  const int fd = open(path.c_str(), O_RDONLY);
  int s = 15;
  if (fd >= 0) {
    char buf[16] = {};
    (void)read(fd, buf, sizeof(buf) - 1);
    close(fd);
    s = atoi(buf);
  }
  return s < 5 || s > 120 ? 15 : s;
}

/* how many modules went into this ShellUI. On 28/10 and 04/11 the console crashed after the 6th injection in a row into the same
   ShellUI, with no error in the log (memory not given back on unload is the
   suspect). Logs/inject_count holds "<pid> <count> <boot time>"; a new
   ShellUI (or a reboot that reuses the pid) starts again at 1. */
constexpr const char *kCountFile = "/user/data/ZhiThemes/Logs/inject_count";
constexpr int kInjectWarn = 4;

long boot_time() {
  struct timeval tv = {};
  size_t len = sizeof(tv);
  if (sysctlbyname("kern.boottime", &tv, &len, nullptr, 0) != 0)
    return 0;
  return (long)tv.tv_sec;
}

int count_injection(pid_t shellui) {
  long pid = 0, count = 0, boot = 0;
  const int fd = open(kCountFile, O_RDONLY);
  if (fd >= 0) {
    char buf[64] = {};
    (void)read(fd, buf, sizeof(buf) - 1);
    close(fd);
    sscanf(buf, "%ld %ld %ld", &pid, &count, &boot);
  }
  const long now_boot = boot_time();
  /* boot times within a minute: the same boot (the value can move a little) */
  const bool same = pid == (long)shellui && count > 0 &&
                    (boot == 0 || now_boot == 0 || labs(boot - now_boot) < 60);
  count = same ? count + 1 : 1;
  const int out = open(kCountFile, O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (out >= 0) {
    char buf[64];
    const int n = snprintf(buf, sizeof(buf), "%d %ld %ld\n", (int)shellui, count, now_boot);
    (void)write(out, buf, n);
    close(out);
  }
  return (int)count;
}

/* returns the injection number in this ShellUI (0 = failed) */
int inject(pid_t shellui) {
  const bool ok = Inject_Toolbox((int)shellui, zt_shellui_elf_start);
  logf("inject into SceShellUI pid %d: %s", shellui, ok ? "ok" : "FAILED");
  if (!ok)
    return 0;
  const int n = count_injection(shellui);
  logf("injection %d into this ShellUI%s", n,
       n >= kInjectWarn ? " (warning shown: restart the PS5 soon)" : "");
  return n;
}

} // namespace

int main() {
  mkdir("/user/data", 0777);
  mkdir(kDir, 0777);
  /* logs/ is now Logs/ (the module moves what is left) */
  rename("/user/data/ZhiThemes/logs", "/user/data/ZhiThemes/Logs");
  mkdir("/user/data/ZhiThemes/Logs", 0777);
  logf("%s %s (build %d) by %s: payload start (pid %d)", ZT_NAME, ZT_VERSION, ZT_BUILD,
       ZT_AUTHOR, getpid());
  stop_previous_watcher();

  pid_t shellui = onion_find_pid("SceShellUI");
  if (shellui <= 0) {
    notify("ZhiThemes: SceShellUI not found");
    return 1;
  }
  if (!replace_running_module()) {
    notify("ZhiThemes: an older theme (OnionHEN) is active.\n"
           "Reboot without it, then send ZhiThemes again.");
    return 1;
  }
  const int loads = inject(shellui);
  if (!loads) {
    notify("ZhiThemes: injection failed");
    return 1;
  }
  const std::string ip = console_ip();
  char extra[200] = "";
  if (loads >= kInjectWarn)
    snprintf(extra, sizeof(extra),
             "\n\xE2\x9A\xA0 Loaded %d times without a restart: restart the PS5 before testing more.",
             loads);
  /* a theme still in Install/ is being installed by the module: the
     old theme's name would be wrong (the module tells the new one) */
  const int pending = themes_to_install();
  std::string loading;
  if (pending == 1)
    loading = "Installing the new theme from the Install folder";
  else if (pending > 1)
    loading = "Installing " + std::to_string(pending) + " themes from the Install folder";
  else if (stock_mode())
    loading = "ZhiThemes is off (PS5 default): Options on a tile > ZhiThemes to pick a theme";
  else
    loading = "Now loading " + current_theme();
  notify("Welcome to ZhiThemes %s by %s! \xF0\x9F\x8E\xA8\nOpen %s:%d to manage your themes.\n%s%s",
         ZT_VERSION, ZT_AUTHOR, ip.empty() ? "the console's IP" : ip.c_str(), kPort,
         loading.c_str(), extra);

  /* ShellUI restarts (rest mode, crashes): inject again into the new one.
     Safe mode: two restarts within 3 minutes look like the theme crashing
     ShellUI, so the watcher stops injecting (no crash loop) until a new
     ZhiThemes.elf is sent. */
  time_t last_restart = 0;
  for (;;) {
    sleep(3);
    if (!still_the_watcher()) {
      logf("watcher %d: a newer watcher took over, stopping", getpid());
      return 0;
    }
    const pid_t now = onion_find_pid("SceShellUI");
    if (now <= 0 || now == shellui)
      continue;
    logf("SceShellUI changed %d -> %d", shellui, now);
    shellui = now;
    const time_t t = time(nullptr);
    if (last_restart && t - last_restart < 180) {
      logf("safe mode: ShellUI restarted twice in %ld s, not injecting",
           (long)(t - last_restart));
      notify("ZhiThemes: ShellUI crashed twice in a row.\n"
             "Theme off (safe mode). Send ZhiThemes.elf again.");
      return 0;
    }
    last_restart = t;
    const int wait = inject_delay();
    logf("waiting %d s before injecting", wait);
    sleep(wait); /* let the new ShellUI load its libraries first */
    if (!still_the_watcher()) {
      logf("watcher %d: a newer watcher took over, stopping", getpid());
      return 0;
    }
    if (onion_find_pid("SceShellUI") != shellui)
      continue;
    /* a module already answering in this ShellUI: never a second one */
    const std::string running = ask_module("GET", "/version");
    if (!running.empty()) {
      logf("module already running ('%s'), not injecting", running.substr(0, 80).c_str());
      continue;
    }
    (void)inject(shellui);
  }
  return 0;
}
