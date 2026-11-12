/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.

The avatar box hook, the panel tint and the token colour hook follow
AniketosHEN (Copyright (C) 2026 AniketosHEN, GPL-3.0,
git.etawen.dev/Alex0/AniketosHEN: account_avatar.cpp, panel_tint.cpp,
icon_color/chosen_color.cpp, color.cpp). */

#include "zt_native_theme.hpp"

#include "homeui_js_inject.hpp"
#include "zt_log.hpp"
#include "zt_paths.hpp"
#include "zt_storage.hpp"
#include "zt_avatar_codec.h"
#include "zt_avatar_image.hpp"

#if SHELLUI_HOMEUI_JS_INJECT == 1

#include "external_symbols.hpp"
#include "hooked_funcs.hpp"

#include <algorithm>
#include <atomic>
#include <mutex>
#include <pthread.h>
#include <ctype.h>
#include <fcntl.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <string>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>
#include <vector>

/* ZT_AVATARS: zt_storage.hpp (Assets/avatars) */

namespace {

/* Sce.PlayStation.PUI.UIColor as managed code lays it out (20 bytes, by
   value in the setters) */
struct UIColor {
  float r, g, b, a;
  int32_t color_space;
};
static_assert(sizeof(UIColor) == 20, "UIColor");

struct RGB {
  float r, g, b;
};

MonoImage *g_pui = nullptr;

std::string lower(std::string s) {
  for (char &c : s)
    c = (char)tolower((unsigned char)c);
  return s;
}

bool contains(const std::string &s, const char *part) {
  return s.find(part) != std::string::npos;
}

bool ends_with(const std::string &s, const char *tail) {
  const size_t n = strlen(tail);
  return s.size() >= n && s.compare(s.size() - n, n, tail) == 0;
}

/* '#rrggbb' -> 0..1 floats; false when it is not a colour */
bool parse_rgb(const std::string &text, RGB *out) {
  if (text.size() < 7 || text[0] != '#')
    return false;
  unsigned v = 0;
  for (int i = 1; i < 7; ++i) {
    const char c = text[i];
    const int d = c >= '0' && c <= '9' ? c - '0' : c >= 'a' && c <= 'f' ? c - 'a' + 10
                : c >= 'A' && c <= 'F' ? c - 'A' + 10 : -1;
    if (d < 0)
      return false;
    v = v * 16 + (unsigned)d;
  }
  out->r = ((v >> 16) & 255) / 255.0f;
  out->g = ((v >> 8) & 255) / 255.0f;
  out->b = (v & 255) / 255.0f;
  return true;
}

float clamp01(float v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

/* a property of klass or of one of its base classes */
MonoMethod *setter_of(MonoClass *klass, const char *name) {
  for (; klass; klass = klass->parent)
    if (MonoProperty *p = mono_class_get_property_from_name(klass, name))
      return mono_property_get_set_method(p);
  return nullptr;
}

MonoMethod *getter_of(MonoClass *klass, const char *name) {
  for (; klass; klass = klass->parent)
    if (MonoProperty *p = mono_class_get_property_from_name(klass, name))
      return mono_property_get_get_method(p);
  return nullptr;
}

void set_bool(MonoObject *obj, const char *name, bool value) {
  if (!obj)
    return;
  MonoMethod *set = setter_of(mono_object_get_class(obj), name);
  if (!set)
    return;
  void *args[1] = {&value};
  MonoObject *exc = nullptr;
  mono_runtime_invoke(set, obj, args, &exc);
}

void set_int(MonoObject *obj, const char *name, int value) {
  if (!obj)
    return;
  MonoMethod *set = setter_of(mono_object_get_class(obj), name);
  if (!set)
    return;
  void *args[1] = {&value};
  MonoObject *exc = nullptr;
  mono_runtime_invoke(set, obj, args, &exc);
}

/* a bool property; -1 when there is none */
int get_bool(MonoObject *obj, const char *name) {
  if (!obj)
    return -1;
  MonoMethod *get = getter_of(mono_object_get_class(obj), name);
  if (!get)
    return -1;
  MonoObject *exc = nullptr;
  MonoObject *boxed = mono_runtime_invoke(get, obj, nullptr, &exc);
  if (exc || !boxed)
    return -1;
  return *static_cast<bool *>(mono_object_unbox(boxed)) ? 1 : 0;
}

/* ---------------------------------------------------------------- avatar
 * Every picture the ShellUI loads goes through ImageBox.LoadAsync(uri,
 * action, ImageOptions, setImage). The user's own face is
 * "profilecache:image/face/...userId=<id>..."; for the signed-in user it is
 * swapped for the theme's file. An animated GIF / WebP plays when the
 * options say IsAnimatedImage + AnimationDecodeMode 1 and the box has Loop
 * and Autoplay.
 *
 * libScePsm decodes an animated picture whole: past 300x300 or 150 frames
 * it refuses it, or the ShellUI froze and crashed. So the file's header is
 * read first; a GIF over 256 px, over 140 KB, not square or with a crop
 * from the editor's avatar maker (avatarCrop "x,y,side") is fitted in its
 * own thread (zt_avatar_codec.c) to Assets/avatars/cache/<name>_fit.gif and
 * that copy is shown; meanwhile, and when it cannot be fitted, the picture
 * is shown still. A box that has not loaded after kVerifyFrames gets the
 * still picture, then the system's own. The boxes are kept, so a new
 * avatar reloads them; the profile cache is refreshed a few times after
 * the start, so the avatar is back after a reboot or a sign-in. */
using BoxLoadFn = void (*)(MonoObject *box, MonoString *uri, MonoObject *action,
                           MonoObject *option, bool set_image);
BoxLoadFn g_box_orig = nullptr;
MonoClass *g_options_class = nullptr;
MonoClass *g_box_class = nullptr;

std::mutex g_avatar_lock;
std::string g_avatar_path; /* empty = off */
ZtAvatarCrop g_avatar_crop{0, 0, 0};
std::atomic<bool> g_avatar_on{false};
std::atomic<bool> g_avatar_refresh{false};

constexpr int kVerifyFrames = 30;
constexpr size_t kMaxBoxes = 16;
/* enough of a file to count the frames of any picture that can play, and
   the most the codec reads to fit one; read once per file */
constexpr size_t kMaxInspected = 8u << 20;
enum Stage { kAnimated, kStill, kSystem, kLoaded };
struct Box {
  MonoObject *box; /* pinned by handle */
  uint32_t handle;
  MonoObject *action;
  uint32_t action_handle;
  std::string uri, path;
  bool set_image;
  Stage stage;
  int frames;
};
std::vector<Box> g_boxes; /* UI thread only */
int g_face_logs = 0;
int g_avatar_frames = 0;
size_t g_cache_attempt = 0;
bool g_cache_done = false;

/* the chosen file as last read */
struct Inspected {
  std::string path;
  off_t size = -1;
  time_t mtime = 0;
  bool whole = false;
  ZtAvatarImage::Info info;
};
Inspected g_file;
std::string g_reported; /* path|mtime the user was told about */

/* the fit thread: everything but the atomics is touched on the UI thread;
   the worker reads g_fit_job, which stays put while it runs */
struct FitJob {
  std::string source, cache;
  ZtAvatarCrop crop{0, 0, 0};
  unsigned long generation = 0;
};
FitJob g_fit_job;
std::string g_fit_source, g_fit_cache;
ZtAvatarCrop g_fit_crop{0, 0, 0};
unsigned long g_fit_generation = 0;
unsigned long g_fit_failed_generation = 0;
time_t g_fit_failed_mtime = 0;
std::atomic<bool> g_fit_running{false};
std::atomic<bool> g_fit_done{false};
std::atomic<bool> g_fit_ok{false};

bool is_animated(const std::string &path) {
  const std::string l = lower(path);
  return ends_with(l, ".gif") || ends_with(l, ".webp");
}

bool same_crop(const ZtAvatarCrop &a, const ZtAvatarCrop &b) {
  return a.x == b.x && a.y == b.y && a.side == b.side;
}

time_t modified_at(const std::string &path) {
  struct stat st {};
  return stat(path.c_str(), &st) == 0 ? st.st_mtime : 0;
}

std::string base_name(const std::string &path) { return path.substr(path.rfind('/') + 1); }

bool own_face(const std::string &uri) {
  static const char kPrefix[] = "profilecache:image/face/";
  if (uri.compare(0, sizeof(kPrefix) - 1, kPrefix) != 0)
    return false;
  const std::string l = lower(uri);
  size_t at = l.find("userid=");
  size_t len = 7;
  if (at == std::string::npos) {
    at = l.find("userid%3d");
    len = 9;
  }
  int user = -1;
  bool match = false;
  if (at != std::string::npos && sceUserServiceGetForegroundUser(&user) == 0 && user > 0) {
    const long long id = strtoll(uri.c_str() + at + len, nullptr, 0);
    match = (uint32_t)id == (uint32_t)user;
  }
  if (g_face_logs < 6) {
    ++g_face_logs;
    zt_log("avatar: face %.160s (user 0x%x) match=%d", uri.c_str(), (unsigned)user, (int)match);
  }
  return match;
}

const Inspected &inspect(const std::string &path) {
  struct stat st {};
  if (stat(path.c_str(), &st) != 0)
    st.st_size = -1;
  if (path == g_file.path && st.st_size == g_file.size && st.st_mtime == g_file.mtime)
    return g_file;
  g_file = Inspected{};
  g_file.path = path;
  g_file.size = st.st_size;
  g_file.mtime = st.st_mtime;
  if (st.st_size > 0) {
    const size_t want = std::min((size_t)st.st_size, kMaxInspected);
    std::string bytes(want, '\0');
    const int fd = open(path.c_str(), O_RDONLY);
    size_t got = 0;
    if (fd >= 0) {
      ssize_t n;
      while (got < want && (n = read(fd, &bytes[got], want - got)) > 0)
        got += (size_t)n;
      close(fd);
    }
    g_file.whole = got == (size_t)st.st_size;
    g_file.info = ZtAvatarImage::Inspect(reinterpret_cast<const uint8_t *>(bytes.data()), got);
  }
  zt_log("avatar: %s format %d %dx%d frames %d bytes %lld", path.c_str(), (int)g_file.info.format,
         g_file.info.width, g_file.info.height, g_file.info.frames, (long long)g_file.size);
  return g_file;
}

bool loads_as_is(const Inspected &f) { return ZtAvatarImage::LoadsAsIs(f.info, f.whole); }

bool needs_fit(const Inspected &f, const ZtAvatarCrop &crop) {
  return ends_with(lower(f.path), ".gif") && f.info.format == ZtAvatarImage::Format::Gif &&
         (zt_avatar_should_fit(f.path.c_str(), &crop) || !loads_as_is(f));
}

std::string cache_path_for(const std::string &source) {
  std::string name = base_name(source);
  const size_t dot = name.rfind('.');
  if (dot != std::string::npos && dot > 0)
    name = name.substr(0, dot);
  return std::string(ZT_AVATARS "/cache/") + name + "_fit.gif";
}

void chosen(std::string *path, ZtAvatarCrop *crop) {
  std::lock_guard<std::mutex> lock(g_avatar_lock);
  *path = g_avatar_path;
  *crop = g_avatar_crop;
}

void *fit_worker(void *) {
  char error[160] = {};
  const int r = zt_avatar_fit(g_fit_job.source.c_str(), g_fit_job.cache.c_str(), &g_fit_job.crop,
                              error, sizeof(error));
  if (r == 0)
    zt_log("avatar: fitted %s -> %s", g_fit_job.source.c_str(), g_fit_job.cache.c_str());
  else
    zt_log("avatar: fit of %s failed: %s", g_fit_job.source.c_str(), error[0] ? error : "unknown");
  g_fit_ok = r == 0;
  g_fit_done = true;
  return nullptr;
}

void start_fit() {
  g_fit_job.source = g_fit_source;
  g_fit_job.cache = g_fit_cache;
  g_fit_job.crop = g_fit_crop;
  g_fit_job.generation = g_fit_generation;
  g_fit_done = false;
  g_fit_ok = false;
  g_fit_running = true;
  zt_mkdirs(ZT_AVATARS "/cache");
  zt_log("avatar: fitting %s (crop %d,%d %d) in the background", g_fit_source.c_str(),
         g_fit_crop.x, g_fit_crop.y, g_fit_crop.side);
  pthread_t thread{};
  if (pthread_create(&thread, nullptr, fit_worker, nullptr) != 0) {
    g_fit_running = false;
    zt_log("avatar: fit thread not started");
    return;
  }
  pthread_detach(thread);
}

void request_fit(const std::string &source, const std::string &cache, const ZtAvatarCrop &crop) {
  if (source != g_fit_source || cache != g_fit_cache || !same_crop(crop, g_fit_crop)) {
    g_fit_source = source;
    g_fit_cache = cache;
    g_fit_crop = crop;
    ++g_fit_generation;
  }
  if (g_fit_running || theme_quitting() ||
      (g_fit_failed_generation == g_fit_generation && g_fit_failed_mtime == modified_at(source)))
    return;
  start_fit();
}

/* the file the boxes load: the fitted copy when there is one */
std::string effective_path() {
  std::string source;
  ZtAvatarCrop crop;
  chosen(&source, &crop);
  if (source.empty() || !needs_fit(inspect(source), crop))
    return source;
  const std::string cache = cache_path_for(source);
  if (zt_avatar_cache_valid(source.c_str(), cache.c_str(), &crop))
    return cache;
  request_fit(source, cache, crop);
  return source;
}

/* the fitted copy plays; the chosen file only within the system's limits
   and not while it is being fitted, else it is shown still */
bool plays(const std::string &path) {
  if (!is_animated(path))
    return false;
  if (path != g_file.path)
    return true;
  return loads_as_is(g_file) && !(g_fit_running && path == g_fit_source);
}

/* a ZhiThemes notification (also logged) */
void tell(const char *format, ...) __attribute__((format(printf, 1, 2)));
void tell(const char *format, ...) {
  char text[300];
  va_list args;
  va_start(args, format);
  vsnprintf(text, sizeof(text), format, args);
  va_end(args);
  zt_menu_notify(text);
}

/* tells the user once why the chosen picture will not play */
void report_chosen() {
  std::string path;
  ZtAvatarCrop crop;
  chosen(&path, &crop);
  if (path.empty())
    return;
  const Inspected &f = inspect(path);
  const std::string key = path + "|" + std::to_string((long long)f.mtime);
  if (key == g_reported)
    return;
  const std::string name = base_name(path);
  const ZtAvatarImage::Problem problem = ZtAvatarImage::Check(f.info);
  if (problem == ZtAvatarImage::Problem::NotPicture) {
    g_reported = key;
    tell("avatar %s is not a picture the PS5 can show", name.c_str());
  } else if (needs_fit(f, crop) || loads_as_is(f)) {
    return;
  } else {
    g_reported = key;
    if (problem == ZtAvatarImage::Problem::TooManyFrames)
      tell("avatar %s has %d frames (the PS5 plays 150): shown still", name.c_str(), f.info.frames);
    else
      tell("avatar %s is %dx%d (the PS5 plays 300x300): shown still", name.c_str(), f.info.width,
             f.info.height);
  }
}

void avatar_reload_boxes();

void consume_fit() {
  if (!g_fit_done)
    return;
  const bool ok = g_fit_ok;
  g_fit_done = false;
  g_fit_running = false;
  if (g_fit_job.generation != g_fit_generation) {
    if (!g_fit_source.empty() && !theme_quitting())
      start_fit();
    return;
  }
  if (ok) {
    if (zt_avatar_cache_valid(g_fit_job.source.c_str(), g_fit_job.cache.c_str(), &g_fit_job.crop))
      avatar_reload_boxes();
    return;
  }
  g_fit_failed_generation = g_fit_generation;
  g_fit_failed_mtime = modified_at(g_fit_job.source);
  std::string path;
  ZtAvatarCrop crop;
  chosen(&path, &crop);
  if (g_fit_job.source != path)
    return;
  /* shown still while fitting: plays now if the system can take it as is */
  if (loads_as_is(inspect(path)))
    avatar_reload_boxes();
  else
    tell("avatar %s is too big to play: shown still", base_name(path).c_str());
}

MonoObject *make_options(bool animated) {
  if (!g_options_class)
    return nullptr;
  MonoObject *o = mono_object_new(mono_domain_get(), g_options_class);
  if (!o)
    return nullptr;
  mono_runtime_object_init(o);
  set_bool(o, "IsAnimatedImage", animated);
  set_int(o, "AnimationDecodeMode", animated ? 1 : 0);
  return o;
}

void call_box(const Box &b, const std::string &uri, MonoObject *option, bool play) {
  if (play) {
    set_bool(b.box, "Loop", true);
    set_bool(b.box, "Autoplay", true);
  }
  g_box_orig(b.box, mono_string_new(mono_domain_get(), uri.c_str()), b.action, option, b.set_image);
  if (play) {
    set_bool(b.box, "Loop", true);
    set_bool(b.box, "Autoplay", true);
  }
}

void forget_box(size_t i) {
  if (g_boxes[i].handle)
    mono_gchandle_free(g_boxes[i].handle);
  if (g_boxes[i].action_handle)
    mono_gchandle_free(g_boxes[i].action_handle);
  g_boxes.erase(g_boxes.begin() + (long)i);
}

bool box_disposed(MonoObject *box) { return get_bool(box, "IsDisposed") == 1; }

enum class Load { kOk, kPending, kFailed };

/* IsLoadSuccessful is also false while the load still runs, so only a
   finished one (the private isLoadCompleted) counts as failed; without
   either, a load counts as shown */
Load load_state(MonoObject *box) {
  static MonoClassField *completed = nullptr;
  static bool looked = false;
  if (!looked) {
    looked = true;
    for (MonoClass *k = g_box_class; k && !completed; k = k->parent)
      completed = mono_class_get_field_from_name(k, "isLoadCompleted");
    zt_log("avatar: ImageBox.isLoadCompleted %p", (void *)completed);
  }
  const int ok = get_bool(box, "IsLoadSuccessful");
  if (ok != 0 || !completed)
    return Load::kOk;
  alignas(8) uint8_t done[8]{};
  mono_field_get_value(box, completed, done);
  return done[0] ? Load::kFailed : Load::kPending;
}

/* without ImageBox.Autoplay a loaded animation stands on its first frame */
void play_without_autoplay(MonoObject *box) {
  static int autoplay = -1;
  if (autoplay < 0)
    autoplay = getter_of(g_box_class, "Autoplay") ? 1 : 0;
  if (autoplay)
    return;
  MonoMethod *play = nullptr;
  for (MonoClass *k = g_box_class; k && !play; k = k->parent)
    play = mono_class_get_method_from_name(k, "Play", 0);
  if (!play)
    return;
  set_bool(box, "Loop", true);
  MonoObject *exc = nullptr;
  mono_runtime_invoke(play, box, nullptr, &exc);
}

void verify_box(Box &b) {
  const Load load = load_state(b.box);
  if (load == Load::kPending) {
    b.frames = kVerifyFrames;
    return;
  }
  if (load == Load::kOk) {
    if (b.stage == kAnimated)
      play_without_autoplay(b.box);
    if (b.stage != kLoaded)
      zt_log("avatar: shown (%s)", b.stage == kAnimated ? "animated" : b.stage == kStill ? "still" : "system");
    b.stage = kLoaded;
    return;
  }
  if (b.stage == kAnimated) {
    b.stage = kStill;
    b.frames = kVerifyFrames;
    zt_log("avatar: animated %s did not show; trying it still", b.path.c_str());
    call_box(b, b.path, make_options(false), false);
  } else if (b.stage == kStill) {
    b.stage = kSystem;
    b.frames = kVerifyFrames;
    zt_log("avatar: %s did not show; system picture", b.path.c_str());
    call_box(b, b.uri, nullptr, false);
  } else if (b.stage == kSystem) {
    b.stage = kLoaded;
    zt_log("avatar: even the system picture did not load");
  }
}

void BoxLoad_Hook(MonoObject *box, MonoString *uri, MonoObject *action, MonoObject *option,
                  bool set_image) {
  /* off (or leaving): every picture of the ShellUI passes untouched */
  if (!g_avatar_on || theme_quitting() || !box || !uri) {
    g_box_orig(box, uri, action, option, set_image);
    return;
  }
  const std::string text = Mono_to_String(uri);
  const std::string path = own_face(text) ? effective_path() : std::string();
  if (path.empty()) {
    g_box_orig(box, uri, action, option, set_image);
    return;
  }
  const bool animated = plays(path);
  /* the same box asked again: its old entry goes */
  for (size_t i = 0; i < g_boxes.size(); ++i)
    if (g_boxes[i].box == box) {
      forget_box(i);
      break;
    }
  for (size_t i = g_boxes.size(); i-- > 0;)
    if (box_disposed(g_boxes[i].box))
      forget_box(i);
  if (g_boxes.size() >= kMaxBoxes)
    forget_box(0);
  Box b{box, mono_gchandle_new(box, 1), action, action ? mono_gchandle_new(action, 1) : 0u,
        text, path, set_image, animated ? kAnimated : kStill, kVerifyFrames};
  g_boxes.push_back(b);
  if (option) {
    set_bool(option, "IsAnimatedImage", animated);
    set_int(option, "AnimationDecodeMode", animated ? 1 : 0);
  } else {
    option = make_options(animated);
  }
  static std::string logged;
  const std::string key = path + (animated ? "|a" : "|s");
  if (logged != key) {
    logged = key;
    zt_log("avatar: %s -> %s (animated %d)", text.c_str(), path.c_str(), (int)animated);
  }
  call_box(b, path, option, animated);
}

bool refresh_profile_cache() {
  static MonoMethod *refresh = nullptr;
  static bool looked = false;
  if (!looked) {
    MonoImage *image = getDLLimage("Sce.Vsh.ProfileCache.dll");
    MonoClass *k = image ? mono_class_from_name(image, "Sce.Vsh.ProfileCache", "Utilities") : nullptr;
    refresh = k ? mono_class_get_method_from_name(k, "RefreshCache", 1) : nullptr;
    looked = refresh != nullptr; /* the dll may load later */
    zt_log("avatar: ProfileCache.Utilities.RefreshCache %p", (void *)refresh);
  }
  int user = -1;
  if (!refresh || sceUserServiceGetForegroundUser(&user) != 0 || user <= 0)
    return false;
  void *args[1] = {&user};
  MonoObject *exc = nullptr;
  mono_runtime_invoke(refresh, nullptr, args, &exc);
  zt_log("avatar: profile cache refreshed (user 0x%x, exception %d)", (unsigned)user, exc ? 1 : 0);
  return exc == nullptr;
}

/* every box showing the face loads it again (new file, fitted copy ready,
   avatar off) */
void avatar_reload_boxes() {
  report_chosen();
  const std::string path = g_avatar_on ? effective_path() : std::string();
  const bool animated = plays(path);
  int reloaded = 0;
  for (size_t i = g_boxes.size(); i-- > 0;) {
    Box &b = g_boxes[i];
    if (box_disposed(b.box)) {
      forget_box(i);
      continue;
    }
    b.frames = kVerifyFrames;
    if (path.empty()) {
      b.stage = kSystem;
      call_box(b, b.uri, nullptr, false);
    } else {
      b.path = path;
      b.stage = animated ? kAnimated : kStill;
      call_box(b, path, make_options(animated), animated);
    }
    ++reloaded;
  }
  zt_log("avatar: %d box(es) reloaded with %s (animated %d)", reloaded,
         path.empty() ? "the system picture" : path.c_str(), (int)animated);
  /* off: nothing left to watch */
  if (path.empty())
    while (!g_boxes.empty())
      forget_box(g_boxes.size() - 1);
}

void avatar_tick() {
  consume_fit();
  if (g_avatar_refresh.exchange(false)) {
    avatar_reload_boxes();
    refresh_profile_cache();
  }
  /* after a reboot or a sign-in the profile cache may come late: asked
     again a few times while the avatar is on */
  if (g_avatar_frames < 3601)
    ++g_avatar_frames;
  static const int kCacheFrames[] = {300, 900, 1800, 3600};
  if (g_avatar_on && !g_cache_done && g_cache_attempt < 4 &&
      g_avatar_frames >= kCacheFrames[g_cache_attempt]) {
    ++g_cache_attempt;
    g_cache_done = refresh_profile_cache();
  }
  for (Box &b : g_boxes)
    if (b.frames > 0 && --b.frames == 0)
      verify_box(b);
}

void install_avatar() {
  g_box_class = mono_class_from_name(g_pui, "Sce.PlayStation.PUI.UI3", "ImageBox");
  g_options_class = mono_class_from_name(g_pui, "Sce.PlayStation.PUI", "ImageOptions");
  const uint64_t at = g_box_class ? Get_Address_of_Method(g_pui, g_box_class, "LoadAsync", 4) : 0;
  const bool ok = at && g_options_class &&
                  theme_hook(at, reinterpret_cast<void *>(&BoxLoad_Hook),
                             reinterpret_cast<void **>(&g_box_orig));
  zt_log("avatar: ImageBox.LoadAsync %#lx options %p hook=%d", (unsigned long)at,
         (void *)g_options_class, (int)ok);
  if (!ok)
    g_box_orig = nullptr;
}

/* ---------------------------------------------------------- panel tint
 * Native panels get their colour with Panel.set_BackgroundColor; the tint
 * keeps each panel's brightness and alpha (scaled by panelTintOpacity) and
 * moves its hue to panelTintColor by panelTintStrength. Panels already on
 * screen keep their colour until they are drawn again (open the page
 * again). Full-screen basemats, the background layer, React views (our own
 * rows) and toasts are left alone. */
using SetBgFn = void (*)(MonoObject *, UIColor);
SetBgFn g_set_bg_orig = nullptr;
using TestIdFn = MonoString *(*)(MonoObject *);
TestIdFn g_test_id = nullptr;
/* Widget.GetTokenColor(key, widget) returns a 20-byte UIColor through a
   hidden pointer (first argument, given back in rax); TryGetTokenColor(key,
   out colour, widget) */
/* assumed the hidden pointer first and read an empty key
   (wrong order): the hook takes the raw registers and finds the order on
   the first call (the return pointer comes back in rax and is on the
   stack, the key is the one that is a String) */
using GetTokenFn = void *(*)(void *, void *, void *, void *);
using TryTokenFn = bool (*)(MonoString *, UIColor *, MonoObject *);
GetTokenFn g_get_token_orig = nullptr;
TryTokenFn g_try_token_orig = nullptr;

std::atomic<bool> g_panel_on{false};
RGB g_panel_rgb{1, 1, 1};
float g_panel_strength = 0.5f, g_panel_opacity = 1;
std::atomic<bool> g_icon_on{false};
RGB g_icon_rgb{1, 1, 1};
int g_panel_logs = 0;

void rgb_to_hsv(RGB c, float *h, float *s, float *v) {
  const float mx = std::max(c.r, std::max(c.g, c.b)), mn = std::min(c.r, std::min(c.g, c.b));
  const float d = mx - mn;
  *v = mx;
  *s = mx > 0 ? d / mx : 0;
  float hh = 0;
  if (d > 0) {
    if (mx == c.r)
      hh = (c.g - c.b) / d + (c.g < c.b ? 6 : 0);
    else if (mx == c.g)
      hh = (c.b - c.r) / d + 2;
    else
      hh = (c.r - c.g) / d + 4;
    hh /= 6;
  }
  *h = hh;
}

RGB hsv_to_rgb(float h, float s, float v) {
  const int i = (int)(h * 6) % 6;
  const float f = h * 6 - (float)(int)(h * 6), p = v * (1 - s), q = v * (1 - f * s),
              t = v * (1 - (1 - f) * s);
  switch (i < 0 ? 0 : i) {
  case 0: return {v, t, p};
  case 1: return {q, v, p};
  case 2: return {p, v, t};
  case 3: return {p, q, v};
  case 4: return {t, p, v};
  default: return {v, p, q};
  }
}

/* AniketosHEN's TintPreservingBrightness */
UIColor tint(UIColor in) {
  const RGB src{clamp01(in.r), clamp01(in.g), clamp01(in.b)};
  float sh, ss, sv, th, ts, tv;
  rgb_to_hsv(src, &sh, &ss, &sv);
  rgb_to_hsv(g_panel_rgb, &th, &ts, &tv);
  tv = clamp01(tv * (0.35f + 0.65f * sv));
  const RGB themed = hsv_to_rgb(th, ts, tv);
  const float k = clamp01(g_panel_strength);
  return {clamp01(src.r + (themed.r - src.r) * k), clamp01(src.g + (themed.g - src.g) * k),
          clamp01(src.b + (themed.b - src.b) * k), clamp01(in.a * g_panel_opacity), in.color_space};
}

const char *class_name(MonoObject *obj) {
  MonoClass *k = obj ? mono_object_get_class(obj) : nullptr;
  return k ? mono_class_get_name(k) : nullptr;
}

bool excluded_panel(MonoObject *obj) {
  const char *name = class_name(obj);
  if (!name)
    return true;
  if (strstr(name, "BGLayer") || strstr(name, "BaseMatLayer") ||
      strcmp(name, "FullScreenBasemat") == 0 || strcmp(name, "ImageBasemat") == 0 ||
      strcmp(name, "PanelBasemat") == 0 || strncmp(name, "React", 5) == 0)
    return true;
  if (!strstr(name, "FocusLayer") || !g_test_id)
    return false;
  MonoString *m = g_test_id(obj);
  const std::string id = m ? Mono_to_String(m) : std::string();
  return contains(id, "toast") || contains(id, "notification") || contains(id, "banner") ||
         id == "tile-item-focus-layer" || contains(id, "overlay-screen");
}

void SetBackground_Hook(MonoObject *self, UIColor colour) {
  if (!g_panel_on || theme_quitting() || colour.a <= 0.01f || excluded_panel(self)) {
    g_set_bg_orig(self, colour);
    return;
  }
  g_set_bg_orig(self, tint(colour));
  if (g_panel_logs < 3) {
    ++g_panel_logs;
    const char *n = class_name(self);
    zt_log("panels: %s tinted (%.2f %.2f %.2f %.2f)", n ? n : "?", colour.r, colour.g, colour.b, colour.a);
  }
}

/* panel_tint.cpp surface_token: backgrounds of panels, menus, dialogs */
bool surface_token(const std::string &l) {
  static const char *yes[] = {"background", "basemat", "surface", "panel", "dialog",
                              "modal", "popup", "menu", "card", "container"};
  static const char *no[] = {"text", "icon", "focus", "border", "separator", "shadow",
                             "button", "disabled", "progress", "slider", "label"};
  bool hit = false;
  for (const char *w : yes)
    hit = hit || contains(l, w);
  if (!hit)
    return false;
  for (const char *w : no)
    if (contains(l, w))
      return false;
  return true;
}

bool icon_token(const std::string &l) {
  return contains(l, "icon") && !contains(l, "background") && !contains(l, "surface") &&
         !contains(l, "basemat");
}

/* a colour token the system just read: icon / surface tint */
void token_seen(MonoString *key, UIColor *colour) {
  if (!colour || !key || theme_quitting() || !(g_panel_on || g_icon_on))
    return;
  const std::string l = lower(Mono_to_String(key));
  if (g_icon_on && icon_token(l)) {
    colour->r = g_icon_rgb.r;
    colour->g = g_icon_rgb.g;
    colour->b = g_icon_rgb.b;
  } else if (g_panel_on && surface_token(l)) {
    *colour = tint(*colour);
  }
}

std::atomic<int> g_get_layout{-1}; /* ret * 3 + key; -2 = not found */

bool near_stack(void *p) {
  char here;
  const uintptr_t a = (uintptr_t)&here, b = (uintptr_t)p;
  return b > a - (8u << 20) && b < a + (8u << 20);
}

bool is_string_object(void *p) {
  if (!p || (uintptr_t)p < 0x100000 || ((uintptr_t)p & 7) || near_stack(p))
    return false;
  MonoClass *k = mono_object_get_class(static_cast<MonoObject *>(p));
  const char *n = k ? mono_class_get_name(k) : nullptr;
  return n && strcmp(n, "String") == 0;
}

void *GetToken_Hook(void *a0, void *a1, void *a2, void *a3) {
  void *out = g_get_token_orig(a0, a1, a2, a3);
  if (theme_quitting() || !(g_panel_on || g_icon_on))
    return out;
  void *args[3] = {a0, a1, a2};
  int layout = g_get_layout;
  if (layout == -1) {
    int ret = -1, key = -1;
    for (int i = 0; i < 3; ++i) {
      if (ret < 0 && args[i] == out && near_stack(args[i]))
        ret = i;
      else if (key < 0 && is_string_object(args[i]))
        key = i;
    }
    layout = ret >= 0 && key >= 0 ? ret * 3 + key : -2;
    g_get_layout = layout;
    zt_log("tokens: GetTokenColor arguments a0 %p a1 %p a2 %p, rax %p -> return a%d, key a%d%s", a0, a1,
           a2, out, ret, key, layout < 0 ? " (not understood: GetTokenColor left alone)" : "");
  }
  if (layout >= 0)
    token_seen(static_cast<MonoString *>(args[layout % 3]), static_cast<UIColor *>(args[layout / 3]));
  return out;
}

bool TryToken_Hook(MonoString *key, UIColor *colour, MonoObject *widget) {
  const bool found = g_try_token_orig(key, colour, widget);
  if (found && is_string_object(key))
    token_seen(key, colour);
  return found;
}

void install_panels() {
  const char *ns = "Sce.PlayStation.PUI.UI3";
  MonoClass *panel = mono_class_from_name(g_pui, ns, "Panel");
  MonoClass *widget = mono_class_from_name(g_pui, ns, "Widget");
  if (widget)
    g_test_id = reinterpret_cast<TestIdFn>(Get_Address_of_Method(g_pui, widget, "get_TestId", 0));
  const uint64_t set_bg = panel ? Get_Address_of_Method(g_pui, panel, "set_BackgroundColor", 1) : 0;
  const bool a = set_bg && theme_hook(set_bg, reinterpret_cast<void *>(&SetBackground_Hook),
                                      reinterpret_cast<void **>(&g_set_bg_orig));
  const uint64_t get = widget ? Get_Address_of_Method(g_pui, widget, "GetTokenColor", 2) : 0;
  const bool b = get && theme_hook(get, reinterpret_cast<void *>(&GetToken_Hook),
                                   reinterpret_cast<void **>(&g_get_token_orig));
  const uint64_t tryget = widget ? Get_Address_of_Method(g_pui, widget, "TryGetTokenColor", 3) : 0;
  const bool c = tryget && theme_hook(tryget, reinterpret_cast<void *>(&TryToken_Hook),
                                      reinterpret_cast<void **>(&g_try_token_orig));
  zt_log("panels: Panel.set_BackgroundColor %#lx hook=%d, Widget.GetTokenColor %#lx hook=%d, "
         "Widget.TryGetTokenColor %#lx hook=%d, testId %d",
         (unsigned long)set_bg, (int)a, (unsigned long)get, (int)b, (unsigned long)tryget, (int)c,
         g_test_id != nullptr);
  if (!a)
    g_set_bg_orig = nullptr;
  if (!b)
    g_get_token_orig = nullptr;
  if (!c)
    g_try_token_orig = nullptr;
}

/* ------------------------------------------------- system background
 * The background behind Settings, Trophies and every system screen is the
 * ShellUI's own BGLayer: a basemat colour and a light (glow) colour, set
 * with BGLayerPlugin.SetThemedBackgroundBasematColor(Nullable<UIColor>) and
 * SetThemedLightColor(Vector4) (AniketosHEN shell_background.cpp). The
 * basemat setter is called through its compiled code: mono_runtime_invoke
 * mis-passes the 24-byte Nullable by value and took ShellUI down there. The
 * stock colours are read once (layer.themedLightColor and
 * layer.BGTransition.themedBackgroundBasematColor) to go back to them. UI
 * thread only (zt_native_tick). */
struct Vector4 {
  float x, y, z, w;
};
struct NullableUIColor {
  uint8_t has_value;
  uint8_t padding[3];
  UIColor value;
};
static_assert(sizeof(NullableUIColor) == 24, "Nullable<UIColor>");
using BasematFn = void (*)(MonoObject *, NullableUIColor);

MonoMethod *g_bg_instance = nullptr, *g_bg_light = nullptr;
BasematFn g_bg_basemat = nullptr;
MonoClassField *g_bg_layer_field = nullptr;
bool g_bg_resolve_tried = false;
std::atomic<bool> g_bg_on{false};
RGB g_bg_base{0.02f, 0.06f, 0.12f}, g_bg_glow{0.18f, 0.82f, 0.9f};
float g_bg_intensity = 1, g_bg_speed = 1;
bool g_bg_rainbow = false;
std::atomic<int> g_bg_generation{0};
int g_bg_drawn_generation = -1, g_bg_frames = 0;
MonoObject *g_bg_layer_seen = nullptr;
bool g_bg_applied = false, g_bg_captured = false;
Vector4 g_bg_stock_light{1, 1, 1, 1};
NullableUIColor g_bg_stock_base{};
uint32_t g_bg_last_drawn = 0;

bool bg_resolve() {
  if (g_bg_instance && g_bg_light && g_bg_basemat && g_bg_layer_field)
    return true;
  if (g_bg_resolve_tried)
    return false;
  g_bg_resolve_tried = true;
  MonoImage *image = getDLLimage("Sce.Vsh.ShellUI.BGLayer.dll");
  MonoClass *plugin = image ? mono_class_from_name(image, "Sce.Vsh.ShellUI.BGLayer", "BGLayerPlugin") : nullptr;
  if (plugin) {
    g_bg_instance = mono_class_get_method_from_name(plugin, "get_Instance", 0);
    g_bg_light = mono_class_get_method_from_name(plugin, "SetThemedLightColor", 1);
    MonoMethod *basemat = mono_class_get_method_from_name(plugin, "SetThemedBackgroundBasematColor", 1);
    g_bg_basemat = basemat ? reinterpret_cast<BasematFn>(mono_compile_method(basemat)) : nullptr;
    g_bg_layer_field = mono_class_get_field_from_name(plugin, "m_layer");
  }
  zt_log("system bg: BGLayerPlugin %p instance %p light %p basemat %p layer field %p", (void *)plugin,
         (void *)g_bg_instance, (void *)g_bg_light, (void *)g_bg_basemat, (void *)g_bg_layer_field);
  return g_bg_instance && g_bg_light && g_bg_basemat && g_bg_layer_field;
}

MonoObject *bg_plugin() {
  MonoObject *exc = nullptr;
  MonoObject *p = mono_runtime_invoke(g_bg_instance, nullptr, nullptr, &exc);
  return exc ? nullptr : p;
}

MonoObject *bg_layer(MonoObject *plugin) {
  MonoObject *layer = nullptr;
  if (plugin)
    mono_field_get_value(plugin, g_bg_layer_field, &layer);
  return layer;
}

void bg_capture(MonoObject *layer) {
  if (g_bg_captured || !layer)
    return;
  MonoClass *k = mono_object_get_class(layer);
  if (MonoClassField *f = k ? mono_class_get_field_from_name(k, "themedLightColor") : nullptr) {
    alignas(8) uint8_t raw[32] = {};
    mono_field_get_value(layer, f, raw);
    Vector4 v;
    memcpy(&v, raw, sizeof(v));
    if (v.x >= 0 && v.x < 8 && v.y >= 0 && v.y < 8 && v.z >= 0 && v.z < 8)
      g_bg_stock_light = v;
  }
  MonoMethod *get = k ? mono_class_get_method_from_name(k, "get_BGTransition", 0) : nullptr;
  MonoObject *exc = nullptr;
  MonoObject *tr = get ? mono_runtime_invoke(get, layer, nullptr, &exc) : nullptr;
  MonoClass *tk = tr && !exc ? mono_object_get_class(tr) : nullptr;
  MonoClassField *f = tk ? mono_class_get_field_from_name(tk, "themedBackgroundBasematColor") : nullptr;
  if (!f)
    return;
  alignas(8) uint8_t raw[32] = {};
  mono_field_get_value(tr, f, raw);
  memcpy(&g_bg_stock_base, raw, sizeof(g_bg_stock_base));
  g_bg_captured = true;
  zt_log("system bg: stock light %.3f %.3f %.3f %.3f, basemat has=%d %.3f %.3f %.3f %.3f",
         g_bg_stock_light.x, g_bg_stock_light.y, g_bg_stock_light.z, g_bg_stock_light.w,
         g_bg_stock_base.has_value, g_bg_stock_base.value.r, g_bg_stock_base.value.g,
         g_bg_stock_base.value.b, g_bg_stock_base.value.a);
}

bool bg_set(MonoObject *plugin, const NullableUIColor &base, Vector4 light) {
  g_bg_basemat(plugin, base);
  void *args[1] = {&light};
  MonoObject *exc = nullptr;
  mono_runtime_invoke(g_bg_light, plugin, args, &exc);
  return exc == nullptr;
}

uint64_t now_ms() {
  struct timespec ts;
  clock_gettime(CLOCK_MONOTONIC, &ts);
  return (uint64_t)ts.tv_sec * 1000 + (uint64_t)ts.tv_nsec / 1000000;
}

void bg_tick() {
  const bool on = g_bg_on;
  if (!on && !g_bg_applied)
    return;
  const int generation = g_bg_generation;
  /* the layer is looked at twice a second (a new one = colours again) */
  const bool look = ++g_bg_frames >= 30 || generation != g_bg_drawn_generation;
  if (!look && !(on && g_bg_rainbow && g_bg_frames % 3 == 0))
    return;
  if (look)
    g_bg_frames = 0;
  if (!bg_resolve())
    return;
  MonoObject *plugin = bg_plugin();
  MonoObject *layer = bg_layer(plugin);
  if (!plugin || !layer)
    return;
  bg_capture(layer);
  const bool new_layer = layer != g_bg_layer_seen;
  g_bg_layer_seen = layer;
  if (!on) {
    if (g_bg_captured)
      bg_set(plugin, g_bg_stock_base, g_bg_stock_light);
    g_bg_applied = false;
    g_bg_drawn_generation = generation;
    zt_log("system bg: stock colours back");
    return;
  }
  RGB base = g_bg_base, glow = g_bg_glow;
  if (g_bg_rainbow) {
    const float hue = (float)((now_ms() % 600000) / 1000.0) * 0.05f * g_bg_speed;
    glow = hsv_to_rgb(hue - (float)(int)hue, 1, 1);
    base = {glow.r * 0.067f, glow.g * 0.067f, glow.b * 0.067f};
  }
  const uint32_t drawn = (uint32_t)(base.r * 63) << 24 ^ (uint32_t)(base.g * 63) << 18 ^
                         (uint32_t)(base.b * 63) << 12 ^ (uint32_t)(glow.r * 255) << 8 ^
                         (uint32_t)(glow.g * 255) << 4 ^ (uint32_t)(glow.b * 255);
  if (!new_layer && generation == g_bg_drawn_generation && drawn == g_bg_last_drawn)
    return;
  const NullableUIColor b{1, {0, 0, 0}, {clamp01(base.r), clamp01(base.g), clamp01(base.b), 1, 0}};
  const float k = g_bg_intensity < 0 ? 0 : g_bg_intensity > 2 ? 2 : g_bg_intensity;
  const bool ok = bg_set(plugin, b, {glow.r * k, glow.g * k, glow.b * k, 1});
  if (generation != g_bg_drawn_generation || new_layer)
    zt_log("system bg: base %.3f %.3f %.3f glow %.3f %.3f %.3f x%.2f%s (%s)", base.r, base.g, base.b,
           glow.r, glow.g, glow.b, k, g_bg_rainbow ? " rainbow" : "", ok ? "ok" : "light threw");
  g_bg_applied = true;
  g_bg_drawn_generation = generation;
  g_bg_last_drawn = drawn;
}

bool g_installed = false;
bool g_avatar_tried = false, g_panels_tried = false;

} // namespace

/* the hooks themselves go in the first time a theme turns the feature on
   (like the focus frame hooks): a theme without them changes nothing */
void zt_native_install(MonoImage *pui) {
  if (g_installed || !pui)
    return;
  g_installed = true;
  g_pui = pui;
  zt_mkdirs(ZT_AVATARS);
  zt_sys_video_install(pui);
}

void zt_native_apply(const std::string &script) {
  if (!g_installed)
    return;
  zt_sys_video_apply(script);
  if (!g_avatar_tried && zt_theme_number(script, "avatarOn", 0) != 0) {
    g_avatar_tried = true;
    install_avatar();
  }
  if (!g_panels_tried && (zt_theme_number(script, "panelTintOn", 0) != 0 ||
                          zt_theme_number(script, "iconTintOn", 0) != 0)) {
    g_panels_tried = true;
    install_panels();
  }
  /* avatar: a file of avatars/ */
  std::string path;
  const std::string name = zt_theme_text(script, "avatar");
  if (zt_theme_number(script, "avatarOn", 0) != 0 && !name.empty() && name.find('/') == std::string::npos) {
    const std::string l = lower(name);
    struct stat st {};
    const std::string full = std::string(ZT_AVATARS "/") + name;
    const bool picture = ends_with(l, ".gif") || ends_with(l, ".webp") || ends_with(l, ".png") ||
                         ends_with(l, ".jpg") || ends_with(l, ".jpeg");
    if (!picture)
      zt_log("avatar: %s is not a .gif/.webp/.png/.jpg", name.c_str());
    else if (stat(full.c_str(), &st) != 0 || st.st_size <= 0)
      zt_log("avatar: %s missing", full.c_str());
    else
      path = full;
  }
  /* avatarCrop 'x,y,side': the square the editor's avatar maker chose, in
     the source's pixels (fitted on the PS5); none = the middle square */
  ZtAvatarCrop crop{0, 0, 0};
  if (!path.empty()) {
    const std::string c = zt_theme_text(script, "avatarCrop");
    int x = 0, y = 0, side = 0;
    if (sscanf(c.c_str(), "%d,%d,%d", &x, &y, &side) == 3 && x >= 0 && y >= 0 && side > 0)
      crop = ZtAvatarCrop{x, y, side};
  }
  bool changed;
  {
    std::lock_guard<std::mutex> lock(g_avatar_lock);
    changed = path != g_avatar_path || !same_crop(crop, g_avatar_crop);
    g_avatar_path = path;
    g_avatar_crop = crop;
  }
  /* the face is swapped as long as it is on; switched off, the boxes ask
     the system picture again on the refresh */
  if (!path.empty())
    g_avatar_on = true;
  if (changed) {
    zt_log("avatar: %s (hook %d)", path.empty() ? "stock" : path.c_str(), g_box_orig != nullptr);
    g_avatar_refresh = g_box_orig != nullptr;
  }
  if (path.empty())
    g_avatar_on = false;

  RGB rgb;
  const bool panel = zt_theme_number(script, "panelTintOn", 0) != 0 &&
                     parse_rgb(zt_theme_text(script, "panelTintColor"), &rgb);
  if (panel) {
    g_panel_rgb = rgb;
    g_panel_strength = clamp01((float)zt_theme_number(script, "panelTintStrength", 0.5));
    const double op = zt_theme_number(script, "panelTintOpacity", 1);
    g_panel_opacity = op < 0 ? 0 : op > 2 ? 2 : (float)op;
  }
  if (panel != g_panel_on || panel)
    zt_log("panels: tint %s (#%02x%02x%02x, strength %.2f, opacity %.2f)", panel ? "on" : "off",
           (int)(g_panel_rgb.r * 255), (int)(g_panel_rgb.g * 255), (int)(g_panel_rgb.b * 255),
           g_panel_strength, g_panel_opacity);
  g_panel_on = panel;
  g_panel_logs = 0;

  const bool icon = zt_theme_number(script, "iconTintOn", 0) != 0 &&
                    parse_rgb(zt_theme_text(script, "iconTintColor"), &rgb);
  if (icon)
    g_icon_rgb = rgb;
  g_icon_on = icon;

  /* the system background colour (BGLayer) */
  RGB base, glow;
  const bool bg = zt_theme_number(script, "shellBgOn", 0) != 0 &&
                  parse_rgb(zt_theme_text(script, "shellBgColor"), &base) &&
                  parse_rgb(zt_theme_text(script, "shellBgGlow"), &glow);
  if (bg) {
    g_bg_base = base;
    g_bg_glow = glow;
    g_bg_intensity = (float)zt_theme_number(script, "shellBgGlowIntensity", 1);
    g_bg_rainbow = zt_theme_number(script, "shellBgRainbow", 0) != 0;
    const double sp = zt_theme_number(script, "shellBgRainbowSpeed", 1);
    g_bg_speed = sp <= 0 ? 1 : sp > 10 ? 10 : (float)sp;
  }
  if (bg || g_bg_on)
    zt_log("system bg: %s", bg ? "theme colours" : "off");
  g_bg_on = bg;
  ++g_bg_generation;

}

extern "C" int zt_avatar_decode_fits(const unsigned char *data, size_t size) {
  return ZtAvatarImage::DecodeFits(ZtAvatarImage::Inspect(data, size));
}

/* the fit thread must be out of the module before it goes */
void zt_native_unload() {
  zt_avatar_cancel = 1;
  for (int i = 0; i < 300 && g_fit_running && !g_fit_done; ++i)
    usleep(10000);
}

void zt_native_tick() {
  if (!g_installed || theme_quitting())
    return;
  if (g_box_orig)
    avatar_tick();
  bg_tick();
  zt_sys_video_tick();
}

#else

void zt_native_install(MonoImage *) {}
void zt_native_unload() {}
extern "C" int zt_avatar_decode_fits(const unsigned char *, size_t) { return 0; }
void zt_native_apply(const std::string &) {}
void zt_native_tick() {}

#endif
