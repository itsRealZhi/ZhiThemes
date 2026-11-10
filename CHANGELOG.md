# Changelog

Versions go up (0.1.x, 0.2.0…) until 1.0.0.

## 0.1.0-alpha — first release

Alpha: made on firmware **9.60**; also seen working on **13.60** by a tester. Other firmwares are untested; reports are welcome (see [docs/LOGS.md](docs/LOGS.md)).

### Home screen
- **Tiles:** square 1:1 or vertical 2:3 covers; the focused tile can be vertical 2:3 or *Steam horizontal* 92:43 (like the Steam Deck). Size, gap, corners, shadow, reflection, how many games the row shows.
- **Row effects:** tiles fade out near the left and right edges of the screen (adjustable length and lowest opacity); the focus can walk along the row like in an open folder, with the row only sliding in the middle; tiles leaving on the left can disappear and slide away, fully gone at a chosen x (e.g. the edge of a side bar).
- **Custom pictures per game:** your own tiles in every format, game backgrounds and game logos, uploaded or found with the built-in **SteamGridDB** search (you need your own free API key). A cropper for every format.
- **Animated tiles and backgrounds:** animated WebP / APNG / MP4 / WebM become a still picture plus an MP4 the PS5 plays on the focused tile, with optional in-between frames for smooth motion. The game's own music keeps playing.
- **Focus frame:** colours, glow, rainbow, shape.
- **Game names:** the PS5 game title, the tile title, or a *fake title* placed anywhere on the screen; game logos instead of names.
- **Folders:** game folders on the Home, shown as a mosaic, stacked covers or icons, with their own background; colour and opacity per folder or one default for all.
- **Extra tabs** next to Games / Media: *Recently played*, *Favourites* (optionally left of Games), *Never played*; add or remove favourites from the Options menu (one list for the whole console, whatever theme is in use). An empty tab shows an empty-box picture and says how to fill it; coming back from a game always lands on Games.
- **Top bar:** tabs aligned left, centre or right inside a box (centre grows to both sides), L1 / R1 icons next to them, controller buttons in any colour; the top bar background always sits over the free background boxes, and the boxes appear together with the bar. The tabs can show **icons instead of names** (a system icon or your own picture per tab), in the tab colour.
- **Game / App Library tile:** its games can stay hidden under the row until you open it.
- **Clean background:** one switch shows only the PS5's own dark background with its light at the top everywhere (Home, game pages, folders, games without art, Settings), over any wallpaper, game art or custom background.
- **Wallpaper:** a picture or an `.mp4` video, with overlay, vignette, dark edges and 23 particle styles (snow, sakura, rain, starfield, digital rain…).
- **Extras:** own clock and date, play info ("Last played 3 days ago"), fake trophies, animated avatar (GIF), animations (tab change, folders, names, button bounce), debug panel (fps, memory, temperatures).
- **Fonts:** your own system font without a restart; colours and sizes of the texts.

### Other screens
- Game hub, Game / App Library, Settings and Trophies follow the theme: background colour, your picture or video (shared with the Home, so it keeps playing between screens; the Game / App Library keeps its own backgrounds), list and tab shapes.

### Editor
- Web editor on `http://<PS5-IP>:4444` from a PC or phone: a live **Visual** view of the Home, tabs named after the part of the screen they change, one colour picker everywhere, an *Advanced* switch for the less used options.
- **Several themes on one PS5:** make, rename, switch and delete themes.
- **Share themes:** *Download* saves one `.ztheme` file with the settings and the wallpaper / video, icons and fonts it uses; *Install* adds someone else's. Your folders and custom pictures are never included.
- **Progress bars** with % and speed for every upload to the PS5 and every SteamGridDB download; SteamGridDB pictures are streamed through the PS5 and loaded only once.

### Installing and switching themes on the PS5
- **🎨 ZhiThemes** in every tile's Options menu: switch theme, turn ZhiThemes off (*PS5 default*), install themes from a USB drive.
- Copy a `.ztheme` to `/data/ZhiThemes/Install/` and it is installed when ZhiThemes starts.

### Safety
- Nothing is written to system files: everything runs in memory, and a reboot gives back the stock PS5.
- With no theme (first start, or the theme file deleted) ZhiThemes starts off and touches nothing, so firmwares that were not tested start with the stock look.
- A theme file can only carry values (numbers, true/false, text); a file with code is ignored.
- **Safe mode:** if the Home crashes twice within 3 minutes the theme turns itself off; a USB drive with an empty `ZhiThemes/no_theme` file keeps it off while plugged in.
- **Logs tab:** debug mode, logs with firmware, version and timestamps, also saved in `/data/ZhiThemes/Logs/`.
- **Not together with other HENs that load into the Home:** with etaHEN, OnionHEN, AniketosHEN (or Yoncore, kylin-core, wmdw-jwm, CheatRunner) running, ZhiThemes does not load and tells you why: two of them in the Home crash it.
- A Home that is still starting (right after a reboot or rest mode) is given time to finish before ZhiThemes loads into it.
- **Sent from a payload manager in the PS5's web browser:** ZhiThemes waits until you leave the payload manager, then loads (loading while the browser was open could crash the Home with error CE-108262-9).
- **Screen dump** (Experimental): saves the code and the screen layout of the PS5's apps to `/data/ZhiThemes/Dumps/<firmware>/`, to help make themes work on other firmwares.

### Known limits
- Made on firmware 9.60; also seen working on 13.60.
- Loading ZhiThemes many times without restarting the console can use up the Home's memory; from the 4th load in a row the welcome message asks you to restart the PS5.
- Does not run together with etaHEN, OnionHEN, AniketosHEN or other HENs that load into the Home, for now (use kstuff + an ELF loader).
- No live blur behind panels; the text colour of Settings rows cannot be changed.
