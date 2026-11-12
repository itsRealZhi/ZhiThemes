/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.

The stage in the background layer, the player options and the focus layer
follow AniketosHEN (Copyright (C) 2026 AniketosHEN, GPL-3.0,
git.etawen.dev/Alex0/AniketosHEN: home_stage.cpp, home_video.cpp,
host_scene.cpp). */

/*
 * the video behind Settings and Trophies. A React video view inside
 * those apps was drawn in front of their pages and took the
 * focus (Circle did nothing). The system draws the background of the
 * system apps in a scene of its own, BGLayerPlugin (Sce.Vsh.ShellUI.BGLayer);
 * a transparent panel of ours on its root holds a native VideoView fed by
 * a Sce.Vsh.Video.VideoPlayer from http://127.0.0.1:4445/v/<file> (theme_web).
 * It shows while the focus is on a system app (LayerManager.s_curFocusLayer
 * == ShellApp), fades out otherwise, and the player is let go after 20 s
 * out of sight. UI thread only (zt_sys_video_tick).
 */

#include "zt_native_theme.hpp"

#include "homeui_js_inject.hpp"
#include "zt_log.hpp"
#include "zt_paths.hpp"
#include "zt_storage.hpp"

#if SHELLUI_HOMEUI_JS_INJECT == 1

#include "external_symbols.hpp"
#include "hooked_funcs.hpp"

#include <atomic>
#include <mutex>
#include <ctype.h>
#include <stdio.h>
#include <string.h>
#include <string>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

MonoImage *g_pui_image();

namespace {

constexpr const char *kStageName = "id_zt_sys_video_stage";
constexpr const char *kViewName = "id_zt_sys_video_view";

struct UIColor {
  float r, g, b, a;
  int32_t color_space;
};

MonoMethod *method_of(MonoObject *obj, const char *name, int params) {
  if (!obj)
    return nullptr;
  for (MonoClass *k = mono_object_get_class(obj); k; k = k->parent)
    if (MonoMethod *m = mono_class_get_method_from_name(k, name, params))
      return m;
  return nullptr;
}

bool call(MonoObject *obj, const char *name, int params, void **args = nullptr,
          MonoObject **result = nullptr) {
  MonoMethod *m = method_of(obj, name, params);
  if (!m)
    return false;
  MonoObject *exc = nullptr;
  MonoObject *r = mono_runtime_invoke(m, obj, args, &exc);
  if (result)
    *result = r;
  if (exc)
    zt_log("sys video: %s threw", name);
  return !exc;
}

MonoObject *object_property(MonoObject *obj, const char *getter) {
  MonoObject *v = nullptr;
  return call(obj, getter, 0, nullptr, &v) ? v : nullptr;
}

bool disposed(MonoObject *obj) {
  if (!obj)
    return true;
  MonoObject *v = nullptr;
  if (!method_of(obj, "get_IsDisposed", 0) || !call(obj, "get_IsDisposed", 0, nullptr, &v) || !v)
    return false;
  return *static_cast<bool *>(mono_object_unbox(v));
}

MonoClass *nested(MonoClass *outer, const char *name) {
  if (!outer || !mono_class_get_nested_types)
    return nullptr;
  void *iter = nullptr;
  while (MonoClass *inner = mono_class_get_nested_types(outer, &iter))
    if (strcmp(mono_class_get_name(inner), name) == 0)
      return inner;
  return nullptr;
}

bool enum_value(MonoClass *type, const char *member, int32_t *value) {
  MonoClassField *f = type ? mono_class_get_field_from_name(type, member) : nullptr;
  if (!f)
    return false;
  mono_field_static_get_value(mono_class_vtable(mono_domain_get(), type), f, value);
  return true;
}

/* the overload of name/params whose parameter types mention type_text */
MonoMethod *overload_of(MonoClass *klass, const char *name, int params, const char *type_text) {
  if (!klass || !mono_signature_get_params || !mono_type_get_name)
    return nullptr;
  void *iter = nullptr;
  while (MonoMethod *m = mono_class_get_methods(klass, &iter)) {
    if (strcmp(mono_method_get_name(m), name) != 0)
      continue;
    MonoMethodSignature *sig = mono_method_signature(m);
    if (!sig || (int)mono_signature_get_param_count(sig) != params)
      continue;
    void *piter = nullptr;
    while (MonoType *t = mono_signature_get_params(sig, &piter)) {
      char *text = mono_type_get_name(t);
      const bool match = text && strstr(text, type_text);
      if (text && mono_free)
        mono_free(text);
      if (match)
        return m;
    }
  }
  return nullptr;
}

MonoObject *make(MonoClass *k) {
  if (!k)
    return nullptr;
  MonoObject *o = mono_object_new(mono_domain_get(), k);
  if (o)
    mono_runtime_object_init(o);
  return o;
}

/* ---- what is wanted (JS thread writes, UI thread reads) */
std::mutex g_lock;
std::string g_file; /* the .mp4 in wallpapers/, "" = off */
bool g_sound = false;
/* the same file as the Home wallpaper (sysBgWallpaper): one player for
   the Home and the system apps, shown unless a game is in front; the Home's
   React video stays off (theme.js nativeVideoShared). Entering and leaving
   Settings built a player each time and the Home's own player stalled
   while two UHD players shared the decoder (log) */
bool g_shared = false;
/* a picture as the Home wallpaper with sysBgWallpaper: shown the same
   way (an ImageBox on the stage), so it stays put between the Home and
   Settings / Trophies instead of the system app setting it 1.5 s after it
   opened (it went away and came back) */
std::string g_picture; /* full path, "" = none */
std::atomic<int> g_generation{0};
/* the Game / App Library (and a hub opened from it) is in front: its
   theme.js prints THEME-LIBRARY twice a second; the shared wallpaper stays
   out of it (the library shows its own backgrounds) */
std::atomic<unsigned> g_library_pings{0};
unsigned g_library_seen = 0;
int g_library_frame = -1000;

/* ---- focus layer */
MonoClassField *g_focus_field = nullptr;
MonoVTable *g_focus_vtable = nullptr;
int32_t g_focus_shell_app = -1, g_focus_game = -1;
bool g_focus_tried = false;

int focus_layer() {
  if (!g_focus_tried) {
    g_focus_tried = true;
    MonoImage *img = getDLLimage("Sce.Vsh.ShellUI.AppSystem.dll");
    MonoClass *mgr = img ? mono_class_from_name(img, "Sce.Vsh.ShellUI.AppSystem", "LayerManager") : nullptr;
    MonoClass *layers = nested(mgr, "FocusLayer");
    g_focus_field = mgr ? mono_class_get_field_from_name(mgr, "s_curFocusLayer") : nullptr;
    g_focus_vtable = g_focus_field ? mono_class_vtable(mono_domain_get(), mgr) : nullptr;
    const bool ok = g_focus_vtable && enum_value(layers, "ShellApp", &g_focus_shell_app) &&
                    enum_value(layers, "Game", &g_focus_game);
    zt_log("sys video: focus layer field %d ShellApp %d Game %d", g_focus_field != nullptr,
           ok ? g_focus_shell_app : -1, ok ? g_focus_game : -1);
    if (!ok)
      g_focus_vtable = nullptr;
  }
  if (!g_focus_vtable)
    return -1;
  int32_t v = -1;
  mono_field_static_get_value(g_focus_vtable, g_focus_field, &v);
  return v;
}

/* ---- power state (PowerManager.CurrentState: Normal 0, Reboot,
   Shutdown, Suspend = rest mode). Not Normal: the video fades out and its
   player is let go before the PS5 turns off or rests; back to Normal (on
   waking up) it is made again like after a game */
MonoClassField *g_power_field = nullptr;
MonoVTable *g_power_vtable = nullptr;
bool g_power_tried = false;
int g_last_power = 0;

int power_state() {
  if (!g_power_tried) {
    g_power_tried = true;
    MonoImage *img = getDLLimage("Sce.Vsh.ShellUI.AppSystem.dll");
    MonoClass *pm = img ? mono_class_from_name(img, "Sce.Vsh.ShellUI.AppSystem", "PowerManager") : nullptr;
    g_power_field = pm ? mono_class_get_field_from_name(pm, "<CurrentState>k__BackingField") : nullptr;
    g_power_vtable = g_power_field ? mono_class_vtable(mono_domain_get(), pm) : nullptr;
    zt_log("sys video: power state field %d", g_power_vtable != nullptr);
  }
  if (!g_power_vtable)
    return 0;
  int32_t v = 0;
  mono_field_static_get_value(g_power_vtable, g_power_field, &v);
  if (v != g_last_power) {
    zt_log("sys video: power state %d (0 normal, 1 reboot, 2 off, 3 rest)", v);
    g_last_power = v;
  }
  return v;
}

/* ---- the stage, the view and the player (pinned handles) */
uint32_t g_stage = 0, g_view = 0, g_player = 0;
MonoObject *g_stage_obj = nullptr, *g_view_obj = nullptr, *g_player_obj = nullptr;
float g_opacity = 0;
bool g_visible = true;
int g_frames = 0, g_hidden_frames = 0, g_retry_at = 0, g_failures = 0;
int g_built_generation = -1;
int32_t g_status_error = -1, g_status_playing = -1, g_status_paused = -1, g_last_status = -2;
int g_paused_checks = 0;
int g_last_focus = -2;

MonoObject *background_root() {
  MonoImage *img = getDLLimage("Sce.Vsh.ShellUI.BGLayer.dll");
  MonoClass *plugin_class = img ? mono_class_from_name(img, "Sce.Vsh.ShellUI.BGLayer", "BGLayerPlugin") : nullptr;
  MonoMethod *get = plugin_class ? mono_class_get_method_from_name(plugin_class, "get_Instance", 0) : nullptr;
  MonoObject *exc = nullptr;
  MonoObject *plugin = get ? mono_runtime_invoke(get, nullptr, nullptr, &exc) : nullptr;
  if (exc)
    return nullptr;
  MonoObject *root = object_property(plugin, "get_RootWidget");
  return root && !disposed(root) ? root : nullptr;
}

void hold(uint32_t *handle, MonoObject **slot, MonoObject *obj) {
  if (*handle)
    mono_gchandle_free(*handle);
  *handle = obj ? mono_gchandle_new(obj, 1) : 0;
  *slot = obj;
}

bool prepare(MonoObject *w, const char *name) {
  float width = 1920, height = 1080;
  bool no = false;
  void *wa[1] = {&width}, *ha[1] = {&height}, *fa[1] = {&no};
  void *na[1] = {mono_string_new(mono_domain_get(), name)};
  bool ok = call(w, "set_Width", 1, wa) && call(w, "set_Height", 1, ha);
  call(w, "set_Name", 1, na);
  if (method_of(w, "set_Focusable", 1))
    call(w, "set_Focusable", 1, fa);
  return ok;
}

void remove_widget(MonoObject *w) {
  if (!w || disposed(w))
    return;
  call(w, "RemoveFromParent", 0);
  call(w, "Dispose", 0);
}

void teardown(const char *why) {
  if (g_view_obj && !disposed(g_view_obj)) {
    bool dispose_player = false;
    void *a[1] = {&dispose_player};
    call(g_view_obj, "ReleasePlayer", 1, a);
    remove_widget(g_view_obj);
  }
  if (g_player_obj)
    call(g_player_obj, "Dispose", 0);
  hold(&g_view, &g_view_obj, nullptr);
  hold(&g_player, &g_player_obj, nullptr);
  g_last_status = -2;
  if (why)
    zt_log("sys video: player released (%s)", why);
}

MonoObject *stage() {
  if (g_stage_obj && !disposed(g_stage_obj))
    return g_stage_obj;
  hold(&g_stage, &g_stage_obj, nullptr);
  if (g_frames < g_retry_at)
    return nullptr;
  MonoObject *root = background_root();
  MonoClass *panel_class = mono_class_from_name(g_pui_image(), "Sce.PlayStation.PUI.UI3", "Panel");
  if (!root || !panel_class) {
    g_retry_at = g_frames + 120;
    return nullptr;
  }
  /* one an older module left */
  MonoObject *child = object_property(root, "get_FirstChild");
  for (int guard = 0; child && guard < 64; ++guard) {
    MonoObject *next = object_property(child, "get_NextSibling");
    MonoObject *n = object_property(child, "get_Name");
    if (n && Mono_to_String(reinterpret_cast<MonoString *>(n)) == kStageName)
      remove_widget(child);
    child = next;
  }
  MonoObject *panel = make(panel_class);
  void *pa[1] = {panel};
  if (!panel || !prepare(panel, kStageName) || !call(root, "AppendChild", 1, pa)) {
    zt_log("sys video: no stage in the background layer");
    g_retry_at = g_frames + 600;
    return nullptr;
  }
  UIColor clear{0, 0, 0, 0, 0};
  void *ca[1] = {&clear};
  call(panel, "set_BackgroundColor", 1, ca);
  hold(&g_stage, &g_stage_obj, panel);
  g_opacity = 0;
  float zero = 0;
  void *oa[1] = {&zero};
  call(panel, "set_Opacity", 1, oa);
  g_visible = true;
  zt_log("sys video: stage added to the background layer");
  return panel;
}

void set_option(MonoObject *options, MonoClass *player_class, const char *field, const char *type,
                const char *member) {
  MonoClassField *f = mono_class_get_field_from_name(mono_object_get_class(options), field);
  int32_t v = 0;
  if (f && enum_value(nested(player_class, type), member, &v))
    mono_field_set_value(options, f, &v);
  else
    zt_log("sys video: option %s=%s not set", field, member);
}

/* (from AniketosHEN home_video.cpp, GPL-3): the picture size in an
   MP4's first video sample entry (avc1, hvc1, hev1), read from the moov box
   only. False when it cannot be told. */
bool mp4_video_size(const char *path, int *width, int *height) {
  const int fd = open(path, O_RDONLY);
  if (fd < 0)
    return false;
  bool found = false;
  off_t at = 0;
  for (int boxes = 0; boxes < 64 && !found; ++boxes) {
    unsigned char h[16];
    if (pread(fd, h, 8, at) != 8)
      break;
    uint64_t size = ((uint64_t)h[0] << 24) | ((uint64_t)h[1] << 16) | ((uint64_t)h[2] << 8) | h[3];
    off_t body = at + 8;
    if (size == 1) {
      if (pread(fd, h + 8, 8, at + 8) != 8)
        break;
      size = 0;
      for (int i = 8; i < 16; ++i)
        size = (size << 8) | h[i];
      body = at + 16;
    }
    if (size < 8)
      break;
    if (memcmp(h + 4, "moov", 4) == 0) {
      uint64_t len = size - (uint64_t)(body - at);
      if (len > (16u << 20))
        len = 16u << 20;
      std::string moov((size_t)len, '\0');
      if (pread(fd, &moov[0], (size_t)len, body) == (ssize_t)len)
        for (size_t i = 0; i + 32 <= moov.size() && !found; ++i) {
          const char *b = moov.data() + i;
          if (memcmp(b, "avc1", 4) != 0 && memcmp(b, "hvc1", 4) != 0 && memcmp(b, "hev1", 4) != 0)
            continue;
          const unsigned char *u = (const unsigned char *)b;
          *width = (u[28] << 8) | u[29];
          *height = (u[30] << 8) | u[31];
          found = *width > 0 && *height > 0;
        }
      break;
    }
    at += (off_t)size;
  }
  close(fd);
  return found;
}

bool build(MonoObject *panel, const std::string &file, bool sound) {
  MonoImage *vimg = getDLLimage("Sce.Vsh.VideoPlayer.dll");
  MonoClass *player_class = vimg ? mono_class_from_name(vimg, "Sce.Vsh.Video", "VideoPlayer") : nullptr;
  MonoClass *view_class = mono_class_from_name(g_pui_image(), "Sce.PlayStation.PUI.UI3", "VideoView");
  MonoClass *create_class = nested(player_class, "CreateOptionParam");
  MonoClass *play_class = nested(view_class, "PlayOptionParam");
  MonoMethod *player_ctor = overload_of(player_class, ".ctor", 1, "CreateOptionParam");
  MonoMethod *view_ctor = overload_of(view_class, ".ctor", 1, "PlayOptionParam");
  MonoClassField *uri_field = create_class ? mono_class_get_field_from_name(create_class, "uri") : nullptr;
  if (!player_ctor || !view_ctor || !uri_field) {
    zt_log("sys video: classes player %p view %p create %p play %p ctor %p/%p uri %p", (void *)player_class,
           (void *)view_class, (void *)create_class, (void *)play_class, (void *)player_ctor,
           (void *)view_ctor, (void *)uri_field);
    return false;
  }
  MonoClass *status_class = nested(player_class, "PlayerStateType");
  enum_value(status_class, "ErrorOccured", &g_status_error);
  enum_value(status_class, "Playing", &g_status_playing);
  enum_value(status_class, "Paused", &g_status_paused);

  char uri[160];
  snprintf(uri, sizeof(uri), "http://127.0.0.1:4445/v/%s", file.c_str());
  MonoObject *create = make(create_class), *play = make(play_class);
  if (!create || !play)
    return false;
  mono_field_set_value(create, uri_field, mono_string_new(mono_domain_get(), uri));
  set_option(create, player_class, "createMode", "CreateMode", "CreateModeForPlayback");
  set_option(create, player_class, "frameBufferSize", "FrameBufferSizeType", "Size1920x1080");
  /* the UHD decoder share only for files bigger than Full HD (as
     AniketosHEN). Always UHD made the PS5 ask "Stopping
     Features: <game>" when coming back from a game, and failed to start */
  int vw = 0, vh = 0;
  const bool sized = mp4_video_size((zt_theme_dir("wallpapers") + "/" + file).c_str(), &vw, &vh) ||
                     mp4_video_size((std::string(ZT_LEGACY "/") + file).c_str(), &vw, &vh);
  const bool uhd = !sized || vw > 1920 || vh > 1080;
  set_option(create, player_class, "coreResourceType", "CoreResourceType", uhd ? "UHD" : "FullHD");
  zt_log("sys video: %s %dx%d%s -> decoder share %s", file.c_str(), vw, vh, sized ? "" : " (size unknown)",
         uhd ? "UHD" : "FullHD");
  set_option(create, player_class, "behaviorTypeOnInactive", "BehaviorTypeOnInactive", "Pause");
  set_option(create, player_class, "behaviorTypeOnActive", "BehaviorTypeOnActive", "Play");

  MonoObject *player = mono_object_new(mono_domain_get(), player_class);
  if (!player)
    return false;
  hold(&g_player, &g_player_obj, player);
  void *create_args[1] = {create};
  bool start = true;
  void *init_args[1] = {&start};
  MonoObject *exc = nullptr;
  mono_runtime_invoke(player_ctor, player, create_args, &exc);
  if (exc || !call(player, "Init", 1, init_args)) {
    zt_log("sys video: the player could not be made");
    return false;
  }
  MonoObject *view = mono_object_new(mono_domain_get(), view_class);
  if (!view)
    return false;
  hold(&g_view, &g_view_obj, view);
  void *view_args[1] = {play};
  exc = nullptr;
  mono_runtime_invoke(view_ctor, view, view_args, &exc);
  if (exc) {
    zt_log("sys video: the view could not be made");
    return false;
  }
  prepare(view, kViewName);
  /* fill the screen, cropping what does not fit */
  MonoClass *scale_type = mono_class_from_name(g_pui_image(), "Sce.PlayStation.PUI.UI3", "ImageScaleType");
  int32_t scale = 0;
  if (enum_value(scale_type, "AspectOutside", &scale)) {
    void *sa[1] = {&scale};
    call(view, "set_ImageScaleType", 1, sa);
  }
  bool yes = true;
  void *sp[2] = {player, &yes};
  void *ya[1] = {&yes};
  if (!call(view, "SetPlayer", 2, sp))
    return false;
  call(player, "SetLoop", 1, ya);
  bool muted = !sound;
  void *ma[1] = {&muted};
  call(player, "SetIsMuted", 1, ma);
  call(player, "SetBGMSuppressionDisabled", 1, ma);
  void *va[1] = {view};
  if (!call(panel, "AppendChild", 1, va) || !call(view, "Play", 0))
    return false;
  zt_log("sys video: playing %s%s", uri, sound ? " with sound" : "");
  return true;
}

/* ---- the picture (ImageBox + ImageAsset(path), AspectOutside) */
uint32_t g_image = 0;
MonoObject *g_image_obj = nullptr;
std::string g_image_path;
int g_image_checks = 0;
bool g_image_async = false;

/* a bool property, -1 when there is none */
int bool_property(MonoObject *obj, const char *getter) {
  if (!method_of(obj, getter, 0))
    return -1;
  MonoObject *v = nullptr;
  if (!call(obj, getter, 0, nullptr, &v) || !v)
    return -1;
  return *static_cast<bool *>(mono_object_unbox(v)) ? 1 : 0;
}

float float_property(MonoObject *obj, const char *getter) {
  MonoObject *v = nullptr;
  if (!method_of(obj, getter, 0) || !call(obj, getter, 0, nullptr, &v) || !v)
    return -1;
  return *static_cast<float *>(mono_object_unbox(v));
}

/* the picture was put on the stage but not seen: what the box
   says after 1 s and 3 s; not loaded at 1 s = ImageBox.LoadAsync(path)
   (the call the avatar goes through) */
void check_image(const std::string &path) {
  ++g_image_checks;
  if (g_image_checks != 2 && g_image_checks != 6)
    return;
  const int loaded = bool_property(g_image_obj, "get_IsLoaded");
  const int has = bool_property(g_image_obj, "get_HasImage");
  zt_log("sys video: picture box loaded %d has image %d, %gx%g, visible %d, stage opacity %.2f visible %d%s",
         loaded, has, float_property(g_image_obj, "get_Width"), float_property(g_image_obj, "get_Height"),
         bool_property(g_image_obj, "get_Visible"), g_opacity, (int)g_visible,
         g_image_async ? " (LoadAsync)" : "");
  if (g_image_checks == 2 && loaded != 1 && has != 1 && !g_image_async) {
    g_image_async = true;
    bool set_image = true;
    void *args[4] = {mono_string_new(mono_domain_get(), path.c_str()), nullptr, nullptr, &set_image};
    const bool ok = call(g_image_obj, "LoadAsync", 4, args);
    zt_log("sys video: picture LoadAsync %s", ok ? "asked" : "failed");
  }
}

void drop_image() {
  if (g_image_obj)
    remove_widget(g_image_obj);
  hold(&g_image, &g_image_obj, nullptr);
  g_image_path.clear();
  g_image_checks = 0;
  g_image_async = false;
}

bool build_image(MonoObject *panel, const std::string &path) {
  MonoClass *box_class = mono_class_from_name(g_pui_image(), "Sce.PlayStation.PUI.UI3", "ImageBox");
  MonoClass *asset_class = mono_class_from_name(g_pui_image(), "Sce.PlayStation.PUI", "ImageAsset");
  MonoMethod *asset_ctor = overload_of(asset_class, ".ctor", 1, "String");
  if (!box_class || !asset_ctor) {
    zt_log("sys video: picture classes box %p asset %p ctor %p", (void *)box_class, (void *)asset_class,
           (void *)asset_ctor);
    return false;
  }
  MonoObject *box = make(box_class);
  MonoObject *asset = mono_object_new(mono_domain_get(), asset_class);
  if (!box || !asset)
    return false;
  hold(&g_image, &g_image_obj, box);
  void *aa[1] = {mono_string_new(mono_domain_get(), path.c_str())};
  MonoObject *exc = nullptr;
  mono_runtime_invoke(asset_ctor, asset, aa, &exc);
  if (exc) {
    zt_log("sys video: picture %s could not be opened", path.c_str());
    return false;
  }
  prepare(box, "id_zt_sys_picture");
  MonoClass *scale_type = mono_class_from_name(g_pui_image(), "Sce.PlayStation.PUI.UI3", "ImageScaleType");
  int32_t scale = 0;
  if (enum_value(scale_type, "AspectOutside", &scale)) {
    void *sa[1] = {&scale};
    call(box, "set_ImageScaleType", 1, sa);
  }
  void *ia[1] = {asset};
  void *ba[1] = {box};
  if (!call(box, "set_Image", 1, ia) || !call(panel, "AppendChild", 1, ba))
    return false;
  zt_log("sys video: picture %s on the stage", path.c_str());
  return true;
}

/* keep_visible: the stage stays Visible at opacity 0 (an invisible stage
   pauses its player, which then never got past loading: an older version) */
void set_stage(MonoObject *panel, float opacity, bool keep_visible = false) {
  bool visible = opacity > 0 || keep_visible;
  if (opacity == g_opacity && visible == g_visible)
    return;
  if (visible != g_visible) {
    void *a[1] = {&visible};
    call(panel, "set_Visible", 1, a);
    g_visible = visible;
  }
  void *a[1] = {&opacity};
  call(panel, "set_Opacity", 1, a);
  g_opacity = opacity;
}

} // namespace

/* the PUI image, from zt_native_install */
static MonoImage *s_pui = nullptr;
MonoImage *g_pui_image() { return s_pui; }

void zt_sys_video_install(MonoImage *pui) { s_pui = pui; }

void zt_sys_video_apply(const std::string &script) {
  std::string file;
  /* bgClean: only the stock system background, no video or picture here */
  const bool clean = zt_theme_number(script, "bgClean", 0) != 0;
  if (!clean && zt_theme_number(script, "sysOn", 0) != 0) {
    const bool wall = zt_theme_number(script, "sysBgWallpaper", 0) != 0 &&
                      zt_theme_number(script, "wallpaperOn", 0) != 0;
    file = wall ? zt_theme_text(script, "wallpaper")
                : zt_theme_number(script, "sysBgOn", 0) != 0 ? zt_theme_text(script, "sysBg") : "";
    std::string l = file;
    for (char &c : l)
      c = (char)tolower((unsigned char)c);
    const bool mp4 = l.size() > 4 && (l.compare(l.size() - 4, 4, ".mp4") == 0 || l.compare(l.size() - 4, 4, ".m4v") == 0);
    if (!mp4 || file.find('/') != std::string::npos)
      file.clear();
  }
  const bool shared = !file.empty() && zt_theme_number(script, "sysBgWallpaper", 0) != 0 &&
                      zt_theme_number(script, "wallpaperOn", 0) != 0;
  const bool sound = shared ? zt_theme_number(script, "wallpaperVideoSound", 0) != 0
                            : zt_theme_number(script, "sysBgVideoSound", 0) != 0;
  /* the wallpaper picture, when shared the same way */
  std::string picture;
  if (file.empty() && !clean && zt_theme_number(script, "sysOn", 0) != 0 &&
      zt_theme_number(script, "sysBgWallpaper", 0) != 0 && zt_theme_number(script, "wallpaperOn", 0) != 0) {
    const std::string name = zt_theme_text(script, "wallpaper");
    std::string l = name;
    for (char &c : l)
      c = (char)tolower((unsigned char)c);
    auto ends = [&](const char *t) {
      const size_t n = strlen(t);
      return l.size() > n && l.compare(l.size() - n, n, t) == 0;
    };
    if (!name.empty() && name.find('/') == std::string::npos && (ends(".png") || ends(".jpg") || ends(".jpeg"))) {
      for (const std::string &dir : {zt_theme_dir("wallpapers") + "/", std::string(ZT_LEGACY "/")}) {
        const std::string full = dir + name;
        struct stat st {};
        if (stat(full.c_str(), &st) == 0 && st.st_size > 0) {
          picture = full;
          break;
        }
      }
      if (picture.empty())
        zt_log("sys video: picture %s not found", name.c_str());
    }
  }
  std::lock_guard<std::mutex> lock(g_lock);
  if (file != g_file || sound != g_sound || shared != g_shared || picture != g_picture) {
    zt_log("sys video: %s%s", !file.empty() ? file.c_str() : !picture.empty() ? picture.c_str() : "off",
           shared ? " (also the Home wallpaper: one player)" : !picture.empty() ? " (picture for the Home and the system apps)" : "");
    g_file = file;
    g_sound = sound;
    g_shared = shared;
    g_picture = picture;
    ++g_generation;
  }
}

void zt_sys_video_library_ping() { g_library_pings.fetch_add(1); }

/* true while the library said so in the last second */
static bool library_in_front() {
  const unsigned pings = g_library_pings.load();
  if (pings != g_library_seen) {
    if (g_frames - g_library_frame > 60)
      zt_log("sys video: Game / App Library in front, wallpaper hidden");
    g_library_seen = pings;
    g_library_frame = g_frames;
  }
  return g_frames - g_library_frame <= 60;
}

void zt_sys_video_tick() {
  ++g_frames;
  std::string file, picture;
  bool sound, shared;
  {
    std::lock_guard<std::mutex> lock(g_lock);
    file = g_file;
    sound = g_sound;
    shared = g_shared;
    picture = g_picture;
  }
  const int generation = g_generation;
  if (file.empty()) {
    if (g_player_obj || g_view_obj)
      teardown("off");
    if (picture.empty()) {
      if (g_image_obj)
        drop_image();
      if (g_stage_obj && !disposed(g_stage_obj))
        set_stage(g_stage_obj, 0);
      g_built_generation = generation;
      return;
    }
    /* the picture: shown unless a game is in front, kept on the stage */
    const int focus = focus_layer();
    if (focus != g_last_focus) {
      zt_log("sys video: focus layer %d (picture)", focus);
      g_last_focus = focus;
    }
    const bool wanted = focus >= 0 && focus != g_focus_game && !(focus == g_focus_shell_app && library_in_front());
    MonoObject *panel = stage();
    if (!panel)
      return;
    float opacity = g_opacity;
    opacity = wanted ? (opacity + 1.0f / 30 > 1 ? 1 : opacity + 1.0f / 30)
                     : (opacity - 1.0f / 45 < 0 ? 0 : opacity - 1.0f / 45);
    set_stage(panel, opacity);
    if (g_frames % 30 != 0)
      return;
    if (g_image_obj && (disposed(g_image_obj) || g_image_path != picture))
      drop_image();
    if (g_image_obj)
      check_image(picture);
    if (!g_image_obj && g_frames >= g_retry_at) {
      if (build_image(panel, picture)) {
        g_image_path = picture;
      } else {
        drop_image();
        g_retry_at = g_frames + 600;
      }
    }
    g_built_generation = generation;
    return;
  }
  if (g_image_obj)
    drop_image();
  /* everything below twice a second, the fade every frame */
  const int focus = focus_layer();
  if (focus != g_last_focus) {
    zt_log("sys video: focus layer %d (ShellApp %d)", focus, g_focus_shell_app);
    g_last_focus = focus;
  }
  const bool powering = power_state() != 0;
  const bool wanted = !powering && focus >= 0 && (shared ? focus != g_focus_game : focus == g_focus_shell_app) &&
                      !(focus == g_focus_shell_app && library_in_front());
  MonoObject *panel = stage();
  if (!panel)
    return;
  /* the stage fades in only once the video plays: a view with no
     frame yet is black (seen while the player loaded or failed) */
  const bool show = wanted && g_player_obj && g_last_status >= 0 &&
                    (g_last_status == g_status_playing || g_last_status == g_status_paused);
  float opacity = g_opacity;
  opacity = show ? (opacity + 1.0f / 30 > 1 ? 1 : opacity + 1.0f / 30)
                   : (opacity - 1.0f / 45 < 0 ? 0 : opacity - 1.0f / 45);
  /* Visible (and at 1 %, never 0) while wanted, even before the first
     frame, so the player can load */
  if (wanted && opacity < 0.01f)
    opacity = 0.01f;
  set_stage(panel, opacity, wanted);
  if (g_frames % 30 != 0)
    return;
  g_hidden_frames = wanted ? 0 : g_hidden_frames + 30;
  if (generation != g_built_generation) {
    if (g_player_obj || g_view_obj)
      teardown("another file");
    g_failures = 0;
    g_retry_at = 0;
  }
  if (g_view_obj && disposed(g_view_obj))
    teardown("its view went away");
  if (!wanted) {
    /* let go once the stage has faded out: kept 20 s it held
       the decoder while the Home's own video played (the Home video
       stalled and ended), and it came back paused (black) */
    if (g_player_obj && g_hidden_frames >= (powering ? 60 : shared ? 120 : 60))
      teardown(powering ? "the PS5 turns off or rests" : "out of sight");
    return;
  }
  if (!g_player_obj) {
    if (g_frames < g_retry_at || g_failures >= 5)
      return;
    g_built_generation = generation;
    if (!build(panel, file, sound)) {
      teardown(nullptr);
      ++g_failures;
      g_retry_at = g_frames + 300 * g_failures;
      zt_log("sys video: start failed (%d)", g_failures);
    }
    return;
  }
  MonoObject *v = nullptr;
  int32_t status = -1;
  if (call(g_player_obj, "GetPlayerStatus", 0, nullptr, &v) && v)
    status = *static_cast<int32_t *>(mono_object_unbox(v));
  if (status != g_last_status) {
    zt_log("sys video: status %d (playing %d, error %d)", status, g_status_playing, g_status_error);
    g_last_status = status;
  }
  if (status >= 0 && status == g_status_error) {
    teardown("the player reported an error (convert the file to H.264 1080p)");
    ++g_failures;
    /* the same file failed once and played the next time (log): the
       first retry comes at once */
    /* 0.5 s, 2 s, 4 s, then longer (was 0.5 s then 10 s, 15 s…) */
    g_retry_at = g_frames + (g_failures <= 3 ? 30 + 90 * (g_failures - 1) : 300 * g_failures);
  } else if (status == g_status_playing) {
    g_failures = 0;
    g_paused_checks = 0;
  } else if (status >= 0 && status == g_status_paused && ++g_paused_checks % 4 == 2) {
    /* in sight but paused by the system: play on */
    zt_log("sys video: paused while in sight; playing on");
    call(g_view_obj, "Play", 0);
  }
}

#else

void zt_sys_video_install(MonoImage *) {}
void zt_sys_video_apply(const std::string &) {}
void zt_sys_video_tick() {}
void zt_sys_video_library_ping() {}

#endif
