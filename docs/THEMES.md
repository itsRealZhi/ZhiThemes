# Making and sharing themes

## Make one

Open the editor (`http://<PS5-IP>:4444`), change fields and press **Apply**. Give your theme a name in **Games row → Theme name** (or the name box of the Screen tab) (`themeName`). That name is shown when ZhiThemes starts and is used as the file name when you download it.

Upload buttons next to the fields add your own files:

- **Wallpaper**: `.png`/`.jpg` 1920×1080, or an `.mp4` video (plays behind the Home, with optional sound).
- **Overlay** and **Settings background**: `.png`/`.jpg` 1920×1080.
- **Top bar / decoration / L1-R1 icons**: square `.png` with transparency (for example 96×96).
- **Fonts** (Text & fonts → *System font (everywhere)*): `.otf`/`.ttf`, used for every text of the PS5 menus. Bold and italic texts keep the PS5 bold and italic; each text's *font style* is Normal (your font), Bold, Italic or Bold italic.

## Game names

There are four names on the Home:

- **Game title**: the PS5's own game name under the row. It belongs to the game hub, so it can only move a little.
- **Tile title**: the PS5/PS4 symbol and the name next to the focused tile. `hideTileName` hides the name text and `hidePS5Icon` hides the symbol, separately. When a part is hidden, it comes back next to the small tile once you go down to the game hub (when the symbol is hidden alone, it stays hidden there).
- **Fake title**: the focused game's name drawn by ZhiThemes, anywhere on the screen (`fakeTitleX`/`fakeTitleY`). It has its own size, colour, font, alignment, width, wrap or scroll, background and shadow. On a folder it shows the folder name, and inside an open folder the highlighted game.
- **Folder name**: when the fake title is off, a selected folder shows its name at `folderTitleX`/`folderTitleY`, because a folder has no hub page.

`titleMode` picks the name shown above the row, never two at once:

| `titleMode` | On the Home | In the game hub |
| --- | --- | --- |
| `'game'` | game title | game title |
| `'fake'` | fake title | game title (the fake title goes) |
| `'none'` | nothing | game title |

If every part of the game hub is hidden, down does not go to the hub and nothing changes.

Older themes used `nameCopy` ("Big name"), `homeTitle` and `hideTitle`. They still work, and the editor converts them to the new fields when it opens them (press **Apply** to keep the conversion).

## Avatar and the system background

- **Avatar** (Top bar → Avatar): "Make avatar…" turns a picture, GIF or video into your profile picture. Place the circle (drag, mouse wheel to zoom).
  - **GIF:** sent as it is (up to 8 MB) together with the circle; the PS5 cuts it out and fits it (256 px, up to 120 frames) in the background. Until then, a few seconds, the avatar shows still. A GIF put in `Assets/avatars/` by hand is fitted the same way (the middle square).
  - **Video / animated WebP:** pick the part (Start, Length) and the frames per second; the part plays in a loop in the circle as it will look, with a time line (blue = in the avatar, red = cut by the 120 frames; click it to move the start). Made at 256 px.
  - The PS5 itself plays an animated avatar up to 300×300 and 150 frames; a bigger one would freeze it, so ZhiThemes never gives it one. The avatar is yours: it is not put in a `.ztheme` pack.
- **Behind Settings and Trophies** (Screen → Settings / Trophies → Background): your own picture or `.mp4`, or "Use the wallpaper" for the Home wallpaper. With "Use the wallpaper" the Home and the system screens share one video (or picture) that keeps playing between them. A video the PS5 player refuses shows nothing: use H.264, 1080p is the safest.
- **Background colour** (Background → System background colour): base colour and glow of the system's own background, also behind the Home when no game art is shown.

## Extra tabs, favourites and play info

- **Extra tabs** (Top bar → Extra tabs): *Recently played*, *Favourites* and *Never played* after Games / Media (*Favourites* on the left of Games with "Favourites first"). Each shows your games filtered by the console's "last played" date; L1 / R1 go through them. The PS5 does not store the total play time where the theme can read it.
- **Favourites:** Options menu of a game or Media app → "Add to favourites". The list is kept in the `favorites` field of your theme (title ids).
- **Selected tab panel** (Tabs element): a pill behind the selected tab. "Same weight for all tabs" keeps the bar still when the tab changes (the PS5 draws the selected tab bold, the others normal).
- **Play info** (Game page → Play info, or the Screen tab): "Never played" / "Last played …" for the focused game.

## Animations

Extras → Animations (all on by default except *Button bounce*, all native-driver animations, so the row keeps its speed; "Animation speed" scales them too):

- **Tab change animation:** the row comes in from the side of the new tab; with the selected tab panel on, the panel moves between tabs like a worm. "Tab change duration" (ms) and "Tab change distance" (px, 0 = only fade).
- **Favourites message:** "Added to favourites" / "Removed from favourites" over the focused tile for 3 s.
- **Folder opening animation:** the folder panel fades in and its games rise in one after the other.
- **Name change animation:** fake title, folder name and the highlighted game of an open folder; style Slide in / Fade / Rise and duration.
- **Play info / trophies animation:** they fade and rise in when the game changes.
- **Folder messages:** a 3 s message for every folder change from the Options menu.
- **Folder closing animation:** the games drop out and the panel fades away.
- **Button bounce:** the footer, tab group and icon buttons bounce when that button does something (X on a folder, Options, L1 / R1).
- **Fake title glow:** a light pass over the fake title every few seconds ("Glow colour", "Glow every"); not with the scrolling name.

## Focused tile shape and custom pictures

- **Focused tile** (Game row, `focusShape`): the row stays square 1:1 or vertical 2:3 (`tileVertical`), the focused tile can take another shape: *as the row*, *Vertical 2:3* (square row only) or *Steam horizontal 92:43*. It keeps the focused height and its width changes; the next tiles and the game name move with it. Every focused tile takes it: the game's own picture of that shape if it has one, else its picture cut to the shape.
- **Folders on the Steam tile** (`foldersHorizontal`): *Covers in a row* (2:3 covers), *Square icons in a row*, *Covers overlapping* or *Square icons (2 rows)*, up to 7 games. The vertical 2:3 focused tile follows `foldersVertical`.
- **Pictures tab:** click a game to see its four formats (Square, Vertical, Steam, Background). Each one: search SteamGridDB, click a picture, Download. For a background the full picture is downloaded first, you choose the 16:9 part with the slider, then it is saved as 1920×1080.
- Tile pictures are always saved as PNG (the folder pictures on the PS5 read PNG only); older JPEG pictures are converted when the Pictures tab opens.

## Game logo

- **Pictures** (Pictures tab, format *Logo*): upload a PNG or download a SteamGridDB logo; transparent margins are cut. Saved on the PS5 as `customtile/<titleId>_logo_<n>.png`; the one in use is `ID/logo:n` in `customTileChoice` (0 = no logo, not listed = the first).
- **Options** (Games row → Game logo, or the *Game logo* element in the Screen tab): `logoOn`, the box `logoX` / `logoY` / `logoWidth` / `logoHeight` (the logo fits inside keeping its shape), `logoAlign` (left / center / right), `logoVAlign` (top / center / bottom), `logoOpacity`, `logoHidesTitle` (off by default; on: with the fake title on, a game with a logo shows only the logo).

## Animated pictures

- **Tiles and backgrounds** (Pictures tab): tick *Animated only* next to Search for SteamGridDB's animated pictures, or upload an animated WebP / APNG or a video (MP4, WebM, up to 15 s). A picture of another shape opens the cropper. The PS5 gets `<titleId>_<format>_<n>.png` (still, first frame) and `<titleId>_<format>_<n>.mp4` next to it (customtile for tiles, custombg for backgrounds). Use Chrome or Edge (they make the MP4) and keep the tab in front while the video is made.
- **On the Home** (`tileAnimOn`, on by default): the focused tile plays its video (the highlighted game in an open folder too); a game background with a video plays behind the Home while that game is focused, unless your wallpaper is on.
- **Experimental tab:** `tileAnimAll` makes every tile with a video move; `tileAnimAllMax` (6) is how many play at once (the focused one always).
- **Logos** are still pictures: an animated logo gives its first frame (the PS5 has no video with transparency).
- **Smooth motion:** for an animated WebP / APNG slower than about 22 fps, the cropper box asks *Make frames in between*: *Yes — follow the movement* (frames made in between along the movement, 30 fps MP4), *Yes — cross-fade only*, or *No*. It is done in the browser (WebGL); where something cannot be followed (a cut, the jump at the end of the loop) it cross-fades.

## Particles

- `particlesOn` draws particles over the Home background. With `particlesStyle` empty they are round dots (or your picture, `particlesImage`) rising from below: `particlesSize`, `particlesColor`, `particlesOpacity`.
- `particlesStyle` picks one of 23 built-in styles (from AniketosHEN): `snowfall`, `sakura`, `autumn_leaves`, `fireflies`, `rain`, `bokeh`, `golden_dust`, `embers`, `aurora`, `magic_sparkles`, `starfield`, `meteor_shower`, `warp`, `nebula`, `digital_rain`, `ps_symbols`, `confetti`, `bubbles`, `hearts`, `neon_wave`, `xmas_lights`, `xmas_eve`, `xmas_ornaments`. In the editor: *Particle style*.
- With a style, `particlesCount` (1-120) and `particlesSpeed` still apply; `particlesScale` (0.25-3) sizes its particles and `particlesHue` (0-359) turns its colours round the colour wheel. Pictures that have colours of their own (bulbs, baubles, PlayStation symbols, bubbles) keep them.

## Debug panel (Experimental)

- `debugOverlay` shows a box on the Home with live numbers; `debugX` / `debugY` place it (or drag *Debug panel* in the Screen tab), `debugFontSize`, `debugColor`, `debugBgOpacity` (0 = no box) and `debugRow` (all in one line) set its look.
- `debugItems` is what it shows, in this order: `fps` (the Home's own frames per second), `ram`, `vram` (console memory), `shell` (the Home's free memory), `mono`, `cpu`, `temp` (CPU and SoC), `fan`, `up` (console and theme uptime), `loads` (ZhiThemes loads into this Home since it started), `videos` (tile videos playing), `errors` (theme script errors).
- The numbers come about once a second, only while the panel is on and the Home is in front.

## Share it: the `.ztheme` pack

**Download** saves one file, `<Theme name>.ztheme`. It is a ZIP:

```
theme.ztheme                 the settings
zhitheme.json                name, ZhiThemes version, firmware, file list
assets/wallpapers/…          wallpaper / video, overlay, Settings background
assets/icons/…               the icons the theme uses
assets/fonts/…               the fonts you uploaded (system fonts are on every PS5)
```

**Install** on another PS5 (or yours) asks for a name, makes it a theme of its own (`Themes/<Name>.ztheme`, its files in `Themes/<Name>/`) and uses it. If that name is already there you can replace it (its old files go) or keep both.

**Without the editor:** copy the `.ztheme` (pack or plain text) to `/data/ZhiThemes/Install/` (FTP, or from a USB drive with a file manager) and send ZhiThemes. When it starts it installs every file there and uses the last one, then deletes the file from `Install/`. The name comes from the pack (else the file name); **a theme with the same name is replaced**. The start message says *Installing the new theme…* and a second message names the theme now in use. A file that is not a theme is renamed `<file>.failed` and left there.

**From the Home (Options > 🎨 ZhiThemes):** press Options on any tile; the first item, **🎨 ZhiThemes**, opens a list with:

- your themes: pick one to use it (the one in use says *(in use)*);
- **PS5 default (ZhiThemes off):** the Home, game pages, Settings and Trophies go back to the stock look; only this menu item stays, so you can pick a theme again. Picking a theme, installing one, or *Use* / *Apply* in the editor turns ZhiThemes back on;
- **Install from USB:** the `.ztheme` / `.zip` files in `ZhiThemes/`, `ZhiThemes/Themes/` or `Themes/` on a USB drive, and the `.ztheme` files at its root. The theme is installed and used; the file stays on the drive. After that it shows *(installed)* (picking it only uses that theme) and *Update from USB* when the file on the drive changes (installed over the old one);
- **Install from the Install folder:** files copied to `/data/ZhiThemes/Install/` while ZhiThemes runs (deleted once installed).

**Safe mode:** an empty file `ZhiThemes/no_theme` (or `no_theme.txt`) on a USB drive keeps ZhiThemes off while the drive is plugged in, for when a theme breaks the Home. Take the drive out and pick a theme (or send ZhiThemes again).

**Theme** (top bar) lists the themes on the PS5: use, rename or delete one (with its files), or make a new one as a copy of the current theme or with the stock look. The editor always edits the theme in use; switching reloads the Home. The name of the theme in use is shown in the middle of the top bar; it changes only with **Rename** (it is also the name of the Download file and the one shown when ZhiThemes starts). Each theme shows how many files it uses and their size; **Clean** deletes the files in its folder that it does not use (other themes keep their own copy). **Download** packs only the pictures and videos of fields that are switched on.

**Never in a pack**, and left untouched when one is installed:

- your **folders** (`folders`, `foldersIcon`),
- your **custom tiles and backgrounds** and the choice per game (`customtile/`, `custombg/`, `customTileChoice`, `customBgChoice`),
- your SteamGridDB key, and debug mode.

Everyone keeps their own games, folders and covers.

Notes:

- Each theme has its own files, so two themes can each have a `wallpaper.png`. A file that is the same in two themes is stored once.
- Big `.mp4` wallpapers make big packs.
- Only share fonts and images you are allowed to share.
- An old `.ztheme` that is plain text (settings only) still works with Install.

## Safety

A `.ztheme` can only carry **values**: numbers, `true`/`false` and `'text'`. ZhiThemes reads the `var THEME = { … }` block of the file and ignores anything else. A file that is not a theme, or a value that looks like code, is ignored and the stock value is used (the log says how many were ignored). Installing a theme from someone else can therefore not run code on your PS5.

## Theme file format (for the curious)

`theme.ztheme` is JavaScript-like text with one field per line:

```js
var THEME = {
    themeName: 'My theme',
    /* --- row --- */
    tileSize: 150,          /* side of the normal tiles (106) */
    tileVertical: true,     /* vertical 2:3 tiles (false) */
    wallpaper: 'city.mp4',
    ...
};
```

Fields that are missing keep their stock value, so a theme made with an older version keeps working after updates.
