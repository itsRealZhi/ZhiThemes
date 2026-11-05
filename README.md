# ZhiThemes

**Custom themes for the PS5 Home screen**, made by **Zhi**.

ZhiThemes changes how the PS5 Home looks: tile size and shape (square or vertical 2:3 covers), the focus frame, fonts, colours, wallpapers (images or `.mp4` video), game folders, custom covers and backgrounds per game, the Settings and Trophies screens, and more. You change everything from a web editor on your PC or phone. No system file is changed: everything happens in memory, and a reboot puts the stock PS5 back.

> **Alpha** (0.1.x). Tested on firmware **9.60**. Other firmwares are untested. If you try one, please send a debug log (see [docs/LOGS.md](docs/LOGS.md)).

## What you need

- A PS5 with a working jailbreak that runs ELF payloads (kstuff and an ELF loader such as elfldr).
- A PC or phone on the same network as the PS5, with a web browser.
- Optional: FTP access to the PS5, to copy files or read the logs without the editor.

## Quick start

1. Download `ZhiThemes.elf` from [Releases](../../releases).
2. Send it to your PS5's ELF loader, like any other payload.
3. A notification says **"Welcome to ZhiThemes … Open <PS5-IP>:4444"**.
4. Open `http://<PS5-IP>:4444` in a browser on your PC or phone and start editing. **Apply** saves and reloads the Home.

The full guide is in [docs/INSTALL.md](docs/INSTALL.md).

## Sharing themes

**Download** in the editor saves your theme as a single `.ztheme` file. It includes your settings plus the wallpaper (or video), overlay, icons and fonts the theme uses. Someone else adds it with **Install**: it becomes a theme of its own on their PS5, and the **Theme** button switches between themes. Folders, custom tiles and per-game backgrounds are never included, because each person keeps their own. See [docs/THEMES.md](docs/THEMES.md).

## Problems?

The editor's **Logs** tab has a **Debug mode** switch and the log files to download. Every log starts with the firmware and ZhiThemes version. The same files are on the PS5 in `/data/ZhiThemes/Logs/`. See [docs/LOGS.md](docs/LOGS.md).

## Documentation

| | |
|---|---|
| [docs/INSTALL.md](docs/INSTALL.md) | Install, update, remove, files on the PS5 |
| [docs/THEMES.md](docs/THEMES.md) | Make, save and share themes (`.ztheme`) |
| [docs/LOGS.md](docs/LOGS.md) | Logs, debug mode, reporting problems, other firmwares |
| [docs/BUILDING.md](docs/BUILDING.md) | Build `ZhiThemes.elf` from source |
| [CHANGELOG.md](CHANGELOG.md) | Versions |

## Support

ZhiThemes is free. If you like it, you can buy me a coffee on [Ko-fi](https://ko-fi.com/zhi) ☕

## Credits and license

ZhiThemes was created by **Zhi** (original project: https://github.com/itsRealZhi/ZhiThemes). It is built on [OnionHEN](https://github.com/aydencharles/onionHEN) by aydencharles and contributors (injection into ShellUI, hooking, ELF loading). See [CREDITS.md](CREDITS.md).

ZhiThemes is free software under the **GNU GPL v3** ([LICENSE](LICENSE)), with one additional term (GPL-3.0 section 7(b)): **forks and redistributions must keep the author attribution "ZhiThemes by Zhi"** in the payload's welcome message, the editor, the logs and the documentation. See [NOTICE](NOTICE).

Not affiliated with or endorsed by Sony Interactive Entertainment. "PlayStation" and "PS5" are trademarks of their owners. Use at your own risk.
