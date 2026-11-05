# ZhiThemes changes to OnionHEN

`src/` is [OnionHEN](https://github.com/aydencharles/onionHEN) (GPL-3.0), upstream commit `b23ffe6` ("Merge pull request #83 from aydencharles/dev"), with the changes below by Zhi (2026). Only the `zhithemes` target is built for ZhiThemes, and the rest of OnionHEN is kept unchanged so the tree still configures.

## Added (ZhiThemes)

- `source/zhithemes/`: the `ZhiThemes.elf` payload. It injects the theme module into SceShellUI, replaces a running copy without a reboot, re-injects after ShellUI restarts, and has a safe mode.
- `source/shellui/src/homeui_js_inject.cpp`: runs the theme in the Home, game hub, Game/App Library, Settings and Trophies; the focus frame, design tokens and system font. Only values from the user's theme are used (`safe_value`, `safe_tokens`).
- `source/shellui/src/theme_web.cpp`: the web editor server (port 4444), uploads, logs and debug routes, theme pack assets, and the local video server (127.0.0.1:4445).
- `source/shellui/src/zt_log.cpp`: logs in `/data/ZhiThemes/logs/` with timestamps, a session header (firmware, version), debug mode, and debug and crash logs.
- `source/shellui/src/zt_mosaic.cpp`: folder mosaics and backgrounds (PNG).
- `source/shellui/src/zt_sgdb.cpp`: SteamGridDB requests for the editor.
- `source/shellui/src/zt_storage.cpp`: the folders under `/data/ZhiThemes`; writes the particle style textures to `Assets/particles/`.
- `source/shellui/src/zt_native_theme.cpp`: native looks: the animated avatar (`ImageBox.LoadAsync`), the system background colour (`BGLayerPlugin`), the panel and icon tint (`Panel.set_BackgroundColor`, `Widget.GetTokenColor`). Adapted from AniketosHEN (GPL-3.0).
- `source/shellui/src/zt_sys_video.cpp`: the video or picture behind Settings and Trophies (and the Home, with "Use the wallpaper") in the system background layer (`BGLayerPlugin.RootWidget`, `Sce.Vsh.Video.VideoPlayer` + `VideoView`, `ImageBox`). Adapted from AniketosHEN (GPL-3.0).
- `source/shellui/src/zt_notify.cpp`: plain notifications, only for the experimental slim module (`ZT_SLIM_MODULE`).
- `source/zhithemes/check_dlsym.py`: build check, every `KERNEL_DLSYM` pointer must be defined in the module (otherwise the name binds to the library function and ShellUI crashes at start-up).
- `source/shellui/include/zt_*.hpp`, `homeui_js_inject.hpp`, `theme_web.hpp`: their headers. `theme_default_js.hpp`, `theme_web_page.hpp` and `zt_particle_textures.hpp` are generated from `../theme`.

## Changed OnionHEN files

- `source/CMakeLists.txt`: `add_subdirectory(zhithemes)`.
- `source/shellui/CMakeLists.txt`: the `zt_shellui` target, built with `ZHITHEMES=1` (the whole module; `ZT_SLIM_MODULE=ON` builds it from only the theme's files, experimental), linked with zlib, libcurl and OpenSSL, with the `check_dlsym.py` check before linking.
- `source/shellui/src/prx.cpp`: under `ZHITHEMES=1`, `main()` runs `zhithemes_main()` (theme only) instead of the rest of OnionHEN's start, writing each start-up step to `logs/boot.log`. It also adds the font `open()` hooks and the libScePsm font-name cache bust.
- `source/shellui/src/external_symbols.cpp`, `include/external_symbols.hpp`, `include/hooked_funcs.hpp`, `src/mono_runtime.cpp`: extra Mono/kernel symbols the theme uses; the `__sys_regmgr_call` pointer moved here from `hook_functions.cpp`; `mono_class_get_nested_types`, `mono_signature_get_params`, `mono_type_get_name` (optional, for the system background video).
- `source/libonion_detour/`: `InstallDetourEx` / `RevertDetour` (hooks that can be removed again, for updating without a reboot), patching functions that are not 16-byte aligned, `MakeCodeReadable`, `DetourLastError`.
