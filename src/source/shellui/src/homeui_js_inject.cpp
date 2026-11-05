/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#include "homeui_js_inject.hpp"
#include "zt_paths.hpp"

#if SHELLUI_HOMEUI_JS_INJECT == 1

#include "defs.h"
#include "detour.h"
#include "external_symbols.hpp"
#include "hooked_funcs.hpp"
#include "zt_brand.hpp"
#include "zt_log.hpp"
#include "zt_stats.hpp"
#include "theme_default_js.hpp"
#include "theme_web.hpp"
#include "zt_mosaic.hpp"
#include "zt_native_theme.hpp"
#include "zt_storage.hpp"

#include <algorithm>
#include <atomic>
#include <cmath>
#include <map>
#include <mutex>
#include <pthread.h>
#include <ctype.h>
#include <dirent.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#include <string>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>
#include <utility>
#include <vector>

/*
 * ShellUI runs every React Native app through
 * ReactNative.JavaScriptCore.Executor.JSJavaScriptExecutor (ReactNative.PUI):
 *
 *   public  void RunScript(IJSBundle jsBundle)                 starts a bundle
 *   private void EvalScript(string sourceCode, string sourceUrl) runs JS source
 *   private static void ConsoleLog(string msg, int logLevel,
 *                                  IntPtr error, IntPtr userarg) console.*
 *
 * RunScript is hooked: for HomeUI's bundle (NPXS40002) theme.js is evaluated
 * first, through mono_runtime_invoke so a JS error comes back as an exception
 * instead of unwinding through us, then the bundle runs as usual.
 */

namespace {

constexpr const char *kNamespace = "ReactNative.JavaScriptCore.Executor";
constexpr const char *kClass = "JSJavaScriptExecutor";
/* Apps the theme script runs in, by the title id in their bundle path */
struct ThemedApp {
  const char *title_id;
  const char *name; /* globalThis.__themeApp */
};
constexpr ThemedApp kThemedApps[] = {
    {"NPXS40002", "home"}, /* rnps-home: tiles, top bar */
    {"NPXS40033", "hub"},  /* rnps-game-hub: game title, Play buttons */
    {"NPXS40016", "media"}, /* monte-carlo: hub of the Media space (Start, hints) */
    {"NPXS40071", "library"}, /* rnps-library: Game Library (Options menu items) */
    {"NPXS40008", "settings"}, /* rnps-settings: Settings (screen map only) */
    {"NPXS40025", "trophy"},   /* rnps-trophy: Trophies (screen map only) */
};
/* the theme is Themes/<active>.ztheme (zt_theme_file()) */
constexpr const char *kScriptUrl = "theme.js";
constexpr size_t kScriptMaxLength = 1u << 20;
/* Diagnostics: the first bundles started and console lines seen are logged */
constexpr int kLoggedRuns = 24;
constexpr int kLoggedConsoleLines = 8;

std::atomic<int> g_runs{0};
std::atomic<int> g_console_lines{0};

/*
 * Focus frame colour. The white frame and glow around the focused item are
 * drawn natively by Sce.PlayStation.PUI.UI3.FocusRenderWidget, which takes
 * its colours from design tokens: "focus.stroke.enabled" (the line) and
 * "focus.fill.enabled" (the glow). (The static ThemedFocusColor of the focus
 * elements is 0,0,0,0 and setting it changes nothing.) The tokens live in
 * UISystem.StyleManager.ActiveColorToken(None).TokenDictionary, a
 * Dictionary<string, UIColor>; its entries are rewritten whenever HomeUI
 * starts (a managed thread). In debug mode every colour and shape token is
 * dumped once to logs/tokens_color.txt / tokens_shape.txt.
 */
constexpr const char *kTokenStroke = "focus.stroke.enabled";
constexpr const char *kTokenFill = "focus.fill.enabled";
constexpr const char *kTokenDumpColor =
    ZT_LOGS "/tokens_color.txt";
constexpr const char *kTokenDumpShape =
    ZT_LOGS "/tokens_shape.txt";
/* UIColor: float R, G, B, A; bool <HdrColor>k__BackingField (+ padding) */
constexpr size_t kUiColorBytes = 20;

MonoImage *g_pui = nullptr;

/* every hook this file (and ZhiThemes' main) puts in, so they can be taken
   out again when a newer ZhiThemes replaces this one */
DetourHandle g_hooks[32]; /* + avatar, panels, tokens */
int g_hook_count = 0;
std::atomic<bool> g_quit{false};

int g_double_hooks = 0;

bool zt_hook(uint64_t address, void *destination, void **original) {
  /* a function that already starts with "jmp qword [rip+0]" is hooked by a
     module that did not leave (its editor was down, the watcher could not
     ask it to quit): hooking it again crashed the ShellUI (log) */
  if (MakeCodeReadable(address, 16)) {
    const uint8_t *code = reinterpret_cast<const uint8_t *>(address);
    if (code[0] == 0xFF && code[1] == 0x25) {
      ++g_double_hooks;
      zt_log("zhithemes: %#lx is already hooked by another module; not hooking it",
                     (unsigned long)address);
      return false;
    }
  }
  DetourHandle h{};
  if (!InstallDetourEx(address, destination, original, &h)) {
    zt_log("zhithemes: hook at %#lx failed: %s", (unsigned long)address,
                   DetourLastError());
    return false;
  }
  if (h.unaligned)
    zt_log("zhithemes: hook at %#lx (misaligned, 3 steps)", (unsigned long)address);
  if (g_hook_count < 32)
    g_hooks[g_hook_count++] = h;
  /* the trampoline starts with the function's first instruction: a
     "jmp qword [rip+0]" (FF 25) there means another module (an older theme
     that did not leave) still hooks this function */
  const uint8_t *first = static_cast<const uint8_t *>(h.trampoline);
  if (first && first[0] == 0xFF && first[1] == 0x25) {
    ++g_double_hooks;
    zt_log("zhithemes: WARNING double hook at %#lx", (unsigned long)address);
  }
  return true;
}
struct SavedToken {
  const char *key;
  unsigned char value[kUiColorBytes];
  bool saved;
};
SavedToken g_focus_tokens[2] = {{kTokenStroke, {}, false},
                                {kTokenFill, {}, false}};
bool g_tokens_dumped = false;

MonoClass *g_executor_class = nullptr;
MonoMethod *g_eval_script = nullptr;
MonoClassField *g_name_field = nullptr;

void (*g_run_script_orig)(MonoObject *, MonoObject *) = nullptr;
void (*g_console_log_orig)(MonoString *, int, void *, void *) = nullptr;

/* Whole file as a string; empty when missing or unreadable. */
std::string read_file(const char *path) {
  std::string out;
  const int fd = open(path, O_RDONLY);
  if (fd < 0)
    return out;
  char buf[4096];
  ssize_t n;
  while ((n = read(fd, buf, sizeof(buf))) > 0 &&
         out.size() + (size_t)n <= kScriptMaxLength)
    out.append(buf, (size_t)n);
  close(fd);
  return out;
}

/*
 * EvalScript hands Hermes a buffer sized in UTF-16 units, so UTF-8 source
 * with accents arrives cut short ("')' expected", buffer smaller than the
 * file). Every non-ASCII character becomes \uXXXX, which JS reads the same
 * in comments, strings and identifiers.
 */
std::string ascii_js(const std::string &in) {
  std::string out;
  out.reserve(in.size() + in.size() / 8);
  char esc[8];
  auto put = [&](unsigned unit) {
    snprintf(esc, sizeof(esc), "\\u%04x", unit);
    out += esc;
  };
  for (size_t i = 0; i < in.size();) {
    const unsigned char c = (unsigned char)in[i];
    if (c < 0x80) {
      out += (char)c;
      ++i;
      continue;
    }
    size_t len = c >= 0xf0 ? 4 : c >= 0xe0 ? 3 : c >= 0xc0 ? 2 : 0;
    unsigned cp = len == 4 ? c & 0x07 : len == 3 ? c & 0x0f : c & 0x1f;
    bool ok = len != 0 && i + len <= in.size();
    for (size_t k = 1; ok && k < len; ++k) {
      const unsigned char cc = (unsigned char)in[i + k];
      ok = (cc & 0xc0) == 0x80;
      cp = (cp << 6) | (cc & 0x3f);
    }
    if (!ok) {
      out += '?';
      ++i;
      continue;
    }
    if (cp > 0xffff) {
      cp -= 0x10000;
      put(0xd800 + (cp >> 10));
      put(0xdc00 + (cp & 0x3ff));
    } else {
      put(cp);
    }
    i += len;
  }
  return out;
}

bool write_synced(const char *path, const char *data, size_t len) {
  const int fd = open(path, O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (fd < 0)
    return false;
  const bool ok = write(fd, data, len) == (ssize_t)len && fsync(fd) == 0;
  close(fd);
  return ok;
}

/*
 * Every start keeps a copy of the user's theme (Themes/.backup). No theme
 * file (first run, or deleted by the user to get out of a crash loop) is
 * never filled with the factory theme: its values (tile sizes, 9.60 stock
 * colours) would be applied on firmwares nobody tested. ZhiThemes stays off
 * (PS5 default, zt_stock_on) until a theme is picked or Apply is pressed.
 */
void write_default_script() {
  const std::string data = read_file(zt_theme_file().c_str());
  if (data.empty()) {
    zt_log("js: no theme (%s missing): ZhiThemes off (PS5 default) until a theme is picked",
           zt_theme_file().c_str());
    return;
  }
  /* a factory file does not replace the copy */
  if (data != kThemeDefaultJs) {
    zt_mkdirs(ZT_THEME_BACKUPS);
    const std::string backup = std::string(ZT_THEME_BACKUPS "/") + zt_theme_name() + ".ztheme";
    write_synced(backup.c_str(), data.data(), data.size());
  }
}

} // namespace

/* the factory theme, for a new theme (zt_storage.cpp) */
const char *theme_default_text() { return kThemeDefaultJs; }

namespace {

/* Which app this executor runs: the bundle path, else the executor's name. */
std::string bundle_identity(MonoObject *self, MonoObject *bundle) {
  std::string id;
  if (bundle)
    id = GetPropertyValue(bundle, "BundlePath");
  if (id.empty() && self && g_name_field) {
    MonoString *name = nullptr;
    mono_field_get_value(self, g_name_field, &name);
    id = Mono_to_String(name);
  }
  return id;
}

/*
 * Value of `key: <number|true|false>` in theme.js (the THEME block), or
 * fallback. Only whole-word keys followed by ':' count.
 */
double theme_value(const std::string &src, const char *key, double fallback) {
  const size_t klen = strlen(key);
  auto ident = [](char c) { return isalnum((unsigned char)c) || c == '_'; };
  for (size_t at = 0; (at = src.find(key, at)) != std::string::npos;) {
    size_t p = at + klen;
    const bool word = (at == 0 || !ident(src[at - 1])) &&
                      (p >= src.size() || !ident(src[p]));
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
    if (src.compare(p, 4, "true") == 0)
      return 1;
    if (src.compare(p, 5, "false") == 0)
      return 0;
    char *end = nullptr;
    const double v = strtod(src.c_str() + p, &end);
    if (end != src.c_str() + p)
      return v;
  }
  return fallback;
}

/* A method of klass or of one of its base classes. */
MonoMethod *find_method(MonoClass *klass, const char *name, int params) {
  for (; klass; klass = klass->parent)
    if (MonoMethod *m = mono_class_get_method_from_name(klass, name, params))
      return m;
  return nullptr;
}

/*
 * Calls a method; null (and a log line) when it is missing or throws. A void
 * method also returns null, so *ok tells success apart when it matters.
 */
MonoObject *call(MonoObject *self, const char *name, int params, void **args,
                 const char *what, bool *ok = nullptr) {
  if (ok)
    *ok = false;
  MonoClass *klass = self ? mono_object_get_class(self) : nullptr;
  MonoMethod *m = klass ? find_method(klass, name, params) : nullptr;
  if (!m) {
    zt_log("focus: %s: %s/%d not found", what, name, params);
    return nullptr;
  }
  MonoObject *exc = nullptr;
  MonoObject *r = mono_runtime_invoke(m, self, args, &exc);
  if (exc) {
    MonoString *text = mono_object_to_string(exc, nullptr);
    zt_log("focus: %s: %s threw: %.200s", what, name,
                   Mono_to_String(text).c_str());
    return nullptr;
  }
  if (ok)
    *ok = true;
  return r;
}

/* What the system resolves for a component token right now. */
void log_resolved(MonoObject *style_manager, const char *key,
                  const char *when) {
  int none = 0;
  void *args[2] = {mono_string_new(mono_domain_get(), key), &none};
  MonoObject *boxed = call(style_manager, "GetTokenColor", 2, args, key);
  if (!boxed)
    return;
  float c[4];
  memcpy(c, mono_object_unbox(boxed), sizeof(c));
  zt_log("focus: GetTokenColor(%s) %s = %d %d %d alpha %.3f", key, when,
                 (int)(c[0] * 255 + 0.5f), (int)(c[1] * 255 + 0.5f),
                 (int)(c[2] * 255 + 0.5f), c[3]);
}


/* StyleManager.ActiveColorToken / ActiveShapeToken (None).TokenDictionary */
MonoObject *token_dictionary(MonoObject *style_manager, const char *getter) {
  int none = 0; /* ThemeOverrideType.None */
  void *args[1] = {&none};
  MonoObject *token = call(style_manager, getter, 1, args, getter);
  return token ? call(token, "get_TokenDictionary", 0, nullptr, getter)
               : nullptr;
}

/* Every entry of a Dictionary<string, T>, written as "key = value". */
void dump_tokens(MonoObject *dict, const char *path, bool colour) {
  MonoObject *count_obj = call(dict, "get_Count", 0, nullptr, "dump");
  MonoObject *keys = call(dict, "get_Keys", 0, nullptr, "dump");
  if (!count_obj || !keys)
    return;
  const int count = *static_cast<int *>(mono_object_unbox(count_obj));
  MonoDomain *domain = mono_domain_get();
  MonoClass *string_class = mono_object_get_class(
      reinterpret_cast<MonoObject *>(mono_string_new(domain, "")));
  MonoArray *array = mono_array_new(domain, string_class, (uint32_t)count);
  int zero = 0;
  void *copy_args[2] = {array, &zero};
  bool copied = false;
  if (array)
    call(keys, "CopyTo", 2, copy_args, "dump", &copied); /* void */
  if (!copied) {
    zt_log("focus: dump of %s: keys not copied (count %d)", path,
                   count);
    return;
  }
  const int fd = open(path, O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (fd < 0) {
    zt_log("focus: cannot create %s", path);
    return;
  }
  for (int i = 0; i < count; ++i) {
    MonoString *key = mono_array_get(array, MonoString *, i);
    void *item_args[1] = {key};
    MonoObject *boxed = call(dict, "get_Item", 1, item_args, "dump");
    char line[256];
    int n;
    if (!boxed) {
      n = snprintf(line, sizeof(line), "%s = ?\n", Mono_to_String(key).c_str());
    } else if (colour) {
      float c[4];
      memcpy(c, mono_object_unbox(boxed), sizeof(c));
      n = snprintf(line, sizeof(line), "%s = %d %d %d alpha %.3f\n",
                   Mono_to_String(key).c_str(), (int)(c[0] * 255 + 0.5f),
                   (int)(c[1] * 255 + 0.5f), (int)(c[2] * 255 + 0.5f), c[3]);
    } else {
      float v;
      memcpy(&v, mono_object_unbox(boxed), sizeof(v));
      n = snprintf(line, sizeof(line), "%s = %g\n",
                   Mono_to_String(key).c_str(), v);
    }
    if (n > 0)
      (void)!write(fd, line, (size_t)n < sizeof(line) ? (size_t)n
                                                       : sizeof(line) - 1);
  }
  close(fd);
  zt_log("focus: %d tokens written to %s", count, path);
}

/*
 * Free colour tokens: theme.js may hold
 *   var TOKENS = { 'token.name': '#rrggbb' | '#rrggbbaa', ... };
 * Each one is written into the colour token dictionary; its stock value is
 * kept so a token taken out of the list goes back to stock.
 */
struct TokenOverride {
  std::string key;
  unsigned char stock[kUiColorBytes];
  bool active;
};
std::vector<TokenOverride> g_token_overrides;

int hex_digit(char c) {
  if (c >= '0' && c <= '9') return c - '0';
  if (c >= 'a' && c <= 'f') return c - 'a' + 10;
  if (c >= 'A' && c <= 'F') return c - 'A' + 10;
  return -1;
}

/* 'key': '#rrggbb[aa]' entries of the TOKENS block, in order. */
std::vector<std::pair<std::string, std::string>>
parse_token_block(const std::string &src) {
  std::vector<std::pair<std::string, std::string>> out;
  const size_t start = src.find("var TOKENS");
  if (start == std::string::npos)
    return out;
  const size_t open = src.find('{', start);
  const size_t close = open == std::string::npos ? open : src.find("};", open);
  if (close == std::string::npos)
    return out;
  size_t p = open + 1;
  while (p < close) {
    const size_t q1 = src.find('\'', p);
    if (q1 == std::string::npos || q1 >= close)
      break;
    /* skip comments */
    const size_t c = src.find("/*", p);
    if (c != std::string::npos && c < q1) {
      const size_t ce = src.find("*/", c + 2);
      p = ce == std::string::npos ? close : ce + 2;
      continue;
    }
    const size_t q2 = src.find('\'', q1 + 1);
    const size_t v1 = q2 == std::string::npos ? q2 : src.find('\'', q2 + 1);
    const size_t v2 = v1 == std::string::npos ? v1 : src.find('\'', v1 + 1);
    if (v2 == std::string::npos || v2 >= close)
      break;
    out.emplace_back(src.substr(q1 + 1, q2 - q1 - 1),
                     src.substr(v1 + 1, v2 - v1 - 1));
    p = v2 + 1;
  }
  return out;
}

/* Value of `key: '...'` in theme.js, or "" (same rules as theme_value). */
std::string theme_string(const std::string &src, const char *key) {
  const size_t klen = strlen(key);
  auto ident = [](char c) { return isalnum((unsigned char)c) || c == '_'; };
  for (size_t at = 0; (at = src.find(key, at)) != std::string::npos;) {
    size_t p = at + klen;
    const bool word = (at == 0 || !ident(src[at - 1])) &&
                      (p >= src.size() || !ident(src[p]));
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
    const size_t end = src.find('\'', p + 1);
    if (end == std::string::npos)
      return "";
    return src.substr(p + 1, end - p - 1);
  }
  return "";
}

/* THEME fields that are colour tokens (empty = stock) */
/* THEME fields that are colour tokens (empty = stock). The third column is
   the stock colour (FW 9.60 dump, tokens_color.txt), written when the field
   is empty: the "stock" a module captures can be a colour an older module
   had set (menu.fill, switches); empty = restore what was captured */
constexpr const char *kTokenFields[][3] = {
    /* the icon colour is done by theme.js on the top bar buttons: the token
       the icons use (button.label.enabled) also colours button text (Play)
       and the control centre icons; it stays available as buttonTextColor.
       stock colours here too, so clearing the field brings the top
       icons (search, settings) back to white after a module reload */
    {"downloadBarColor", "progress-indicator.accent.running.enabled", "#ffffffff"},
    {"downloadBarBgColor", "progress-indicator.track.enabled", "#ffffff28"},
    {"buttonBgColor", "button.fill.enabled", "#ffffff0f"},
    {"buttonBgFocusColor", "button.fill.focused", "#ffffffff"},
    {"buttonTextColor", "button.label.enabled", "#ffffffff"},
    {"buttonTextFocusColor", "button.label.focused", "#141414ff"},
    /* Settings & Trophies; global, like the ones above */
    /* list.label.primary colours the row icons, not the text */
    {"sysIconColor", "list.label.primary.enabled", "#ffffffff"},
    /* text.primary colours the page titles. The row text colour was
       given up (no token, label colour or MenuListItem hook did it) */
    {"sysTitleColor", "text.primary.enabled", "#ffffffff"},
    {"sysTextDimColor", "list.label.secondary.enabled", "#ffffffb7"},
    {"sysSideTextColor", "tab.label.selected.enabled", "#ffffffff"},
    {"sysSideTextDimColor", "tab.label.unselected.enabled", "#ffffff51"},
    {"sysSwitchOnColor", "switch.track.selected.enabled", "#ffffff3d"},
    {"sysSwitchOffColor", "switch.track.unselected.enabled", "#ffffff1e"},
    {"sysSwitchThumbColor", "switch.thumb.selected.enabled", "#ffffffb7"},

    {"sysSwitchThumbOffColor", "switch.thumb.unselected.enabled", "#ffffff51"},
    {"sysSwitchIconColor", "switch.icon.selected.enabled", "#292929ff"},
};

void apply_token_overrides(MonoObject *colours, const std::string &script) {
  auto wanted = parse_token_block(script);
  const size_t from_block = wanted.size();
  for (const auto &f : kTokenFields) {
    const std::string hex = theme_string(script, f[0]);
    if (!hex.empty()) {
      wanted.emplace_back(f[1], hex);
      continue;
    }
    if (!f[2][0])
      continue;
    bool in_block = false; /* the TOKENS block wins over the stock colour */
    for (size_t i = 0; i < from_block; ++i)
      in_block = in_block || wanted[i].first == f[1];
    if (!in_block)
      wanted.emplace_back(f[1], f[2]);
  }
  /* Options menus: menuBgColor (empty = stock #11141a) + menuBgOpacity, only
     the background (the text has its own menu.label.* tokens) */
  {
    std::string hex = theme_string(script, "menuBgColor");
    const double alpha = theme_value(script, "menuBgOpacity", 1);
    bool in_tokens = false;
    for (const auto &kv : wanted)
      in_tokens = in_tokens || kv.first == "menu.fill.enabled";
    if (hex.size() == 7 || alpha < 0.999) {
      if (hex.size() != 7)
        hex = "#11141a";
      char aa[3];
      snprintf(aa, sizeof(aa), "%02x", (int)lround(fmin(1.0, fmax(0.0, alpha)) * 255));
      wanted.emplace_back("menu.fill.enabled", hex + aa);
    } else if (!in_tokens) {
      /* stock, written every time: the "stock" kept by a module loaded over
         another one that had changed it was the changed colour */
      wanted.emplace_back("menu.fill.enabled", "#11141aff");
    }
  }
  for (TokenOverride &o : g_token_overrides)
    o.active = false;
  int applied = 0;
  for (const auto &kv : wanted) {
    const std::string &hex = kv.second;
    if (hex.size() != 7 && hex.size() != 9)
      continue;
    /* #rrggbb or #rrggbbaa: 3 or 4 channels of two hex digits */
    float c[4] = {0, 0, 0, 1};
    bool ok = hex[0] == '#';
    const size_t channels = (hex.size() - 1) / 2;
    for (size_t i = 0; ok && i < channels; ++i) {
      const int hi = hex_digit(hex[1 + i * 2]), lo = hex_digit(hex[2 + i * 2]);
      ok = hi >= 0 && lo >= 0;
      if (ok)
        c[i] = (float)(hi * 16 + lo) / 255.0f;
    }
    if (!ok) {
      zt_log("tokens: %s: bad colour '%s'", kv.first.c_str(),
                     hex.c_str());
      continue;
    }
    MonoString *key = mono_string_new(mono_domain_get(), kv.first.c_str());
    TokenOverride *o = nullptr;
    for (TokenOverride &e : g_token_overrides)
      if (e.key == kv.first)
        o = &e;
    if (!o) {
      void *get_args[1] = {key};
      MonoObject *boxed = call(colours, "get_Item", 1, get_args, "tokens");
      if (!boxed) {
        zt_log("tokens: %s does not exist", kv.first.c_str());
        continue;
      }
      g_token_overrides.push_back({kv.first, {}, false});
      o = &g_token_overrides.back();
      memcpy(o->stock, mono_object_unbox(boxed), kUiColorBytes);
    }
    o->active = true;
    unsigned char value[32] = {};
    memcpy(value, o->stock, kUiColorBytes);
    memcpy(value, c, sizeof(c));
    void *set_args[2] = {key, value};
    if (call(colours, "set_Item", 2, set_args, "tokens"))
      ++applied;
  }
  /* tokens taken out of the list go back to stock */
  int restored = 0;
  for (TokenOverride &o : g_token_overrides) {
    if (o.active)
      continue;
    MonoString *key = mono_string_new(mono_domain_get(), o.key.c_str());
    unsigned char value[32] = {};
    memcpy(value, o.stock, kUiColorBytes);
    void *set_args[2] = {key, value};
    if (call(colours, "set_Item", 2, set_args, "tokens"))
      ++restored;
  }
  if (applied || restored)
    zt_log("tokens: %d set, %d back to stock", applied, restored);
}

/* THEME fields that are shape tokens (StyleManager.ActiveShapeToken,
   Dictionary<string, float>, corner radius). The third column is the stock
   value (FW 9.60 dump, tokens_shape.txt), written when the field is 0, like
   the stock colours above. Global: every Options menu of the system */
constexpr struct {
  const char *field, *token;
  float stock;
} kShapeFields[] = {
    {"menuCorners", "menu.fill", 0},
    {"menuItemCorners", "menu.item.fill", 0},
    /* native corners of the list rows (Settings) and vertical tabs (side bar),
       global like the sys* colours */
    {"sysListCorners", "list.item", 0},
    {"sysTabCorners", "tab.vertical", 0},
    /* switch shape (9.60 stock 16 / 13) */
    {"sysSwitchCorners", "switch.track", 16},
    {"sysSwitchKnobCorners", "switch.thumb", 13},
};

void apply_shape_overrides(MonoObject *style_manager, const std::string &script) {
  MonoObject *shapes = token_dictionary(style_manager, "ActiveShapeToken");
  if (!shapes) {
    zt_log("shapes: ActiveShapeToken unavailable");
    return;
  }
  for (const auto &f : kShapeFields) {
    const double v = theme_value(script, f.field, 0);
    float radius = v > 0 ? (float)(v > 200 ? 200 : v) : f.stock;
    MonoString *key = mono_string_new(mono_domain_get(), f.token);
    void *get_args[1] = {key};
    MonoObject *boxed = call(shapes, "get_Item", 1, get_args, "shapes");
    if (!boxed) {
      zt_log("shapes: %s does not exist", f.token);
      continue;
    }
    const float before = *static_cast<float *>(mono_object_unbox(boxed));
    if (before == radius)
      continue;
    void *set_args[2] = {key, &radius};
    bool set = false;
    call(shapes, "set_Item", 2, set_args, "shapes", &set); /* void */
    /* what the widgets will read (StyleManager.GetTokenShape) */
    int none = 0;
    void *ask_args[2] = {key, &none};
    MonoObject *now = call(style_manager, "GetTokenShape", 2, ask_args, "shapes");
    zt_log("shapes: %s %g -> %g (set=%d, resolved %g)", f.token, before,
                   radius, set ? 1 : 0,
                   now ? *static_cast<float *>(mono_object_unbox(now)) : -1.0f);
  }
}

/*
 * The frame that already exists keeps the colour it read from the tokens
 * when it was created (GetTokenColor returns the new colour, the screen does
 * not change), so its elements are recoloured directly:
 *   FocusManager.Renderer (static) -> focusRenderManagers (List)
 *   -> the UI3 FocusRenderManager -> currentFocusWidget and
 *      renderWidgetListByScene (UIDictionary<Scene, FocusRenderWidget>:
 *      entries[] of {key, value}, size)
 *   -> each widget's lineFocusElement / areaFocusElement -> set_ThemeColor
 */
MonoObject *field_object(MonoObject *obj, const char *name) {
  for (MonoClass *k = obj ? mono_object_get_class(obj) : nullptr; k;
       k = k->parent) {
    if (MonoClassField *f = mono_class_get_field_from_name(k, name)) {
      MonoObject *v = nullptr;
      mono_field_get_value(obj, f, &v);
      return v;
    }
  }
  return nullptr;
}

int field_int(MonoObject *obj, const char *name) {
  for (MonoClass *k = obj ? mono_object_get_class(obj) : nullptr; k;
       k = k->parent) {
    if (MonoClassField *f = mono_class_get_field_from_name(k, name)) {
      int v = 0;
      mono_field_get_value(obj, f, &v);
      return v;
    }
  }
  return 0;
}

std::vector<MonoObject *> focus_widgets() {
  std::vector<MonoObject *> out;
  auto add = [&](MonoObject *w) {
    if (!w)
      return;
    for (MonoObject *e : out)
      if (e == w)
        return;
    out.push_back(w);
  };
  MonoClass *fm =
      mono_class_from_name(g_pui, "Sce.PlayStation.PUI", "FocusManager");
  MonoMethod *get = fm ? find_method(fm, "get_Renderer", 0) : nullptr;
  MonoObject *exc = nullptr;
  MonoObject *renderer =
      get ? mono_runtime_invoke(get, nullptr, nullptr, &exc) : nullptr;
  MonoObject *list =
      renderer && !exc ? field_object(renderer, "focusRenderManagers") : nullptr;
  MonoArray *items =
      list ? reinterpret_cast<MonoArray *>(field_object(list, "_items"))
           : nullptr;
  const int count = list ? field_int(list, "_size") : 0;
  for (int i = 0; items && i < count; ++i) {
    MonoObject *m = mono_array_get(items, MonoObject *, i);
    MonoClass *mk = m ? mono_object_get_class(m) : nullptr;
    if (!mk || strcmp(mk->name, "FocusRenderManager") != 0 ||
        strcmp(mk->name_space, "Sce.PlayStation.PUI.UI3") != 0)
      continue;
    add(field_object(m, "currentFocusWidget"));
    MonoObject *dict = field_object(m, "renderWidgetListByScene");
    MonoArray *entries =
        dict ? reinterpret_cast<MonoArray *>(field_object(dict, "entries"))
             : nullptr;
    const int size = dict ? field_int(dict, "size") : 0;
    for (int j = 0; entries && j < size; ++j) {
      /* Entry { TKey key; TValue value; }: two references */
      char *entry = mono_array_addr_with_size(entries, 16, (uintptr_t)j);
      MonoObject *w = nullptr;
      if (entry)
        memcpy(&w, entry + 8, sizeof(w));
      add(w);
    }
  }
  if (!renderer || !list)
    zt_log("focus: renderer=%d list=%d; no focus widgets",
                   renderer != nullptr, list != nullptr);
  return out;
}

unsigned char g_element_stock[2][kUiColorBytes];
bool g_element_saved[2] = {false, false};
bool g_element_changed[2] = {false, false};
float g_thickness_stock = -1;

/* line (0) or area (1) element of every focus widget */
void colour_elements(const float *colour, int which, bool hide) {
  const char *field = which == 0 ? "lineFocusElement" : "areaFocusElement";
  const std::vector<MonoObject *> widgets = focus_widgets();
  int done = 0;
  for (MonoObject *w : widgets) {
    MonoObject *el = field_object(w, field);
    if (!el)
      continue;
    if (!g_element_saved[which]) {
      if (MonoObject *boxed = call(el, "get_ThemeColor", 0, nullptr, field)) {
        memcpy(g_element_stock[which], mono_object_unbox(boxed), kUiColorBytes);
        g_element_saved[which] = true;
        float c[4];
        memcpy(c, g_element_stock[which], sizeof(c));
        zt_log("focus: %s stock ThemeColor %d %d %d alpha %.3f", field,
                       (int)(c[0] * 255 + 0.5f), (int)(c[1] * 255 + 0.5f),
                       (int)(c[2] * 255 + 0.5f), c[3]);
      }
    }
    unsigned char value[32] = {};
    if (g_element_saved[which])
      memcpy(value, g_element_stock[which], kUiColorBytes);
    if (colour)
      memcpy(value, colour, sizeof(float) * 4);
    if (hide)
      memset(value + 12, 0, sizeof(float));
    if (!colour && !hide && !g_element_changed[which])
      continue; /* never touched: leave stock */
    void *args[1] = {value};
    bool ok = false;
    call(el, "set_ThemeColor", 1, args, field, &ok);
    done += ok;
  }
  g_element_changed[which] = colour != nullptr || hide;
  zt_log("focus: %s ThemeColor set on %d of %zu widgets", field, done,
                 widgets.size());
}

/*
 * The white of the frame (and its moving shimmer) does not come from any of
 * those colours (ThemeColor is 255,255,255 alpha 0 = unused): the shader
 * samples FocusElement.ColorTableTexture, generated from the static
 * UI3.FocusRenderManager.DefaultColorTable (List<UIColor>) by
 * GenerateColorTableTexture. A tinted copy of that table becomes a new
 * texture, set on every line/area element; the stock texture is kept (pinned
 * GC handle) to put back.
 */
constexpr size_t kTableMax = 64;
unsigned char g_table_stock[kTableMax][kUiColorBytes];
int g_table_size = -1;
MonoObject *g_stock_texture = nullptr;
bool g_line_changed = false, g_area_changed = false, g_shared_changed = false;
uint32_t g_texture_handles[2] = {0, 0}; /* line, area */
/* what every frame gets when it binds to a widget (null = leave as is) */
MonoObject *g_bind_texture[2] = {nullptr, nullptr}; /* line, area */
float g_bind_thickness = -1;
float g_bind_offset = 0;   /* focoAfastamento */
float g_bind_stroke = -1;  /* focoPosicaoTraco (-1 = stock) */
float g_bind_shift = 0;    /* focoDeslocamento */
float g_bind_corners = -1; /* focoCantos (multiplier) */
/* esconderFoco: 1 = elements hidden (UINode.Visible false), 0 = shown */
int g_focus_hidden = -1;

/* What a table entry becomes (nullptr tint = stock colour). */
struct TableLook {
  const float *tint; /* RGBA 0-1 */
  bool solid;        /* every entry the tint (no shimmer) */
  float alpha;       /* multiplies the entry alpha (0 hides) */
  float gain;        /* focoIntensidade: multiplies RGB; above 1 the entry is HDR */
  bool rainbow;      /* focusRainbow: the table goes round the colour wheel (the shimmer runs it) */
};

/* hue 0..1 at full saturation and value */
void rainbow_rgb(float hue, float *c) {
  const float h = (hue - (float)(int)hue) * 6;
  const int i = (int)h;
  const float f = h - (float)i;
  const float rgb[6][3] = {{1, f, 0}, {1 - f, 1, 0}, {0, 1, f}, {0, 1 - f, 1}, {f, 0, 1}, {1, 0, 1 - f}};
  for (int k = 0; k < 3; ++k)
    c[k] = rgb[i < 0 ? 0 : i > 5 ? 5 : i][k];
}

/* Texture of the stock table recoloured by look, or null. */
MonoObject *make_table_texture(MonoClass *mgr, MonoObject *list,
                               MonoArray *items, const TableLook &look,
                               int slot) {
  for (int i = 0; i < g_table_size; ++i) {
    float c[4];
    memcpy(c, g_table_stock[i], sizeof(c));
    const float light = c[0] > c[1] ? (c[0] > c[2] ? c[0] : c[2])
                                    : (c[1] > c[2] ? c[1] : c[2]);
    if (look.rainbow) {
      float w[3];
      rainbow_rgb((float)i / (float)(g_table_size > 0 ? g_table_size : 1), w);
      for (int k = 0; k < 3; ++k)
        c[k] = w[k] * (light > 0.5f ? light : 0.5f);
      if (look.tint)
        c[3] = look.tint[3];
    } else if (look.tint) {
      for (int k = 0; k < 3; ++k)
        c[k] = look.solid ? look.tint[k] : look.tint[k] * light;
      c[3] = look.tint[3];
    }
    c[3] *= look.alpha;
    for (int k = 0; k < 3; ++k)
      c[k] *= look.gain;
    unsigned char *entry = reinterpret_cast<unsigned char *>(
        mono_array_addr_with_size(items, (int)kUiColorBytes, (uintptr_t)i));
    memcpy(entry, c, sizeof(c));
    /* UIColor = R,G,B,A + bool HdrColor: brighter than white needs the flag */
    if (look.gain > 1)
      entry[sizeof(c)] = 1;
  }
  MonoMethod *gen = find_method(mgr, "GenerateColorTableTexture", 1);
  MonoObject *exc = nullptr;
  void *args[1] = {list};
  MonoObject *texture =
      gen ? mono_runtime_invoke(gen, nullptr, args, &exc) : nullptr;
  /* the static list goes back to stock for anything else that reads it */
  for (int i = 0; i < g_table_size; ++i)
    memcpy(mono_array_addr_with_size(items, (int)kUiColorBytes, (uintptr_t)i),
           g_table_stock[i], kUiColorBytes);
  if (!texture || exc) {
    zt_log("focus: GenerateColorTableTexture %s",
                   gen ? "threw" : "not found");
    return nullptr;
  }
  if (g_texture_handles[slot])
    mono_gchandle_free(g_texture_handles[slot]);
  g_texture_handles[slot] = mono_gchandle_new(texture, true); /* pinned */
  return texture;
}

/* field "lineFocusElement" or "areaFocusElement" of every focus widget */
void set_table_texture(const char *field, MonoObject *texture) {
  int done = 0;
  for (MonoObject *w : focus_widgets()) {
    MonoObject *el = field_object(w, field);
    if (!el)
      continue;
    void *args[1] = {texture};
    bool ok = false;
    call(el, "set_ColorTableTexture", 1, args, field, &ok);
    done += ok;
  }
  zt_log("focus: %s colour table set on %d widgets", field, done);
}

/*
 * Frames created later (the hub's scene when going down to the game title)
 * take FocusRenderManager.ColorTableTexture.Value: the value stored in that
 * Lazy<Texture2D> is replaced too, so they are born with the theme.
 */
void set_shared_texture(MonoClass *mgr, MonoObject *texture) {
  MonoMethod *get = find_method(mgr, "get_ColorTableTexture", 0);
  MonoObject *exc = nullptr;
  MonoObject *lazy = get ? mono_runtime_invoke(get, nullptr, nullptr, &exc)
                         : nullptr;
  if (!lazy || exc || !mono_field_set_value) {
    zt_log("focus: shared ColorTableTexture unavailable");
    return;
  }
  MonoClass *lk = mono_object_get_class(lazy);
  for (const char *name : {"_value", "m_value"}) {
    MonoClassField *f = nullptr;
    for (MonoClass *k = lk; k && !f; k = k->parent)
      f = mono_class_get_field_from_name(k, name);
    if (!f)
      continue;
    mono_field_set_value(lazy, f, texture); /* reference: the object itself */
    zt_log("focus: shared ColorTableTexture (%s) replaced", name);
    return;
  }
  zt_log("focus: Lazy value field not found");
}

void apply_color_table(const TableLook &line, const TableLook &area) {
  MonoClass *mgr = mono_class_from_name(g_pui, "Sce.PlayStation.PUI.UI3",
                                        "FocusRenderManager");
  MonoClassField *field =
      mgr ? mono_class_get_field_from_name(mgr, "DefaultColorTable") : nullptr;
  MonoVTable *vt = mgr ? mono_class_vtable(mono_domain_get(), mgr) : nullptr;
  if (!field || !vt || !mono_field_static_get_value) {
    zt_log("focus: DefaultColorTable unavailable (field=%d vt=%d "
                   "getter=%d)",
                   field != nullptr, vt != nullptr,
                   mono_field_static_get_value != nullptr);
    return;
  }
  MonoObject *list = nullptr;
  mono_field_static_get_value(vt, field, &list);
  MonoArray *items =
      list ? reinterpret_cast<MonoArray *>(field_object(list, "_items"))
           : nullptr;
  const int size = list ? field_int(list, "_size") : 0;
  if (!items || size <= 0 || size > (int)kTableMax) {
    zt_log("focus: DefaultColorTable list=%d size=%d", list != nullptr,
                   size);
    return;
  }

  if (g_table_size < 0) {
    g_table_size = size;
    for (int i = 0; i < size; ++i) {
      memcpy(g_table_stock[i],
             mono_array_addr_with_size(items, (int)kUiColorBytes, (uintptr_t)i),
             kUiColorBytes);
      float c[4];
      memcpy(c, g_table_stock[i], sizeof(c));
      zt_log("focus: colour table[%d] = %.3f %.3f %.3f alpha %.3f", i,
                     c[0], c[1], c[2], c[3]);
    }
    /* the texture the elements use now, kept to put back */
    for (MonoObject *w : focus_widgets()) {
      MonoObject *el = field_object(w, "lineFocusElement");
      MonoObject *tex =
          el ? call(el, "get_ColorTableTexture", 0, nullptr, "line") : nullptr;
      if (tex) {
        mono_gchandle_new(tex, true); /* pinned: the pointer stays valid */
        g_stock_texture = tex;
        break;
      }
    }
  }

  const bool line_on = line.tint || line.rainbow || line.alpha < 1 || line.gain != 1;
  const bool area_on = area.tint || area.rainbow || area.alpha < 1 || area.gain != 1;
  MonoObject *line_tex =
      line_on ? make_table_texture(mgr, list, items, line, 0) : nullptr;
  MonoObject *area_tex =
      area_on ? make_table_texture(mgr, list, items, area, 1) : nullptr;

  if (line_tex)
    set_table_texture("lineFocusElement", line_tex);
  else if (g_line_changed && g_stock_texture)
    set_table_texture("lineFocusElement", g_stock_texture);
  if (area_tex)
    set_table_texture("areaFocusElement", area_tex);
  else if (g_area_changed && g_stock_texture)
    set_table_texture("areaFocusElement", g_stock_texture);
  g_bind_texture[0] = line_tex ? line_tex
                    : g_line_changed ? g_stock_texture
                                     : g_bind_texture[0];
  g_bind_texture[1] = area_tex ? area_tex
                    : g_area_changed ? g_stock_texture
                                     : g_bind_texture[1];
  g_line_changed = line_tex != nullptr;
  g_area_changed = area_tex != nullptr;

  /* frames created later get the line look for both line and glow */
  if (line_tex)
    set_shared_texture(mgr, line_tex);
  else if (g_shared_changed && g_stock_texture)
    set_shared_texture(mgr, g_stock_texture);
  g_shared_changed = line_tex != nullptr;
}

/* Experiment: LineFocusElement.Thickness (FocusRenderWidget uses 3) */
void set_line_thickness(double thickness) {
  for (MonoObject *w : focus_widgets()) {
    MonoObject *line = field_object(w, "lineFocusElement");
    if (!line)
      continue;
    if (g_thickness_stock < 0) {
      if (MonoObject *boxed = call(line, "get_Thickness", 0, nullptr, "line")) {
        memcpy(&g_thickness_stock, mono_object_unbox(boxed), sizeof(float));
        zt_log("focus: stock Thickness %.2f", g_thickness_stock);
      }
    }
    /* 0 = stock: the widget writes its own value every frame, so nothing is
       written back (kept writing the first value read, which froze the
       frame at that thickness even after "Repor PS5") */
    g_bind_thickness = thickness > 0 ? (float)thickness : -1;
  }
}

/*
 * Every scene (Home, game hub, settings, options) gets its own
 * FocusRenderWidget, made when the focus first goes there, and those do not
 * take the textures above. FocusRenderWidget.Bind(target, renderTarget) runs
 * each time a frame attaches to a widget: the theme is put on it there.
 */
void (*g_bind_orig)(MonoObject *, MonoObject *, MonoObject *) = nullptr;

void theme_widget(MonoObject *w) {
  static const char *const kElements[2] = {"lineFocusElement",
                                           "areaFocusElement"};
  for (int i = 0; i < 2; ++i) {
    MonoObject *el = g_bind_texture[i] ? field_object(w, kElements[i]) : nullptr;
    if (!el)
      continue;
    void *args[1] = {g_bind_texture[i]};
    call(el, "set_ColorTableTexture", 1, args, kElements[i]);
  }
  /* the colour table's alpha is not used by the shader: hide the nodes */
  if (g_focus_hidden >= 0)
    for (int i = 0; i < 2; ++i)
      if (MonoObject *el = field_object(w, kElements[i])) {
        bool visible = g_focus_hidden == 0;
        void *args[1] = {&visible};
        call(el, "set_Visible", 1, args, kElements[i]);
      }
  /* a thicker or farther frame goes past the widget's own box, which clips
     its children (square corners ): stop the clipping while
     focoEspessura/focoAfastamento are on, put it back when they are off */
  static int clip_stock = -1; /* stock ClipChildren, read once */
  const bool shape = g_bind_thickness > 0 || g_bind_offset != 0 || g_bind_shift != 0;
  if (shape || clip_stock >= 0) {
    if (clip_stock < 0) {
      if (MonoObject *boxed = call(w, "get_ClipChildren", 0, nullptr, "widget")) {
        clip_stock = *static_cast<bool *>(mono_object_unbox(boxed)) ? 1 : 0;
        zt_log("focus: widget ClipChildren stock %d", clip_stock);
      }
    }
    if (clip_stock >= 0) {
      bool clip = shape ? false : clip_stock == 1;
      void *args[1] = {&clip};
      call(w, "set_ClipChildren", 1, args, "widget");
    }
  }
}

/*
 * The widget writes LineFocusElement.Thickness again every frame (setting it
 * once in early versions did nothing), most likely in SyncRenderParam(); after it
 * runs, the theme's thickness is written back.
 */
void (*g_sync_orig)(MonoObject *) = nullptr;
MonoMethod *g_set_thickness = nullptr;

/*
 * The frame shape after the widget wrote it (every frame, animations
 * included). The line is drawn inside the LineFocusElement's own rectangle,
 * which the widget sizes with fixed margins: making the line thicker or
 * pushing it out with Offset got it cut square at that rectangle. So:
 *   focoEspessura     Thickness x focoEspessura / 6 (SyncRenderParam)
 *   focoPosicaoTraco  StrokePosition (experimental; -1 = stock)
 *   focoDeslocamento  Offset + value (experimental; 0 = stock)
 *   focoCantos        RadiusPixel
 *   the rectangle grows by the extra thickness + focoAfastamento on every
 *   side (ApplyMarginToRect): the line moves out with it
 * Each value is only changed when the widget wrote a fresh one (a value
 * equal to what was written here last time is left alone: no compounding),
 * and what the theme wrote is put back when its field returns to stock.
 */
MonoMethod *g_get_thickness = nullptr, *g_get_radius = nullptr,
           *g_set_radius = nullptr, *g_get_offset = nullptr, *g_set_offset = nullptr,
           *g_get_stroke = nullptr, *g_set_stroke = nullptr, *g_get_tpix = nullptr,
           *g_set_tpix = nullptr, *g_get_opix = nullptr, *g_set_opix = nullptr;
struct ShapeSeen {
  MonoObject *line;
  float thickness, radius, delta; /* delta: extra thickness this frame */
  float offset, offset_stock;     /* written Offset and the widget's own */
  bool offset_set, stroke_set, geom_set;
  float stroke_stock;
};
ShapeSeen g_shape_seen[16] = {};
unsigned g_shape_next = 0;
bool g_shape_logged = false;

float read_float(MonoMethod *get, MonoObject *obj, bool *ok) {
  MonoObject *exc = nullptr;
  MonoObject *boxed = mono_runtime_invoke(get, obj, nullptr, &exc);
  float v = 0;
  *ok = boxed && !exc;
  if (*ok)
    memcpy(&v, mono_object_unbox(boxed), sizeof(v));
  return v;
}

void write_float(MonoMethod *set, MonoObject *obj, float v) {
  MonoObject *exc = nullptr;
  void *args[1] = {&v};
  mono_runtime_invoke(set, obj, args, &exc);
}

ShapeSeen *shape_of(MonoObject *line) {
  for (ShapeSeen &t : g_shape_seen)
    if (t.line == line)
      return &t;
  ShapeSeen *t = &g_shape_seen[g_shape_next++ % 16];
  *t = ShapeSeen{};
  t->line = line;
  t->thickness = t->radius = -1;
  return t;
}

bool shape_methods(MonoObject *line) {
  if (!g_set_thickness) {
    MonoClass *k = mono_object_get_class(line);
    g_set_thickness = find_method(k, "set_Thickness", 1);
    g_get_thickness = find_method(k, "get_Thickness", 0);
    g_get_radius = find_method(k, "get_RadiusPixel", 0);
    g_set_radius = find_method(k, "set_RadiusPixel", 1);
    g_get_offset = find_method(k, "get_Offset", 0);
    g_set_offset = find_method(k, "set_Offset", 1);
    g_get_stroke = find_method(k, "get_StrokePosition", 0);
    g_set_stroke = find_method(k, "set_StrokePosition", 1);
    g_get_tpix = find_method(k, "get_ThicknessPixel", 0);
    g_set_tpix = find_method(k, "set_ThicknessPixel", 1);
    g_get_opix = find_method(k, "get_OffsetPixel", 0);
    g_set_opix = find_method(k, "set_OffsetPixel", 1);
  }
  return g_set_thickness && g_get_thickness && g_get_radius && g_set_radius;
}

/* every float property of the line element, for the log */
void log_line_props(MonoObject *line, const char *when) {
  static const char *const names[] = {
      "Thickness", "ThicknessPixel", "Offset", "OffsetPixel", "StrokePosition",
      "InOutScale", "Radius", "RadiusPixel", "Pixel", "Ratio", "Showing", "ShowAlpha",
      "Moving", "Pressing"};
  MonoClass *k = mono_object_get_class(line);
  std::string out;
  for (const char *n : names) {
    MonoMethod *get = find_method(k, (std::string("get_") + n).c_str(), 0);
    bool ok = false;
    const float v = get ? read_float(get, line, &ok) : 0;
    char buf[64];
    if (ok)
      snprintf(buf, sizeof(buf), " %s=%.3f", n, v);
    else
      snprintf(buf, sizeof(buf), " %s=?", n);
    out += buf;
  }
  zt_log("focus: line (%s):%s", when, out.c_str());
}

/* field offsets SyncTransform_Hook checked against the FW 9.60 code */
struct FrameOffsets {
  bool ready, ok;
  int rect, line, area, target, inout;
};
FrameOffsets g_frame_off = {};
struct Rect {
  float x, y, w, h;
};
bool frame_offsets(MonoObject *self, MonoObject *line);

template <typename T> T at(MonoObject *obj, int offset) {
  T v;
  memcpy(&v, reinterpret_cast<const char *>(obj) + offset, sizeof(v));
  return v;
}

/* how much the frame rectangle grows on every side (SyncTransform_Hook) */
float frame_growth() {
  return (g_bind_thickness > 0 ? (g_bind_thickness - 6.0f) * 0.5f : 0) + g_bind_offset;
}

/*
 * SyncRenderParam writes the line's corner radius every frame from the
 * target: RadiusPixel = currentRadius, Radius = currentRadius / scale
 * (code dump). The target rectangle is on screen, so it includes the
 * theme's transform scale (definicoesEscala 1.7, perfilEscala 1.5), but the
 * radius is the button's own borderRadius, unscaled: a round icon (radius =
 * half the side) scaled 1.7x got radius = side/3.4 and a rounded square
 * frame (photos; the unscaled "Som" icon stayed round).
 * A near-square target whose radius is 20%..50% of its side is taken as
 * round: RadiusPixel = side/2 (Radius scaled the same). Tiles (8/500) and
 * cards are far below that. Only a value the widget just wrote is changed.
 * (grew the radius by the frame growth instead: no visible change.)
 */
MonoMethod *g_get_rnorm = nullptr, *g_set_rnorm = nullptr;
struct RadiusSeen {
  MonoObject *line;
  float written;
};
RadiusSeen g_radius_seen[16] = {};
unsigned g_radius_next = 0;
int g_radius_logs = 0;

void round_line_radius(MonoObject *self, MonoObject *line, bool corners) {
  if (corners || !frame_offsets(self, line))
    return;
  if (!g_get_rnorm) {
    MonoClass *k = mono_object_get_class(line);
    g_get_rnorm = find_method(k, "get_Radius", 0);
    g_set_rnorm = find_method(k, "set_Radius", 1);
  }
  if (!g_get_rnorm || !g_set_rnorm)
    return;
  RadiusSeen *seen = nullptr;
  for (RadiusSeen &t : g_radius_seen)
    if (t.line == line)
      seen = &t;
  if (!seen) {
    seen = &g_radius_seen[g_radius_next++ % 16];
    *seen = RadiusSeen{line, -1};
  }
  bool ok1 = false, ok2 = false;
  const float rp = read_float(g_get_radius, line, &ok1);
  const float rn = read_float(g_get_rnorm, line, &ok2);
  if (!ok1 || !ok2 || !(rp > 0) || rp == seen->written)
    return;
  const Rect r = at<Rect>(self, g_frame_off.rect);
  const float side = std::min(r.w, r.h);
  if (!(side > 0) || std::fabs(r.w - r.h) > 0.05f * side)
    return;
  const float ratio = rp / side;
  if (ratio < 0.2f || ratio >= 0.499f)
    return;
  const float rp2 = side * 0.5f;
  write_float(g_set_radius, line, rp2);
  write_float(g_set_rnorm, line, rn * rp2 / rp);
  seen->written = rp2;
  if (g_radius_logs < 6) {
    g_radius_logs++;
    zt_log("focus: round target %.1fx%.1f radius %.2f (norm %.4f) -> %.2f", r.w, r.h, rp,
                   rn, rp2);
  }
}

void SyncRenderParam_Hook(MonoObject *self) {
  g_sync_orig(self);
  if (g_quit || !self)
    return;
  MonoObject *line = field_object(self, "lineFocusElement");
  static bool stock_logged = false;
  if (line && !stock_logged) {
    stock_logged = true;
    log_line_props(line, "stock");
  }
  if (!line || !shape_methods(line))
    return;
  const bool thick = g_bind_thickness > 0, corners = g_bind_corners > 0;
  /* Offset itself stays stock: pushing it out made the frame vanish from
     7 up; the outward growth comes from the rectangle instead
     (ApplyMargin_Hook) */
  const float push = g_bind_shift;
  const bool stroke = g_bind_stroke >= 0, shift = push != 0;
  ShapeSeen *seen = shape_of(line);
  bool ok = false;
  float t0 = 0, r0 = 0;
  if (thick) {
    t0 = read_float(g_get_thickness, line, &ok);
    if (ok && t0 != seen->thickness) {
      const float t1 = t0 * g_bind_thickness / 6.0f;
      seen->delta = t1 - t0;
      seen->thickness = t1;
      write_float(g_set_thickness, line, t1);
    }
  }
  /* RadiusPixel reads 0 (= automatic from the target): focoCantos is the
     radius in pixels, written when the widget put its own value back */
  if (corners) {
    r0 = read_float(g_get_radius, line, &ok);
    if (ok && r0 != seen->radius) {
      seen->radius = g_bind_corners;
      write_float(g_set_radius, line, seen->radius);
    }
  }
  if (g_get_stroke && g_set_stroke && (stroke || seen->stroke_set)) {
    const float s0 = read_float(g_get_stroke, line, &ok);
    if (ok && stroke && s0 != g_bind_stroke) {
      if (!seen->stroke_set)
        seen->stroke_stock = s0;
      seen->stroke_set = true;
      write_float(g_set_stroke, line, g_bind_stroke);
    } else if (ok && !stroke) {
      write_float(g_set_stroke, line, seen->stroke_stock);
      seen->stroke_set = false;
    }
  }
  if (g_get_offset && g_set_offset && (shift || seen->offset_set)) {
    const float o0 = read_float(g_get_offset, line, &ok);
    if (ok && shift && o0 != seen->offset) {
      seen->offset_stock = o0;
      seen->offset = o0 + push;
      seen->offset_set = true;
      write_float(g_set_offset, line, seen->offset);
    } else if (ok && !shift) {
      if (o0 == seen->offset)
        write_float(g_set_offset, line, seen->offset_stock);
      seen->offset_set = false;
      seen->offset = 0;
    }
  }
  /* the geometry (code dump of ZhiThemes 22): the quad the line is drawn on
     reaches ThicknessPixel + OffsetPixel past the frame rectangle
     (LineFocusElement.RenderFocusElement); the widget's constructor sets
     both to 3 and nothing changes them again, while the shader gets
     Thickness/Offset (6/6, twice those). A thicker or farther line without
     a bigger quad was cut, which is what looked wrong. */
  if (g_get_tpix && g_set_tpix && g_get_opix && g_set_opix &&
      (thick || shift || seen->geom_set)) {
    const float want_t = thick ? 3.0f * g_bind_thickness / 6.0f : 3.0f;
    const float want_o = std::max(0.0f, 3.0f + push * 0.5f);
    bool ok1 = false, ok2 = false;
    const float tp = read_float(g_get_tpix, line, &ok1);
    const float op = read_float(g_get_opix, line, &ok2);
    if (ok1 && tp != want_t)
      write_float(g_set_tpix, line, want_t);
    if (ok2 && op != want_o)
      write_float(g_set_opix, line, want_o);
    seen->geom_set = thick || shift;
  }
  round_line_radius(self, line, corners);
  if (!g_shape_logged && (thick || corners || stroke || shift)) {
    g_shape_logged = true;
    log_line_props(line, "theme");
  }
}

/*
 * The frame rectangle. ApplyMarginToRect is inlined into SyncTransform (* hooked, never called), so SyncTransform itself is hooked and its result
 * redone after it runs. From an early code dump (SyncTransform @0x82c166250):
 *   r = currentPositionRect (target rect, animated), s = inOutScale
 *   W = s*w + 15*s, H = s*h + 15*s          (7.5 = 3 + 3 + 1.5 per side)
 *   X = r.x - (W - w)/2, Y = r.y - (H - h)/2
 *   widget.SetPosition(X, Y); widget.SetSize(W, H)
 *   line.SetSize(W, H)                      (the line fills the widget)
 *   area.SetPosition(r.x - X, r.y - Y); area.SetSize(w, h)
 *   line.InOutScale = s
 * The hook grows widget and line by m*s on every side and moves the area
 * back by the same, so the glow stays on the target.
 * m = extra thickness + focoAfastamento: the line's outer edge sits at the
 * rectangle and Thickness grows inwards from it (photo, focoEspessura
 * 60; shader units are twice the rectangle's, 6 <-> 3), so with the
 * rectangle m bigger the inner edge stays where it was and the line grows
 * outwards. Rectangle = { float X, Y, Width, Height }.
 */
void (*g_transform_orig)(MonoObject *) = nullptr;
bool g_transform_logged = false;

/* instance field offset (MonoObject header included), -1 when missing */
int field_offset(MonoClass *k, const char *name) {
  for (; k; k = k->parent)
    if (MonoClassField *f = mono_class_get_field_from_name(k, name))
      return mono_field_get_offset ? (int)mono_field_get_offset(f) : -1;
  return -1;
}

bool frame_offsets(MonoObject *self, MonoObject *line) {
  if (g_frame_off.ready)
    return g_frame_off.ok;
  g_frame_off.ready = true;
  MonoClass *w = mono_object_get_class(self);
  g_frame_off.rect = field_offset(w, "currentPositionRect");
  g_frame_off.line = field_offset(w, "lineFocusElement");
  g_frame_off.area = field_offset(w, "areaFocusElement");
  g_frame_off.target = field_offset(w, "<RenderTarget>k__BackingField");
  g_frame_off.inout = field_offset(mono_object_get_class(line), "<InOutScale>k__BackingField");
  /* the code read above uses exactly these (FW 9.60); anything else means
     another build: the hook stays out of the way */
  g_frame_off.ok = g_frame_off.rect == 0x4c0 && g_frame_off.line == 0x3e8 &&
                   g_frame_off.area == 0x3f0 && g_frame_off.target == 0x400 &&
                   g_frame_off.inout == 0x1ec;
  zt_log("focus: fields rect %#x line %#x area %#x target %#x inOut %#x -> %s",
                 g_frame_off.rect, g_frame_off.line, g_frame_off.area, g_frame_off.target,
                 g_frame_off.inout, g_frame_off.ok ? "ok" : "different, hook stopped");
  return g_frame_off.ok;
}

/* SetPosition/SetSize(float, float) of the object's most derived class */
bool call2(MonoObject *obj, const char *name, float a, float b) {
  void *args[2] = {&a, &b};
  bool ok = false;
  call(obj, name, 2, args, "frame", &ok);
  return ok;
}

void SyncTransform_Hook(MonoObject *self) {
  g_transform_orig(self);
  if (g_quit || !self)
    return;
  const float m = frame_growth();
  if (m == 0)
    return;
  MonoObject *line = field_object(self, "lineFocusElement");
  if (!line || !frame_offsets(self, line))
    return;
  /* no render target: SyncTransform returned before sizing anything */
  if (!at<void *>(self, g_frame_off.target))
    return;
  MonoObject *area = at<MonoObject *>(self, g_frame_off.area);
  const Rect r = at<Rect>(self, g_frame_off.rect);
  const float s = at<float>(line, g_frame_off.inout);
  if (!(s > 0) || !(r.w > 0) || !(r.h > 0))
    return;
  const float W = s * r.w + 15 * s, H = s * r.h + 15 * s;
  const float X = r.x - (W - r.w) * 0.5f, Y = r.y - (H - r.h) * 0.5f;
  const float g = m * s;
  const float X2 = X - g, Y2 = Y - g, W2 = W + 2 * g, H2 = H + 2 * g;
  bool ok = call2(self, "SetPosition", X2, Y2) && call2(self, "SetSize", W2, H2) &&
            call2(line, "SetSize", W2, H2);
  if (ok && area)
    ok = call2(area, "SetPosition", r.x - X2, r.y - Y2);
  if (!g_transform_logged) {
    g_transform_logged = true;
    zt_log("focus: target %.1f %.1f %.1f %.1f (inOut %.3f) -> frame %.1f %.1f %.1f %.1f, "
                   "grows %.1f -> %.1f %.1f %.1f %.1f %s",
                   r.x, r.y, r.w, r.h, s, X, Y, W, H, g, X2, Y2, W2, H2, ok ? "ok" : "FAILED");
  }
}

/* the address the hooks use, logged with why a hook did not go in */
uint64_t method_address(const char *klass, const char *method, int params) {
  return Get_Address_of_Method(g_pui, "Sce.PlayStation.PUI.UI3", klass, method, params);
}

/* SyncRenderParam: always (it logs the line's stock values once) */
void hook_thickness() {
  static bool tried = false;
  if (tried)
    return;
  tried = true;
  const uint64_t sync = method_address("FocusRenderWidget", "SyncRenderParam", 0);
  const bool ok =
      sync && zt_hook(sync, reinterpret_cast<void *>(&SyncRenderParam_Hook),
                            reinterpret_cast<void **>(&g_sync_orig));
  zt_log("focus: SyncRenderParam %#lx hook=%d", (unsigned long)sync, (int)ok);
}

/* SyncTransform: only when the frame has to grow (ApplyMarginToRect is
   inlined in it) */
void hook_margin() {
  static bool tried = false;
  if (tried)
    return;
  tried = true;
  const uint64_t transform = method_address("FocusRenderWidget", "SyncTransform", 0);
  const bool ok = transform && zt_hook(transform, reinterpret_cast<void *>(&SyncTransform_Hook),
                                       reinterpret_cast<void **>(&g_transform_orig));
  zt_log("focus: SyncTransform %#lx hook=%d", (unsigned long)transform, (int)ok);
}

void Bind_Hook(MonoObject *self, MonoObject *target, MonoObject *render) {
  g_bind_orig(self, target, render);
  if (self && !g_quit)
    theme_widget(self);
}

/*
 * The shimmer: each frame the widget asks CalcShimmerParam(time, speed,
 * frequency) and CalcNoiseChangeParam(time, frequency) (private statics) for
 * where the colour table / noise are; ShimmerSpeed 1, ShimmerFrequency 5 and
 * NoiseMoveFrequency 0.25 are compiled constants, so the time is scaled
 * instead: focoVelocidade 1 = stock, 0.5 = half speed, 0 = frozen.
 */
struct Vec2 {
  float x, y;
};
Vec2 (*g_shimmer_orig)(double, float, float) = nullptr;
Vec2 (*g_noise_orig)(double, float) = nullptr;
double g_anim_speed = 1;
bool g_anim_hooked = false;

Vec2 Shimmer_Hook(double time, float speed, float frequency) {
  return g_shimmer_orig(g_quit ? time : time * g_anim_speed, speed, frequency);
}

Vec2 Noise_Hook(double time, float frequency) {
  return g_noise_orig(g_quit ? time : time * g_anim_speed, frequency);
}

void hook_focus_widget() {
  static bool tried = false;
  if (tried)
    return;
  tried = true;
  const uint64_t bind = Get_Address_of_Method(g_pui, "Sce.PlayStation.PUI.UI3",
                                              "FocusRenderWidget", "Bind", 2);
  const bool ok = bind && zt_hook(bind, reinterpret_cast<void *>(&Bind_Hook),
                                        reinterpret_cast<void **>(&g_bind_orig));
  zt_log("focus: FocusRenderWidget.Bind hook=%d", (int)ok);
}

/* only installed the first time the speed is not 1 */
void set_animation_speed(double speed) {
  g_anim_speed = speed < 0 ? 0 : speed;
  if (g_anim_hooked || speed == 1)
    return;
  g_anim_hooked = true;
  const char *ns = "Sce.PlayStation.PUI.UI3";
  const uint64_t shimmer =
      Get_Address_of_Method(g_pui, ns, "FocusRenderWidget", "CalcShimmerParam", 3);
  const uint64_t noise = Get_Address_of_Method(g_pui, ns, "FocusRenderWidget",
                                               "CalcNoiseChangeParam", 2);
  const bool a = shimmer &&
                 zt_hook(shimmer, reinterpret_cast<void *>(&Shimmer_Hook),
                               reinterpret_cast<void **>(&g_shimmer_orig));
  const bool b = noise &&
                 zt_hook(noise, reinterpret_cast<void *>(&Noise_Hook),
                               reinterpret_cast<void **>(&g_noise_orig));
  zt_log("focus: animation hooks shimmer=%d noise=%d", (int)a, (int)b);
}

/* systemFont / elementFont paths (apply_system_font), read by the open() hook */
std::mutex g_font_lock;

void apply_focus_color(const std::string &script) {
  if (!g_pui) {
    zt_log("focus: Sce.PlayStation.PUI image missing");
    return;
  }
  MonoClass *ui_system =
      mono_class_from_name(g_pui, "Sce.PlayStation.PUI", "UISystem");
  MonoMethod *get_sm =
      ui_system ? find_method(ui_system, "get_StyleManager", 0) : nullptr;
  MonoObject *exc = nullptr;
  MonoObject *sm =
      get_sm ? mono_runtime_invoke(get_sm, nullptr, nullptr, &exc) : nullptr;
  if (!sm || exc) {
    zt_log("focus: UISystem.StyleManager unavailable");
    return;
  }
  MonoObject *colours = token_dictionary(sm, "ActiveColorToken");
  if (!colours)
    return;
  /* debug mode (Logs tab): every colour and shape token of this firmware
     goes to logs/, to compare consoles */
  if (!g_tokens_dumped && zt_debug_on()) {
    g_tokens_dumped = true;
    dump_tokens(colours, kTokenDumpColor, true);
    if (MonoObject *shapes = token_dictionary(sm, "ActiveShapeToken"))
      dump_tokens(shapes, kTokenDumpShape, false);
  }

  const auto channel = [&](const char *key, double fallback) {
    double v = theme_value(script, key, fallback);
    v = v < 0 ? 0 : v > 255 ? 255 : v;
    return (float)(v / 255.0);
  };
  const auto unit = [&](const char *key, double fallback) {
    double v = theme_value(script, key, fallback);
    return (float)(v < 0 ? 0 : v > 1 ? 1 : v);
  };
  const bool hide = theme_value(script, "hideFocus", 0) != 0;
  const bool line_on = theme_value(script, "focusLineColorOn", 0) != 0;
  const bool glow_on = theme_value(script, "focusGlowColorOn", 0) != 0;
  const float line[4] = {channel("focusLineR", 255), channel("focusLineG", 255),
                         channel("focusLineB", 255), unit("focusLineAlpha", 1)};
  const float glow[4] = {channel("focusGlowR", 255),
                         channel("focusGlowG", 255),
                         channel("focusGlowB", 255),
                         unit("focusGlowAlpha", 1)};

  for (SavedToken &t : g_focus_tokens)
    log_resolved(sm, t.key, "before");

  int in_set = 0;

  for (SavedToken &t : g_focus_tokens) {
    MonoString *key = mono_string_new(mono_domain_get(), t.key);
    void *get_args[1] = {key};
    if (!t.saved) {
      MonoObject *boxed = call(colours, "get_Item", 1, get_args, t.key);
      if (!boxed)
        continue;
      memcpy(t.value, mono_object_unbox(boxed), kUiColorBytes);
      t.saved = true;
      float c[4];
      memcpy(c, t.value, sizeof(c));
      zt_log("focus: %s stock %d %d %d alpha %.3f", t.key,
                     (int)(c[0] * 255 + 0.5f), (int)(c[1] * 255 + 0.5f),
                     (int)(c[2] * 255 + 0.5f), c[3]);
    }
    const bool is_line = &t == &g_focus_tokens[0];
    const bool on = is_line ? line_on : glow_on;
    unsigned char value[32] = {};
    memcpy(value, t.value, kUiColorBytes); /* stock, keeps the HDR flag */
    if (on)
      memcpy(value, is_line ? line : glow, sizeof(line));
    if (hide)
      memset(value + 12, 0, sizeof(float)); /* alpha 0 */
    void *set_args[2] = {key, value};
    bool written = false;
    call(colours, "set_Item", 2, set_args, t.key, &written);
    in_set += written;
  }
  zt_log("focus: tokens set (line %s, glow %s%s)",
                 line_on ? "theme" : "stock", glow_on ? "theme" : "stock",
                 hide ? ", hidden" : "");
  for (SavedToken &t : g_focus_tokens)
    log_resolved(sm, t.key, "after dictionary");

  /* the frames that already exist (see colour_elements) */
  colour_elements(line_on ? line : nullptr, 0, hide);
  colour_elements(glow_on ? glow : nullptr, 1, hide);
  /* what the frame really draws with: the colour table texture */
  const bool solid = theme_value(script, "focusAnimated", 1) == 0;
  const bool glow_hidden = theme_value(script, "hideGlow", 0) != 0;
  /* line = the frame, area = the glow drawn over/around it; with no glow
     colour of its own the glow follows the frame colour */
  double gain = theme_value(script, "focusIntensity", 1);
  gain = gain < 0.1 ? 0.1 : gain > 4 ? 4 : gain;
  const bool rainbow = theme_value(script, "focusRainbow", 0) != 0;
  const TableLook line_look = {line_on ? line : nullptr, solid,
                               hide ? 0.0f : 1.0f, (float)gain, rainbow};
  const TableLook area_look = {glow_on ? glow : line_on ? line : nullptr,
                               solid, hide || glow_hidden ? 0.0f : 1.0f, (float)gain,
                               rainbow && !glow_on};
  if (rainbow)
    zt_log("focus: rainbow colour table");
  if (gain != 1)
    zt_log("focus: intensity %.2f (HDR %s)", gain, gain > 1 ? "on" : "off");
  apply_color_table(line_look, area_look);
  const double thickness = theme_value(script, "focusThickness", 0);
  g_bind_offset = (float)theme_value(script, "focusGap", 0);
  const double corners = theme_value(script, "focusCorners", 0);
  g_bind_corners = corners > 0 ? (float)corners : -1;
  g_bind_stroke = -1; /* stock StrokePosition and Offset of the line */
  g_bind_shift = 0;
  if (thickness > 0 || g_thickness_stock >= 0)
    set_line_thickness(thickness);
  hook_focus_widget();
  hook_thickness();
  if (thickness > 0 || g_bind_offset != 0)
    hook_margin();
  if (hide || g_focus_hidden == 1 || thickness > 0 || g_bind_offset != 0 ||
      g_bind_shift != 0) {
    if (hide || g_focus_hidden == 1)
      g_focus_hidden = hide ? 1 : 0;
    for (MonoObject *w : focus_widgets())
      theme_widget(w);
    zt_log("focus: frame %s", hide ? "hidden (Visible false)" : "shown");
  }
  set_animation_speed(theme_value(script, "focusShimmerSpeed", 1));
  /* Debug_CommitColorTokenSet is NOT used: it replaces the whole token set
     with the few entries given, which blanked every other colour (button
     backgrounds, top bar icons) in v7. */
  (void)in_set;
  apply_token_overrides(colours, script);
  apply_shape_overrides(sm, script);
}

/*
 * The script that runs = the theme code built into this module (theme.js at
 * factory values) with the VALUES of the user's /data/.../theme.js: every
 * "key: value," of its var THEME block replaces the built-in one, and its
 * var TOKENS block replaces the built-in one. So a new module brings its own
 * code (fixes, new fields) while the user's file only keeps the choices;
 * fields the user's file does not have yet stay at factory values.
 */
struct Block {
  size_t from = std::string::npos, to = std::string::npos; /* inside { } */
};

Block find_block(const std::string &src, const char *head) {
  Block b;
  const size_t at = src.find(head);
  if (at == std::string::npos)
    return b;
  const size_t open = src.find('{', at);
  const size_t end = open == std::string::npos ? open : src.find("};", open);
  if (end == std::string::npos)
    return b;
  b.from = open + 1;
  b.to = end;
  return b;
}

bool is_ident(char c) { return isalnum((unsigned char)c) || c == '_'; }

/* "key: value" on one line: start/length of the value, or false */
bool line_value(const std::string &line, std::string *key, size_t *vstart,
                size_t *vlen) {
  size_t i = 0;
  while (i < line.size() && (line[i] == ' ' || line[i] == 9))
    ++i;
  const size_t k = i;
  while (i < line.size() && is_ident(line[i]))
    ++i;
  if (i == k || (line[k] >= '0' && line[k] <= '9'))
    return false;
  *key = line.substr(k, i - k);
  while (i < line.size() && line[i] == ' ')
    ++i;
  if (i >= line.size() || line[i] != ':')
    return false;
  ++i;
  while (i < line.size() && line[i] == ' ')
    ++i;
  if (i >= line.size())
    return false;
  size_t e = i;
  if (line[i] == 39) { /* quoted string */
    e = line.find((char)39, i + 1);
    if (e == std::string::npos)
      return false;
    ++e;
  } else {
    while (e < line.size() && line[e] != ',' && line[e] != ' ' && line[e] != '/')
      ++e;
  }
  *vstart = i;
  *vlen = e - i;
  return *vlen > 0;
}

/* A theme value is data only: a number, true/false or a 'string' without a
   backslash (a backslash before the closing quote would let the string run
   into the code after it). Anything else is left at the stock value, so a
   shared theme file can never put code into ShellUI. */
bool safe_value(const std::string &v) {
  if (v == "true" || v == "false")
    return true;
  if (v.size() >= 2 && v.front() == 39 && v.back() == 39)
    return v.find((char)92) == std::string::npos && v.find((char)39, 1) == v.size() - 1;
  size_t i = v[0] == '-' ? 1 : 0, digits = 0, dots = 0;
  for (; i < v.size(); ++i) {
    if (v[i] >= '0' && v[i] <= '9')
      ++digits;
    else if (v[i] == '.' && dots++ == 0)
      continue;
    else
      return false;
  }
  return digits > 0;
}

/* the user's TOKENS block, one "'token.name': value," per line: only lines of
   that shape (name of letters, digits, '.', '-', '_'; safe value) are kept */
std::string safe_tokens(const std::string &block, int *dropped) {
  std::string out(1, (char)10);
  for (size_t at = 0; at <= block.size();) {
    size_t end = block.find((char)10, at);
    if (end == std::string::npos)
      end = block.size();
    const std::string line = block.substr(at, end - at);
    at = end + 1;
    size_t i = line.find_first_not_of(" \t");
    if (i == std::string::npos || line.compare(i, 2, "/*") == 0)
      continue;
    bool ok = line[i] == 39;
    size_t k = i + 1;
    while (ok && k < line.size() && (isalnum((unsigned char)line[k]) || line[k] == '.' ||
                                    line[k] == '-' || line[k] == '_'))
      ++k;
    ok = ok && k > i + 1 && k < line.size() && line[k] == 39;
    size_t c = ok ? line.find_first_not_of(' ', k + 1) : std::string::npos;
    ok = ok && c != std::string::npos && line[c] == ':';
    size_t v = ok ? line.find_first_not_of(' ', c + 1) : std::string::npos;
    size_t e = v;
    if (ok && v != std::string::npos) {
      if (line[v] == 39)
        e = line.find((char)39, v + 1) == std::string::npos ? std::string::npos
                                                             : line.find((char)39, v + 1) + 1;
      else
        while (e < line.size() && line[e] != ',' && line[e] != ' ')
          ++e;
    }
    ok = ok && v != std::string::npos && e != std::string::npos &&
         safe_value(line.substr(v, e - v));
    if (ok) {
      const size_t r = line.find_first_not_of(" ,", e);
      ok = r == std::string::npos ||
           (line.compare(r, 2, "/*") == 0 && line.find("*/", r) == line.size() - 2);
    }
    if (!ok) {
      ++*dropped;
      continue;
    }
    out += "    " + line.substr(i, e - i) + "," + (char)10;
  }
  return out + "  ";
}

std::string merged_script() {
  const std::string base(kThemeDefaultJs);
  const std::string user = read_file(zt_theme_file().c_str());
  if (user.empty())
    return base;
  const Block bt = find_block(base, "var THEME");
  const Block ut = find_block(user, "var THEME");
  if (bt.from == std::string::npos || ut.from == std::string::npos) {
    /* not a theme file: never run it, the stock theme runs */
    static int warned = 0;
    if (warned++ < 2)
      zt_log("js: %s has no THEME block, ignored (stock theme)", zt_theme_file().c_str());
    return base;
  }

  /* user values by key */
  std::vector<std::pair<std::string, std::string>> values;
  int unsafe = 0;
  const std::string ublock = user.substr(ut.from, ut.to - ut.from);
  for (size_t at = 0; at <= ublock.size();) {
    size_t end = ublock.find((char)10, at);
    if (end == std::string::npos)
      end = ublock.size();
    const std::string line = ublock.substr(at, end - at);
    std::string key;
    size_t vs = 0, vl = 0;
    if (line_value(line, &key, &vs, &vl)) {
      const std::string value = line.substr(vs, vl);
      /* homeTrophies* was renamed fakeTrophies* */
      if (key.compare(0, 12, "homeTrophies") == 0)
        key = "fakeTrophies" + key.substr(12);
      if (safe_value(value))
        values.emplace_back(key, value);
      else
        ++unsafe;
    }
    at = end + 1;
  }

  std::string out = base.substr(0, bt.from);
  const std::string bblock = base.substr(bt.from, bt.to - bt.from);
  int taken = 0;
  for (size_t at = 0; at <= bblock.size();) {
    size_t end = bblock.find((char)10, at);
    if (end == std::string::npos)
      end = bblock.size();
    std::string line = bblock.substr(at, end - at);
    std::string key;
    size_t vs = 0, vl = 0;
    if (line_value(line, &key, &vs, &vl))
      for (const auto &kv : values)
        if (kv.first == key) {
          line = line.substr(0, vs) + kv.second + line.substr(vs + vl);
          ++taken;
          break;
        }
    out += line;
    if (end < bblock.size())
      out += (char)10;
    at = end + 1;
  }
  std::string rest = base.substr(bt.to);
  /* the user's TOKENS block, whole */
  const Block bk = find_block(rest, "var TOKENS");
  const Block uk = find_block(user, "var TOKENS");
  if (bk.from != std::string::npos && uk.from != std::string::npos)
    rest = rest.substr(0, bk.from) + safe_tokens(user.substr(uk.from, uk.to - uk.from), &unsafe) +
           rest.substr(bk.to);
  out += rest;
  static int logged = 0;
  if (logged++ < 2)
    zt_log("js: theme.js = module code + %d values from %s", taken, zt_theme_file().c_str());
  if (unsafe)
    zt_log("js: %d values of the theme file are not plain values, left at stock", unsafe);
  return out;
}

/*
 * Every font file ShellUI can see, as a JS object name -> full path
 * ("/<sandbox>/common/font/SST-Light.otf"); the sandbox folder name is
 * random, so theme.js gets it here (globalThis.__ztFonts).
 */
std::vector<std::pair<std::string, std::string>> g_font_paths;

std::string font_table() {
  static std::string cached;
  if (!cached.empty())
    return cached;
  static const char *const subs[] = {"common/font", "common/font2", "common_ex/font",
                                     "common_ex/font2"};
  std::vector<std::string> roots = {"/system", "/system_ex", "/preinst"};
  if (DIR *top = opendir("/")) {
    while (dirent *e = readdir(top))
      if (e->d_name[0] != '.')
        roots.push_back(std::string("/") + e->d_name);
    closedir(top);
  }
  std::vector<std::string> seen;
  std::string out = "{";
  for (const std::string &root : roots)
    for (const char *sub : subs) {
      const std::string dir = root + "/" + sub;
      DIR *d = opendir(dir.c_str());
      if (!d)
        continue;
      while (dirent *e = readdir(d)) {
        const std::string name = e->d_name;
        if (name[0] == '.' || name.find('"') != std::string::npos ||
            name.find((char)92) != std::string::npos)
          continue;
        bool dup = false;
        for (const std::string &n : seen)
          dup = dup || n == name;
        if (dup)
          continue;
        seen.push_back(name);
        g_font_paths.emplace_back(name, dir + "/" + name);
        struct stat fst = {};
        stat((dir + "/" + name).c_str(), &fst);
        zt_log("fonts: file %s/%s (%ld bytes)", dir.c_str(), name.c_str(),
                       (long)fst.st_size);
        if (out.size() > 1)
          out += ",";
        out += "\"" + name + "\":\"" + dir + "/" + name + "\"";
      }
      closedir(d);
    }
  out += "}";
  zt_log("fonts: %zu files visible to the theme", seen.size());
  if (!seen.empty())
    cached = out;
  return out;
}

/*
 * systemFont (ZhiThemes 117): the user's font in place
 * of every SST font, wherever ShellUI draws text (Home, Settings, menus,
 * notifications), with no restart. libScePsm keeps its fonts by file name,
 * so the names in its table are pointed at "SST-<x>.k??" (theme_psm_names,
 * prx.cpp), which open() answers with this file; then, on the UI thread,
 * every label is laid out again (relayout_text). font_pending stays on disk
 * for 30 s after a change: if ShellUI went down in that time, the next start
 * keeps the system font until systemFont changes.
 */
#define ZT_FONT_PENDING ZT_DIR "/font_pending"
std::string g_sysfont;        /* systemFont, full path; "" = system fonts */
std::string g_elemfont;       /* elementFont, full path, for SST-BoldItalic */
/* the systemFont file for each style (kStyleNames): "" = the SST file of
   that style (systemFontMissing 'system') */
std::string g_style_fonts[4];
std::string g_sysfont_value;  /* every font field as last read */
std::atomic<bool> g_sysfont_apply{false};
int g_sysfont_generation = 0;
time_t g_sysfont_pending = 0; /* when font_pending was written, 0 = none */

/* a system font file by name, or one sent from the editor (fonts/) */
std::string font_path(const std::string &name, const char *key) {
  if (name.empty())
    return std::string();
  font_table();
  for (const auto &f : g_font_paths)
    if (f.first == name)
      return f.second;
  struct stat st;
  if (name.find('/') == std::string::npos &&
      stat((zt_theme_dir("fonts") + "/" + name).c_str(), &st) == 0 && st.st_size > 0)
    return zt_theme_dir("fonts") + "/" + name;
  zt_log("fonts: %s %s not found", key, name.c_str());
  return std::string();
}

/*
 * The SST variants come in 4 styles: upright (Light, Roman, Medium: the
 * systemFont itself), bold, italic (LightItalic, Italic, MediumItalic) and
 * bold italic. With systemFontBold / Italic / BoldItalic empty, the file of
 * that style from the systemFont family next to it is used
 * ("Manrope-Medium.ttf" -> "Manrope-Bold.ttf", "Manrope-MediumItalic.ttf",
 * "Font.ttf" -> "Font-Italic.ttf"); with none, systemFontMissing says what
 * texts in that style get: 'system' = the system's SST file (the style
 * shows, in the stock font), 'same' = the systemFont (no style).
 */
const char *const kStyleNames[4] = {"", "Bold", "Italic", "BoldItalic"};

std::string style_sibling(const std::string &path, int style) {
  const size_t slash = path.rfind('/'), dot = path.rfind('.');
  if (style == 0 || path.empty() || dot == std::string::npos ||
      (slash != std::string::npos && dot < slash))
    return std::string();
  const std::string dir = path.substr(0, slash + 1), stem = path.substr(slash + 1, dot - slash - 1),
                    ext = path.substr(dot);
  const std::string target = kStyleNames[style];
  std::vector<std::string> tries;
  static const char *const weights[] = {"Regular", "Medium", "Light", "Book", "Roman", "Normal"};
  for (const char *w : weights) {
    const size_t at = stem.rfind(w);
    if (at == std::string::npos)
      continue;
    const std::string head = stem.substr(0, at), tail = stem.substr(at + strlen(w));
    if (style == 2)
      tries.push_back(head + w + "Italic" + tail); /* Manrope-MediumItalic */
    tries.push_back(head + target + tail);
    if (style == 3)
      tries.push_back(head + "Bold Italic" + tail);
  }
  tries.push_back(stem + "-" + target);
  tries.push_back(stem + target);
  struct stat st;
  for (const std::string &t : tries)
    if (t != stem && stat((dir + t + ext).c_str(), &st) == 0 && st.st_size > 0)
      return dir + t + ext;
  return std::string();
}

/*
 * elementFont: a 2nd font, by the same route, for the SST-BoldItalic
 * variant only; the Home's texts with FontStyle 'element font' (bold
 * italic) are drawn with it, the rest of the system with systemFont.
 */
void apply_system_font(const std::string &script) {
  const std::string sys = theme_string(script, "systemFont");
  const std::string elem = theme_string(script, "elementFont");
  static const char *const kStyleKeys[4] = {"systemFont", "systemFontBold", "systemFontItalic",
                                            "systemFontBoldItalic"};
  std::string value = elem + "|" + theme_string(script, "systemFontMissing");
  for (const char *k : kStyleKeys)
    value += "|" + theme_string(script, k);
  static bool first = true;
  if (first) {
    first = false;
    struct stat st;
    if (stat(ZT_FONT_PENDING, &st) == 0) {
      unlink(ZT_FONT_PENDING);
      if (!sys.empty() || !elem.empty()) {
        g_sysfont_value = value;
        zt_log("fonts: ShellUI went down with systemFont/elementFont %s: system fonts "
                       "kept until they change", value.c_str());
        return;
      }
    }
  }
  if (value == g_sysfont_value)
    return;
  g_sysfont_value = value;
  const std::string sys_path = font_path(sys, "systemFont");
  const std::string elem_path = font_path(elem, "elementFont");
  const bool same = theme_string(script, "systemFontMissing") == "same";
  std::string styles[4];
  for (int i = 0; i < 4 && !sys_path.empty(); ++i) {
    styles[i] = i == 0 ? sys_path : font_path(theme_string(script, kStyleKeys[i]), kStyleKeys[i]);
    if (styles[i].empty())
      styles[i] = style_sibling(sys_path, i);
    if (styles[i].empty() && same)
      styles[i] = sys_path;
    zt_log("fonts: systemFont %s -> %s", i == 0 ? "upright" : kStyleNames[i],
                   styles[i].empty() ? "system SST" : styles[i].c_str());
  }
  {
    std::lock_guard<std::mutex> lock(g_font_lock);
    bool changed = sys_path != g_sysfont || elem_path != g_elemfont;
    for (int i = 0; i < 4; ++i)
      changed = changed || styles[i] != g_style_fonts[i];
    if (!changed)
      return;
    g_sysfont = sys_path;
    g_elemfont = elem_path;
    for (int i = 0; i < 4; ++i)
      g_style_fonts[i] = styles[i];
  }
  g_sysfont_apply = true;
  zt_log("fonts: systemFont %s, elementFont %s",
                 sys_path.empty() ? "off" : sys_path.c_str(),
                 elem_path.empty() ? "off" : elem_path.c_str());
}

/* UI thread: every label lays its text out again, with fonts asked anew */
void relayout_text() {
  MonoDomain *domain = mono_domain_get();
  MonoObject *exc = nullptr;
  MonoClass *ui3 = g_pui ? mono_class_from_name(g_pui, "Sce.PlayStation.PUI.UI3", "UIFont") : nullptr;
  MonoMethod *clear = ui3 ? find_method(ui3, "ClearCache", 0) : nullptr;
  if (clear)
    mono_runtime_invoke(clear, nullptr, nullptr, &exc);
  const bool cleared = clear && !exc;
  /* UIFontManager's cache forgets its fonts without disposing them
     (UIFontManager.ClearCache() disposed fonts in use: crash in v5) */
  MonoClass *mgr = g_pui ? mono_class_from_name(g_pui, "Sce.PlayStation.PUI", "UIFontManager") : nullptr;
  MonoClassField *lru = mgr ? mono_class_get_field_from_name(mgr, "lruCache") : nullptr;
  MonoVTable *vt = lru ? mono_class_vtable(domain, mgr) : nullptr;
  MonoObject *cache = nullptr;
  if (vt)
    mono_field_static_get_value(vt, lru, &cache);
  MonoClassField *count =
      cache ? mono_class_get_field_from_name(mono_object_get_class(cache), "_count") : nullptr;
  if (count) {
    int zero = 0;
    mono_field_set_value(cache, count, &zero);
  }
  /* LabelElement compares ForceOverriddenLocale with the value of its last
     layout: null <-> "" changes it without changing the language */
  MonoClass *ui_system = g_pui ? mono_class_from_name(g_pui, "Sce.PlayStation.PUI", "UISystem") : nullptr;
  MonoMethod *get_settings = ui_system ? find_method(ui_system, "get_LayoutSettings", 0) : nullptr;
  exc = nullptr;
  MonoObject *settings = get_settings ? mono_runtime_invoke(get_settings, nullptr, nullptr, &exc) : nullptr;
  MonoClass *sk = settings && !exc ? mono_object_get_class(settings) : nullptr;
  MonoMethod *get_locale = sk ? find_method(sk, "get_ForceOverriddenLocale", 0) : nullptr;
  MonoMethod *set_locale = sk ? find_method(sk, "set_ForceOverriddenLocale", 1) : nullptr;
  int relaid = -1;
  if (get_locale && set_locale) {
    exc = nullptr;
    MonoString *now = (MonoString *)mono_runtime_invoke(get_locale, settings, nullptr, &exc);
    std::string text;
    if (now && !exc) {
      const char *utf8 = mono_string_to_utf8(now);
      text = utf8 ? utf8 : "";
      if (utf8)
        mono_free((void *)utf8);
    }
    if (!exc && text.empty()) {
      void *args[1] = {now ? nullptr : mono_string_new(domain, "")};
      exc = nullptr;
      mono_runtime_invoke(set_locale, settings, args, &exc);
      relaid = exc ? 0 : 1;
    } else {
      relaid = 0;
      zt_log("fonts: ForceOverriddenLocale is '%s'; not touched", text.c_str());
    }
  }
  zt_log("fonts: relayout UIFont.ClearCache=%d lruCache._count=%d labels=%d",
                 (int)cleared, count != nullptr, relaid);
}

extern "C" int sceUserServiceGetForegroundUser(int *);
extern "C" int sceUserServiceGetUserName(int, char *, size_t);

/* the foreground user's name as a JS string ("" when unknown): the Home
   never hands it to any props, so the theme's "user" text gets it here */
std::string user_name_js() {
  int id = -1;
  char name[32] = {};
  std::string out = "\"";
  if (sceUserServiceGetForegroundUser(&id) == 0 && id >= 0 &&
      sceUserServiceGetUserName(id, name, sizeof(name) - 1) == 0)
    for (const char *c = name; *c; ++c)
      if ((unsigned char)*c >= 0x20 && *c != '"' && *c != '\\')
        out += *c;
  static bool logged = false;
  if (!logged) {
    logged = true;
    zt_log("user: id %d name \"%s\"", id, name);
  }
  return out + "\"";
}

/* pictures in <dir>/customtile (<titleId>_<1x1|2x3>_<n>.png , copied by FTP or later by the SteamGridDB download; also the folder
   icons uploaded in the editor) as a JSON list for
   globalThis.__ztCustomTiles; read at every Home start, so a reload shows
   new files. the same for <dir>/custombg (game backgrounds,
   <titleId>_16x9_<n>.png), sub = "custombg" */
std::string custom_tiles_js(const char *sub = "customtile") {
  const std::string dir = std::string(ZT_ASSETS "/") + sub;
  mkdir(dir.c_str(), 0777);
  std::string out = "[";
  int n = 0;
  if (DIR *d = opendir(dir.c_str())) {
    while (dirent *e = readdir(d)) {
      const std::string name = e->d_name;
      const size_t dot = name.rfind('.');
      if (name.empty() || name[0] == '.' || dot == std::string::npos || n >= 4000)
        continue;
      std::string ext = name.substr(dot + 1);
      for (char &c : ext)
        c = (char)tolower((unsigned char)c);
      /* <name>.mp4 = the animated version of <name>.png (the focused tile plays it) */
      /* also the backgrounds (custombg) */
      if (ext != "png" && ext != "jpg" && ext != "jpeg" && ext != "mp4")
        continue;
      out += n++ ? ",\"" : "\"";
      for (char c : name)
        if (c == '"' || c == '\\')
          out += std::string("\\") + c;
        else if ((unsigned char)c >= 0x20)
          out += c;
      out += "\"";
    }
    closedir(d);
  }
  zt_log("custom %s: %d in %s", strcmp(sub, "custombg") == 0 ? "backgrounds" : "tiles", n, dir.c_str());
  return out + "]";
}

/* the sizes of the game logos (<titleId>_logo_<n>.png in customtile)
   for globalThis.__ztLogoSizes {"file": [w, h]}: read from the PNG header
   (IHDR), so the Home can align the logo inside its box */
std::string logo_sizes_js() {
  const std::string dir = ZT_CUSTOMTILE;
  std::string out = "{";
  int n = 0;
  if (DIR *d = opendir(dir.c_str())) {
    while (dirent *e = readdir(d)) {
      const std::string name = e->d_name;
      const size_t at = name.find("_logo_");
      if (at == std::string::npos || name.size() < 5 || n >= 2000 ||
          strcasecmp(name.c_str() + name.size() - 4, ".png") != 0)
        continue;
      unsigned char h[24];
      const int fd = open((dir + "/" + name).c_str(), O_RDONLY);
      if (fd < 0)
        continue;
      const ssize_t got = read(fd, h, sizeof h);
      close(fd);
      if (got != (ssize_t)sizeof h || h[0] != 0x89 || h[1] != 'P' || h[2] != 'N' || h[3] != 'G' ||
          memcmp(h + 12, "IHDR", 4) != 0)
        continue;
      const unsigned w = (unsigned)h[16] << 24 | (unsigned)h[17] << 16 | (unsigned)h[18] << 8 | h[19];
      const unsigned hh = (unsigned)h[20] << 24 | (unsigned)h[21] << 16 | (unsigned)h[22] << 8 | h[23];
      bool ok_name = true;
      for (char c : name)
        if (!(isalnum((unsigned char)c) || c == '.' || c == '-' || c == '_'))
          ok_name = false;
      if (!ok_name || !w || !hh || w > 20000 || hh > 20000)
        continue;
      out += std::string(n++ ? "," : "") + "\"" + name + "\":[" + std::to_string(w) + "," + std::to_string(hh) + "]";
    }
    closedir(d);
  }
  if (n)
    zt_log("logos: %d with size", n);
  return out + "}";
}

/* a theme changed native parts (tokens, focus frame, font, avatar...) in
   this module: going to PS5 default has to put them back */
bool g_native_themed = false;

/*
 * Screen dump (theme field screenDump, Experimental): to see what another
 * firmware's apps are made of. Every app bundle ShellUI starts is copied to
 * Dumps/<firmware>/ (for hermes-dec on the PC), and each themed app's
 * theme.js writes its React tree there ("THEME-DUMP <name> <0|1>\n<text>",
 * 0 = new file, 1 = more of it).
 */
std::atomic<bool> g_screen_dump{false};
std::mutex g_dump_lock;
std::vector<std::string> g_dump_queue;
bool g_dump_thread = false;

std::string dump_dir() {
  std::string fw = zt_fw_text();
  for (char &c : fw)
    if (!isalnum((unsigned char)c) && c != '.')
      c = '_';
  const std::string dir = std::string(ZT_DIR "/Dumps/") + (fw.empty() ? "unknown" : fw);
  mkdir(ZT_DIR "/Dumps", 0777);
  mkdir(dir.c_str(), 0777);
  return dir;
}

/* copies one file; false when it could not */
bool dump_copy(const std::string &from, const std::string &to) {
  const int in = open(from.c_str(), O_RDONLY);
  if (in < 0)
    return false;
  const std::string part = to + ".part";
  const int out = open(part.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0666);
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
  }
  close(in);
  close(out);
  if (ok)
    ok = rename(part.c_str(), to.c_str()) == 0;
  else
    unlink(part.c_str());
  return ok;
}

void *dump_worker(void *) {
  for (;;) {
    std::string from;
    {
      std::lock_guard<std::mutex> lock(g_dump_lock);
      if (g_dump_queue.empty() || g_quit) {
        g_dump_thread = false;
        return nullptr;
      }
      from = g_dump_queue.front();
      g_dump_queue.erase(g_dump_queue.begin());
    }
    /* /system_ex/rnps/apps/NPXS40002/application.ps.bundle -> NPXS40002_application.ps.bundle */
    const size_t slash = from.rfind('/');
    const size_t prev = slash == std::string::npos || slash == 0 ? std::string::npos : from.rfind('/', slash - 1);
    std::string name = prev == std::string::npos ? from.substr(slash + 1)
                                                 : from.substr(prev + 1, slash - prev - 1) + "_" + from.substr(slash + 1);
    for (char &c : name)
      if (!isalnum((unsigned char)c) && c != '.' && c != '_' && c != '-')
        c = '_';
    const std::string to = dump_dir() + "/" + name;
    struct stat a {}, b {};
    if (stat(from.c_str(), &a) != 0) {
      zt_log("dump: %s not readable", from.c_str());
      continue;
    }
    if (stat(to.c_str(), &b) == 0 && b.st_size == a.st_size)
      continue;
    const bool ok = dump_copy(from, to);
    zt_log("dump: bundle %s -> %s (%ld KB)%s", from.c_str(), to.c_str(), (long)(a.st_size >> 10),
           ok ? "" : " FAILED");
  }
}

/* a bundle ShellUI starts: copied in the background (once per size) */
void dump_bundle(const std::string &path) {
  if (!g_screen_dump || path.empty() || path[0] != '/' || path.find("..") != std::string::npos)
    return;
  std::lock_guard<std::mutex> lock(g_dump_lock);
  static std::vector<std::string> seen;
  if (std::find(seen.begin(), seen.end(), path) != seen.end())
    return;
  seen.push_back(path);
  g_dump_queue.push_back(path);
  if (g_dump_thread)
    return;
  pthread_t t;
  if (pthread_create(&t, nullptr, dump_worker, nullptr) == 0) {
    pthread_detach(t);
    g_dump_thread = true;
  }
}

/* "THEME-DUMP <name> <0|1>\n<text>" from theme.js */
void dump_text(const std::string &text) {
  const size_t nl = text.find('\n');
  if (!g_screen_dump || nl == std::string::npos || nl <= 11)
    return;
  const std::string head = text.substr(11, nl - 11);
  const size_t sp = head.find(' ');
  if (sp == std::string::npos || sp == 0 || sp > 48)
    return;
  const std::string name = head.substr(0, sp);
  for (char c : name)
    if (!isalnum((unsigned char)c) && c != '-' && c != '_')
      return;
  const bool append = head.compare(sp + 1, 1, "1") == 0;
  const std::string path = dump_dir() + "/" + name + ".txt";
  const int fd = open(path.c_str(), O_WRONLY | O_CREAT | (append ? O_APPEND : O_TRUNC), 0666);
  if (fd < 0)
    return;
  (void)!write(fd, text.data() + nl + 1, text.size() - nl - 1);
  close(fd);
  if (!append)
    zt_log("dump: screen tree %s", path.c_str());
}

void eval_theme(MonoObject *self, const char *app, unsigned hub_id = 0) {
  /* ZhiThemes off (PS5 default / USB safe mode / no theme): the other apps
     get nothing; the Home gets theme.js with __ztStock, which only adds
     Options menu > ZhiThemes */
  /* the diagnostic build with no theme: every app runs the factory theme
     (close to stock) so its screen map, debug panel and dump work; the
     native parts (colours, font, frame) are left alone */
  const bool diag_plain = ZT_DIAG && zt_stock_on();
  const bool stock = zt_stock_on() && !ZT_DIAG;
  if (diag_plain)
    zt_log("js: diagnostic build, no theme: %s gets the factory theme for the diagnostics", app);
  if (stock && strcmp(app, "home") != 0) {
    zt_log("js: ZhiThemes off (PS5 default); %s left stock", app);
    return;
  }
  if (stock)
    zt_log("js: ZhiThemes off (PS5 default): Home gets only the Options menu item");
  const std::string script = stock || diag_plain ? std::string(kThemeDefaultJs) : merged_script();
  /* the Home starts first: its theme decides the dump for the next bundles */
  if (strcmp(app, "home") == 0) {
    /* the diagnostic build dumps always */
    const bool dump = ZT_DIAG || (!stock && zt_theme_number(script, "screenDump", 0) != 0);
    if (dump != g_screen_dump.load())
      zt_log("dump: screen dump %s (Dumps/%s)", dump ? "on" : "off", zt_fw_text().c_str());
    g_screen_dump = dump;
  }
  /* off and nothing changed yet: no native part is touched at all (the
     factory values are 9.60 ones). Off after a theme: the factory values
     put back what that theme changed */
  if (strcmp(app, "home") == 0 && ((!stock && !diag_plain) || g_native_themed)) {
    apply_focus_color(script);
    apply_system_font(script);
    /* avatar, panel tint, icon tint, token log */
    zt_native_apply(script);
    g_native_themed = !stock && !diag_plain;
  }
  if (script.empty()) {
    zt_log("js: %s missing or empty; %s left stock", zt_theme_file().c_str(), app);
    return;
  }
  const std::string source = std::string("globalThis.__themeApp = \"") + app +
                             "\";\nglobalThis.__ztHubId = " + std::to_string(hub_id) + ";\n" +
                             "globalThis.__ztStock = " + (stock ? "true" : "false") + ";\n" +
                             "globalThis.__ztDiag = " + std::string(ZT_DIAG ? "true" : "false") + ";\n" +
                             "globalThis.__ztDiagPlain = " + std::string(diag_plain ? "true" : "false") + ";\n" +
                             "globalThis.__ztFonts = " + font_table() + ";\n" +
                             "globalThis.__ztUser = " + ascii_js(user_name_js()) + ";\n" +
                             /* Logs tab: debug mode (logs/debug.on) */
                             "globalThis.__ztDebug = {on: " + (zt_debug_on() ? "true" : "false") +
                             ", sys: " + (zt_debug_sys() ? "true" : "false") + "};\n" +
                             "globalThis.__ztCustomTiles = " +
                             /* also the Game/App Library grid */
                             (strcmp(app, "home") == 0 || strcmp(app, "library") == 0 ? ascii_js(custom_tiles_js())
                                                                                     : std::string("[]")) + ";\n" +
                             /* files not yet moved out of backgrounds/ */
                             "globalThis.__ztLegacy = " + ascii_js(zt_legacy_js()) + ";\n" +
                             /* the active theme's folder (wallpapers/, icons/, fonts/) */
                             "globalThis.__ztThemeDir = \"" ZT_THEMES "/" + zt_theme_name() + "/\";\n" +
                             /* game logo sizes (Home) */
                             "globalThis.__ztLogoSizes = " +
                             (strcmp(app, "home") == 0 ? logo_sizes_js() : std::string("{}")) + ";\n" +
                             "globalThis.__ztCustomBgs = " +
                             (strcmp(app, "home") == 0 || strcmp(app, "hub") == 0 ? ascii_js(custom_tiles_js("custombg"))
                                                                               : std::string("[]")) + ";\n" +
                             ascii_js(script);
  MonoDomain *domain = mono_domain_get();
  void *args[2] = {mono_string_new(domain, source.c_str()),
                   mono_string_new(domain, kScriptUrl)};
  MonoObject *exc = nullptr;
  mono_runtime_invoke(g_eval_script, self, args, &exc);
  if (exc) {
    MonoString *text = mono_object_to_string(exc, nullptr);
    zt_log("js: theme.js threw in %s: %.400s", app,
                   Mono_to_String(text).c_str());
    return;
  }
  zt_log("js: theme.js evaluated in %s (%zu bytes)", app,
                 source.size());
}

/*
 * Name of the focused game for homeTitle: the hub's theme.js prints
 * "THEME-NAME <name>"; the Home's theme.js prints "THEME-ASK" every 250 ms on
 * its own JS thread, and the name is handed over there with EvalScript on the
 * Home executor (kept from its RunScript).
 */
std::mutex g_name_lock;
std::string g_hub_name, g_sent_name;
MonoObject *g_home_executor = nullptr;
uint32_t g_home_executor_handle = 0;
/* the game hub's executor, for requests from the Home (trophies of a game of
   an open folder: "THEME-TROPHY-ASK <id>" from the Home, handed to the hub
   when it prints "THEME-HUBASK", on the hub's own thread) */
MonoObject *g_hub_executor = nullptr;
uint32_t g_hub_executor_handle = 0;
std::string g_hub_trophy_req;
/* every game hub's executor by the JS thread it runs on (RunScript
   comes on that thread: eval_theme runs there). With two hubs (the Home's
   and another one) the request went to the last one registered from the
   other one's thread: "hub request threw: Thread access assertion failed",
   and ShellUI fell a few seconds later. */
/* every game hub JS context gets a number (globalThis.__ztHubId, set
   before its theme.js) and prints it in "THEME-HUBASK <n>": the answer goes
   to that context's executor. an older version looked the executor up by thread
   only: two hub contexts on one JS thread (a second hub came up without a
   Home reload) left the visible one with the other's executor, and its game
   title never came back in the hub view. The thread is still checked (an
   executor used from another thread asserts and takes ShellUI down). */
struct HubExec {
  unsigned id;
  pthread_t thread;
  MonoObject *executor;
  uint32_t handle;
  unsigned hub_focus; /* the last g_hub_focus_seq handed to this hub */
};
std::vector<HubExec> g_hub_execs;
std::mutex g_hub_exec_lock;
unsigned g_hub_next_id = 0;
/* (fake title / no title): the Home prints "THEME-HUBFOCUS 1" when the
   focus goes down to the game hub and "THEME-HUBFOCUS 0" when it comes back;
   each hub hears it (__themeHubFocus, shows / hides its game title) on its
   next "THEME-HUBASK", on its own thread. A hub registered later gets the
   current state on its first ask. */
std::atomic<unsigned> g_hub_focus_seq{1};
std::atomic<int> g_hub_focus{0};
/* the asking context: by its number on this thread; without a number (an
   older theme.js) the last one registered on this thread */
HubExec *hub_exec_for(unsigned id) {
  HubExec *last = nullptr;
  for (HubExec &h : g_hub_execs) {
    if (!pthread_equal(h.thread, pthread_self()))
      continue;
    if (id && h.id == id)
      return &h;
    if (!last || h.id > last->id)
      last = &h;
  }
  return id ? nullptr : last;
}
bool hub_focus_changed(unsigned id) {
  std::lock_guard<std::mutex> lock(g_hub_exec_lock);
  const unsigned now = g_hub_focus_seq.load();
  HubExec *h = hub_exec_for(id);
  if (!h || h->hub_focus == now)
    return false;
  h->hub_focus = now;
  return true;
}
MonoObject *hub_executor_here(unsigned id) {
  std::lock_guard<std::mutex> lock(g_hub_exec_lock);
  HubExec *h = hub_exec_for(id);
  return h ? h->executor : nullptr;
}
unsigned remember_hub_executor(MonoObject *self) {
  std::lock_guard<std::mutex> lock(g_hub_exec_lock);
  /* the same executor again (a reload of that context): a new number */
  for (size_t i = 0; i < g_hub_execs.size(); ++i)
    if (g_hub_execs[i].executor == self) {
      if (g_hub_execs[i].handle)
        mono_gchandle_free(g_hub_execs[i].handle);
      g_hub_execs.erase(g_hub_execs.begin() + i);
      break;
    }
  /* at most 16 contexts known: the oldest goes */
  if (g_hub_execs.size() >= 16) {
    if (g_hub_execs.front().handle)
      mono_gchandle_free(g_hub_execs.front().handle);
    g_hub_execs.erase(g_hub_execs.begin());
  }
  const unsigned id = ++g_hub_next_id;
  g_hub_execs.push_back({id, pthread_self(), self, mono_gchandle_new(self, true), 0});
  static int logged = 0;
  if (logged++ < 12)
    zt_log("js: hub context %u registered (%zu known)", id, g_hub_execs.size());
  return id;
}

/* after the Options menu switched the theme (also from the install thread) */
void theme_menu_reload() {
  shellui_request_hub_reload();
  shellui_request_home_reload();
}

std::string js_quote(const std::string &in) {
  /* backslash (92) and quote (39) escaped, line breaks (10, 13) as spaces */
  std::string out;
  for (char c : in) {
    if (c == 92 || c == 39)
      out += (char)92;
    out += (c == 10 || c == 13) ? ' ' : c;
  }
  return out;
}

void deliver_hub_name() {
  std::string name;
  {
    std::lock_guard<std::mutex> lock(g_name_lock);
    if (g_hub_name == g_sent_name)
      return;
    name = g_sent_name = g_hub_name;
  }
  static int logged = 0;
  if (!g_home_executor || !g_eval_script) {
    if (logged++ < 3)
      zt_log("js: name '%s' not delivered (home executor %p)",
                     name.c_str(), (void *)g_home_executor);
    return;
  }
  const std::string src = ascii_js("globalThis.__themeName && globalThis.__themeName('" +
                                   js_quote(name) + "');");
  MonoDomain *domain = mono_domain_get();
  void *args[2] = {mono_string_new(domain, src.c_str()),
                   mono_string_new(domain, "theme-name.js")};
  MonoObject *exc = nullptr;
  mono_runtime_invoke(g_eval_script, g_home_executor, args, &exc);
  if (exc) {
    MonoString *text = mono_object_to_string(exc, nullptr);
    zt_log("js: name delivery threw: %.300s", Mono_to_String(text).c_str());
  } else if (logged++ < 3) {
    zt_log("js: name '%s' delivered to Home", name.c_str());
  }
}

/*
 * Other data from the hub for the Home (homeTrophies): "THEME-DATA <key> <json>"
 * keeps the last value per key; on "THEME-ASK" the changed ones go to the
 * Home with globalThis.__themeData('<key>', '<json>').
 */
std::map<std::string, std::string> g_hub_data, g_sent_data;
/* the Games row as the Home sees it ("THEME-GAMES <json>"), for GET /games */
std::string g_games = "[]";
/* every installed title, from the Home's own app database query */
std::string g_games_all;

/*
 * Every installed game (folders): the Home only knows the ~12 of its row.
 * /user/app/<titleId>/sce_sys/param.json has the name ("titleName", the first
 * one = default language) and icon0.png next to it. JSON list of
 * {id, name, icon, space}; sent to the Home as data 'allgames'.
 */
std::string json_text(const std::string &in) {
  std::string out;
  for (unsigned char c : in) {
    if (c == '"' || c == '\\')
      out += '\\', out += (char)c;
    else if (c < 0x20)
      out += ' ';
    else
      out += (char)c;
  }
  return out;
}

bool title_id(const char *n) {
  if (strlen(n) != 9)
    return false;
  for (int i = 0; i < 4; ++i)
    if (!isupper((unsigned char)n[i]))
      return false;
  for (int i = 4; i < 9; ++i)
    if (!isdigit((unsigned char)n[i]))
      return false;
  return true;
}

/* "titleName" of a param.json: the one of "defaultLanguage" (the first one
   can be another language, e.g. Arabic), else the first */
std::string json_title(const std::string &param) {
  size_t from = 0;
  const size_t dl = param.find("\"defaultLanguage\"");
  if (dl != std::string::npos) {
    const size_t q1 = param.find('"', param.find(':', dl) + 1);
    const size_t q2 = q1 == std::string::npos ? q1 : param.find('"', q1 + 1);
    if (q2 != std::string::npos) {
      const size_t block = param.find("\"" + param.substr(q1 + 1, q2 - q1 - 1) + "\"", q2 + 1);
      if (block != std::string::npos)
        from = block;
    }
  }
  size_t key = param.find("\"titleName\"", from);
  if (key == std::string::npos)
    key = param.find("\"titleName\"");
  if (key == std::string::npos)
    return "";
  const size_t q1 = param.find('"', param.find(':', key) + 1);
  if (q1 == std::string::npos)
    return "";
  size_t q2 = q1 + 1;
  while (q2 < param.size() && param[q2] != '"')
    q2 += param[q2] == '\\' ? 2 : 1;
  return q2 < param.size() ? param.substr(q1 + 1, q2 - q1 - 1) : "";
}

/* a value of a PS4 param.sfo (PSF: key table, data table, 16-byte entries) */
std::string sfo_value(const std::string &sfo, const char *want) {
  auto u16 = [&](size_t o) { return (uint32_t)(uint8_t)sfo[o] | (uint32_t)(uint8_t)sfo[o + 1] << 8; };
  auto u32 = [&](size_t o) { return u16(o) | u16(o + 2) << 16; };
  if (sfo.size() < 20 || sfo.compare(0, 4, std::string("\0PSF", 4)) != 0)
    return "";
  const uint32_t keys = u32(8), data = u32(12), n = u32(16);
  for (uint32_t i = 0; i < n && 20 + i * 16 + 16 <= sfo.size(); ++i) {
    const size_t e = 20 + i * 16;
    const size_t k = keys + u16(e);
    if (k >= sfo.size() || strcmp(sfo.c_str() + k, want) != 0)
      continue;
    const size_t at = data + u32(e + 12), len = u32(e + 4);
    if (at + len > sfo.size())
      return "";
    std::string t = sfo.substr(at, len);
    while (!t.empty() && t.back() == '\0')
      t.pop_back();
    return t;
  }
  return "";
}

std::string sfo_title(const std::string &sfo) { return sfo_value(sfo, "TITLE"); }

/* "applicationCategoryType": 0 = game (other values: media apps...); -1 = none */
long json_category(const std::string &param) {
  const size_t key = param.find("\"applicationCategoryType\"");
  if (key == std::string::npos)
    return -1;
  const size_t colon = param.find(':', key);
  return colon == std::string::npos ? -1 : strtol(param.c_str() + colon + 1, nullptr, 10);
}

bool file_exists(const std::string &path) {
  struct stat st = {};
  return stat(path.c_str(), &st) == 0;
}

std::string installed_games() {
  /* /user/app has the games on the console storage; the ones on extended
     storage only have /user/appmeta/<id>/ (35 of 44 games) */
  std::vector<std::string> ids;
  std::vector<std::string> in_app;
  size_t from_app = 0;
  for (const char *root : {"/user/app", "/user/appmeta"}) {
    if (DIR *d = opendir(root)) {
      while (dirent *e = readdir(d))
        if (title_id(e->d_name) && strncmp(e->d_name, "NPXS", 4) != 0)
          ids.push_back(e->d_name);
      closedir(d);
    }
    if (!from_app) {
      from_app = ids.size();
      in_app = ids;
    }
  }
  std::sort(ids.begin(), ids.end());
  ids.erase(std::unique(ids.begin(), ids.end()), ids.end());
  std::string json = "[";
  size_t kept = 0;
  for (const std::string &id : ids) {
    /* games on extended storage (and PS4 ones) only have /user/appmeta/<id>/ */
    const std::string dir = "/user/app/" + id + "/sce_sys/", meta = "/user/appmeta/" + id + "/";
    /* name and kind: param.json (PS5) or param.sfo (PS4), wherever they are */
    std::string name, space = "game";
    for (const std::string &pj : {dir + "param.json", meta + "param.json"}) {
      if (!name.empty())
        break;
      const std::string param = read_file(pj.c_str());
      name = json_title(param);
      if (!name.empty() && json_category(param) > 0)
        space = "media";
    }
    for (const std::string &ps : {meta + "param.sfo", dir + "param.sfo",
                                  "/system_data/priv/appmeta/" + id + "/param.sfo",
                                  "/user/appmeta/external/" + id + "/param.sfo"}) {
      if (!name.empty())
        break;
      const std::string sfo = read_file(ps.c_str());
      name = sfo_title(sfo);
      /* PS4 categories: gd/gp/ac = game, gde (and others) = apps */
      const std::string cat = sfo_value(sfo, "CATEGORY");
      if (!name.empty() && !cat.empty() && cat != "gd" && cat != "gp" && cat != "ac")
        space = "media";
    }
    if (name.empty()) {
      /* diagnostics: what is there for a title without a name */
      static int listed = 0;
      if (listed++ < 4) {
        std::string files;
        for (const std::string &dname : {meta, dir}) {
          if (DIR *d = opendir(dname.c_str())) {
            while (dirent *e = readdir(d))
              if (e->d_name[0] != '.')
                files += std::string(" ") + e->d_name;
            closedir(d);
          } else {
            files += " [" + dname + " no access]";
          }
        }
        zt_log("js: no name for %s:%.300s", id.c_str(), files.c_str());
      }
    }
    /* /user/appmeta keeps leftovers of removed games (no name): not a game */
    if (name.empty() && std::find(in_app.begin(), in_app.end(), id) == in_app.end())
      continue;
    const std::string icon = file_exists(dir + "icon0.png")    ? dir + "icon0.png"
                             : file_exists(meta + "icon0.png") ? meta + "icon0.png"
                                                               : "";
    /* the game's background (the Home uses pic0.dds) */
    std::string bg;
    for (const std::string &b : {dir + "pic0.dds", meta + "pic0.dds", dir + "pic0.png", meta + "pic0.png"})
      if (bg.empty() && file_exists(b))
        bg = b;
    ++kept;
    if (json.size() > 1)
      json += ',';
    json += "{\"id\":\"" + id + "\",\"name\":\"" + json_text(name) + "\",\"icon\":\"" + icon +
            "\",\"bg\":\"" + bg + "\",\"space\":\"" + space + "\",\"installed\":true}";
  }
  json += "]";
  static int logged = 0;
  if (logged++ < 3)
    zt_log("js: installed games: %zu (%zu in /user/app, %zu ids seen)", kept, from_app, ids.size());
  return json;
}

void deliver_hub_data() {
  std::vector<std::pair<std::string, std::string>> out;
  {
    std::lock_guard<std::mutex> lock(g_name_lock);
    for (const auto &kv : g_hub_data) {
      auto it = g_sent_data.find(kv.first);
      if (it != g_sent_data.end() && it->second == kv.second)
        continue;
      g_sent_data[kv.first] = kv.second;
      out.push_back(kv);
    }
  }
  if (out.empty() || !g_home_executor || !g_eval_script)
    return;
  static int logged = 0;
  for (const auto &kv : out) {
    const std::string src = ascii_js("globalThis.__themeData && globalThis.__themeData('" +
                                     js_quote(kv.first) + "', '" + js_quote(kv.second) + "');");
    MonoDomain *domain = mono_domain_get();
    void *args[2] = {mono_string_new(domain, src.c_str()),
                     mono_string_new(domain, "theme-data.js")};
    MonoObject *exc = nullptr;
    mono_runtime_invoke(g_eval_script, g_home_executor, args, &exc);
    if (exc) {
      MonoString *text = mono_object_to_string(exc, nullptr);
      zt_log("js: data delivery threw: %.300s", Mono_to_String(text).c_str());
    } else if (logged++ < 3) {
      zt_log("js: data '%s' delivered to Home (%zu bytes)", kv.first.c_str(),
                     kv.second.size());
    }
  }
}

void deliver_hub_request(unsigned ctx) {
  /* only on the asking hub's own thread, to the asking context */
  MonoObject *executor = hub_executor_here(ctx);
  if (!executor || !g_eval_script) {
    static int skipped = 0;
    if (!executor && skipped++ < 3)
      zt_log("js: hub request: hub context %u not known on this thread, not answered here", ctx);
    return;
  }
  if (hub_focus_changed(ctx)) {
    MonoDomain *domain = mono_domain_get();
    const std::string rf = std::string("globalThis.__themeHubFocus && globalThis.__themeHubFocus(") +
                           (g_hub_focus.load() ? "1" : "0") + ");";
    void *args[2] = {mono_string_new(domain, rf.c_str()), mono_string_new(domain, "theme-hubfocus.js")};
    MonoObject *exc = nullptr;
    mono_runtime_invoke(g_eval_script, executor, args, &exc);
    static int rf_logged = 0;
    if (exc) {
      MonoString *text = mono_object_to_string(exc, nullptr);
      zt_log("js: hub focus to the hub threw: %.300s", Mono_to_String(text).c_str());
    } else if (rf_logged++ < 30) {
      zt_log("js: hub focus %d told to hub context %u", g_hub_focus.load(), ctx);
    }
  }
  std::string id;
  {
    std::lock_guard<std::mutex> lock(g_name_lock);
    id.swap(g_hub_trophy_req);
  }
  if (id.empty())
    return;
  const std::string src = ascii_js("globalThis.__themeTrophyAsk && globalThis.__themeTrophyAsk('" +
                                   js_quote(id) + "');");
  MonoDomain *domain = mono_domain_get();
  void *args[2] = {mono_string_new(domain, src.c_str()), mono_string_new(domain, "theme-ask.js")};
  MonoObject *exc = nullptr;
  mono_runtime_invoke(g_eval_script, executor, args, &exc);
  static int logged = 0;
  if (exc) {
    MonoString *text = mono_object_to_string(exc, nullptr);
    zt_log("js: hub request threw: %.300s", Mono_to_String(text).c_str());
  } else if (logged++ < 5) {
    zt_log("js: trophies of %s asked to the hub", id.c_str());
  }
}

void RunScript_Hook(MonoObject *self, MonoObject *bundle) {
  if (g_quit)
    return g_run_script_orig(self, bundle);
  const std::string id = bundle_identity(self, bundle);
  const char *app = nullptr;
  for (const ThemedApp &a : kThemedApps)
    if (id.find(a.title_id) != std::string::npos)
      app = a.name;
  if (g_runs.fetch_add(1) < kLoggedRuns)
    zt_log("js: RunScript '%.200s'%s%s", id.c_str(),
                   app ? " -> " : "", app ? app : "");
  if (app && strcmp(app, "home") == 0) {
    if (g_home_executor_handle)
      mono_gchandle_free(g_home_executor_handle);
    g_home_executor_handle = mono_gchandle_new(self, true);
    g_home_executor = self;
    std::lock_guard<std::mutex> lock(g_name_lock);
    g_sent_name.clear(); /* the new Home context has no name yet */
    g_sent_data.clear();
    g_hub_data["allgames"] = installed_games();
  }
  unsigned hub_id = 0;
  if (app && strcmp(app, "hub") == 0) {
    if (g_hub_executor_handle)
      mono_gchandle_free(g_hub_executor_handle);
    g_hub_executor_handle = mono_gchandle_new(self, true);
    g_hub_executor = self;
    hub_id = remember_hub_executor(self);
  }
  if (app)
    eval_theme(self, app, hub_id);
  dump_bundle(id);
  g_run_script_orig(self, bundle);
}

/*
 * "Rename folder": the PS5 keyboard through the native UI3 TextField,
 * made here on the UI thread (theme_tick). an older version used React Native's
 * TextInput (RCTTextBox) from the Home's JS and ShellUI went down. The
 * field is appended to the root of the focused widget's scene, BeginEdit
 * opens the keyboard; when IsEditing turns false its Text goes back to the
 * Home as data "zt-rename" {id, name, t}.
 */
/*
 * Folder backgrounds: "THEME-FOLDERBG name|style|#colour|ID1|ID2…"
 * from the Home. Made one at a time on a thread of their own (about a second
 * per game, the JS thread must not wait); the names that exist go back to
 * the Home as data "zt-fbg" ["name", …], and the Home then shows that picture
 * when the folder is focused.
 */
struct FolderBgJob {
  std::string name, style, colour;
  std::vector<std::string> ids;
  std::vector<std::string> own; /* custombg/<file> per game ("" = its art) */
};
std::mutex g_fbg_lock;
std::vector<FolderBgJob> g_fbg_jobs;
std::vector<std::string> g_fbg_ready;
bool g_fbg_running = false;

void fbg_ready(const std::string &name) {
  std::string json = "[";
  {
    std::lock_guard<std::mutex> lock(g_fbg_lock);
    if (std::find(g_fbg_ready.begin(), g_fbg_ready.end(), name) == g_fbg_ready.end())
      g_fbg_ready.push_back(name);
    for (size_t i = 0; i < g_fbg_ready.size(); ++i)
      json += (i ? ",\"" : "\"") + g_fbg_ready[i] + "\"";
  }
  json += "]";
  std::lock_guard<std::mutex> lock(g_name_lock);
  g_hub_data["zt-fbg"] = json;
}

void *fbg_worker(void *) {
  for (;;) {
    FolderBgJob job;
    {
      std::lock_guard<std::mutex> lock(g_fbg_lock);
      if (g_fbg_jobs.empty()) {
        g_fbg_running = false;
        return nullptr;
      }
      job = g_fbg_jobs.front();
      g_fbg_jobs.erase(g_fbg_jobs.begin());
    }
    if (zt_folder_background(job.name, job.style, job.colour, job.ids, job.own))
      fbg_ready(job.name);
  }
}

void fbg_ask(const std::string &text) {
  std::vector<std::string> f;
  for (size_t at = 15;;) {
    const size_t bar = text.find('|', at);
    f.push_back(text.substr(at, bar == std::string::npos ? std::string::npos : bar - at));
    if (bar == std::string::npos)
      break;
    at = bar + 1;
  }
  bool ok = f.size() >= 4 && f[0].rfind("zt_fbg_", 0) == 0 && f[0].size() < 64 &&
            f[0].find_first_of("/\\\"") == std::string::npos && f[0].find("..") == std::string::npos;
  FolderBgJob job;
  if (ok) {
    job.name = f[0];
    job.style = f[1];
    job.colour = f[2];
    /* only title ids (they become paths); "ID@<file>" = that game's
       own background in custombg (a plain file name) instead of its art */
    for (size_t i = 3; i < f.size() && job.ids.size() < 6; ++i) {
      const size_t at = f[i].find('@');
      const std::string id = f[i].substr(0, at);
      std::string own = at == std::string::npos ? "" : f[i].substr(at + 1);
      bool tid = id.size() == 9;
      for (size_t k = 0; tid && k < 9; ++k)
        tid = k < 4 ? isupper((unsigned char)id[k]) : isdigit((unsigned char)id[k]);
      for (char c : own)
        if (!(isalnum((unsigned char)c) || c == '.' || c == '-' || c == '_'))
          own.clear();
      if (own.size() > 80 || own.find("..") != std::string::npos)
        own.clear();
      if (tid) {
        job.ids.push_back(id);
        job.own.push_back(own);
      }
    }
    ok = !job.ids.empty();
  }
  if (!ok) {
    zt_log("js: THEME-FOLDERBG refused (%.200s)", text.c_str());
    return;
  }
  struct stat st;
  if (stat((ZT_CACHE_FOLDERBG "/" + job.name).c_str(), &st) == 0) {
    fbg_ready(job.name);
    return;
  }
  bool start = false;
  {
    std::lock_guard<std::mutex> lock(g_fbg_lock);
    for (const FolderBgJob &j : g_fbg_jobs)
      if (j.name == job.name)
        return;
    g_fbg_jobs.push_back(job);
    if (!g_fbg_running)
      start = g_fbg_running = true;
  }
  zt_log("folders: background %s asked (%s, %zu games)", job.name.c_str(), job.style.c_str(),
                 job.ids.size());
  if (start) {
    pthread_t t;
    if (pthread_create(&t, nullptr, fbg_worker, nullptr) == 0) {
      pthread_detach(t);
    } else {
      std::lock_guard<std::mutex> lock(g_fbg_lock);
      g_fbg_running = false;
      zt_log("folders: background thread not started");
    }
  }
}

extern "C" int sceUserServiceGetForegroundUser(int *);
std::mutex g_rename_lock;
std::string g_rename_req; /* "ZTFOLDERn|current name" from the Home */
MonoObject *g_rename_field = nullptr;
uint32_t g_rename_handle = 0;
std::string g_rename_fid;
int g_rename_ticks = 0;
bool g_rename_editing = false;

void rename_finish(const char *why) {
  std::string text;
  if (MonoObject *t = call(g_rename_field, "get_Text", 0, nullptr, "rename"))
    text = Mono_to_String(reinterpret_cast<MonoString *>(t));
  call(g_rename_field, "RemoveFromParent", 0, nullptr, "rename");
  mono_gchandle_free(g_rename_handle);
  g_rename_field = nullptr;
  g_rename_handle = 0;
  zt_log("folders: rename %s %s: '%.120s'", g_rename_fid.c_str(), why, text.c_str());
  std::string clean;
  for (char c : text)
    if ((unsigned char)c >= 32 && !strchr("'\"\\;:|", c) && clean.size() < 120)
      clean += c;
  std::lock_guard<std::mutex> lock(g_name_lock);
  g_hub_data["zt-rename"] = "{\"id\":\"" + g_rename_fid + "\",\"name\":\"" + clean +
                            "\",\"t\":" + std::to_string((long long)time(nullptr)) + "}";
}

bool rename_begin();

void rename_tick() {
  if (g_rename_field) {
    ++g_rename_ticks;
    if (g_rename_ticks == 2 && !rename_begin()) {
      rename_finish("BeginEdit failed");
      return;
    }
    if (g_rename_ticks < 2)
      return;
    MonoObject *r = call(g_rename_field, "IsEditing", 0, nullptr, "rename");
    const bool editing = r && *reinterpret_cast<bool *>(mono_object_unbox(r));
    /* where it stops if ShellUI goes down (went down after tick 1) */
    if (g_rename_ticks <= 12 || g_rename_ticks % 60 == 0)
      zt_log("folders: rename tick %d editing=%d", g_rename_ticks, editing);
    if (editing && !g_rename_editing) {
      g_rename_editing = true;
      zt_log("folders: rename keyboard open (tick %d)", g_rename_ticks);
    }
    if (g_rename_editing && !editing)
      rename_finish("done");
    else if (!g_rename_editing && g_rename_ticks > 300)
      rename_finish("keyboard never opened");
    else if (g_rename_ticks > 60 * 300)
      rename_finish("timeout");
    return;
  }
  std::string req;
  {
    std::lock_guard<std::mutex> lock(g_rename_lock);
    req.swap(g_rename_req);
  }
  if (req.empty())
    return;
  const size_t bar = req.find('|');
  const std::string fid = req.substr(0, bar), name = bar == std::string::npos ? "" : req.substr(bar + 1);
  MonoClass *tf = mono_class_from_name(g_pui, "Sce.PlayStation.PUI.UI3", "TextField");
  /* the real focused widget and scene: FocusManager.Instance.FocusedWidget /
     FocusActiveScene (focus_widgets() gave the FocusRenderWidget, the frame,
     with no parent or scene) */
  MonoObject *focus = nullptr, *scene = nullptr;
  MonoClass *fmc = mono_class_from_name(g_pui, "Sce.PlayStation.PUI", "FocusManager");
  MonoMethod *inst = fmc ? find_method(fmc, "get_Instance", 0) : nullptr;
  MonoObject *exc = nullptr;
  MonoObject *fm = inst ? mono_runtime_invoke(inst, nullptr, nullptr, &exc) : nullptr;
  if (fm && !exc) {
    focus = call(fm, "get_FocusedWidget", 0, nullptr, "rename");
    scene = call(fm, "get_FocusActiveScene", 0, nullptr, "rename");
  }
  if (!focus) {
    const std::vector<MonoObject *> ws = focus_widgets();
    focus = ws.empty() ? nullptr : ws[0];
  }
  if (!scene && focus)
    scene = call(focus, "get_ParentScene", 0, nullptr, "rename");
  if (!scene && focus)
    scene = call(focus, "GetScene", 0, nullptr, "rename");
  MonoObject *root = scene ? call(scene, "get_RootWidget", 0, nullptr, "rename") : nullptr;
  /* the focus widget had no scene (scene=0); its topmost parent then */
  int depth = 0;
  if (!root && focus) {
    MonoObject *w = focus;
    for (MonoObject *p; depth < 64 && (p = call(w, "get_Parent", 0, nullptr, "rename")); ++depth)
      w = p;
    root = depth ? w : nullptr;
  }
  MonoClass *fk = focus ? mono_object_get_class(focus) : nullptr;
  MonoClass *sk = scene ? mono_object_get_class(scene) : nullptr;
  zt_log("folders: rename %s: TextField=%d manager=%d focus=%s scene=%s root=%d (up %d)", fid.c_str(),
                 tf != nullptr, fm != nullptr, fk ? fk->name : "none", sk ? sk->name : "none", root != nullptr,
                 depth);
  if (!tf || !root)
    return;
  MonoDomain *domain = mono_domain_get();
  MonoObject *f = mono_object_new(domain, tf);
  if (!f)
    return;
  mono_runtime_object_init(f);
  g_rename_field = f;
  /* pinned: the raw pointer is used on later ticks; unpinned, the GC moved
     the field while the keyboard was open (tick 6 "IsEditing/0 not
     found"; earlier builds went down there) */
  g_rename_handle = mono_gchandle_new(f, true);
  g_rename_fid = fid;
  g_rename_ticks = 0;
  g_rename_editing = false;
  void *a[1];
  a[0] = mono_string_new(domain, name.c_str());
  call(f, "set_Text", 1, a, "rename");
  a[0] = mono_string_new(domain, "Folder name");
  call(f, "set_ImeWindowTitle", 1, a, "rename");
  int max = 40;
  a[0] = &max;
  call(f, "set_MaxLength", 1, a, "rename");
  /* the keyboard opens for a user: with UserId 0 ShellUI went down right
     after the keyboard started opening */
  int uid = -1;
  const int urc = sceUserServiceGetForegroundUser(&uid);
  if (urc == 0 && uid > 0) {
    a[0] = &uid;
    call(f, "set_UserId", 1, a, "rename");
  }
  zt_log("folders: rename user %d (rc %d)", uid, urc);
  if (urc != 0 || uid <= 0) {
    rename_finish("no user");
    return;
  }
  a[0] = f;
  bool ok = false;
  call(root, "AppendChild", 1, a, "rename", &ok);
  /* BeginEdit right away opened the keyboard and ShellUI went down a
     tick later; now the field gets the focus first and BeginEdit waits for
     the next tick (rename_tick, g_rename_ticks == 2) */
  bool yes = true, focused = false;
  a[0] = &yes;
  if (ok) {
    call(f, "set_Focusable", 1, a, "rename");
    call(f, "SetFocus", 0, nullptr, "rename", &focused);
  }
  zt_log("folders: rename %s: field added=%d focus=%d", fid.c_str(), ok, focused);
  if (!ok)
    rename_finish("not started");
}

/* the BeginEdit of the field, a tick after it got the focus */
bool rename_begin() {
  bool throws = false, began = false;
  void *a[1] = {&throws};
  call(g_rename_field, "BeginEdit", 1, a, "rename", &began);
  zt_log("folders: rename BeginEdit=%d", began);
  return began;
}

void ConsoleLog_Hook(MonoString *msg, int level, void *error, void *userarg) {
  if (msg && !g_quit) {
    const std::string text = Mono_to_String(msg);
    if (text.rfind("THEME-DUMP ", 0) == 0) {
      dump_text(text);
      return;
    }
    if (text.rfind("THEME-NAME ", 0) == 0) {
      std::lock_guard<std::mutex> lock(g_name_lock);
      g_hub_name = text.substr(11);
      static int names = 0;
      if (names++ < 3)
        zt_log("js: hub name '%s'", g_hub_name.c_str());
      return;
    }
    if (text.rfind("THEME-DATA ", 0) == 0) {
      const size_t sp = text.find(' ', 11);
      if (sp != std::string::npos) {
        std::lock_guard<std::mutex> lock(g_name_lock);
        g_hub_data[text.substr(11, sp - 11)] = text.substr(sp + 1);
      }
      return;
    }
    if (text.rfind("THEME-GAMESALL ", 0) == 0) {
      std::lock_guard<std::mutex> lock(g_name_lock);
      g_games_all = text.substr(15);
      static int n = 0;
      if (n++ < 3)
        zt_log("js: all titles from the app database (%zu bytes)", g_games_all.size());
      return;
    }
    if (text.rfind("THEME-GAMES ", 0) == 0) {
      std::lock_guard<std::mutex> lock(g_name_lock);
      g_games = text.substr(12);
      return;
    }
    if (text.rfind("THEME-TROPHY-ASK ", 0) == 0) {
      std::lock_guard<std::mutex> lock(g_name_lock);
      if (!g_hub_trophy_req.empty())
        g_hub_trophy_req += ',';
      g_hub_trophy_req += text.substr(17);
      if (g_hub_trophy_req.size() > 4000)
        g_hub_trophy_req.erase(0, g_hub_trophy_req.size() - 4000);
      return;
    }
    /* "THEME-SET <key> <value>": the Home's Options menu changed the folders;
       written into theme.ztheme, then the Home and the hub reload with it */
    /* "THEME-CACHE-KEEP <mosaics|folderbg|icons>|names": what the
       Home uses of cache/; the other old files there go */
    if (text.rfind("THEME-CACHE-KEEP ", 0) == 0) {
      zt_cache_keep(text.substr(17));
      return;
    }
    /* "THEME-TALLICON <icon>|<name>|<ratio>": a taller copy of a
       system tile's icon (Game / App Library) in backgrounds/<name>, made
       before the call returns so the tile can load it right away */
    if (text.rfind("THEME-TALLICON ", 0) == 0) {
      const std::string rest = text.substr(15);
      const size_t b1 = rest.find('|'), b2 = b1 == std::string::npos ? b1 : rest.find('|', b1 + 1);
      const std::string src = rest.substr(0, b1);
      const std::string name = b1 == std::string::npos ? "" : rest.substr(b1 + 1, b2 == std::string::npos ? b2 : b2 - b1 - 1);
      const double ratio = b2 == std::string::npos ? 1.5 : atof(rest.c_str() + b2 + 1);
      bool ok = src.rfind("/system_ex/rnps/apps/", 0) == 0 && src.find("..") == std::string::npos &&
                src.size() > 4 && src.compare(src.size() - 4, 4, ".png") == 0 &&
                name.rfind("zt_sys_", 0) == 0 && name.size() < 64;
      for (char c : name)
        if (!(isalnum((unsigned char)c) || c == '.' || c == '-' || c == '_'))
          ok = false;
      if (ok) {
        zt_mkdirs(ZT_CACHE_ICONS);
        zt_tall_icon(src, ZT_CACHE_ICONS "/" + name, ratio);
      } else
        zt_log("js: THEME-TALLICON refused (%.200s)", text.c_str());
      return;
    }
    /* "THEME-MOSAIC name|#colour|opacity|icon1|icon2|icon3[|+N][|r<ratio>][|stack]":
       a folder's mosaic icon, made before the THEME-SET that uses it (r1.5 =
       vertical tiles; stack = covers stacked) */
    if (text.rfind("THEME-MOSAIC ", 0) == 0) {
      std::vector<std::string> f;
      for (size_t at = 13;;) {
        const size_t bar = text.find('|', at);
        f.push_back(text.substr(at, bar == std::string::npos ? std::string::npos : bar - at));
        if (bar == std::string::npos)
          break;
        at = bar + 1;
      }
      bool ok = f.size() >= 3 && f[0].rfind("zt_folder_", 0) == 0 && f[0].size() < 64 &&
                f[0].find_first_of("/\\") == std::string::npos && f[0].find("..") == std::string::npos;
      std::vector<std::string> icons;
      int more = 0; /* "+N": games that do not fit */
      double ratio = 1;
      bool stack = false, squares = false, oneRow = false;
      for (size_t i = 3; ok && i < f.size(); ++i)
        if (f[i] == "stack")
          stack = true;
        else if (f[i] == "sq") /* square icons, as many as fit */
          squares = true;
        else if (f[i] == "sq1") /* 4 square icons in one row */
          squares = oneRow = true;
        else
        if (!f[i].empty() && f[i][0] == '/' && f[i].find("..") == std::string::npos && icons.size() < 7)
          icons.push_back(f[i]);
        else if (f[i].size() > 1 && f[i][0] == '+')
          more = std::min(999, atoi(f[i].c_str() + 1));
        else if (f[i].size() > 1 && f[i][0] == 'r')
          ratio = atof(f[i].c_str() + 1);
      if (ok)
        zt_folder_mosaic(f[0], f[1], atof(f[2].c_str()), icons, more, ratio, stack, squares, oneRow);
      else
        zt_log("js: THEME-MOSAIC refused (%.200s)", text.c_str());
      return;
    }
    if (text.rfind("THEME-FOLDERBG ", 0) == 0) {
      fbg_ask(text);
      return;
    }
    if (text.rfind("THEME-RENAME ", 0) == 0) {
      std::lock_guard<std::mutex> lock(g_rename_lock);
      g_rename_req = text.substr(13, 200);
      zt_log("js: rename asked (%s)", g_rename_req.c_str());
      return;
    }
    /* THEME-SETQ: the same without the reload (games uninstalled from a folder) */
    const bool quiet = text.rfind("THEME-SETQ ", 0) == 0;
    if (quiet || text.rfind("THEME-SET ", 0) == 0) {
      const size_t from = quiet ? 11 : 10;
      const size_t sp = text.find(' ', from);
      const std::string key = sp == std::string::npos ? "" : text.substr(from, sp - from);
      const std::string value = sp == std::string::npos ? "" : text.substr(sp + 1);
      const bool clean = value.find_first_of("'\\\r\n") == std::string::npos && value.size() < 60000;
      /* customTileChoice (name): the tiles' custom tile Options menu items;
         favorites: Add to / Remove from favourites */
      if ((key != "folders" && key != "customTileChoice" && key != "favorites") || !clean) {
        zt_log("js: THEME-SET refused (%s, %zu bytes)", key.c_str(), value.size());
      } else if (theme_set_field(key, value)) {
        zt_log("js: THEME-SET%s %s = %.300s%s", quiet ? "Q" : "", key.c_str(), value.c_str(),
                       quiet ? "" : "; reload");
        if (!quiet) {
          shellui_request_hub_reload();
          shellui_request_home_reload();
        }
      } else {
        zt_log("js: THEME-SET %s: cannot write theme.ztheme", key.c_str());
      }
      return;
    }
    if (text.rfind("THEME-HUBFOCUS ", 0) == 0) {
      g_hub_focus.store(text.size() > 15 && text[15] == '1' ? 1 : 0);
      g_hub_focus_seq.fetch_add(1);
      return;
    }
    if (text.rfind("THEME-HUBASK", 0) == 0) {
      deliver_hub_request(text.size() > 13 ? (unsigned)strtoul(text.c_str() + 13, nullptr, 10) : 0);
      return;
    }
    if (text == "THEME-ASK") {
      deliver_hub_name();
      deliver_hub_data();
      return;
    }
    /* the debug panel (debugOverlay) asks about once a second, from
       the Home's own thread: the numbers go back with __ztStats(json) */
    if (text == "THEME-STATS") {
      if (!g_home_executor || !g_eval_script)
        return;
      const std::string src = "globalThis.__ztStats && globalThis.__ztStats('" +
                              js_quote(zt_stats_json()) + "');";
      MonoDomain *domain = mono_domain_get();
      void *args[2] = {mono_string_new(domain, src.c_str()),
                       mono_string_new(domain, "theme-stats.js")};
      MonoObject *exc = nullptr;
      mono_runtime_invoke(g_eval_script, g_home_executor, args, &exc);
      static int logged = 0;
      if (exc) {
        if (logged++ < 3) {
          MonoString *et = mono_object_to_string(exc, nullptr);
          zt_log("js: stats delivery threw: %.300s", Mono_to_String(et).c_str());
        }
      } else if (logged++ < 1) {
        zt_log("js: stats delivered to Home: %.300s", zt_stats_json().c_str());
      }
      return;
    }
    /* Options menu > ZhiThemes. THEME-THEMES: the Home asks (on its
       own thread, when a menu opens) for the themes, USB / Install files and
       the PS5 default state; answered with __ztThemeMenu(json) */
    if (text == "THEME-THEMES") {
      if (!g_home_executor || !g_eval_script)
        return;
      const std::string json = zt_theme_menu_json();
      const std::string src = ascii_js("globalThis.__ztThemeMenu && globalThis.__ztThemeMenu('" +
                              js_quote(json) + "');");
      MonoDomain *domain = mono_domain_get();
      void *args[2] = {mono_string_new(domain, src.c_str()),
                       mono_string_new(domain, "theme-menu.js")};
      MonoObject *exc = nullptr;
      mono_runtime_invoke(g_eval_script, g_home_executor, args, &exc);
      static int logged = 0;
      if (exc) {
        if (logged++ < 3) {
          MonoString *et = mono_object_to_string(exc, nullptr);
          zt_log("js: theme menu delivery threw: %.300s", Mono_to_String(et).c_str());
        }
      } else if (logged++ < 3) {
        zt_log("js: theme menu: %.400s", json.c_str());
      }
      return;
    }
    if (text.rfind("THEME-THEMEUSE ", 0) == 0) {
      const std::string name = text.substr(15);
      const std::string err = zt_theme_menu_use(name);
      if (err.empty()) {
        zt_log("js: menu: theme %s in use; reload", name.c_str());
        theme_menu_reload();
      } else
        zt_log("js: menu: theme %s: %s", name.c_str(), err.c_str());
      return;
    }
    if (text == "THEME-THEMEOFF") {
      zt_stock_set(true);
      zt_log("js: menu: ZhiThemes off (PS5 default); reload");
      zt_menu_notify("off (PS5 default). Options on a tile > ZhiThemes to pick a theme again.");
      theme_menu_reload();
      return;
    }
    if (text.rfind("THEME-THEMEFILE ", 0) == 0) {
      const std::string path = text.substr(16);
      const std::string err = zt_theme_menu_install(path, theme_menu_reload);
      if (!err.empty()) {
        zt_log("js: menu: install %s: %s", path.c_str(), err.c_str());
        zt_menu_notify(err);
      }
      return;
    }
    if (text.rfind("THEME", 0) == 0)
      zt_log("js: %.480s", text.c_str());
    else if (g_console_lines.fetch_add(1) < kLoggedConsoleLines)
      zt_log("js: console[%d] %.200s", level, text.c_str());
  }
  g_console_log_orig(msg, level, error, userarg);
}

} // namespace

/* for zt_native_theme.cpp */
double zt_theme_number(const std::string &src, const char *key, double fallback) {
  return theme_value(src, key, fallback);
}
std::string zt_theme_text(const std::string &src, const char *key) {
  return theme_string(src, key);
}

std::string theme_script() { return merged_script(); }

std::string theme_games() {
  std::string home, all;
  {
    std::lock_guard<std::mutex> lock(g_name_lock);
    home = g_games;
    if (!g_games_all.empty()) {
      all = g_games_all;   /* the app database: installed titles only */
    } else {
      auto it = g_hub_data.find("allgames");
      all = it != g_hub_data.end() ? it->second : installed_games();
    }
  }
  /* add each installed game whose id the Home's list does not have */
  std::string out = home.size() >= 2 ? home.substr(0, home.size() - 1) : "[";
  for (size_t at = all.find("{\"id\":\""); at != std::string::npos; at = all.find("{\"id\":\"", at + 1)) {
    const size_t end = all.find('}', at);
    if (end == std::string::npos)
      break;
    const std::string id = all.substr(at + 7, 9);
    if (home.find("\"id\":\"" + id + "\"") != std::string::npos)
      continue;
    if (out.size() > 1)
      out += ',';
    out += all.substr(at, end - at + 1);
  }
  return out + "]";
}

/* UI thread: systemFont changed (apply_system_font) */
void system_font_tick() {
  if (g_sysfont_pending && time(nullptr) - g_sysfont_pending > 30) {
    unlink(ZT_FONT_PENDING);
    g_sysfont_pending = 0;
    zt_log("fonts: systemFont up for 30 s; font_pending removed");
  }
  if (!g_sysfont_apply.exchange(false))
    return;
  bool on;
  {
    std::lock_guard<std::mutex> lock(g_font_lock);
    on = !g_sysfont.empty() || !g_elemfont.empty();
  }
  if (on) {
    const int fd = open(ZT_FONT_PENDING, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd >= 0)
      close(fd);
    g_sysfont_pending = time(nullptr);
  }
  const int names = theme_psm_names(on ? ++g_sysfont_generation : -1);
  zt_log("fonts: systemFont generation %d, %d libScePsm names", g_sysfont_generation, names);
  if (names == 0) {
    zt_log("fonts: no SST names in libScePsm; systemFont cannot work");
    return;
  }
  relayout_text();
}

/* UI thread, every frame (ZhiThemes' Application.Update hook) */
void theme_tick() {
  if (g_quit)
    return;
  system_font_tick();
  rename_tick();
  zt_native_tick();
}

std::string theme_system_font(const char *sst_name) {
  std::lock_guard<std::mutex> lock(g_font_lock);
  if (!sst_name)
    return g_sysfont;
  const char *dot = strchr(sst_name, '.');
  const std::string variant(sst_name, dot ? dot - sst_name : strlen(sst_name));
  if (variant == "SST-BoldItalic" && !g_elemfont.empty())
    return g_elemfont;
  const int style = variant == "SST-BoldItalic"                    ? 3
                    : variant == "SST-Bold"                        ? 1
                    : variant.find("Italic") != std::string::npos  ? 2
                                                                   : 0;
  return g_style_fonts[style];
}

/* prx.cpp has the real one (ZhiThemes builds) */
__attribute__((weak)) int theme_psm_names(int) { return 0; }


/* prx.cpp: one boot.log line per start-up step (diagnostic build) */
void zt_boot_fine(const char *step);

void install_homeui_js_hooks(MonoImage *react_pui, MonoImage *pui) {
  g_pui = pui;
  zt_native_install(pui);
  zt_boot_fine("js: native install");
  if (!react_pui) {
    zt_log("js: ReactNative.PUI image missing; no theme script");
    return;
  }
  /* Assets/, Themes/<Name>/, active theme (before anything reads the theme) */
  zt_storage_migrate();
  zt_boot_fine("js: storage migrate");
  write_default_script();
  zt_boot_fine("js: default script");
  /* one folder per kind (wallpapers, icons, folders, cache/...) */
  zt_storage_setup();
  zt_boot_fine("js: storage setup");
  /* themes copied to Install/ */
  zt_install_dropped();
  zt_boot_fine("js: install folder");
  /* textures of the built-in particle styles */
  zt_particles_install();
  zt_boot_fine("js: particles");
  /* the frame images of ZhiThemes 21 (molduraExtra, removed; files "moldura-*.png") */
  if (DIR *d = opendir(ZT_DIR)) {
    while (dirent *e = readdir(d))
      if (strncmp(e->d_name, "moldura-", 8) == 0 && strstr(e->d_name, ".png"))
        unlink((std::string(ZT_DIR "/") + e->d_name).c_str());
    closedir(d);
  }
  zt_boot_fine("js: old frame files");

  g_executor_class = mono_class_from_name(react_pui, kNamespace, kClass);
  zt_boot_fine("js: executor class");
  if (!g_executor_class) {
    zt_log("js: %s.%s not found", kNamespace, kClass);
    return;
  }
  g_eval_script =
      mono_class_get_method_from_name(g_executor_class, "EvalScript", 2);
  g_name_field = mono_class_get_field_from_name(g_executor_class, "_name");
  const uint64_t run_script =
      Get_Address_of_Method(react_pui, kNamespace, kClass, "RunScript", 1);
  zt_boot_fine("js: methods found");
  if (!g_eval_script || !run_script) {
    zt_log("js: EvalScript(2)=%p RunScript(1)=0x%lx; no theme script",
                   (void *)g_eval_script, (unsigned long)run_script);
    return;
  }

  const bool run_hooked = zt_hook(
      run_script, reinterpret_cast<void *>(&RunScript_Hook),
      reinterpret_cast<void **>(&g_run_script_orig));
  zt_boot_fine("js: RunScript hook");

  const uint64_t console_log =
      Get_Address_of_Method(react_pui, kNamespace, kClass, "ConsoleLog", 4);
  const bool log_hooked =
      console_log &&
      zt_hook(console_log, reinterpret_cast<void *>(&ConsoleLog_Hook),
                    reinterpret_cast<void **>(&g_console_log_orig));
  zt_boot_fine("js: ConsoleLog hook");

  zt_log("js: hooks RunScript=%d ConsoleLog=%d name_field=%d",
                 (int)run_hooked, (int)log_hooked, g_name_field != nullptr);
}

bool theme_hook(uint64_t address, void *destination, void **original) {
  return zt_hook(address, destination, original);
}

bool theme_quitting() { return g_quit; }

/* for GET /version: hooks in place and hooks found already hooked */
void theme_status(int *hooks, int *doubles) {
  int active = 0;
  for (int i = 0; i < g_hook_count; ++i)
    active += g_hooks[i].committed ? 1 : 0;
  *hooks = active;
  *doubles = g_double_hooks;
}

/* hooks pass straight through from now on, then are swapped back out */
int theme_unload() {
  g_quit = true;
  /* libScePsm must not point at names in this module once it is gone */
  theme_psm_names(-1);
  /* a newer ZhiThemes taking over is not a crash */
  if (g_sysfont_pending)
    unlink(ZT_FONT_PENDING);
  int reverted = 0;
  for (int i = g_hook_count - 1; i >= 0; --i)
    reverted += RevertDetour(&g_hooks[i]) ? 1 : 0;
  zt_log("zhithemes: unloaded, %d of %d hooks reverted", reverted,
                 g_hook_count);
  return reverted;
}

#else

bool theme_hook(uint64_t, void *, void **) { return false; }
std::string theme_script() { return std::string(); }
std::string theme_games() { return "[]"; }
std::string theme_system_font(const char *) { return std::string(); }
void theme_tick() {}
bool theme_quitting() { return false; }
void theme_status(int *hooks, int *doubles) { *hooks = *doubles = 0; }
int theme_unload() { return 0; }

void install_homeui_js_hooks(MonoImage *react_pui, MonoImage *pui) {
  (void)react_pui;
  (void)pui;
}

#endif /* SHELLUI_HOMEUI_JS_INJECT == 1 */
