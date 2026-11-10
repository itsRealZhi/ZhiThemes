/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/* Rest mode / Restart / Turn off from the theme's Power button in the top
   bar. The Home prints "THEME-POWER <rest|restart|off>" when an item of its
   power menu is pressed; the request waits ~0.4 s (the menu closes first)
   and runs on the UI thread (theme_tick), through the ShellUI's own
   PowerManager (Sce.Vsh.ShellUI.AppSystem), so its normal steps run (apps
   closed, "preparing to turn off" mask):
     restart -> RequestReboot(object reason = null, int appId = -1)
     rest    -> RequestShutdown(object reason = null, int appId = -1)
     off     -> RequestStateChange(state 3, object reason, Boot = 0,
                                   int userId = -1, int appId = -1) (private)
   Tested on 9.60: RequestShutdown puts the PS5 in rest mode and state 3
   turns it off (the decompiled enum, Shutdown 2 / Suspend 3, did not match).
   libSceSystemStateMgr is not loaded in the ShellUI on 9.60; its calls are
   kept as a fallback when it is. */

#include "zt_power.hpp"
#include "zt_log.hpp"
#include "ps5/kernel.h"
#include "external_symbols.hpp"
#include "hooked_funcs.hpp"

#include <atomic>
#include <cstring>
#include <time.h>

namespace {

typedef int (*power_fn)(void);
power_fn g_standby = nullptr, g_reboot = nullptr, g_turn_off = nullptr;
int g_handle = 0;

/* 0 none, 1 rest, 2 restart, 3 off */
std::atomic<int> g_pending{0};
std::atomic<long long> g_pending_at{0};

long long now_ms() {
  struct timespec ts;
  clock_gettime(CLOCK_MONOTONIC, &ts);
  return (long long)ts.tv_sec * 1000 + ts.tv_nsec / 1000000;
}

power_fn find(int handle, const char *name) {
  if (!handle)
    return nullptr;
  return reinterpret_cast<power_fn>(kernel_dynlib_dlsym(-1, handle, name));
}

/* PowerManager.<name> with <params> arguments, static */
MonoMethod *pm_method(MonoClass *pm, const char *name, uint32_t params) {
  void *iter = nullptr;
  while (MonoMethod *m = mono_class_get_methods(pm, &iter)) {
    const char *n = mono_method_get_name(m);
    if (!n || strcmp(n, name))
      continue;
    uint32_t iflags = 0;
    if (!(mono_method_get_flags(m, &iflags) & 0x0010))
      continue;
    MonoMethodSignature *sig = mono_method_signature(m);
    if (sig && mono_signature_get_param_count(sig) == params)
      return m;
  }
  return nullptr;
}

/* UI thread */
void mono_power(int what) {
  MonoImage *img = getDLLimage("Sce.Vsh.ShellUI.AppSystem.dll");
  MonoClass *pm = img ? mono_class_from_name(img, "Sce.Vsh.ShellUI.AppSystem", "PowerManager") : nullptr;
  if (!pm) {
    zt_log("power: no PowerManager");
    return;
  }
  int32_t app_id = -1, user_id = -1, boot = 0, state = 3;
  MonoMethod *m = nullptr;
  void *args[5] = {nullptr, nullptr, nullptr, nullptr, nullptr};
  const char *label = "";
  if (what == 3) {
    m = pm_method(pm, "RequestStateChange", 5);
    args[0] = &state;   /* 3 = off on the console */
    args[1] = nullptr;  /* reason */
    args[2] = &boot;    /* Boot 0 */
    args[3] = &user_id;
    args[4] = &app_id;
    label = "RequestStateChange(3)";
  } else {
    m = pm_method(pm, what == 2 ? "RequestReboot" : "RequestShutdown", 2);
    args[0] = nullptr;  /* reason */
    args[1] = &app_id;
    label = what == 2 ? "RequestReboot" : "RequestShutdown (rest)";
  }
  if (!m) {
    zt_log("power: PowerManager.%s not found", label);
    return;
  }
  MonoObject *exc = nullptr;
  MonoObject *ret = mono_runtime_invoke(m, nullptr, args, &exc);
  bool ok = ret && !exc ? *static_cast<bool *>(mono_object_unbox(ret)) : false;
  zt_log("power: PowerManager.%s -> %s%s", label, ok ? "true" : "false", exc ? " (exception)" : "");
}

} // namespace

void zt_power_resolve(int handle) {
  g_handle = handle;
  g_standby = find(handle, "sceSystemStateMgrEnterStandby");
  g_reboot = find(handle, "sceSystemStateMgrReboot");
  g_turn_off = find(handle, "sceSystemStateMgrTurnOff");
}

void zt_power_action(const char *what) {
  int w = !strcmp(what, "rest") ? 1 : !strcmp(what, "restart") ? 2 : !strcmp(what, "off") ? 3 : 0;
  if (!w) {
    zt_log("power: unknown action '%s'", what);
    return;
  }
  /* one at a time (a second X while the first waits does nothing) */
  int expected = 0;
  if (!g_pending.compare_exchange_strong(expected, w)) {
    zt_log("power: %s ignored, another one is waiting", what);
    return;
  }
  g_pending_at.store(now_ms() + 400);
  zt_log("power: %s in 0.4 s", what);
}

void zt_power_tick() {
  int w = g_pending.load();
  if (!w || now_ms() < g_pending_at.load())
    return;
  g_pending.store(0);
  power_fn fn = w == 1 ? g_standby : w == 2 ? g_reboot : g_turn_off;
  if (fn) {
    int rc = fn();
    zt_log("power: libSceSystemStateMgr %d -> 0x%x", w, rc);
    return;
  }
  mono_power(w);
}
