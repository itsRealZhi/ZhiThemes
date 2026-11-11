# Logs, debug mode and reporting problems

## Where the logs are

In the editor: the **Logs** tab. On the PS5: **`/data/ZhiThemes/Logs/`** (over FTP or USB, for when the editor does not open).

| File | What |
|---|---|
| `zhithemes.log` | this session: the theme module and the theme |
| `previous.log` | the session before: **look here after a crash** |
| `payload.log` | `ZhiThemes.elf` itself: injection, ShellUI restarts, safe mode |
| `boot.log` | one line per start-up step of the module; if ShellUI crashes before `zhithemes.log` starts, its last line shows where |
| `debug-<date>.log` | saved when you stop debug mode (the 2 newest are kept) |
| `crash-<date>.log` | a session that did not close while debug mode was on (crash, rest mode or power off; the 2 newest are kept) |

With debug mode on, every colour and shape token of this firmware is also written to **`/data/ZhiThemes/Dumps/<firmware>/`** (`tokens_color.txt`, `tokens_shape.txt`), next to the screen dump. Get them over FTP, or with Options > 🎨 ZhiThemes > Tools (copy the screen dump to a USB drive).

Every session starts with a header like this (write your PS5 model in your report):

```
2026-10-30 15:40:01.120 +0.000  ==== ZhiThemes 0.1.0-alpha (build 291, Nov 04 2026 18:20:02) by Zhi ====
2026-10-30 15:40:01.121 +0.001  PS5: firmware 9.60 (0x09600004) | ShellUI pid 97
2026-10-30 15:40:01.121 +0.001  debug mode: off | times are UTC, +seconds since this start
```

Every line starts with the UTC date and time and the seconds since ZhiThemes started.

## Debug mode

1. In the editor open **Logs** and turn on **Debug mode**. Tick "also map Settings and Trophies" only if the problem is in those screens (it makes them slow).
2. On the PS5, do whatever goes wrong: open the Home, a game hub, Settings, a folder…
3. Turn **Debug mode** off. The session is saved as `debug-<date>.log` and the editor offers to download it.

With debug mode on, the log also gets the controller keys the theme sees, the position of every part of the screen, the folders, the font files of this firmware and (with the box ticked) the structure of Settings and Trophies. Debug mode stays on across restarts until you turn it off. It is never saved in a theme.

If the PS5 or the theme crashes while debug mode is on, the next start keeps that session as `crash-<date>.log`.

## Reporting a problem

Open a GitHub issue with:

- what you did and what you saw (a photo or capture helps),
- the `debug-*.log` or `crash-*.log` (or `previous.log` + `payload.log`),
- your theme (`Themes/<Name>.ztheme`) if the problem depends on the theme.

The logs may contain your PSN user name and the names of your games; edit them out if you want.

## Other firmwares

ZhiThemes was made and tested on **9.60**, and is confirmed working on **13.60**. It looks for the parts of the Home by their shape rather than by fixed numbers, and checks the parts it changes natively (for example the focus frame) before touching them. On another firmware the usual result is that **some options do nothing**, not a crash. But other firmwares have not been tested.

To help test a firmware:

1. Turn on debug mode with "also map Settings and Trophies" ticked.
2. Visit the Home, a game hub, the Game Library, Settings and Trophies.
3. Turn debug mode off and send the `debug-*.log`, plus `tokens_color.txt` and `tokens_shape.txt` from `Dumps/<firmware>/`, in an issue titled `Firmware X.XX report`.

Useful lines in a log:

- `state: hooked=true done={…} errors=0`: what the theme applied in each app (`home`, `hub`, `library`, `settings`, `trophy`); `errors` above 0 means something failed.
- `focus: fields … -> different, hook stopped`: the focus frame of this firmware is different, so frame thickness/gap are off.
- `notify:`: messages ZhiThemes showed on screen.
