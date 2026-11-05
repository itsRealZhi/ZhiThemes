# Install and use

## Requirements

- A PS5 with a jailbreak that runs ELF payloads: kstuff loaded and an ELF loader listening (for example elfldr on port 9021). ZhiThemes does not include an exploit.
- Firmware: tested on **9.60**. Other firmwares may work partly or not at all; see [LOGS.md](LOGS.md) to help test them.
- A PC or phone on the same network, with a modern browser (Chrome, Edge, Firefox, Safari).

## First start

1. Get `ZhiThemes.elf` from the GitHub **Releases** page.
2. Send it to the ELF loader, the same way you send any payload (a payload sender app, `nc`, `socat`, etc.).
3. After a few seconds the PS5 shows **"Welcome to ZhiThemes 0.1.0-alpha by Zhi! Open <IP>:4444 …"**.
4. In your browser open `http://<that IP>:4444`. The editor loads the current theme.
5. Change something and press **Apply** (or Ctrl+S). The Home reloads with the change.

The first time, ZhiThemes creates `/data/ZhiThemes/` and starts **off** (*PS5 default*): the PS5 looks stock until you press **Apply** in the editor (this creates the theme `Default`) or pick/install a theme. Nothing outside that folder is written.

## Every boot

ZhiThemes lives in memory. After a reboot the PS5 is stock again: send `ZhiThemes.elf` again (or add it to your autoload). Your theme and files stay in `/data/ZhiThemes/`.

When the PS5 comes back from rest mode, ShellUI restarts. ZhiThemes stays running in the background and loads the theme again on its own.

## Update

Send the new `ZhiThemes.elf`. It asks the running copy to remove its hooks, stops the old background process and loads the new one. You don't need to reboot.

## Remove

- **Turn it off for now:** reboot the PS5 and don't send the payload.
- **Remove it completely:** reboot, then delete `/data/ZhiThemes/` (FTP or a file manager).

## If something goes wrong

- **Safe mode:** if ShellUI crashes twice within 3 minutes, ZhiThemes stops loading the theme and shows "Theme off (safe mode)". Send the payload again after fixing the theme.
- **After a ShellUI restart** ZhiThemes waits 15 s before putting the theme in again (Logs tab → "Injection after a ShellUI restart", 5–120 s). Rest mode does not restart ShellUI: the theme stays in.
- **A theme that breaks the Home:** delete (or rename) `/data/ZhiThemes/Themes/<Name>.ztheme` (the name is in `active_theme.txt`) over FTP and send the payload again. `Default` is used if it exists, else ZhiThemes starts off (*PS5 default*); a copy of the previous theme is kept in `Themes/.backup/<Name>.ztheme`.
- **Report it:** see [LOGS.md](LOGS.md).

## Files on the PS5 (`/data/ZhiThemes/`)

| Path | What |
|---|---|
| `Themes/<Name>.ztheme` | one theme (values only); you can keep several |
| `Themes/<Name>/wallpapers/` | that theme's wallpapers, overlays, Settings backgrounds, `.mp4` videos |
| `Themes/<Name>/icons/` | that theme's uploaded icons (top bar, L1/R1, footer, decorations) |
| `Themes/<Name>/fonts/` | that theme's uploaded fonts |
| `Install/` | copy a `.ztheme` here (FTP, USB) to install it when ZhiThemes starts, or from Options > 🎨 ZhiThemes; see [THEMES.md](THEMES.md) |
| `no_theme` | made by *PS5 default* (Options > 🎨 ZhiThemes): ZhiThemes is off until you pick a theme |
| `Themes/.backup/` | a copy of each theme from its last start |
| `active_theme.txt` | the name of the theme in use |
| `Assets/folders/` | uploaded folder icons |
| `Assets/customtile/` | your cover per game: `<titleId>_1x1_<n>.png` (square) / `<titleId>_2x3_<n>.png` (vertical) |
| `Assets/custombg/` | your background per game: `<titleId>_16x9_<n>.png` |
| `Assets/avatars/` | avatar pictures |
| `Assets/particles/` | textures of the built-in particle styles, written by ZhiThemes at start |
| `Assets/cache/` | made by ZhiThemes (folder mosaics, tall icons); safe to delete |
| `Logs/` | logs (see [LOGS.md](LOGS.md)) |
| `steamgrid.key` | your SteamGridDB API key, if you entered one (never put in a theme) |
| `watcher.pid` | the running payload's process id |

Everything in `Assets/` is yours and the same in every theme. Deleting a theme in the editor deletes its `.ztheme` and its folder. A file two themes share (same bytes) is stored once on the PS5. Files from older versions are moved here automatically on the first start.

## The editor

The tabs are in the bar on the left, each named after the part of the PS5 screen it changes:

| Tab | What it changes |
|---|---|
| Screen | a picture of the Home: drag elements, click one to edit all its options |
| Background | wallpaper (picture or video), darkening, overlay picture, particles, system background colour |
| Games row | tile size, shape and position, the focus frame, tile names, game logo, what to hide in the row |
| Top bar | Games/Media and extra tabs, top icons, clock, user name and avatar |
| Game page | the game hub: title, buttons, trophies, fake trophies, play info, sections to hide |
| Folders | make game folders (drag games into them) |
| Pictures | custom covers, backgrounds and logos per game (upload or SteamGridDB) |
| Text & fonts | system font, text shadows, button and download bar colours |
| Settings & Trophies | the system screens and the Options menu |
| Extras | footer, free boxes, decoration icons, animations |
| Experimental | things still being tested, debug panel |
| Tools | Logs (firmware, debug mode, logs), Code (the theme file as text), About |

Each tab starts with a small drawing of the Home with the part it changes lit up; the number on a tab is how many of its fields you changed. The **Advanced** switch (top of the bar) adds the less used fields to every tab and module, marked *Advanced*; without it, the Screen tab keeps them under *More options*.

The header shows the PS5 firmware and the ZhiThemes version. **Reset all** puts every field back to the PS5 stock value.
