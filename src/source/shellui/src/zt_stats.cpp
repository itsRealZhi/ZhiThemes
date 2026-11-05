/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/* numbers for the debug panel (theme.js debugOverlay, Experimental).
   The Home prints "THEME-STATS" about once a second while the panel is on;
   homeui_js_inject.cpp answers with zt_stats_json() on the Home's thread.
   Nothing here runs while the panel is off (except the frame counter).

   Sources (as AniketosHEN telemetry / OnionHEN overlay, GPL-3):
   - fps: ShellUI frames (PUI Application.Update) per second
   - ram / vram: get_page_table_stats(1, 1|2) (whole console, MB)
   - shell: sceKernelAvailableFlexibleMemorySize (ShellUI's own budget)
   - monoHeap / monoUsed: mono_gc_get_heap_size / mono_gc_get_used_size
   - cpu: average of the 8 cores from the SceIdleCpu<n> threads' times
     (sceKernelGetCpuUsage, two samples)
   - cpuT / socT: sceKernelGetCpuTemperature / SocSensorTemperature(0)
   - fan: sceKernelGetCurrentFanDuty (raw / 1024)
   - up: system uptime; mod: this module's age; loads: logs/inject_count */

#include "zt_stats.hpp"
#include "zt_paths.hpp"

#include <atomic>
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <fcntl.h>
#include <mutex>
#include <string>
#include <time.h>
#include <unistd.h>
#include <vector>

extern int (*sceKernelGetCurrentFanDuty)(uint16_t *out_duty, uint64_t *out_chassis_info);

namespace {

struct KTime {
  int64_t tv_sec;
  int64_t tv_nsec;
};
struct ThreadStat {
  int32_t lo_data;
  uint32_t td_tid;
  KTime user_time;
  KTime system_time;
}; /* 0x28 */

} // namespace

extern "C" {
int get_page_table_stats(int vm, int type, int *total, int *free);
int sceKernelGetCpuUsage(ThreadStat *out, int32_t *size);
int sceKernelGetThreadName(uint32_t id, char *out);
int sceKernelGetCpuTemperature(int *celsius);
int sceKernelGetSocSensorTemperature(int sensor, int *celsius);
}

namespace {

std::atomic<uint64_t> g_frames{0};
std::mutex g_lock;
int (*g_flex_free)(size_t *) = nullptr;
int64_t (*g_mono_heap)() = nullptr;
int64_t (*g_mono_used)() = nullptr;
time_t g_module_start = 0;

double now_s() {
  timespec t{};
  clock_gettime(CLOCK_MONOTONIC, &t);
  return (double)t.tv_sec + t.tv_nsec / 1e9;
}

/* ---- CPU: idle thread of each core, time between two samples ---- */
constexpr int kMaxThreads = 3072;
constexpr int kCores = 8;
std::vector<ThreadStat> g_threads;
uint32_t g_idle_tid[kCores] = {};
bool g_idle_found = false;
double g_idle_prev[kCores] = {};
double g_cpu_prev_at = 0;
bool g_cpu_failed = false;

double secs(const KTime &t) { return (double)t.tv_sec + t.tv_nsec / 1e9; }

/* average use of the 8 cores in %, -1 = not known (yet) */
double cpu_usage() {
  if (g_cpu_failed)
    return -1;
  if (g_threads.empty())
    g_threads.resize(kMaxThreads);
  int32_t count = kMaxThreads;
  if (sceKernelGetCpuUsage(g_threads.data(), &count) != 0 || count <= 0) {
    g_cpu_failed = true;
    return -1;
  }
  if (count > kMaxThreads)
    count = kMaxThreads;
  if (!g_idle_found) {
    char name[0x40];
    int n = 0;
    for (int i = 0; i < count; i++) {
      int core = -1;
      memset(name, 0, sizeof(name));
      if (sceKernelGetThreadName(g_threads[i].td_tid, name) == 0 &&
          sscanf(name, "SceIdleCpu%d", &core) == 1 && core >= 0 && core < kCores) {
        g_idle_tid[core] = g_threads[i].td_tid;
        n++;
      }
    }
    g_idle_found = true;
    if (n < kCores) {
      g_cpu_failed = true;
      return -1;
    }
  }
  double idle_now[kCores] = {};
  int seen = 0;
  for (int i = 0; i < count; i++)
    for (int c = 0; c < kCores; c++)
      if (g_threads[i].td_tid == g_idle_tid[c]) {
        idle_now[c] = secs(g_threads[i].user_time) + secs(g_threads[i].system_time);
        seen++;
      }
  const double at = now_s(), span = at - g_cpu_prev_at;
  double result = -1;
  if (seen == kCores && g_cpu_prev_at > 0 && span > 0.2) {
    double sum = 0;
    for (int c = 0; c < kCores; c++) {
      double idle = (idle_now[c] - g_idle_prev[c]) / span;
      idle = idle < 0 ? 0 : idle > 1 ? 1 : idle;
      sum += (1 - idle) * 100;
    }
    result = sum / kCores;
  }
  memcpy(g_idle_prev, idle_now, sizeof(idle_now));
  g_cpu_prev_at = at;
  return result;
}

int inject_count() {
  const int fd = open(ZT_LOGS "/inject_count", O_RDONLY);
  if (fd < 0)
    return 0;
  char buf[64] = {};
  (void)!read(fd, buf, sizeof(buf) - 1);
  close(fd);
  long pid = 0, n = 0;
  if (sscanf(buf, "%ld %ld", &pid, &n) != 2 || pid != (long)getpid())
    return 0;
  return (int)n;
}

void add(std::string &out, const char *key, double v, const char *fmt = "%.1f") {
  char num[48];
  snprintf(num, sizeof(num), fmt, v);
  if (out.size() > 1)
    out += ',';
  out += '"';
  out += key;
  out += "\":";
  out += num;
}

std::string g_last;
double g_last_at = 0;
uint64_t g_frames_prev = 0;
double g_frames_prev_at = 0;

} // namespace

void zt_stats_frame() { g_frames.fetch_add(1, std::memory_order_relaxed); }

void zt_stats_set_memory_fns(void *flex_free, void *mono_heap, void *mono_used) {
  std::lock_guard<std::mutex> lock(g_lock);
  g_flex_free = reinterpret_cast<int (*)(size_t *)>(flex_free);
  g_mono_heap = reinterpret_cast<int64_t (*)()>(mono_heap);
  g_mono_used = reinterpret_cast<int64_t (*)()>(mono_used);
  if (!g_module_start)
    g_module_start = time(nullptr);
}

std::string zt_stats_memory_line() {
  std::lock_guard<std::mutex> lock(g_lock);
  char line[200];
  int n = 0;
  size_t free_bytes = 0;
  if (g_flex_free && g_flex_free(&free_bytes) == 0)
    n += snprintf(line + n, sizeof(line) - n, "flexible free %.1f MB", free_bytes / 1048576.0);
  if (g_mono_heap && n < (int)sizeof(line))
    n += snprintf(line + n, sizeof(line) - n, "%smono heap %.1f MB", n ? ", " : "",
                  g_mono_heap() / 1048576.0);
  if (g_mono_used && n < (int)sizeof(line))
    n += snprintf(line + n, sizeof(line) - n, "%smono used %.1f MB", n ? ", " : "",
                  g_mono_used() / 1048576.0);
  if (!n)
    snprintf(line, sizeof(line), "no memory functions");
  return line;
}

std::string zt_stats_json() {
  std::lock_guard<std::mutex> lock(g_lock);
  const double at = now_s();
  /* one sample per 0.8 s whatever asks */
  if (!g_last.empty() && at - g_last_at < 0.8)
    return g_last;
  std::string out = "{";
  const uint64_t frames = g_frames.load(std::memory_order_relaxed);
  if (g_frames_prev_at > 0 && at > g_frames_prev_at)
    add(out, "fps", (frames - g_frames_prev) / (at - g_frames_prev_at));
  g_frames_prev = frames;
  g_frames_prev_at = at;

  int total = 0, free_mb = 0;
  if (get_page_table_stats(1, 1, &total, &free_mb) == 0 && total > 0 && free_mb >= 0 && free_mb <= total) {
    add(out, "ramUsed", total - free_mb, "%.0f");
    add(out, "ramTotal", total, "%.0f");
  }
  total = free_mb = 0;
  if (get_page_table_stats(1, 2, &total, &free_mb) == 0 && total > 0 && free_mb >= 0 && free_mb <= total) {
    add(out, "vramUsed", total - free_mb, "%.0f");
    add(out, "vramTotal", total, "%.0f");
  }
  size_t flex = 0;
  if (g_flex_free && g_flex_free(&flex) == 0)
    add(out, "shellFree", flex / 1048576.0);
  if (g_mono_heap)
    add(out, "monoHeap", g_mono_heap() / 1048576.0);
  if (g_mono_used)
    add(out, "monoUsed", g_mono_used() / 1048576.0);
  const double cpu = cpu_usage();
  if (cpu >= 0)
    add(out, "cpu", cpu, "%.0f");
  int t = 0;
  if (sceKernelGetCpuTemperature(&t) == 0 && t > 0 && t < 130)
    add(out, "cpuT", t, "%.0f");
  t = 0;
  if (sceKernelGetSocSensorTemperature(0, &t) == 0 && t > 0 && t < 130)
    add(out, "socT", t, "%.0f");
  uint16_t duty = 0;
  uint64_t chassis = 0;
  if (sceKernelGetCurrentFanDuty && sceKernelGetCurrentFanDuty(&duty, &chassis) == 0 && duty <= 1024)
    add(out, "fan", duty * 100.0 / 1024.0, "%.0f");
  timespec up{};
  if (clock_gettime(CLOCK_MONOTONIC, &up) == 0)
    add(out, "up", (double)up.tv_sec, "%.0f");
  if (g_module_start)
    add(out, "mod", (double)(time(nullptr) - g_module_start), "%.0f");
  add(out, "loads", inject_count(), "%.0f");
  add(out, "pid", (double)getpid(), "%.0f");
  out += '}';
  g_last = out;
  g_last_at = at;
  return out;
}
