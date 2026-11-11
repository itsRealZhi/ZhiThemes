# Credits

## ZhiThemes

**Zhi**: creator and author of ZhiThemes (theme engine, web editor, folders, custom tiles, logs, theme packs).

## Built on

- **[OnionHEN](https://github.com/aydencharles/onionHEN)** by aydencharles and contributors (GPL-3.0). ZhiThemes uses its ShellUI injection, Mono/hooking helpers (`libonion_detour`, `libonion_proc`, `libonion_platform`) and ELF loader. The original files are under `src/`, and the changes are listed in [src/ZHITHEMES_CHANGES.md](src/ZHITHEMES_CHANGES.md).
- **PS5 payload SDK** (ps5-payload-sdk) and its homebrew libraries: libcurl, OpenSSL, zlib (the SteamGridDB search in the Pictures tab, PNG mosaics).
- **[AniketosHEN](https://github.com/xS3Cx/AniketosHEN)** by xS3Cx and contributors (GPL-3.0). The animated avatar (ImageBox hook, and fitting a big GIF on the PS5: `zt_avatar_codec.c`, `zt_avatar_image.hpp`), the system background colour (BGLayer), the video and picture in the system background layer (including the MP4 size check that picks the Full HD or UHD decoder), the panel tint and the idea of the vignette, particles and own clock follow its code and are credited at the top of `src/source/shellui/src/zt_native_theme.cpp` and `zt_sys_video.cpp`. The extra Home tabs (new spaces in the tab bar, L1 / R1 through them) follow the way its Home script adds tabs and are credited in `theme/theme.js`. The debug panel's numbers (memory pools, CPU use from the idle threads, temperatures, fan) follow its telemetry and are credited in `src/source/shellui/src/zt_stats.cpp`. The 23 built-in particle styles (their settings) and their textures (`theme/particles/*.png`) are AniketosHEN's (`particle_presets`, `particle_sim.cpp`, `assets/particles/builtin`), played here by `theme/theme.js` (StyledParticles).
- **[stb_image / stb_image_resize2](https://github.com/nothings/stb)** by Sean Barrett (public domain) and **[msf_gif](https://github.com/notnullnotvoid/msf_gif)** by Miles Fogle (public domain): decoding, resizing and encoding of animated avatars on the PS5 (`src/source/shellui/include/zt_third/`).
- **cJSON** (MIT) and the other code in `src/third_party`, each under its own license.
- **[SteamGridDB](https://www.steamgriddb.com/)**: optional cover/background search in the editor (with your own API key, stored only on your PS5).
- **[motionbgs.com](https://motionbgs.com/)**: the editor can search its live wallpapers (made by fans) for animated game backgrounds. The search and the download go from your PS5 to the site when you ask; ZhiThemes ships and keeps none of its videos.

## Pictures and icons

- **Empty tab picture** (`theme/particles/ui_empty_box.png`): "box open" by Royyan Wijaya from [Noun Project](https://thenounproject.com/) (CC BY 3.0).

## Example themes

- **KindaSelene**: inspired by [Selene](https://github.com/mattxslv/Selene) by mattxslv. Settings wallpaper: photo by [Liana S](https://unsplash.com/pt-br/@cherstve_pechivo) on [Unsplash](https://unsplash.com/pt-br/fotografias/luz-dourada-brilha-sobre-um-fundo-escuro-q-NZ4eFtYx0).
- **CleanWaves** (both versions): inspired by [A PlayStation 5 User Interface Concept](https://dribbble.com/shots/14208203-A-PlayStation-5-User-Interface-Concept) on Dribbble.
- **sharpcorners**: video by [NewHumanDesigns](https://pixabay.com/users/newhumandesigns-8896/) from [Pixabay](https://pixabay.com/).

## Thanks

- **Roger**, for the help with firmware 13.60.
- Everyone who tests ZhiThemes on other PS5 models and firmwares and sends logs.
