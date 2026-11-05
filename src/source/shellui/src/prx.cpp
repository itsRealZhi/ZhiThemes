/* Copyright (C) 2025 OnionHEN / LightningMods

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; see the file COPYING. If not, see
<http://www.gnu.org/licenses/>.  */

#include "detour.h"
#include "debug_settings_route_runtime.hpp"
#include "dynamic_ui_runtime.hpp"
#include "hooked_funcs.hpp"
#include "defs.h"
#include "external_symbols.hpp"
#include "homeui_js_inject.hpp"
#include "homeui_top_nav_patch.hpp"
#include "ipc.hpp"
#include "plugin_ui_bridge_client.hpp"
#include "proc.h"
#include "ps5/kernel.h"
#include "zt_log.hpp"
#include "zt_stats.hpp"
#include "theme_web.hpp"
#include "toolbox_i18n.hpp"
#include "ucred.h"
#include "webserver.hpp"

#include <onion/notify.h>
#include <onion/proc_query.h>
#include <onion/ready.h>

#include <atomic>
#include <cctype>
#include <cstring>
#include <cstdint>
#include <dirent.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <time.h>
#include <string>
#include <unistd.h>
#include <vector>

// ---------------------------------------------------------------------------
// Globals (referenced by other shellui translation units)
// ---------------------------------------------------------------------------

std::string UI3_dec;
std::string legacy_dec;
std::string appsystem_dll;
std::string uilib;
std::string Sysinfo;
std::string display_info;
std::string uilib_dll;
std::string payloads_xml;
std::string debug_settings_xml;
std::string cheats_xml;

MonoImage* pui_img = nullptr;
MonoImage* AppSystem_img = nullptr;
MonoObject* Game = nullptr;
MonoImage* react_common_img = nullptr;

bool hooked = false;
bool has_hv_bypass = false;
bool is_6xx = false;
bool is_3xx = false;

extern "C" long ptr_syscall = 0;

void __syscall() {
  asm(".intel_syntax noprefix\n"
      "  mov rax, rdi\n"
      "  mov rdi, rsi\n"
      "  mov rsi, rdx\n"
      "  mov rdx, rcx\n"
      "  mov r10, r8\n"
      "  mov r8,  r9\n"
      "  mov r9,  qword ptr [rsp + 8]\n"
      "  call qword ptr [rip + ptr_syscall]\n"
      "  ret\n");
}

void (*OnRender_orig)(MonoObject* instance);
void (*oUserCustomElementReset)(MonoObject* instance, MonoObject* item) = nullptr;
void (*oSettingPageStackOnPopping)(MonoObject* instance, MonoObject* outgoing,
                                   MonoObject* incoming) = nullptr;
MonoObject* rootWidget = nullptr;
MonoObject* font = nullptr;
void (*Orig_ReloadApp)(MonoString* str) = nullptr;

// Defined in prx_install / prx_overlay
void ReloadApp(MonoString* str);
void OnRender_Hook(MonoObject* instance);
int KillAppWithReason_Hook(int appId, int reason);

// ---------------------------------------------------------------------------
// Init constants
// ---------------------------------------------------------------------------

/* logs/boot.log, one line per start-up step written straight to the
   file (small buffer, no lock): when ShellUI dies before the log is up, its
   last line says where. */
void zt_boot(const char *step) {
#if defined(ZHITHEMES) && ZHITHEMES
  mkdir("/user/data/ZhiThemes", 0777);
  mkdir("/user/data/ZhiThemes/Logs", 0777); /* (logs/ before) */
  const char *path = "/user/data/ZhiThemes/Logs/boot.log";
  struct stat st;
  const bool big = stat(path, &st) == 0 && st.st_size > (64 << 10);
  const int fd = open(path, O_WRONLY | O_CREAT | (big ? O_TRUNC : O_APPEND), 0666);
  if (fd < 0)
    return;
  char line[128];
  const int n = snprintf(line, sizeof(line), "%ld pid %d: %s\n", (long)time(nullptr), (int)getpid(), step);
  if (n > 0)
    (void)!write(fd, line, (size_t)n < sizeof(line) ? (size_t)n : sizeof(line) - 1);
  close(fd);
#else
  (void)step;
#endif
}

/* OnionHEN's own start; the ZhiThemes build (ZHITHEMES=1) does not call it */
#if defined(ZHITHEMES) && ZHITHEMES
#define ZT_ONION_ONLY [[maybe_unused]]
#else
#define ZT_ONION_ONLY
#endif

namespace {

constexpr int kSyscallInstrOffset = 0x0A;
constexpr size_t kMprotectProbeSize = 100;
constexpr int kProtRwx = 0x7; // PROT_READ | PROT_WRITE | PROT_EXEC
constexpr uint32_t kFw3xxMaxExclusive = 0x4000042;
constexpr uint32_t kFw6xxMin = 0x6000000;
// Same magnitude as the previous sleep(0x100000) keep-alive.
constexpr unsigned kKeepAliveSleepSec = 0x100000;

// XOR key material used for version string + toolbox XML (base64 of "SISTR0_I_SEE_YOU").
constexpr const char* kXorKeyB64 = "U0lTVFIwX0lfU0VFX1lPVQ==";

// ---------------------------------------------------------------------------
// RAII: restore process authid on every exit path
// ---------------------------------------------------------------------------

struct AuthIdGuard {
  pid_t pid;
  uintptr_t old_authid;
  bool active = true;

  AuthIdGuard(pid_t p, uintptr_t auth) : pid(p), old_authid(auth) {}
  ~AuthIdGuard() {
    if (active)
      set_proc_authid(pid, old_authid);
  }
  void release() { active = false; }

  AuthIdGuard(const AuthIdGuard&) = delete;
  AuthIdGuard& operator=(const AuthIdGuard&) = delete;
};

// ---------------------------------------------------------------------------
// Detour helpers
// ---------------------------------------------------------------------------

template <typename Fn>
bool install_detour(const char* name, uint64_t target, void* hook, Fn& out_orig,
                    bool required) {
  if (!target) {
    LOG_ERROR("Hook target missing: %s", name);
    if (required)
      notify("notify.hook.target");
    return !required;
  }

  if (!InstallDetour(target, hook, reinterpret_cast<void**>(&out_orig))) {
    LOG_ERROR("Detour failed: %s", name);
    if (required)
      notify("notify.hook.install");
    return !required;
  }

  return true;
}

template <typename Fn>
bool install_detour_native(const char* name, void* target, void* hook, Fn& out_orig,
                           bool required) {
  return install_detour(name, reinterpret_cast<uint64_t>(target), hook, out_orig,
                        required);
}

// ---------------------------------------------------------------------------
// Mono images used during init
// ---------------------------------------------------------------------------

struct ShellImages {
  MonoImage* legacy = nullptr;
  MonoImage* mscorlib = nullptr;
  MonoImage* react_pui = nullptr;
  MonoImage* app_system = nullptr;
  MonoImage* core = nullptr;
  MonoImage* capture_menu = nullptr;
  MonoImage* lnc = nullptr; // optional
  MonoImage* react_common = nullptr;
  MonoImage* rn_shell = nullptr;
  MonoImage* pui = nullptr;
};

MonoImage* require_dll(const char* name) {
  MonoImage* img = getDLLimage(name);
  if (!img) {
    LOG_ERROR("Failed to load Mono assembly: %s", name);
    notify("notify.hook.load_assembly");
  }
  return img;
}

// ---------------------------------------------------------------------------
// Phase 1: native dynlib symbols
// ---------------------------------------------------------------------------

bool resolve_native_symbols(pid_t pid) {
  int libkernelsys = get_module_handle(pid, "libkernel_sys.sprx");
  KERNEL_DLSYM(libkernelsys, sceKernelDebugOutText);
  KERNEL_DLSYM(libkernelsys, sceKernelMkdir);
  KERNEL_DLSYM(libkernelsys, scePthreadCreate);
  KERNEL_DLSYM(libkernelsys, sceKernelMprotect);
  KERNEL_DLSYM(libkernelsys, sceKernelSendNotificationRequest);
  KERNEL_DLSYM(libkernelsys, sceKernelGetProsperoSystemSwVersion);
  KERNEL_DLSYM(libkernelsys, sceKernelGetAppInfo);
  KERNEL_DLSYM(libkernelsys, sceKernelGetProcessName);
  KERNEL_DLSYM(libkernelsys, sceKernelGetCurrentFanDuty);

#if !defined(ZT_SLIM) /* the slim ZhiThemes module sends directly (zt_notify.cpp) */
  /* libonion_platform must not CALL sceKernelSendNotificationRequest by name —
   * here that symbol is a dlsym'd *function pointer*. Register a trampoline. */
  onion_notify_set_send(+[](int32_t device, void *req, size_t size,
                            int32_t blocking) -> int32_t {
    if (!sceKernelSendNotificationRequest)
      return -1;
    return sceKernelSendNotificationRequest(
        device, static_cast<OrbisNotificationRequest *>(req),
        static_cast<int>(size), blocking);
  });
#endif

  KERNEL_DLSYM(libSceKernelHandle, sceKernelJitCreateSharedMemory);
  KERNEL_DLSYM(libSceKernelHandle, sceKernelJitCreateAliasOfSharedMemory);
  KERNEL_DLSYM(libSceKernelHandle, sceKernelJitMapSharedMemory);
  KERNEL_DLSYM(libSceKernelHandle, ioctl);
  KERNEL_DLSYM(libSceKernelHandle, __sys_regmgr_call);

  // Point ptr_syscall at the syscall instruction inside getpid.
  // Variable name must be `getpid` for KERNEL_DLSYM's #sym string.
  {
    static __attribute__((used)) long getpid = 0;
    KERNEL_DLSYM(libSceKernelHandle, getpid);
    ptr_syscall = getpid + kSyscallInstrOffset;
  }

  int shellui_util = get_module_handle(pid, "libSceShellUIUtil.sprx");
  KERNEL_DLSYM(shellui_util, sceShellUIUtilLaunchByUri);
  KERNEL_DLSYM(shellui_util, sceShellUIUtilInitialize);

  int system_service = get_module_handle(pid, "libSceSystemService.sprx");
  KERNEL_DLSYM(system_service, sceSystemServiceGetAppIdOfRunningBigApp);
  KERNEL_DLSYM(system_service, sceSystemServiceParamGetInt);
  KERNEL_DLSYM(system_service, sceSystemServiceGetAppTitleId);
  {
    void* sceSystemServiceLaunchApp = nullptr;
    KERNEL_DLSYM(system_service, sceSystemServiceLaunchApp);
    if (!sceSystemServiceLaunchApp)
      LOG_ERROR("Failed to resolve sceSystemServiceLaunchApp");
  }

  int reg = get_module_handle(pid, "libSceRegMgr.sprx");
  KERNEL_DLSYM(reg, sceRegMgrGetInt);

  int remoteplay = get_module_handle(pid, "libSceRemoteplay.sprx");
  LOG_DEBUG("Remote Play module handle: %d", remoteplay);
  KERNEL_DLSYM(remoteplay, sceRemoteplayInitialize);
  KERNEL_DLSYM(remoteplay, sceRemoteplayGeneratePinCode);
  KERNEL_DLSYM(remoteplay, sceRemoteplayConfirmDeviceRegist);
  KERNEL_DLSYM(remoteplay, sceRemoteplayNotifyPinCodeError);
  LOG_DEBUG("Remote Play symbols: init=%p pin=%p confirm=%p invalidate=%p",
            reinterpret_cast<void *>(sceRemoteplayInitialize),
            reinterpret_cast<void *>(sceRemoteplayGeneratePinCode),
            reinterpret_cast<void *>(sceRemoteplayConfirmDeviceRegist),
            reinterpret_cast<void *>(sceRemoteplayNotifyPinCodeError));

  return true;
}

// ---------------------------------------------------------------------------
// Phase 2: mono runtime symbols
// ---------------------------------------------------------------------------

bool resolve_mono_symbols(pid_t pid) {
  int libmono = get_module_handle(pid, "libmonosgen-2.0.sprx");

  KERNEL_DLSYM(libmono, mono_object_to_string);
  KERNEL_DLSYM(libmono, mono_get_root_domain);
  KERNEL_DLSYM(libmono, mono_property_get_get_method);
  KERNEL_DLSYM(libmono, mono_property_get_set_method);
  KERNEL_DLSYM(libmono, mono_class_get_property_from_name);
  KERNEL_DLSYM(libmono, mono_class_from_name);
  KERNEL_DLSYM(libmono, mono_raise_exception);
  KERNEL_DLSYM(libmono, mono_runtime_invoke);
  KERNEL_DLSYM(libmono, mono_array_new);
  KERNEL_DLSYM(libmono, mono_string_new);
  KERNEL_DLSYM(libmono, mono_jit_set_aot_only);
  KERNEL_DLSYM(libmono, mono_jit_init_version);
  KERNEL_DLSYM(libmono, mono_object_new);
  KERNEL_DLSYM(libmono, mono_object_unbox);
  KERNEL_DLSYM(libmono, mono_set_dirs);
  KERNEL_DLSYM(libmono, mono_compile_method);
  KERNEL_DLSYM(libmono, mono_assembly_get_image);
  KERNEL_DLSYM(libmono, mono_domain_assembly_open);
  KERNEL_DLSYM(libmono, mono_get_byte_class);
  KERNEL_DLSYM(libmono, mono_thread_attach);
  KERNEL_DLSYM(libmono, mono_object_get_class);
  KERNEL_DLSYM(libmono, mono_vtable_get_static_field_data);
  KERNEL_DLSYM(libmono, mono_class_get_method_from_name);
  KERNEL_DLSYM(libmono, mono_class_get_field_from_name);
  KERNEL_DLSYM(libmono, mono_field_get_value);
  KERNEL_DLSYM(libmono, mono_aot_get_method);
  KERNEL_DLSYM(libmono, mono_field_static_set_value);
  KERNEL_DLSYM(libmono, mono_field_static_get_value); /* theme: focus colour table */
  KERNEL_DLSYM(libmono, mono_field_set_value);        /* theme: shared table texture */
  KERNEL_DLSYM(libmono, mono_assembly_setrootdir);
  KERNEL_DLSYM(libmono, mono_free);
  KERNEL_DLSYM(libmono, mono_gchandle_new);
  KERNEL_DLSYM(libmono, mono_gchandle_free); /* optional; null if missing */
  KERNEL_DLSYM(libmono, mono_image_open_from_data);
  KERNEL_DLSYM(libmono, mono_runtime_object_init);
  KERNEL_DLSYM(libmono, mono_domain_get);
  KERNEL_DLSYM(libmono, mono_assembly_load_from);
  KERNEL_DLSYM(libmono, mono_method_desc_new);
  KERNEL_DLSYM(libmono, mono_method_desc_search_in_class);
  KERNEL_DLSYM(libmono, mono_method_desc_free);
  KERNEL_DLSYM(libmono, mono_object_new_specific);
  KERNEL_DLSYM(libmono, mono_thread_detach);
  KERNEL_DLSYM(libmono, mono_array_addr_with_size);
  KERNEL_DLSYM(libmono, mono_thread_current);
  KERNEL_DLSYM(libmono, mono_class_vtable);
  KERNEL_DLSYM(libmono, mono_domain_unload);
  KERNEL_DLSYM(libmono, mono_string_to_utf8);
  /* optional (theme: focus frame code dump) */
  KERNEL_DLSYM(libmono, mono_class_get_methods);
  KERNEL_DLSYM(libmono, mono_class_get_nested_types); /* sys video */
  KERNEL_DLSYM(libmono, mono_signature_get_params);
  KERNEL_DLSYM(libmono, mono_type_get_name);
  KERNEL_DLSYM(libmono, mono_method_get_name);
  KERNEL_DLSYM(libmono, mono_method_get_flags);
  KERNEL_DLSYM(libmono, mono_method_signature);
  KERNEL_DLSYM(libmono, mono_signature_get_param_count);
  KERNEL_DLSYM(libmono, mono_class_get_fields);
  KERNEL_DLSYM(libmono, mono_field_get_name);
  KERNEL_DLSYM(libmono, mono_field_get_offset);
  KERNEL_DLSYM(libmono, mono_field_get_flags);
  KERNEL_DLSYM(libmono, mono_jit_info_table_find);
  KERNEL_DLSYM(libmono, mono_jit_info_get_method);
  KERNEL_DLSYM(libmono, mono_jit_info_get_code_start);
  KERNEL_DLSYM(libmono, mono_method_get_class);
  KERNEL_DLSYM(libmono, mono_class_get_name);

  const bool ok =
      mono_object_to_string && mono_get_root_domain && mono_property_get_get_method &&
      mono_property_get_set_method && mono_class_get_property_from_name &&
      mono_class_from_name && mono_runtime_invoke && mono_array_new && mono_string_new &&
      mono_jit_set_aot_only && mono_jit_init_version && mono_object_new &&
      mono_object_unbox && mono_set_dirs && mono_compile_method &&
      mono_assembly_get_image && mono_domain_assembly_open && mono_get_byte_class &&
      mono_thread_attach && mono_object_get_class && mono_vtable_get_static_field_data &&
      mono_class_get_method_from_name && mono_class_get_field_from_name &&
      mono_aot_get_method && mono_field_static_set_value && mono_assembly_setrootdir &&
      mono_free && mono_gchandle_new && mono_image_open_from_data &&
      mono_runtime_object_init && mono_domain_get && mono_assembly_load_from &&
      mono_method_desc_new && mono_method_desc_search_in_class && mono_method_desc_free &&
      mono_object_new_specific && mono_thread_detach && mono_array_addr_with_size &&
      mono_thread_current && mono_class_vtable && mono_domain_unload &&
      mono_string_to_utf8;

  if (!ok)
    LOG_ERROR("Failed to resolve mono symbols");
  return ok;
}

// ---------------------------------------------------------------------------
// Phase 3: resource / type name strings (kept as base64 at rest)
// ---------------------------------------------------------------------------

void init_resource_names() {
  // Manifest resource paths (used by GetManifestResourceStream hook)
  payloads_xml = base64_decode(
      "U2NlLlZzaC5TaGVsbFVJLkxlZ2FjeS5zcmMuU2NlLlZzaC5T"
      "aGVsbFVJLlNldHRpbmdzLlBsdWdpbnMucGF5bG9hZHMueG1s");
  cheats_xml = base64_decode(
      "U2NlLlZzaC5TaGVsbFVJLkxlZ2FjeS5zcmMuU2NlLlZzaC5Ta"
      "GVsbFVJLlNldHRpbmdzLlBsdWdpbnMuY2hlYXRzLnhtbA==");
  debug_settings_xml = base64_decode(
      "U2NlLlZzaC5TaGVsbFVJLkxlZ2FjeS5zcmMuU2NlLlZzaC5TaGVsbFVJLlNldHRpbmdzLlBs"
      "dWdpbnMuRGVidWdTZXR0aW5ncy5kYXRhLmRlYnVnX3NldHRpbmdzLnhtbA==");

  // Assembly / type names used across hooks
  legacy_dec = base64_decode("U2NlLlZzaC5TaGVsbFVJLkxlZ2FjeS5kbGw="); // Legacy.dll
  UI3_dec = base64_decode("U2NlLlZzaC5TaGVsbFVJLlNldHRpbmdzLkNvcmVVSTM="); // Settings.CoreUI3
  appsystem_dll = base64_decode("U2NlLlZzaC5TaGVsbFVJLkFwcFN5c3RlbS5kbGw=");
  uilib = base64_decode("U2NlLlZzaC5VSUxpYg==");
  Sysinfo = base64_decode("U3lzdGVtU29mdHdhcmVWZXJzaW9uSW5mbw==");
  display_info = base64_decode("c2V0X0Rpc3BsYXlWZXJzaW9u");
  uilib_dll = base64_decode(
      "L3N5c3RlbV9leC9jb21tb25fZXgvbGliL1NjZS5Wc2guVUlMaWIuZGxs");

  LOG_DEBUG("[GMRS-INIT] expected resource names:");
  LOG_DEBUG("[GMRS-INIT]   debug_settings_xml=\"%s\"", debug_settings_xml.c_str());
  LOG_DEBUG("[GMRS-INIT]   payloads_xml=\"%s\"", payloads_xml.c_str());
  LOG_DEBUG("[GMRS-INIT]   cheats_xml=\"%s\"", cheats_xml.c_str());
}

// ---------------------------------------------------------------------------
// Phase 4: version banner
// ---------------------------------------------------------------------------

ZT_ONION_ONLY bool init_version_string(const OrbisKernelSwVersion& sw) {
  /* XOR with base64_decode(kXorKeyB64) == "SISTR0_I_SEE_YOU" (not the b64 text). */
  /* XOR "OnionHEN " with SISTR0_I_SEE_YOU. Regenerate: encryptver.py "OnionHEN " */
  const char enc_ver[] = "\x1c\x27\x3a\x3b\x3c\x78\x1a\x07\x7f"; /* "OnionHEN " */
  const std::string key = base64_decode(kXorKeyB64);
  auto dev_ver_bytes =
      encrypt_decrypt(reinterpret_cast<const unsigned char*>(enc_ver),
                      sizeof(enc_ver) - 1, key);
  std::string dec_ver(dev_ver_bytes.begin(), dev_ver_bytes.end());
  dec_ver += ONIONHEN_VERSION;

  std::string final_ver;
#if PUBLIC_TEST == 1
  final_ver = dec_ver + "-PUBLIC_TEST (" + sw.version_str + " )";
#elif PRE_RELEASE == 1
  final_ver = dec_ver + " PRE_RELEASE (" + sw.version_str + " )";
#else
  final_ver = dec_ver + " (" + sw.version_str + " )";
#endif

  LOG_DEBUG("Decrypted Version: %s", final_ver.c_str());
  if (!SetVersionString(final_ver.c_str())) {
    LOG_ERROR("Failed to set version string");
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Phase 5: load Mono assemblies
// ---------------------------------------------------------------------------

bool load_shell_images(ShellImages& out) {
  out.legacy = require_dll(legacy_dec.c_str());
  out.mscorlib = require_dll("mscorlib.dll");
  out.react_pui = require_dll("ReactNative.PUI.dll");
  out.app_system = require_dll(appsystem_dll.c_str());
  out.core = require_dll("Sce.PlayStation.Core.dll");
  out.capture_menu = require_dll("Sce.Vsh.ShellUI.CaptureMenu.dll");

  // Optional: LaunchApp / KillAppWithReason only when present
  out.lnc = getDLLimage("Sce.Vsh.LncUtilWrapper.dll");
  if (!out.lnc)
    notify("notify.hook.lnc_image");

  out.react_common = require_dll("ReactNative.Vsh.Common.dll");
  out.rn_shell = require_dll("Sce.Vsh.ShellUI.ReactNativeShellApp.dll");
  out.pui = require_dll("Sce.PlayStation.PUI.dll");

  // Publish images other modules need
  AppSystem_img = out.app_system;
  react_common_img = out.react_common;
  pui_img = out.pui;

  return out.legacy && out.mscorlib && out.react_pui && out.app_system && out.core &&
         out.capture_menu && out.react_common && out.rn_shell && out.pui;
}

// ---------------------------------------------------------------------------
// Phase 6: resolve Game container scene
// ---------------------------------------------------------------------------

ZT_ONION_ONLY bool resolve_game_container(MonoImage* app_system) {
  MonoClass* layer_manager =
      mono_class_from_name(app_system, "Sce.Vsh.ShellUI.AppSystem", "LayerManager");
  if (!layer_manager) {
    notify("notify.hook.layer_manager");
    return false;
  }

  MonoMethod* find =
      mono_class_get_method_from_name(layer_manager, "FindContainerSceneByPath", 1);
  if (!find) {
    notify("notify.hook.find_scene");
    return false;
  }

  MonoString* path_arg = mono_string_new(mono_domain_get(), "Game");
  void* args[1] = {path_arg};
  MonoObject* exception = nullptr;
  Game = mono_runtime_invoke(find, nullptr, args, &exception);

  if (exception) {
    notify("notify.hook.find_scene_exc");
    return false;
  }
  if (!Game) {
    notify("notify.hook.game_scene");
    return false;
  }

  LOG_DEBUG("Game ContainerScene: %p", static_cast<void *>(Game));
  return true;
}

// ---------------------------------------------------------------------------
// Phase 7: install hooks (table-driven mono methods + special cases)
// ---------------------------------------------------------------------------

/** Mono method hook descriptor; `orig` is address of the typed trampoline ptr. */
struct MonoHookSpec {
  const char* name;
  MonoImage* image;
  const char* name_space;
  const char* klass;
  const char* method;
  int argc;
  void* hook;
  void** orig; // &SomeOrigFn
  bool required;
};

bool install_mono_hook(const MonoHookSpec& h) {
  const uint64_t addr =
      Get_Address_of_Method(h.image, h.name_space, h.klass, h.method, h.argc);
  if (!addr) {
    LOG_ERROR("Hook target missing: %s", h.name);
    if (h.required)
      notify("notify.hook.target");
    return !h.required;
  }
  LOG_DEBUG("Installing mono hook: %s target=%#02lx hook=%p", h.name, addr,
              h.hook);
  if (!InstallDetour(addr, h.hook, h.orig)) {
    LOG_ERROR("Detour failed: %s", h.name);
    if (h.required)
      notify("notify.hook.install");
    return !h.required;
  }
  return true;
}

bool install_optional_diag(const char* tag, MonoImage* image, const char* ns,
                           const char* klass, const char* method, int argc,
                           void* hook, void** orig) {
  const uint64_t addr = Get_Address_of_Method(image, ns, klass, method, argc);
  if (!addr) {
    LOG_ERROR("%s not found", tag);
    return false;
  }
  const bool installed = InstallDetour(addr, hook, orig);
  LOG_DEBUG(installed ? "%s hooked" : "%s failed to detour", tag);
  return installed;
}

ZT_ONION_ONLY bool install_hooks(const ShellImages& img) {
  char probe[kMprotectProbeSize];
  has_hv_bypass = (sceKernelMprotect(probe, sizeof(probe), kProtRwx) == 0);
  LOG_DEBUG("has_hv_bypass=%d (mprotect for detours)", has_hv_bypass ? 1 : 0);

  Patch_Main_thread_Check(img.core);

  // --- Native (required) ---
  if (!sceRegMgrGetInt) {
    notify("notify.hook.regmgr");
    return false;
  }
  if (!install_detour_native("sceRegMgrGetInt",
                             reinterpret_cast<void*>(sceRegMgrGetInt),
                             reinterpret_cast<void*>(&sceRegMgrGetInt_hook),
                             sceRegMgrGetInt, true))
    return false;

  // --- Standard mono hooks ---
  // UI3_dec / Settings types use runtime-decoded namespace strings.
  const MonoHookSpec mono_hooks[] = {
      {"OptionMenu.createJson", img.rn_shell, "ReactNative.Modules.ShellUI.HomeUI",
       "OptionMenu", "createJson", 8, reinterpret_cast<void*>(&createJson_hook),
       reinterpret_cast<void**>(&createJson), true},
      /* Optional: Core.Input may still be loading while we install; missing is non-fatal. */
      {"GamePad.GetData", img.core, "Sce.PlayStation.Core.Input", "GamePad", "GetData",
       1, reinterpret_cast<void*>(&GetData_hook), reinterpret_cast<void**>(&GetData),
       false},
      {"SettingsPlugin.CxmlUri", img.legacy, UI3_dec.c_str(), "SettingsPlugin",
       "CxmlUri", 1, reinterpret_cast<void*>(&CxmlUri_Hook),
       reinterpret_cast<void**>(&CxmlUri), false},
      {"SettingPage.OnPressed", img.legacy, UI3_dec.c_str(), "SettingPage", "OnPressed",
       2, reinterpret_cast<void*>(&OnPress_Hook), reinterpret_cast<void**>(&oOnPress),
       false},
      {"SettingPage.OnCreating", img.legacy, UI3_dec.c_str(), "SettingPage",
       "OnCreating", 1, reinterpret_cast<void*>(&OnPreCreate_Hook),
       reinterpret_cast<void**>(&oOnPreCreate), false},
      {"SettingPage.OnActivated", img.legacy, UI3_dec.c_str(), "SettingPage",
       "OnActivated", 1, reinterpret_cast<void *>(&SettingPageOnActivated_Hook),
       reinterpret_cast<void **>(&oSettingPageOnActivated), false},
      {"SettingList.Cleanup", img.legacy, UI3_dec.c_str(), "SettingList",
       "Cleanup", 0, reinterpret_cast<void *>(&SettingListCleanup_Hook),
       reinterpret_cast<void **>(&oSettingListCleanup), false},
      {"UserCustomElementUI.Reset", img.legacy, UI3_dec.c_str(),
       "UserCustomElementUI", "Reset", 1,
       reinterpret_cast<void*>(&UserCustomElementReset_Hook),
       reinterpret_cast<void**>(&oUserCustomElementReset), false},
      {"SettingPageStack.OnPopping", img.legacy, UI3_dec.c_str(),
       "SettingPageStack", "OnPopping", 2,
       reinterpret_cast<void *>(&SettingPageStackOnPopping_Hook),
       reinterpret_cast<void **>(&oSettingPageStackOnPopping), false},
      {"SettingsPlugin.GetString", img.legacy, UI3_dec.c_str(), "SettingsPlugin",
       "GetString", 1, reinterpret_cast<void*>(&GetString_Hook),
       reinterpret_cast<void**>(&oGetString), true},
      {"EventManager.OnShareButton", img.capture_menu, "Sce.Vsh.ShellUI.CaptureMenu",
       "EventManager", "OnShareButton", 1, reinterpret_cast<void*>(&OnShareButton),
       reinterpret_cast<void**>(&OnShareButton_orig), false},
  };

  for (const MonoHookSpec& h : mono_hooks) {
    if (!install_mono_hook(h))
      return false;
  }

  // --- Optional diagnostics (log only) ---
  (void)install_optional_diag(
      "[DBG-NAV] UpdateNavigationState", img.react_pui, "ReactNative.Views.UI3.View",
      "ReactNavigatorManager", "UpdateNavigationState", 1,
      reinterpret_cast<void*>(&ReactNavigatorManager_UpdateNavigationState_Hook),
      reinterpret_cast<void**>(&ReactNavigatorManager_UpdateNavigationState_Orig));

  install_homeui_top_nav_hooks(img.react_pui);
  install_homeui_js_hooks(img.react_pui, img.pui);

  (void)install_optional_diag(
      "[DBG-GETMODEL] GetModel", img.rn_shell, "ReactNative.Modules.ShellUI.Settings",
      "DebugSettingsModule", "GetModel", 2,
      reinterpret_cast<void*>(&DebugSettings_GetModel_Hook),
      reinterpret_cast<void**>(&DebugSettings_GetModel_Orig));

  // --- LncUtil (optional image) ---
  if (img.lnc) {
    (void)install_mono_hook(
        {"LncUtilWrapper.LaunchApp", img.lnc, "Sce.Vsh.LncUtil", "LncUtilWrapper",
         "LaunchApp", 4, reinterpret_cast<void*>(&LaunchApp),
         reinterpret_cast<void**>(&LaunchApp_orig), false});
    const uint64_t kill_addr = Get_Address_of_Method(
        img.lnc, "Sce.Vsh.LncUtil", "LncUtilWrapper", "KillAppWithReason", 2);
    if (kill_addr &&
        !DetourFunction(kill_addr, reinterpret_cast<void*>(&KillAppWithReason_Hook)))
      notify("notify.hook.kill_app");
  }

  // --- RNPS bundle decrypt path ---
  if (!ioctl) {
    notify("notify.hook.rnps_find");
    return false;
  }
  LOG_DEBUG("Found ioctl at %p", reinterpret_cast<void *>(ioctl));
  if (!DetourFunction(reinterpret_cast<uintptr_t>(ioctl),
                      reinterpret_cast<void*>(&ioctl_hook))) {
    notify("notify.hook.rnps_detour");
    return false;
  }
  LOG_DEBUG("Detoured ioctl to ioctl_hook");

  // --- BootHelper.Boot: 3-arg then 2-arg ---
  if (!install_mono_hook({"BootHelper.Boot(3)", img.app_system, "Sce.Vsh.ShellUI.AppSystem",
                          "BootHelper", "Boot", 3, reinterpret_cast<void*>(&uri_boot_hook),
                          reinterpret_cast<void**>(&boot_orig), false}) ||
      !boot_orig) {
    if (!install_mono_hook(
            {"BootHelper.Boot(2)", img.app_system, "Sce.Vsh.ShellUI.AppSystem",
             "BootHelper", "Boot", 2, reinterpret_cast<void*>(&uri_boot_hook_2),
             reinterpret_cast<void**>(&boot_orig_2), false}) ||
        !boot_orig_2)
      notify("notify.hook.boot");
  }

  // --- CaptureScreen: 4-arg then 5-arg ---
  if (!install_mono_hook(
          {"CaptureScreen(4)", img.capture_menu, "Sce.Vsh.ShellUI.CaptureMenu",
           "CaptureController", "CaptureScreen", 4,
           reinterpret_cast<void*>(&CaptureScreen_old),
           reinterpret_cast<void**>(&CaptureScreen_orig_old), false}) ||
      !CaptureScreen_orig_old) {
    if (!install_mono_hook(
            {"CaptureScreen(5)", img.capture_menu, "Sce.Vsh.ShellUI.CaptureMenu",
             "CaptureController", "CaptureScreen", 5,
             reinterpret_cast<void*>(&CaptureScreen_new),
             reinterpret_cast<void**>(&CaptureScreen_orig_new), false}) ||
        !CaptureScreen_orig_new)
      notify("notify.hook.capture");
  }

  // --- GetManifestResourceStream (class name differs on 3.xx) ---
  {
    const char* klass = is_3xx ? "Assembly" : "RuntimeAssembly";
    const uint64_t method = Get_Address_of_Method(
        img.mscorlib, "System.Reflection", klass, "GetManifestResourceStream", 1);
    if (!method) {
      notify("notify.hook.master");
      return false;
    }
    (void)install_mono_hook(
        {"GetManifestResourceStream", img.mscorlib, "System.Reflection", klass,
         "GetManifestResourceStream", 1,
         reinterpret_cast<void*>(&GetManifestResourceStream_Hook),
         reinterpret_cast<void**>(&GetManifestResourceStream_Original), false});
  }

  /*
   * Arm the per-frame entry point only after every dependency it can observe is
   * ready. Keeping this last prevents the UI thread from entering Onion code
   * while the installer is still compiling and committing other Mono hooks.
   */
  (void)install_mono_hook(
      {"PUI.Application.Update", img.pui, "Sce.PlayStation.PUI",
       "Application", "Update", 0, reinterpret_cast<void*>(&OnRender_Hook),
       reinterpret_cast<void**>(&OnRender_orig), false});

  return true;
}

// ---------------------------------------------------------------------------
// Phase 8: process query hooks + keep-alive
// ---------------------------------------------------------------------------

ZT_ONION_ONLY void setup_proc_hooks() {
  onion_proc_set_sce_hooks(
      [](int pid, char* name) -> int {
        return sceKernelGetProcessName ? sceKernelGetProcessName(pid, name) : -1;
      },
      [](pid_t pid, void* info) -> int {
        return sceKernelGetAppInfo
                   ? sceKernelGetAppInfo(pid, static_cast<app_info_t*>(info))
                   : -1;
      },
      []() -> int {
        return sceSystemServiceGetAppIdOfRunningBigApp
                   ? sceSystemServiceGetAppIdOfRunningBigApp()
                   : -1;
      });
}

ZT_ONION_ONLY void run_keep_alive() {
  // Publish the initialized SceShellUI process instance.  The daemon keeps
  // this marker so a restart cannot inject a second Toolbox into the same PID.
  onion_ready_signal_pid(ONION_READY_TOOLBOX, getpid());

  while (true) {
    LOG_DEBUG("sleeping ....");
    sleep(kKeepAliveSleepSec);
  }
}

#if defined(ZHITHEMES) && ZHITHEMES
/*
 * Font investigation (to let the user send a font file later): which font
 * files exist on the system, and which ones ShellUI opens from now on. Logs
 * "fonts: ..." lines in the log (debug mode); the open() hooks only look at the path.
 */
int (*g_open_orig)(const char *, int, int) = nullptr;
int (*g_sce_open_orig)(const char *, int, int) = nullptr;
std::atomic<int> g_font_opens{0};

bool is_font_path(const char *p) {
  return p && (strstr(p, ".otf") || strstr(p, ".ttf") || strstr(p, ".ttc") ||
               strstr(p, ".pfb") || strstr(p, "font") || strstr(p, "Font"));
}

void log_font_open(const char *how, const char *path, int fd) {
  if (!theme_quitting() && zt_debug_on() && is_font_path(path) && g_font_opens.fetch_add(1) < 200)
    zt_log("fonts: %s %s -> %d", how, path, fd);
}

/* "SST-<x>.k??": one of libScePsm's SST names renamed by theme_psm_names */
bool renamed_font(const char *path) {
  const char *name = path && !theme_quitting() ? strrchr(path, '/') : nullptr;
  if (!name || strncmp(name + 1, "SST-", 4) != 0)
    return false;
  const size_t n = strlen(name);
  return n > 9 && name[n - 4] == '.' && name[n - 3] == 'k' && isalnum((unsigned char)name[n - 2]) &&
         isalnum((unsigned char)name[n - 1]);
}

int open_with(int (*orig)(const char *, int, int), const char *how,
              const char *path, int flags, int mode) {
  if (renamed_font(path)) {
    /* systemFont / elementFont: the user's font for this SST variant; when
       it does not open (or is off) the SST file itself, ".k??" back to ".otf" */
    const std::string mine = theme_system_font(strrchr(path, '/') + 1);
    int fd = mine.empty() ? -1 : orig(mine.c_str(), flags, mode);
    if (fd < 0) {
      std::string stock = path;
      stock.replace(stock.size() - 3, 3, "otf");
      fd = orig(stock.c_str(), flags, mode);
    }
    if (g_font_opens.fetch_add(1) < 200)
      zt_log("fonts: %s %s -> %s (%d)", how, path, mine.empty() ? "stock" : mine.c_str(), fd);
    return fd;
  }
  const int fd = orig(path, flags, mode);
  log_font_open(how, path, fd);
  return fd;
}

int ZT_Open_Hook(const char *path, int flags, int mode) {
  return open_with(g_open_orig, "open", path, flags, mode);
}

int ZT_SceOpen_Hook(const char *path, int flags, int mode) {
  return open_with(g_sce_open_orig, "sceKernelOpen", path, flags, mode);
}

void list_font_dir(const char *dir, int depth) {
  DIR *d = opendir(dir);
  if (!d) {
    if (depth == 0)
      zt_log("fonts: %s (no access)", dir);
    return;
  }
  int shown = 0;
  while (dirent *e = readdir(d)) {
    if (e->d_name[0] == '.')
      continue;
    char path[512];
    snprintf(path, sizeof(path), "%s/%s", dir, e->d_name);
    struct stat st = {};
    stat(path, &st);
    if (S_ISDIR(st.st_mode)) {
      if (depth < 2 && (depth > 0 || strstr(e->d_name, "font") || strstr(e->d_name, "Font")))
        list_font_dir(path, depth + 1);
      else if (depth > 0 && shown++ < 80)
        zt_log("fonts: %s/", path);
      continue;
    }
    if ((depth > 0 || is_font_path(e->d_name)) && shown++ < 80)
      zt_log("fonts: %s (%ld bytes)", path, (long)st.st_size);
  }
  closedir(d);
}

/*
 * systemFont: libScePsm keeps every font it opened by
 * file name, so asking for SST-Roman.otf again never reaches open(). Its
 * table of SST names (records {const char *name, size_t length, 0} in a
 * writable segment) is found once; theme_psm_names() points each record at
 * a copy of the same length ending in ".k??", a name the cache has not seen,
 * which open_with() answers with the user's font.
 */
struct ZtModuleSegment {
  uint64_t address;
  uint32_t size;
  int32_t prot; /* 1 read, 2 write, 4 execute */
};
struct ZtModuleInfo {
  uint64_t size;
  char name[256];
  ZtModuleSegment segments[4];
  uint32_t segment_count;
  uint8_t fingerprint[20];
};
struct PsmFontName {
  uint64_t *record;
  const char *stock;
  char copy[2][32]; /* used in turn: libScePsm may be reading the other one */
};
PsmFontName g_psm_names[16];
int g_psm_name_count = 0;

/* the names may live outside libScePsm's own segments (found none when
   only those were allowed): any readable mapping */
int (*g_query_prot)(void *, void **, void **, uint32_t *) = nullptr;

bool in_readable(uint64_t from, uint64_t length) {
  void *start = nullptr, *end = nullptr;
  uint32_t prot = 0;
  return g_query_prot && g_query_prot(reinterpret_cast<void *>(from), &start, &end, &prot) == 0 &&
         (prot & 1) && from + length <= reinterpret_cast<uint64_t>(end);
}

void find_psm_font_names() {
  int (*get_info)(int, ZtModuleInfo *) = reinterpret_cast<int (*)(int, ZtModuleInfo *)>(
      kernel_dynlib_dlsym(-1, libSceKernelHandle, "sceKernelGetModuleInfo"));
  g_query_prot = reinterpret_cast<int (*)(void *, void **, void **, uint32_t *)>(
      kernel_dynlib_dlsym(-1, libSceKernelHandle, "sceKernelQueryMemoryProtection"));
  /* the handle through the kernel's module list: the
     syscalls of get_module_handle() gave 0 and sceKernelGetModuleList
     only listed 1 module, the module having handed its privileges
     back by now */
  uint32_t psm = 0;
  const int found = kernel_dynlib_handle(getpid(), "libScePsm.sprx", &psm);
  ZtModuleInfo info = {};
  info.size = sizeof(info);
  const int described = found == 0 && psm && get_info ? get_info((int)psm, &info) : -1;
  if (described != 0) {
    zt_log("fonts: libScePsm not found (handle rc=%d handle=%u info=%p rc=%d)", found, psm,
                   (void *)get_info, described);
    return;
  }
  zt_log("fonts: libScePsm handle %d, %u segments, query=%p", psm, info.segment_count,
                 (void *)g_query_prot);
  int shapes = 0, readable = 0, sst = 0; /* records seen at each check, for the log */
  for (uint32_t i = 0; i < info.segment_count && i < 4; ++i) {
    const ZtModuleSegment &s = info.segments[i];
    zt_log("fonts: libScePsm segment %u 0x%lx+0x%x prot=%d", i,
                   (unsigned long)s.address, s.size, s.prot);
    if ((s.prot & 4) || (s.prot & 3) != 3)
      continue;
    uint64_t *p = reinterpret_cast<uint64_t *>(s.address);
    uint64_t *end = reinterpret_cast<uint64_t *>(s.address + s.size) - 3;
    for (; p <= end && g_psm_name_count < 16; ++p) {
      const uint64_t length = p[1];
      if (!p[0] || p[2] != 0 || length < 9 || length >= 32)
        continue;
      ++shapes;
      if (!in_readable(p[0], length + 1))
        continue;
      ++readable;
      const char *name = reinterpret_cast<const char *>(p[0]);
      if (strncmp(name, "SST", 3) == 0 && sst++ < 6)
        zt_log("fonts: libScePsm candidate '%.31s' len %lu at %p", name,
                       (unsigned long)length, (void *)p);
      if (name[length] != 0 || strncmp(name, "SST-", 4) != 0 || memcmp(name + length - 4, ".otf", 4) != 0)
        continue;
      PsmFontName &n = g_psm_names[g_psm_name_count++];
      n.record = p;
      n.stock = name;
      memcpy(n.copy[0], name, length + 1);
      memcpy(n.copy[1], name, length + 1);
      zt_log("fonts: libScePsm font name '%s' at %p", name, (void *)p);
    }
  }
  zt_log("fonts: libScePsm %d SST names (records %d, readable %d, SST %d)",
                 g_psm_name_count, shapes, readable, sst);
}
} // namespace

int theme_psm_names(int generation) {
  static const char digits[] = "0123456789abcdefghijklmnopqrstuvwxyz";
  /* none at start: look again when a font is applied (its log lines then
     sit next to the systemFont ones) */
  static int retries = 0;
  if (g_psm_name_count == 0 && generation >= 0 && retries++ < 3)
    find_psm_font_names();
  for (int i = 0; i < g_psm_name_count; ++i) {
    PsmFontName &n = g_psm_names[i];
    char *copy = n.copy[generation & 1];
    if (generation >= 0) {
      const size_t length = strlen(copy);
      const int g = generation % (36 * 36);
      copy[length - 3] = 'k';
      copy[length - 2] = digits[g / 36];
      copy[length - 1] = digits[g % 36];
    }
    *(volatile uint64_t *)n.record =
        reinterpret_cast<uint64_t>(generation >= 0 ? copy : n.stock);
  }
  return g_psm_name_count;
}

namespace {
void zt_font_probe() {
  find_psm_font_names();
  static const char *const roots[] = {
      "/system/common/font", "/preinst/common/font", "/system_ex/common_ex/font",
      "/system/common", "/preinst/common", "/system_ex/common_ex",
      "/system_ex/rnps", "/system/priv/font"};
  if (zt_debug_on()) /* the font folders of this firmware, for the logs */
    for (const char *r : roots)
      list_font_dir(r, r[strlen(r) - 1] == 't' ? 1 : 0);
  void *open_addr = (void *)kernel_dynlib_dlsym(-1, libSceKernelHandle, "open");
  void *sce_addr =
      (void *)kernel_dynlib_dlsym(-1, libSceKernelHandle, "sceKernelOpen");
  const bool a = open_addr &&
                 theme_hook((uint64_t)open_addr, reinterpret_cast<void *>(&ZT_Open_Hook),
                            reinterpret_cast<void **>(&g_open_orig));
  const bool b = sce_addr && sce_addr != open_addr &&
                 theme_hook((uint64_t)sce_addr, reinterpret_cast<void *>(&ZT_SceOpen_Hook),
                            reinterpret_cast<void **>(&g_sce_open_orig));
  zt_log("fonts: hooks open=%d sceKernelOpen=%d", (int)a, (int)b);
}

/* ZhiThemes: the per-frame UI tick only runs the queued Home/hub reloads */
void (*g_zt_render_orig)(MonoObject *) = nullptr;
void ZT_OnRender_Hook(MonoObject *instance) {
  zt_stats_frame(); /* ShellUI fps for the debug panel */
  if (!theme_quitting()) {
    shellui_poll_home_reload();
    theme_tick();
  }
  g_zt_render_orig(instance);
}

/* ShellUI memory in the log (at start, every minute, at quit), to see
   whether each injection leaves memory behind (crashes after the 6th
   injection into one ShellUI, seen twice). The functions are
   looked up into local pointers (not KERNEL_DLSYM globals, see
   check_dlsym.py); a missing one is just left out of the line. */
void zt_memory_log(pid_t pid, const char *why) {
  static bool looked = false;
  if (!looked) {
    looked = true;
    void *flex_free = (void *)kernel_dynlib_dlsym(-1, libSceKernelHandle,
                                                  "sceKernelAvailableFlexibleMemorySize");
    void *mono_heap = nullptr, *mono_used = nullptr;
    const int libmono = get_module_handle(pid, "libmonosgen-2.0.sprx");
    if (libmono > 0) {
      mono_heap = (void *)kernel_dynlib_dlsym(-1, libmono, "mono_gc_get_heap_size");
      mono_used = (void *)kernel_dynlib_dlsym(-1, libmono, "mono_gc_get_used_size");
    }
    zt_log("memory: functions flexible=%d monoHeap=%d monoUsed=%d", flex_free != nullptr,
           mono_heap != nullptr, mono_used != nullptr);
    /* also for the debug panel (zt_stats.cpp) */
    zt_stats_set_memory_fns(flex_free, mono_heap, mono_used);
  }
  zt_log("memory (%s): %s", why, zt_stats_memory_line().c_str());
}

/*
 * ZhiThemes module: only the theme (theme.js injection, focus frame, editor on
 * :4444). Everything else OnionHEN does in ShellUI is left out. Runs until a
 * newer ZhiThemes asks it to leave (POST /quit -> theme_unload()).
 */
int zhithemes_main(pid_t pid, uint64_t old_authid, const OrbisKernelSwVersion &sw) {
  /* no model lookup here (called sceKernelGetHwModelName, not
     confirmed on 9.60, and ShellUI crashed before the first log line) */
  zt_log_session_start(sw.version_str, sw.version);
  zt_boot("log session");
  Root_Domain = mono_get_root_domain();
  if (!Root_Domain)
    return -1;
  mono_thread_attach(Root_Domain);
  ShellImages images;
  if (!load_shell_images(images))
    return -1;
  zt_boot("shell images");
  install_homeui_js_hooks(images.react_pui, images.pui);
  zt_boot("js hooks");
  const uint64_t update = Get_Address_of_Method(
      images.pui, "Sce.PlayStation.PUI", "Application", "Update", 0);
  const bool tick = update &&
                    theme_hook(update, reinterpret_cast<void *>(&ZT_OnRender_Hook),
                               reinterpret_cast<void **>(&g_zt_render_orig));
  set_proc_authid(pid, old_authid);
  zt_log("zhithemes: module ready (tick hook=%d)", (int)tick);
  zt_boot("tick hook");
  zt_font_probe();
  zt_boot("font hooks");
  theme_web_start();
  shellui_request_hub_reload();
  shellui_request_home_reload();
  hooked = true;
  zt_boot("running");
  zt_memory_log(pid, "start");
  for (int s = 1; !theme_quitting(); s++) {
    sleep(1);
    if (s % 60 == 0)
      zt_memory_log(pid, "minute");
  }
  zt_memory_log(pid, "quit");
  zt_log("zhithemes: module thread ends");
  zt_log_session_end();
  return 0;
}
#endif

} // namespace

// ---------------------------------------------------------------------------
// main — orchestration only
// ---------------------------------------------------------------------------

int main(int argc, char const* argv[]) {
  (void)argc;
  (void)argv;

  if (hooked)
    return 0;

  zt_boot("---- module main");
  const pid_t pid = getpid();
  AuthIdGuard auth(pid, set_ucred_to_ptrace());

  if (!resolve_native_symbols(pid))
    return -1;
  zt_boot("native symbols");

  LOG_DEBUG("Starting ShellUI Module ....");

  if (!resolve_mono_symbols(pid))
    return -1;
  zt_boot("mono symbols");

  init_resource_names();

  OrbisKernelSwVersion sw{};
  sceKernelGetProsperoSystemSwVersion(&sw);
  is_3xx = (sw.version < kFw3xxMaxExclusive);
  is_6xx = (sw.version >= kFw6xxMin);
  zt_boot("fw read");
#if !defined(ZT_SLIM) /* OnionHEN's menus: not in the slim ZhiThemes module */
  shellui_configure_debug_settings_route(sw.version);
  onion::shellui::dynamic_ui::configure(sw.version);
#endif
#if !(defined(ZHITHEMES) && ZHITHEMES)
  if (!onion::shellui::plugin_ui_bridge::start())
    LOG_ERROR("Failed to start dynamic plugin UI bridge");
#endif
#if !defined(ZT_SLIM)
  LOG_DEBUG("System Software Version: %s is_3xx: %s debug_settings_old: %s",
              sw.version_str, is_3xx ? "Yes" : "No",
              shellui_debug_settings_uses_old_route() ? "Yes" : "No");
#endif

  if (!mono_get_root_domain)
    return -1;

#if defined(ZHITHEMES) && ZHITHEMES
  {
    const uint64_t old_authid = auth.old_authid;
    auth.release();
    zt_boot("zhithemes_main");
    return zhithemes_main(pid, old_authid, sw);
  }
#else

  LOG_DEBUG("loading settings");
  if (!LoadSettings()) {
    LOG_ERROR("Failed to load settings");
    return -1;
  }
  LOG_DEBUG("Settings loaded successfully");

  Root_Domain = mono_get_root_domain();
  if (!Root_Domain) {
    LOG_ERROR("failed to get shellui root domain");
    return -1;
  }
  LOG_DEBUG("Shellui Root Domain: %p", static_cast<void *>(Root_Domain));
  mono_thread_attach(Root_Domain);

  if (!init_version_string(sw))
    return -1;

  ShellImages images;
  if (!load_shell_images(images))
    return -1;
  if (!resolve_game_container(images.app_system))
    return -1;

  LOG_DEBUG("Starting hooking...");
  shellui_hooks_begin_install();
  if (!install_hooks(images)) {
    shellui_hooks_publish_failed();
    return -1;
  }

  LOG_DEBUG("Performing Magic ....");

  // Drop elevated auth before long-running work
  set_proc_authid(pid, auth.old_authid);
  auth.release();

  LOG_DEBUG("Performed Magic");
  setup_proc_hooks();

  /* SystemService cannot be queried under PTRACE_AUTHID. */
  toolbox_i18n::apply_system_or_ui_lang(g_settings.ui_lang);

  shellui_hooks_publish_ready();
  /*
   * Home already cached pre-inject state. Display-TID spoof and the top-nav
   * RNPS patch both need NPXS40002 ReloadApp on the UI thread (OnRender), not
   * this inject worker. One pending flag coalesces both reasons.
   */
  shellui_request_home_reload();
  theme_web_start();
  hooked = true;
  run_keep_alive();
  return 0;
#endif
}
