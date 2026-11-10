/*
 * theme.js — HomeUI theme (PS5 9.60), run by ZhiThemes before the Home.
 *
 * How to use: in the web editor (http://PS5-IP:4444) change the values in
 * THEME and press Apply; or copy this file by FTP to
 * /data/ZhiThemes/theme.js and reload the Home.
 * Units: pixels of a 1920x1080 screen. Stock values in parentheses.
 * "THEME ..." messages show up in /data/ZhiThemes/Logs/zhithemes.log.
 */
(function () {
  var THEME = {
    themeName: '',           /* name of this theme, shown when ZhiThemes starts; empty = the file name ('') */
    /* --- row --- */
    tileSize: 150,           /* side of the normal tiles (106) */
    focusSize: 238,          /* side of the focused tile (168) */
    tileCorners: 22,         /* corner radius of the tiles (16) */
    rowOffsetY: 130,         /* how far the tile row moves down (0) */
    focusX: 0,               /* move only the focused tile, + = right (0) */
    focusY: 0,               /* move only the focused tile, + = down (0) */
    fixDetails: true,        /* keep the details view (arrow down) aligned */
    hubOffset: 0,            /* hub/library page position: − = lower (down to the bottom of the screen), + = higher (0) */
    hideRowInLibrary: true,  /* hide the row (tiles + name) at the top while the Game/App Library is open; always on with vertical tiles (false) */
    libraryPeekDown: 0,      /* px the Game/Apps Library page goes down while only its tile is selected; 0 = off (0) */
    libraryHideGames: true,  /* keep the Game/App Library page (its games) out of sight until it is opened (false) */
    rowSpeed: 1,             /* row slide speed: 1 normal, 0.5 slower, 2 faster (1) */
    rowBounce: false,        /* the row bounces at the end of the slide (false) */
    rowBounceStrength: 0.65, /* bounce strength, 0 to 1 (0.65) */
    rowMaxGames: 12,         /* games (and folders) in the Games row, 1 to 12; the Store and the Game Library stay (12) */
    rowFastRepeat: true,     /* when pressing several times in a row, the row and animations use the stock speed (true) */
    rowRepeatWindow: 350,    /* ms between presses to count as "in a row"; more = more presses are fast (350) */
    rowX: 0,                 /* move the row horizontally, + = right (0) */
    rowGapAfter: 0,          /* extra space between the focused tile and the next ones, px (0) */
    rowGapBefore: 0,         /* extra space between the focused tile and the previous ones, px (0) */
    rowTileGap: 8,           /* space between the tiles of the row, px; the PS5 uses 8 (8) */
    animationSpeed: 1,       /* speed of the other Home animations: 1 normal, 0.5 slow, 2 fast (1) */
    tileEdgeFade: false,        /* tiles fade out near the left and right edges of the screen (false) */
    tileEdgeFadeLeft: 250,      /* length of the fade on the left, px; 0 = no fade on the left (250) */
    tileEdgeFadeRight: 450,     /* length of the fade on the right, px; 0 = no fade on the right (450) */
    tileEdgeFadeInset: 0,       /* px from the screen edges where a tile is already at the lowest opacity (0) */
    tileEdgeFadeMin: 0,         /* opacity of a tile at the edge, 0-1 (0) */
    tileEdgeFadeFocused: false, /* the focused tile fades too, if it is inside a fade (false) */
    rowHideLeft: false,         /* a tile that leaves the row on the left disappears (also the Store left of the 1st game) (false) */
    rowHideLeftMove: 250,       /* px it slides to the left while it disappears, e.g. off a side bar (250) */
    rowHideLeftEdge: 0,         /* screen x where the leaving tile's left edge is already gone, e.g. the right edge of a side bar (0) */
    rowWindow: false,           /* the focus walks along the row and the row only slides in the middle, like an open folder (false) */
    rowWindowStart: 1,          /* tiles the focus walks right before the row starts to slide (1) */
    rowWindowEnd: 2,            /* tiles the focus walks at the end of the row; 0 = the row slides to the last one (2) */
    /* --- tabs --- */
    tabsAlign: '',           /* tabs (with the group icons) aligned inside a box from 84 + tabsX, tabsWidth wide: 'left', 'center' (grows to both sides), 'right'; empty = stock ('') */
    tabsWidth: 1752,         /* width of that box; 1752 with tabsX 0 = the whole bar, so 'center' is the middle of the screen (1752) */
    tabsX: 0,                /* move horizontally, + = right (0) */
    tabsY: 0,                /* move vertically, + = down (0) */
    tabsSpacing: 64,         /* space between the tabs (64) */
    tabsFontSize: 0,         /* font size; 0 = stock, rounded to the size table (0) */
    tabsInactiveOpacity: 0.6,/* opacity of the tab that is not selected (0.6) */
    tabsSameWeight: true,    /* the tabs not selected in the same weight as the selected one (stock: bold / normal), so the bar does not move when the tab changes (true) */
    tabsColor: '',           /* text colour, e.g. '#2fd0e6'; empty = stock ('') */
    tabsFontStyle: '',       /* font: 'bold', 'italic', 'bold italic' or 'element font'; empty = stock ('') */
    tabsIconsOn: false,      /* icons instead of the tab names (Games, Media and the extra tabs) (false) */
    tabsIconSize: 48,        /* size of the tab icons in px (48) */
    tabsGameIcon: 'game',    /* Games tab: system icon name or an uploaded .png ('game') */
    tabsMediaIcon: 'music_and_video', /* Media tab ('music_and_video') */
    tabsRecentIcon: 'history',/* Recently played tab ('history') */
    tabsFavIcon: 'favorite', /* Favourites tab ('favorite') */
    tabsNeverIcon: 'new',    /* Never played tab ('new') */
    tabsGroup: false,        /* group: icons + background glued to the tabs, follow the text in any language (false) */
    tabsGroupLeft: 'l1',     /* group: icon on the left: button, system icon or .png; empty = none ('l1') */
    tabsGroupRight: 'r1',    /* group: icon on the right; empty = none ('r1') */
    tabsGroupIconSize: 40,   /* group: icon size in px (40) */
    tabsGroupIconGap: 16,    /* group: space between each icon and the tabs (16) */
    tabsGroupIconColor: '',  /* group: icon colour (system icons); empty = stock ('') */
    tabsGroupIconOpacity: 1, /* group: icon opacity, 0-1 (1) */
    tabsGroupBgOn: true,     /* group: show the background (true) */
    tabsGroupBg: '#000000',  /* group: background colour ('#000000') */
    tabsGroupBgOpacity: 0.5, /* group: background opacity (0.5) */
    tabsGroupHeight: 72,     /* group: height of the background (72) */
    tabsGroupPadding: 16,    /* group: space inside the background, left and right (16) */
    tabsGroupCorners: 36,    /* group: corner radius (36) */
    tabsPillOn: false,       /* a panel ("pill") behind the selected tab (false) */
    tabsPillColor: '#ffffff', /* pill: colour ('#ffffff') */
    tabsPillOpacity: 0.18,   /* pill: opacity, 0-1 (0.18) */
    tabsPillCorners: 30,     /* pill: corner radius (30) */
    tabsPillPadX: 24,        /* pill: space left and right of the name (24) */
    tabsPillPadY: 6,         /* pill: space above and below the name (6) */
    tabsPillBorderColor: '#ffffff', /* pill: colour of a thin line around it ('#ffffff') */
    tabsPillBorderWidth: 0,  /* pill: thickness of that line; 0 = none (0) */
    tabsPillTextColor: '',   /* pill: colour of the selected tab's name; empty = stock ('') */
    /* --- extra tabs --- */
    /* tabs after Games / Media with the Games titles, filtered; L1 / R1 go through them */
    tabRecentOn: false,      /* tab with the games played lately, newest first (false) */
    tabRecentName: 'Recently played', /* its name ('Recently played') */
    tabRecentMax: 12,        /* how many games it shows (12) */
    tabFavOn: false,         /* tab with your favourite games (Options menu > Add to favourites) (false) */
    tabFavName: 'Favourites', /* its name ('Favourites') */
    tabFavFirst: true,       /* the Favourites tab on the left of Games (the Home still starts on Games) (true) */
    tabNeverOn: false,       /* tab with the games never played (false) */
    tabNeverName: 'Never played', /* its name ('Never played') */
    favMenu: true,           /* Add to / Remove from favourites in the Options menu of the games (true) */
    favorites: '',           /* favourite games, title ids separated by commas (written by the Options menu) ('') */
    /* --- play info --- */
    /* a box like the Fake trophies: "Never played" or when the focused game was last played */
    playInfoOn: false,       /* show the box (false) */
    playInfoX: 172,          /* distance from the left (172) */
    playInfoY: 770,          /* distance from the top (770) */
    playInfoFontSize: 24,    /* text size (24) */
    playInfoColor: '#ffffff', /* text colour ('#ffffff') */
    playInfoBg: '#000000',   /* background colour ('#000000') */
    playInfoBgOpacity: 0.45, /* background opacity, 0 = none (0.45) */
    playInfoCorners: 16,     /* corner radius (16) */
    playInfoNever: 'Never played', /* text for a game never played ('Never played') */
    playInfoLast: 'Last played', /* text in front of when it was played ('Last played') */
    /* --- animations --- */
    /* the theme's own animations (native driver; animationSpeed also applies) */
    animTabs: true,          /* the row slides in from the side of the new tab when the tab changes, and the tab panel moves to the new tab like a worm (true) */
    animTabsMs: 280,         /* tab change: duration, ms (280) */
    animTabsSlide: 90,       /* tab change: how far the row comes from, px; 0 = only fade (90) */
    animFav: true,           /* "Added to favourites" / "Removed from favourites" over the tile for 3 s (true) */
    animFolders: true,       /* opening a folder: its panel fades in and the games rise in one after the other (true) */
    animNames: true,         /* fake title, folder name and the name of the game highlighted in a folder change with an animation (true) */
    animNamesStyle: 'slide', /* names: 'fade', 'slide' (from the right) or 'rise' (from below) ('slide') */
    animNamesMs: 240,        /* names: duration, ms (240) */
    animInfo: true,          /* play info and Home trophies fade and rise in when the game changes (true) */
    animToast: true,         /* 3 s message for folder changes: added to / removed from a folder, moved, sorted, renamed, deleted (true) */
    animFolderClose: true,   /* closing a folder: its games drop out and the panel fades away (true) */
    animButtons: false,      /* footer, tab group and icon buttons bounce when that button does something: X on a folder, Options, L1 / R1 (false) */
    animTitleGlow: true,     /* the fake title glows now and then (not with the scrolling name) (true) */
    animTitleGlowColor: '#ffffff', /* glow colour ('#ffffff') */
    animTitleGlowSec: 6,     /* seconds between two glows (6) */
    /* --- tile name --- */
    tileNameX: 0,            /* move, + = right (0) */
    tileNameY: 0,            /* move, + = down (0) */
    tileNameScale: 1,        /* enlarge the name (gets blurry; the fake title is better): 1 = normal (1) */
    hidePS5Icon: false,      /* hide the PS5/PS4 symbol next to the tile name; with the tile name hidden too both come back in the hub view (false) */
    titleMode: '',           /* game name: 'game' = the PS5 one under the row, 'fake' = the fake title (anywhere; the PS5 one only in the hub view), 'none'; empty = from the old fields ('') */
    fakeTitleX: 172,         /* fake title: distance from the left of the screen (172) */
    fakeTitleY: 330,         /* fake title: distance from the top of the screen (330) */
    nameCopyFontSize: 72,    /* fake title: font size; sharp up to the largest system size (~96), above that it is scaled (72) */
    nameCopyColor: '',       /* fake title: colour; empty = white ('') */
    nameCopyFontStyle: '',   /* font: 'bold', 'italic', 'bold italic' or 'element font'; empty = stock ('') */
    nameCopyAlign: 'left',   /* fake title: 'left', 'center' or 'right' inside the width ('left') */
    nameCopyWidth: 1200,     /* copy: width of the text box, for centring / right alignment (1200) */
    nameCopyWrap: false,     /* copy: a name longer than the width goes on in more lines instead of "…" (false) */
    nameCopyScroll: false,   /* copy: a name longer than the width scrolls sideways instead of "…" (false) */
    nameCopyScrollSpeed: 60, /* copy: scroll speed, px per second (60) */
    nameCopyBgOn: false,     /* copy: background that follows the length of the name (false) */
    nameCopyBg: '#000000',   /* copy: background colour ('#000000') */
    nameCopyBgOpacity: 0.5,  /* copy: background opacity (0.5) */
    nameCopyBgPadding: 24,   /* copy: space inside the background, left and right (24) */
    nameCopyBgPaddingV: 8,   /* copy: space inside the background, above and below (8) */
    nameCopyBgCorners: 16,   /* copy: background corner radius (16) */
    tileNameColor: '',       /* colour of the name and the label; empty = stock ('') */
    tileNameFontStyle: '',   /* font: 'bold', 'italic', 'bold italic' or 'element font'; empty = stock ('') */
    /* old name fields, only read while titleMode is empty: */
    nameCopy: false,         /* old: Big name on (false) */
    nameCopyX: 0,            /* old: Big name X, relative to the tile name (0) */
    nameCopyY: -200,         /* old: Big name Y, relative to the tile name (-200) */
    hideOriginalName: false, /* old: hide the text of the tile name (false) */
    /* --- top icons --- */
    iconsX: 0,               /* move icons and clock together, + = right (0) */
    iconsY: 0,               /* move icons and clock together, + = down (0) */
    iconSize: 0,             /* size of the top icons; 0 = stock (0) */
    /* each icon on its own (added to the group) */
    searchX: 0,              /* search icon, + = right (0) */
    searchY: 0,              /* search icon, + = down (0) */
    settingsX: 0,            /* settings icon, + = right (0) */
    settingsY: 0,            /* settings icon, + = down (0) */
    profileX: 0,             /* profile icon, + = right (0) */
    profileY: 0,             /* profile icon, + = down (0) */
    searchScale: 1,          /* size of the search icon: 1 = normal, 1.5 = bigger, 0.7 = smaller (1) */
    settingsScale: 1,        /* size of the settings icon (1) */
    profileScale: 1,         /* size of the profile icon (1) */
    hideIconLabels: false,   /* hide the name under the top icons when selected (user name, "Search"...) (false) */
    searchIcon: '',          /* another symbol for search: a system icon name (e.g. 'trophy', 'controller_key_face_cross') or an image uploaded from the editor (.png); empty = stock ('') */
    settingsIcon: '',        /* another symbol for settings, like searchIcon ('') */
    /* extra buttons in the top bar, left of search */
    powerBtnOn: false,       /* Power button in the top bar: X opens Rest mode / Restart / Turn off (false) */
    powerBtnIcon: '',        /* Power button symbol: system icon name or .png; empty = 'power' ('') */
    powerBtnX: 0,            /* Power button, + = right (0) */
    powerBtnY: 0,            /* Power button, + = down (0) */
    powerBtnScale: 1,        /* Power button size: 1 = normal, 1.5 = bigger, 0.7 = smaller (1) */
    powerBtnOpacity: 1,      /* Power button opacity (1) */
    trophyBtnOn: false,      /* Trophies button in the top bar: X opens the Trophies app (false) */
    trophyBtnIcon: '',       /* Trophies button symbol: system icon name or .png; empty = 'trophies' ('') */
    trophyBtnX: 0,           /* Trophies button, + = right (0) */
    trophyBtnY: 0,           /* Trophies button, + = down (0) */
    trophyBtnScale: 1,       /* Trophies button size: 1 = normal, 1.5 = bigger, 0.7 = smaller (1) */
    trophyBtnOpacity: 1,     /* Trophies button opacity (1) */
    padInfoOn: false,        /* controller + battery in the top bar, only to see (false) */
    padInfoIcon: '',         /* controller symbol: system icon name or .png; empty = 'ps5_wireless_controller' ('') */
    padInfoBattery: 'both',  /* battery as 'both' (icon + %), 'icon', 'text' or 'inside' (the controller icon fills up) ('both') */
    padInfoFontSize: 24,     /* battery % text size (24) */
    padInfoColor: '',        /* controller + battery colour; empty = white ('') */
    padInfoLowColor: '#ff5050', /* battery colour at 20% or less ('#ff5050') */
    padInfoX: 0,             /* controller, + = right (0) */
    padInfoY: 0,             /* controller, + = down (0) */
    padInfoSize: 0,          /* controller icon size in px; 0 = the top icons' size (0) */
    padInfoOpacity: 1,       /* controller opacity (1) */
    /* detached icons (experimental): the button leaves the top bar and is
       drawn somewhere else on the Home, where the controller reaches it the
       normal way */
    searchDetached: false,   /* search outside the top bar (false) */
    searchDetachedX: 1500,   /* detached search: distance from the left (1500) */
    searchDetachedY: 960,    /* detached search: distance from the top (960) */
    settingsDetached: false, /* settings outside the top bar (false) */
    settingsDetachedX: 1620, /* detached settings: distance from the left (1620) */
    settingsDetachedY: 960,  /* detached settings: distance from the top (960) */
    profileDetached: false,  /* profile outside the top bar (false) */
    profileDetachedX: 1740,  /* detached profile: distance from the left (1740) */
    profileDetachedY: 960,   /* detached profile: distance from the top (960) */
    iconsNav: true,          /* controller: icons moved out of the top bar are reached from the row and from each other by where they are (true) */
    /* --- clock --- */
    clockGap: 0,             /* extra space between the icons and the clock (0) */
    clockX: 0,               /* move only the clock, + = right (0) */
    clockY: 0,               /* move only the clock, + = down (0) */
    clockFontSize: 0,        /* font size; 0 = stock, rounded to the size table (0) */
    clockColor: '',          /* clock colour, e.g. '#2fd0e6'; empty = stock ('') */
    clockFontStyle: '',      /* font: 'bold', 'italic', 'bold italic' or 'element font'; empty = stock ('') */
    /* --- own clock --- */
    ownClock: false,         /* own clock with seconds / date / 12-24 h (false) */
    ownClockX: 1560,         /* distance from the left of its box (1560) */
    ownClockY: 30,           /* distance from the top (30) */
    ownClockWidth: 280,      /* width of its box (280) */
    ownClockAlign: 'right',  /* 'left', 'center', 'right' ('right') */
    ownClockFontSize: 31,    /* time: font size, rounded to the size table (31) */
    ownClockColor: '#ffffff',/* time: colour ('#ffffff') */
    ownClockFontStyle: '',   /* time: 'bold', 'italic', 'bold italic' or 'element font' ('') */
    ownClock24h: true,       /* 24 h; false = 12 h with AM/PM (true) */
    ownClockSeconds: false,  /* show the seconds (false) */
    ownClockDate: false,     /* show the date under the time (false) */
    ownClockDateFormat: 'ddd d MMM', /* date: ddd/dddd = weekday, d/dd = day, MMM/MMMM/MM = month, yyyy = year ('ddd d MMM') */
    ownClockLang: 'en',      /* names of days and months: 'en', 'pt', 'es', 'fr', 'de', 'it' ('en') */
    ownClockDateFontSize: 17,/* date: font size (17) */
    ownClockDateColor: '#ffffffb7', /* date: colour ('#ffffffb7') */
    ownClockDateGap: 0,      /* space between time and date, px (0) */
    /* --- game hub --- */
    titleX: 0,               /* move the game name/logo, + = right (0) */
    titleY: 0,               /* move the game name/logo, + = down (0) */
    titleFontSize: 0,        /* size of the game name; 0 = stock, rounded to the size table (0) */
    titleColor: '',          /* colour of the game name; empty = stock ('') */
    titleFontStyle: '',      /* font: 'bold', 'italic', 'bold italic' or 'element font'; empty = stock ('') */
    titleAlign: '',          /* game name in the hub: 'left', 'center' or 'right'; empty = stock ('') */
    buttonsX: 0,             /* move the buttons (Play, ...), + = right (0) */
    buttonsY: 0,             /* move the buttons (Play, ...), + = down (0) */
    homeTitle: false,        /* old: game name drawn by the Home (false) */
    homeTitleX: 172,         /* old: its distance from the left (172) */
    homeTitleY: 560,         /* old: its distance from the top (560) */
    homeTitleFontSize: 72,   /* old: its font size (72) */
    homeTitleColor: '',      /* old: its colour ('') */
    /* --- focus frame --- */
    hideFocus: false,        /* hide the frame and glow of the focus (false) */
    focusThickness: 0,       /* line thickness, grows outwards: 6 = normal, 12 = double; 0 = stock (0) */
    focusGap: 0,             /* distance between the frame and the tile, px; negative = inwards (0) */
    focusCorners: 0,         /* corner radius of the frame in px; 0 = stock (0) */
    focusAnimated: true,     /* with a custom colour: keep the shimmer running; false = solid colour (true) */
    focusLineColorOn: false, /* custom colour on the frame LINE (false) */
    focusLineR: 47,          /* line: red 0-255 (mockup cyan: 47) */
    focusLineG: 208,         /* line: green 0-255 (mockup cyan: 208) */
    focusLineB: 230,         /* line: blue 0-255 (mockup cyan: 230) */
    focusLineAlpha: 1,       /* line: opacity 0-1 */
    focusGlowColorOn: false, /* custom colour on the GLOW; off = glow with the line colour (false) */
    focusGlowR: 47,          /* glow: red 0-255 */
    focusGlowG: 208,         /* glow: green 0-255 */
    focusGlowB: 230,         /* glow: blue 0-255 */
    focusGlowAlpha: 0.5,     /* glow: opacity 0-1 */
    hideGlow: false,         /* remove only the glow over the frame, the line stays (false) */
    focusShimmerSpeed: 1,    /* speed of the running shimmer: 1 normal, 0.5 half, 0 stopped (1) */
    focusIntensity: 1,       /* intensity of the native frame (HDR): 1 = normal, 2 = double, up to 4 (1) */
    focusRainbow: false,     /* frame colours go round the colour wheel; the running shimmer animates it (false) */
    /* --- system colours --- */
    buttonBgColor: '',       /* background of the buttons (Play, ...); empty = stock ('') */
    buttonBgFocusColor: '',  /* background of the selected button; empty = stock ('') */
    buttonTextColor: '',     /* text of the buttons; empty = stock ('') */
    buttonTextFocusColor: '',/* text of the selected button; empty = stock ('') */
    downloadBarColor: '',    /* download bar on the tiles; empty = stock ('') */
    downloadBarBgColor: '',  /* background of the download bar; empty = stock ('') */
    /* --- options menu --- */
    menuBgColor: '',         /* background of the Options menus (every menu of the system); empty = stock #11141a ('') */
    menuBgOpacity: 1,        /* opacity of that background only, the text stays (1) */
    menuCorners: 0,          /* round corners of the Options menus, px (every menu of the system); 0 = stock, square (0) */
    menuItemCorners: 0,      /* round corners of the menu items' background, px; 0 = stock (0) */
    menuMove: false,         /* the tiles' Options menu opens at its own place (menuX/Y) instead of next to the tile (false) */
    menuX: 0,                /* menu place: + = right of the focused tile (0) */
    menuY: 0,                /* menu place: + = down, - = up (for a low row) (0) */
    menuNoDim: false,        /* the screen does not get darker behind the tiles' Options menu (false) */
    menuOffline: false,      /* tiles' Options menu without the PSN items: Check for update, Update history, Check sync status (also the PS4 saved data one), IP notices, Keep in Home (false) */
    menuHideIds: '',         /* more items to remove, comma separated: update, sync, upload, ip, keep, info, delete, manage, history, move, close, or MENU_ID_... ('') */
    folderMenu: true,        /* folder options in the Options menu: folder, game of an open folder, "Add to folder" (true) */
    /* --- hide --- */
    hideStore: false,           /* remove the PlayStation Store tile from the row (false) */
    hideAllApps: false,         /* remove the "All apps" tile (NPXS40056) from Media (false) */
    hideGallery: false,         /* remove the Media Gallery tile (NPXS40075) from the row (false) */
    hideTileName: false,        /* text of the small name next to the focused tile; comes back in the hub view (false) */
    hideTabs: false,            /* "Games / Media" (false) */
    hideSearch: false,          /* search icon (false) */
    hideSettings: false,        /* settings icon (false) */
    hideProfile: false,         /* profile icon (false) */
    hideClock: false,           /* clock (false) */
    hideTitle: false,           /* old (now titleMode 'none'): game name/logo in the hub (false) */
    hideButtons: false,         /* Play, ... buttons in the game hub; always shown in the Game Library (false) */
    hideMediaButtons: false,    /* Start button in the Media/app hub; always shown in the Game Library (false) */
    hideMore: false,            /* "..." button next to Play in the hub (false) */
    hideFriends: false,         /* "Friends who play" card in the hub (false) */
    hideHints: false,           /* R3 "Health/Ratings/..." / L3 / △ hints in the hub (false) */
    hideTrophies: false,        /* trophies card in the hub of the Home; the Game Library keeps it (false) */
    hideActivities: false,      /* "Activities" section of the hub (false) */
    hideNews: false,            /* game news in the hub (false) */
    hideRecommendations: false, /* recommendations in the hub (false) */
    hideTournaments: false,     /* tournaments in the hub (false) */
    hideCommunity: false,       /* captures and community content in the hub (false) */
    hideHubStore: false,        /* add-ons, plans and products for sale in the hub (false) */
    hideAbout: false,           /* "About" and notices in the hub (false) */
    hideHubIds: '',             /* other hub testIDs to hide, comma separated; 'x*' = starts with x ('') */
    hideByTitle: '',            /* hub sections to hide by title, e.g. 'News, Add-ons' ('') */
    hideTiles: '',              /* tiles to remove from the rows, comma separated ids (see "row ids" in the log) ('') */
    trophiesX: 0,               /* move the trophies card, + = right (0) */
    trophiesY: 0,               /* move the trophies card, + = down (0) */
    trophiesCorners: 0,         /* corner radius of the trophies card; 0 = stock (0) */
    trophiesOpacity: 1,         /* opacity of the whole trophies card, 0-1 (1) */
    /* --- fake trophies --- */
    fakeTrophies: false,        /* trophies of the focused game drawn by the Home, anywhere (also above the tiles); only to see (false) */
    fakeTrophiesX: 1380,        /* Fake trophies: distance from the left (1380) */
    fakeTrophiesY: 150,         /* Fake trophies: distance from the top (150) */
    fakeTrophiesScale: 1,       /* Fake trophies: size, 1 = normal (1) */
    fakeTrophiesFontSize: 27,   /* Fake trophies: text size (27) */
    fakeTrophiesColor: '#ffffff', /* Fake trophies: text colour ('#ffffff') */
    fakeTrophiesBg: '#000000',  /* Fake trophies: background colour ('#000000') */
    fakeTrophiesBgOpacity: 0.45, /* Fake trophies: background opacity, 0 = none (0.45) */
    fakeTrophiesCorners: 20,    /* Fake trophies: corner radius (20) */
    fakeTrophiesProgress: true, /* Fake trophies: progress % and bar (true) */
    fakeTrophiesBarColor: '#2fd0e6', /* Fake trophies: colour of the progress bar ('#2fd0e6') */
    fakeTrophiesFast: true,     /* Fake trophies: ask the hub at once and keep them per game (faster); off if it slows the console (true) */
    fakeTrophiesTotals: false,  /* Fake trophies: earned/total instead of only earned (false) */
    /* --- font --- */
    systemFont: '',             /* your font in EVERY text of the PS5 menus (Home, Settings, notifications...), no restart: a system one or uploaded from the editor; '' = stock ('') */
    systemFontBold: '',         /* bold file of systemFont (texts in bold); empty = its '-Bold' file if uploaded ('') */
    systemFontItalic: '',       /* italic file of systemFont; empty = its '-Italic' / '-MediumItalic' file if uploaded ('') */
    systemFontBoldItalic: '',   /* bold italic file of systemFont; empty = its '-BoldItalic' file if uploaded ('') */
    systemFontMissing: 'same',  /* a style with no file of yours: 'same' = your font without the style, 'system' = the system font in that style ('same') */
    elementFont: '',            /* 2nd font, for the Home texts whose FontStyle is 'element font', no restart: a system one or uploaded from the editor ('') */
    fontStyle: '',              /* font of ALL texts: 'bold', 'italic', 'bold italic' or 'element font'; empty = stock ('') */
    /* --- background --- */
    bgDim: 0,                   /* darken the whole background, 0-1 (0) */
    bgGradient: 0,              /* darken from the bottom up with a gradient, 0-1 (0) */
    bgGradientHeight: 600,      /* height of the gradient in px (600) */
    bgColor: '#000000',         /* colour of the gradient (and of the dimming, if the one below is empty) ('#000000') */
    bgDimColor: '',             /* colour of the whole-background dimming; empty = the gradient one ('') */
    bgGradientCurve: 'linear',  /* how the gradient rises: 'linear' or 'smooth' (soft start, no edge at the top) ('linear') */
    bgGradientSteps: 24,        /* strips of the gradient: more = no visible steps, 8 to 128 (24) */
    bgOverlayOn: false,         /* draw an image (PNG with transparency) over the game art, below the tiles (false) */
    bgOverlay: '',              /* overlay image, uploaded from the editor like the wallpaper ('') */
    bgOverlayOpacity: 1,        /* opacity of the overlay image, 0-1 (1) */
    bgVignette: 0,              /* dark corners and sides, 0-1 (0) */
    bgVignetteSize: 360,        /* how far the vignette reaches into the screen, px (360) */
    bgEdges: 0,                 /* darken the top and the bottom of the screen, 0-1 (0) */
    bgEdgesHeight: 260,         /* height of each edge, px (260) */
    particlesOn: false,         /* glowing particles rising over the background (false) */
    particlesCount: 40,         /* how many, 1-120 (40) */
    particlesSize: 6,           /* size of the nearest ones, px; far ones are smaller (6) */
    particlesColor: '#ffffff',  /* colour ('#ffffff') */
    particlesOpacity: 0.7,      /* brightest opacity, 0-1; with a style 0.7 = as made, lower fainter, higher brighter (0.7) */
    particlesSpeed: 1,          /* 1 normal, 0.5 slow, 2 fast (1) */
    particlesImage: '',         /* a picture (uploaded icon .png) instead of round dots ('') */
    particlesStyle: '',         /* built-in style ('' = the dots or picture above): snowfall, sakura, autumn_leaves, fireflies, rain, bokeh, golden_dust, embers, aurora, magic_sparkles, starfield, meteor_shower, warp, nebula, digital_rain, ps_symbols, confetti, bubbles, hearts, neon_wave, xmas_lights, xmas_eve, xmas_ornaments ('') */
    particlesScale: 1,          /* built-in style: size of its particles, 0.25-3 (1) */
    particlesHue: 0,            /* built-in style: turn its colours round the colour wheel, 0-359 degrees (0) */
    bgClean: false,             /* clean background: only the stock system background (light in the top left corner) everywhere; no wallpaper, game art, own backgrounds or folder backgrounds (false) */
    bgCleanTry: 2,              /* how the clean background is asked for: 2 empty uri (instant), 3 no uri + basemat None (instant), 1 a missing picture (black a few seconds after a reload), 4 transparent picture (all black) (2) */
    wallpaperOn: false,         /* use your wallpaper everywhere (Home, hubs, library); off = game art (false) */
    wallpaper: '',              /* your wallpaper, uploaded from the editor; an .mp4 plays as a video behind the Home ('') */
    wallpaperVideoSound: false, /* .mp4 wallpaper: play its sound (false) */
    wallpaperVideoVolume: 0.5,  /* .mp4 wallpaper: volume of its sound, 0-1 (0.5) */
    /* --- sounds --- */
    homeMusicOn: false,         /* Home music: your own music on the Home while the focused tile has no music of its own; the .mp4 wallpaper stays silent (false) */
    homeMusic: '',              /* the music file, uploaded from the editor (.mp3 .m4a .aac .wav .at9 .mp4) ('') */
    homeMusicGames: false,      /* the Home music also instead of the games' own music (false) */
    homeMusicVolume: 0.5,       /* video player only: volume 0-1 (0.5) */
    /* --- shadows --- */
    textShadow: 0,              /* shadow of all theme texts (dark shifted copy), px; each text can have its own below (0) */
    textShadowColor: '#000000', /* colour of the text shadow ('#000000') */
    textShadowOpacity: 0.7,     /* opacity of the text shadow (0.7) */
    nameCopyShadow: -1,         /* shadow of the game name copy, px; -1 = textShadow, 0 = none (-1) */
    userShadow: -1,             /* shadow of the user name, px; -1 = textShadow (-1) */
    footerShadow: -1,           /* shadow of the footer texts, px; -1 = textShadow (-1) */
    tileShadow: 0,              /* tile shadow: blur size in px; 0 = none (0) */
    tileShadowX: 0,             /* tile shadow offset, + = right (0) */
    tileShadowY: 8,             /* tile shadow offset, + = down (8) */
    tileShadowColor: '#000000', /* colour of the tile shadow ('#000000') */
    tileShadowOpacity: 0.6,     /* opacity of the tile shadow (0.6) */
    tileReflection: 0,          /* reflection of the tiles under the row (lake): opacity at the top, 0-1; 0 = none (0) */
    tileReflectionHeight: 0.5,  /* how much of the tile is reflected, 0.1-1 (0.5) */
    tileReflectionGap: 4,       /* space between the tile and its reflection, px (4) */
    tileReflectionSteps: 8,     /* strips of the fade: more = smoother, 2 to 24 (8) */
    tileReflectionWaves: 0,     /* lake ripples: sideways movement in px; 0 = still (0) */
    tileReflectionWaveSpeed: 3, /* seconds per ripple (3) */
    tileReflectionFlip: 'scaleY', /* how the image is turned upside down: 'scaleY', 'rotateX' or 'rotate' ('scaleY') */
    /* --- user --- */
    user: false,                /* show the user name (false) */
    userX: 1500,                /* distance from the left (1500) */
    userY: 1000,                /* distance from the top (1000) */
    userFontSize: 27,           /* font size (27) */
    userColor: '',              /* name colour; empty = white ('') */
    userFontStyle: '',          /* font: 'bold', 'italic', 'bold italic' or 'element font'; empty = stock ('') */
    userDot: true,              /* status dot next to the name (true) */
    userDotColor: '#3ad04a',    /* colour of the dot when online ('#3ad04a') */
    userAlign: 'left',          /* alignment of the name in its box: 'left', 'center', 'right' ('left') */
    userWidth: 400,             /* width of the name box, from userX (400) */
    /* --- avatar --- */
    avatarOn: false,            /* your own profile picture wherever the system shows it; .gif/.webp play animated (false) */
    avatar: '',                 /* that picture, made with the editor's avatar maker or any file of Assets/avatars; a big GIF is fitted on the PS5 (256 px, 120 frames) and shown still meanwhile ('') */
    avatarCrop: '',             /* the square of a GIF chosen in the avatar maker, 'x,y,side' in its pixels; the PS5 cuts it out ('' = the middle) ('') */
    /* --- logs --- */
    measureScreen: true,        /* the console tells the editor where each element is, for the Visual tab (true) */
    /* --- bars --- */
    topBarOpacity: 1,           /* opacity of the tabs, icons and clock (1) */
    topBarBgOn: false,          /* show a background behind the top bar (false) */
    topBarBg: '#000000',        /* colour of the top bar background ('#000000') */
    topBarBgOpacity: 0.5,       /* opacity of that background (0.5) */
    topBarBgX: 0,               /* top bar background: distance from the left (0) */
    topBarBgY: 0,               /* top bar background: distance from the top (0) */
    topBarBgWidth: 1920,        /* top bar background: width (1920) */
    topBarBgHeight: 126,        /* top bar background: height (126) */
    topBarBgCorners: 0,         /* top bar background: corner radius (0) */
    footer: false,              /* show the footer (false) */
    footerText1: 'Start',       /* 1st text (empty = not shown) */
    footerText2: 'Options',     /* 2nd text (empty = not shown) */
    footerText3: 'Apps',        /* 3rd text (empty = not shown) */
    footerIcon1: '',            /* button before the 1st text: 'x', 'circle', 'square', 'triangle', 'r1', 'r2', 'l1', 'l2', 'options', 'ps'... or 'U+F8F9' ('') */
    footerIcon2: '',            /* symbol before the 2nd text, e.g. '≡' ('') */
    footerIcon3: '',            /* symbol before the 3rd text, e.g. '▦' ('') */
    footerIconFont: '',         /* font of the 'U+XXXX' symbols, e.g. 'PS4Icon' ('') */
    footerIconSize: 40,         /* size of the controller buttons in px (40) */
    footerIconColor: '',        /* colour of the controller buttons; empty = the PS5 one ('') */
    footerSpacing: 64,          /* space between the texts */
    footerX: 96,                /* distance from the left */
    footerY: 990,               /* distance from the top of the screen */
    footerFontSize: 0,          /* font size; 0 = stock text size */
    footerColor: '#ffffff',     /* text colour */
    footerFontStyle: '',        /* font: 'bold', 'italic', 'bold italic' or 'element font'; empty = stock ('') */
    footerOpacity: 0.8,         /* text opacity */
    footerAlign: 'left',        /* footer texts: 'left', 'center' or 'right' inside the width ('left') */
    footerWidth: 1728,          /* footer width, for centring / right alignment (1728) */
    footerBgOn: false,          /* show a background behind the footer (false) */
    footerBg: '#000000',        /* colour of the footer background ('#000000') */
    footerBgOpacity: 0.5,       /* opacity of that background (0.5) */
    footerBgX: 64,              /* footer background: distance from the left (64) */
    footerBgY: 970,             /* footer background: distance from the top (970) */
    footerBgWidth: 600,         /* footer background: width (600) */
    footerBgHeight: 80,         /* footer background: height (80) */
    footerBgCorners: 40,        /* footer background: corner radius (40) */
    /* free background boxes (behind descriptions, names...) */
    box1On: false,              /* box 1 (false) */
    box1: '#000000',            /* box 1: colour ('#000000') */
    box1Opacity: 0.5,           /* box 1: opacity (0.5) */
    box1X: 120,                 /* box 1: distance from the left (120) */
    box1Y: 600,                 /* box 1: distance from the top (600) */
    box1Width: 800,             /* box 1: width (800) */
    box1Height: 200,            /* box 1: height (200) */
    box1Corners: 24,            /* box 1: corner radius (24) */
    box2On: false,              /* box 2 (false) */
    box2: '#000000',            /* box 2: colour ('#000000') */
    box2Opacity: 0.5,           /* box 2: opacity (0.5) */
    box2X: 1000,                /* box 2: distance from the left (1000) */
    box2Y: 600,                 /* box 2: distance from the top (600) */
    box2Width: 800,             /* box 2: width (800) */
    box2Height: 200,            /* box 2: height (200) */
    box2Corners: 24,            /* box 2: corner radius (24) */
    box3On: false,              /* box 3 (false) */
    box3: '#000000',            /* box 3: colour ('#000000') */
    box3Opacity: 0.5,           /* box 3: opacity (0.5) */
    box3X: 120,                 /* box 3: distance from the left (120) */
    box3Y: 850,                 /* box 3: distance from the top (850) */
    box3Width: 800,             /* box 3: width (800) */
    box3Height: 120,            /* box 3: height (120) */
    box3Corners: 24,            /* box 3: corner radius (24) */
    /* --- decorations --- */
    /* icons only to see (not selectable): a controller button ('l1', 'r1', 'x', 'options'...),
       a system icon name or an image uploaded from the editor (.png) */
    deco1On: false,             /* icon 1 (false) */
    deco1Icon: 'l1',            /* icon 1: button, system icon or .png ('l1') */
    deco1X: 40,                  /* icon 1: distance from the left (40) */
    deco1Y: 22,                  /* icon 1: distance from the top (22) */
    deco1Size: 40,             /* icon 1: size in px (40) */
    deco1Color: '',            /* icon 1: colour (system icons); empty = stock ('') */
    deco1Opacity: 1,          /* icon 1: opacity, 0-1 (1) */
    deco2On: false,             /* icon 2 (false) */
    deco2Icon: 'r1',            /* icon 2: button, system icon or .png ('r1') */
    deco2X: 400,                 /* icon 2: distance from the left (400) */
    deco2Y: 22,                  /* icon 2: distance from the top (22) */
    deco2Size: 40,             /* icon 2: size in px (40) */
    deco2Color: '',            /* icon 2: colour (system icons); empty = stock ('') */
    deco2Opacity: 1,          /* icon 2: opacity, 0-1 (1) */
    deco3On: false,             /* icon 3 (false) */
    deco3Icon: '',              /* icon 3: button, system icon or .png ('') */
    deco3X: 1500,                /* icon 3: distance from the left (1500) */
    deco3Y: 900,                 /* icon 3: distance from the top (900) */
    deco3Size: 40,             /* icon 3: size in px (40) */
    deco3Color: '',            /* icon 3: colour (system icons); empty = stock ('') */
    deco3Opacity: 1,          /* icon 3: opacity, 0-1 (1) */
    deco4On: false,             /* icon 4 (false) */
    deco4Icon: '',              /* icon 4: button, system icon or .png ('') */
    deco4X: 1600,                /* icon 4: distance from the left (1600) */
    deco4Y: 900,                 /* icon 4: distance from the top (900) */
    deco4Size: 40,             /* icon 4: size in px (40) */
    deco4Color: '',            /* icon 4: colour (system icons); empty = stock ('') */
    deco4Opacity: 1,          /* icon 4: opacity, 0-1 (1) */
    /* --- system screens --- */
    /* Settings and Trophies (their own apps): rows as rounded "pills" over your own background */
    sysOn: false,               /* turn on the look below in Settings and Trophies (false) */
    sysTrophies: true,          /* also in the Trophies list, with its own fields below (true) */
    sysTrophyColor: '#ffffff',  /* Trophies list: background colour of each game row ('#ffffff') */
    sysTrophyOpacity: 0.08,     /* opacity of that background, 0-1; 0 = none (0.08) */
    sysTrophyCorners: 16,       /* corner radius of the game rows (16) */
    sysTrophyGap: 8,            /* space between the game rows, px (the row gets shorter) (8) */
    sysTrophyBorderColor: '#ffffff', /* colour of a thin line around each game row ('#ffffff') */
    sysTrophyBorderWidth: 0,    /* thickness of that line; 0 = none (0) */
    sysTrophyNoLine: true,      /* remove the lines between the games (the list separators) (true) */
    sysRowColor: '#ffffff',     /* background colour of each row ('#ffffff') */
    sysRowOpacity: 0.08,        /* opacity of that background, 0-1; 0 = no background (0.08) */
    sysRowCorners: 24,          /* corner radius of the rows (24) */
    sysRowGap: 0,               /* space between the Settings rows, px (0) */
    sysRowBorderColor: '#ffffff', /* colour of a thin line around each row ('#ffffff') */
    sysRowBorderWidth: 0,       /* thickness of that line; 0 = none (0) */
    sysNoSeparators: true,      /* remove the lines between the rows (true) */
    sysListX: 0,                /* move the Settings list, + = right (0) */
    sysListY: 0,                /* move the Settings list, + = down (0) */
    sysSideColor: '#ffffff',    /* side bar of the Settings pages (Accessibility...): background colour ('#ffffff') */
    sysSideOpacity: 0,          /* opacity of the side bar background, 0-1; 0 = none (0) */
    sysSideCorners: 24,         /* corner radius of the side bar background (24) */
    sysListCorners: 0,          /* native corners of the list rows, px (system shape list.item, every list of the system); 0 = stock (0) */
    sysTabCorners: 0,           /* native corners of the side bar tabs, px (system shape tab.vertical); 0 = stock (0) */
    sysSideCollapsedWidth: 120, /* width of that background when the bar shrinks to its icons; 0 = always the full width (120) */
    sysSideTextColor: '',       /* text of the selected side bar item (system colour, every tab list); empty = stock ('') */
    sysSideTextDimColor: '',    /* text of the other side bar items (system colour); empty = stock ('') */
    sysTitleColor: '',          /* page titles (Settings, Accessibility...); system colour text.primary, also other texts; empty = stock ('') */
    sysIconColor: '',           /* icons of the rows (system colour list.label.primary, every list); empty = stock ('') */
    sysTextDimColor: '',        /* second text of the rows: values, descriptions (system colour list.label.secondary); empty = stock ('') */
    sysSwitchOnColor: '',       /* switch track when on (system colour); empty = stock ('') */
    sysSwitchOffColor: '',      /* switch track when off (system colour); empty = stock ('') */
    sysSwitchThumbColor: '',    /* switch knob when on (system colour); empty = stock ('') */
    sysBgOn: false,             /* your own image behind Settings and Trophies (false) */
    sysBg: '',                  /* that image, uploaded from the editor (1920x1080 .png/.jpg); the system darkens it like the stock one ('') */
    sysBgWallpaper: false,      /* use the Home wallpaper (picture or video) behind Settings and Trophies (false) */
    sysBgVideoSound: false,     /* .mp4 behind Settings and Trophies: play its sound (false) */
    sysSwitchCorners: 0,        /* switch track corners, px; 0 = stock 16 (system shape, every switch) (0) */
    sysSwitchKnobCorners: 0,    /* switch knob corners, px; 0 = stock 13 (0) */
    sysSwitchThumbOffColor: '', /* switch knob when off (system colour); empty = stock ('') */
    sysSwitchIconColor: '',     /* tick inside a switch that is on (system colour); empty = stock ('') */
    /* --- native panels --- */
    panelTintOn: false,         /* tint the native panels: Settings and Trophies pages, Users, Family, menus, Control Centre (false) */
    panelTintColor: '#2fd0e6',  /* tint colour ('#2fd0e6') */
    panelTintStrength: 0.5,     /* how much of the colour, 0-1 (0.5) */
    panelTintOpacity: 1,        /* panel opacity: 1 = stock, 0.5 = more see-through, up to 2 (1) */
    iconTintOn: false,          /* one colour for the system icons (colour tokens with "icon") (false) */
    iconTintColor: '#2fd0e6',   /* that colour ('#2fd0e6') */
    /* --- system background --- */
    shellBgOn: false,           /* colour of the system background (behind Settings, Trophies and the other system screens; the Home without game art): a base colour and a glow (false) */
    shellBgColor: '#06121f',    /* base colour ('#06121f') */
    shellBgGlow: '#2fd0e6',     /* glow colour ('#2fd0e6') */
    shellBgGlowIntensity: 1,    /* glow strength, 0-2 (1) */
    shellBgRainbow: false,      /* the glow goes round the colour wheel (base follows, dark) (false) */
    shellBgRainbowSpeed: 1,     /* rainbow speed, 0.1-10 (1) */
    /* --- tiles --- */
    tileVertical: false,     /* vertical 2:3 tiles (covers); tileSize/focusSize are then the width (false) */
    focusShape: '',          /* shape of the focused tile: '' = as the row, 'vertical' = 2:3 (square row only), 'steam' = horizontal 92:43; it keeps the row's focused height and its width changes (the next tiles move); every focused tile takes it: the game's customtile of that shape (<titleId>_2x3_<n> / _92x43_<n>) or its own picture cut, folders a mosaic of that shape ('') */
    tileAnimOn: false,        /* animated pictures: <titleId>_<format>_<n>.mp4 next to the .png (made by the editor from an animated WebP / APNG / video) plays on the focused tile, in an open folder and as the game background (logos stay still: no video with transparency on the PS5) (false) */
    customTilesOn: false,     /* games show their picture from /data/ZhiThemes/Assets/customtile: <titleId>_<format>_<n>.png, format 1x1 (square tiles) or 2x3 (vertical) (false) */
    customTileChoice: '',    /* picture of each game, set in the editor's Tiles tab or the Options menu: 'PPSA36082:2; PPSA01528:0' (0 = its own icon); not listed = picture 1 ('') */
    customBgOn: false,        /* games show their background from /data/ZhiThemes/Assets/custombg: <titleId>_16x9_<n>.png (false) */
    customBgChoice: '',      /* background of each game, set in the editor's Tiles tab: 'PPSA36082:2' (0 = its own art); not listed = background 1 ('') */
    /* --- logo --- */
    logoOn: false,           /* game logo on the Home: the picture <titleId>_logo_<n>.png in /data/ZhiThemes/Assets/customtile (Tiles tab: your PNG or a SteamGridDB logo); which one in customTileChoice 'ID/logo:n' (0 = no logo) (false) */
    logoX: 172,              /* logo box: distance from the left of the screen (172) */
    logoY: 330,              /* logo box: distance from the top of the screen (330, where the fake title starts) */
    logoWidth: 640,          /* logo box width; the logo fits inside keeping its shape (640) */
    logoHeight: 220,         /* logo box height (220) */
    logoAlign: 'left',       /* logo: 'left', 'center' or 'right' inside the box ('left') */
    logoVAlign: 'top',       /* logo: 'top', 'center' or 'bottom' inside the box ('top') */
    logoOpacity: 1,          /* logo opacity (1) */
    logoHidesTitle: false,   /* with the fake title on: a game with a logo shows the logo instead of its fake title (false) */
    /* --- experimental --- */
    tileAnimAll: false,      /* every tile with an animated picture moves, not only the focused one (a video player each: heavy) (false) */
    tileAnimAllMax: 6,       /* at most this many tiles move at once (the focused one always) (6) */
    debugOverlay: false,     /* debug panel on the Home: fps, memory, mono, CPU, temperatures... (like Aniketos' OSD) (false) */
    debugX: 60,              /* debug panel: distance from the left of the screen (60) */
    debugY: 60,              /* debug panel: distance from the top of the screen (60) */
    debugFontSize: 24,       /* debug panel text size (24) */
    debugColor: '#ffffff',   /* debug panel text colour ('#ffffff') */
    debugBgOpacity: 0.55,    /* debug panel: darkness of the box behind (0 = none) (0.55) */
    debugRow: false,         /* debug panel: all in one line instead of one per line (false) */
    debugItems: 'fps ram vram shell mono cpu temp fan up loads videos', /* debug panel: what to show, in this order ('fps ram vram shell mono cpu temp fan up loads videos') */
    screenDump: false,       /* screen dump: the apps' bundles and screen trees go to /data/ZhiThemes/Dumps/<firmware> (for other firmwares) (false) */
    /* --- folders --- */
    /* game folders in the row, 'Name: ID1, ID2; Other|icon.png|position: ID3'
       (made in the editor's Folders tab). With the folder selected its games show
       under the row: down or X goes into them, X starts a game */
    folders: '',                /* folders and their games ('') */
    foldersIcon: '',            /* icon of folders without their own (.png uploaded from the editor); empty = icon of its first game ('') */
    foldersPosition: 1,         /* position of folders without their own, 0 = first (1) */
    foldersOpenWithX: true,     /* the folder's games only show after X on the folder (X again hides them); off = as soon as it is selected (true) */
    foldersStripAbove: false,   /* the folder's games above the row instead of below (false) */
    foldersRingColor: '',       /* frame of the highlighted game; empty = the focus frame colour (focusLine*) or white ('') */
    foldersRingWidth: 4,        /* thickness of that frame (4) */
    foldersColor: '',           /* background colour of the folder icon (mosaic, made by the editor); empty = dark blue ('') */
    foldersAlpha: 1,            /* opacity of the folder icon background for folders without their own opacity, 0-1 (1) */
    foldersVertical: 'grid',    /* folder icon with vertical tiles: 'grid' (2x2 of tall covers), 'stack' (covers stacked) or 'square' (square folder, at the bottom of the tile) ('grid') */
    foldersHorizontal: 'grid',  /* folder picture of the Steam (horizontal) focused tile: 'grid' (4 covers 2:3 in a row), 'icons' (4 square icons in a row), 'stack' (2:3 covers overlapping) or 'square' (square icons, 2 rows) ('grid') */
    foldersBg: 'slices',        /* screen background of a focused folder, made by ZhiThemes from its first 4 games' art: 'slices', 'grid' (mosaic) or 'art' (the first game's art); empty = slices ('slices') */
    foldersStripMax: 0,         /* games shown at a time in an open folder (the rest scroll); 0 = as many as fit (0) */
    foldersHideName: false,     /* hide the name of the highlighted game of an open folder (false) */
    foldersTitle: true,         /* a selected folder shows its name where the game title goes (the folder hides its hub page); with the fake title on, the fake title shows it (true) */
    folderTitleX: 172,          /* that folder name: distance from the left of the screen (172) */
    folderTitleY: 560,          /* that folder name: distance from the top of the screen (560) */
    folderTitleSize: 72,        /* its font size; above 72 it is scaled (72) */
    folderTitleColor: '',       /* its colour; empty = white ('') */
    foldersNameSize: 54,        /* size of that name (54) */
    foldersNameX: 0,            /* move that name, + = right (0) */
    foldersNameY: 0,            /* move that name, + = down (0) */
    foldersStripBgOn: true,     /* background behind an open folder's games (true) */
    foldersStripBg: '',         /* its colour; empty = the folder's own colour ('') */
    foldersStripBgOpacity: 0.6, /* its opacity, 0-1 (0.6) */
    foldersStripBgPadding: 16,  /* space around the games (16) */
    foldersStripBgCorners: 24,  /* corner radius (24) */
    foldersStripX: 0,           /* folder games strip: move it, + = right (0) */
    foldersStripY: 0,           /* folder games strip: move it, + = down (0) */
    foldersStripSize: 120,      /* folder games strip: size of each game (120) */
    foldersStripGap: 16         /* folder games strip: space between games (16) */
  };
  /*
   * System colour tokens (native; applied by ZhiThemes when the Home starts).
   * The existing names are in /data/ZhiThemes/Logs/tokens_color.txt (debug mode)
   * (written the first time). Format: 'token.name': '#rrggbb' or
   * '#rrggbbaa'. Removing a line restores the stock colour.
   */
  var TOKENS = {
    /* 'focus.stroke.enabled': '#2fd0e6', */
  };
  /* favourites are console wide (ZhiThemes keeps them in favorites.txt, not
     in the theme): the same list whatever theme is in use */
  if (typeof globalThis.__ztFavorites === 'string') THEME.favorites = globalThis.__ztFavorites;
  /* "home", "hub" or "library": ZhiThemes sets it before running this file */
  var APP = globalThis.__themeApp || '?';
  /* debug mode (editor's Logs tab, kept by ZhiThemes in logs/debug.on, not in
     the theme): on = the keys, the screen map and the folders go to the log;
     sys = also what Settings and Trophies are made of (slow) */
  var DEBUG = globalThis.__ztDebug || {};
  DEBUG = { on: !!DEBUG.on, sys: !!(DEBUG.on && DEBUG.sys) };
  /* the diagnostic build (ZhiThemes-diag.elf): the screen map, the debug
     panel and the screen dump are always on, whatever the theme says */
  if (globalThis.__ztDiag) {
    DEBUG = { on: true, sys: true };
    THEME.measureScreen = true;
    THEME.debugOverlay = true;
    THEME.screenDump = true;
  }
  /* Settings and Trophies: only the "system screens" fields */
  var SYS_APP = APP === 'settings' || APP === 'trophy';

  if (globalThis.__theme) return;
  var T = globalThis.__theme = { done: {}, errors: 0, hooked: false, ctaStyles: [] };
  /* ZhiThemes off ("PS5 default" in Options > ZhiThemes, or a USB
     stick with ZhiThemes/no_theme): only the Home runs this file, with the
     factory values, and only adds Options menu > ZhiThemes (afterModule) */
  var STOCK = APP === 'home' && !!globalThis.__ztStock;
  /* no theme features: ZhiThemes off, or the diagnostic build with no theme
     (that one runs the factory theme only for its screen map, debug panel
     and dump: the Options menu keeps only the ZhiThemes item) */
  var PLAIN = STOCK || !!globalThis.__ztDiagPlain;
  if (PLAIN) {
    THEME.fakeTrophies = false;
    THEME.folders = '';
    THEME.animToast = false;
    if (!globalThis.__ztDiag) THEME.debugOverlay = false;
    THEME.tabFavOn = false;
  }

  function log(msg) {
    try { console.log('THEME [' + APP + '] ' + msg); } catch (e) {}
  }
  function done(name) {
    if (T.done[name]) return;
    T.done[name] = true;
    log('applied: ' + name);
  }

  /* ---- screen dump (Experimental, screenDump) ----
     What this firmware's app is made of, for making the theme work on it:
     React's devtools hook (set before the app's bundle runs) hands over the
     root of every render; ~10 s after the screen settles the whole tree
     (components, testIDs, a few props and style values, texts) goes to
     Dumps/<firmware>/<app>-<n>.txt through "THEME-DUMP". Up to 6 dumps per
     app, a new one only when the screen changed. The C++ also copies the
     app bundles there. */
  /* the diagnostic build (ZhiThemes-diag.elf) dumps always, even with no theme */
  if ((THEME.screenDump || globalThis.__ztDiag) && (!STOCK || globalThis.__ztDiag) &&
      typeof globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
    (function () {
      var root = null, timer = null, count = 0, lastSig = '';
      var STYLE_KEYS = ['position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'flexDirection',
        'justifyContent', 'alignItems', 'opacity', 'backgroundColor', 'color', 'fontSize', 'transform'];
      function dumpTypeName(f) {
        var t = f.type;
        if (typeof t === 'string') return t;
        if (!t) return f.tag === 6 ? '#text' : '#' + f.tag;
        if (typeof t === 'function') return t.displayName || t.name || 'fn';
        if (typeof t === 'object') {
          if (t.displayName) return t.displayName;
          if (t.render) return 'forwardRef(' + (t.render.displayName || t.render.name || '') + ')';
          if (t.type) return 'memo(' + (t.type.displayName || t.type.name || '') + ')';
          if (t._context) return 'Context';
          if (t.$$typeof) return 'Provider';
        }
        return '?';
      }
      function dumpFlat(s, out) {
        if (!s || typeof s !== 'object') return out;
        if (Array.isArray(s)) { for (var i = 0; i < s.length; i++) dumpFlat(s[i], out); return out; }
        for (var k in s) out[k] = s[k];
        return out;
      }
      function short(v) {
        try {
          var s = typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v);
          if (s === undefined) s = String(v);
          return s.length > 80 ? s.slice(0, 77) + '...' : s;
        } catch (e) { return '?'; }
      }
      function line(f, depth) {
        var p = f.memoizedProps, out = new Array(Math.min(depth, 60) + 1).join(' ') + dumpTypeName(f);
        if (f.tag === 6) return out + ' ' + short(p);
        if (!p || typeof p !== 'object') return out;
        if (f.key != null) out += ' key=' + short(f.key);
        ['testID', 'nativeID', 'accessibilityLabel', 'id', 'name', 'title', 'label', 'iconId', 'source', 'uri'].forEach(function (k) {
          if (p[k] != null && typeof p[k] !== 'function' && typeof p[k] !== 'object') out += ' ' + k + '=' + short(p[k]);
        });
        if (typeof p.children === 'string' || typeof p.children === 'number') out += ' text=' + short(p.children);
        if (p.style) {
          var st = dumpFlat(p.style, {}), parts = [];
          STYLE_KEYS.forEach(function (k) { if (st[k] != null) parts.push(k + ':' + short(st[k])); });
          if (parts.length) out += ' {' + parts.join(' ') + '}';
        }
        var keys = Object.keys(p).filter(function (k) { return k !== 'children' && k !== 'style'; });
        if (keys.length) out += ' props[' + keys.slice(0, 14).join(',') + (keys.length > 14 ? ',+' + (keys.length - 14) : '') + ']';
        return out;
      }
      function dump() {
        timer = null;
        if (!root || !root.current || count >= 6) return;
        var lines = [], names = {}, stack = [[root.current, 0]];
        while (stack.length && lines.length < 40000) {
          var e = stack.pop(), f = e[0];
          lines.push(line(f, e[1]));
          names[dumpTypeName(f)] = 1;
          if (f.sibling) stack.push([f.sibling, e[1]]);
          if (f.child) stack.push([f.child, e[1] + 1]);
        }
        var sig = lines.length + ':' + Object.keys(names).length;
        if (sig === lastSig) return;
        lastSig = sig;
        count++;
        var name = APP + '-' + count, head = '# ' + APP + ' screen tree ' + count + ', ' + lines.length +
          ' fibers, ' + Object.keys(names).length + ' kinds, ' + new Date().toISOString() + '\n';
        var text = head + lines.join('\n') + '\n';
        for (var i = 0, part = 0; i < text.length; i += 12000, part++)
          console.log('THEME-DUMP ' + name + ' ' + (part ? 1 : 0) + '\n' + text.slice(i, i + 12000));
        log('screen dump ' + name + ': ' + lines.length + ' fibers');
      }
      globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        supportsFiber: true,
        renderers: new Map(),
        inject: function () { return 1; },
        checkDCE: function () {},
        onCommitFiberUnmount: function () {},
        onPostCommitFiberRoot: function () {},
        onCommitFiberRoot: function (id, r) {
          root = r;
          if (count >= 6 || typeof setTimeout !== 'function') return;
          if (timer) clearTimeout(timer);
          timer = setTimeout(function () { try { dump(); } catch (e) { log('screen dump failed: ' + e); } }, 10000);
        }
      };
      log('screen dump on');
    })();
  }

  /* ---- option values: English, with the old Portuguese ones still accepted ---- */
  var VALUE_ALIASES = { esquerda: 'left', centro: 'center', centre: 'center', direita: 'right',
    negrito: 'bold', 'itálico': 'italic', italico: 'italic', 'negrito itálico': 'bold italic',
    'negrito italico': 'bold italic', 'letra nova': 'element font' };
  function value(v) {
    if (typeof v !== 'string') return v;
    var k = v.trim().toLowerCase();
    return VALUE_ALIASES[k] || k;
  }

  /* ---- controller buttons: system icons (IconPS, iconid_controller_key_*
     in Sce.PlayStation.PUI_UI3.rco) ---- */
  var BUTTONS = { x: 'face_cross', cross: 'face_cross', cruz: 'face_cross',
    circle: 'face_circle', bola: 'face_circle', circulo: 'face_circle', 'círculo': 'face_circle',
    square: 'face_square', quadrado: 'face_square',
    triangle: 'face_triangle', triangulo: 'face_triangle', 'triângulo': 'face_triangle',
    r1: 'r1', r2: 'r2', r3: 'r3', l1: 'l1', l2: 'l2', l3: 'l3',
    options: 'options', opcoes: 'options', 'opções': 'options', create: 'create', criar: 'create',
    ps: 'ps', touchpad: 'touchpad', up: 'arrow_up', cima: 'arrow_up', down: 'arrow_down', baixo: 'arrow_down',
    left: 'arrow_left', esquerda: 'arrow_left', right: 'arrow_right', direita: 'arrow_right' };
  /* 'x', 'r1'... -> iconId; 'id:<name>' = another system icon (e.g. 'id:ps_plus') */
  function buttonIcon(v) {
    if (typeof v !== 'string' || !v) return null;
    var k = v.trim().toLowerCase();
    if (k.indexOf('id:') === 0) return k.slice(3);
    return BUTTONS[k] ? 'controller_key_' + BUTTONS[k] : null;
  }
  function iconComponent() {
    return T.IconPS || (T.rn && T.rn.IconPS) || null;
  }

  /* ---- fonts: weight and italic ----
     The PS5 text engine only has the system font in light / medium / bold,
     upright or italic. Family names are ignored and a font file (path) takes
     ShellUI down, so only these values are accepted. */
  function fontStyle(v) {
    var out = {};
    if (typeof v !== 'string' || !v) return out;
    v = value(v);
    /* 'element font' = bold italic, the SST variant elementFont stands in
       for ('new font' of ZhiThemes 18-121 too) */
    if (v === 'element font' || v === 'new font') v = 'bold italic';
    var parts = v.split(' ');
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === 'bold') out.fontWeight = 'bold';
      else if (parts[i] === 'italic') out.fontStyle = 'italic';
    }
    return out;
  }
  function merge(target, extra) {
    for (var k in extra) target[k] = extra[k];
    return target;
  }

  /* ---- one folder per kind under /data/ZhiThemes (backgrounds/
     held everything before): wallpapers, icons, folders, cache/mosaics,
     cache/folderbg, cache/icons. ZhiThemes moves the old files on start;
     one still in backgrounds/ (globalThis.__ztLegacy) is read there. ---- */
  /* the user's files in Assets/<kind>, the theme's wallpapers and
     icons in Themes/<active>/<kind> (globalThis.__ztThemeDir) */
  var ZT = '/user/data/ZhiThemes/';
  var ZT_ASSETS = ZT + 'Assets/';
  var legacySet = null;
  function ztPath(kind, name) {
    if (!legacySet) {
      legacySet = {};
      (Array.isArray(globalThis.__ztLegacy) ? globalThis.__ztLegacy : []).forEach(function (n) { legacySet[n] = true; });
    }
    if (legacySet[name]) return ZT_ASSETS + 'backgrounds/' + name;
    if (kind === 'wallpapers' || kind === 'icons' || kind === 'fonts')
      return (typeof globalThis.__ztThemeDir === 'string' && globalThis.__ztThemeDir ? globalThis.__ztThemeDir : ZT + 'Themes/Default/') + kind + '/' + name;
    return ZT_ASSETS + kind + '/' + name;
  }
  /* a folder icon name: the theme's mosaics are in the cache, the user's in folders */
  function folderIconPath(n) {
    return n.charAt(0) === '/' ? n : ztPath(/^zt_folder_/.test(n) ? 'cache/mosaics' : 'folders', n);
  }

  /* ---- vertical tiles (tileRatio, tileVertical = 2:3) ----
     The Home uses one number for both sides of a tile. EXPERIENCE_SIZE /
     SCALED_EXP_SIZE stay the width (all the horizontal maths of the row is
     right); the places that use it vertically get the height:
     carousel module 596 (tile style + translateY of selectedN), Tile module
     618/152 (image style, texture size), module 24 row heights, name block
     (TITLE_Y), details view (MINIMIZED_EXP_MARGIN_TOP), focusTrap (903). */
  function tileRatio() {
    /* an older theme file may still say tileRatio: 1.5 */
    return THEME.tileVertical === true || Number(THEME.tileRatio) > 1.01 ? 1.5 : 1;
  }
  function tileHeight() { return Math.round(THEME.tileSize * tileRatio()); }
  function focusHeight() { return Math.round(THEME.focusSize * tileRatio()); }

  /* ---- module 24: constants of the game row ("ExperienceSwitcher") ---- */
  function rowConstants(exp) {
    if (!exp || typeof exp !== 'object' || T.done.constants ||
        typeof exp.EXPERIENCE_SIZE !== 'number' ||
        typeof exp.SCALED_EXP_SIZE !== 'number' ||
        typeof exp.MINIMIZED_EXP_MARGIN_TOP !== 'number')
      return;
    var stockFocus = exp.SCALED_EXP_SIZE, stockTile = exp.EXPERIENCE_SIZE;
    /* margin the Home gives the hub/library page (SCALED_EXP_SIZE -
       VERTICAL_HEIGHT_CHANGE, 128 stock): with bigger tiles it got very
       negative and the last library line left the screen; it keeps the stock one */
    if (typeof exp.VERTICAL_HEIGHT_CHANGE === 'number')
      T.hubMargin = exp.SCALED_EXP_SIZE - exp.VERTICAL_HEIGHT_CHANGE;
    if (THEME.rowX && typeof exp.SCALED_EXP_MARGIN_LEFT === 'number')
      exp.SCALED_EXP_MARGIN_LEFT += THEME.rowX;

    exp.EXPERIENCE_SIZE = THEME.tileSize;
    exp.SCALED_EXP_SIZE = THEME.focusSize;
    exp.EXPERIENCE_SCALE = THEME.focusSize / THEME.tileSize;
    exp.BORDER_RADIUS = THEME.tileCorners;
    /* small tile in the corner of the details view: keeps the stock size (80) */
    if (typeof exp.MINIMIZED_EXP_SIZE === 'number')
      exp.MINIMIZED_EXP_SCALE = exp.MINIMIZED_EXP_SIZE / THEME.focusSize;
    if (typeof exp.MINIMIZED_EXP_SCALE === 'number') T.minScale = exp.MINIMIZED_EXP_SCALE;
    if (THEME.fixDetails) {
      /* The animation maths for the details view assume the row sits right
         below the top bar and has the stock height. */
      exp.MINIMIZED_EXP_MARGIN_TOP -= THEME.rowOffsetY;
      exp.VERTICAL_HEIGHT_CHANGE += THEME.rowOffsetY +
                                    (focusHeight() - stockFocus);
      /* the name area below the tile (SCALED - EXPERIENCE: 62 stock) also
         grows with the tiles; without this the hub/library page sat lower
         and the end of the list left the screen */
      exp.VERTICAL_HEIGHT_CHANGE += (THEME.focusSize - THEME.tileSize) - (stockFocus - stockTile);
      /* vertical tiles: the details view moves the focused tile from its
         centre (SYSTEM_HEIGHT + SCALED/2) to the centre of the small one
         (MINIMIZED_EXP_MARGIN_TOP + MINIMIZED_EXP_SIZE/2), both taken as
         squares. With the real heights the top of the small one stays at
         MINIMIZED_EXP_MARGIN_TOP. */
      if (tileRatio() !== 1 && typeof exp.MINIMIZED_EXP_SIZE === 'number') {
        var mini = exp.MINIMIZED_EXP_SIZE;
        exp.MINIMIZED_EXP_MARGIN_TOP += (mini * tileRatio() - mini) / 2 -
                                        (focusHeight() - THEME.focusSize) / 2;
      }
    }
    if (tileRatio() !== 1)
      log('vertical tiles: ratio ' + tileRatio() + ', tiles ' + THEME.tileSize + 'x' + tileHeight() +
          ', focused ' + THEME.focusSize + 'x' + focusHeight() +
          ', MINIMIZED_EXP_MARGIN_TOP ' + exp.MINIMIZED_EXP_MARGIN_TOP + ', VERTICAL_HEIGHT_CHANGE ' + exp.VERTICAL_HEIGHT_CHANGE);
    /* the same value says how far the Home moves up to show the hub/library
       (module 146: homeContainer translateY = -(SYSTEM_HEIGHT + VERTICAL_HEIGHT_CHANGE)) */
    if (THEME.hubOffset && typeof exp.VERTICAL_HEIGHT_CHANGE === 'number')
      exp.VERTICAL_HEIGHT_CHANGE += THEME.hubOffset;
    done('constants');
  }

  /* vertical tiles: exports read while drawing */
  function verticalConstants(exp) {
    if (tileRatio() === 1) return;
    /* name block next to the focused tile: TITLE_Y = EXPERIENCE_SIZE (the
       bottom of the focused tile minus its name area, SCALED - EXPERIENCE);
       the details view moves the name from there */
    if (!T.done['vertical name'] && typeof exp.TITLE_Y === 'number' && typeof exp.TITLE_X === 'number' &&
        typeof exp.MINIMIZED_TITLE_MARGIN_TOP === 'number') {
      exp.TITLE_Y += focusHeight() - THEME.focusSize;
      done('vertical name');
    }
    /* module 618 (<Tile />): texture of the tile image, resize4k(SCALED x
       SCALED) with keepFitSize; a portrait box keeps square icons whole and
       gives portrait covers their full height */
    if (!T.done['vertical texture'] && exp.Tile && exp.RESIZE_OPTIONS && typeof exp.RESIZE_OPTIONS === 'object' &&
        exp.RESIZE_OPTIONS.resize && typeof exp.RESIZE_OPTIONS.resize.width === 'number') {
      var rz = exp.RESIZE_OPTIONS.resize, k = rz.width / (THEME.focusSize || 168);
      rz.height = Math.round(focusHeight() * k);
      log('vertical tiles: texture ' + rz.width + 'x' + rz.height + ' (' + exp.RESIZE_OPTIONS.resizeAspectOption + ')');
      done('vertical texture');
    }
  }

  /* ---- module of the top icons: SYSTEM_ICON_SIZE (56 / 48 without glance) ---- */
  function topConstants(exp) {
    if (!(THEME.iconSize > 0) || T.done['icon size'] ||
        typeof exp.SYSTEM_ICON_SIZE !== 'number' ||
        typeof exp.SYSTEM_ICON_SIZE_NO_GLANCE !== 'number')
      return;
    var stock = exp.SYSTEM_ICON_SIZE;
    exp.SYSTEM_ICON_SIZE = THEME.iconSize;
    exp.SYSTEM_ICON_SIZE_NO_GLANCE =
        Math.round(exp.SYSTEM_ICON_SIZE_NO_GLANCE * THEME.iconSize / stock);
    done('icon size');
  }

  /* ---- row animation ----
     The row carousel animates with Animated.spring and its own config
     (stiffness 256, damping 21, mass 0.1). More speed = stiffness × v²
     and damping × v (same damping ratio, faster); bounce = no
     overshootClamping and less damping. */
  function hookAnimations(rn) {
    if (APP !== 'home' || T.done['row animation'])
      return;
    hookTiming(rn);
    if (THEME.rowSpeed === 1 && !THEME.rowBounce)
      return;
    var A = null;
    try { A = rn.Animated; } catch (e) {}
    if (!A || typeof A.spring !== 'function' || A.spring.__theme) return;
    var original = A.spring;
    var v = THEME.rowSpeed > 0 ? THEME.rowSpeed : 1;
    /* with a slow row, pressing several times in a row restarted every spring
       half way, on all tiles at once, and it stuttered: a spring that
       restarts less than rowRepeatWindow ms after the previous one (fast
       presses or a held direction) uses the stock config (fast, no
       bounce). The window is fixed: with 350/v a calm second press,
       ~1 s later, still counted as a repeat. */
    var windowMs = THEME.rowRepeatWindow > 0 ? THEME.rowRepeatWindow : 350;
    var replaced = function (val, cfg) {
      var repeated = false;
      if (THEME.rowFastRepeat && val && typeof val === 'object') {
        var now = Date.now();
        repeated = typeof val.__themeT === 'number' && now - val.__themeT < windowMs;
        try { val.__themeT = now; } catch (e) {}
      }
      if (!repeated && cfg && cfg.stiffness === 256 && cfg.damping === 21 && cfg.mass === 0.1) {
        var c = {};
        for (var k in cfg) c[k] = cfg[k];
        c.stiffness = cfg.stiffness * v * v;
        c.damping = cfg.damping * v;
        if (THEME.rowBounce) {
          var f = THEME.rowBounceStrength;
          f = f > 0.95 ? 0.95 : f > 0 ? f : 0;
          c.overshootClamping = false;
          c.damping = c.damping * (1 - f);
        }
        cfg = c;
      }
      return original.call(this, val, cfg);
    };
    replaced.__theme = true;
    try { A.spring = replaced; } catch (e) {}
    if (A.spring === replaced) done('row animation');
    else log('Animated.spring not replaceable');
  }

  /* ---- other Home animations ----
     The shared springs (module 60: SPRING_OPTIONS_SLOW/SLOWER/FAST/FASTER)
     and the Animated.timing (durations) follow animationSpeed. */
  function springs(exp) {
    var v = THEME.animationSpeed;
    if (APP !== 'home' || !(v > 0) || v === 1 || T.done['springs'] ||
        !exp.SPRING_OPTIONS_SLOW || typeof exp.SPRING_OPTIONS_SLOW.stiffness !== 'number')
      return;
    ['SPRING_OPTIONS_SLOW', 'SPRING_OPTIONS_SLOWER', 'SPRING_OPTIONS_FAST',
     'SPRING_OPTIONS_FASTER'].forEach(function (k) {
      var o = exp[k];
      if (!o || typeof o.stiffness !== 'number') return;
      o.stiffness = o.stiffness * v * v;
      if (typeof o.damping === 'number') o.damping = o.damping * v;
    });
    done('springs');
  }
  function hookTiming(rn) {
    var v = THEME.animationSpeed;
    if (!(v > 0) || v === 1) return;
    var A = null;
    try { A = rn.Animated; } catch (e) {}
    if (!A || typeof A.timing !== 'function' || A.timing.__theme) return;
    var original = A.timing;
    var replaced = function (val, cfg) {
      /* the same for durations: restarting less than rowRepeatWindow ms
         after the previous one = stock duration */
      var repeated = false;
      if (THEME.rowFastRepeat && v < 1 && val && typeof val === 'object' &&
          cfg && typeof cfg.duration === 'number') {
        var now = Date.now();
        var windowMs = THEME.rowRepeatWindow > 0 ? THEME.rowRepeatWindow : 350;
        repeated = typeof val.__themeD === 'number' && now - val.__themeD < windowMs;
        try { val.__themeD = now; } catch (e) {}
      }
      if (!repeated && cfg && typeof cfg.duration === 'number') {
        var c = {};
        for (var k in cfg) c[k] = cfg[k];
        c.duration = cfg.duration / v;
        if (typeof cfg.delay === 'number') c.delay = cfg.delay / v;
        cfg = c;
      }
      return original.call(this, val, cfg);
    };
    replaced.__theme = true;
    try { A.timing = replaced; } catch (e) {}
    if (A.timing === replaced) done('animations (timing)');
  }

  /* ---- font sizes ----
     Text only accepts the sizes of React Native's FontSizePS table (any other
     value is a fatal error): rounded to the nearest.
     Without a table it returns 0 and the font stays as it is. */
  function fontSize(px) {
    if (!(px > 0)) return 0;
    if (!T.sizes) {
      T.sizes = [];
      var table = T.rn && T.rn.FontSizePS;
      for (var name in table)
        if (typeof table[name] === 'number' && table[name] > 0 &&
            name.indexOf('5X') < 0)
          T.sizes.push(table[name]);
      log('font sizes: ' + JSON.stringify(T.sizes));
    }
    var best = 0;
    for (var i = 0; i < T.sizes.length; i++)
      if (!best || Math.abs(T.sizes[i] - px) < Math.abs(best - px))
        best = T.sizes[i];
    return best;
  }
  /* 'U+E001' (or 'U+E001 U+E002') -> the character; other text stays the same.
     For the icons of the PS4Icon font, which live in private codes. */
  function symbol(t) {
    if (typeof t !== 'string' || !/^(\s*U\+[0-9A-Fa-f]{4,6})+\s*$/.test(t)) return t;
    return t.trim().split(/\s+/).map(function (u) {
      return String.fromCodePoint(parseInt(u.slice(2), 16));
    }).join('');
  }
  /* hand-made shadow (the PS5 engine ignores textShadow): the same text,
     dark and shifted, drawn behind */
  function hasStyle(st, target) {
    if (st === target) return true;
    if (!Array.isArray(st)) return false;
    for (var i = 0; i < st.length; i++)
      if (hasStyle(st[i], target)) return true;
    return false;
  }
  /* a theme text with its shadow below it (in a box together with the text) */
  function withShadow(React, rn, key, style, text, px) {
    var props = { numberOfLines: 1, style: style, children: text };
    var shadow = shadowOf(function (t, pr) { return React.createElement(t, pr); }, rn.Text,
                          { key: 's', numberOfLines: 1,
                            style: [style, { position: 'absolute', left: 0, top: 0, marginLeft: 0 }],
                            children: text }, null, px);
    if (!shadow) return React.createElement(rn.Text, merge({ key: key }, props));
    /* the margin goes on the box, not on the texts */
    return React.createElement(rn.View, { key: key, style: [style && style[1] ? style[1] : null] },
                               [shadow, React.createElement(rn.Text, { key: 't', numberOfLines: 1,
                                 style: [style, { marginLeft: 0 }], children: text })]);
  }
  /* tile shadow: dark plates behind each tile, inside the carousel's
     selectedN view (grows with the focused tile); the PS5 ignores
     shadow*, but draws backgroundColor (like the "background" frame of an older version) */
  function registerSelected(s, r) {
    if (!T.selected) T.selected = typeof WeakMap === 'function' ? new WeakMap() : new Map();
    for (var k in s) {
      if (!/^selected\d+$/.test(k) || !s[k] || typeof s[k] !== 'object') continue;
      T.selected.set(s[k], true);
      if (r && typeof r === 'object' && r[k] && typeof r[k] === 'object') T.selected.set(r[k], true);
    }
  }
  /* top: px from the top of the tile's box where the tile starts (square folders in vertical rows) */
  function tileShadow(top, wider) {
    var React = T.React, rn = T.rn, out = [];
    top = top || 0;
    /* px (tile size) the focused shape is wider than the box */
    wider = wider || 0;
    if (!React || !rn || !rn.View || !(THEME.tileShadow > 0)) return out;
    var S = THEME.focusSize / THEME.tileSize;
    var radius = THEME.tileCorners * S, n = 4, op = THEME.tileShadowOpacity;
    var dx = THEME.tileShadowX || 0, dy = THEME.tileShadowY || 0;
    for (var i = n; i >= 1; i--) {
      var e = THEME.tileShadow * i / n;
      out.push(React.createElement(rn.View, { key: 'theme-shadow-' + i, pointerEvents: 'none', style: {
        position: 'absolute', top: top + dy - e, bottom: -dy - e, left: dx - e, right: -dx - e - wider,
        borderRadius: radius + e, backgroundColor: THEME.tileShadowColor || '#000000',
        opacity: op / n } }));
    }
    return out;
  }
  /* ---- tile reflection (tileReflection): the game's image upside down
     under each tile, like a lake. It goes in the same selectedN view as the
     shadow, so it moves and grows with the carousel. The tile element (from
     the strand's renderItem) carries the game in props.experience
     (icon0PathWithTs). No native gradient and the PS5 cannot draw a view
     twice: the reflection is cut into strips (absolute + overflow hidden,
     each showing its slice of the flipped image) whose opacity goes down, so
     it fades out over any background (also the video). tileReflectionWaves
     moves the strips sideways on a shared native-driven sine. ---- */
  var reflLogs = 0;
  function tileExperience(c, depth) {
    if (!c || depth > 5) return null;
    if (Array.isArray(c)) {
      for (var i = 0; i < c.length; i++) {
        var r = tileExperience(c[i], depth);
        if (r) return r;
      }
      return null;
    }
    if (typeof c !== 'object' || !c.props) return null;
    var p = c.props;
    if (p.experience && typeof p.experience === 'object' && p.experience.id) return p.experience;
    if (p.item && typeof p.item === 'object' && p.item.id) return p.item;
    return tileExperience(p.children, depth + 1);
  }
  /* the row's items carry the image as iconPath {uri} (looked for
     icon0PathWithTs, which only the app list records have: no reflection);
     the uri the Home itself loads is used as it is */
  function experienceIcon(e) {
    /* the tile's own picture (customtile), as on the tile */
    var own = typeof e.id === 'string' ? tilePicture(e.id) : null;
    if (own) return 'file://' + own;
    if (e.iconPath && typeof e.iconPath.uri === 'string' && e.iconPath.uri) return e.iconPath.uri;
    var s = String(e.icon0PathWithTs || (e.conceptInfo && e.conceptInfo.iconPathWithTs) || '');
    if (!s) return '';
    return s.charAt(0) === '/' ? 'file://' + s.split('?')[0] : s;
  }
  function tileReflection(children) {
    var React = T.React, rn = T.rn;
    if (!React || !rn || !rn.View || !rn.Image || typeof React.useState !== 'function') return null;
    var e = tileExperience(children, 0);
    var uri = e ? experienceIcon(e) : '';
    if (!uri) {
      if (reflLogs++ < 3) log('reflection: no image in the tile (' + (e ? e.id + ': ' + Object.keys(e).join(',').slice(0, 300) : 'no experience') + ')');
      return null;
    }
    if (!T.done['tile reflection']) done('tile reflection');
    return React.createElement(TileReflection, { key: 'theme-reflection', uri: uri, id: e.id });
  }
  /* one Animated.Value 0 -> 1 in a loop for every reflection (native driver) */
  function reflectionWave() {
    var A = T.rn && T.rn.Animated;
    if (T.reflWave) return T.reflWave;
    if (!A || typeof A.Value !== 'function' || typeof A.timing !== 'function') return null;
    var v = T.reflWave = new A.Value(0);
    var ms = (THEME.tileReflectionWaveSpeed > 0 ? THEME.tileReflectionWaveSpeed : 3) * 1000;
    /* hookTiming divides durations by animationSpeed: undo it here */
    if (A.timing.__theme && THEME.animationSpeed > 0) ms = ms * THEME.animationSpeed;
    var once = function () {
      return A.timing(v, { toValue: 1, duration: ms, useNativeDriver: true, easing: function (t) { return t; } });
    };
    try {
      if (typeof A.loop === 'function') A.loop(once()).start();
      else {
        var again = function () { v.setValue(0); once().start(function (r) { if (!r || r.finished) again(); }); };
        again();
      }
      log('reflection: waves ' + THEME.tileReflectionWaves + ' px, ' + ms + ' ms' + (A.loop ? '' : ' (no Animated.loop)'));
    } catch (err) { log('reflection: waves failed: ' + err); }
    return v;
  }
  function reflectionFlip() {
    var f = THEME.tileReflectionFlip;
    if (f === 'rotateX') return [{ rotateX: '180deg' }];
    if (f === 'rotate') return [{ rotate: '180deg' }, { scaleX: -1 }];
    return [{ scaleY: -1 }];
  }
  function TileReflection(props) {
    var React = T.React, rn = T.rn, A = rn.Animated;
    var st = React.useState(null), box = st[0], setBox = st[1];
    /* the reflection box fills the selectedN view: its size is the tile's */
    var onLayout = function (ev) {
      var l = ev && ev.nativeEvent && ev.nativeEvent.layout;
      if (!l || !(l.width > 0) || !(l.height > 0)) return;
      if (box && Math.abs(box.w - l.width) < 0.5 && Math.abs(box.h - l.height) < 0.5) return;
      if (reflLogs++ < 6) log('reflection: tile ' + props.id + ' ' + Math.round(l.width) + 'x' + Math.round(l.height) + ' ' + props.uri);
      setBox({ w: l.width, h: l.height });
    };
    var fill = { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 };
    if (!box) return React.createElement(rn.View, { pointerEvents: 'none', onLayout: onLayout, style: fill });
    var W = box.w, H = box.h;
    var frac = Math.min(1, Math.max(0.05, THEME.tileReflectionHeight > 0 ? THEME.tileReflectionHeight : 0.5));
    var n = Math.min(24, Math.max(2, Math.round(THEME.tileReflectionSteps > 0 ? THEME.tileReflectionSteps : 8)));
    var op = Math.min(1, THEME.tileReflection);
    var top0 = H + (THEME.tileReflectionGap || 0), shown = H * frac;
    var radius = (THEME.tileCorners || 0) * W / (THEME.tileSize || 106);
    var amp = THEME.tileReflectionWaves > 0 && A && A.View ? THEME.tileReflectionWaves : 0;
    var wave = amp ? reflectionWave() : null;
    var flip = reflectionFlip();
    var strips = [];
    for (var i = 0; i < n; i++) {
      var y = Math.round(i * shown / n), h = Math.round((i + 1) * shown / n) - y;
      if (h <= 0) continue;
      var style = { position: 'absolute', left: 0, top: top0 + y, width: W, height: h, overflow: 'hidden',
                    opacity: op * (1 - i / n) };
      if (wave) {
        /* deeper strips move more; each one a bit later than the one above */
        var a = amp * (0.3 + 0.7 * (i + 1) / n), ph = i * 0.12, ins = [], outs = [];
        for (var k = 0; k <= 12; k++) {
          ins.push(k / 12);
          outs.push(a * Math.sin(2 * Math.PI * (k / 12 + ph)));
        }
        style.transform = [{ translateX: wave.interpolate({ inputRange: ins, outputRange: outs }) }];
      }
      strips.push(React.createElement(wave ? A.View : rn.View, { key: 's' + i, style: style },
        React.createElement(rn.Image, {
          source: { uri: props.uri },
          onError: function () { if (reflLogs++ < 10) log('reflection: image error ' + props.uri); },
          style: { position: 'absolute', left: 0, top: -y, width: W, height: H, borderRadius: radius,
                   transform: flip } })));
    }
    return React.createElement(rn.View, { pointerEvents: 'none', style: fill, onLayout: onLayout }, strips);
  }
  /* theme layers on the Home (background, footer, user, boxes...): in a
     screen-sized box whose opacity follows the Home moving up; when the
     hub/library opens they no longer sit over the top of the page */
  /* While the Home starts, its container is drawn more than once at the same
     time (startup screen and the real one), so every theme layer showed up
     two or three times on top of itself: the trophies background looked
     darker and then lighter (Chiaki frames 0.6-2.1 s). Each layer is
     drawn only by the container mounted last; the others draw nothing. */
  var singles = {};
  function Single(props) {
    var React = T.React, slot = props.slot;
    if (typeof React.useState !== 'function' || typeof React.useEffect !== 'function' ||
        typeof React.useRef !== 'function')
      return props.children;
    var me = React.useRef(null), st = React.useState(0), bump = st[1];
    if (!me.current) me.current = {};
    React.useEffect(function () {
      var list = singles[slot] = singles[slot] || [];
      var entry = { id: me.current, bump: bump };
      list.push(entry);
      if (list.length > 1 && !T.done['layer copies ' + slot]) done('layer copies ' + slot + ': ' + list.length);
      list.forEach(function (x) { x.bump(function (n) { return n + 1; }); });
      return function () {
        var i = list.indexOf(entry);
        if (i >= 0) list.splice(i, 1);
        list.forEach(function (x) { x.bump(function (n) { return n + 1; }); });
      };
    }, []);
    var list = singles[slot] || [];
    var last = list.length ? list[list.length - 1].id : me.current;
    return last === me.current ? props.children : null;
  }
  /* The Home first draws a loading screen (no row, no tabs, no top bar)
     and then the real one. The front layer (own clock, icons, footer, icons
     moved out of the bar...) would show alone on the loading screen, before
     the profile and the bar buttons: it waits until the real top bar or the
     tabs draw (at most 6 s). */
  var readyListeners = [];
  function homeReadySet(why) {
    if (T.homeReady) return;
    T.homeReady = true;
    done('home ready (' + why + ')');
    var ls = readyListeners.slice();
    setTimeout(function () { ls.forEach(function (f) { try { f(); } catch (e) {} }); }, 0);
  }
  function ReadyGate(props) {
    var React = T.React, st = React.useState(!!T.homeReady), ok = st[0], set = st[1];
    React.useEffect(function () {
      if (ok) return undefined;
      var f = function () { set(true); };
      readyListeners.push(f);
      if (T.homeReady) f();
      var t = setTimeout(function () { homeReadySet('timeout'); }, 6000);
      return function () {
        clearTimeout(t);
        var i = readyListeners.indexOf(f);
        if (i >= 0) readyListeners.splice(i, 1);
      };
    }, [ok]);
    return ok ? props.children : null;
  }
  function readyGate(children) {
    var React = T.React;
    if (APP !== 'home' || !React || typeof React.useState !== 'function' || typeof React.useEffect !== 'function' ||
        !children || !children.length)
      return children;
    return [React.createElement(ReadyGate, { key: 'theme-ready-gate' }, children)];
  }
  function single(slot, children) {
    if (!T.React || !children || !children.length) return children;
    return [T.React.createElement(Single, { key: 'single-' + slot, slot: slot }, children)];
  }
  /* 0 on the Home, 1 once it went up to the hub (the small tile in
     the corner with its name); without the lift value, always 0 */
  function hubOpacity() {
    if (!T.homeLift || typeof T.homeLift.interpolate !== 'function') return 0;
    return T.homeLift.interpolate({ inputRange: [-150, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  }
  function styleHas(st, want) {
    if (st === want) return true;
    if (Array.isArray(st)) for (var i = 0; i < st.length; i++) if (styleHas(st[i], want)) return true;
    return false;
  }
  function hubOnly(props, args) {
    if (!T.rn || !T.rn.Animated || !T.rn.Animated.Text) {
      props.style = [props.style, { opacity: 0 }];
      return;
    }
    props.style = [props.style, { opacity: hubOpacity() }];
    args[0] = T.rn.Animated.Text;
    if (!T.done['tile name only in the hub view']) done('tile name only in the hub view (copy on)');
  }
  /* ---- the names ----
     game title = the hub's name under the row (another app, cannot go above
     the row); tile title = the PS5 symbol + name next to the focused tile;
     fake title = FakeTitle, drawn by the Home in its front layer, at its own
     screen position (not tied to the tile title); folder title = the folder
     name where the game title goes, when the fake title is off.
     titleMode picks the game or the fake title, never both: with 'fake' the
     game title shows only once the focus is in the hub. Empty titleMode =
     the old fields (nameCopy / homeTitle / hideTitle). */
  function oldTitles() {
    var m = String(THEME.titleMode || '').toLowerCase();
    return m !== 'game' && m !== 'fake' && m !== 'none';
  }
  function titleMode() {
    if (!oldTitles()) return String(THEME.titleMode).toLowerCase();
    if (THEME.nameCopy || THEME.homeTitle) return 'fake';
    return THEME.hideTitle ? 'none' : 'game';
  }
  /* the text of the tile title; the old Big name hid it with hideOriginalName */
  function tileTextHidden() {
    return !!(THEME.hideTileName || (oldTitles() && THEME.nameCopy && THEME.hideOriginalName));
  }
  /* the PS5/PS4 symbol; the old hideTileName hid it with the text */
  function ps5IconHidden() {
    return !!(THEME.hidePS5Icon || (oldTitles() && THEME.hideTileName));
  }
  /* titleMode 'fake' or 'none': the hub's game title only in the hub
     view (0 on the Home, 1 once the focus went down to the hub). The Home
     knows it: its hub page gets isHubFocused (the vertical position is
     'hub'); it prints THEME-HUBFOCUS 0/1 and ZhiThemes hands it to the hub
     (__themeHubFocus) when the hub asks (THEME-HUBASK). an older version caught onFocus
     on every hub part instead: those never came (and the new handlers on
     every render left the hub without focus). With every part of the hub
     hidden the Home does not go down and nothing changes. */
  function hubTitleGated() {
    var m = titleMode();
    return m === 'fake' || m === 'none';
  }
  function hubTitleValue() {
    var A = T.rn && T.rn.Animated;
    if (!T.hubTitleOp && A && typeof A.Value === 'function') T.hubTitleOp = new A.Value(fromLibrary() ? 1 : 0);
    return T.hubTitleOp;
  }
  function hubTitleShow(on, why) {
    var v = hubTitleValue(), A = T.rn && T.rn.Animated;
    if (fromLibrary()) on = true;
    if (!v || T.hubTitleOn === on) return;
    T.hubTitleOn = on;
    if ((T.hubTitleLogs = (T.hubTitleLogs || 0) + 1) <= 20) log('game title ' + (on ? 'shown' : 'hidden') + ' (' + why + ')');
    try { A.timing(v, { toValue: on ? 1 : 0, duration: 150, useNativeDriver: true }).start(); }
    catch (e) { try { v.setValue(on ? 1 : 0); } catch (e2) {} }
  }
  if (APP === 'hub' && hubTitleGated()) {
    globalThis.__themeHubFocus = function (on) { hubTitleShow(!!on, on ? 'hub focused' : 'back on the Home'); };
    setInterval(function () { try { console.log('THEME-HUBASK ' + (globalThis.__ztHubId || '')); } catch (e) {} }, 150);
  }
  /* Home: the game hub page (not the Game/App Library) with isHubFocused */
  function hubFocusRelay(props) {
    if (APP !== 'home' || !hubTitleGated() || !('isHubFocused' in props) || isLibraryUrl(props.hubUrl)) return;
    var on = !!props.isHubFocused;
    if (T.hubFocusedNow === on) return;
    T.hubFocusedNow = on;
    if ((T.hubFocusLogs = (T.hubFocusLogs || 0) + 1) <= 20) log('hub ' + (on ? 'focused' : 'left') + ' (game title ' + (on ? 'shown' : 'hidden') + ')');
    try { console.log('THEME-HUBFOCUS ' + (on ? 1 : 0)); } catch (e) {}
  }
  function homeLayer(key, children) {
    var React = T.React, A = T.rn && T.rn.Animated;
    if (!T.homeLift || !React || !A || !A.View) return children;
    return [React.createElement(A.View, {
      key: key, pointerEvents: 'box-none',
      style: { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080,
               opacity: T.homeLift.interpolate({ inputRange: [-150, 0], outputRange: [0, 1],
                                                 extrapolate: 'clamp' }) } }, children)];
  }
  /* shadow px of an element: its own field, or textShadow with -1 */
  function shadowPx(field) {
    var v = THEME[field];
    return typeof v !== 'number' || v < 0 ? THEME.textShadow : v;
  }
  function shadowOf(create, type, props, key, px) {
    if (px == null) px = THEME.textShadow;
    if (!(px > 0)) return null;
    var d = Math.max(1, Math.round(px / 2));
    var st = [props.style, { color: THEME.textShadowColor || '#000000',
                             opacity: THEME.textShadowOpacity != null ? THEME.textShadowOpacity : 0.7 }];
    /* the shift joins the text's transform (e.g. the scale of the name
       copy) instead of replacing it */
    var base = [];
    (function look(x) {
      if (Array.isArray(x)) x.forEach(look);
      else if (x && Array.isArray(x.transform)) base = x.transform;
    })(props.style);
    var offset = { transform: [{ translateX: d }, { translateY: d }].concat(base) };
    var p = {};
    for (var k in props) p[k] = props[k];
    p.style = st.concat([offset]);
    return create(type, p, key);
  }
  /* ---- name copy that scrolls (nameCopyScroll) ----
     A box with the copy's position and width (overflow hidden); inside it a
     very wide View (SCROLL_WIDE) with the Text on one line, so the Text keeps
     its natural width (put it in a row as wide as the box: on the PS5 the
     Text wrapped to the box width instead, see nameCopyWrap). Wider than the box: translateX goes to -(text - box) at
     nameCopyScrollSpeed px/s, with a pause at each end, and starts again
     when the focused tile changes. Only transform is animated (never
     display). */
  var SCROLL_PAUSE = 1500, SCROLL_WIDE = 8000;
  function canScroll() {
    var React = T.React, A = T.rn && T.rn.Animated;
    return !!(React && typeof React.useState === 'function' && typeof React.useEffect === 'function' &&
              typeof React.useRef === 'function' && A && A.View && typeof A.Value === 'function' &&
              typeof A.timing === 'function');
  }
  function NameScroll(props) {
    var React = T.React, rn = T.rn, A = rn.Animated;
    var st = React.useState(0), tw = st[0], setTw = st[1];
    var rs = React.useState(0), round = rs[0], again = rs[1];
    var x = React.useRef(null);
    if (!x.current) x.current = new A.Value(0);
    var dist = tw - props.width;
    React.useEffect(function () {
      var f = function () { again(function (n) { return n + 1; }); };
      tileListeners.push(f);
      return function () {
        var i = tileListeners.indexOf(f);
        if (i >= 0) tileListeners.splice(i, 1);
      };
    }, []);
    React.useEffect(function () {
      var v = x.current, alive = true, timer = null, anim = null;
      v.setValue(0);
      if (dist > 1) {
        var speed = THEME.nameCopyScrollSpeed > 0 ? THEME.nameCopyScrollSpeed : 60;
        var ms = dist / speed * 1000;
        /* hookTiming divides durations by animationSpeed: undo it here */
        if (A.timing.__theme && THEME.animationSpeed > 0) ms = ms * THEME.animationSpeed;
        var step = function () {
          timer = setTimeout(function () {
            if (!alive) return;
            anim = A.timing(v, { toValue: -dist, duration: ms, useNativeDriver: true,
                                 easing: function (t) { return t; } });
            anim.start(function () {
              if (!alive) return;
              timer = setTimeout(function () {
                if (!alive) return;
                v.setValue(0);
                step();
              }, SCROLL_PAUSE);
            });
          }, SCROLL_PAUSE);
        };
        step();
        if (!T.done['name copy scroll']) done('name copy scroll');
      }
      return function () {
        alive = false;
        if (timer) clearTimeout(timer);
        if (anim) try { anim.stop(); } catch (e) {}
      };
    }, [dist, round, props.text]);
    var onText = function (ev) {
      var l = ev && ev.nativeEvent && ev.nativeEvent.layout;
      var w = l ? l.width : 0;
      if (w > 0 && Math.abs(w - tw) > 0.5) {
        T.scrollLogs = (T.scrollLogs || 0) + 1;
        if (T.scrollLogs <= 6) log('name copy width: ' + Math.round(w) + ' (box ' + props.width + ')');
        setTw(w);
      }
    };
    var create = function (type, p, key) {
      var c = p.children;
      p.key = key;
      delete p.children;
      return React.createElement(type, p, c);
    };
    var texts = [];
    var shadow = shadowOf(create, rn.Text, { numberOfLines: 1,
                                             style: [props.textStyle, { position: 'absolute', left: 0, top: 0 }],
                                             children: props.text }, 'shadow', props.shadow);
    if (shadow) texts.push(shadow);
    texts.push(create(rn.Text, { numberOfLines: 1, style: props.textStyle, children: props.text }, 'text'));
    /* a name that fits keeps the copy's alignment inside the box; until it is
       measured it is not shown (opacity), so it does not jump */
    var j = props.justify || 'flex-start', fits = tw > 0 && dist <= 1;
    var shift = !fits || props.bg ? 0 : j === 'center' ? (props.width - tw) / 2 : j === 'flex-end' ? props.width - tw : 0;
    /* with the background the name waits for its width (the frame would jump) */
    var show = tw > 0 || (j === 'flex-start' && !props.bg) ? 1 : 0;
    var row = React.createElement(A.View, {
      key: 'row',
      style: { flexDirection: 'row', alignItems: 'flex-start', width: SCROLL_WIDE,
               transform: [{ translateX: x.current }] }
    }, React.createElement(rn.View, {
      onLayout: onText,
      style: { marginLeft: shift, opacity: show }
    }, texts));
    if (!props.bg) return React.createElement(rn.View, props.box, row);
    /* nameCopyBg: the background itself is the clipping box (absolute +
       overflow hidden, like the box without background: a clip nested in a
       row was not clipped on the PS5). As wide as the name + padding (up
       to the copy width); the alignment is worked out here. The empty box
       with the copy's width stays for the editor measure. */
    var bg = nameCopyBg(function (t, p, k) { p.key = k; return React.createElement(t, p); }, rn, !show);
    var b = props.box.style, sd = props.clipPad || 0;
    var bw = (tw > 0 ? Math.min(tw + (dist <= 1 ? sd : 0), props.width) : props.width) + 2 * bg.pad;
    var frame = { position: 'absolute', top: b.top, width: bw, overflow: 'hidden',
                  left: b.left + (j === 'center' ? (b.width - bw) / 2 : j === 'flex-end' ? b.width - bw : 0),
                  borderRadius: THEME.nameCopyBgCorners || 0,
                  paddingLeft: bg.pad, paddingRight: bg.pad, paddingTop: bg.padV, paddingBottom: bg.padV + sd };
    if (b.transform) { frame.transform = b.transform; frame.transformOrigin = 'left'; }
    return React.createElement(T.Fragment, null, [
      React.createElement(rn.View, merge({ key: 'measure' }, props.box)),
      React.createElement(rn.View, { key: 'frame', pointerEvents: 'none', style: frame }, [bg.el, row])
    ]);
  }
  /* background of the name copy (nameCopyBg): like the tabs group, an
     absolute View behind the text (own opacity) inside a box with padding
     that takes the width of the name */
  function nameCopyBg(create, rn, hidden) {
    if (!THEME.nameCopyBgOn || !THEME.nameCopyBg) return null;
    var pad = THEME.nameCopyBgPadding || 0, padV = THEME.nameCopyBgPaddingV || 0;
    return {
      pad: pad, padV: padV,
      style: { flexShrink: 1, paddingLeft: pad, paddingRight: pad, paddingTop: padV, paddingBottom: padV },
      el: create(rn.View, {
        pointerEvents: 'none',
        style: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
                 borderRadius: THEME.nameCopyBgCorners || 0, backgroundColor: THEME.nameCopyBg,
                 opacity: hidden ? 0 : THEME.nameCopyBgOpacity == null ? 1 : THEME.nameCopyBgOpacity }
      }, 'theme-copy-bg')
    };
  }
  /* 'left' / 'center' / 'right' -> textAlign / justifyContent */
  var ALIGN = { left: ['left', 'flex-start'], center: ['center', 'center'],
                right: ['right', 'flex-end'] };
  function align(v, flex) {
    var a = ALIGN[value(String(v || ''))];
    return a ? a[flex ? 1 : 0] : null;
  }
  function shift(style, x, y) {
    if ((!x && !y) || !style) return;
    var t = Array.isArray(style.transform) ? style.transform.slice() : [];
    if (x) t.push({ translateX: x });
    if (y) t.push({ translateY: y });
    style.transform = t;
  }
  function shiftY(style, y) { shift(style, 0, y); }
  /* for what takes focus (icons, tabs): the PS5 focus looks for the
     neighbour by layout position, which transform does not change (moved
     icons were still picked at the old place); left/top do change it */
  function shiftFocusable(style, x, y) {
    if (!style || (!x && !y)) return;
    var axis = function (a, b, d) {
      if (!d) return true;
      if (style.position !== 'absolute') {
        style[a] = (typeof style[a] === 'number' ? style[a] : 0) + d;
        return true;
      }
      if (typeof style[a] === 'number') { style[a] += d; return true; }
      if (typeof style[b] === 'number') { style[b] -= d; return true; }
      return false;
    };
    var okX = axis('left', 'right', x), okY = axis('top', 'bottom', y);
    /* absolute without left/top/right/bottom: only transform is left */
    if (!okX || !okY) shift(style, okX ? 0 : x, okY ? 0 : y);
  }
  function hide(style, yes) {
    if (yes && style) style.display = 'none';
  }

  /* ---- measuring the screen for the visual editor ----
     The recognised styles are marked with the element name; when jsx draws
     an element with that style, it gets an onLayout that measures where it
     ended up on screen and logs "layout name x y width height via fields"
     (only when it changes). The editor reads these lines in /layout. */
  var FIELDS = {
    tabs: ['tabsX', 'tabsY'],
    icons: ['iconsX', 'iconsY', 'clockGap'],
    search: ['iconsX', 'iconsY', 'clockGap', 'searchX', 'searchY'],
    settings: ['iconsX', 'iconsY', 'clockGap', 'settingsX', 'settingsY'],
    profile: ['iconsX', 'iconsY', 'clockGap', 'profileX', 'profileY'],
    clock: ['iconsX', 'iconsY', 'clockX', 'clockY'],
    powerBtn: ['iconsX', 'iconsY', 'clockGap', 'powerBtnX', 'powerBtnY', 'powerBtnScale'],
    trophyBtn: ['iconsX', 'iconsY', 'clockGap', 'trophyBtnX', 'trophyBtnY', 'trophyBtnScale'],
    padInfo: ['iconsX', 'iconsY', 'clockGap', 'padInfoX', 'padInfoY', 'padInfoSize', 'padInfoBattery'],
    homeTrophies: ['fakeTrophiesX', 'fakeTrophiesY', 'fakeTrophiesScale', 'fakeTrophiesFontSize'],
    deco1: ['deco1X', 'deco1Y', 'deco1Size'],
    deco2: ['deco2X', 'deco2Y', 'deco2Size'],
    deco3: ['deco3X', 'deco3Y', 'deco3Size'],
    deco4: ['deco4X', 'deco4Y', 'deco4Size'],
    row: ['rowOffsetY', 'tileSize', 'focusSize'],
    tile: ['rowOffsetY', 'tileSize', 'focusSize', 'focusX', 'focusY', 'rowX'],
    fakeTitle: ['fakeTitleX', 'fakeTitleY', 'titleMode', 'nameCopyWidth', 'nameCopyFontSize'],
    logo: ['logoX', 'logoY', 'logoWidth', 'logoHeight'],
    tileName: ['tileNameX', 'tileNameY', 'rowOffsetY', 'focusSize'],
    title: ['titleX', 'titleY'],
    buttons: ['buttonsX', 'buttonsY'],
    footer: ['footerX', 'footerY']
  };
  var marks = new Map();
  T.measures = {};
  function mark(name, style) {
    if (THEME.measureScreen && style != null && !marks.has(style))
      marks.set(style, name);
  }
  function nameOfStyle(st) {
    if (st == null) return null;
    if (Array.isArray(st)) {
      for (var i = 0; i < st.length; i++) {
        var n = nameOfStyle(st[i]);
        if (n) return n;
      }
      return null;
    }
    return marks.get(st) || null;
  }
  function measure(name, ev) {
    var ne = (ev && ev.nativeEvent) || {}, l = ne.layout || {};
    var target = ev && (ev.currentTarget || ev.target);
    var send = function (x, y, w, h, via) {
      if (!(w > 0 && h > 0)) return;
      if (name === 'tile' || name === 'nameCopy') return groupTile(target, [x, y, w, h], via, name);
      var box = [x, y, w, h].map(function (v) { return Math.round(v); }).join(' ');
      if (T.measures[name] === box) return;
      T.measures[name] = box;
      var fields = (FIELDS[name] || []).map(function (k) { return k + '=' + THEME[k]; });
      log('layout ' + name + ' ' + box + ' ' + via + ' ' + fields.join(','));
    };
    try {
      if (target && typeof target.measureInWindow === 'function')
        return target.measureInWindow(function (x, y, w, h) { send(x, y, w, h, 'window'); });
    } catch (e) {}
    try {
      var tag = typeof ne.target === 'number' ? ne.target : target;
      var um = T.rn && T.rn.UIManager;
      if (typeof tag === 'number' && um && typeof um.measureInWindow === 'function')
        return um.measureInWindow(tag, function (x, y, w, h) { send(x, y, w, h, 'window'); });
    } catch (e) {}
    send(l.x || 0, l.y || 0, l.width || 0, l.height || 0, 'relative');
  }
  /* All tiles use the same style (and each tile has its own name copy):
     the measures of one pass are joined into a single line
     "layout tiles|nameCopies <box of all> window fields xs=x:y:w/...".
     After a game is uninstalled or installed only 1-2 tiles get onLayout, so
     every tile seen so far is measured again when the pass ends (settled
     positions); the ones that are gone (no size) leave the list. */
  var groups = {};
  function groupTile(target, box, via, name) {
    if (via !== 'window' || !target) return;
    var g = groups[name] || (groups[name] = { map: new Map(), timer: 0 });
    g.map.set(target, box);
    clearTimeout(g.timer);
    g.timer = setTimeout(function () {
      g.timer = 0;
      var targets = [], left = 0, ended = false, answered = new Set();
      g.map.forEach(function (b, t) { targets.push(t); });
      var end = function () {
        if (ended) return;
        ended = true;
        targets.forEach(function (t) { if (!answered.has(t)) g.map.delete(t); });
        flushTiles(g, name);
      };
      targets.forEach(function (t) {
        if (typeof t.measureInWindow !== 'function') return;
        left++;
        try {
          t.measureInWindow(function (x, y, w, h) {
            if (ended) return;
            answered.add(t);
            if (w > 0 && h > 0) g.map.set(t, [x, y, w, h]);
            else g.map.delete(t);
            if (--left === 0) end();
          });
        } catch (e) { g.map.delete(t); left--; }
      });
      if (!left) end();
      else setTimeout(end, 300);
    }, 400);
  }
  function flushTiles(g, name) {
    var list = [];
    g.map.forEach(function (b) { list.push(b.map(Math.round)); });
    list.sort(function (a, b) { return a[0] - b[0]; });
    if (!list.length) return;
    var x0 = list[0][0], y0 = list[0][1], x1 = x0, y1 = y0;
    list.forEach(function (b) {
      x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]);
      x1 = Math.max(x1, b[0] + b[2]); y1 = Math.max(y1, b[1] + b[3]);
    });
    var xs = list.map(function (b) { return b[0] + ':' + b[1] + ':' + b[2]; }).join('/');
    /* per space too (Games / Media) */
    var key = name + ':' + (T.space || '');
    if (T.measures[key] === xs) return;
    T.measures[key] = xs;
    var fields = FIELDS[name].map(function (k) { return k + '=' + THEME[k]; });
    /* the editor reads tiles / nameCopies (Games); Media gets its own names */
    var label = (name === 'tile' ? 'tiles' : 'nameCopies') + (T.space === 'media' ? 'Media' : '');
    log('layout ' + label + ' ' + [x0, y0, x1 - x0, y1 - y0].join(' ') + ' window ' + fields.join(',') + ' xs=' + xs);
  }
  function withMeasure(name, props) {
    var before = props.onLayout;
    props.onLayout = function (ev) {
      if (typeof before === 'function') before.apply(this, arguments);
      try { measure(name, ev); } catch (e) {}
    };
  }

  /* ---- custom tiles (names) ----
     Pictures in /data/ZhiThemes/Assets/customtile, listed by ZhiThemes at every
     Home start (globalThis.__ztCustomTiles): <titleId>_<format>_<n>.png|jpg,
     format 1x1 for square tiles and 2x3 for vertical ones (the SteamGridDB
     download will add the next n). With customTilesOn every game that has
     pictures of the tile's format shows its picture 1, or the one picked in
     the Options menu (customTileChoice 'ID:n', 0 = its own icon). Games
     only: a folder's own picture is the one uploaded in the editor (kept in
     customtile by full path). The <Tile /> (module 618) draws Image
     {source: {uri: icon + texture options}, style: sheet 152 image}; the
     titleId comes from the uri (/user/appmeta/<id>/ or, for homebrew,
     /user/app/<id>/sce_sys/). The file list and the choices do not change
     while the Home runs (a change reloads it): worked out once. */
  var CUSTOM_DIR = '/user/data/ZhiThemes/Assets/customtile/';
  var customFiles = null, customPicks = null;
  function tileFormat() { return tileRatio() !== 1 ? '2x3' : '1x1'; }
  function customKey(id) {
    if (typeof id !== 'string' || !id || id.indexOf(FOLDER) === 0 || /^NPXS/.test(id)) return '';
    return id.replace(/_\d+$/, '').toUpperCase();
  }
  /* pictures of a game in the tile's format (or fmt): [{n, file}] by n */
  var customByFmt = {};
  function customPics(key, fmt) {
    fmt = fmt || tileFormat();
    var all = customByFmt[fmt];
    if (!all) {
      all = customByFmt[fmt] = {};
      var list = globalThis.__ztCustomTiles;
      (Array.isArray(list) ? list : []).forEach(function (f) {
        var m = /^([A-Za-z]{4}\d{5})_(\d+x\d+|logo)_(\d+)\.(png|jpe?g)$/i.exec(String(f));
        if (!m || m[2].toLowerCase() !== fmt) return;
        var id = m[1].toUpperCase();
        (all[id] = all[id] || []).push({ n: parseInt(m[3], 10), file: String(f) });
      });
      for (var id in all) all[id].sort(function (x, y) { return x.n - y.n; });
    }
    if (fmt === tileFormat()) customFiles = all;
    return key ? all[key] || [] : [];
  }
  /* 'ID/2x3:n' / 'ID/1x1:n' = the choice of one format (the folder's
     square mosaic changed with the vertical tile's choice); 'ID:n' = both formats */
  function customChoices() {
    var out = [];
    String(THEME.customTileChoice || '').split(';').forEach(function (t) {
      var m = /^\s*([A-Za-z]{4}\d{5})(?:\/(\d+x\d+|logo))?\s*:\s*(\d+)\s*$/i.exec(t);
      if (m) out.push({ id: m[1].toUpperCase(), fmt: (m[2] || '').toLowerCase(), n: parseInt(m[3], 10) });
    });
    return out;
  }
  function choiceText(c) { return c.id + (c.fmt ? '/' + c.fmt : '') + ':' + c.n; }
  /* the n picked for a game in a format (the tiles' one when not given;
     1 when not listed, 0 = its own icon) */
  function customChoice(key, fmt) {
    if (!customPicks) {
      customPicks = {};
      customChoices().forEach(function (c) { customPicks[c.id + (c.fmt ? '/' + c.fmt : '')] = c.n; });
    }
    fmt = fmt || tileFormat();
    var k = key + '/' + fmt;
    /* the old 'ID:n' was for the square / vertical tiles only */
    return k in customPicks ? customPicks[k] : key in customPicks && (fmt === '1x1' || fmt === '2x3') ? customPicks[key] : 1;
  }
  /* the picture a game's tile shows instead of its icon: {n, file, index, count} or null (fmt: another format, the focused tile's) */
  function customPick(id, fmt) {
    var key = customKey(id);
    if (!key || THEME.customTilesOn === false) return null;
    var pics = customPics(key, fmt), c = customChoice(key, fmt);
    if (!pics.length || c === 0) return null;
    var i = 0;
    for (var k = 0; k < pics.length; k++) if (pics[k].n === c) i = k;
    return { n: pics[i].n, file: pics[i].file, index: i, count: pics.length };
  }
  function tilePicture(id) {
    var p = customPick(id);
    return p ? CUSTOM_DIR + p.file : null;
  }

  /* ---- animated tiles ----
     The editor turns an animated picture (WebP / APNG from SteamGridDB, or
     an upload) into <name>.png (still, first frame) + <name>.mp4 (H.264) in
     customtile. Every tile shows the PNG; the focused one also plays the
     MP4 over it (RCTVideoPS, http://127.0.0.1:4445/t/<name>.mp4, served by
     ZhiThemes like the video wallpaper), shown once it plays. One video at
     a time, so the decoder stays free. */
  var animFiles = null;
  function animTilesUsed() {
    if (APP !== 'home' || THEME.tileAnimOn === false || THEME.customTilesOn === false) return false;
    if (!animFiles) {
      animFiles = {};
      var n = 0;
      (Array.isArray(globalThis.__ztCustomTiles) ? globalThis.__ztCustomTiles : []).forEach(function (f) {
        var m = /^([A-Za-z]{4}\d{5}_(?:\d+x\d+)_\d+)\.mp4$/i.exec(String(f));
        if (m) { animFiles[m[1].toLowerCase()] = String(f); n++; }
      });
      log('animated tiles: ' + n + ' videos' + (n ? ' (' + Object.keys(animFiles).slice(0, 4).join(', ') + ')' : ''));
      T.animCount = n;
    }
    return T.animCount > 0;
  }
  /* the video of a tile picture uri when it is the focused game's: the mp4 name or '' */
  function animVideoFor(uri) {
    var path = uriPath(uri), m = /\/customtile\/(([A-Za-z]{4}\d{5})_\d+x\d+_\d+)\.(png|jpe?g)$/i.exec(path);
    if (!m) return '';
    var file = animFiles[m[1].toLowerCase()];
    if (!file) return '';
    var focused = customKey(T.shapeFocus || T.strandSel || '');
    if (focused && focused === m[2].toUpperCase()) return { file: file, focused: true, play: true };
    /* not focused: the same elements, no player (the Image is not made again on focus) */
    return { file: file, focused: false, play: !!THEME.tileAnimAll };
  }
  /* the video of a picture path (open folder), '' without one */
  function animFileFor(path) {
    if (!animTilesUsed()) return '';
    var m = /\/customtile\/([A-Za-z]{4}\d{5}_\d+x\d+_\d+)\.(png|jpe?g)$/i.exec(uriPath(path));
    return m && animFiles[m[1].toLowerCase()] || '';
  }
  var animLogs = 0;
  T.animLive = 0;
  function AnimTileVideo(props) {
    var React = T.React, rn = T.rn, Video = videoComponent();
    var ready = React.useState(false), shown = ready[0], setShown = ready[1];
    var wait = React.useState(false), mounted = wait[0], setMounted = wait[1];
    var tries = React.useState(0), attempt = tries[0], setAttempt = tries[1];
    var restarts = React.useState(0), restart = restarts[0], setRestart = restarts[1];
    var kinds = ['fullHD', '', 'UHD'];
    var me = React.useState(function () { return {}; })[0];
    React.useEffect(function () {
      /* one player per video: the focused game is also in the rows of
         the other tabs (Favourites, Recently played...), hidden; a second
         player of the same file took the decoder and the visible tile
         stood still. The first one (the shown row) keeps it; another
         waits until it is gone. */
      var key = (props.dir || 't') + '/' + props.file;
      T.animOwner = T.animOwner || {};
      T.animWait = T.animWait || {};
      var counted = false, owned = false, t = null, alive = true;
      var start = function () {
        /* gone already (the row unmounted it with the owner): it must
           not take the video, or no player of this file ever starts again */
        if (!alive) return;
        if (T.animOwner[key] && T.animOwner[key] !== me) {
          (T.animWait[key] = T.animWait[key] || []).push(start);
          if (animLogs < 16) { animLogs++; log('animated tile: ' + props.file + ' already playing in another row, this one waits'); }
          return;
        }
        T.animOwner[key] = me; owned = true;
        var max = Math.max(1, +THEME.tileAnimAllMax || 6);
        if (!props.focused && T.animLive >= max) return;
        counted = true; T.animLive++;
        setMounted(true);
      };
      /* no wait, so it starts at once; only while the row moves fast
         (focus changes less than 220 ms apart) a short one, so passing
         tiles start no player; not focused (tileAnimAll) 350 ms */
      var ms = props.wait != null ? props.wait : props.focused ? (T.focusGap < 220 ? 160 : 0) : 350;
      t = setTimeout(start, ms);
      return function () {
        alive = false;
        clearTimeout(t);
        if (counted) T.animLive--;
        var w = T.animWait[key];
        if (w) { var i = w.indexOf(start); if (i >= 0) w.splice(i, 1); }
        if (owned && T.animOwner[key] === me) {
          delete T.animOwner[key];
          /* the next one still there (the others went in the same pass) */
          setTimeout(function () {
            var n2 = w && w.shift();
            while (n2) { n2(); if (T.animOwner[key]) break; n2 = w.shift(); }
          }, 0);
        }
      };
    }, [props.file]);
    if (!Video || !mounted || attempt >= kinds.length) return null;
    var uri = 'http://127.0.0.1:4445/' + (props.dir || 't') + '/' + props.file, kind = kinds[attempt];
    var source = { source: uri, autoLoad: true };
    if (kind) source.coreResourceType = kind;
    if (animLogs < 16 && T.animLogged !== uri + kind) {
      T.animLogged = uri + kind; animLogs++;
      log((props.dir === 'b' ? 'animated background: ' : 'animated tile: ') + props.file + ' ' + Math.round(props.w) + 'x' + Math.round(props.h) + ' (' + (kind || 'no resource type') + ')');
    }
    /* the native view K times bigger, scaled down (the focused tile is
       scaled up by the row: a view of the small size looked soft); the
       wrapper clips it with the tile's corners. PS5 RN scales from the
       centre: the big view is centred on the box. */
    var K = props.k || 1, w = props.w, h = props.h, radius = props.radius || 0;
    var video = React.createElement(Video, {
      key: 'at' + attempt + '-' + restart,
      pointerEvents: 'none',
      source: source,
      repeat: true, paused: false, muted: true, volume: 0, resizeMode: 'cover',
      /* a native video view stops the game's own music (BGM) unless told
         not to (ReactVideoView.bgmSuppressionDisabled is false by default):
         a muted tile must leave the game's sound playing */
      suppressBgm: false,
      onStartPlaying: function (e) {
        setShown(true);
        var what = props.dir === 'b' ? 'animated background' : 'animated tile';
        if (!T.done[what]) { videoEvent(what + ' playing', e); done(what + ': ' + props.file); }
      },
      onLoad: function (e) { setShown(true); videoEvent('tile load', e); },
      onError: function (e) {
        videoEvent('tile error', e);
        setShown(false);
        if (attempt + 1 >= kinds.length) log('animated tile: ' + props.file + ' not played (no resource type worked)');
        setAttempt(attempt + 1);
      },
      onEnd: function () { if (restart < 200) setTimeout(function () { setRestart(restart + 1); }, 50); },
      style: K === 1 ? { position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: radius }
                     : { position: 'absolute', left: -(K - 1) * w / 2, top: -(K - 1) * h / 2, width: w * K, height: h * K,
                         borderRadius: radius * K, transform: [{ scale: 1 / K }] }
    });
    /* not invisible while loading (a hidden native player can stall) */
    return React.createElement(rn.View, {
      pointerEvents: 'none',
      style: { position: 'absolute', left: props.left || 0, top: props.top || 0, width: w, height: h,
               borderRadius: radius, overflow: 'hidden', opacity: shown ? 1 : 0.01 }
    }, video);
  }
  /* jsx: the focused tile's Image + its video over it (null = nothing to play) */
  function animTileWrap(fn, self, args, props) {
    var hit = animVideoFor(props.source && props.source.uri);
    /* every tile picture the same way (Fragment[Image, video or null]),
       so the Image is never made again when the focus (and the focus shape's
       picture) changes */
    if (!hit) return T.React.createElement(T.React.Fragment, { key: args[2] }, fn.apply(self, args), null);
    var file = hit.file;
    var rn = T.rn, React = T.React;
    var st = rn.StyleSheet && rn.StyleSheet.flatten ? rn.StyleSheet.flatten(props.style) || {} : {};
    var w = typeof st.width === 'number' ? st.width : THEME.tileSize, h = typeof st.height === 'number' ? st.height : tileHeight();
    return React.createElement(React.Fragment, { key: args[2] },
      fn.apply(self, args),
      !hit.play ? null : React.createElement(AnimTileVideo, { key: 'v', file: file, w: w, h: h, left: st.left, top: st.top, k: 3, focused: hit.focused,
                                           /* the row's corners (exp.BORDER_RADIUS, the tile's units) */
                                           radius: typeof st.borderRadius === 'number' ? st.borderRadius : +THEME.tileCorners || 0 }));
  }

  /* ---- game logo ----
     Like the fake title, drawn by the Home in its front layer at its own
     screen box (logoX/Y/Width/Height): the picture <titleId>_logo_<n>.png
     of customtile (uploaded or a SteamGridDB logo, trimmed in the editor),
     choice 'ID/logo:n' in customTileChoice (not listed = the first, 0 = no
     logo). ZhiThemes reads the PNG sizes (globalThis.__ztLogoSizes) so the
     logo can sit left / right / top / bottom in the box; without a size it
     is centred (resizeMode contain). The game: the row's onFocus item (as
     the fake title), the strand's selectedItem before it, the highlighted
     game of an open folder. Folders and system tiles have no logo. */
  var logoListeners = [];
  function logoOn() { return APP === 'home' && !!THEME.logoOn; }
  function logoIdSet(id) {
    if (typeof id !== 'string' || T.logoId === id) return;
    T.logoId = id;
    setTimeout(function () {
      logoListeners.forEach(function (f) { try { f(id); } catch (e) {} });
    }, 0);
  }
  function logoGameId() {
    var g = stripGame();
    return g ? g.game.id : T.logoId || '';
  }
  /* animated logos were removed : the PS5 has no video
     with transparency, a moved sprite sheet is not clipped and
     frames swapped by opacity flickered. Logos are still pictures. */
  /* the logo file of a game: {file, path, w, h} or null */
  function logoPick(id) {
    var key = customKey(id);
    if (!key) return null;
    var pics = customPics(key, 'logo'), c = customChoice(key, 'logo');
    if (!pics.length || c === 0) return null;
    var p = pics[0];
    pics.forEach(function (x) { if (x.n === c) p = x; });
    var sizes = globalThis.__ztLogoSizes, sz = sizes && sizes[p.file];
    return { file: p.file, path: CUSTOM_DIR + p.file,
             w: sz && sz[0] > 0 ? sz[0] : 0, h: sz && sz[1] > 0 ? sz[1] : 0 };
  }
  function logoShown() {
    return logoOn() ? logoPick(logoGameId()) : null;
  }
  function logoElement(p) {
    var React = T.React, rn = T.rn;
    var bw = Number(THEME.logoWidth) || 640, bh = Number(THEME.logoHeight) || 220;
    var left = Number(THEME.logoX) || 0, top = Number(THEME.logoY) || 0;
    var w = bw, h = bh, mode = 'contain';
    if (p.w && p.h) {
      var k = Math.min(bw / p.w, bh / p.h);
      w = Math.max(1, Math.round(p.w * k));
      h = Math.max(1, Math.round(p.h * k));
      mode = 'stretch';
      var al = String(THEME.logoAlign || 'left').toLowerCase(), va = String(THEME.logoVAlign || 'top').toLowerCase();
      left += al === 'right' ? bw - w : al === 'center' || al === 'centre' ? Math.round((bw - w) / 2) : 0;
      top += va === 'top' ? 0 : va === 'center' || va === 'centre' ? Math.round((bh - h) / 2) : bh - h;
    }
    var op = THEME.logoOpacity == null || THEME.logoOpacity === '' ? 1 : Number(THEME.logoOpacity);
    var props = { pointerEvents: 'none', style: { position: 'absolute', left: left, top: top, width: w, height: h, opacity: op } };
    if (THEME.measureScreen) withMeasure('logo', props);
    return React.createElement(rn.View, props,
      React.createElement(rn.Image, { source: { uri: 'file://' + p.path }, resizeMode: mode, style: { width: w, height: h } }));
  }
  function GameLogo() {
    var React = T.React;
    var tick = React.useState(0)[1];
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      logoListeners.push(f);
      nameListeners.push(f);
      folderListeners.push(f);
      return function () {
        [logoListeners, nameListeners, folderListeners].forEach(function (list) {
          var i = list.indexOf(f);
          if (i >= 0) list.splice(i, 1);
        });
      };
    }, []);
    var p = logoShown();
    if (!p || !T.rn || !T.rn.Image) return null;
    if (!T.done['game logo']) done('game logo: ' + p.file + (p.w ? ' ' + p.w + 'x' + p.h : ' (size unknown, centred)'));
    return nameAnim('theme-logo-anim', p.file, logoElement(p));
  }

  /* ---- focusShape: the focused tile in another shape ----
     The row stays square (1x1) or vertical (2x3); the focused tile can be
     vertical (square row only) or the Steam horizontal capsule (92x43).
     every focused tile takes it (games, folders, system tiles): the
     game's custom tile of that format if it has one, else its own picture
     cut to the shape (cover); a folder with a mosaic gets a mosaic of that
     shape. The focused tile keeps the row's focused height and its width
     changes (Steam: wider, like the Steam Deck; vertical: narrower); the
     tiles after it move by the difference (offsets of selectedN, as
     rowGapAfter) and so does the tile name next to it.
     The row's items do not draw again when the focus moves (the carousel
     animates natively), so each item gets a small component
     (FocusShapeSlot) around its focusable view (testID focused-item-<ID>,
     the one the native focus frame follows, sized by its children); the
     row's onFocus({item}) tells it (shapeFocusSet). Focused, it gives that
     view the new width and the <Tile /> element a new prop, so the Tile
     draws again: its image wrapper (testID experience-switcher-<ID>) and
     Image (found by its uri) get the shape's size and picture. */
  function focusFormat() {
    var v = String(THEME.focusShape || '').trim();
    var f = v === 'steam' ? '92x43' : v === 'vertical' ? '2x3' : '';
    return f && f !== tileFormat() ? f : '';
  }
  function formatRatio(f) { return f === '2x3' ? 1.5 : f === '92x43' ? 43 / 92 : 1; }
  /* the focused shape in the row's (unscaled) tile size: same height */
  function shapeBox() {
    var h = tileHeight();
    return { w: Math.round(h / formatRatio(focusFormat())), h: h };
  }
  /* screen px the tiles after the focused one move (the focused scale) */
  function shapeExtra() {
    if (APP !== 'home' || !focusFormat()) return 0;
    return Math.round(THEME.focusSize * (shapeBox().w / THEME.tileSize - 1));
  }
  function focusShapeUsed() { return APP === 'home' && !!focusFormat(); }
  /* the focus slot also redraws the focused tile for its video */
  function focusSlotUsed() { return focusShapeUsed() || animTilesUsed(); }
  /* a folder's mosaic in the focused shape (made by ZhiThemes when asked) */
  function folderFocusPicture(id) {
    var f = folderList()[parseInt(id.slice(FOLDER.length), 10)];
    if (!f || (f.icon && f.icon !== 'auto' && !/^zt_folder_/.test(f.icon))) return null;
    var mo = mosaicFor(f.ids, f.color || THEME.foldersColor || '#24345a', f.alpha, focusFormat());
    T.mosaicAsked = T.mosaicAsked || {};
    T.shapeMosaicAt = T.shapeMosaicAt || {};
    if (!T.mosaicAsked[mo.name]) {
      T.mosaicAsked[mo.name] = true;
      T.shapeMosaicAt[mo.name] = Date.now();
      try { console.log('THEME-MOSAIC ' + mo.msg); } catch (e) {}
    }
    /* a new one is still being made: another uri a moment later, so the
       Image loads it again (the first try found no file) */
    var young = Date.now() - (T.shapeMosaicAt[mo.name] || 0) < 3000;
    return ztPath('cache/mosaics', mo.name) + (young ? '?n' : '');
  }
  /* the focused shape's own picture, or null (the tile's picture, cut) */
  function focusPicture(id) {
    var f = focusFormat();
    if (!f || typeof id !== 'string') return null;
    if (id.indexOf(FOLDER) === 0) return folderFocusPicture(id);
    var p = customPick(id, f);
    return p ? CUSTOM_DIR + p.file : null;
  }
  var shapeSubs = {}, shapeLogs = 0;
  T.shapeOn = {};   /* item id -> {pic} while its tile has the focused shape */
  T.shapeUri = {};  /* picture path of a shaped tile -> item id (the Image only knows its uri) */
  function shapeFocused(id) { return (T.shapeFocus || T.strandSel) === id; }
  function shapeFocusSet(id) {
    if (typeof id !== 'string' || !id || id === T.shapeFocus) return;
    var old = T.shapeFocus || T.strandSel;
    T.shapeFocus = id;
    /* how fast the row moves (the animated tile / background start at once unless it moves fast) */
    var now = Date.now();
    T.focusGap = T.lastFocusMove ? now - T.lastFocusMove : 1e9;
    T.lastFocusMove = now;
    /* the animated background follows the row's focus at once (before the Home's background request) */
    if (APP === 'home' && bgVideoFiles && T.bgVideoCount > 0)
      setTimeout(function () { tileListeners.forEach(function (f) { try { f(); } catch (e) {} }); }, 0);
    [old, id].forEach(function (k) {
      (shapeSubs[k] || []).forEach(function (bump) {
        try { bump(function (n) { return n + 1; }); } catch (e) {}
      });
    });
  }
  function useShapeFocus(id) {
    var React = T.React, st = React.useState(0), bump = st[1];
    React.useEffect(function () {
      var list = shapeSubs[id] = shapeSubs[id] || [];
      list.push(bump);
      return function () {
        var i = list.indexOf(bump);
        if (i >= 0) list.splice(i, 1);
      };
    }, [id]);
  }
  function uriPath(u) {
    if (u && typeof u === 'object') u = u.uri;
    return typeof u === 'string' ? u.replace(/^file:\/\//, '').split('?')[0] : '';
  }
  function shapeUriFor(uri) {
    var p = uriPath(uri);
    var id = p && T.shapeUri[p];
    if (id && T.shapeOn[id]) return id;
    /* a game's icon by its title id (the uri may differ from iconPath) */
    var key = uriTitle(uri);
    if (key) for (var k in T.shapeOn) if (customKey(k) === key) return k;
    return '';
  }
  /* the <Tile /> element inside the focusable view gets __ztShape */
  function shapeClone(el, depth, id) {
    if (!el || typeof el !== 'object' || depth > 6) return el;
    if (Array.isArray(el)) {
      var changed = false;
      var out = el.map(function (c) {
        var r = shapeClone(c, depth, id);
        if (r !== c) changed = true;
        return r;
      });
      return changed ? out : el;
    }
    var p = el.props;
    if (!p || typeof p !== 'object') return el;
    if ('iconPath' in p && typeof p.testID === 'string' && p.testID.indexOf('experience-switcher-') === 0) {
      [p.iconPath, p.fallbackIconPath].forEach(function (u) { var q = uriPath(u); if (q) T.shapeUri[q] = id; });
      return T.React.cloneElement(el, { __ztShape: focusFormat() + (T.shapeOn[id].pic ? ':' + T.shapeOn[id].pic : '') });
    }
    var kids = shapeClone(p.children, depth + 1, id);
    return kids === p.children ? el : T.React.cloneElement(el, { children: kids });
  }
  function shapeDrop(id) {
    if (!T.shapeOn[id]) return;
    delete T.shapeOn[id];
    for (var u in T.shapeUri) if (T.shapeUri[u] === id) delete T.shapeUri[u];
  }
  /* the <Tile /> gets __ztAnim (it draws again, with its video) */
  function animClone(el, depth, id) {
    if (!el || typeof el !== 'object' || depth > 6) return el;
    if (Array.isArray(el)) {
      var changed = false;
      var out = el.map(function (c) { var r = animClone(c, depth, id); if (r !== c) changed = true; return r; });
      return changed ? out : el;
    }
    var p = el.props;
    if (!p || typeof p !== 'object') return el;
    if ('iconPath' in p && typeof p.testID === 'string' && p.testID.indexOf('experience-switcher-') === 0)
      return T.React.cloneElement(el, { __ztAnim: id });
    var kids = animClone(p.children, depth + 1, id);
    return kids === p.children ? el : T.React.cloneElement(el, { children: kids });
  }
  function FocusShapeSlot(props) {
    var id = props.id, el = props.el;
    useShapeFocus(id);
    if (!shapeFocused(id)) { shapeDrop(id); return el; }
    if (!focusShapeUsed()) return T.React.cloneElement(el, { children: animClone(el.props.children, 0, id) });
    var pic = focusPicture(id), box = shapeBox();
    T.shapeOn[id] = { pic: pic };
    /* the square folders' marginTop goes: the shape has the full height */
    var st = [].concat(el.props.style || []).filter(function (s) {
      return !(s && typeof s === 'object' && !Array.isArray(s) && Object.keys(s).length === 1 && 'marginTop' in s);
    });
    st.splice(1, 0, { width: box.w });
    if (shapeLogs++ < 8)
      log('focus shape: ' + id + ' ' + box.w + 'x' + box.h + ' (row tile ' + THEME.tileSize + 'x' + tileHeight() +
          ', next tiles +' + shapeExtra() + ' px) ' + (pic ? '-> ' + pic.split('/').pop() : '(own picture cut)'));
    if (!T.done['focus shape']) done('focus shape');
    return T.React.cloneElement(el, { style: st, children: shapeClone(el.props.children, 0, id) });
  }
  /* jsx: every item's focusable view */
  function focusShapeWrap(fn, self, args, props) {
    var id = props.testID.slice('focused-item-'.length);
    if (!id) return null;
    /* unfocused, a square folder keeps its place (folderSquareView runs later in the jsx hook) */
    if (tileRatio() !== 1 && THEME.folders && folderVerticalStyle() === 'square')
      try { folderSquareView(props); } catch (e) { T.errors++; log('folder square: ' + e); }
    /* the folder tile's keys (left/right in the open folder, back
       closes it) are on this view: set before it is made (returned it
       before the jsx hook got to folderTileKeys: the folder did not close) */
    if (THEME.folders || DEBUG.on)
      try { folderTileKeys(props); } catch (e) { T.errors++; log('folder keys: ' + e); }
    return fn(FocusShapeSlot, { id: id, el: fn.apply(self, args) }, args[2]);
  }
  /* jsx inside the <Tile />: image wrapper (testID experience-switcher-<ID>) */
  function shapeWrapper(props) {
    var id = props.testID.slice('experience-switcher-'.length);
    if (!T.shapeOn[id] || !props.style) return false;
    var box = shapeBox();
    props.style = [].concat(props.style, { width: box.w, height: box.h });
    return true;
  }
  /* the tile's Image: the shape's size, and its picture when it has one
     (true = the picture was changed: no other cover) */
  function shapeImage(props) {
    var src = props.source, old = src.uri, id = shapeUriFor(old);
    if (!id) return false;
    var box = shapeBox(), pic = T.shapeOn[id].pic;
    props.style = [props.style, { width: box.w, height: box.h, resizeMode: 'cover' }];
    var out = {};
    for (var k in src) out[k] = src[k];
    if (pic) out.uri = withScheme(pic, old);
    /* texture size: the shape's (the Home asks for the row's) */
    if (out.resize && typeof out.resize === 'object' && typeof out.resize.width === 'number') {
      var rz = {}, kx = out.resize.width / THEME.tileSize;
      for (var r in out.resize) rz[r] = out.resize[r];
      rz.width = Math.round(box.w * kx);
      rz.height = Math.round(box.h * kx);
      out.resize = rz;
    }
    props.source = out;
    return !!pic;
  }
  /* the tile shadow follows the shape (tileShadow, top = where the tile starts) */
  function ShapeShadow(props) {
    useShapeFocus(props.id);
    if (!shapeFocused(props.id)) return tileShadow(props.top);
    return tileShadow(0, shapeBox().w - THEME.tileSize);
  }
  function withScheme(path, like) { return (/^file:/.test(String(like || '')) ? 'file://' : '') + path; }
  function uriTitle(uri) {
    var m = /\/user\/app(?:meta)?\/([A-Z]{4}\d{5})(?:_\d+)?\//.exec(String(uri || ''));
    return m ? m[1] : '';
  }
  var coverLogs = 0;
  function tileCover(props) {
    var src = props.source, old = src.uri, id = uriTitle(old);
    var path = id ? tilePicture(id) : null;
    if (!path) return;
    var out = {};
    for (var k in src) out[k] = src[k];
    out.uri = withScheme(path, old);
    props.source = out;
    if (coverLogs++ < 8) log('cover: ' + id + ' ' + old + ' -> ' + out.uri);
    if (!T.done['tile pictures']) done('tile pictures');
  }
  /* system tiles in vertical rows (see wrapJsx). an older version drew the
     square icon smaller in the middle (its own dark square showed); now
     ZhiThemes makes a copy of the icon of the tile's shape, the square in
     the middle and its plain top / bottom rows repeated
     (THEME-TALLICON, cache/icons/zt_sys_<id>_r<ratio>.png, made before the
     console call returns) */
  /* also the Store (NPXS40047) and the Media Gallery (NPXS40075), same kind of icon */
  var SYSTEM_TILE = /NPXS40(071|139|056|047|075)/;
  var systemLogs = 0, tallAsked = {};
  function systemTile(props, ratio) {
    if (!props.source || typeof props.source !== 'object' || !SYSTEM_TILE.test(String(props.source.uri || ''))) return;
    var out = {};
    for (var k in props.source) out[k] = props.source[k];
    out.uri = tallIconUri(props.source.uri, ratio);
    props.source = out;
    if (!T.done['vertical system tiles']) done('vertical system tiles');
  }
  /* the tall copy of a system tile's icon (asked for once), also for the
     Game/App Library grid */
  function tallIconUri(old, ratio) {
    old = String(old);
    /* 1.5 -> r1.5 (as before), Steam 43/92 -> r0.467 (a wider copy) */
    ratio = Math.round((ratio || tileRatio()) * 1000) / 1000;
    var src = old.replace(/^file:\/\//, '').split('?')[0];
    var m = /(NPXS\d{5})\/icon0\.png$|apps\/(NPXS\d{5})\//.exec(src);
    var id = m ? m[1] || m[2] : 'NPXS00000';
    if (/^\/system_ex\/rnps\/apps\/NPXS40016\/appdb\/NPXS40056\//.test(src)) id = 'NPXS40056';
    if (/\/appdb\/NPXS40139\//.test(src)) id = 'NPXS40139';
    var name = 'zt_sys_' + id + '_r' + ratio + '.png';
    if (!tallAsked[name]) {
      tallAsked[name] = true;
      try { console.log('THEME-TALLICON ' + src + '|' + name + '|' + ratio); } catch (e) {}
    }
    if (systemLogs++ < 6) log('system tile (' + APP + '): ' + src + ' -> ' + name);
    return withScheme(ztPath('cache/icons', name), old);
  }
  /* folder mosaic: a game's own picture (.png only: the mosaic maker reads
     PNG), else its icon */
  function mosaicIcon(id, icon) {
    var path = tileRatio() !== 1 && folderVerticalStyle() === 'square' ? squarePicture(id) : tilePicture(id);
    return path && /\.png$/i.test(path) ? path : icon;
  }
  var customUsed = null;
  function customTilesUsed() {
    if (customUsed === null) {
      customUsed = false;
      if (APP === 'home' && THEME.customTilesOn !== false) {
        customPics('');
        for (var id in customFiles) { customUsed = true; break; }
      }
      log('custom tiles: ' + (customUsed ? Object.keys(customFiles).length + ' games with ' + tileFormat() + ' pictures' : 'none') +
          ' (' + (Array.isArray(globalThis.__ztCustomTiles) ? globalThis.__ztCustomTiles.length : 0) + ' files)');
    }
    return customUsed;
  }
  /* Options menu of a game with pictures of the tile's format: next picture
     (n of N) and own icon, or "Use custom tile" when it shows its icon */
  function customMenuItems(id) {
    var key = customKey(id);
    if (!key || THEME.customTilesOn === false) return [];
    var pics = customPics(key);
    if (!pics.length) return [];
    var p = customPick(id);
    if (!p) return [menuItem('zt-tile-on', 'Use custom tile', 'zttile:set?' + key + ',' + pics[0].n)];
    var items = [];
    if (p.count > 1) {
      var next = pics[(p.index + 1) % p.count];
      items.push(menuItem('zt-tile-next', 'Next custom tile (' + ((p.index + 1) % p.count + 1) + ' of ' + p.count + ')',
                          'zttile:set?' + key + ',' + next.n));
    }
    items.push(menuItem('zt-tile-off', 'Use original tile', 'zttile:set?' + key + ',0'));
    return items;
  }
  function customAction(url) {
    var m = /^zttile:set\?([A-Za-z]{4}\d{5}),(\d+)$/.exec(url);
    if (!m) return;
    var key = m[1].toUpperCase(), n = parseInt(m[2], 10), pics = customPics(key);
    /* picture 1 (the first) is the default: not written. only this
       format's choice changes; an old 'ID:n' stays as the other format's */
    var fmt = tileFormat(), other = fmt === '2x3' ? '1x1' : '2x3', list = [], old = null, otherSet = false;
    customChoices().forEach(function (c) {
      if (c.id !== key) list.push(c);
      else if (!c.fmt) old = c;
      else if (c.fmt === other) { list.push(c); otherSet = true; }
    });
    if (old && !otherSet) list.push({ id: key, fmt: other, n: old.n });
    if (!(pics.length && n === pics[0].n)) list.push({ id: key, fmt: fmt, n: n });
    var value = list.map(choiceText).join('; ');
    log('custom tile: ' + key + ' ' + fmt + ' -> ' + (n ? 'picture ' + n : 'own icon'));
    try { console.log('THEME-SET customTileChoice ' + value); } catch (e) {}
  }

  /* ---- vertical tiles: style sheets that take the tile as a square ---- */
  function verticalStyles(s) {
    var W = THEME.tileSize, H = tileHeight();
    /* carousel module 596, createStyles({itemSize}): itemSize is
       getItemLayout(0).height = EXPERIENCE_SIZE (the width here) */
    if (s.tile && s.container && Object.keys(s).length === 2 && s.tile.position === 'absolute' &&
        s.tile.width === W && s.tile.height === W && s.container.marginTop === -W / 2) {
      s.tile.height = H;
      s.container.marginTop = -H / 2;
      done('vertical row tiles');
    }
    /* createAnimatedStyles: selectedN = [scale, translateY itemSize/2,
       translateX offset]; with the marginTop above the tile grows from its top */
    if (APP === 'home' && s.selected0 && s.position0) {
      var n = 0;
      for (var k in s) {
        if (!/^selected\d+$/.test(k) || !s[k] || !Array.isArray(s[k].transform)) continue;
        s[k].transform.forEach(function (t) {
          if (t && t.translateY === W / 2) { t.translateY = H / 2; n++; }
        });
      }
      if (n) done('vertical carousel');
    }
    /* module 152, <Tile /> image: width = height = EXPERIENCE_SIZE; square
       icons are cut in the middle */
    if (s.imageWrapper && s.image && s.titleId && s.telemetryContainer && s.image.width === W) {
      s.image.height = H;
      s.image.resizeMode = 'cover';
      done('vertical tile image');
    }
    /* module 903: invisible focus trap the size of a tile */
    if (s.focusTrap && s.focusTrap.width === W && s.focusTrap.height === W) {
      s.focusTrap.height = H;
      done('vertical focus trap');
    }
  }

  /* ---- tiles fade out near the screen edges (tileEdgeFade) ----
     Carousel module 596, createAnimatedStyles: positionN = translateX of
     item N, scroll = translateX of the whole strand = selectedValue
     interpolated to -index·(itemSize + itemMargin). Item N's opacity is that
     same scroll value interpolated again (native driver, like the row): at
     each whole index j its screen x is known (focused tile at 172 + rowX),
     the native interpolation is linear in between. */
  function edgeFadeOpacity(left, width) {
    var c = left + width / 2, inset = Number(THEME.tileEdgeFadeInset) || 0;
    var min = Math.min(1, Math.max(0, Number(THEME.tileEdgeFadeMin) || 0));
    var L = Number(THEME.tileEdgeFadeLeft) || 0, R = Number(THEME.tileEdgeFadeRight) || 0, t = 1;
    if (L > 0) t = Math.min(t, (c - inset) / L);
    if (R > 0) t = Math.min(t, (1920 - inset - c) / R);
    t = Math.min(1, Math.max(0, t));
    return min + (1 - min) * t * t * (3 - 2 * t);
  }
  /* screen [left, width] of the tile d places from the focused one */
  function edgeFadeBox(d) {
    var base = 172 + (THEME.rowX || 0), gap = tileGap(), W = THEME.tileSize, P = W + gap;
    if (d === 0) return [base + (THEME.focusX || 0), THEME.focusSize + shapeExtra()];
    /* stock: next tile at 357 (172 + 168 + 17), Store right edge at 156 */
    if (d > 0) return [base + THEME.focusSize + shapeExtra() + gap + 9 + (THEME.rowGapAfter || 0) + (d - 1) * P, W];
    return [base - 2 * gap - (THEME.rowGapBefore || 0) - W + (d + 1) * P, W];
  }
  /* the strand's scroll style (translateX of the whole row) */
  function strandScroll(s) {
    var scroll = s.scroll;
    if (!scroll || !Array.isArray(scroll.transform))
      Object.keys(s).forEach(function (k) {
        var v = s[k];
        if (!scroll && !/^(position|selected)\d+$/.test(k) && v && Array.isArray(v.transform) && v.transform[0] &&
            v.transform[0].translateX && typeof v.transform[0].translateX.interpolate === 'function') scroll = v;
      });
    var sx = scroll && Array.isArray(scroll.transform) && scroll.transform[0] ? scroll.transform[0].translateX : null;
    return sx && typeof sx.interpolate === 'function' ? { style: scroll, x: sx } : null;
  }
  function animNodes() {
    var A = T.rn && T.rn.Animated;
    return A && typeof A.add === 'function' && typeof A.multiply === 'function' && typeof A.Value === 'function' ? A : null;
  }
  function edgeFade(s) {
    var sc = strandScroll(s), n = 0, A = animNodes();
    if (!sc) { log('edge fade: no scroll style (' + Object.keys(s).length + ' keys)'); return; }
    var M = 0;
    while (s['position' + M]) M++;
    var P = THEME.tileSize + tileGap();
    if (M < 2 || !(P > 0)) return;
    /* each item's place in the row: positionN (index·P, an Animated value of
       the strand's pool: an item keeps its pool slot when it changes place)
       + scroll (−first on screen·P); 0 = where the focused tile stands */
    var win = T.rowWinBy && T.rowWinBy.get(sc.style), walk = win ? win.L + win.E : 0;
    var ks = [];
    for (var k = -M; k <= M; k++) ks.push(k);
    var hideLeft = !!THEME.rowHideLeft, fade = !!THEME.tileEdgeFade;
    var push = Math.max(0, Math.min(1500, Number(THEME.rowHideLeftMove) || 0));
    var out = ks.map(function (k) {
      /* rowHideLeft: a tile that leaves the row's first place on the left
         goes away (place -1 = gone, linear in between) */
      if (hideLeft && k < 0) return 0;
      if (!fade) return 1;
      /* with rowWindow the focused tile can be in the first L + E places */
      if (!THEME.tileEdgeFadeFocused && k >= 0 && k <= walk) return 1;
      var b = edgeFadeBox(k);
      return Math.round(edgeFadeOpacity(b[0], b[1]) * 1000) / 1000;
    });
    /* rowHideLeftEdge: the leaving tile is gone when its left edge reaches
       that x. Its left edge at rel r (−P..0) = 172 + rowX + r·(1 + move/P) */
    var inR = ks.map(function (k) { return k * P; }), outR = out.slice();
    if (hideLeft) {
      var gone = ((Number(THEME.rowHideLeftEdge) || 0) - (172 + (THEME.rowX || 0))) / (1 + push / P);
      gone = Math.max(-P + 1, Math.min(-1, Math.round(gone)));
      var at = ks.indexOf(0);
      inR.splice(at, 0, gone);
      outR.splice(at, 0, 0);
    }
    for (var N = 0; N < M; N++) {
      var st = s['position' + N];
      if (!st || typeof st !== 'object') continue;
      var px = Array.isArray(st.transform) && st.transform[0] ? st.transform[0].translateX : null;
      if (A && px != null) {
        var rel = A.add(px, sc.x);
        st.opacity = rel.interpolate({ inputRange: inR, outputRange: outR, extrapolate: 'clamp' });
        /* ...and slides away to the left while it goes (off the side bar) */
        if (hideLeft && push > 0)
          st.transform = [st.transform[0], { translateX: rel.interpolate({ inputRange: [-P, 0], outputRange: [-push, 0],
                                                                           extrapolate: 'clamp' }) }]
                           .concat(st.transform.slice(1));
      } else {
        /* no Animated.add: pool slot N taken as the index */
        var input = [];
        for (var j = M - 1; j >= 0; j--) input.push(-j * P);
        st.opacity = sc.x.interpolate({ inputRange: input, extrapolate: 'clamp', outputRange: input.map(function (x) {
          return out[ks.indexOf(Math.max(-M, Math.min(M, N - Math.round(-x / P))))];
        }) });
      }
      n++;
    }
    if (n && fade) done('edge fade ' + n + ' tiles (L ' + THEME.tileEdgeFadeLeft + ' R ' + THEME.tileEdgeFadeRight + ')');
    if (n && hideLeft) done('tiles leave on the left (' + n + ' tiles, ' + (A ? push + ' px, gone at x ' + (Number(THEME.rowHideLeftEdge) || 0) : 'fade only, no Animated.add') + ')');
  }

  /* ---- rowWindow: the focus walks, the row slides only in the middle ----
     Stock: scroll = −s·P (s = selectedValue, the focused index), so the
     focused tile always stands at 172. Here scroll = −first(s)·P:
       s ≤ a          first = s       (a = 1: the Store left of the 1st game)
       a ≤ s ≤ a+L    first = a       (the focus walks L tiles right)
       s ≥ a+L        first = s − L   (the row slides)
       and never more than firstMax = first(n−1−E) (the focus walks the
       last E tiles). All native nodes on the strand's own value (interpolate
       + add + multiply); firstMax is an Animated.Value set when the row's
       item count (children of the scroll View) is known. */
  function winG(w, s) { return s <= w.a ? s : s <= w.a + w.L ? w.a : s - w.L; }
  function winFirstMax(w, n) { return w.E > 0 ? Math.max(0, winG(w, n - 1 - w.E)) : 1e5; }
  function rowWindow(s) {
    var sc = strandScroll(s), A = animNodes();
    if (!sc || !A) { log('row window: ' + (sc ? 'no Animated.add/multiply' : 'no scroll style')); return; }
    if (T.rowWinBy && T.rowWinBy.has(sc.style)) return;
    var P = THEME.tileSize + tileGap();
    var L = Math.max(0, Math.min(10, Math.round(Number(THEME.rowWindowStart) || 0)));
    var E = Math.max(0, Math.min(10, Math.round(Number(THEME.rowWindowEnd) || 0)));
    if (!(P > 0) || (!L && !E)) return;
    var a = THEME.hideStore ? 0 : 1, x0 = sc.x, g = x0;
    if (L) {
      var inR = [-(a + L + 1) * P, -(a + L) * P, -a * P], outR = [-(a + 1) * P, -a * P, -a * P];
      if (a) { inR.push(0); outR.push(0); }
      g = x0.interpolate({ inputRange: inR, outputRange: outR, extrapolate: 'extend' });
    }
    var w = { a: a, L: L, E: E, P: P, n: -1, fmax: null, sw: g };
    if (E) {
      /* scroll = max(g, −firstMax·P) = relu(g + firstMax·P) − firstMax·P */
      w.fmax = new A.Value(1e5 * P);
      var relu = A.add(g, w.fmax).interpolate({ inputRange: [0, 1], outputRange: [0, 1],
                                                extrapolateLeft: 'clamp', extrapolateRight: 'extend' });
      w.sw = A.add(relu, A.multiply(w.fmax, -1));
    }
    /* how far the focused tile stands right of its stock place (tile name) */
    w.shift = A.add(w.sw, A.multiply(x0, -1));
    sc.style.transform = [{ translateX: w.sw }].concat(sc.style.transform.slice(1));
    T.rowWinBy = T.rowWinBy || new WeakMap();
    T.rowWinBy.set(sc.style, w);
    T.rowWinNew = w;
    done('row window (walk ' + L + ' at the start, ' + E + ' at the end, step ' + P + ' px)');
  }
  /* jsx: the scroll View of a strand; its children = one per item */
  function rowWindowCount(props) {
    var w = T.rowWinBy && props.style && typeof props.style === 'object' ? T.rowWinBy.get(props.style) : null;
    if (!w || !Array.isArray(props.children)) return;
    T.rowWin = w;
    var n = props.children.filter(function (c) { return c != null; }).length;
    if (n === w.n) return;
    w.n = n;
    var fm = winFirstMax(w, n);
    if (w.fmax) w.fmax.setValue(fm * w.P);
    log('row window: ' + n + ' items, the row slides up to item ' + (fm >= 1e5 ? 'the last' : fm));
  }
  /* the focused index s -> px the focused tile stands right of 172 */
  function rowWindowShiftPx(s) {
    var w = T.rowWin;
    if (!w || typeof s !== 'number' || s < 0) return 0;
    var first = Math.min(winG(w, s), w.n > 0 ? winFirstMax(w, w.n) : 1e5);
    return (s - first) * w.P;
  }
  /* the hub view's small tile: minimizeExperienceN moves it from 172; it is
     moved back by the shift. A value of its own set from the row's onFocus,
     so the row's native nodes and the hub animation never share a node */
  function rowWindowHubValue() {
    var A = animNodes();
    if (!A) return null;
    if (!T.rowWinHub) T.rowWinHub = new A.Value(0);
    return T.rowWinHub;
  }
  function rowWindowFocus(index) {
    var v = T.rowWinHub;
    if (!v || !THEME.rowWindow) return;
    var Sm = THEME.focusSize / THEME.tileSize;
    try { v.setValue(-rowWindowShiftPx(index) / (Sm > 0 ? Sm : 1)); } catch (e) {}
  }

  /* ---- StyleSheet.create: styles recognised by their keys ---- */
  /* style key -> visual editor element (filled by styles) */
  var toMark = [];
  function styles(s) {
    if (!s || typeof s !== 'object') return;
    var px;
    /* module 152: the <Tile /> image (custom tiles find the tile's Image by it) */
    if (s.imageWrapper && s.image && s.titleId && s.telemetryContainer) T.tileImage = s.image;
    var m = function (key, name) { if (s[key]) toMark.push([key, name]); };
    /* hub, module 1944: game name (text) or logo */
    if (s.logoImage && s.conceptName && s.textTitle) {
      shift(s.textTitle, THEME.titleX, THEME.titleY);
      shift(s.logoImage, THEME.titleX, THEME.titleY);
      /* fake title on, or no title: the game title only in the hub view
         (jsx, hubTitleValue) */
      if (APP === 'hub' && hubTitleGated()) {
        T.hubTitleText = s.textTitle;
        T.hubTitleLogo = s.logoImage;
      }
      if ((px = fontSize(THEME.titleFontSize)))
        s.conceptName.fontSize = px;
      if (THEME.titleColor) s.conceptName.color = THEME.titleColor;
      if (THEME.titleFontStyle) merge(s.conceptName, fontStyle(THEME.titleFontStyle));
      if (align(THEME.titleAlign)) s.conceptName.textAlign = align(THEME.titleAlign);
      m('textTitle', 'title'); m('logoImage', 'title');
      done('game title');
    }
    /* hub: row of buttons (Play, ...). The cover uses ctaContainer from several
       style sheets (one per variant) and preCtaContainer; the Home does not
       use these names, but to be safe only in the hub. */
    if (APP === 'hub' && (s.ctaContainer || s.preCtaContainer)) {
      /* hidden when drawn (hubButtons), not here: the Game Library keeps them */
      ['ctaContainer', 'preCtaContainer'].forEach(function (k) {
        shift(s[k], THEME.buttonsX, THEME.buttonsY);
        if (s[k] && T.ctaStyles.indexOf(s[k]) < 0) T.ctaStyles.push(s[k]);
      });
      m('ctaContainer', 'buttons');
      done('game buttons');
    }
    /* name next to the focused tile ("PS5 Planet Zoo"): absolute block */
    if (s.experienceTitleContainer && s.itemContainer) {
      /* vertical tiles: top = TITLE_Y (bottom of the focused tile minus the name area).
         only from the stock value (EXPERIENCE_SIZE = tileSize): the Media
         row's sheet is made from the TITLE_Y already moved by verticalConstants,
         and got the 160 px twice */
      if (tileRatio() !== 1 && s.experienceTitleContainer.top === THEME.tileSize)
        s.experienceTitleContainer.top += focusHeight() - THEME.focusSize;
      /* the focused shape's extra width moves it too (a View at a fixed
         place, right of the stock focused tile, TITLE_X).
         The row's title component (module ~193400) makes a second sheet from
         a copy of this one (same experienceTitleContainer object) each time
         its maxItems changes, i.e. at load and at every tab change: a plain
         shift() was added again each time (the "counts twice" seen before,
         and the name walking right at each tab change). So the transform
         is always rebuilt from the stock one. */
      var c = s.experienceTitleContainer;
      T.titleBase = T.titleBase || new WeakMap();
      if (!T.titleBase.has(c))
        T.titleBase.set(c, Array.isArray(c.transform) ? c.transform.slice() : null);
      var cb = T.titleBase.get(c);
      if (cb) c.transform = cb.slice(); else delete c.transform;
      shift(c, (THEME.tileNameX || 0) + shapeExtra(), THEME.tileNameY);
      if (THEME.tileNameScale > 0 && THEME.tileNameScale !== 1) {
        /* scales from the left; if the PS5 RN does not know transformOrigin,
           it scales from the centre (fix it with X/Y) */
        c.transform = (c.transform || []).concat([{ scale: THEME.tileNameScale }]);
        if (!c.transformOrigin) c.transformOrigin = 'left';
      }
      if (THEME.tileNameColor && s.tagText) s.tagText.color = THEME.tileNameColor;
      /* a hidden tile name (text / symbol) shows again next to the small
         tile of the hub view: done in jsx (hubOnly, platformIcon-*) */
      m('experienceTitleContainer', 'tileName');
      done('tile name');
    }
    /* module 994: Games / Media tabs */
    if (s.spaceSwitcher && s.spaceSwitcherItem && s.spaceSwitcherItemText) {
      if (THEME.tabsColor) s.spaceSwitcherItemText.color = THEME.tabsColor;
      if (THEME.tabsFontStyle) {
        merge(s.spaceSwitcherItemText, fontStyle(THEME.tabsFontStyle));
        T.tabStyle = s.spaceSwitcherItemText;
      }
      s.spaceSwitcherItem.marginRight = THEME.tabsSpacing;
      if (s.spaceSwitcherItemBlur)
        s.spaceSwitcherItemBlur.opacity = THEME.tabsInactiveOpacity;
      /* the selected tab is bold, the others normal: the names change
         width and the tabs on the right moved at each change */
      if (s.spaceSwitcherItemBlur && THEME.tabsSameWeight !== false)
        s.spaceSwitcherItemBlur.fontWeight = s.spaceSwitcherItemText.fontWeight || 'bold';
      if ((px = fontSize(THEME.tabsFontSize)))
        s.spaceSwitcherItemText.fontSize = px;
      done('tabs');
    }
    /* module 146: the Home moves up (animated translateY) to show the hub or
       the library; the theme layers on the Home fade out with that move */
    if (APP === 'home' && s.homeContainer && Array.isArray(s.homeContainer.transform)) {
      s.homeContainer.transform.forEach(function (t) {
        if (t && t.translateY && typeof t.translateY.interpolate === 'function')
          T.homeLift = t.translateY;
      });
      if (T.homeLift) done('Home lift');
    }
    if (APP === 'hub' && s.route && s.hudArea) T.routeStyle = s.route;
    /* module 270 (top icon buttons): the text under the selected icon (the
       user name under the profile) */
    /* only the text colour: display none on its (natively animated)
       container took ShellUI down */
    if (s.iconTextContainer && s.iconImage && s.iconText && THEME.hideIconLabels) {
      s.iconText.color = 'transparent';
      done('icon labels hidden');
    }
    /* module 100: clock */
    if (s.clockWrapper && s.clock) {
      if (typeof s.clockWrapper.marginLeft === 'number')
        s.clockWrapper.marginLeft += THEME.clockGap;
      shift(s.clockWrapper, THEME.clockX || 0, THEME.clockY || 0);
      hide(s.clockWrapper, THEME.hideClock);
      T.clockStyle = s.clock;
      if (THEME.clockColor) s.clock.color = THEME.clockColor;
      if (THEME.clockFontStyle) merge(s.clock, fontStyle(THEME.clockFontStyle));
      if ((px = fontSize(THEME.clockFontSize)))
        s.clock.fontSize = px;
      /* the own clock takes its place (colour only: display none on
         the top bar crashed) */
      if (THEME.ownClock) s.clock.color = 'transparent';
      m('clockWrapper', 'clock');
      done('clock');
    }
    /* module 261: top bar (tabs on the left, icons on the right) */
    if (s.spaceSwitcherWrapper && s.systemWrapper) {
      var tabs = s.spaceSwitcherWrapper, sys = s.systemWrapper;
      T.root = s.container; /* Home container: the footer goes in here */
      if (tabsAlignPart() >= 0) {
        /* tabsAlign (like the footer): a box tabsWidth wide from 84 +
           tabsX, out of the row (the icons on the right keep their room),
           the tabs aligned inside it (tabsAlignLayer) */
        tabs.position = 'absolute';
        tabs.top = 0;
        tabs.left = 84 + (THEME.tabsX || 0);
        tabs.width = THEME.tabsWidth > 0 ? THEME.tabsWidth : 1752;
        tabs.marginLeft = 0;
        tabs.alignItems = { 0: 'flex-start', 0.5: 'center', 1: 'flex-end' }[tabsAlignPart()];
        done('tabs box ' + tabs.left + ' +' + tabs.width + ' ' + THEME.tabsAlign);
      } else if (typeof tabs.marginLeft === 'number') tabs.marginLeft += THEME.tabsX;
      shiftFocusable(tabs, 0, THEME.tabsY);
      hide(tabs, THEME.hideTabs);
      if (typeof sys.marginRight === 'number') sys.marginRight -= THEME.iconsX;
      shiftFocusable(sys, 0, THEME.iconsY);
      if (THEME.topBarOpacity < 1) tabs.opacity = sys.opacity = THEME.topBarOpacity;
      m('spaceSwitcherWrapper', 'tabs');
      done('top bar');
    }
    if (s.experienceTitle && s.focusContainer && s.strandContainer) {
      if (s.container) {
        s.container.height = focusHeight();
        T.rowBox = s.container;
      }
      s.focusContainer.borderRadius =
          THEME.tileCorners * THEME.focusSize / THEME.tileSize;
      if (s.optionsMenuStyle) {
        s.optionsMenuStyle.height = tileHeight();
        s.optionsMenuStyle.width = THEME.tileSize;
      }
      s.strandContainer.height = focusHeight();
      /* the reflection is drawn below the row's box */
      if (THEME.tileReflection > 0)
        ['container', 'strandContainer'].forEach(function (k) {
          if (s[k] && s[k].overflow === 'hidden') {
            s[k].overflow = 'visible';
            log('reflection: row ' + k + ' overflow hidden -> visible');
          }
        });
      if (THEME.rowX && s.strandStyle && typeof s.strandStyle.marginLeft === 'number')
        s.strandStyle.marginLeft += THEME.rowX;
      m('focusContainer', 'tile');
      done('row styles');
    }
    if (tileRatio() !== 1) verticalStyles(s);
    /* row carousel: selectedN is the transform of the focused item
       (scale); the shift goes before it so it is not scaled */
    /* every item has a selectedN; the (Animated) scale is 1 on the others and
       focusSize/tileSize on the focused one, so the shift follows the scale */
    if (APP === 'home' && s.selected0 && s.position0 &&
        (THEME.focusX || THEME.focusY)) {
      var S = THEME.focusSize / THEME.tileSize;
      for (var k in s) {
        if (!/^selected\d+$/.test(k) || !s[k] || typeof s[k] !== 'object') continue;
        var tr = Array.isArray(s[k].transform) ? s[k].transform.slice() : [];
        var sc = null;
        tr.forEach(function (t) { if (t && t.scale != null) sc = t.scale; });
        if (!sc || typeof sc.interpolate !== 'function' || !(Math.abs(S - 1) > 0.01)) continue;
        var seg = function (v) {
          return sc.interpolate({ inputRange: S > 1 ? [1, S] : [S, 1],
                                  outputRange: S > 1 ? [0, v] : [v, 0],
                                  extrapolate: 'clamp' });
        };
        tr.unshift({ translateY: seg(THEME.focusY) }, { translateX: seg(THEME.focusX) });
        s[k].transform = tr;
      }
      done('focused tile');
    }
    /* hub view: the focused tile goes small to the top left corner
       (minimizeExperienceN: translate, then scale 1 -> MINIMIZED_EXP_SCALE,
       inside selectedN, which keeps its focusX/focusY shift and scale S).
       With focusY -173 it ended above the screen; as it gets small the shift
       is undone (-shift/S in that space) */
    if (APP === 'home' && THEME.fixDetails && (THEME.focusX || THEME.focusY) && s.minimizeExperience0) {
      var Sm = THEME.focusSize / THEME.tileSize, mm = T.minScale;
      for (var km in s) {
        if (!/^minimizeExperience\d+$/.test(km) || !s[km] || !Array.isArray(s[km].transform)) continue;
        var trm = s[km].transform.slice(), at = -1;
        trm.forEach(function (t, i) { if (t && t.scale != null && typeof t.scale.interpolate === 'function') at = i; });
        if (at < 0 || !(mm > 0 && mm < 1) || !(Sm > 0)) continue;
        var scm = trm[at].scale;
        var undo = function (v) {
          return scm.interpolate({ inputRange: [mm, 1], outputRange: [-v / Sm, 0], extrapolate: 'clamp' });
        };
        trm.splice(at, 0, { translateX: undo(THEME.focusX || 0) }, { translateY: undo(THEME.focusY || 0) });
        s[km].transform = trm;
        T.minFixed = (T.minFixed || 0) + 1;
      }
      if (T.minFixed) done('small tile of the hub view without the focus shift');
      else if (!T.done['small tile: not changed']) {
        T.done['small tile: not changed'] = true;
        log('small tile of the hub view: not changed (MINIMIZED_EXP_SCALE ' + mm + ')');
      }
    }
    /* space around the focused tile: the last translateX of selectedN is
       offsets[N], which the row (useStrandAnimation) animates to -h on the
       items before the focus, margin/2 on the focused one and h + margin×scale
       on the ones after (h = size/scale/2, margin 8); the ends get the extra space */
    /* the focused shape's extra width (shapeExtra) too */
    if (APP === 'home' && s.selected0 && s.position0 &&
        (THEME.rowGapAfter || THEME.rowGapBefore || shapeExtra())) {
      var Se = THEME.focusSize / THEME.tileSize, margin = tileGap(), h = THEME.tileSize / Se / 2;
      var before = -h, atFocus = margin / 2, after = h + margin * Se;
      for (var ke in s) {
        if (!/^selected\d+$/.test(ke) || !s[ke] || !Array.isArray(s[ke].transform)) continue;
        var tre = s[ke].transform.slice(), last = -1;
        tre.forEach(function (t, i) { if (t && t.translateX != null) last = i; });
        var off = last >= 0 ? tre[last].translateX : null;
        if (!off || typeof off.interpolate !== 'function' || !(after > atFocus)) continue;
        tre[last] = { translateX: off.interpolate({
          inputRange: [before, atFocus, after],
          outputRange: [before - (THEME.rowGapBefore || 0), atFocus,
                        after + (THEME.rowGapAfter || 0) + shapeExtra()],
          extrapolate: 'extend' }) };
        s[ke].transform = tre;
      }
      done('space around the focus');
    }
    if (APP === 'home' && THEME.rowWindow && s.selected0 && s.position0) {
      try { rowWindow(s); } catch (e) { T.errors++; log('row window: ' + e); }
    }
    if (APP === 'home' && (THEME.tileEdgeFade || THEME.rowHideLeft) && s.selected0 && s.position0) {
      try { edgeFade(s); } catch (e) { T.errors++; log('edge fade: ' + e); }
    }
    /* rowWindow: the hub view's small tile goes back to the stock place */
    if (APP === 'home' && THEME.rowWindow && s.minimizeExperience0) {
      var hv = rowWindowHubValue(), mw = T.minScale, An = animNodes(), nw = 0;
      for (var kw in s) {
        if (!hv || !(mw > 0 && mw < 1) || !/^minimizeExperience\d+$/.test(kw) || !s[kw] || !Array.isArray(s[kw].transform)) continue;
        var trw = s[kw].transform.slice(), atw = -1;
        trw.forEach(function (t, i) { if (t && t.scale != null && typeof t.scale.interpolate === 'function') atw = i; });
        if (atw < 0) continue;
        var kk = trw[atw].scale.interpolate({ inputRange: [mw, 1], outputRange: [1, 0], extrapolate: 'clamp' });
        trw.splice(atw, 0, { translateX: An.multiply(hv, kk) });
        s[kw].transform = trw;
        nw++;
      }
      if (nw) done('row window: small tile of the hub view back in place');
    }
    if (s.experienceSwitcherWrapper && s.spaceSwitcherWrapper) {
      s.experienceSwitcherWrapper.marginTop = THEME.rowOffsetY;
      if (tileRatio() !== 1) s.experienceSwitcherWrapper.height = focusHeight();
      T.rowWrapStyle = s.experienceSwitcherWrapper;
      m('experienceSwitcherWrapper', 'row');
      done('row position');
    }
  }
  function hookStyleSheet(rn) {
    if (!T.rn) T.rn = rn;
    var sheet = rn && rn.StyleSheet;
    if (T.done.StyleSheet || !sheet || typeof sheet.create !== 'function')
      return;
    var create = sheet.create;
    var replaced = function (s) {
      toMark = [];
      try { styles(s); } catch (e) { T.errors++; log('styles: ' + e); }
      var r = create.apply(this, arguments);
      /* create may return another object: the tabs one counts as well */
      if (s && r && typeof r === 'object' && s.spaceSwitcherItemText &&
          T.tabStyle === s.spaceSwitcherItemText && r.spaceSwitcherItemText)
        T.tabStyle2 = r.spaceSwitcherItemText;
      if (s && r && typeof r === 'object' && s.clock && T.clockStyle === s.clock && r.clock)
        T.clockStyle2 = r.clock;
      if (s && r && typeof r === 'object' && s.image && T.tileImage === s.image && r.image)
        T.tileImage2 = r.image;
      if (s && r && typeof r === 'object' && s.route && T.routeStyle === s.route && r.route)
        T.routeStyle2 = r.route;
      try {
        if (APP === 'home' && s && s.selected0 && s.position0) registerSelected(s, r);
      } catch (e) { T.errors++; log('selected: ' + e); }
      /* create may return the same object or numbers: both are marked */
      toMark.forEach(function (p) {
        mark(p[1], s[p[0]]);
        if (r && typeof r === 'object') mark(p[1], r[p[0]]);
      });
      return r;
    };
    try { sheet.create = replaced; } catch (e) {}
    if (sheet.create === replaced) done('StyleSheet');
    else log('StyleSheet.create not replaceable');
    hookAnimations(rn);
  }

  /* ---- top bar icons, one by one ----
     The icons module exports each one as a component (React.memo):
     Search, Settings, Profile and ApplicationErrorEventTrigger (the place
     onionHEN uses for its icon). The ones with an offset are swapped for one
     that draws the original inside a View with left/top. */
  var ICONS = { Search: 'search', Settings: 'settings', Profile: 'profile' };
  function findReact(o) {
    if (!T.React && o && typeof o.createElement === 'function' &&
        typeof o.memo === 'function' && o.Fragment)
      T.React = o;
  }
  function replace(o, name, fn) {
    try { o[name] = fn; } catch (e) {}
    if (o[name] !== fn) {
      try {
        Object.defineProperty(o, name, {
          enumerable: true, configurable: true,
          get: function () { return fn; }
        });
      } catch (e) { log('icon ' + name + ' not replaceable: ' + e); }
    }
    return o[name] === fn;
  }
  function movedIcon(inner, x, y, pre) {
    var React = T.React, View = T.rn.View;
    var scale = THEME[pre + 'Scale'] || 1;
    /* left/top (not translate): the focus sees the icon where it shows up */
    var style = { left: x, top: y, transform: [{ scale: scale }] };

    return React.memo(function (props) {
      var p = { style: style };
      iconKeys(pre, p);
      if (THEME.measureScreen) withMeasure(pre, p);
      return React.createElement(View, p, inner(props));
    });
  }
  function detached() {
    return { search: THEME.searchDetached, settings: THEME.settingsDetached, profile: THEME.profileDetached };
  }
  /* the original button component (the same one the bar uses) somewhere else */
  /* The bar gives each icon its props (module 100: Profile gets connected,
     signedIn, totalItems, userId; without userId the avatar button did not
     take the focus). The icon left in the bar draws nothing and hands
     them to its copy on the Home. */
  T.iconProps = T.iconProps || {};
  var propsListeners = {};
  function barProps(pre) {
    return T.React.memo(function (props) {
      T.iconProps[pre] = props;
      /* the copy is told after the render (not during it) */
      var tell = function () {
        homeReadySet('top bar');
        if (!T.done['bar props ' + pre]) done('bar props ' + pre + ': ' + Object.keys(props || {}).join(','));
        (propsListeners[pre] || []).forEach(function (f) { f(props); });
      };
      if (typeof T.React.useEffect === 'function') T.React.useEffect(tell, [props]);
      return null;
    });
  }
  function IconCopy(props) {
    var React = T.React, pre = props.pre;
    if (typeof React.useState !== 'function' || typeof React.useEffect !== 'function')
      return React.createElement(T.iconOrig[pre], T.iconProps[pre] || {});
    var st = React.useState(T.iconProps[pre] || {}), p = st[0], set = st[1];
    React.useEffect(function () {
      var list = propsListeners[pre] = propsListeners[pre] || [];
      var f = function (v) { set(v || {}); };
      list.push(f);
      if (T.iconProps[pre] && T.iconProps[pre] !== p) set(T.iconProps[pre]);
      return function () { var i = list.indexOf(f); if (i >= 0) list.splice(i, 1); };
    }, [pre]);
    return React.createElement(T.iconOrig[pre], p);
  }
  /* The PS5 moves the focus between named FocusLayerPS layers: the tabs go
     right to 'home-system' (the bar), the row goes up to 'space-switcher-<space>'.
     An icon moved out of the bar (lower than it) stayed in 'home-system', so
     right from Media picked it wherever it was drawn. Now it leaves the bar
     and is drawn on the Home in a layer of its own ('zt-icon-<icon>'), which
     the row points to when the icon is above it. */
  /* at the height of the bar but left of the tabs (Games / Media start at
     84 + tabsX): the tabs layer has canMoveLeft false and the icon stayed in
     'home-system', on the right; it gets its own layer too */
  function leftOfTabs(pre) {
    /* centred tabs: their left edge depends on the names; ~300 px left of the centre */
    var part = tabsAlignPart(), start = 84 + (THEME.tabsX || 0);
    if (part > 0) start += ((THEME.tabsWidth > 0 ? THEME.tabsWidth : 1752) - 600) * part;
    return !offBar(pre) && iconScreen(pre)[0] + 52 < start;
  }
  function outOfBar(pre) {
    return !!detached()[pre] || (THEME.iconsNav !== false && (offBar(pre) || leftOfTabs(pre)));
  }
  function detachedIcons() {
    var React = T.React, rn = T.rn, out = [];
    if (!React || !rn || !T.iconOrig) return out;
    for (var name in ICONS) {
      var pre = ICONS[name];
      if (!outOfBar(pre) || !T.iconOrig[pre] || !iconShown(pre)) continue;
      var at = iconScreen(pre), sc = THEME[pre + 'Scale'] || 1;
      var st = { position: 'absolute', left: at[0], top: at[1] };
      if (sc !== 1) st.transform = [{ scale: sc }];
      var wrap = { key: 'theme-detached-' + pre, style: st };
      iconKeys(pre, wrap);
      if (THEME.measureScreen) withMeasure(pre, wrap);
      var inner = React.createElement(IconCopy, { pre: pre });
      if (T.FocusLayer) {
        /* left / right with nothing that way: stay (no jump across the screen) */
        inner = React.createElement(T.FocusLayer, { name: 'zt-icon-' + pre, children: inner,
          focusCustomSettings: leftOfTabs(pre)
            ? { canMoveLeft: !!nearest(at, 'left', pre, leftOfTabs).pre, canMoveRight: true,
                rightCandidate: 'space-switcher' }
            : { canMoveLeft: !!nearest(at, 'left', pre).pre,
                canMoveRight: !!nearest(at, 'right', pre).pre } });
      }
      out.push(React.createElement(rn.View, wrap, inner));
      if (!T.done['icon out of the bar: ' + pre]) done('icon out of the bar: ' + pre + (T.FocusLayer ? ' (layer)' : ''));
    }
    return out;
  }
  /* the hub layer under the row (module 521: FocusLayerPS testID
     'experience-switcher-focus-layer', ref = hubViewerRef) */
  function hubLayer(props) {
    if (props.testID === 'experience-switcher-focus-layer' && props.ref) T.hubLayerRef = props.ref;
  }
  /* tabs ({rightCandidate: 'home-system', downCandidate}) and the bar
     ('home-system'): downCandidate comes from an atom and can be empty, and
     then the PS5 takes the nearest layer (an icon out of the bar). Empty ->
     the row of the space */
  var layerLogs2 = {};
  function topLayers(props) {
    var f = props.focusCustomSettings;
    var which = f.rightCandidate === 'home-system' ? 'tabs' : props.name === 'home-system' ? 'bar' : null;
    if (!which) return;
    var before = f.downCandidate;
    /* downCandidate = id of the selected tile (NPXS40071 = Game Library) */
    if (typeof before === 'string' && before) {
      if (T.selectedId && T.selectedId !== before && T.tabSel === T.lastProbeTab)
        lagProbe('game change ' + T.selectedId + ' -> ' + before, 'gameLagLogs');
      T.lastProbeTab = T.tabSel;
      T.selectedId = before;
    }
    /* down to a game that went into a folder: to the folder */
    var inFolder = THEME.folders && folderOfGame(before);
    if (inFolder) {
      var gf = {};
      for (var kf in f) gf[kf] = f[kf];
      gf.downCandidate = inFolder;
      props.focusCustomSettings = f = gf;
      before = inFolder;
    }
    if (THEME.iconsNav && (typeof before !== 'string' || before === '')) {
      var g = {};
      for (var k in f) g[k] = f[k];
      g.downCandidate = 'experience-switcher-' + (T.space || 'game');
      props.focusCustomSettings = g;
    }
    if (which === 'tabs' && THEME.iconsNav && T.FocusLayer) {
      var left = null;
      shownIcons().forEach(function (pre) {
        if (leftOfTabs(pre) && (!left || iconScreen(pre)[0] > iconScreen(left)[0])) left = pre;
      });
      if (left) {
        var h = {};
        for (var k2 in props.focusCustomSettings) h[k2] = props.focusCustomSettings[k2];
        h.canMoveLeft = true;
        h.leftCandidate = 'zt-icon-' + left;
        props.focusCustomSettings = h;
        if (!T.done['tabs left to ' + left]) done('tabs left to ' + left);
      }
    }
    var line = which + ' down=' + before + ' -> ' + props.focusCustomSettings.downCandidate;
    if (!layerLogs2[line]) { layerLogs2[line] = true; log('layer ' + line); }
  }
  /* each tab is a View {name: 'space-switcher-<space>', focusable} (module
     ~255180). The tabs layer's leftCandidate reached Settings but not Profile, so left on the first tab also focuses the icon by its ref */
  var tabKeys = {};
  function leftIconOfTabs() {
    var left = null;
    shownIcons().forEach(function (pre) {
      if (leftOfTabs(pre) && (!left || iconScreen(pre)[0] > iconScreen(left)[0])) left = pre;
    });
    return left;
  }
  /* Favourites first is only drawn (tabsOrder): the PS5 still moves
     left / right between the tabs in the Home's order (Games, Media, ...,
     Favourites), so Games jumped to the icon on the left and Favourites
     skipped Games. Then left / right go to the next tab on screen by its ref
     (T.tabRefs), and the first tab on screen is the one that leads to the
     icon on the left. */
  T.tabRefs = {};
  var tabRefFns = {}, tabRightKeys = {}, TAB_END_SFX = ['up', 'down'], TAB_END_SFX_RIGHT = ['up', 'down', 'right'];
  function tabsReordered() {
    var on = spaceOrder(), home = Array.isArray(T.spaceIds) ? T.spaceIds : on;
    return on.join(',') !== home.join(',');
  }
  /* the focus moved by our code makes no native sound (and the "cannot
     move" one is off on the tabs): the Home's own move sound, as its row does
     (psfx_focus_move, panned to the side) */
  function tabMoveSound(step) {
    try {
      var sound = T.rn && T.rn.SystemSoundPS;
      if (sound && typeof sound.playByID === 'function')
        sound.playByID('psfx_focus_move', undefined, { pan: step > 0 ? 100 : step < 0 ? -100 : 0 });
    } catch (x) {}
  }
  function tabStep(name, step, e) {
    var ids = spaceOrder(), at = ids.indexOf(name.slice('space-switcher-'.length));
    var next = at >= 0 ? ids[at + step] : null;
    var ref = next && T.tabRefs[next];
    if (!ref || typeof ref.focus !== 'function') return null;
    take(e);
    if (pressed(e)) {
      tabMoveSound(step);
      try { ref.focus(); } catch (x) { log('tabs: focus ' + next + ': ' + x); }
      if ((T.tabStepLogs = (T.tabStepLogs || 0) + 1) <= 6) log('tabs: ' + (step > 0 ? 'right' : 'left') + ' ' + name.slice(15) + ' -> ' + next);
    }
    return false;
  }
  function tabItem(props) {
    if (typeof props.name !== 'string' || props.name.indexOf('space-switcher-') !== 0 ||
        props.focusable !== true)
      return;
    var name = props.name, sid = name.slice('space-switcher-'.length);
    var own = tabsReordered();
    if (!THEME.iconsNav && !own) return;
    if (own) {
      var orig = props.ref;
      props.ref = tabRefFns[sid] = tabRefFns[sid] || function (inst) {
        if (inst) T.tabRefs[sid] = inst; else if (T.tabRefs[sid]) delete T.tabRefs[sid];
        if (inst && !T.done['tab ref ' + sid]) done('tab ref ' + sid + ' (focus ' + typeof inst.focus + ')');
        if (typeof orig === 'function') orig(inst); else if (orig && typeof orig === 'object') orig.current = inst;
      };
      props.onRightKeyDown = tabRightKeys[name] = tabRightKeys[name] || function (e) {
        var r = tabStep(name, 1, e);
        return r === null ? true : r;
      };
      /* left / right are moved here (ref.focus): the native side saw the
         cursor not moving and played its "cannot move" sound on every press.
         Like the Home's own row tiles: that sound only for up / down */
      props.cursorEndSFXEnabledDirection = TAB_END_SFX;
    } else if (THEME.iconsNav && sid === spaceOrder()[0] && leftIconOfTabs()) {
      /* left on the first tab goes to the icon by its ref: the same */
      props.cursorEndSFXEnabledDirection = TAB_END_SFX_RIGHT;
    }
    props.onLeftKeyDown = tabKeys[name] = tabKeys[name] || function (e) {
      keyLog('tab ' + name + ' left', e);
      if (tabsReordered()) {
        var r = tabStep(name, -1, e);
        if (r !== null) return r;
      }
      /* the first tab on screen leads to the icon on the left of the tabs */
      var first = 'space-switcher-' + spaceOrder()[0];
      var left = THEME.iconsNav && name === first ? leftIconOfTabs() : null;
      if (!left || !T.iconRefs || !T.iconRefs[left]) return true;
      take(e);
      if (pressed(e)) { tabMoveSound(-1); focusIcon(left); }
      return false;
    };
  }
  /* the row's layer: up goes to the icon above the row nearest to the focused
     tile, instead of the tab */
  function rowLayer(props) {
    var f = props.focusCustomSettings;
    if (!THEME.iconsNav || !f || typeof f !== 'object' || typeof f.upCandidate !== 'string' ||
        f.upCandidate.indexOf('space-switcher-') !== 0 || !T.FocusLayer)
      return;
    var fx = 172 + (THEME.rowX || 0) + (THEME.focusX || 0);
    var n = nearest([fx, rowMid()], 'up', null, aboveRow);
    if (!n.pre) return;
    var g = {};
    for (var k in f) g[k] = f[k];
    g.upCandidate = 'zt-icon-' + n.pre;
    props.focusCustomSettings = g;
    if (!T.done['row up to ' + n.pre]) done('row up to ' + n.pre);
  }

  /* ---- top icons: other symbol, and the controller path to detached icons ----
     The bar buttons are module 270: jsx(Button, {icon: iconId, iconSize, legacy,
     ref, onFocus...}); Search / Settings give it iconId 'search' / 'settings'
     (system icon names or an image path, like the old onion icon). */
  function iconValue(v) {
    if (typeof v !== 'string' || !v.trim()) return null;
    v = v.trim();
    if (v.charAt(0) === '/') return v;
    if (/\.(png|jpe?g|dds)$/i.test(v)) return ztPath('icons', v);
    return v;
  }
  /* where an icon is on the screen: free ones at their X/Y, the bar ones at
     the stock place (measured: search 1358, settings 1462, profile 1566, y 35)
     plus the bar and icon offsets */
  var ICON_X = { search: 1358, settings: 1462, profile: 1566 };
  function iconY(pre) {
    if (detached()[pre]) return THEME[pre + 'DetachedY'];
    return 35 + (THEME.iconsY || 0) + (THEME[pre + 'Y'] || 0);
  }
  /* the bar is packed to the right (the clock at the end): an icon that leaves
     it (hidden or moved out) lets the ones before it move 104 px right */
  var ICON_ORDER = ['search', 'settings', 'profile'];
  function iconScreen(pre) {
    if (detached()[pre]) return [THEME[pre + 'DetachedX'], THEME[pre + 'DetachedY']];
    var gone = 0;
    for (var i = ICON_ORDER.indexOf(pre) + 1; i < ICON_ORDER.length; i++) {
      var o = ICON_ORDER[i];
      /* an icon out of the bar keeps where it was drawn  (only hidden
         ones counted then); the ones still in the bar really move */
      if (!iconShown(o) || (THEME.iconsNav !== false && iconY(o) > 130 && iconY(pre) <= 130)) gone++;
    }
    return [ICON_X[pre] + 104 * gone + (THEME.iconsX || 0) - (THEME.clockGap || 0) + (THEME[pre + 'X'] || 0),
            iconY(pre)];
  }
  function iconShown(pre) {
    return !THEME['hide' + pre.charAt(0).toUpperCase() + pre.slice(1)];
  }
  function shownIcons() {
    var list = [];
    for (var name in ICONS) if (iconShown(ICONS[name])) list.push(ICONS[name]);
    return list;
  }
  function rowTop() { return 126 + (THEME.rowOffsetY || 0); }
  function rowMid() { return rowTop() + (THEME.focusSize || 168) / 2; }
  /* out of the top bar (lower than it): the theme leads the controller there */
  function offBar(pre) { return iconY(pre) > 130; }
  function belowRow(pre) { return iconPos(pre)[1] >= rowTop() + (THEME.tileSize || 106) / 2; }
  function aboveRow(pre) { var y = iconPos(pre)[1]; return y > 130 && y < rowTop(); }
  /* Power / Trophies moved out of the bar (lower than it, e.g. a side bar):
     the PS5 only moves between the bar and the row, so up / down went past
     the profile and settings (in their own layers). Out of the bar they
     share the icons' path; place = measured on the screen. */
  function barOut(pre) {
    var b = T.barBox && T.barBox[pre];
    return !!(THEME.iconsNav && THEME[pre + 'On'] && b && b[1] > 130 && T.iconRefs && T.iconRefs[pre]);
  }
  function iconPos(pre) {
    var b = T.barBox && T.barBox[pre];
    return ICON_X[pre] == null && b ? [b[0], b[1]] : iconScreen(pre);
  }
  /* the row is that way (not only lower / higher: next to it) */
  function rowBeside(p) { return p[0] + 104 >= rowStartX() - 60; }

  /* key handlers get {keyEventType: 'Down' | 'Repeat' | ...} and return false
     when they took the key; the event goes from the focused element up its
     parents, so the button and the View around it can both see it: the first
     one that acts marks it */
  function pressed(e) { return !e || !e.keyEventType || e.keyEventType === 'Down'; }
  function taken(e) { return !!(e && typeof e === 'object' && e.__zt); }
  function take(e) { if (e && typeof e === 'object') try { e.__zt = true; } catch (x) {} }
  function keyLog(where, e) {
    if (!DEBUG.on) return;
    T.keyLogs = (T.keyLogs || 0) + 1;
    if (T.keyLogs <= 60) log('key ' + where + ' type=' + (e && e.keyEventType) + (taken(e) ? ' (taken)' : ''));
  }
  function focusIcon(pre) {
    var r = T.iconRefs && T.iconRefs[pre];
    if (!r || typeof r.focus !== 'function') {
      if (!T.done['icons: no ref ' + pre]) done('icons: no ref ' + pre);
      return false;
    }
    try { r.focus(); } catch (e) { log('icons: focus ' + pre + ' failed: ' + e); return false; }
    if (!T.done['to icon ' + pre]) done('to icon ' + pre);
    return true;
  }
  /* the row (ExperienceSwitcher) ref has focusSpace(spaceId) (module 574) */
  function focusRow() {
    var sw = T.switcherRef && T.switcherRef.current;
    if (!sw || typeof sw.focusSpace !== 'function') {
      if (!T.done['icons: no row ref']) done('icons: no row ref');
      return false;
    }
    try { sw.focusSpace(T.space || 'game'); } catch (err) { log('icons: focusSpace failed: ' + err); return false; }
    if (!T.done['to row']) done('to row (' + (T.space || 'game') + ')');
    return true;
  }
  /* nearest icon from point p in a direction (along it + 2x across it) */
  function nearest(p, dir, skip, only, withBar) {
    var best = null, score = 1e9, list = shownIcons();
    if (withBar) ['powerBtn', 'trophyBtn'].forEach(function (b) { if (barOut(b)) list.push(b); });
    list.forEach(function (pre) {
      if (pre === skip || (only && !only(pre))) return;
      var q = iconPos(pre), dx = q[0] - p[0], dy = q[1] - p[1];
      var along = dir === 'down' ? dy : dir === 'up' ? -dy : dir === 'right' ? dx : -dx;
      var across = dir === 'down' || dir === 'up' ? dx : dy;
      if (along < 20) return;
      /* left / right: roughly that way (an icon of the same column, a little
         to the side but far lower, is not "on the right") */
      if ((dir === 'left' || dir === 'right') && Math.abs(across) > along * 2) return;
      var sc = along + 2 * Math.abs(across);
      if (sc < score) { score = sc; best = pre; }
    });
    return { pre: best, score: score };
  }
  /* from an icon out of the bar: the nearest icon that way, or the row; with
     nothing that way, down stays put (the bar sent it back up to the row)
     and the rest is the PS5's own path */
  var keyCache = {};
  function iconKey(pre, dir) {
    var id = pre + dir;
    if (keyCache[id]) return keyCache[id];
    var kf = keyCache[id] = function (e) {
      keyLog(pre + ' ' + dir, e);
      if (taken(e)) return false;
      /* reached from the row with left: right goes back to it */
      if (dir === 'right' && T.fromRowIcon === pre) {
        take(e);
        if (pressed(e)) { tabMoveSound(1); T.fromRowIcon = null; focusRow(); }
        return false;
      }
      var lot = ICON_X[pre] != null && leftOfTabs(pre);
      var p = iconPos(pre), n = nearest(p, dir, pre, lot && dir === 'right' ? leftOfTabs : null, true);
      if (dir === 'up' || dir === 'down') {
        var along = dir === 'down' ? rowMid() - p[1] : p[1] - rowMid();
        if (along > 20 && rowBeside(p) && (!n.pre || along < n.score)) {
          take(e);
          if (pressed(e)) { tabMoveSound(0); focusRow(); }
          return false;
        }
      }
      if (n.pre && T.iconRefs && T.iconRefs[n.pre]) {
        take(e);
        /* our own move: the normal move sound (the PS5's is the "cannot
           move" one, see cursorEndSFXEnabledDirection on these icons) */
        if (pressed(e)) { tabMoveSound(dir === 'left' ? -1 : dir === 'right' ? 1 : 0); focusIcon(n.pre); }
        return false;
      }
      /* left of the tabs: right goes to the tabs (rightCandidate of its layer) */
      if (dir === 'right' && lot) return true;
      /* nothing on the right of an icon left of the row: the row */
      if (dir === 'right' && p[0] + 52 < rowStartX() && p[1] > 130) {
        take(e);
        if (pressed(e)) { tabMoveSound(1); T.fromRowIcon = null; focusRow(); }
        return false;
      }
      if (dir === 'left' || dir === 'right') { take(e); return false; }
      if (dir === 'down') {
        /* nothing lower: on to the hub (Play, trophies...), what down on the
           row did before; it opens the hub of the focused tile (not from
           an icon beside the row, e.g. a side bar: it stays) */
        take(e);
        if (pressed(e) && T.hubDown && belowRow(pre) && rowBeside(p) && !hubEmpty()) {
          /* the row's down (useHubViewer) only animates to the hub and returns
             true: the PS5 then moves the focus with the real key. Here the
             focus goes in by hand, like the Home's own path does
             (animate, then hubViewerRef.focus()) */
          var r, hub = T.hubLayerRef && T.hubLayerRef.current;
          try { r = T.hubDown({ keyEventType: 'Down' }); } catch (err) { log('icons: hub down failed: ' + err); }
          if (hub && typeof hub.focus === 'function') {
            try { hub.focus(); } catch (err2) { log('icons: hub focus failed: ' + err2); }
          }
          if (!T.done['icon down to hub']) done('icon down to hub (' + r + ', layer ' + (hub ? typeof hub.focus : 'none') + ')');
        }
        return false;
      }
      return true;
    };
    kf.__ztIcon = true;
    return kf;
  }
  /* the icons we move between ourselves (ref.focus): the PS5 saw the cursor
     not moving and played its "cannot move" sound; like the tabs, that sound
     is off there (we play the move sound) */
  var ICON_NO_END_SFX = [];
  function iconSfx(props) {
    var ours = [props.onUpKeyDown, props.onDownKeyDown, props.onLeftKeyDown, props.onRightKeyDown]
      .some(function (k) { return k && k.__ztIcon; });
    if (!ours) return;
    props.cursorEndSFXEnabledDirection = ICON_NO_END_SFX;
    if (!T.done['icon sounds']) done('icon sounds (own move sound)');
  }
  /* every section of the game hub hidden: nothing there takes the focus, and
     going down only showed an empty page; the PS5 itself blocked the
     down key from the row in that case */
  var HUB_PARTS = ['hideButtons', 'hideTrophies', 'hideFriends', 'hideActivities', 'hideNews',
                   'hideRecommendations', 'hideTournaments', 'hideCommunity', 'hideHubStore', 'hideAbout'];
  function hubEmpty() {
    for (var i = 0; i < HUB_PARTS.length; i++) if (!THEME[HUB_PARTS[i]]) return false;
    return true;
  }
  function iconKeys(pre, props) {
    if (!THEME.iconsNav || !outOfBar(pre)) return;
    props.onUpKeyDown = iconKey(pre, 'up');
    props.onDownKeyDown = iconKey(pre, 'down');
    props.onLeftKeyDown = iconKey(pre, 'left');
    props.onRightKeyDown = iconKey(pre, 'right');
  }
  /* from the row: down to the icons below it, up to the icons between the
     bar and the row; the nearest to the focused tile */
  var rowCache = { up: new WeakMap(), down: new WeakMap() }, rowBare = {};
  function rowKey(dir, orig) {
    var cache = rowCache[dir];
    if (orig && cache.has(orig)) return cache.get(orig);
    if (!orig && rowBare[dir]) return rowBare[dir];
    var f = function (e) {
      keyLog('row ' + dir + (orig ? '' : ' (around)'), e);
      if (taken(e)) return false;
      if (THEME.iconsNav) {
        var fx = 172 + (THEME.rowX || 0) + (THEME.focusX || 0), y = dir === 'down' ? rowTop() : rowMid();
        var n = nearest([fx, y], dir, null, dir === 'down' ? belowRow : aboveRow);
        if (!n.pre) n = nearest([960, y], dir, null, dir === 'down' ? belowRow : aboveRow);
        if (n.pre && T.iconRefs && T.iconRefs[n.pre]) {
          take(e);
          if (pressed(e)) focusIcon(n.pre);
          return false;
        }
      }
      return orig ? orig.apply(this, arguments) : true;
    };
    if (orig) cache.set(orig, f); else rowBare[dir] = f;
    return f;
  }
  /* ---- left on the first tile of the row: to the icons left of the row ----
     (themes with a side bar). Candidates: the icons out of the bar (place from
     the fields) and the Power / Trophies buttons (place measured on the
     screen when they lay out). The nearest to the row's middle wins; right on
     that icon goes back to the row. */
  T.barBox = T.barBox || {};
  var barHosts = {}, barHostRefs = {};
  function barHostRef(pre, extra) {
    if (barHostRefs[pre]) return barHostRefs[pre];
    return (barHostRefs[pre] = function (inst) {
      barHosts[pre] = inst || null;
      if (extra) extra.current = inst;
    });
  }
  function barBoxMeasure(pre) {
    var h = barHosts[pre];
    if (!h || typeof h.measureInWindow !== 'function') return;
    try {
      h.measureInWindow(function (x, y, w, hh) {
        if (typeof x !== 'number' || typeof y !== 'number') return;
        T.barBox[pre] = [x, y, w || 104, hh || 56];
        if (!T.done['bar box ' + pre]) done('bar box ' + pre + ' ' + Math.round(x) + ',' + Math.round(y));
      });
    } catch (e) { if (!T.done['bar box ' + pre]) done('bar box ' + pre + ': ' + e); }
  }
  function rowStartX() { return 172 + (THEME.rowX || 0) + (THEME.focusX || 0); }
  /* centre of each icon that can take the focus */
  function leftCandidates() {
    var out = [];
    shownIcons().forEach(function (pre) {
      if (!outOfBar(pre) && !detached()[pre]) return;
      var q = iconScreen(pre);
      out.push({ pre: pre, x: q[0] + 52, y: q[1] + 28 });
    });
    ['powerBtn', 'trophyBtn'].forEach(function (pre) {
      var b = T.barBox[pre];
      barBoxMeasure(pre); /* fresh for the next time (the bar may have moved) */
      if (THEME[pre + 'On'] && b) out.push({ pre: pre, x: b[0] + b[2] / 2, y: b[1] + b[3] / 2 });
    });
    return out.filter(function (c) { return c.x < rowStartX() && T.iconRefs && T.iconRefs[c.pre]; });
  }
  function atFirstTile() {
    var sel = T.selectedId;
    if (!sel) return false;
    var lists = [T.rowData, T.rowDataMedia];
    for (var i = 0; i < lists.length; i++) {
      var l = lists[i];
      if (!Array.isArray(l) || !l.length) continue;
      var first = null;
      for (var j = 0; j < l.length && !first; j++) if (l[j] && typeof l[j].id === 'string') first = l[j].id;
      if (first === sel) return true;
    }
    return false;
  }
  var rowLeftCache = new WeakMap(), rowLeftBare = null;
  function rowLeft(orig) {
    if (orig && rowLeftCache.has(orig)) return rowLeftCache.get(orig);
    if (!orig && rowLeftBare) return rowLeftBare;
    var f = function (e) {
      keyLog('row left', e);
      if (!T.done['row left key seen']) done('row left key seen');
      if (rowLeftGo(e)) return false;
      return orig ? orig.apply(this, arguments) : true;
    };
    if (orig) rowLeftCache.set(orig, f); else rowLeftBare = f;
    return f;
  }
  /* true when it took the key (first tile, an icon on the left) */
  function rowLeftGo(e) {
    if (taken(e) || !THEME.iconsNav || T.folderOpen || !atFirstTile()) return false;
    var best = null, score = 1e9, mid = rowMid(), sx = rowStartX();
    leftCandidates().forEach(function (c) {
      var sc = (sx - c.x) + 2 * Math.abs(c.y - mid);
      if (sc < score) { score = sc; best = c.pre; }
    });
    if (!best) {
      if (!T.done['row left: no icon on the left']) done('row left: no icon on the left');
      return false;
    }
    take(e);
    if (pressed(e)) {
      tabMoveSound(-1);
      if (focusIcon(best)) T.fromRowIcon = best;
      if (!T.done['row left to ' + best]) done('row left to ' + best);
    }
    return true;
  }
  /* The row's own onLeftKeyDown never gets the key (the strand moves in
     native code, like up): the key goes to the tile's focusable View
     ({name: <id>, focusable}), as in the open folder. Every tile gets it;
     it only acts on the selected first one. */
  var tileLeftFns = {};
  function tileLeftKeys(props) {
    if (!THEME.iconsNav || props.focusable !== true || typeof props.name !== 'string') return;
    var id = props.name;
    if (!/^[A-Z]{4}\d{5}$/.test(id) && id.indexOf(FOLDER) !== 0) return;
    var cur = props.onLeftKeyDown;
    /* the open folder's own keys already ask rowLeftGo */
    if (cur && (cur.__ztLeft || (tileKeyFns[id] && cur === tileKeyFns[id].onLeftKeyDown))) return;
    var orig = typeof cur === 'function' ? cur : null, c = tileLeftFns[id];
    if (!c || c.orig !== orig) {
      var f = function (e) {
        keyLog('tile ' + id + ' left', e);
        if (!T.done['tile left key seen']) done('tile left key seen');
        if (T.selectedId === id && rowLeftGo(e)) return false;
        return orig ? orig.apply(this, arguments) : true;
      };
      f.__ztLeft = true;
      c = tileLeftFns[id] = { orig: orig, f: f };
    }
    props.onLeftKeyDown = c.f;
  }
  /* the keys of a Power / Trophies button: out of the bar, the icons' path
     (to the profile, settings, the other button, back to the row); in the bar
     (or reached from the row with left), right goes back to the row,
     otherwise the PS5's own path */
  var barKeyFns = {};
  function barKey(pre, dir, orig) {
    var k = pre + dir;
    var f = barKeyFns[k];
    if (f && f.orig === orig) return f;
    f = function (e) {
      if (!taken(e) && barOut(pre)) return iconKey(pre, dir).apply(this, arguments);
      if (!taken(e) && dir === 'right' && T.fromRowIcon === pre) {
        take(e);
        if (pressed(e)) { tabMoveSound(1); T.fromRowIcon = null; focusRow(); }
        return false;
      }
      return orig ? orig.apply(this, arguments) : true;
    };
    f.orig = orig;
    f.__ztIcon = true;
    return (barKeyFns[k] = f);
  }
  /* keeps the native ref of each bar button (for focus()) and forwards it */
  var refCache = new WeakMap();
  function keepRef(pre, orig) {
    var key = orig && (typeof orig === 'object' || typeof orig === 'function') ? orig : keepRef;
    var per = refCache.get(key);
    if (!per) refCache.set(key, per = {});
    if (per[pre]) return per[pre];
    var mine = null;
    return (per[pre] = function (inst) {
      T.iconRefs = T.iconRefs || {};
      /* Settings draws two buttons (one without focus(), seen in a log): only one
         that can take the focus is kept, and only its own unmount clears it */
      if (inst && typeof inst.focus === 'function') T.iconRefs[pre] = mine = inst;
      else if (!inst && mine && T.iconRefs[pre] === mine) T.iconRefs[pre] = mine = null;
      if (inst && !T.done['icon ref ' + pre])
        done('icon ref ' + pre + ' (focus ' + typeof inst.focus + ')');
      if (typeof orig === 'function') orig(inst);
      else if (orig && typeof orig === 'object') orig.current = inst;
    });
  }
  function topIcons(props, type) {
    /* other symbol: the props that Search / Settings give module 270 */
    if (props.testID === 'system-search' || props.testID === 'system-settings') {
      /* the bar button itself, for the extra bar buttons */
      /* (Settings too: a theme can hide Search, then it never draws) */
      if (!T.sysBtn && type) {
        T.sysBtn = type;
        done('bar button (module 270, from ' + props.testID + ')');
        var ls = T.sysBtnListeners || [];
        setTimeout(function () { ls.forEach(function (f) { try { f(); } catch (e) {} }); }, 0);
      }
      var preI = props.testID === 'system-search' ? 'search' : 'settings';
      var v = iconValue(THEME[preI + 'Icon']);
      if (v && 'iconId' in props) {
        props.iconId = v;
        if (!T.done['icon ' + preI]) done('icon ' + preI + ' = ' + v);
      }
      return;
    }
    if (!THEME.iconsNav) return;
    /* module 270 Button (search / settings): icon = the iconId */
    if (props.iconSize && props.icon != null && 'legacy' in props && typeof props.onFocus === 'function') {
      var pre = props.icon === (iconValue(THEME.searchIcon) || 'search') ? 'search'
              : props.icon === (iconValue(THEME.settingsIcon) || 'settings') ? 'settings' : null;
      if (pre) {
        props.ref = keepRef(pre, props.ref);
        iconKeys(pre, props);
        return;
      }
      /* the extra bar buttons (same Button): their ref, for left from the row */
      var bpre = THEME.powerBtnOn && props.icon === (iconValue(THEME.powerBtnIcon) || 'power') ? 'powerBtn'
               : THEME.trophyBtnOn && props.icon === (iconValue(THEME.trophyBtnIcon) || 'trophies') ? 'trophyBtn' : null;
      if (bpre) {
        props.ref = keepRef(bpre, props.ref);
        ['up', 'down', 'left', 'right'].forEach(function (d) {
          var n = 'on' + d.charAt(0).toUpperCase() + d.slice(1) + 'KeyDown';
          props[n] = barKey(bpre, d, typeof props[n] === 'function' ? props[n] : null);
        });
      }
      return;
    }
    /* profile (module 742): the focusable is jsx(X, {focusStyle: 'rectangle',
       onFocus, onPress, children: View > Avatar {isMe: true}}) */
    if (props.focusStyle === 'rectangle' && typeof props.onFocus === 'function') {
      var ch = props.children, av = ch && ch.props && ch.props.children;
      if (av && av.props && av.props.isMe === true) {
        props.ref = keepRef('profile', props.ref);
        iconKeys('profile', props);
      }
    }
  }
  function seeRow(props) {
    /* the View around the row (experienceSwitcherWrapper) */
    /* only with icons that way: a handler of ours that lets the key through
       changed the stock path (down went into an empty hub) */
    var isWrap = THEME.iconsNav && T.rowWrapStyle && props.style && hasStyle(props.style, T.rowWrapStyle);
    var isRow = 'LazyTileOptionsMenu' in props && typeof props.onDownKeyDown === 'function';
    if (!isWrap && !isRow) return;
    var below = shownIcons().some(belowRow), above = shownIcons().some(aboveRow);
    if (isWrap && (below || above)) {
      if (above) props.onUpKeyDown = rowKey('up', typeof props.onUpKeyDown === 'function' ? props.onUpKeyDown : null);
      if (below) props.onDownKeyDown = rowKey('down', typeof props.onDownKeyDown === 'function' ? props.onDownKeyDown : null);
      if (!T.done['row keys (around)']) done('row keys (around)');
    }
    if (!isRow) return;
    if (props.ref) T.switcherRef = props.ref;
    if (THEME.iconsNav) {
      /* the row's own down (useHubViewer: to the hub), for the icons below it */
      if (!props.onDownKeyDown.__zt) T.hubDown = props.onDownKeyDown;
      if (below) {
        props.onDownKeyDown = rowKey('down', props.onDownKeyDown);
        props.onDownKeyDown.__zt = true;
      }
      if (above) props.onUpKeyDown = rowKey('up', typeof props.onUpKeyDown === 'function' ? props.onUpKeyDown : null);
      if ((below || above) && !T.done['row keys']) done('row keys');
    }
    /* left on the first tile: to the icons left of the row */
    if (THEME.iconsNav) props.onLeftKeyDown = rowLeft(typeof props.onLeftKeyDown === 'function' ? props.onLeftKeyDown : null);
    /* an empty Favourites tab: down stays on the (hidden) row */
    if (extraTabsOn()) props.onDownKeyDown = favEmptyDown(props.onDownKeyDown);
  }

  function moveIcons(o) {
    if (T.done['icons'] || !o || typeof o !== 'object' || !o.Search ||
        !o.Settings || !o.Profile)
      return;
    if (!T.React || !T.rn || !T.rn.View) {
      log('icons: React/View not available yet');
      return;
    }
    var changed = [];
    for (var name in ICONS) {
      var pre = ICONS[name];
      var x = THEME[pre + 'X'] || 0, y = THEME[pre + 'Y'] || 0;
      var hidden = !!THEME['hide' + pre.charAt(0).toUpperCase() + pre.slice(1)];
      var comp = o[name];
      if (comp) {
        T.iconOrig = T.iconOrig || {};
        T.iconOrig[pre] = comp;
      }
      if (outOfBar(pre)) hidden = true; /* leaves the bar; drawn on the Home */
      var scaleI = THEME[pre + 'Scale'] || 1;
      if ((!x && !y && scaleI === 1 && !hidden && !THEME.measureScreen) || !comp) continue;
      var inner = typeof comp === 'function' ? comp : comp.type;
      if (typeof inner !== 'function') {
        log('icon ' + name + ': unknown shape');
        continue;
      }
      var swapped = hidden ? barProps(pre) : movedIcon(inner, x, y, pre);
      if (replace(o, name, swapped))
        changed.push(name + (hidden ? ' (hidden)' : ''));
    }
    done('icons');
    if (changed.length) log('icons moved: ' + changed.join(', '));
    /* the extra bar buttons go in front of Search, in the bar's own row */
    if (barBtnsOn() && o.Search) {
      if (replace(o, 'Search', barExtras(o.Search))) done('top bar buttons');
      else log('top bar buttons: Search not replaceable');
    }
  }

  /* ---- extra buttons in the top bar (powerBtnOn, trophyBtnOn, padInfoOn) ----
     Drawn right before Search in the bar's row (the module's Search is
     wrapped). Power and Trophies are the bar's own button (module 270, the
     one Search uses: focus, name under it when selected, left / right with
     the other icons) with another iconId. The controller is a plain View:
     not focusable, the cursor goes past it. */
  /* pstc = the Trophies app (rnps-trophy, AppSystem's uri table) */
  var TROPHY_LINK = 'pstc:browse';
  var POWER_ITEMS = [['rest', 'Enter Rest Mode'], ['restart', 'Restart PS5'], ['off', 'Turn Off PS5']];
  function barBtnsOn() { return !!(THEME.powerBtnOn || THEME.trophyBtnOn || THEME.padInfoOn); }
  function barExtras(SearchComp) {
    var React = T.React;
    return React.memo(function (props) {
      return React.createElement(React.Fragment, null,
        React.createElement(BarExtras, props),
        React.createElement(SearchComp, props));
    });
  }
  /* the Trophies app opener (useLink is a hook: its own component) */
  function TrophyOpener() {
    T.trophyOpen = T.useLink(TROPHY_LINK);
    return null;
  }
  function powerMenuClose(ref) {
    var m = ref && ref.current;
    try { if (m && typeof m.close === 'function') m.close(); } catch (e) { log('power menu close: ' + e); }
  }
  function powerPick(ref, what) {
    powerMenuClose(ref);
    log('power menu: ' + what);
    try { console.log('THEME-POWER ' + what); } catch (e) {}
  }
  function BarExtras(props) {
    var React = T.React, rn = T.rn;
    /* every hook first (a hook after a return unmounts the Home) */
    var setTick = React.useState(0)[1];
    var powerRef = React.useRef(null), menuRef = React.useRef(null), anchorRef = React.useRef(null);
    var tgt = React.useState(null), target = tgt[0], setTarget = tgt[1];
    /* the bar button (module 270) is known once Search or Settings has
       drawn: drawn again then */
    React.useEffect(function () {
      var ls = T.sysBtnListeners = T.sysBtnListeners || [];
      var f = function () { setTick(function (n) { return n + 1; }); };
      ls.push(f);
      if (T.sysBtn) f();
      return function () { var i = ls.indexOf(f); if (i >= 0) ls.splice(i, 1); };
    }, []);
    React.useEffect(function () {
      var h = nodeOf(anchorRef.current || powerRef.current);
      if (h != null && h !== target) setTarget(h);
    });
    var Btn = T.sysBtn, out = [];
    var place = function (key, pre, x, y, ref, child) {
      var st = { left: x || 0, top: y || 0 }, sc = THEME[pre + 'Scale'], op = THEME[pre + 'Opacity'];
      if (sc > 0 && sc !== 1) st.transform = [{ scale: sc }];
      if (op >= 0 && op < 1) st.opacity = op;
      var p = { key: key, collapsable: false, style: st };
      if (ref) p.ref = ref;
      /* where it really is on the screen (left from the row) */
      if (THEME.iconsNav && (pre === 'powerBtn' || pre === 'trophyBtn')) {
        p.ref = barHostRef(pre, ref);
        p.onLayout = function () { barBoxMeasure(pre); };
      }
      if (THEME.measureScreen) withMeasure(pre, p);
      /* far below the bar (a side bar): the bar goes up out of the screen when
         the Home moves up to a hub / the Game Library, these stayed on it */
      var fade = barLowFade(y);
      if (fade) child = React.createElement(rn.Animated.View, { style: { opacity: fade } }, child);
      return React.createElement(rn.View, p, child);
    };
    var button = function (pre, icon, title, onPress) {
      var p = {};
      for (var k in props) p[k] = props[k];
      p.iconId = icon; p.iconIndex = 0; p.testID = 'zt-' + pre; p.title = title; p.onPress = onPress;
      p.key = 'zt-btn-' + pre;
      return React.createElement(Btn, p);
    };
    if (THEME.powerBtnOn && Btn) {
      out.push(place('zt-bar-power', 'powerBtn', THEME.powerBtnX, THEME.powerBtnY, powerRef,
        [button('power', iconValue(THEME.powerBtnIcon) || 'power', 'Power', function () {
          var m = menuRef.current;
          if (!T.done['power menu ref']) done('power menu ref (' + (m ? Object.keys(m).concat(Object.keys(Object.getPrototypeOf(m) || {})).join(',').slice(0, 200) : 'none') + ')');
          try { if (m && typeof m.open === 'function') m.open(); else log('power menu: no open()'); } catch (e) { log('power menu open: ' + e); }
        }), powerAnchor(anchorRef)]));
      var ps = T.rnps;
      if (ps && ps.OptionsMenuPS && ps.MenuListItemPS && ps.MenuListItemPS.Button) {
        var items = POWER_ITEMS.map(function (it) {
          return React.createElement(ps.MenuListItemPS.Button, { key: 'zt-power-' + it[0], disabled: false, label: it[1],
            onPress: function () { powerPick(menuRef, it[0]); } });
        });
        /* no size in the row */
        out.push(React.createElement(rn.View, { key: 'zt-bar-power-menu', pointerEvents: 'box-none',
          style: { position: 'absolute', width: 0, height: 0 } },
          React.createElement(ps.OptionsMenuPS, { ref: menuRef, contextItems: items, globalItems: [],
            onRequestClose: function () { powerMenuClose(menuRef); }, targetComponent: target, __ztPower: true })));
      } else if (!T.done['power menu: no OptionsMenuPS']) done('power menu: no OptionsMenuPS');
    }
    if (THEME.trophyBtnOn && Btn) {
      if (T.useLink) out.push(React.createElement(TrophyOpener, { key: 'zt-bar-trophy-link' }));
      out.push(place('zt-bar-trophy', 'trophyBtn', THEME.trophyBtnX, THEME.trophyBtnY, null,
        button('trophy', iconValue(THEME.trophyBtnIcon) || 'trophies', 'Trophies', function () {
          log('trophies button: ' + TROPHY_LINK + (typeof T.trophyOpen === 'function' ? '' : ' (no useLink)'));
          try { if (typeof T.trophyOpen === 'function') T.trophyOpen(); } catch (e) { log('trophies button: ' + e); }
        })));
    }
    if (THEME.padInfoOn)
      out.push(place('zt-bar-pad', 'padInfo', THEME.padInfoX, THEME.padInfoY, null, React.createElement(PadInfo, null)));
    if (out.length && !T.done['top bar buttons drawn']) done('top bar buttons drawn (' + out.length + (Btn ? '' : ', no bar button yet') + ')');
    return out.length ? out : null;
  }

  /* The power menu opens at its target: a button low on the screen had the
     menu going out of the bottom. The target is an empty box over the button,
     moved up so the whole menu fits above the last line of the screen. */
  var POWER_MENU_H = 330, SCREEN_BOTTOM = 1040;
  function powerAnchor(ref) {
    var React = T.React, rn = T.rn;
    var sc = THEME.powerBtnScale > 0 ? THEME.powerBtnScale : 1;
    var top = BAR_TOP + (THEME.iconsY || 0) + (THEME.powerBtnY || 0);
    var bottom = top + 28 + 28 * sc; /* scaled from the centre of its 56 px */
    var dy = Math.min(0, SCREEN_BOTTOM - POWER_MENU_H - bottom);
    if (dy && !T.done['power menu anchor']) done('power menu anchor ' + Math.round(dy) + ' px');
    return React.createElement(rn.View, { key: 'zt-power-anchor', ref: ref, collapsable: false, pointerEvents: 'none',
      style: { position: 'absolute', left: 0, top: dy / sc, width: 104, height: 56 } });
  }
  /* the bar buttons' top on the screen (measured: y = 21 + iconsY + …Y) */
  var BAR_TOP = 21;
  function barLowFade(y) {
    var A = T.rn && T.rn.Animated;
    if (!A || !A.View || !T.homeLift || typeof T.homeLift.interpolate !== 'function') return null;
    if (BAR_TOP + (THEME.iconsY || 0) + (y || 0) <= 130) return null;
    return T.homeLift.interpolate({ inputRange: [-150, 0], outputRange: [0, 1], extrapolate: 'clamp' });
  }
  /* the controller's battery: VshNMSystemShellUIPeripheralModule (the Home's
     native peripheral module) with the user's id; the answer is looked
     through for a battery number and a charging flag (field names not known
     yet: the first answers go to the log) */
  var padLogs = 0;
  function padModule() {
    var nm = T.rn && T.rn.NativeModules;
    return nm ? nm.VshNMSystemShellUIPeripheralModule : null;
  }
  function padFind(o, depth, out) {
    if (!o || typeof o !== 'object' || depth > 5) return out;
    /* the controller first (the list also has the microphone...) */
    if (Array.isArray(o.results)) {
      var pads = o.results.filter(function (r) { return r && /controller/i.test(String(r.type || '')); });
      if (pads.length) return padFind(pads[0], depth + 1, out);
    }
    for (var k in o) {
      var v = o[k];
      /* battery: {state: 'charged'} (no number over Remote Play) or with a level */
      if (/batt/i.test(k) && v && typeof v === 'object' && !Array.isArray(v)) {
        for (var bk in v) {
          if (typeof v[bk] === 'number' && out.level == null && /level|remain|percent|capacity|value|charge/i.test(bk)) { out.level = v[bk]; out.key = k + '.' + bk; }
          else if (typeof v[bk] === 'string' && out.state == null && /state|status/i.test(bk)) out.state = v[bk];
          else if (typeof v[bk] === 'boolean' && /charg/i.test(bk) && out.charging == null) out.charging = v[bk];
        }
        continue;
      }
      if (/batt/i.test(k) && /charg/i.test(k) && out.charging == null && (typeof v === 'boolean' || typeof v === 'number')) out.charging = !!v;
      else if (/batt/i.test(k) && typeof v === 'number' && out.level == null) { out.level = v; out.key = k; }
      else if (/charg/i.test(k) && out.charging == null && (typeof v === 'boolean' || typeof v === 'number')) out.charging = !!v;
      else if (v && typeof v === 'object') padFind(v, depth + 1, out);
    }
    return out;
  }
  function padPercent(f) {
    if (f && typeof f.level !== 'number' && typeof f.state === 'string' && /charged|full/i.test(f.state)) return 100;
    if (!f || typeof f.level !== 'number' || f.level < 0) return null;
    var v = f.level;
    /* 0..10 steps (libScePad) or 0..100 */
    if (v <= 10 && !/percent|pct/i.test(f.key || '')) v = v * 10;
    return Math.max(0, Math.min(100, Math.round(v)));
  }
  function padRead(cb) {
    var m = padModule();
    if (!m) {
      if (!T.done['controller: no peripheral module']) done('controller: no peripheral module');
      return cb(null);
    }
    if (!T.done['controller module']) done('controller module (' + Object.keys(m).join(',').slice(0, 400) + ')');
    var uid = T.homeUserId;
    var calls = [];
    if (typeof uid === 'number') {
      if (typeof m.GetUserAssignedPeripheralInfoList === 'function') calls.push(['assigned', function () { return m.GetUserAssignedPeripheralInfoList({ userId: uid }); }]);
      if (typeof m.GetDisconnectablePeripheralInfoList === 'function') calls.push(['disconnectable', function () { return m.GetDisconnectablePeripheralInfoList({ userId: uid }); }]);
    } else if (!T.done['controller: no user id yet']) done('controller: no user id yet');
    var i = 0;
    var next = function () {
      if (i >= calls.length) return cb(null);
      var c = calls[i++];
      var got = function (r) {
        if (typeof r === 'string') { try { r = JSON.parse(r); } catch (e) {} }
        if (padLogs < 4) {
          padLogs++;
          var s = '';
          try { s = JSON.stringify(r); } catch (e) { s = String(r); }
          log('controller ' + c[0] + ': ' + String(s).slice(0, 700));
        }
        var f = padFind(r, 0, {});
        var st = typeof f.state === 'string' ? f.state : '';
        /* 'charged' = full (plugged in, not charging any more) */
        var charging = f.charging != null ? !!f.charging : /charging/i.test(st);
        /* a state without a number (e.g. 'charging'): icon only */
        if (padPercent(f) == null && !st) return next();
        cb({ pct: padPercent(f), charging: charging, raw: f.level != null ? f.level : st, key: f.key || 'state' });
      };
      try {
        var r = c[1]();
        if (r && typeof r.then === 'function') r.then(got, function (e) { log('controller ' + c[0] + ': ' + e); next(); });
        else got(r);
      } catch (e) { log('controller ' + c[0] + ': ' + e); next(); }
    };
    next();
  }
  function padBatteryIcon(b) {
    if (b.pct == null) return b.charging ? 'battery_charging' : 'battery_unknown';
    if (b.charging) return b.pct >= 100 ? 'battery_full_charged' : 'battery_charging';
    return b.pct >= 67 ? 'battery_full' : b.pct >= 34 ? 'battery_half' : b.pct >= 10 ? 'battery_low' : 'battery_empty';
  }
  /* padInfoBattery 'inside': the battery is the controller icon itself,
     filled from the bottom: 100% all white; >=75% 3/4; >=50% half; >=25%
     1/4 yellow; below red (1/8). The empty part is the same icon, faint.
     Charging: all white with a green bolt on top of it. */
  var PAD_GREEN = '#3ad04a', PAD_YELLOW = '#ffd23f';
  function padFill(bat) {
    var white = THEME.padInfoColor || '#ffffff';
    if (!bat) return { frac: 1, color: white, faint: false };
    var p = bat.pct, f;
    /* charging: the controller all white, the green bolt on top */
    if (bat.charging) return { frac: 1, color: white, bolt: true };
    if (p == null || p >= 100) f = { frac: 1, color: white };
    else if (p >= 75) f = { frac: 0.75, color: white };
    else if (p >= 50) f = { frac: 0.5, color: white };
    else if (p >= 25) f = { frac: 0.25, color: PAD_YELLOW };
    else f = { frac: 0.125, color: THEME.padInfoLowColor || '#ff5050' };
    if (bat.charging) f.bolt = true;
    return f;
  }
  function padBolt(React, rn, size) {
    /* our white bolt (Assets/particles/btn_bolt.png), tinted green */
    /* on top of the controller, in its middle */
    var h = Math.round(size * 0.62), w = Math.round(h * 0.7);
    return React.createElement(rn.Image, { key: 'bolt', resizeMode: 'contain',
      source: { uri: 'file://' + ZT_ASSETS + 'particles/btn_bolt.png' },
      style: { position: 'absolute', left: Math.round((size - w) / 2), top: Math.round((size - h) / 2) - Math.round(size * 0.04),
               width: w, height: h, tintColor: PAD_GREEN } });
  }
  function padInside(React, rn, icon, size, bat) {
    var f = padFill(bat), kids = [];
    if (f.frac < 1)
      kids.push(React.createElement(rn.View, { key: 'empty', style: { position: 'absolute', left: 0, top: 0, opacity: 0.3 } },
        decoIcon(icon, size, THEME.padInfoColor || '#ffffff')));
    var h = Math.round(size * f.frac);
    kids.push(React.createElement(rn.View, { key: 'fill', style: { position: 'absolute', left: 0, bottom: 0, width: size, height: h, overflow: 'hidden' } },
      React.createElement(rn.View, { style: { position: 'absolute', left: 0, bottom: 0, width: size, height: size } }, decoIcon(icon, size, f.color))));
    if (f.bolt) kids.push(padBolt(React, rn, size));
    return React.createElement(rn.View, { style: { width: size, height: size } }, kids);
  }
  function PadInfo() {
    var React = T.React, rn = T.rn;
    var st = React.useState(T.padBattery || null), bat = st[0], setBat = st[1];
    React.useEffect(function () {
      var live = true, last = '', early = 0, te = 0;
      var read = function () {
        padRead(function (b) {
          if (!live) return;
          /* nothing yet (user id not seen): again soon, a few times */
          if (!b && early++ < 5) te = setTimeout(read, 3000);
          var sig = b ? b.pct + '|' + b.charging : 'none';
          if (sig !== last) {
            last = sig;
            log('controller battery: ' + (b ? (b.pct == null ? '?' : b.pct) + '%' + (b.charging ? ' charging' : '') + ' (' + b.key + ' = ' + b.raw + ')' : 'not found'));
          }
          T.padBattery = b;
          setBat(b);
        });
      };
      /* every 5 s: plugging the controller in shows up soon */
      var t0 = setTimeout(read, 1500), t = setInterval(read, 5000);
      return function () { live = false; clearTimeout(t0); clearTimeout(te); clearInterval(t); };
    }, []);
    var size = THEME.padInfoSize > 0 ? THEME.padInfoSize : THEME.iconSize > 0 ? THEME.iconSize : 38;
    var col = THEME.padInfoColor || '#ffffff', mode = THEME.padInfoBattery || 'both';
    var bcol = bat && bat.charging ? PAD_GREEN : bat && bat.pct != null && bat.pct <= 20 ? (THEME.padInfoLowColor || '#ff5050') : col;
    var padIcon = THEME.padInfoIcon || 'ps5_wireless_controller';
    if (mode === 'inside') {
      if (!T.done['controller drawn']) done('controller drawn (battery inside)');
      return React.createElement(rn.View, { pointerEvents: 'none',
        style: { flexDirection: 'row', alignItems: 'center', height: 56, paddingLeft: 16, paddingRight: 16 } },
        padInside(React, rn, padIcon, size, bat));
    }
    /* the battery icon and the % keep their place before the first reading
       and at any level: the bar row is right aligned, so a wider controller
       pushed Power / Trophies (left of it) to the left */
    var kids = [React.createElement(rn.View, { key: 'pad' }, decoIcon(padIcon, size, THEME.padInfoColor || null))];
    if (mode !== 'text') {
      var bsz = Math.round(size * 0.8);
      kids.push(React.createElement(rn.View, { key: 'bat', style: { marginLeft: 8, width: bsz, height: bsz } },
        bat ? decoIcon(padBatteryIcon(bat), bsz, bcol) : null));
    }
    if (mode !== 'icon') {
      var px = fontSize(THEME.padInfoFontSize || 24) || 24;
      kids.push(React.createElement(rn.View, { key: 'pct', style: { marginLeft: 6, width: Math.round(px * 2.7) } },
        bat && bat.pct != null ? React.createElement(rn.Text, { numberOfLines: 1, style: { fontSize: px, color: bcol } }, bat.pct + '%') : null));
    }
    if (!T.done['controller drawn']) done('controller drawn');
    return React.createElement(rn.View, { pointerEvents: 'none',
      style: { flexDirection: 'row', alignItems: 'center', height: 56, paddingLeft: 16, paddingRight: 16 } }, kids);
  }

  /* ---- PlayStation Store tile ----
     The row reads the game list with useAtomValue(atomFamily(space)) (jotai):
     an array of {id: titleId, ...}; the Store is NPXS40047. With hideStore,
     useAtomValue returns a copy without it. The copy is cached per source
     list, so React does not see a new list on every render. */
  var STORE = 'NPXS40047';
  var filteredCache = new WeakMap(), rowsSeen = {}, rowSpaceLogs = {};
  function removedIds() {
    var ids = {};
    if (THEME.hideStore) ids[STORE] = true;
    if (THEME.hideAllApps) ids.NPXS40056 = true;
    if (THEME.hideGallery) ids.NPXS40075 = true;
    String(THEME.hideTiles || '').split(',').forEach(function (t) {
      t = t.trim();
      if (t) ids[t] = true;
    });
    return ids;
  }
  function filterRow(list) {
    if (!Array.isArray(list) || !list.length) return list;
    var state = (T.allGamesVer || 0) + '|' + THEME.folders;
    var cached = filteredCache.get(list);
    if (cached && cached.state === state) return cached.out;
    if (!list[0] || typeof list[0].id !== 'string') return list;
    if (DEBUG.on) {
      var names = list.slice(0, 40).map(function (e) {
        var n = e && (e.name || e.titleName || e.title);
        return e ? e.id + (typeof n === 'string' ? '=' + n : '') : '?';
      }).join(', ');
      if (!rowsSeen[names]) {
        rowsSeen[names] = true;
        log('row ids: ' + names.slice(0, 420));
      }
    }
    var ids = removedIds(), has = false;
    for (var i = 0; i < list.length; i++)
      if (list[i] && ids[list[i].id]) { has = true; break; }
    var out = list;
    if (has) {
      out = list.filter(function (e) { return !e || !ids[e.id]; });
      if (!T.done.store) done('store');
    }
    if (DEBUG.on) probeItems(list);
    var space = rowSpace(list);
    /* diagnostics: the space of each row that has folder tiles */
    var tiles = list.filter(function (e) { return e && typeof e.id === 'string' && e.id.indexOf(FOLDER) === 0; });
    if (tiles.length) {
      var sp = 'row space ' + space + ': ' + list.length + ' items, ' +
               list.filter(function (e) { return e && 'hubUri' in e; }).length + ' with hubUri, 71=' +
               list.some(function (e) { return e && e.id === 'NPXS40071'; }) + ', 139=' +
               list.some(function (e) { return e && e.id === 'NPXS40139'; }) + ', ' +
               list.slice(0, 4).map(function (e) { return e && e.id; }).join(',') + '…' +
               list.slice(-2).map(function (e) { return e && e.id; }).join(',');
      if (!rowSpaceLogs[sp] && Object.keys(rowSpaceLogs).length < 12) { rowSpaceLogs[sp] = true; log(sp); }
    }
    if (space) {
      sendGames(list);
      out = folderRow(list, out, space);
    }
    if (out === list) return list;
    filteredCache.set(list, { state: state, out: out });
    return out;
  }

  /* ---- game folders (experimental) ----
     PS4 style: a folder is a tile in the row (a copy of a row item with id
     ZTFOLDERn and a fake titleId, so the tile options never act on a real
     game); its games leave the row. While the folder tile is selected, its
     games are drawn in a strip under the row (FolderStrip, its own focus layer
     'zt-folder'): down (or X on the folder) goes into it, up comes back, X on
     a game starts it (the Home's useLink('psgm:play?id=<id>'), as the tiles
     do). The games can be any installed game: ZhiThemes reads /user/app and
     sends the list as data 'allgames' ({id, name, icon}). */
  var FOLDER = 'ZTFOLDER', folderListeners = [];
  T.folderSel = '';
  T.folderOpen = '';   /* foldersOpenWithX: the folder whose strip X opened */
  function stripShown() {
    return !!T.folderSel && !!T.folders[T.folderSel] &&
           (!THEME.foldersOpenWithX || T.folderOpen === T.folderSel);
  }
  T.allGames = null;
  function folderList() {
    var out = [];
    String(THEME.folders || '').split(';').forEach(function (part) {
      /* the last ':' separates the games; 'folders: Name: ...' typed in the
         editor field still gives Name */
      var c = part.lastIndexOf(':');
      if (c < 0) {
        var bad = 'folders: "' + part.trim() + '" has no ":" and games';
        if (part.trim() && !T.done[bad]) { T.done[bad] = true; log(bad); }
        return;
      }
      var head = part.slice(0, c).split(':').pop().replace(/['"]/g, '').split('|');
      var ids = part.slice(c + 1).split(',').map(function (t) { return t.trim(); })
                    .filter(function (t) { return t; });
      var name = head[0].trim();
      var pos = parseInt(head[2], 10);
      var space = /^m/i.test((head[3] || '').trim()) ? 'media' : 'game';
      var color = /^#[0-9a-f]{6}$/i.test((head[4] || '').trim()) ? head[4].trim() : '';
      var alpha = parseFloat(head[5]);
      if (name && ids.length)
        out.push({ name: name, icon: (head[1] || THEME.foldersIcon || '').trim(), ids: ids, space: space, color: color,
                   alpha: isNaN(alpha) ? folderAlphaDefault() : alpha, pos: isNaN(pos) ? Math.round(THEME.foldersPosition) || 0 : pos });
    });
    return out;
  }
  function folderAlphaDefault() {
    var a = parseFloat(THEME.foldersAlpha);
    return isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
  }
  function folderOfGame(id) {
    var out = null;
    if (typeof id !== 'string') return null;
    folderList().forEach(function (f, n) { if (!out && f.ids.indexOf(id) >= 0) out = FOLDER + n; });
    return out;
  }
  /* a list (experiences / records) that has this folder = the Games list */
  function listHas(list, id) {
    if (!Array.isArray(list)) return false;
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return true;
    return false;
  }
  function folderChanged() {
    folderListeners.slice().forEach(function (f) { try { f(); } catch (e) { log('folder listener error: ' + e); } });
  }
  /* a game of a folder: from the row, else from the installed list */
  function folderGame(id, byId) {
    var r = byId && byId[id];
    if (r) {
      var icon = r.iconPath && typeof r.iconPath.uri === 'string' ? r.iconPath.uri : '';
      return { id: id, name: r.experienceName || id, icon: icon, row: r };
    }
    var g = T.allGames && T.allGames[id];
    return g ? { id: id, name: g.name || id, icon: g.icon || '' } : null;
  }
  /* a mosaic (or 'auto') always shows the folder's games as they are
     now (first 3 + "+N", the tile shape): made if missing (ZhiThemes
     makes it before the console call returns), whatever name the folders
     field has. also for the row tile (it kept the stored name) */
  function folderMosaic(f) {
    if (f.icon !== 'auto' && !/^zt_folder_/.test(f.icon)) return;
    var mo = mosaicFor(f.ids, f.color || THEME.foldersColor || '#24345a', f.alpha);
    T.mosaicAsked = T.mosaicAsked || {};
    if (!T.mosaicAsked[mo.name]) {
      T.mosaicAsked[mo.name] = true;
      try { console.log('THEME-MOSAIC ' + mo.msg); } catch (e) {}
    }
    f.icon = mo.name;
  }
  function folderTile(f, n, games, base) {
    folderMosaic(f);
    var first = games[0], t = {};
    for (var k in base) t[k] = base[k];
    if (first.row) for (var k2 in first.row) t[k2] = first.row[k2];
    t.id = FOLDER + n;
    t.titleId = FOLDER + n;
    t.experienceName = f.name;
    t.linkUri = null;
    if (!first.row) {
      t.hubUri = 'pshome:gamehub?titleId=' + first.id;
      t.bgImagePath = { uri: '/user/app/' + first.id + '/sce_sys/pic0.dds' };
      t.bgMusicPath = null;
    }
    var src = t.iconPath && t.iconPath.uri || '';
    var path = f.icon ? folderIconPath(f.icon)
                      : first.icon;
    if (path) t.iconPath = { uri: (/^file:/.test(src) && path.charAt(0) === '/' ? 'file://' : '') + path };
    return t;
  }
  /* ---- folders in the app database list ----
     Everything the Home knows about the row comes from
     AppBrowseItemAccessor.getItems(ctxId, ...) -> {items: [raw records]} (one
     call per space, from fetchTitleByUserId and from the live updates). A
     folder only in the row's list was missing from the Home's own
     lookups (selected tile, tabs, focus back from the hub): the focus went to
     the tabs or the Store. Now the Games records lose the folders' games and
     get one record per folder (a copy of a game record: titleId ZTFOLDERn,
     titleName, icon, the first game's hub), so the Home treats it as a tile
     of its own. */
  function folderRecord(f, n, items, base) {
    var first = null, id0 = f.ids[0];
    items.forEach(function (r) { if (r && f.ids.indexOf(r.titleId) >= 0 && !first) first = r; });
    var src = first || base, rec = {};
    for (var k in src) rec[k] = src[k];
    var gid = first ? first.titleId : id0;
    fbgAsk(f, gid);
    folderMosaic(f);
    var icon = f.icon ? folderIconPath(f.icon)
                      : first ? first.icon0PathWithTs : '/user/appmeta/' + id0 + '/icon0.png';
    rec.titleId = FOLDER + n;
    rec.titleName = f.name;
    if (!first) rec.conceptId = '0';   /* not the conceptId of another game of the row */
    rec.deeplinkUri = null;
    rec.hubAppUri = first && first.hubAppUri ? first.hubAppUri
                  : (f.space === 'media' ? 'psmediahub:main?titleId=' : 'pshome:gamehub?titleId=') + gid;
    T.folderHubs = T.folderHubs || {};
    T.folderHubs[rec.hubAppUri] = true;
    rec.icon0PathWithTs = icon;
    rec.localConceptId = 'cid:local:' + FOLDER + n;
    rec.sndPathWithTs = null;
    /* a first game without pic0 (Bloodborne) left the folder with no
       art: the Home asked bg_hub_default.dds, with no game in it, and the
       folder's picture (asked by gid) never came; the same path as for a
       first game that is not in the row */
    var noArt = !first || !rec.pic0PathWithTs;
    if (noArt) rec.pic0PathWithTs = '/user/appmeta/' + gid + '/pic0.png';
    var ci = {};
    for (var c in (src.conceptInfo || {})) ci[c] = src.conceptInfo[c];
    ci.iconPathWithTs = icon;
    if (noArt) ci.bgImagePathWithTs = rec.pic0PathWithTs;
    rec.conceptInfo = ci;
    return rec;
  }
  /* folder background: one picture made by ZhiThemes from the folder's
     games (THEME-FOLDERBG, on a thread of its own); the names that exist come
     back as data 'zt-fbg'. The Home asks for the folder's background with the
     art of its first game (gid): that request gets the picture instead. */
  /* slices or grid (mosaic), the first 4 games; the older 'hero' and
     'aurora' are slices now */
  function fbgAsk(f, gid) {
    /* slices by default (empty too); 'art' = the first game's art */
    var style = String(THEME.foldersBg || '').trim();
    if (APP !== 'home' || style === 'art' || wallpaperSet()) return;
    if (style !== 'grid') style = 'slices';
    /* a game with its own background (custombg, PNG) gives that one
       ("ID@file"; another name, so the picture is made again) */
    var ids = f.ids.slice(0, 4).map(function (id) {
      var own = customBgUri({ uri: '/' + id + '/' });
      var file = own ? own.split('/').pop() : '';
      return /\.png$/i.test(file) ? id + '@' + file : id;
    });
    var col = f.color || THEME.foldersColor || '#24345a';
    var name = 'zt_fbg_' + foldHash('v147' + style + col + ids.join(',')) + '.png';
    T.fbgFirst = T.fbgFirst || {};
    T.fbgFirst[gid] = name;
    T.fbgAsked = T.fbgAsked || {};
    if (T.fbgAsked[name]) return;
    T.fbgAsked[name] = true;
    try { console.log('THEME-FOLDERBG ' + [name, style, col].concat(ids).join('|')); } catch (e) {}
  }
  /* with your wallpaper on (picture or video) a folder shows it too,
     not a picture of its own */
  function wallpaperSet() {
    return !!(THEME.wallpaperOn && !THEME.bgClean && typeof THEME.wallpaper === 'string' && THEME.wallpaper);
  }
  function folderBgUri(img) {
    if (APP !== 'home' || THEME.bgClean || wallpaperSet() || !T.fbgFirst || !T.fbgReady || !img || typeof img !== 'object') return '';
    var m = /([A-Z]{4}\d{5})/.exec(String(img.uri || '')), name = m && T.fbgFirst[m[1]];
    return name && T.fbgReady[name] ? 'file://' + ztPath('cache/folderbg', name) : '';
  }
  function withFolderBg(img) {
    var uri = folderBgUri(img);
    if (!uri) return img;
    var copy = {};
    for (var k in img) copy[k] = img[k];
    copy.uri = uri;
    return copy;
  }
  var recordLogs = 0, fillLogs = 0;
  function folderRecords(items) {
    var fs = folderList();
    if (!fs.length || !Array.isArray(items)) return items;
    var game = false, media = false, base = null;
    T.folderLinks = T.folderLinks || {};
    for (var i = 0; i < items.length; i++) {
      var r = items[i];
      if (!r || typeof r.titleId !== 'string') continue;
      if (r.titleId.indexOf(FOLDER) === 0) return items;
      if (r.titleId === 'NPXS40071') game = true;
      if (r.titleId === 'NPXS40139') media = true;
      if (typeof r.deeplinkUri === 'string' && r.deeplinkUri) T.folderLinks[r.titleId] = r.deeplinkUri;
      if (!base && /^[A-Z]{4}\d{5}$/.test(r.titleId) && r.titleId.indexOf('NPXS') !== 0) base = r;
    }
    var space = game && !media ? 'game' : media && !game ? 'media' : null;
    if (!space) return items;
    if (!base) base = items.filter(function (r) { return r && typeof r.titleId === 'string'; })[0];
    if (!base) return items;
    var inside = {}, mine = [];
    fs.forEach(function (f, n) {
      if (f.space !== space) return;
      mine.push({ f: f, n: n });
      f.ids.forEach(function (id) { inside[id] = true; });
    });
    if (!mine.length) return items;
    var res = items.filter(function (r) { return !r || !inside[r.titleId]; });
    /* the games that went into folders leave room for the next ones of
       every installed title (same order as the Home's), before the system
       tiles at the end. the folder tiles take places too, so the row
       keeps the Home's number of items (the Home cuts the rest: the Game
       Library went, and with it the Games row was no longer recognised) */
    var moved = items.length - res.length, gone = moved - mine.length, all = T.allRecords && T.allRecords[space];
    /* a title that left the Home's own list (deleted, or being deleted)
       is not a filler for 10 minutes */
    var raw = {}, now = Date.now();
    T.leftRow = T.leftRow || {};
    T.prevRaw = T.prevRaw || {};
    T.prevLast = T.prevLast || {};
    var lastGame = '', came = false;
    items.forEach(function (r) {
      if (!r || typeof r.titleId !== 'string') return;
      raw[r.titleId] = true;
      if (r.titleId.indexOf('NPXS') !== 0) lastGame = r.titleId;
    });
    for (var nid in raw) if (T.prevRaw[space] && !T.prevRaw[space][nid]) came = true;
    /* a game just played comes in at the front and the Home's last
       game leaves its list: pushed out, not deleted, so it can still fill a
       place (kept it out 10 minutes: the row's last place never
       changed, the one before it did) */
    for (var pid in (T.prevRaw[space] || {}))
      if (!raw[pid] && !inside[pid] && !T.leftRow[pid] && !(came && pid === T.prevLast[space]))
        T.leftRow[pid] = now;
    T.prevRaw[space] = raw;
    T.prevLast[space] = lastGame;
    var recent = function (id) { return T.leftRow[id] && now - T.leftRow[id] < 600000; };
    if (gone > 0 && all) {
      var have = {};
      res.forEach(function (r) { if (r) have[r.titleId] = true; });
      var end = res.length;
      while (end > 0 && res[end - 1] && /^NPXS/.test(res[end - 1].titleId)) end--;
      var extra = [];
      all.forEach(function (r) {
        if (extra.length >= gone || !r || typeof r.titleId !== 'string' || have[r.titleId] || inside[r.titleId] ||
            r.titleId.indexOf('NPXS') === 0 || recent(r.titleId)) return;
        extra.push(r);
      });
      res = res.slice(0, end).concat(extra, res.slice(end));
      if (fillLogs++ < 6) log('row: ' + moved + ' games in ' + mine.length + ' folders, ' + extra.length + ' more from all titles (' + space + ')');
    }
    mine.map(function (m) { return { n: m.n, pos: m.f.pos, rec: folderRecord(m.f, m.n, items, base) }; })
      .sort(function (a, b) { return a.pos - b.pos || a.n - b.n; })
      .forEach(function (t) {
        var at = Math.max(0, Math.min(res.length, t.pos));
        res = res.slice(0, at).concat([t.rec], res.slice(at));
      });
    if (space === 'game') T.folderRecordsDone = true;
    if (recordLogs++ < 6)
      log('folders in the app list (' + space + '): ' + res.slice(0, 20).map(function (r) { return r && r.titleId; }).join(','));
    return res;
  }
  /* ---- every installed title, from the app database ----
     The Home asks AppBrowseItemAccessor for the row only (contentLimit,
     filterTypeDispLocationExperienceSwitcher 'display'). The same query
     without that filter and with a big limit gives every installed title of
     each space with its real name (PS4 games too), icon, background and
     deeplink, and nothing of removed games (ShadowMountPlus reads the same
     app.db with SQLite). Sent to ZhiThemes as "THEME-GAMESALL [...]" (the
     editor's list) and used for the folders' games. */
  var ITEM_COLUMNS = ['bgMatteType', 'conceptId', 'conceptInfo', 'deeplinkUri', 'hubAppUri', 'icon0PathWithTs',
                      'localConceptId', 'pic0PathWithTs', 'pinnedStatus', 'sndPathWithTs', 'titleId', 'titleName'];
  var APP_SORT = [{ fieldName: 'sortPriority', ordering: 'ascend' }, { fieldName: 'altPinnedStatus', ordering: 'descend' },
                  { fieldName: 'lastAccessDate', ordering: 'descend' }];
  /* the query again in `delay` ms: after a failure (it failed right
     after each reload, BuildOrderClause), when a folder opens, after Delete
     in the Options menu (a game of a folder leaves no trace in the row) */
  function refreshTitles(delay, why) {
    if (!T.titlesAcc || T.lastUid == null) return;
    clearTimeout(T.allTitlesTimer);
    T.allTitlesTimer = setTimeout(function () {
      T.allTitlesTimer = null;
      T.allTitlesAsked = false;
      if (why) log('all titles again (' + why + ')');
      fetchAllTitles(T.titlesAcc, T.titlesGet, T.lastUid);
    }, delay);
  }
  function fetchAllTitles(acc, getItems, userId) {
    if (T.allTitlesAsked) return;
    T.allTitlesAsked = true;
    T.titlesAcc = acc;
    T.titlesGet = getItems;
    /* the order: the one that worked last, else ours, else the Home's;
       each failure tries the next (BuildOrderClause NullReference) */
    var sorts = [T.goodSort, APP_SORT, T.appSort, [{ fieldName: 'lastAccessDate', ordering: 'descend' }]]
      .filter(function (s, i, all) { return s && all.indexOf(s) === i; });
    var sortUsed = sorts[(T.titlesFails || 0) % sorts.length];
    var spaces = ['game', 'media'], got = {}, left = spaces.length, failed = false;
    var finish = function () {
      T.allTitlesAt = Date.now();
      var all = {}, list = [];
      spaces.forEach(function (sp) {
        (got[sp] || []).forEach(function (r) {
          if (!r || typeof r.titleId !== 'string' || all[r.titleId]) return;
          var icon = String(r.icon0PathWithTs || (r.conceptInfo && r.conceptInfo.iconPathWithTs) || '').split('?')[0];
          var bg = String(r.pic0PathWithTs || (r.conceptInfo && r.conceptInfo.bgImagePathWithTs) || '').split('?')[0];
          var g = { id: r.titleId, name: r.titleName || r.titleId, icon: icon, bg: bg, space: sp };
          all[r.titleId] = g;
          list.push(g);
          if (typeof r.deeplinkUri === 'string' && r.deeplinkUri) (T.folderLinks = T.folderLinks || {})[r.titleId] = r.deeplinkUri;
        });
      });
      var sortText = '';
      try { sortText = JSON.stringify(sortUsed); } catch (e) {}
      if (failed) {
        T.titlesFails = (T.titlesFails || 0) + 1;
        log('all titles failed with order ' + sortText);
        if (T.titlesFails <= 6) refreshTitles(3000, 'failed ' + T.titlesFails);
      } else {
        if (T.goodSort !== sortUsed) log('all titles: order ' + sortText + ' works');
        T.goodSort = sortUsed;
        T.titlesFails = 0;
      }
      if (!list.length) { log('all titles: none (keeping the /user/app list)'); return; }
      T.allGames = all;
      T.allGamesFromDb = true;
      T.allGamesVer = (T.allGamesVer || 0) + 1;
      if (!failed) T.allRecords = { game: got.game || [], media: got.media || [] };
      (T.allWaiters || []).splice(0).forEach(function (f) { try { f(); } catch (e) {} });
      log('all titles: ' + (got.game || []).length + ' games, ' + (got.media || []).length + ' media');
      try { console.log('THEME-GAMESALL ' + JSON.stringify(list)); } catch (e) {}
      /* only from a full answer: a failed query (reload) gave nothing */
      if (!failed && (got.game || []).length) folderPrune(all);
      setTimeout(folderChanged, 0);
    };
    spaces.forEach(function (sp) {
      try {
        var ad = acc.createAdapter();
        var ctx = ad && ad.ctxId;
        var cols = (T.appColumns || ITEM_COLUMNS).slice();
        if (cols.indexOf('titleName') < 0) cols.push('titleName');
        var take = function (res) {
          if (!res || !Array.isArray(res.items)) failed = true;
          got[sp] = res && Array.isArray(res.items) ? res.items : [];
          notePlayed(got[sp]);
          /* the Home deletes each adapter it made; so do we */
          try {
            if (typeof acc.deleteAdapter === 'function') {
              var d = acc.deleteAdapter(ctx);
              if (d && typeof d.then === 'function') d.then(null, function () {});
            }
          } catch (e) {}
          if (--left === 0) finish();
        };
        var query = function () {
          var r = getItems.call(acc, ctx, cols);
          if (r && typeof r.then === 'function') r.then(take, function (e) { log('all titles ' + sp + ': ' + e); take(null); });
          else take(r);
        };
        /* setSearchCondition is async (the Home awaits it): getItems right
           after it ran before the condition was set, BuildOrderClause null */
        var set = acc.setSearchCondition(ctx, { userId: userId, contentLimit: 1000, filterTypeDispLocationSpace: sp },
                                         sortUsed);
        if (set && typeof set.then === 'function')
          set.then(query, function (e) { log('all titles ' + sp + ' condition: ' + e); take(null); });
        else query();
      } catch (e) {
        log('all titles ' + sp + ' error: ' + e);
        failed = true;
        if (--left === 0) finish();
      }
    });
  }
  /* rowMaxGames = how many games (folder tiles count too) the Games row
     keeps; the system tiles (Game Library at the end) all stay. Only the list
     with the Game Library and without the Media one (NPXS40139) */
  var limitLogs = 0;
  function rowLimit(items) {
    var max = Math.floor(Number(THEME.rowMaxGames));
    if (!(max >= 1 && max < 12) || !Array.isArray(items)) return items;
    var game = false, media = false;
    items.forEach(function (r) {
      if (r && r.titleId === 'NPXS40071') game = true;
      if (r && r.titleId === 'NPXS40139') media = true;
    });
    if (!game || media) return items;
    var kept = 0, res = items.filter(function (r) {
      if (!r || typeof r.titleId !== 'string' || r.titleId.indexOf('NPXS') === 0) return true;
      return ++kept <= max;
    });
    if (res.length === items.length) return items;
    if (limitLogs++ < 6) log('row: ' + max + ' games of ' + kept + ' (rowMaxGames), ' + res.length + ' items');
    return res;
  }
  /* a game with no pic0 (Bloodborne CUSA00900: only pic1.png in its
     appmeta) has an empty pic0PathWithTs, and the Home asks no background
     for it (the previous one stayed). With its own background (custombg)
     the record gets that file, so the Home asks for it itself. (called
     setBackground from a timer with sce_sys/pic0.dds: ShellUI crashed.) */
  var ownBgLogs = 0;
  function ownBgRecords(items) {
    if (APP !== 'home' || THEME.customBgOn === false || wallpaperSet() || !Array.isArray(items)) return items;
    var out = null;
    items.forEach(function (r, i) {
      if (!r || typeof r.titleId !== 'string' || /^NPXS/.test(r.titleId) || r.pic0PathWithTs) return;
      var own = customBgUri({ uri: '/' + r.titleId + '/' });
      if (!own) return;
      var c = {};
      for (var k in r) c[k] = r[k];
      c.pic0PathWithTs = own.replace(/^file:\/\//, '');
      if (!out) out = items.slice();
      out[i] = c;
      if (ownBgLogs++ < 6) log('own background for ' + r.titleId + ' (no pic0): ' + c.pic0PathWithTs);
    });
    return out || items;
  }
  function hidesFolderGames(res) {
    if (!res || !Array.isArray(res.items)) return false;
    var inside = {};
    folderList().forEach(function (f) { f.ids.forEach(function (id) { inside[id] = true; }); });
    return res.items.some(function (r) { return r && inside[r.titleId]; });
  }
  function hookAppItems(exp) {
    var acc = exp && exp.AppBrowseItemAccessor;
    if (APP !== 'home' || !acc || typeof acc.getItems !== 'function' || acc.getItems.__theme)
      return;
    var original = acc.getItems;
    var patch = function (res) {
      try {
        if (res && typeof res === 'object' && Array.isArray(res.items)) {
          notePlayed(res.items);
          var items = ownBgRecords(rowLimit(folderRecords(res.items)));
          if (items !== res.items) {
            var copy = {};
            for (var k in res) copy[k] = res[k];
            copy.items = items;
            return copy;
          }
        }
      } catch (e) { log('folders in the app list error: ' + e); }
      return res;
    };
    var swapped = function (ctx, columns) {
      /* the list of one of our tabs (a Games query, filtered) */
      var tab = T.tabCtx && T.tabCtx[ctx];
      if (tab) return tabItems(this, original, arguments, tab);
      if (Array.isArray(columns) && columns.length) T.appColumns = columns;
      /* the Home reads its list again (a title installed or removed): every
         title again too, so a game removed leaves its folder */
      if (T.allTitlesAt && Date.now() - T.allTitlesAt > 3000 && !T.allTitlesTimer) refreshTitles(1500, '');
      var r = original.apply(this, arguments);
      if (!r || typeof r.then !== 'function') return patch(r);
      return r.then(function (res) {
        if (T.allRecords || !hidesFolderGames(res)) return patch(res);
        /* the row's games that are in folders are replaced with the
           next titles: the first time, every title is asked for now */
        return new Promise(function (ok) {
          var went = false, go = function () { if (!went) { went = true; ok(patch(res)); } };
          (T.allWaiters = T.allWaiters || []).push(go);
          setTimeout(go, 2500);
          if (!T.allTitlesAsked && T.lastUid != null) fetchAllTitles(acc, original, T.lastUid);
        });
      });
    };
    swapped.__theme = true;
    if (replace(acc, 'getItems', swapped)) done('folders in the app list');
    var cond = acc.setSearchCondition;
    if (typeof cond === 'function' && typeof acc.createAdapter === 'function' && !cond.__theme) {
      var condSwap = function (ctx, c, sort) {
        /* our tabs ask for the Games space, every title (the filter
           runs on the answer, tabItems) */
        var tab = c && typeof c === 'object' && extraTab(c.filterTypeDispLocationSpace);
        if (tab) {
          var cc = {};
          for (var ck in c) cc[ck] = c[ck];
          cc.filterTypeDispLocationSpace = 'game';
          cc.contentLimit = 1000;
          (T.tabCtx = T.tabCtx || {})[ctx] = tab.id;
          if (!T.done['tab query ' + tab.id]) done('tab query ' + tab.id);
          return cond.call(this, ctx, cc, sort);
        }
        if (T.tabCtx) delete T.tabCtx[ctx];
        /* only plain column orders: the Home's queries by a list of ids
           sort by {columnType: 'givenTitleIdListVirtual'}, which needs that
           list; ours has none (BuildOrderClause NullReference at each Apply) */
        if (Array.isArray(sort) && sort.length && sort.every(function (o) {
              return o && typeof o === 'object' && typeof o.fieldName === 'string' && !('columnType' in o); }))
          T.appSort = sort;
        var r = cond.apply(this, arguments);
        if (c && typeof c === 'object' && c.userId != null) T.lastUid = c.userId;
        if (c && typeof c === 'object' && c.userId != null && !T.allTitlesAsked) {
          var uid = c.userId;
          setTimeout(function () { fetchAllTitles(acc, original, uid); }, 1500);
        }
        return r;
      };
      condSwap.__theme = true;
      replace(acc, 'setSearchCondition', condSwap);
    }
  }
  /* ---- extra tabs after Games / Media ----
     The way AniketosHEN adds its tabs (github.com/xS3Cx/AniketosHEN, GPL-3.0,
     rn_scripts/home_inject_js.inc): the tab bar is spaceIds.map(...), a tab's
     caption textBySpaceId[id], and each space's row its own
     AppBrowseItemAccessor query made with the space id. Ours ask for the
     Games space with every title (condSwap) and the answer is filtered here
     instead of in the database: zt_recent (played, newest first), zt_fav
     (THEME.favorites, in that order, also Media apps), zt_never (never
     played). no Game Library tile (leaving it from our tab went wrong);
     only an empty row keeps it, so it is never empty. */
  function extraTabs() {
    var out = [];
    if (APP !== 'home') return out;
    if (THEME.tabRecentOn) out.push({ id: 'zt_recent', name: THEME.tabRecentName || 'Recently played' });
    if (THEME.tabFavOn) out.push({ id: 'zt_fav', name: THEME.tabFavName || 'Favourites' });
    if (THEME.tabNeverOn) out.push({ id: 'zt_never', name: THEME.tabNeverName || 'Never played' });
    return out;
  }
  function extraTab(id) {
    if (typeof id !== 'string' || id.indexOf('zt_') !== 0) return null;
    var all = extraTabs();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function isExtraSpace(v) { return !!extraTab(v); }
  /* when a record was last played (ms); 0 = never. conceptInfo.lastPlayedDate
     is what the Home itself reads (conceptLastPlayedDate) */
  function playedAt(r) {
    var v = r && (r.lastPlayedDate != null && r.lastPlayedDate !== '' ? r.lastPlayedDate
                                                                     : r.conceptInfo && r.conceptInfo.lastPlayedDate);
    if (v == null || v === '') return 0;
    var t = typeof v === 'number' ? v : Date.parse(String(v));
    if (!(t > 0) && /^\d+$/.test(String(v))) t = Number(v);
    if (!(t > 0)) return 0;
    if (t < 1e11) t *= 1000;            /* seconds */
    return t > 946684800000 ? t : 0;    /* before 2000 = the database's empty date */
  }
  var playListeners = [], playedLogs = 0;
  function notePlayed(items) {
    if (APP !== 'home' || !Array.isArray(items)) return;
    var m = T.played = T.played || {}, changed = false;
    items.forEach(function (r) {
      if (!r || typeof r.titleId !== 'string' || /^(NPXS|ZTFOLDER)/.test(r.titleId)) return;
      var t = playedAt(r);
      if (m[r.titleId] !== t) { m[r.titleId] = t; changed = true; }
      if (playedLogs < 4) {
        playedLogs++;
        log('last played: ' + r.titleId + ' lastPlayedDate=' + JSON.stringify(r.lastPlayedDate) +
            ' conceptInfo.lastPlayedDate=' + JSON.stringify(r.conceptInfo && r.conceptInfo.lastPlayedDate) + ' -> ' + t);
      }
    });
    if (changed) setTimeout(function () { playListeners.forEach(function (f) { try { f(); } catch (e) {} }); }, 0);
  }
  function favList() {
    return String(THEME.favorites || '').split(',').map(function (t) { return t.trim().toUpperCase(); })
      .filter(function (t, i, all) { return /^[A-Z]{4}\d{5}$/.test(t) && all.indexOf(t) === i; });
  }
  /* Favourites tab with no favourites: the row still holds the Game Library
     tile (an empty row is never drawn right), but it is hidden: the row box
     opacity 0 (T.favEmptyOp), the library page out of the screen, X and down
     on it do nothing (opening the library from our tab went wrong), no fake
     title, and FavEmptyMsg says what to do instead. */
  /* the same for Recently played / Never played with nothing in them */
  var favEmptyListeners = [];
  function extraTabsOn() { return !!(THEME.tabRecentOn || THEME.tabFavOn || THEME.tabNeverOn); }
  function favEmptyNow() {
    return APP === 'home' && extraTabsOn() && !!T.tabEmpty && !!T.tabEmpty[T.tabSel] && !!extraTab(T.tabSel);
  }
  function favEmptyUpdate() {
    var now = favEmptyNow();
    if (T.favEmptyShown === now) return;
    T.favEmptyShown = now;
    if (T.favEmptyOp) try { T.favEmptyOp.setValue(now ? 0 : 1); } catch (e) { log('favourites empty: ' + e); }
    if ((T.favEmptyLogs = (T.favEmptyLogs || 0) + 1) <= 6) log('favourites: ' + (now ? 'empty tab, message shown' : 'message hidden'));
    setTimeout(function () { favEmptyListeners.forEach(function (f) { try { f(); } catch (e) {} }); }, 0);
  }
  function favEmptyOpacity() {
    var A = T.rn && T.rn.Animated;
    if (!T.favEmptyOp && A && typeof A.Value === 'function') T.favEmptyOp = new A.Value(favEmptyNow() ? 0 : 1);
    return T.favEmptyOp;
  }
  /* X on the hidden Game Library tile: the handler the tile gets is asked
     at press time, so it still works in the Games tab */
  var favPressWraps = new WeakMap();
  function favEmptyItem(props) {
    var e = props.experience;
    if (!extraTabsOn() || !e || typeof e !== 'object' || e.id !== 'NPXS40071' ||
        typeof props.onItemPress !== 'function' || props.onItemPress.__ztFav) return;
    var p = props.onItemPress, w = favPressWraps.get(p);
    if (!w) {
      w = function () {
        var h = p.apply(this, arguments);
        if (typeof h !== 'function') return h;
        return function () {
          if (favEmptyNow()) { log('favourites: X on the hidden Game Library ignored'); return; }
          return h.apply(this, arguments);
        };
      };
      w.__ztFav = true;
      favPressWraps.set(p, w);
    }
    props.onItemPress = w;
  }
  /* down from the row into the library page */
  var favDownWraps = new WeakMap();
  function favEmptyDown(orig) {
    if (typeof orig !== 'function') return orig;
    var w = favDownWraps.get(orig);
    if (!w) {
      w = function (e) {
        if (favEmptyNow()) { take(e); return false; }
        return orig.apply(this, arguments);
      };
      favDownWraps.set(orig, w);
    }
    return w;
  }
  function FavEmptyMsg() {
    var React = T.React, rn = T.rn;
    var tick = React.useState(0)[1];
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      favEmptyListeners.push(f);
      return function () {
        var i = favEmptyListeners.indexOf(f);
        if (i >= 0) favEmptyListeners.splice(i, 1);
      };
    }, []);
    if (!favEmptyNow()) return null;
    var h = THEME.focusSize ? focusHeight() : 168;
    var top = 126 + (THEME.rowOffsetY || 0) + (THEME.focusY || 0);
    var px = fontSize(32) || 32, px2 = fontSize(24) || 24;
    var color = THEME.tileNameColor || '#ffffff';
    var tab = T.tabSel;
    var line2 = tab === 'zt_recent' ? THEME.tabRecentEmpty2 || 'Play a game and it shows up here.'
              : tab === 'zt_never' ? THEME.tabNeverEmpty2 || 'You have played all your games!'
              : THEME.tabFavEmpty2 || 'Add a game to your favourites!';
    /* an empty open box (Assets/particles/ui_empty_box.png, white, tinted) */
    var box = Math.round(Math.min(h * 0.55, 112));
    if (!T.done['empty tab message']) done('empty tab message (' + tab + ')');
    return React.createElement(rn.View, { pointerEvents: 'none', style: {
        position: 'absolute', left: 0, right: 0, top: top, height: h,
        alignItems: 'center', justifyContent: 'center' } },
      React.createElement(rn.Image, { key: 'i', source: { uri: 'file://' + ZT_ASSETS + 'particles/ui_empty_box.png' },
                                      style: { width: box, height: box, tintColor: color, opacity: 0.85, marginBottom: 10 } }),
      React.createElement(rn.Text, { key: 'a', style: { fontSize: px, color: color } },
                          THEME.tabFavEmpty1 || 'Nothing to show here!'),
      React.createElement(rn.Text, { key: 'b', style: { fontSize: px2, color: color, opacity: 0.75, marginTop: 8 } }, line2));
  }
  /* the rows of our tabs, by their ids: rowSpace leaves them alone (no
     folder tiles, no game list for the editor) */
  T.tabRows = {};
  function tabFilter(tab, items) {
    var games = [], lib = null, out;
    items.forEach(function (r) {
      if (!r || typeof r.titleId !== 'string') return;
      if (r.titleId === 'NPXS40071') { lib = r; return; }
      if (!/^NPXS/.test(r.titleId)) games.push(r);
    });
    if (tab === 'zt_fav') {
      var by = {};
      /* Media apps from the query of every title (their own space) */
      var media = T.allRecords && T.allRecords.media || [];
      media.forEach(function (r) { if (r && typeof r.titleId === 'string' && !/^NPXS/.test(r.titleId)) by[r.titleId] = r; });
      games.forEach(function (r) { by[r.titleId] = r; });
      out = favList().map(function (id) { return by[id]; }).filter(function (r) { return r; });
      if (!T.allRecords && !T.favWaiting && favList().length) {
        T.favWaiting = true;
        (T.allWaiters = T.allWaiters || []).push(function () { T.favWaiting = false; refreshTitleRows(); });
      }
    } else if (tab === 'zt_never') {
      out = games.filter(function (r) { return !playedAt(r); });
    } else {
      out = games.filter(function (r) { return playedAt(r) > 0; });
      out.sort(function (a, b) { return playedAt(b) - playedAt(a); });
      out = out.slice(0, Math.max(1, Math.floor(Number(THEME.tabRecentMax)) || 12));
    }
    (T.tabEmpty = T.tabEmpty || {})[tab] = !out.length;
    favEmptyUpdate();
    if (lib && !out.length) out.push(lib);
    T.tabRows[out.map(function (r) { return r.titleId; }).join(',')] = tab;
    var line = tab + ': ' + out.length + ' of ' + items.length + ' titles';
    if (!T.done['tab ' + line]) done('tab ' + line);
    return out;
  }
  function tabItems(acc, original, args, tab) {
    var cols = Array.isArray(args[1]) && args[1].length ? args[1].slice() : (T.appColumns || ITEM_COLUMNS).slice();
    /* lastPlayedDate: a column of the same accessor (the Home's AppBrowseProps) */
    ['conceptInfo', 'titleName', 'lastPlayedDate'].forEach(function (c) { if (cols.indexOf(c) < 0) cols.push(c); });
    var finish = function (res) {
      if (!res || typeof res !== 'object' || !Array.isArray(res.items)) return res;
      try {
        notePlayed(res.items);
        var copy = {};
        for (var k in res) copy[k] = res[k];
        copy.items = ownBgRecords(tabFilter(tab, res.items));
        return copy;
      } catch (e) { log('tab ' + tab + ' error: ' + e); }
      return res;
    };
    var r = original.call(acc, args[0], cols);
    if (!r || typeof r.then !== 'function') return finish(r);
    return r.then(finish);
  }
  /* our tabs started on their 2nd tile. The Home's
     getDefaultFallbackId(space, experiences) (module ~75797) gives
     experiences[1] for a space other than 'game' with more than 2 tiles (the
     one after the Store); an older version's strand.focus(0) came too early to change it.
     For our spaces it gives the first tile of that space. */
  function hookDefaultTile(exp) {
    var fb = exp && exp.getDefaultFallbackId;
    if (APP !== 'home' || !extraTabs().length || typeof fb !== 'function' ||
        typeof exp.getDefaultSelectedId !== 'function' || fb.__theme) return;
    var wrapped = function (space, list) {
      if (isExtraSpace(space) && Array.isArray(list)) {
        for (var i = 0; i < list.length; i++) {
          var e = list[i];
          if (e && e.id != null && (e.spaceId == null || e.spaceId === space)) {
            if (!T.done['tab first tile ' + space]) done('tab first tile ' + space + ': ' + e.id);
            return e.id;
          }
        }
      }
      return fb.apply(this, arguments);
    };
    wrapped.__theme = true;
    if (replace(exp, 'getDefaultFallbackId', wrapped)) done('tabs: default tile');
  }
  function isTabRow(list) {
    if (!Array.isArray(list) || !list.length) return false;
    var ids = [];
    for (var i = 0; i < list.length; i++) ids.push(list[i] && list[i].id);
    return !!T.tabRows[ids.join(',')];
  }
  /* the module with spaceIds / textBySpaceId (the tab bar's data): ours
     after Games and Media */
  function patchSpaces(o, id) {
    if (APP !== 'home' || !o || (typeof o !== 'object' && typeof o !== 'function')) return;
    var tabs = extraTabs();
    if (!tabs.length) return;
    var ids = o.spaceIds, text = o.textBySpaceId, labels = o.accessibilityLabelsBySpaceId;
    var bar = Array.isArray(ids) && ids.indexOf('game') >= 0 && ids.indexOf('media') >= 0;
    if (bar) T.spaceIds = ids;
    tabs.forEach(function (t) {
      try {
        if (bar && ids.indexOf(t.id) < 0) {
          /* always after Games / Media: Favourites first is only drawn so (tabsOrder) */
          ids.push(t.id);
          if (!T.done['tabs: spaceIds']) done('tabs: spaceIds in module ' + id + ' (' + ids.join(',') + ')');
        }
        if (text && typeof text === 'object' && !Array.isArray(text) && 'game' in text && !(t.id in text))
          text[t.id] = t.name;
        if (labels && typeof labels === 'object' && !Array.isArray(labels) && 'game' in labels && !(t.id in labels))
          labels[t.id] = t.name;
      } catch (e) { log('tabs: ' + t.id + ' not added: ' + e); }
    });
  }
  /* Back from a game (and any focus by titleId): the Home looks the title
     up in every row with cachedExperiences(...).findByTitleId, a Map of
     titleId -> tile where the last row wins, so it went to our tabs
     (Recently played) instead of Games. findBy('titleId') here gives the
     first tile outside our tabs (Games / Media); only a title that is in
     our tabs alone keeps the Home's answer. */
  function hookTitleSpace(exp) {
    if (APP !== 'home' || !exp || typeof exp.Cached !== 'function' || !exp.Cached.prototype) return;
    var owner = exp.Cached.prototype;
    while (owner && !Object.prototype.hasOwnProperty.call(owner, 'findBy')) owner = Object.getPrototypeOf(owner);
    if (!owner || typeof owner.findBy !== 'function' || owner.findBy.__zt) return;
    var orig = owner.findBy;
    var w = function (key, value) {
      var r = orig.apply(this, arguments);
      try {
        if (key !== 'titleId' || !r || !isExtraSpace(r.spaceId) || !Array.isArray(this._array)) return r;
        var a = this._array;
        for (var i = 0; i < a.length; i++) {
          var e = a[i];
          if (e && e.titleId === value && !isExtraSpace(e.spaceId)) {
            if ((T.titleSpaceLogs = (T.titleSpaceLogs || 0) + 1) <= 4)
              log('tabs: ' + value + ' found in ' + r.spaceId + ', ' + e.spaceId + ' used');
            return e;
          }
        }
      } catch (err) { log('tabs: findBy ' + err); }
      return r;
    };
    w.__zt = true;
    try { owner.findBy = w; } catch (e) { log('tabs: findBy not replaceable: ' + e); return; }
    if (owner.findBy === w) done('tabs: title lookup prefers Games');
  }
  /* L1 / R1: Games <-> Media stays the Home's; every other move goes
     through ours, with the Home's own sound and move (AniketosHEN's
     patchSpaceFocus). any order (Favourites left of Games) */
  /* tabsAlign: where the tabs sit inside their box (0 left, 0.5 centre,
     1 right); the old tabsCenter switch = centre */
  function tabsAlignPart() {
    var a = THEME.tabsAlign || (THEME.tabsCenter ? 'center' : '');
    return a === 'center' ? 0.5 : a === 'right' ? 1 : a === 'left' ? 0 : -1;
  }
  /* the tabs layer ('space-switcher', FocusLayerPS + the View it passes its
     props to) stretched across the whole box: alignSelf makes it as wide
     as the tabs and puts it left / centre / right (no change of type: a
     tabs box turned Animated.View drew nothing) */
  function tabsAlignLayer(props) {
    var part = tabsAlignPart();
    if (APP !== 'home' || part < 0 || props.name !== 'space-switcher') return;
    props.style = [props.style, { alignSelf: part === 0.5 ? 'center' : part === 1 ? 'flex-end' : 'flex-start' }];
    if (!T.done['tabs aligned']) done('tabs aligned ' + THEME.tabsAlign);
  }
  /* Favourites first: only the bar draws it on the left of Games. The
     Home's spaceIds keeps Games first (with zt_fav first, O no longer got
     out of the Game/App Library); T.spaceOrder is the order on screen */
  /* the space id of a child of the tabs layer ('game', 'media', 'zt_fav'...) */
  function tabIdOf(k) {
    if (!k || !k.props) return '';
    if (typeof k.props.name === 'string' && k.props.name.indexOf('space-switcher-') === 0) return k.props.name.slice(15);
    if (typeof k.props.spaceId === 'string') return k.props.spaceId;
    return typeof k.key === 'string' ? k.key : '';
  }
  /* tabs group: the first and last tab on screen (T.tabEnds, from the
     tabs layer) lose their outer margins in their own pass. A cloned
     style on the layer's children did not reach the tab Views (they are
     drawn later, inside other components): the pill's marginLeft
     -tabsPillPadX put the first pill over L1 and the stock marginRight
     (tabsSpacing) of the last tab pushed R1 away */
  function tabEnds(props) {
    var e = T.tabEnds;
    if (!THEME.tabsGroup || !e || typeof props.name !== 'string' ||
        props.name.indexOf('space-switcher-') !== 0 || props.focusable !== true)
      return;
    var sid = props.name.slice(15), st = {};
    if (sid === e.first) st.marginLeft = 0;
    if (sid === e.last) st.marginRight = 0;
    if (st.marginLeft == null && st.marginRight == null) return;
    props.style = [props.style, st];
    if (!T.done['tabs group ends']) done('tabs group ends ' + e.first + ' / ' + e.last);
  }
  function tabsOrder(props) {
    if (APP !== 'home' || props.name !== 'space-switcher' || !THEME.tabFavOn || THEME.tabFavFirst === false) return;
    var kids = props.children;
    var flat = Array.isArray(kids) ? (kids.length === 1 && Array.isArray(kids[0]) ? kids[0] : kids) : null;
    if (!flat) return;
    var idOf = tabIdOf;
    var fi = -1, gi = -1;
    for (var i = 0; i < flat.length; i++) {
      var id = idOf(flat[i]);
      if (id === 'zt_fav' || /zt_fav$/.test(id)) fi = i;
      else if (id === 'game' || /(^|-)game$/.test(id)) gi = i;
    }
    if (fi < 0 || gi < 0 || fi < gi) return;
    var out = flat.slice(), fav = out.splice(fi, 1)[0];
    out.splice(gi, 0, fav);
    if (flat === kids) props.children = out; else props.children = [out];
    if (!T.done['tabs: Favourites drawn first']) done('tabs: Favourites drawn first');
  }
  function spaceOrder() {
    var ids = Array.isArray(T.spaceIds) ? T.spaceIds.slice() : ['game', 'media'];
    if (THEME.tabFavOn && THEME.tabFavFirst !== false && ids.indexOf('zt_fav') > ids.indexOf('game') && ids.indexOf('game') >= 0) {
      ids.splice(ids.indexOf('zt_fav'), 1);
      ids.splice(ids.indexOf('game'), 0, 'zt_fav');
    }
    return ids;
  }
  function tabNeighbour(step) {
    /* from the tab the bar shows (T.space flickers during a change) */
    var cur = T.tabSel || T.space;
    var ids = spaceOrder(), at = ids.indexOf(cur);
    if (at < 0) return null;
    var next = ids[at + step];
    if (typeof next !== 'string') return null;
    if ((cur === 'game' && next === 'media') || (cur === 'media' && next === 'game')) return null;
    return next;
  }
  function hookSpaceFocus(exp) {
    var use = exp && exp.useSpaceFocus;
    if (APP !== 'home' || !extraTabs().length || typeof use !== 'function' || use.__theme) return;
    var cache = { right: null, left: null, go: null, value: null };
    var move = function (go, space) {
      try {
        var sound = T.rn && T.rn.SystemSoundPS;
        if (sound && typeof sound.playByID === 'function') sound.playByID('psfx_change_space');
      } catch (e) {}
      /* the new tab at once (a second quick press starts from it);
         the bar's own render then sees nothing new */
      var old = T.tabSel || T.space;
      T.space = space;
      if (T.tabSel && old !== space) {
        T.tabSel = space;
        try { spaceMoved(old, space); } catch (e) {}
        favEmptyUpdate();
      }
      go(space);
      return false;
    };
    var wrapped = function () {
      var focus = use.apply(this, arguments);
      try {
        if (!focus || typeof focus.onRKeyDown !== 'function' || typeof focus.onLKeyDown !== 'function' ||
            typeof focus.focusSpaceDefaultPosition !== 'function')
          return focus;
        var right = focus.onRKeyDown, left = focus.onLKeyDown, go = focus.focusSpaceDefaultPosition;
        if (cache.right !== right || cache.left !== left || cache.go !== go) {
          cache.right = right; cache.left = left; cache.go = go;
          cache.value = {
            right: function (e) {
              var next = e && e.keyEventType === 'Down' ? tabNeighbour(1) : null;
              return next ? move(go, next) : right.apply(this, arguments);
            },
            left: function (e) {
              var next = e && e.keyEventType === 'Down' ? tabNeighbour(-1) : null;
              return next ? move(go, next) : left.apply(this, arguments);
            }
          };
        }
        var own = {};
        for (var k in focus) own[k] = focus[k];
        own.onRKeyDown = cache.value.right;
        own.onLKeyDown = cache.value.left;
        return own;
      } catch (e) { log('tabs: L1/R1 ' + e); }
      return focus;
    };
    wrapped.__theme = true;
    if (replace(exp, 'useSpaceFocus', wrapped)) done('tabs: L1/R1');
  }
  /* the space of the focused tile (the hub viewer hears of each one) */
  function hookHubViewer(exp) {
    var use = exp && exp.useHubViewer;
    if (APP !== 'home' || !(extraTabs().length || THEME.playInfoOn) || typeof use !== 'function' || use.__theme) return;
    var changes = new WeakMap();
    var wrapped = function (options) {
      if (options && typeof options.onChange === 'function') {
        var change = options.onChange, w = changes.get(change);
        if (!w) {
          w = function (experience) {
            /* the focused tile for the play info (a game without pic0
               asks a background with no title id in it) */
            var vid = experience && (experience.id || experience.titleId);
            if (typeof vid === 'string' && vid !== T.viewerId) {
              T.viewerId = vid;
              setTimeout(function () { playListeners.forEach(function (f) { try { f(); } catch (e) {} }); }, 0);
            }
            if (experience && typeof experience.spaceId === 'string' && T.space !== experience.spaceId &&
                (experience.spaceId === 'game' || experience.spaceId === 'media' || isExtraSpace(experience.spaceId)))
              T.space = experience.spaceId;
            return change.apply(this, arguments);
          };
          changes.set(change, w);
        }
        options.onChange = w;
      }
      return use.apply(this, arguments);
    };
    wrapped.__theme = true;
    if (replace(exp, 'useHubViewer', wrapped)) done('tabs: hub viewer');
  }
  /* the Home's store of titles: its listeners fetch every row again (as when
     an app is installed), so a favourite shows without a reload */
  T.titleListeners = [];
  function hookTitleStore(exp) {
    var store = exp && exp.default;
    if (APP !== 'home' || !store || typeof store.fetchTitleByUserId !== 'function' ||
        typeof store.addListener !== 'function' || store.addListener.__theme) return;
    var listen = store.addListener;
    var listenW = function (handler) {
      if (typeof handler === 'function') T.titleListeners.push(handler);
      return listen.apply(this, arguments);
    };
    listenW.__theme = true;
    store.addListener = listenW;
    var unlisten = store.removeListener;
    if (typeof unlisten === 'function')
      store.removeListener = function (handler) {
        var at = T.titleListeners.indexOf(handler);
        if (at >= 0) T.titleListeners.splice(at, 1);
        return unlisten.apply(this, arguments);
      };
    done('title store listeners');
  }
  function refreshTitleRows() {
    T.titleListeners.forEach(function (f) { try { f(); } catch (e) { log('rows again: ' + e); } });
    return T.titleListeners.length;
  }
  /* Options menu: Add to / Remove from favourites (AniketosHEN's star,
     U+EFAA of the system font) */
  function favMenuOn() { return APP === 'home' && THEME.tabFavOn && THEME.favMenu !== false; }
  function favMenuItems(id) {
    if (!favMenuOn() || typeof id !== 'string') return [];
    var key = id.replace(/_\d+$/, '').toUpperCase();
    if (!/^[A-Z]{4}\d{5}$/.test(key) || /^NPXS/.test(key)) return [];
    var on = favList().indexOf(key) >= 0;
    return [menuItem('zt-fav', ' ' + (on ? 'Remove from favourites' : 'Add to favourites'),
                     'ztfav:' + (on ? 'remove' : 'add') + '?' + key)];
  }
  function favAction(url) {
    var m = /^ztfav:(add|remove)\?([A-Za-z]{4}\d{5})$/.exec(url);
    if (!m) return;
    var key = m[2].toUpperCase(), list = favList().filter(function (t) { return t !== key; });
    if (m[1] === 'add') list.unshift(key);
    THEME.favorites = list.join(',');
    /* the star over the tile once the menu has gone */
    setTimeout(function () { favEffect(m[1] === 'add', key); }, 250);
    /* the menu closes first; then the rows again, or a reload when the Home
       gave no listeners */
    setTimeout(function () {
      var n = refreshTitleRows();
      log('favourites: ' + m[1] + ' ' + key + ' -> ' + (THEME.favorites || '(none)') + (n ? ' (rows again, ' + n + ')' : ' (reload)'));
      try { console.log((n ? 'THEME-SETQ' : 'THEME-SET') + ' favorites ' + THEME.favorites); } catch (e) {}
    }, 400);
  }
  /* the pill behind the selected tab: each tab is a View
     {name: 'space-switcher-<space>'} with one Text whose style is
     [spaceSwitcherItemText, spaceSwitcherItemBlur] when not selected */
  /* the selected tab as the tab bar draws it (the one Text without
     spaceSwitcherItemBlur). an older version took T.space, which several parts of
     the Home set while the tab changes (space atom, hub viewer): it went
     media -> game -> media... up to 5 times in 150 ms, the row faded in again
     each time ("refresh" 2-3 times) and L1/R1 started from the wrong tab
     ("blocked" until pressed again). The tab change animation, the worm and
     L1/R1 follow this one only. */
  function tabSeen(props) {
    if (APP !== 'home' || typeof props.name !== 'string' || props.name.indexOf('space-switcher-') !== 0 ||
        props.focusable !== true)
      return;
    var text = props.children;
    if (!text || Array.isArray(text) || !text.props || !Array.isArray(text.props.style) || text.props.style[1]) return;
    var sid = props.name.slice('space-switcher-'.length);
    if (!T.homeReady) setTimeout(function () { homeReadySet('tabs'); }, 0);
    if (T.tabSel === sid) return;
    var old = T.tabSel;
    T.tabSel = sid;
    T.space = sid;
    if (old) try { spaceMoved(old, sid); } catch (e) { log('tab animation: ' + e); }
    if (old) lagProbe('tab change ' + old + ' -> ' + sid, 'tabLagLogs');
    favEmptyUpdate();
  }
  /* how busy the JS thread is for 1 s after a tab or game change: a 16 ms
     timer again and again, the longest wait between two is the worst stall
     (first 8 of each only) */
  function lagProbe(what, counter) {
    if ((T[counter] = (T[counter] || 0) + 1) > 8) return;
    var t0 = Date.now(), last = t0, worst = 0, late = 0;
    var step = function () {
      var now = Date.now(), gap = now - last;
      last = now;
      if (gap > worst) worst = gap;
      if (gap > 50) late += gap;
      if (now - t0 < 1000) setTimeout(step, 16);
      else log(what + ': JS thread worst stall ' + worst + ' ms, ' + late + ' ms in stalls > 50 ms');
    };
    setTimeout(step, 16);
  }
  function tabPill(props) {
    var React = T.React, rn = T.rn;
    if (!THEME.tabsPillOn || !React || !rn || typeof props.name !== 'string' ||
        props.name.indexOf('space-switcher-') !== 0 || props.focusable !== true)
      return;
    var text = props.children;
    if (!text || Array.isArray(text) || !text.props || !Array.isArray(text.props.style)) return;
    var on = !text.props.style[1];
    var padX = Math.max(0, Number(THEME.tabsPillPadX) || 0), padY = Math.max(0, Number(THEME.tabsPillPadY) || 0);
    var spacing = THEME.tabsSpacing == null ? 64 : THEME.tabsSpacing;
    var kids = [];
    var worm = wormOn();
    if (worm) {
      /* one panel for all the tabs (TabWorm); here only where each
         tab is and which one is selected */
      var sid = props.name.slice('space-switcher-'.length);
      wormLayout(props, sid);
      if (on && T.wormSel !== sid) {
        T.wormSel = sid;
        wormGo(sid);
        setTimeout(wormChanged, 0);
      }
      if (T.tabSel && T.wormSel !== T.tabSel) { T.wormSel = T.tabSel; wormGo(T.tabSel); setTimeout(wormChanged, 0); }
    }
    /* the worm needs every tab's onLayout first: until it has drawn once,
       the selected tab carries its own panel (same frame as the bar, not a
       moment after it), faded out by the worm when it shows (wormDrawn) */
    var early = on && worm && !T.wormDrawn && rn.Animated;
    if (early) {
      var pop = THEME.tabsPillOpacity == null ? 0.18 : THEME.tabsPillOpacity;
      if (!T.pillEarlyOp) T.pillEarlyOp = new rn.Animated.Value(pop);
      kids.push(React.createElement(rn.Animated.View, { key: 'zt-pill', pointerEvents: 'none', focusable: false, style: {
        position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: THEME.tabsPillCorners || 0,
        backgroundColor: THEME.tabsPillColor || '#ffffff', opacity: T.pillEarlyOp } }));
      if (!T.done['tabs pill before the worm']) done('tabs pill before the worm');
    }
    if (on && !worm) {
      kids.push(React.createElement(rn.View, { key: 'zt-pill', pointerEvents: 'none', focusable: false, style: {
        position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: THEME.tabsPillCorners || 0,
        backgroundColor: THEME.tabsPillColor || '#ffffff',
        opacity: THEME.tabsPillOpacity == null ? 0.18 : THEME.tabsPillOpacity } }));
      if (THEME.tabsPillBorderWidth > 0)
        kids.push(React.createElement(rn.View, { key: 'zt-pill-line', pointerEvents: 'none', focusable: false, style: {
          position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: THEME.tabsPillCorners || 0,
          borderWidth: THEME.tabsPillBorderWidth, borderColor: THEME.tabsPillBorderColor || '#ffffff' } }));
    }
    var tp = { key: 'zt-tab-text' };
    if (on && THEME.tabsPillTextColor) tp.style = text.props.style.concat([{ color: THEME.tabsPillTextColor }]);
    kids.push(React.cloneElement ? React.cloneElement(text, tp) : text);
    props.children = kids;
    /* the names stay where they were: the padding is taken back by the margins */
    props.style = [props.style, { paddingLeft: padX, paddingRight: padX, paddingTop: padY, paddingBottom: padY,
                                  marginLeft: -padX, marginRight: Math.max(0, spacing - padX) }];
    if (!T.done['tabs pill']) done('tabs pill');
  }
  /* tabsIconsOn: each tab shows an icon instead of its name. The tab's Text
     stays (absolute, invisible: tabSeen / tabPill read it and the screen
     reader keeps the name); the icon in its place gives the tab its size,
     so the pill, the worm and the focus frame follow it. Colour = the tab
     colour (tabsColor; the selected one tabsPillTextColor with the pill),
     the tabs not selected at tabsInactiveOpacity, like the names */
  var TAB_ICON_KEY = { game: 'tabsGameIcon', media: 'tabsMediaIcon', zt_recent: 'tabsRecentIcon',
                       zt_fav: 'tabsFavIcon', zt_never: 'tabsNeverIcon' };
  var TAB_ICON_STOCK = { game: 'game', media: 'music_and_video', zt_recent: 'history', zt_fav: 'favorite', zt_never: 'new' };
  function tabIcons(props) {
    var React = T.React, rn = T.rn;
    if (!THEME.tabsIconsOn || !React || !rn || typeof props.name !== 'string' ||
        props.name.indexOf('space-switcher-') !== 0 || props.focusable !== true)
      return;
    var sid = props.name.slice('space-switcher-'.length);
    var key = TAB_ICON_KEY[sid] || TAB_ICON_KEY[sid.replace(/^.*-/, '')];
    if (!key) return;
    var kids = Array.isArray(props.children) ? props.children : [props.children];
    var at = -1;
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      if (!k || !k.props) continue;
      if (k.key === 'zt-tab-icon') return;
      if (Array.isArray(k.props.style) && (k.key === 'zt-tab-text' || kids.length === 1)) at = i;
    }
    if (at < 0) return;
    var text = kids[at], on = !text.props.style[1];
    var v = typeof THEME[key] === 'string' && THEME[key].trim() ? THEME[key].trim() : TAB_ICON_STOCK[sid.replace(/^.*-/, '')];
    var size = Math.max(16, Number(THEME.tabsIconSize) || 48);
    var color = (on && THEME.tabsPillOn && THEME.tabsPillTextColor) || THEME.tabsColor || '#ffffff';
    var icon;
    if (/\.(png|jpe?g)$/i.test(v) || v.charAt(0) === '/')
      icon = React.createElement(rn.Image, { source: { uri: 'file://' + iconValue(v) }, resizeMode: 'contain',
                                             style: { width: size, height: size, tintColor: color } });
    else
      icon = decoIcon(v, size, color);
    if (!icon) return;
    var op = on ? 1 : (THEME.tabsInactiveOpacity == null ? 0.6 : THEME.tabsInactiveOpacity);
    var out = kids.slice();
    out.splice(at, 1,
      React.createElement(rn.View, { key: 'zt-tab-icon', pointerEvents: 'none', focusable: false,
                                     style: { width: size, height: size, opacity: op } }, icon),
      React.cloneElement(text, { key: 'zt-tab-text', style: text.props.style.concat([{ position: 'absolute', opacity: 0 }]) }));
    props.children = out;
    if (!T.done['tab icons']) done('tab icons (' + sid + ' ' + v + ')');
  }
  /* ---- the tab panel as a worm ----
     One panel behind the tabs (first child of the 'space-switcher' row)
     instead of one inside the selected tab. Each tab's place comes from its
     onLayout (x, width relative to that row, padding included). On a new
     tab the edge on the side of the move goes first and the other follows
     (it stretches, then shrinks onto the new tab). left / width are layout,
     so this one runs on the JS driver (Animated.subtract for the width). */
  var wormListeners = [];
  function wormOn() {
    var React = T.React, A = T.rn && T.rn.Animated;
    return APP === 'home' && !!THEME.tabsPillOn && THEME.animTabs !== false && canAnimate() &&
           typeof React.useState === 'function' && typeof A.subtract === 'function' &&
           typeof A.add === 'function' && typeof A.multiply === 'function';
  }
  function wormChanged() { wormListeners.forEach(function (f) { try { f(); } catch (e) {} }); }
  /* after the worm's first frame on screen: the panel of the selected tab
     (tabPill, early) goes away */
  function wormDrawn(drawn) {
    if (!drawn || T.wormDrawn) return;
    T.wormDrawn = true;
    if (T.pillEarlyOp) try { T.pillEarlyOp.setValue(0); } catch (e) {}
  }
  function wormLayout(props, sid) {
    T.wormFns = T.wormFns || {};
    var own = props.onLayout;
    if (own && own.__ztWorm) return;
    var f = function (e) {
      var l = e && e.nativeEvent && e.nativeEvent.layout;
      if (l && l.width > 0) {
        T.wormLayouts = T.wormLayouts || {};
        var o = T.wormLayouts[sid];
        if (!o || Math.abs(o.x - l.x) > 0.5 || Math.abs(o.w - l.width) > 0.5 || Math.abs(o.y - l.y) > 0.5 ||
            Math.abs(o.h - l.height) > 0.5) {
          T.wormLayouts[sid] = { x: l.x, y: l.y, w: l.width, h: l.height };
          setTimeout(wormChanged, 0);
        }
      }
      if (typeof own === 'function') return own.apply(this, arguments);
    };
    f.__ztWorm = true;
    props.onLayout = f;
  }
  /* the boxes and the top bar background wait for the bar: the Home's
     root (where they are drawn) shows before the bar, clock and icons, so
     they appeared alone first. They fade in with the first tab's layout
     (the bar is there), or after 4 s if no tab ever comes. */
  function boxesShown() {
    var A = T.rn && T.rn.Animated;
    if (!A || !A.Value) return null;
    if (!T.barOp) {
      if (T.barShown) return null;
      T.barOp = new A.Value(0);
      setTimeout(function () { barShow('no tab after 4 s'); }, 4000);
    }
    return T.barOp;
  }
  function barShow(why) {
    if (T.barShown || !T.barOp) return;
    T.barShown = true;
    try {
      T.rn.Animated.timing(T.barOp, { toValue: 1, duration: 120, useNativeDriver: true }).start();
    } catch (e) { try { T.barOp.setValue(1); } catch (e2) {} }
    if (!T.done['boxes with the bar']) done('boxes with the bar (' + why + ')');
  }
  function barReveal(props) {
    if (T.barShown || !T.barOp || APP !== 'home' || typeof props.name !== 'string' ||
        props.name.indexOf('space-switcher-') !== 0 || props.focusable !== true)
      return;
    var own = props.onLayout;
    props.onLayout = function (e) {
      var l = e && e.nativeEvent && e.nativeEvent.layout;
      if (l && l.width > 0) barShow('tab laid out');
      if (typeof own === 'function') return own.apply(this, arguments);
    };
  }
  function tabWorm(props) {
    var React = T.React;
    if (props.name !== 'space-switcher' || !wormOn()) return;
    var kids = Array.isArray(props.children) ? props.children.slice()
             : props.children != null ? [props.children] : [];
    /* FocusLayerPS hands the same props to the view inside it: once only */
    for (var j = 0; j < kids.length; j++) {
      var kk = kids[j] && (kids[j].key || (kids[j].props && kids[j].props.key));
      if (kk === 'zt-worm') return;
    }
    /* behind the tabs, in front of the tabs group background */
    var at = 0;
    while (at < kids.length && kids[at] && (kids[at].key || (kids[at].props && kids[at].props.key)) === 'zt-group-bg') at++;
    /* with a border line the old one (JS driver), else the native one */
    var Worm = THEME.tabsPillBorderWidth > 0 ? TabWorm : TabWormNative;
    kids.splice(at, 0, React.createElement(Worm, { key: 'zt-worm' }));
    props.children = kids;
    if (!T.done['tabs worm']) done('tabs worm');
  }
  /* The worm on the native driver: left / width are layout (JS driver,
     every frame on the JS thread). Here two Animated.Values, the left and
     the right edge (px in the tabs row), drive three pieces by transforms
     only (native add / multiply nodes): a left cap and a right cap (half of
     a rounded box each, translateX) and a plain middle box 100 px wide
     (translateX + scaleX; it scales from its centre). The move starts
     from wormGo() the moment the bar draws the new tab: no re-render is
     waited for. A tab change keeps the JS thread busy ~300 ms (the Home
     mounting the new row); the earlier way (new interpolations, then start
     in an effect) only moved after that, so the pill looked slow. The lead
     edge goes first and the other follows (both over the whole time, own
     easing: no delay, which would be a JS timer). */
  function wormLead(t) { return easeOut(Math.max(0, Math.min(1, t / 0.65))); }
  function wormTrail(t) { return easeOut(Math.max(0, Math.min(1, (t - 0.35) / 0.65))); }
  function wormEdges(m, t) {
    var right = m.to[0] > m.from[0];
    var lead = wormLead(t), trail = wormTrail(t);
    var kl = right ? trail : lead, kr = right ? lead : trail;
    return [m.from[0] + (m.to[0] - m.from[0]) * kl, m.from[1] + (m.to[1] - m.from[1]) * kr];
  }
  /* where the panel is now (a move cut short goes on from there) */
  function wormNow(w) {
    var m = w && w.move;
    if (!m) return w && w.at;
    var t = (Date.now() - m.t0) / m.ms;
    return t >= 1 ? m.to : wormEdges(m, Math.max(0, t));
  }
  function wormStop(v) {
    (v.runs || []).forEach(function (a) { try { a.stop(); } catch (e) {} });
    v.runs = [];
  }
  /* to the tab sid (its onLayout place), now; resumeMs = the time left of
     a move the bar mounted again in the middle of */
  function wormGo(sid, resumeMs) {
    var v = T.wormV, w = T.wormWas || {};
    var lay = sid && T.wormLayouts && T.wormLayouts[sid];
    if (!v || !lay) return;
    var to = [lay.x, lay.x + lay.w];
    var at = wormNow(w);
    var done1 = w.move && Date.now() - w.move.t0 >= w.move.ms;
    if (!resumeMs && w.sel === sid && at && (!w.move || done1) &&
        Math.abs(at[0] - to[0]) < 0.5 && Math.abs(at[1] - to[1]) < 0.5) return;
    if (!resumeMs && w.sel === sid && w.move && !done1) return;   /* already on its way there */
    wormStop(v);
    var moving = !!(w.sel && at && (w.sel !== sid || resumeMs));
    var ms = resumeMs || (THEME.animTabsMs > 0 ? THEME.animTabsMs : 280);
    if (!moving) {
      v.l.setValue(to[0]); v.r.setValue(to[1]);
      T.wormWas = { sel: sid, at: to, move: null };
      return;
    }
    var m = { from: at, to: to, t0: Date.now(), ms: ms };
    var right = to[0] > at[0];
    v.l.setValue(at[0]); v.r.setValue(at[1]);
    var A = T.rn.Animated;
    try {
      v.runs = [A.timing(v.l, { toValue: to[0], duration: ms, easing: right ? wormTrail : wormLead, useNativeDriver: true, isInteraction: false }),
                A.timing(v.r, { toValue: to[1], duration: ms, easing: right ? wormLead : wormTrail, useNativeDriver: true, isInteraction: false })];
      v.runs.forEach(function (a) { a.start(); });
    } catch (e) { v.l.setValue(to[0]); v.r.setValue(to[1]); m = null; log('tabs worm: ' + e); }
    T.wormWas = { sel: sid, at: to, move: m };
    if (m && (T.wormLogs = (T.wormLogs || 0) + 1) <= 6)
      log('tabs worm ' + (w.sel === sid ? '(mid-move)' : w.sel) + ' -> ' + sid + (right ? ' (right)' : ' (left)') + ', native, at once');
  }
  function TabWormNative() {
    var React = T.React, rn = T.rn, A = rn.Animated;
    var tick = React.useState(0)[1];
    var r = React.useRef(null);
    if (!r.current) {
      /* new values per mount (the native nodes go with the old views),
         starting where the panel is */
      var at0 = wormNow(T.wormWas);
      r.current = { l: new A.Value(at0 ? at0[0] : 0), r: new A.Value(at0 ? at0[1] : 0), runs: [], nodes: null };
    }
    var v = r.current;
    T.wormV = v;
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      wormListeners.push(f);
      /* mounted in the middle of a move: the rest of it */
      var w = T.wormWas, wm = w && w.move, left = wm ? wm.ms - (Date.now() - wm.t0) : 0;
      if (left > 30) wormGo(w.sel, left);
      return function () {
        var i = wormListeners.indexOf(f);
        if (i >= 0) wormListeners.splice(i, 1);
        wormStop(v);
        if (T.wormV === v) T.wormV = null;
      };
    }, []);
    /* every hook before any return null: a render with more hooks than the
       one before is a React error, and the whole Home went (only the
       wallpaper stayed) */
    var sel = T.wormSel, lay = sel && T.wormLayouts && T.wormLayouts[sel];
    /* first place, or the tab's place changed (font, width): no move */
    React.useEffect(function () { if (lay) wormGo(sel); });
    var drawn = !!lay;
    React.useEffect(function () { wormDrawn(drawn); });
    if (!drawn) return null;
    var h = lay.h;
    var R = Math.max(0, Math.min(Number(THEME.tabsPillCorners) || 0, h / 2));
    var op = THEME.tabsPillOpacity == null ? 0.18 : THEME.tabsPillOpacity;
    /* a full panel: the pieces overlap half a pixel (no seam); see-through:
       end to end */
    var ov = op >= 1 ? 0.5 : 0;
    var colour = THEME.tabsPillColor || '#ffffff';
    if (!v.nodes || v.nodes.R !== R || v.nodes.ov !== ov) {
      v.nodes = {
        x: A.add(A.multiply(A.add(v.l, v.r), 0.5), -50),
        sx: A.multiply(A.add(A.subtract(v.r, v.l), 2 * ov - 2 * R), 0.01),
        rx: A.add(v.r, -R),
        R: R, ov: ov
      };
    }
    var nd = v.nodes;
    var kids = [React.createElement(A.View, { key: 'mid', style: {
      position: 'absolute', left: 0, top: lay.y, width: 100, height: h, backgroundColor: colour, opacity: op,
      transform: [{ translateX: nd.x }, { scaleX: nd.sx }] } })];
    if (R > 0) {
      var cap = function (k, x, inner) {
        return React.createElement(A.View, { key: k, style: {
          position: 'absolute', left: 0, top: lay.y, width: R, height: h, overflow: 'hidden',
          transform: [{ translateX: x }] } },
          React.createElement(rn.View, { style: { position: 'absolute', left: inner, top: 0, width: 2 * R, height: h,
                                                  borderRadius: R, backgroundColor: colour, opacity: op } }));
      };
      kids.push(cap('l', v.l, 0));
      kids.push(cap('r', nd.rx, -R));
    }
    if (!T.done['tabs worm native']) done('tabs worm native');
    return React.createElement(rn.View, { pointerEvents: 'none', focusable: false,
      style: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 } }, kids);
  }
  function TabWorm() {
    var React = T.React, rn = T.rn, A = rn.Animated;
    var tick = React.useState(0)[1];
    var r = React.useRef(null);
    /* starts where the last panel was (the bar may mount again on a tab
       change: it then still moves from the old tab) */
    if (!r.current) {
      var was = T.wormWas;
      r.current = { l: new A.Value(was ? was.at[0] : 0), r: new A.Value(was ? was.at[1] : 0),
                    sel: was ? was.sel : '', at: was ? was.at : null, run: [] };
    }
    var v = r.current;
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      wormListeners.push(f);
      return function () {
        var i = wormListeners.indexOf(f);
        if (i >= 0) wormListeners.splice(i, 1);
      };
    }, []);
    var sel = T.wormSel, lay = sel && T.wormLayouts && T.wormLayouts[sel];
    var to = lay ? [lay.x, lay.x + lay.w] : null;
    React.useEffect(function () {
      if (!to) return;
      v.run.forEach(function (a) { try { a.stop(); } catch (e) {} });
      v.run = [];
      if (!v.sel || !v.at) {
        /* first place (or this panel just mounted): no move */
        v.l.setValue(to[0]); v.r.setValue(to[1]);
      } else if (v.sel !== sel) {
        var ms = THEME.animTabsMs > 0 ? THEME.animTabsMs : 280;
        var right = to[0] > v.at[0];
        var lead = right ? v.r : v.l, trail = right ? v.l : v.r;
        var leadTo = right ? to[1] : to[0], trailTo = right ? to[0] : to[1];
        try {
          v.run = [A.timing(lead, { toValue: leadTo, duration: ms * 0.65, easing: easeOut, useNativeDriver: false, isInteraction: false }),
                   A.timing(trail, { toValue: trailTo, duration: ms * 0.65, delay: ms * 0.35, easing: easeOut, useNativeDriver: false, isInteraction: false })];
          v.run.forEach(function (a) { a.start(); });
          if ((T.wormLogs = (T.wormLogs || 0) + 1) <= 6) log('tabs worm ' + v.sel + ' -> ' + sel + (right ? ' (right)' : ' (left)'));
        } catch (e) { v.l.setValue(to[0]); v.r.setValue(to[1]); log('tabs worm: ' + e); }
      } else {
        /* same tab, its place changed (font, width): no move */
        v.l.setValue(to[0]); v.r.setValue(to[1]);
      }
      v.sel = sel;
      v.at = to;
      T.wormWas = { sel: sel, at: to };
    }, [sel, to && to[0], to && to[1]]);
    React.useEffect(function () { wormDrawn(!!lay); });
    if (!lay) return null;
    var line = THEME.tabsPillBorderWidth > 0;
    var box = { position: 'absolute', left: v.l, width: A.subtract(v.r, v.l), top: lay.y, height: lay.h };
    var fill = React.createElement(rn.View, { key: 'fill', style: {
      position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: THEME.tabsPillCorners || 0,
      backgroundColor: THEME.tabsPillColor || '#ffffff',
      opacity: THEME.tabsPillOpacity == null ? 0.18 : THEME.tabsPillOpacity } });
    var kids = [fill];
    if (line)
      kids.push(React.createElement(rn.View, { key: 'line', style: {
        position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: THEME.tabsPillCorners || 0,
        borderWidth: THEME.tabsPillBorderWidth, borderColor: THEME.tabsPillBorderColor || '#ffffff' } }));
    return React.createElement(A.View, { pointerEvents: 'none', focusable: false, style: box }, kids);
  }
  /* play info: "Never played" / "Last played 3 days ago" for the focused game */
  function playedText(t) {
    if (!t) return THEME.playInfoNever || 'Never played';
    var day = 86400000, now = new Date(), d = new Date(t);
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var then = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    var days = Math.round((today - then) / day), when;
    if (days <= 0) when = 'today';
    else if (days === 1) when = 'yesterday';
    else if (days < 14) when = days + ' days ago';
    else if (days < 60) when = Math.floor(days / 7) + ' weeks ago';
    else if (days < 365) when = Math.floor(days / 30) + ' months ago';
    else when = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    return (THEME.playInfoLast || 'Last played') + ' ' + when;
  }
  function PlayInfo() {
    var React = T.React, rn = T.rn;
    var tick = React.useState(0)[1];
    React.useEffect(function () {
      var redraw = function () { tick(function (n) { return n + 1; }); };
      tileListeners.push(redraw);
      playListeners.push(redraw);
      folderListeners.push(redraw);
      return function () {
        [tileListeners, playListeners, folderListeners].forEach(function (l) {
          var i = l.indexOf(redraw);
          if (i >= 0) l.splice(i, 1);
        });
      };
    }, []);
    var id = /^[A-Z]{4}\d{5}$/.test(T.viewerId || '') ? T.viewerId : T.focusedId;
    /* not for a folder; an open folder's highlighted game has its own */
    if (T.folderSel || (typeof T.viewerId === 'string' && T.viewerId.indexOf(FOLDER) === 0)) {
      var sg = stripGame();
      id = sg ? sg.game.id : '';
    }
    if (T.space === 'media' || !id || !T.played || !(id in T.played)) return null;
    var px = fontSize(THEME.playInfoFontSize || 24) || 24, pad = Math.round(px * 0.6);
    var children = [];
    if (THEME.playInfoBgOpacity > 0)
      children.push(React.createElement(rn.View, { key: 'bg', style: {
        position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: THEME.playInfoCorners || 0,
        backgroundColor: THEME.playInfoBg || '#000000', opacity: THEME.playInfoBgOpacity } }));
    children.push(React.createElement(rn.Text, { key: 't', style: { fontSize: px, color: THEME.playInfoColor || '#ffffff' } },
                                      playedText(T.played[id])));
    var props = { pointerEvents: 'none', style: { position: 'absolute', left: THEME.playInfoX, top: THEME.playInfoY,
                                                  paddingLeft: pad, paddingRight: pad,
                                                  paddingTop: Math.round(pad / 2), paddingBottom: Math.round(pad / 2) } };
    if (THEME.measureScreen) withMeasure('playInfo', props);
    if (!T.done['play info']) done('play info');
    return infoAnim('theme-play-info-anim', id, React.createElement(rn.View, props, children));
  }

  /* only the Games row: full items (hubUri...), ending with the Game Library
     (NPXS40071), no Media items (other atoms hold all spaces with only ids,
     or only the last game) */
  function rowSpace(list) {
    var game = false, media = false, full = 0, n = 0, bare = '';
    /* a row of our tabs is no Games row (no folders in it) */
    if (isTabRow(list)) return null;
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (!e) continue;
      n++;
      if ('hubUri' in e) full++;
      else if (!bare) bare = String(e.id);
      if (e.id === 'NPXS40071') game = true;
      if (e.id === 'NPXS40139') media = true;
    }
    if (!n || full * 2 < n) return null;
    if (bare && game && !T.done['row items without hubUri']) {
      T.done['row items without hubUri'] = true;
      log('row: ' + (n - full) + ' of ' + n + ' items without hubUri (first ' + bare + ')');
    }
    if (game && !media) return 'game';
    if (media && !game) return 'media';
    return null;
  }
  function isGameRow(list) { return rowSpace(list) === 'game'; }
  /* the editor's folders tab (GET /games) gets every game the Home lists:
     "THEME-GAMES [{id, name, icon, space}]" (icon without ?ts=), when it changes.
     ZhiThemes adds the installed games the Home does not list. */
  var gamesSent = '', gamesSeen = [], gamesById = {};
  function sendGames(list) {
    try {
      list.forEach(function (e) {
        if (!e || typeof e.id !== 'string' || e.id.indexOf(FOLDER) === 0) return;
        var icon = e.iconPath && typeof e.iconPath.uri === 'string' ? e.iconPath.uri.split('?')[0] : '';
        var old = gamesById[e.id];
        if (!old) { gamesSeen.push(e.id); old = gamesById[e.id] = { id: e.id, name: '', icon: '', space: '' }; }
        if (typeof e.experienceName === 'string' && e.experienceName) old.name = e.experienceName;
        if (icon) old.icon = icon;
        if (typeof e.spaceId === 'string' && e.spaceId) old.space = e.spaceId;
      });
      var games = gamesSeen.map(function (id) { return gamesById[id]; });
      var json = JSON.stringify(games);
      if (json === gamesSent) return;
      gamesSent = json;
      console.log('THEME-GAMES ' + json);
      if (!T.done['games list']) done('games list (' + games.length + ')');
    } catch (e) { log('games list error: ' + e); }
  }
  T.folders = {};
  var folderRowLogs = {};
  function folderRow(list, out, space) {
    space = space || 'game';
    var fs = folderList();
    if (!fs.length) return out;
    var already = false;
    for (var j = 0; j < out.length; j++)
      if (out[j] && typeof out[j].id === 'string' && out[j].id.indexOf(FOLDER) === 0) already = true;
    var byId = {}, base = null;
    out.forEach(function (e) {
      if (!e) return;
      byId[e.id] = e;
      if (!base && /^[A-Z]{4}\d{5}$/.test(e.id) && e.id.indexOf('NPXS') !== 0) base = e;
    });
    base = base || out[0];
    var tiles = [], inside = {};
    T.folders = T.folders || {};
    T.folderOf = T.folderOf || {};
    T.folderTiles = T.folderTiles || {};
    T.folderRowRuns = (T.folderRowRuns || 0) + 1;
    T.folderRowAt = Date.now();
    fs.forEach(function (f, n) {
      /* a folder whose tile is in this row is this row's folder, whatever
         rowSpace said (the Games row came as another space and
         no folder had its entry) */
      if (f.space !== space && !byId[FOLDER + n]) return;
      var had = !!T.folders[FOLDER + n];
      delete T.folders[FOLDER + n];
      var games = f.ids.map(function (id) { return folderGame(id, byId); }).filter(function (g) { return g; });
      /* diagnostics: why the row leaves a folder without its entry */
      var why = FOLDER + n + ' ' + games.length + '/' + f.ids.length + ' games (list ' + list.length +
                ', out ' + out.length + ', allGames ' + (T.allGames ? Object.keys(T.allGames).length : 'none') + ')' +
                (games.length < f.ids.length ? ' missing ' + f.ids.filter(function (id) { return !folderGame(id, byId); }).join(',') : '') +
                (had && !games.length ? ' - entry REMOVED' : '');
      if (!folderRowLogs[why] && Object.keys(folderRowLogs).length < 30) { folderRowLogs[why] = true; log('folder row: ' + why); }
      if (!games.length) return;
      f.ids.forEach(function (id) { inside[id] = true; });
      T.folders[FOLDER + n] = { name: f.name, games: games, color: f.color };
      games.forEach(function (g) { T.folderOf[g.id] = FOLDER + n; });
      var tileObj = folderTile(f, n, games, base);
      T.folderTiles[tileObj.id] = tileObj;
      tiles.push({ n: n, pos: f.pos, tile: tileObj });
    });
    if (!tiles.length) return out;
    /* with the folders in the Home's app list (hookAppItems) the Games
       row always has their tiles; a list without them is another list of the
       Home (a 2-item list while a game installed got the tiles and ShellUI
       went down) */
    if (!already && T.done['folders in the app list']) {
      if (!T.done['folder tiles only in the row']) done('folder tiles only in the row (' + out.length + '-item list left as it is)');
      return out;
    }
    if (already) {
      /* the app list has them (hookAppItems): the row's own items are the tiles */
      out.forEach(function (e) { if (e && T.folders[e.id]) T.folderTiles[e.id] = e; });
      return out;
    }
    var res = out.filter(function (e) { return !e || !inside[e.id]; });
    /* each folder at its own position (in the final row), smallest first */
    tiles.slice().sort(function (a, b) { return a.pos - b.pos || a.n - b.n; }).forEach(function (t) {
      var at = Math.max(0, Math.min(res.length, t.pos));
      res = res.slice(0, at).concat([t.tile], res.slice(at));
    });
    if (!T.done.folders) done('folders (' + tiles.length + ')');
    var line = 'folders: row ' + res.slice(0, 30).map(function (e) { return e && e.id; }).join(',');
    if (!folderRowLogs[line] && Object.keys(folderRowLogs).length < 10) { folderRowLogs[line] = true; log(line); }
    return res;
  }
  /* the row component (memo(forwardRef)) is wrapped once so a folder change
     (installed games arriving after the first draw) re-renders it: a folder
     whose first game is not in the row was missing until then */
  var rowWrappers = new Map();
  function folderRowType(type) {
    var React = T.React;
    if (!React || !React.forwardRef || !React.useState) return null;
    var w = rowWrappers.get(type);
    if (w) return w;
    w = React.forwardRef(function (props, ref) {
      var st = React.useState(0), setN = st[1];
      React.useEffect(function () {
        var f = function () { setN(function (n) { return n + 1; }); };
        folderListeners.push(f);
        return function () {
          var i = folderListeners.indexOf(f);
          if (i >= 0) folderListeners.splice(i, 1);
        };
      }, []);
      var p = {};
      for (var k in props) p[k] = props[k];
      p.ref = ref;
      p.ztFolder = st[0];
      return React.createElement(type, p);
    });
    w.__ztFolder = true;
    rowWrappers.set(type, w);
    done('folder row');
    return w;
  }
  /* the row's onFocus({item, index}) says which tile is selected */
  var rowFocusWraps = new WeakMap();
  function folderRowProps(props) {
    var f = props.onFocus;
    if (typeof f !== 'function') return;
    if (props.spaceId === 'game' || props.spaceId == null) T.rowOnFocus = f;
    var w = rowFocusWraps.get(f);
    if (!w) {
      w = function (a) {
        try {
          var id = a && a.item && a.item.id;
          if (typeof id === 'string') T.lastSelId = id;
          /* rowWindow: the hub view's small tile follows where the focus stands */
          if (THEME.rowWindow && a && typeof a.index === 'number') rowWindowFocus(a.index);
          /* the focused tile's shape follows the focus */
          if (typeof id === 'string' && focusSlotUsed()) shapeFocusSet(id);
          /* the game logo follows the focus (before the name: the
             fake title asks if there is a logo) */
          if (typeof id === 'string' && logoOn()) { T.logoFocusSeen = true; logoIdSet(id); }
          /* the fake title's name (the strand's selectedItem lags) */
          if (APP === 'home' && titleMode() === 'fake' && itemName(a.item)) {
            T.rowFocusSeen = true;
            if (itemName(a.item) !== T.gameName && rowNameLogs++ < 10) log('fake title: ' + id + ' = ' + itemName(a.item));
            newName(itemName(a.item));
          }
          var sel = typeof id === 'string' && id.indexOf(FOLDER) === 0 ? id : '';
          if (typeof id === 'string' && sel !== T.folderSel && (THEME.folders || DEBUG.on)) {
            T.folderSel = sel;
            if (T.folderOpen && T.folderOpen !== sel) { T.folderOpen = ''; T.folderInStrip = false; }
            if (DEBUG.on || sel) log('folder selected: ' + (sel || 'none'));
            folderChanged();
          }
        } catch (e) { log('folder focus error: ' + e); }
        return f.apply(this, arguments);
      };
      rowFocusWraps.set(f, w);
    }
    props.onFocus = w;
  }
  /* the strand (module 26 Strand: data, renderItem, keyExtractor,
     selectedItem, onDehighlight...): an older version showed the Home's selected tile going
     empty when the focus went into the strip (tabs down=''), so the row went
     back to its start (strip not under the folder, arrows confused). While a
     folder's strip is open the strand keeps the folder as selectedItem and
     onDehighlight is logged (and not passed on while the strip has focus). */
  var strandLogs = 0, dehighWraps = new WeakMap();
  function folderStrand(props) {
    if (!('selectedItem' in props) || typeof props.renderItem !== 'function' ||
        typeof props.keyExtractor !== 'function')
      return;
    if (props.ref && typeof props.ref === 'object' && 'current' in props.ref) T.strandRef = props.ref;
    /* the Games row's list (the Media row has none of the Games folders) */
    if (Array.isArray(props.data)) {
      var media = rowSpace(props.data) === 'media';
      if (media) T.rowDataMedia = props.data;
      else T.rowData = props.data;
      if (props.ref && typeof props.ref === 'object') T[media ? 'strandRefMedia' : 'strandRefGame'] = props.ref;
    }
    selectAfterReload(props);
    selectGuard(props);
    var fo = folderOfGame(props.selectedItem);
    if (fo && listHas(props.data, fo)) {
      if (strandLogs++ < 10) log('folder strand: selectedItem ' + props.selectedItem + ' -> ' + fo);
      /* the Home still keeps the game as its selected tile (the folder
         was focused but drawn small with a round frame): tell it, once, as the
         row does when the focus moves; again when the list changes (after a reload the Home first showed a cached list, without the
         folder, and kept the game) */
      var game = props.selectedItem;
      T.toldCount = T.toldCount || {};
      if (T.rowOnFocus && (T.toldFolder !== game || T.toldData !== props.data) &&
          (T.toldCount[game] || 0) < 8) {
        T.toldFolder = game;
        T.toldData = props.data;
        T.toldCount[game] = (T.toldCount[game] || 0) + 1;
        var data = props.data, tell = T.rowOnFocus;
        setTimeout(function () {
          try {
            for (var i = 0; i < data.length; i++)
              if (data[i] && data[i].id === fo) {
                log('folder: Home told ' + game + ' -> ' + fo);
                tell({ item: data[i], index: i });
                return;
              }
          } catch (e) { log('folder tell error: ' + e); }
        }, 0);
      }
      props.selectedItem = fo;
    }
  }
  /* the row's focus layer (upCandidate 'space-switcher-...'): down goes to
     the strip while a folder is selected */
  function folderLayer(props) {
    var f = props.focusCustomSettings;
    if (typeof f.upCandidate !== 'string' || f.upCandidate.indexOf('space-switcher-') !== 0) return;
    if (typeof props.name === 'string' && props.name !== T.rowLayerName) {
      T.rowLayerName = props.name;
      log('folder: row layer ' + props.name);
    }
    if (!stripShown()) return;
    var g = {};
    for (var k in f) g[k] = f[k];
    if (THEME.foldersStripAbove) g.upCandidate = 'zt-folder';
    else g.downCandidate = 'zt-folder';
    props.focusCustomSettings = g;
  }
  /* row items: X on a folder tile goes into the strip */
  var probePress = 0, probeFocus = 0, probeSeen = {};
  function folderItem(props) {
    var e = props.experience;
    if (!e || typeof e !== 'object' || typeof props.onItemPress !== 'function') return;
    if (typeof e.id === 'string' && e.id.indexOf(FOLDER) === 0) {
      if (props.ref && typeof props.ref === 'object') (T.tileRefs = T.tileRefs || {})[e.id] = props.ref;
      /* onItemPress(item, position, fn, deeplink) is called while the tile
         renders and RETURNS the X handler */
      props.onItemPress = function () {
        return function () {
          log('folder X ' + e.id);
          T.folderSel = e.id;
          if (folderIsOpen() && T.folderOpen === e.id) stripLaunch();
          else folderOpenSet(e.id);
        };
      };
      if (!T.done['folder tile']) done('folder tile');
      return;
    }
    if (!DEBUG.on) return;
    var p = props.onItemPress, fm = props.onFocusMove;
    props.onItemPress = function () {
      var h = p.apply(this, arguments), args = describeArgs(arguments);
      if (typeof h !== 'function') return h;
      return function () {
        if (probePress++ < 20) log('probe X: ' + args);
        return h.apply(this, arguments);
      };
    };
    if (typeof fm === 'function')
      props.onFocusMove = function () {
        if (probeFocus++ < 30) log('probe focus move: ' + describeArgs(arguments));
        return fm.apply(this, arguments);
      };
  }
  function describeArgs(args) {
    return Array.prototype.map.call(args, function (a) {
      if (a && typeof a === 'object') {
        if (typeof a.id === 'string') return '{id ' + a.id + ', keys ' + Object.keys(a).join(' ') + '}';
        return '{' + Object.keys(a).map(function (k) {
          var v = a[k];
          return k + '=' + (v && typeof v === 'object' ? (typeof v.id === 'string' ? 'item ' + v.id : 'obj')
                            : typeof v === 'function' ? 'fn' : String(v).slice(0, 40));
        }).join(', ') + '}';
      }
      return typeof a === 'function' ? 'fn' : String(a).slice(0, 60);
    }).join(' | ');
  }
  function probeItems(list) {
    list.forEach(function (e) {
      if (!e || typeof e.id !== 'string') return;
      var kind = /^NPXS/.test(e.id) ? e.id : 'game';
      if (probeSeen[kind] || Object.keys(probeSeen).length > 6) return;
      probeSeen[kind] = true;
      var s = '';
      try { s = JSON.stringify(e); } catch (err) { s = Object.keys(e).join(','); }
      log('probe item ' + kind + ': ' + s.slice(0, 700));
    });
  }
  /* ---- folder navigation ----
     The native focus never leaves the folder tile: moving it into views of
     the theme left the Home without a selected tile (focus lost, jumps to the
     Store, O could not bring it back). While the folder is open its
     focusable View (name = folder id) takes the keys: left / right move the
     highlighted game of the strip (drawn by the theme), X starts it, O or up /
     down close the folder. Closed, the keys pass on as usual. */
  T.stripIdx = 0;
  T.stripOpeners = [];
  T.stripRefs = [];
  /* the keys belong to the strip only after X (with foldersOpenWithX off the
     strip already shows on selection, but left / right still leave it) */
  function folderIsOpen() { return !!T.folderOpen && T.folderOpen === T.folderSel && !!T.folders[T.folderSel]; }
  /* a folder's games for the strip, from its ids and every installed title,
     when the row has not made the entry (the strip never showed) */
  function folderEntry(id) {
    if (!id || T.folders[id]) return T.folders[id];
    log('folder ' + id + ': no entry (folders: ' + (Object.keys(T.folders).join(',') || 'none') + '; folderRow ran ' +
        (T.folderRowRuns || 0) + ' times, last ' + (T.folderRowAt ? Math.round((Date.now() - T.folderRowAt) / 1000) + ' s ago' : 'never') + ')');
    var f = folderList()[parseInt(id.slice(FOLDER.length), 10)];
    if (!f) return null;
    var games = f.ids.map(function (g) { return folderGame(g, null); }).filter(function (g) { return g; });
    if (!games.length) return null;
    T.folders[id] = { name: f.name, games: games, color: f.color };
    T.folderOf = T.folderOf || {};
    games.forEach(function (g) { T.folderOf[g.id] = id; });
    log('folder ' + id + ': games from every title (' + games.length + ')');
    return T.folders[id];
  }
  function folderOpenSet(id) {
    if (id) folderEntry(id);
    T.folderOpen = id || '';
    T.stripIdx = 0;
    pulseButton('x');
    log(id ? 'folder open ' + id : 'folder closed');
    if (id) refreshTitles(200, 'folder open');
    if (id) {
      stripBackground();
      var fo = T.folders[id];
      if (THEME.fakeTrophies && THEME.fakeTrophiesFast !== false && fo) askTrophies(fo.games.map(function (g) { return g.id; }));
    }
    else if (T.folderBgImg && T.setBackground && T.sceneControl) {
      /* through the theme's setBackground (folder picture, wallpaper or
         own background, as when the folder got selected): the raw request
         of a folder whose first game has no pic0 is a file that does not
         exist, and closing the folder left the screen black */
      try { T.sceneControl.setBackground(T.folderBgImg); }
      catch (e) { try { T.setBackground.call(T.sceneControl, withFolderBg(T.folderBgImg)); } catch (e2) {} }
      T.focusedId = '';
      try { tileChanged(); } catch (e) {}
      var fo = T.folders[T.folderSel];
      if (fo) newName(fo.name);
    }
    folderChanged();
  }
  /* the Home's background follows the highlighted game (SceneControl
     setBackground, as the Home does for a focused tile); closing gives the
     folder's back */
  function stripBackground() {
    var f = T.folders[T.folderSel], g = f && f.games[T.stripIdx];
    if (!g || !T.setBackground || !T.sceneControl) return;
    var all = T.allGames && T.allGames[g.id];
    var uri = (all && all.bg) || '/user/app/' + g.id + '/sce_sys/pic0.dds';
    /* its own background (custombg), as on its tile in the row;
       in a folder your wallpaper, when it is on, comes first */
    uri = wallpaperUri() || customBgUri({ uri: '/' + g.id + '/' }) || uri;
    var img = {};
    var last = T.lastBgImg || {};
    for (var k in last) img[k] = last[k];
    img.uri = uri;
    if (!img.type) img.type = 'Fade';
    T.lastShownBg = img.uri;
    try { T.setBackground.call(T.sceneControl, THEME.bgClean ? cleanBg(img) : img); } catch (e) { log('folder background error: ' + e); }
    /* Home trophies / title: the focused id comes from the background uri */
    T.focusedId = g.id;

    try { tileChanged(); } catch (e) {}
    newName(g.name);
  }
  function stripMove(d) {
    var f = T.folders[T.folderSel];
    if (!f) return;
    var i = Math.max(0, Math.min(f.games.length - 1, T.stripIdx + d));
    if (i === T.stripIdx) return;
    T.stripIdx = i;
    if (DEBUG.on) log('folder game ' + i + ' ' + f.games[i].id);
    stripBackground();
    folderChanged();
  }
  function stripLaunch() {
    var f = T.folders[T.folderSel], g = f && f.games[T.stripIdx], open = T.stripOpeners[T.stripIdx];
    if (!g) return;
    log('folder launch ' + g.id + (typeof open === 'function' ? '' : ' (no useLink)'));
    try { if (typeof open === 'function') open(); } catch (e) { log('folder launch error: ' + e); }
  }
  /* the folder tile's focusable View: { name: <folder id>, focusable } */
  var tileKeyFns = {};
  function folderTileKeys(props) {
    if (typeof props.name !== 'string' || props.name.indexOf(FOLDER) !== 0 || props.focusable !== true) return;
    var id = props.name;
    var k = tileKeyFns[id];
    if (!k) {
      var guard = function (name, act) {
        var before = null;
        return function (e) {
          keyLog('folder tile ' + name, e);
          if (T.folderSel !== id || !folderIsOpen()) {
            /* closed folder as the first tile: left to the icons on the left */
            if (name === 'onLeftKeyDown' && T.selectedId === id && rowLeftGo(e)) return false;
            return typeof k.orig[name] === 'function' ? k.orig[name].apply(this, arguments) : true;
          }
          if (name === 'onUpKeyDown' || name === 'onDownKeyDown') {
            /* close it and let the arrow do what it does on a tile */
            if (pressed(e)) folderOpenSet('');
            return typeof k.orig[name] === 'function' ? k.orig[name].apply(this, arguments) : true;
          }
          take(e);
          /* ←/→ held down go on moving through the games (Repeat) */
          if (pressed(e) || (e && e.keyEventType === 'Repeat' && (name === 'onLeftKeyDown' || name === 'onRightKeyDown'))) act();
          return false;
        };
      };
      k = tileKeyFns[id] = { orig: {} };
      k.onLeftKeyDown = guard('onLeftKeyDown', function () { stripMove(-1); });
      k.onRightKeyDown = guard('onRightKeyDown', function () { stripMove(1); });
      k.onUpKeyDown = guard('onUpKeyDown', function () { folderOpenSet(''); });
      k.onDownKeyDown = guard('onDownKeyDown', function () { folderOpenSet(''); });
      k.onBackKeyDown = guard('onBackKeyDown', function () { folderOpenSet(''); });
    }
    ['onLeftKeyDown', 'onRightKeyDown', 'onUpKeyDown', 'onDownKeyDown', 'onBackKeyDown'].forEach(function (n) {
      if (props[n] !== k[n]) {
        if (typeof props[n] === 'function') k.orig[n] = props[n];
        props[n] = k[n];
      }
    });
    if (!T.done['folder tile keys']) done('folder tile keys');
  }
  /* also from the folders field: the tile name is drawn before the
     row made T.folders (or without it, see folderEntry), and the name copy
     then kept the folder's name */
  function folderByName(name) {
    if (typeof name !== 'string') return null;
    if (T.folders) for (var id in T.folders) if (T.folders[id].name === name) return id;
    var fs = folderList();
    for (var n = 0; n < fs.length; n++) if (fs[n].name === name) return FOLDER + n;
    return null;
  }
  /* the folder tile's name Text (and the name copy made from it): while the
     folder is open it shows the highlighted game's name */
  function FolderTileName(props) {
    var React = T.React;
    var tick = React.useState(0)[1];
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      folderListeners.push(f);
      return function () {
        var i = folderListeners.indexOf(f);
        if (i >= 0) folderListeners.splice(i, 1);
      };
    }, []);
    var p = {}, src = props.props;
    for (var k in src) p[k] = src[k];
    var id = folderByName(src.children);
    var f = id && (T.folders[id] || (T.folderOpen === id ? folderEntry(id) : null));
    if (f && T.folderSel === id && folderIsOpen() && f.games[T.stripIdx]) p.children = f.games[T.stripIdx].name;
    p.__ztSwap = true;
    return props.jsx(props.type, p);
  }
  /* one game of the strip (only drawn; useLink gives its X action) */
  function FolderGame(props) {
    var React = T.React, rn = T.rn, g = props.game;
    var open = T.useLink ? T.useLink(folderLink(g.id)) : null;
    T.stripOpeners[props.index] = open;
    var size = THEME.foldersStripSize > 0 ? THEME.foldersStripSize : 120;
    /* the tile shape (vertical); size stays the width */
    var sizeH = Math.round(size * tileRatio());
    var on = props.index === (props.sel != null ? props.sel : T.stripIdx);
    var uri = folderGameUri(g);
    var ready = function () { if (props.onReady) props.onReady(g.id); };
    var corners = Math.round(size * (THEME.tileCorners || 16) / (THEME.tileSize || 106));
    var ring = THEME.foldersRingColor || (THEME.focusLineColorOn
      ? 'rgb(' + THEME.focusLineR + ',' + THEME.focusLineG + ',' + THEME.focusLineB + ')' : '#ffffff');
    var w = THEME.foldersRingWidth >= 0 ? THEME.foldersRingWidth : 4;
    return React.createElement(rn.View, {
      ref: function (r) { T.stripRefs[props.index] = r; }, collapsable: false,
      style: { width: size + 2 * w, height: sizeH + 2 * w, borderRadius: corners + w, padding: w,
               backgroundColor: on ? ring : 'transparent', transform: [{ scale: on ? 1.06 : 1 }] } },
      React.createElement(rn.View, {
        style: { width: size, height: sizeH, borderRadius: corners, overflow: 'hidden',
                 backgroundColor: 'rgba(255,255,255,0.08)', opacity: on ? 1 : 0.75 } },
        uri && rn.Image ? React.createElement(rn.Image, {
          source: { uri: uri }, onLoad: ready, onError: ready,
          resizeMode: 'cover',
          style: { width: size, height: sizeH } }) : null,
        /* the animated picture of the highlighted game (every game with tileAnimAll) */
        (on || THEME.tileAnimAll) && animFileFor(uri) && typeof React.useState === 'function'
          ? React.createElement(AnimTileVideo, { key: animFileFor(uri), file: animFileFor(uri), w: size, h: sizeH, k: 2,
                                                 radius: corners, focused: on })
          : null));
  }
  /* the picture of a game in an open folder: its own tile picture, else its icon */
  function folderGameUri(g) {
    var icon = String(g.icon || '').split('?')[0];
    var cover = tilePicture(g.id);
    if (cover) return 'file://' + cover;
    return icon ? (icon.charAt(0) === '/' ? 'file://' : '') + icon : '';
  }
  /* a selected folder (opened with X) already loads its games'
     pictures, out of the screen, so they are there when it opens */
  function folderPreload(id) {
    var React = T.React, rn = T.rn, f = id && T.folders && T.folders[id];
    if (!THEME.foldersOpenWithX || !f || !rn.Image) return null;
    var size = THEME.foldersStripSize > 0 ? THEME.foldersStripSize : 120, sizeH = Math.round(size * tileRatio());
    var pics = f.games.slice(0, 10).map(function (g) {
      var uri = folderGameUri(g);
      return uri ? React.createElement(rn.Image, { key: 'zt-pre-' + g.id, source: { uri: uri }, resizeMode: 'cover',
                                                    style: { width: size, height: sizeH } }) : null;
    });
    if (!T.done['folder pictures preloaded']) done('folder pictures preloaded');
    return React.createElement(rn.View, { key: 'zt-fpre', pointerEvents: 'none',
      style: { position: 'absolute', left: -4000, top: 0, flexDirection: 'row', opacity: 0 } }, pics);
  }
  function folderLink(id) {
    return (T.folderLinks && T.folderLinks[id]) || 'psgm:play?id=' + id;
  }
  function FolderLink(props) {
    T.stripOpeners[props.index] = T.useLink ? T.useLink(folderLink(props.game.id)) : null;
    return null;
  }
  function FolderStrip() {
    var React = T.React, rn = T.rn;
    var tick = React.useState(0)[1];
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      folderListeners.push(f);
      return function () {
        var i = folderListeners.indexOf(f);
        if (i >= 0) folderListeners.splice(i, 1);
      };
    }, []);
    var folder = stripShown() && T.folders[T.folderSel];
    var fid = T.folderSel, idx = T.stripIdx, exiting = false;
    if (!folder) {
      T.stripAnimKey = '';
      /* animFolderClose: the folder it showed, once more, dropping out */
      var ex = T.stripExit;
      if (!ex && T.stripWas && THEME.animFolderClose && canAnimate()) {
        ex = T.stripExit = { id: T.stripWas.id, idx: T.stripWas.idx, until: Date.now() + 130 };
        setTimeout(function () { tick(function (n) { return n + 1; }); }, 160);
        if (!T.done['folder close animation']) done('folder close animation');
      }
      T.stripWas = null;
      if (!ex || Date.now() > ex.until || !T.folders[ex.id]) { T.stripExit = null; return folderPreload(T.folderSel); }
      exiting = true; fid = ex.id; idx = ex.idx; folder = T.folders[ex.id];
    } else {
      T.stripExit = null;
      /* just opened: hidden until its pictures have loaded (or 0.6 s),
         then it comes in (the panel in the folder colour showed first and
         the covers popped in a moment later: a flash) */
      if (!T.stripWas || !T.stripLoad || T.stripLoad.id !== T.folderSel)
        T.stripLoad = { id: T.folderSel, done: {}, at: Date.now(), readyAt: 0, timer: null };
      T.stripWas = { id: T.folderSel, idx: T.stripIdx };
    }
    /* animFolders: the panel fades in and the games rise in one after
       the other when the folder opens (faster, no scale); games that
       scroll in later only fade */
    var anim = !exiting && THEME.animFolders !== false && canAnimate();
    if (anim && T.stripAnimKey !== T.folderSel) { T.stripAnimKey = T.folderSel; T.stripAnimAt = Date.now(); }
    var fresh = anim && Date.now() - (T.stripAnimAt || 0) < 300;
    var size = THEME.foldersStripSize > 0 ? THEME.foldersStripSize : 120;
    var sizeH = Math.round(size * tileRatio());
    var gap = THEME.foldersStripGap >= 0 ? THEME.foldersStripGap : 16;
    var x = 172 + (THEME.rowX || 0) + (THEME.foldersStripX || 0);
    /* the focused tile: top = 126 + rowOffsetY + focusY, bottom = top + its height */
    var top = 126 + (THEME.rowOffsetY || 0) + (THEME.focusY || 0);
    var focusH = THEME.focusSize ? focusHeight() : 168;
    var y = (THEME.foldersStripAbove ? top - sizeH - 90 : top + focusH + 54) +
            (THEME.foldersStripY || 0);
    var fit = Math.max(1, Math.floor((1920 - x - 40) / (size + gap)));
    var max = THEME.foldersStripMax > 0 ? Math.min(THEME.foldersStripMax, fit) : fit;
    var first = Math.max(0, Math.min(folder.games.length - max, idx - Math.floor(max / 2)));
    var shown = folder.games.slice(first, first + max);
    var gate = !exiting && T.stripLoad && T.stripLoad.id === fid ? T.stripLoad : null, ready = true, onReady = null;
    if (gate && !gate.readyAt) {
      var waitIds = shown.filter(function (g) { return !!folderGameUri(g); }).map(function (g) { return g.id; });
      var leftN = function () { return waitIds.filter(function (id) { return !gate.done[id]; }).length; };
      var age = Date.now() - gate.at;
      if (leftN() && age < 600) {
        ready = false;
        if (!gate.timer) gate.timer = setTimeout(function () { gate.timer = null; tick(function (n) { return n + 1; }); }, 620 - age);
        onReady = function (id) {
          if (gate.done[id]) return;
          gate.done[id] = true;
          if (!leftN()) setTimeout(function () { tick(function (n) { return n + 1; }); }, 0);
        };
      } else {
        gate.readyAt = Date.now();
        if ((T.stripLoadLogs = (T.stripLoadLogs || 0) + 1) <= 8)
          log('folder pictures: ' + (waitIds.length - leftN()) + ' of ' + waitIds.length + ' in ' + age + ' ms');
      }
    }
    var animKey = fid + (ready ? '' : '~');
    if (gate && gate.readyAt && anim) fresh = Date.now() - gate.readyAt < 300;
    var items = shown.map(function (g, j) {
      var i = first + j;
      var itemStyle = { marginRight: gap - 2 * (THEME.foldersRingWidth >= 0 ? THEME.foldersRingWidth : 4) };
      var game = React.createElement(FolderGame, { game: g, index: i, sel: idx, onReady: onReady });
      if (anim)
        return React.createElement(ZtEnter, { key: 'zt-fg-' + g.id, k: animKey, style: itemStyle,
          from: fresh ? { op: 0, y: 30 } : { op: 0 }, ms: fresh ? 180 : 140,
          delay: fresh ? j * 25 : 0 }, game);
      return React.createElement(rn.View, { key: 'zt-fg-' + g.id, style: itemStyle }, game);
    });
    /* every game still needs its useLink (X on a game out of the window) */
    var hidden = folder.games.map(function (g, i) {
      return i >= first && i < first + max ? null
        : React.createElement(FolderLink, { key: 'zt-fl-' + g.id, game: g, index: i });
    });
    if (!T.done['folder strip']) done('folder strip');
    var games = React.createElement(rn.View, { key: 'zt-fgames',
      style: { position: 'absolute', left: x, top: y, flexDirection: 'row' } }, items.concat(hidden));
    if (THEME.foldersStripBgOn !== false) {
      var pad = THEME.foldersStripBgPadding >= 0 ? THEME.foldersStripBgPadding : 16;
      var w = shown.length * (size + gap) - gap;
      var bgColor = THEME.foldersStripBg || folder.color || THEME.foldersColor || '#24345a';
      var backBox = { position: 'absolute', left: x - pad, top: y - pad, width: w + 2 * pad, height: sizeH + 2 * pad };
      var backLook = { borderRadius: THEME.foldersStripBgCorners >= 0 ? THEME.foldersStripBgCorners : 24,
        backgroundColor: bgColor,
        opacity: THEME.foldersStripBgOpacity >= 0 ? THEME.foldersStripBgOpacity : 0.6 };
      var back = anim
        ? React.createElement(ZtEnter, { key: 'zt-fbg', k: animKey, style: backBox, ms: 160,
            from: { op: 0 } },
            React.createElement(rn.View, { style: merge({ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }, backLook) }))
        : React.createElement(rn.View, { key: 'zt-fbg', style: merge(backBox, backLook) });
      games = [back, games];
    }
    var cur = folder.games[idx] || folder.games[0];
    if (!THEME.foldersHideName && cur) {
      var nsz = THEME.foldersNameSize > 0 ? THEME.foldersNameSize : 54;
      var below = top + focusH + 60;
      if (!THEME.foldersStripAbove) below = y + sizeH + 40;
      /* Text only takes sizes of the FontSizePS table: the raw size
         (Selenish: 96) was a fatal error, the Home reloaded at every X on the
         folder. The nearest size up to 72, scaled above it */
      var nbase = fontSize(Math.min(nsz, 72)) || 0, nstyle = { position: 'absolute',
        left: 172 + (THEME.rowX || 0) + (THEME.foldersNameX || 0),
        top: below + (THEME.foldersNameY || 0), width: 1500, color: '#ffffff' };
      if (nbase) nstyle.fontSize = nbase;
      if (nbase && nsz > nbase * 1.05) {
        var nk = nsz / nbase;
        nstyle.transform = [{ translateX: 750 * (nk - 1) }, { translateY: nbase * 0.7 * (nk - 1) }, { scale: nk }];
      }
      var fname = React.createElement(rn.Text, { key: 'zt-fname', numberOfLines: 2, style: nstyle }, cur.name);
      games = [].concat(games, exiting ? fname : nameAnim('zt-fname', cur.name, fname));
      if (!T.done['folder game name']) done('folder game name');
    }
    var root = { pointerEvents: 'none',
      style: { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 } };
    if (exiting) return React.createElement(ZtExit, { key: 'zt-strip-exit' }, React.createElement(rn.View, root, games));
    if (!ready) root.style.opacity = 0;
    return React.createElement(rn.View, root, games);
  }
  /* ---- Options menu of the tiles ----
     useExperienceOptionsMenu({titleId, titleName, target, onDeeplink, ...})
     (module 675) builds the menu: the items come from
     fetchExperienceOptionsByTitleId(titleId) (native OptionMenu.getOptionMenu)
     and the menu is OptionsMenuPS {contextItems, globalItems, onRequestClose,
     targetComponent = findNodeHandle(target.current)}. An item the Home does
     not know (id, actionUrl) goes to onDeeplink(actionUrl).
     - menuMove: targetComponent = MenuAnchor, a View at the focused tile
       moved by menuX/Y (for a low row the menu went off the screen)
     - folder tile: the theme's own items (open, sort, move, remove)
     - open folder: the menu is the highlighted game's (titleId swapped) plus
       move / remove / move to another folder; next to the game in the strip
     - row game: "Add to folder"
     A change goes to ZhiThemes as "THEME-SET folders <value>": written into
     theme.ztheme, then the Home reloads. */
  function MenuAnchor() {
    var React = T.React, rn = T.rn;
    if (!T.menuAnchor) T.menuAnchor = React.createRef();
    var size = THEME.focusSize || 168;
    return React.createElement(rn.View, { ref: T.menuAnchor, collapsable: false, pointerEvents: 'none',
      style: { position: 'absolute', width: size, height: THEME.focusSize ? focusHeight() : size,
               left: 172 + (THEME.rowX || 0) + (THEME.menuX || 0),
               top: 126 + (THEME.rowOffsetY || 0) + (THEME.focusY || 0) + (THEME.menuY || 0) } });
  }
  function nodeOf(r) {
    try { return r && T.rn && T.rn.findNodeHandle ? T.rn.findNodeHandle(r) : null; } catch (e) { return null; }
  }
  /* jsx: the OptionsMenuPS element */
  function optionsMenu(props) {
    if (!('contextItems' in props) || !('globalItems' in props) || !('targetComponent' in props) ||
        typeof props.onRequestClose !== 'function') return;
    /* the Power button's own menu stays where it is */
    if (props.__ztPower) return;
    if (!T.done['options menu']) done('options menu (' + Object.keys(props).join(', ') + ')');
    if (THEME.animButtons && Date.now() - (T.menuPulseAt || 0) > 1500) { T.menuPulseAt = Date.now(); pulseButton('options'); }
    if (THEME.menuMove) {
      var h = nodeOf(T.menuAnchor && T.menuAnchor.current);
      if (h != null) {
        props.targetComponent = h;
        if (!T.done['options menu moved']) done('options menu moved (anchor ' + h + ')');
      } else if (!T.done['options menu: no anchor']) done('options menu: no anchor');
    }
    if (THEME.menuNoDim) {
      props.dimBackground = false;
      if (!T.done['options menu without dim']) done('options menu without dim');
    }
  }
  /* items to remove from the tiles' Options menu (native ids) */
  var MENU_NAMES = { update: ['MENU_ID_CHECK_PATCH'], sync: ['MENU_ID_SAVE_DATA_MANAGEMENT_PS5_AUTO'],
    upload: ['MENU_ID_SAVE_DATA_MANAGEMENT_PS4_MANUAL', 'MENU_ID_SAVE_DATA_MANAGEMENT_PS5_MANUAL'],
    ip: ['MENU_ID_INTELLECTUAL_PROPERTY_NOTICES'], info: ['MENU_ID_APPLICATION_INFORMATION'],
    delete: ['MENU_ID_APPLICATION_DELETE', 'MENU_ID_APPLICATION_MULTI_DELETE'], manage: ['MENU_ID_GAME_DATA_MANAGEMENT'],
    history: ['MENU_ID_UPDATE_HISTORY'], move: ['MENU_ID_MOVE'], close: ['MENU_ID_APPLICATION_CLOSE'],
    remove: ['MENU_ID_APPLICATION_REMOVE_FROM_HOME'] };
  function menuHidden() {
    var ids = {}, keep = false, any = false;
    var words = String(THEME.menuHideIds || '').split(/[,;\s]+/);
    /* PS4 games have their saved data sync as ..._PS4_MANUAL */
    /* also the update history (PSN list) */
    if (THEME.menuOffline) words = words.concat(['update', 'history', 'sync', 'ip', 'keep', 'MENU_ID_SAVE_DATA_MANAGEMENT_PS4_MANUAL']);
    words.forEach(function (w) {
      w = w.trim();
      if (!w) return;
      var l = w.toLowerCase();
      if (l === 'keep') { keep = true; any = true; return; }
      (MENU_NAMES[l] || [w]).forEach(function (id) { ids[id] = true; any = true; });
    });
    return { ids: ids, keep: keep, any: any };
  }
  function menuFilter(items, hide, gone) {
    return items.filter(function (it) {
      if (it && hide.ids[it.id]) { gone.push(it.id); return false; }
      return true;
    }).map(function (it) {
      if (!it || !Array.isArray(it.subItems)) return it;
      var c = {};
      for (var k in it) c[k] = it[k];
      c.subItems = menuFilter(it.subItems, hide, gone);
      return c;
    });
  }
  /* the titleId every Options menu asks the system for (OptionMenu.getOptionMenu
     of the native module wrapper); the Game Library's menu has no other way */
  function hookNativeOptionMenu(exp) {
    var om = exp && exp.OptionMenu;
    if (!om || typeof om !== 'object' || typeof om.getOptionMenu !== 'function' || om.getOptionMenu.__theme) return;
    var orig = om.getOptionMenu;
    var w = function (q) {
      if (q && typeof q.titleId === 'string') {
        T.menuTitleId = q.titleId;
        if (!T.done['native options menu']) done('native options menu (' + q.titleId + ')');
      }
      return orig.apply(this, arguments);
    };
    w.__theme = true;
    if (!replace(om, 'getOptionMenu', w)) log('native OptionMenu not replaceable');
  }
  /* Game Library: "Add to folder ..." items at the end of the menu, made like
     its own items (same component); flat, the library has no submenu here */
  /* which library this is: the same app shows the Game Library
     (pslibraryhub:main?space=game) and the app library (space=media) */
  function libSpace(props) {
    var sp = null;
    ['space', 'spaceId', 'spaceType', 'libraryType'].forEach(function (k) {
      if (!sp && (props[k] === 'game' || props[k] === 'media')) sp = props[k];
    });
    if (!sp) {
      for (var k in props) {
        var v = props[k];
        if (typeof v === 'string' && /space=(game|media)/.test(v)) { sp = /space=(game|media)/.exec(v)[1]; break; }
      }
    }
    if (typeof props.screenId === 'string') {
      if (!T.done['library screen ' + props.screenId]) done('library screen ' + props.screenId);
      /* 'installed' = Game Library, 'installed_media' = app library */
      if (!sp) sp = /media/i.test(props.screenId) ? 'media' : 'game';
    }
    /* the app library's menu has no titleId: the focused tile's
       (testID 'Tile', name = title id) */
    if (props.testID === 'Tile' && typeof props.name === 'string' && props.name &&
        typeof props.onFocus === 'function' && !props.onFocus.__ztLib) {
      var tileId = props.name, onFocus = props.onFocus;
      var f = function () {
        T.libFocusId = tileId;
        return onFocus.apply(this, arguments);
      };
      f.__ztLib = true;
      props.onFocus = f;
    }
    if (sp && sp !== T.libSpace) {
      T.libSpace = sp;
      T.space = sp;   /* "new folder" goes to this space */
      log('library space: ' + sp);
    }
  }
  /* Game/App Library grid like the row. With vertical tiles the grid's
     tileSize ({width, height} 296), the native list's itemHeight and the
     tiles (testID Tile, Tile-loading, Tile-media) grow to 2:3; the picture
     (Tile-media: source + src, /user/appmeta/<id>/icon0.png) is the game's
     custom tile of the tiles' format, as on the Home */
  var libLogs = 0;
  function libTall(o, W, H, a, b) {
    if (!o || typeof o !== 'object' || Array.isArray(o) || o[a] !== W || o[b] !== W) return o;
    var out = {};
    for (var k in o) out[k] = o[k];
    out[b] = H;
    return out;
  }
  function libPicture(src, path) {
    if (!src || typeof src !== 'object' || Array.isArray(src)) return src;
    var out = {};
    for (var k in src) out[k] = src[k];
    out.uri = withScheme(path, src.uri);
    var r = tileRatio();
    /* the texture is made at the picture's shape (a square icon stays
       square and is cut by cover) */
    if (out.resize && out.resize.width > 0) out.resize = libTall(out.resize, out.resize.width, Math.round(out.resize.width * r), 'width', 'height');
    if (out.textureResizeWidth > 0)
      out = libTall(out, out.textureResizeWidth, Math.round(out.textureResizeWidth * r), 'textureResizeWidth', 'textureResizeHeight');
    return out;
  }
  function libVertical(props) {
    var r = tileRatio(), ts = props.tileSize;
    if (r !== 1 && ts && typeof ts === 'object' && ts.width > 0 && ts.height === ts.width) {
      T.libTileW = ts.width;
      props.tileSize = libTall(ts, ts.width, Math.round(ts.width * r), 'width', 'height');
      if (!T.done['library vertical grid']) done('library vertical grid ' + ts.width + 'x' + props.tileSize.height);
    }
    var W = T.libTileW || 296, H = Math.round(W * r);
    if (r !== 1 && props.contentContainerStyle)
      props.contentContainerStyle = libTall(props.contentContainerStyle, W, H, 'itemWidth', 'itemHeight');
    var id = props.testID;
    if (id !== 'Tile' && id !== 'Tile-loading' && id !== 'Tile-media') return;
    if (r !== 1) {
      props.style = libTall(props.style, W, H, 'width', 'height');
      if (id === 'Tile-media') props.resizeMode = 'cover';
    }
    var src = props.source;
    if (id !== 'Tile-media' || !src || typeof src !== 'object') return;
    var title = uriTitle(src.uri), path = title ? tilePicture(title) : null;
    /* system tiles (Media Gallery in the app library) get the tall
       icon copy of the Home row, not their square icon cut by cover */
    var plain = String(src.uri || '').replace(/^file:\/\//, '').split('?')[0];
    if (!path && r !== 1 && SYSTEM_TILE.test(plain)) {
      if (/^\/system_ex\/rnps\/apps\/.*\.png$/.test(plain)) path = tallIconUri(src.uri).replace(/^file:\/\//, '');
      else if (libLogs++ < 6) log('library system tile left: ' + plain);
    }
    if (!path) return;
    props.source = libPicture(src, path);
    if (Array.isArray(props.src)) props.src = props.src.map(function (s) { return libPicture(s, path); });
    if (libLogs++ < 6) log('library picture: ' + title + ' -> ' + path);
    if (!T.done['library custom tiles']) done('library custom tiles');
  }
  function libraryMenu(props, fn) {
    /* the library's menu carries the titleId itself */
    var items = props.contextItems,
        id = typeof props.titleId === 'string' && props.titleId ? props.titleId : T.libFocusId || T.menuTitleId;
    /* it comes as PPSA22520_00: the folders (and the app database) use PPSA22520 */
    if (typeof id === 'string') id = id.replace(/_\d+$/, '');
    /* outer and inner menu elements both carry the list: add once (doubled) */
    if (items.some(function (e) { return e && typeof e.key === 'string' && e.key.indexOf('zt-lib-') === 0; })) return;
    if (!T.done['library options menu']) done('library options menu (' + Object.keys(props).join(', ') + '; ' + items.length + ' items)');
    T.libMenus = T.libMenus || new WeakSet();
    /* no theme features (diagnostic build with no theme): menu left stock */
    if (PLAIN) return;
    /* the custom tile items too (as the Home's menu) */
    var tileItems = id && !/^NPXS/.test(id) ? customMenuItems(id) : [];
    if ((THEME.folderMenu === false && !tileItems.length) || !id || /^NPXS/.test(id) || T.libMenus.has(items)) return;
    var first = null;
    /* (labels are often translated text objects, not strings) */
    for (var i = 0; i < items.length; i++)
      if (items[i] && items[i].props && 'label' in items[i].props && typeof items[i].props.onPress === 'function') {
        first = items[i];
        break;
      }
    if (!first) {
      if (!T.done['library menu: no item to copy']) {
        var e0 = items[0];
        var desc = '';
        try { desc = JSON.stringify(e0, function (k, v) { return typeof v === 'function' ? 'fn' : v; }).slice(0, 300); } catch (err) { desc = typeof e0; }
        done('library menu: no item to copy (' + (e0 && e0.props ? 'props ' + Object.keys(e0.props).join(',') : desc) + ')');
      }
      return;
    }
    var own = folderOfGame(id);
    var extra = [];
    var n = -1;
    folderParts().forEach(function (p) {
      if (!p.valid || THEME.folderMenu === false) return;
      n++;
      var fid = FOLDER + n;
      /* Game Library = game folders, app library (space=media) = media
         folders; unknown space: all */
      if (fid === own || (T.libSpace && partSpace(p) !== T.libSpace)) return;
      extra.push({ label: 'Add to ' + p.head.split('|')[0].trim(), url: 'ztfolder:put?' + id + ',' + fid + ',' + (own || '') });
    });
    if (THEME.folderMenu !== false) {
      extra.push({ label: own ? 'Move to a new folder' : 'Add to a new folder', url: 'ztfolder:put?' + id + ',new,' + (own || '') });
      if (own) extra.push({ label: 'Remove from its folder', url: 'ztfolder:out?' + own + ',' + id });
    }
    tileItems.forEach(function (t) { extra.push({ label: t.label, url: t.actionUrl }); });
    props.contextItems = items.concat(extra.map(function (e, k) {
      return fn(first.type, { disabled: false, label: e.label, onPress: function () {
        log('library menu: ' + e.url);
        try {
          if (e.url.indexOf('zttile:') === 0) customAction(e.url);
          else folderAction(e.url);
        } catch (err) { log('library menu error: ' + err); }
      } }, 'zt-lib-' + k);
    }));
    T.libMenus.add(props.contextItems);
    if (!T.done['library folder items']) done('library folder items (' + id + ', ' + extra.length + ')');
  }
  function folderMenuOn() { return APP === 'home' && THEME.folderMenu !== false; }
  /* the raw parts of the folders field; the valid ones are numbered like
     folderList() (= ZTFOLDERn) */
  function folderParts() {
    var out = [];
    String(THEME.folders || '').split(';').forEach(function (part) {
      part = part.trim();
      if (!part) return;
      var c = part.lastIndexOf(':');
      if (c < 0) return;
      var head = part.slice(0, c).split(':').pop().replace(/['"\\]/g, '').trim();
      var ids = part.slice(c + 1).split(',').map(function (t) { return t.trim(); })
                    .filter(function (t) { return t; });
      out.push({ head: head, ids: ids, valid: !!(head.split('|')[0].trim() && ids.length) });
    });
    return out;
  }
  function folderPart(parts, fid) {
    var n = parseInt(String(fid).slice(FOLDER.length), 10), valid = parts.filter(function (p) { return p.valid; });
    return isNaN(n) ? null : valid[n] || null;
  }
  function partSpace(p) { return /^m/i.test((p.head.split('|')[3] || '').trim()) ? 'media' : 'game'; }
  function gameName(id) {
    var g = T.allGames && T.allGames[id];
    if (g && g.name) return g.name;
    for (var f in (T.folders || {})) {
      var gs = T.folders[f].games || [];
      for (var i = 0; i < gs.length; i++) if (gs[i].id === id) return gs[i].name;
    }
    return id;
  }
  /* the editor's mosaic name (editor.html foldMosaicName): same games, colour
     and opacity give the same file */
  function foldHash(t) {
    var h = 5381;
    for (var i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  /* select: the part (folder) or the game id the Home selects after the reload */
  /* games that are no longer installed leave their folders (a removed
     game stayed in the folder and went back into it when installed again);
     saved without a reload unless a folder ends up empty */
  function folderPrune(all) {
    if (!THEME.folders) return;
    var parts = folderParts(), gone = [], emptied = false;
    parts.forEach(function (p) {
      var keep = p.ids.filter(function (id) { return !!all[id]; });
      if (keep.length === p.ids.length) return;
      p.ids.forEach(function (id) { if (!all[id]) gone.push(id); });
      if (p.valid && !keep.length) emptied = true;
      p.ids = keep;
    });
    if (gone.length) folderSave(parts, 'not installed ' + gone.join(','), null, !emptied);
  }
  /* the folder style of a focused shape's mosaic */
  function folderShapeStyle(fmt) {
    if (fmt !== '92x43') return folderVerticalStyle();
    var v = String(THEME.foldersHorizontal || '').trim();
    return v === 'stack' || v === 'square' || v === 'icons' ? v : 'grid';
  }
  function folderVerticalStyle() {
    var v = String(THEME.foldersVertical || '').trim();
    /* empty = grid (2x2) */
    return v === 'stack' || v === 'square' ? v : 'grid';
  }
  /* foldersVertical 'square': with vertical tiles a folder's picture
     (mosaic or uploaded icon) is a W x W square at the bottom of the tile.
     the native focus frame stayed 2:3 (moved only the Image):
     the tile's image wrapper (testID experience-switcher-ZTFOLDERn, style
     [imageWrapper, image] W x H) is the square now, moved down, and the
     Image in it W x W.
     still 2:3 (its marginTop counts in the layout): the frame is the
     focusable Animated.View around it (testID focused-item-ZTFOLDERn, style
     [focusContainer, experienceOpacityN, minimizeExperienceN], sized by its
     children). That one is moved down (marginTop H-W, before the
     animated styles), the wrapper is W x W without a margin. */
  var squareLogs = 0;
  function folderSquare(props) {
    if (props.style !== T.tileImage && props.style !== T.tileImage2) return;
    var uri = String(props.source.uri || '');
    if (focusShapeUsed() && shapeUriFor(uri)) return;
    if (!/\/ZhiThemes\/(Assets\/)?(cache\/mosaics|folders)\/|\/ZhiThemes\/(Assets\/)?backgrounds\/zt_(folder|up)_/.test(uri)) return;
    var W = THEME.tileSize;
    props.style = [props.style, { height: W, resizeMode: 'cover' }];
    if (squareLogs++ < 2) log('folder square: ' + uri.split('/').pop() + ' ' + W + 'x' + W);
    if (!T.done['vertical square folders']) done('vertical square folders');
  }
  function folderSquareView(props) {
    var id = String(props.testID), W = THEME.tileSize, H = tileHeight();
    if (props.style && /^experience-switcher-ZTFOLDER\d+$/.test(id)) {
      if (T.shapeOn && T.shapeOn[id.slice('experience-switcher-'.length)]) return;
      props.style = [].concat(props.style, { height: W });
      if (!T.done['vertical square folder view']) done('vertical square folder view');
    } else if (/^focused-item-ZTFOLDER\d+$/.test(id)) {
      var st = [].concat(props.style || []);
      st.splice(1, 0, { marginTop: H - W });
      props.style = st;
      if (squareLogs++ < 4) log('folder square: ' + id + ' ' + W + 'x' + W + ' at ' + (H - W) + ' in ' + W + 'x' + H);
      if (!T.done['vertical square folder frame']) done('vertical square folder frame');
    }
  }
  /* the square mosaic takes square pictures: the game's own 1x1
     custom tile (the one of the same n as its choice, else the first) or
     its icon, not the 2:3 cover cut in the middle */
  var squarePics = null;
  function squarePicture(id) {
    var key = customKey(id);
    if (!key || THEME.customTilesOn === false || customChoice(key, '1x1') === 0) return null;
    if (!squarePics) {
      squarePics = {};
      (Array.isArray(globalThis.__ztCustomTiles) ? globalThis.__ztCustomTiles : []).forEach(function (f) {
        var m = /^([A-Za-z]{4}\d{5})_1x1_(\d+)\.png$/i.exec(String(f));
        if (m) (squarePics[m[1].toUpperCase()] = squarePics[m[1].toUpperCase()] || []).push({ n: parseInt(m[2], 10), file: String(f) });
      });
      for (var k in squarePics) squarePics[k].sort(function (x, y) { return x.n - y.n; });
    }
    var pics = squarePics[key] || [], c = customChoice(key, '1x1');
    if (!pics.length) return null;
    var pick = pics[0];
    pics.forEach(function (p) { if (p.n === c) pick = p; });
    return CUSTOM_DIR + pick.file;
  }
  /* mosaic name and THEME-MOSAIC message: the first 3 games and, with more,
     "+N" in the 4th square (same name as the editor's foldMosaicName) */
  function mosaicFor(ids, col, al, fmt) {
    if (typeof al !== 'number' || isNaN(al)) al = 1;
    var more = ids.length > 3 ? '+' + (ids.length - 3) : '';
    /* vertical tiles get a mosaic of their shape (other name: the
       square one of the editor stays as it is) */
    var shape = tileRatio() !== 1 ? 'r' + tileRatio() : '';
    /* there the covers are stacked, folder symbol and "+N" in a pill;
       foldersVertical picks stack, grid or square (the square
       mosaic, drawn at the bottom of the tile by folderSquare) */
    var vs = folderVerticalStyle();
    var stack = shape && vs === 'stack' ? 'stack' : '';
    if (vs === 'square') shape = '';
    /* the focused tile's shape (focusShape): 92x43 = 4 covers in a row.
       the games' pictures as in the row: their 2:3 covers (custom 2x3
       tile, else the icon cut); folder style of that shape (foldersHorizontal
       for the Steam one, foldersVertical for the 2:3 one): grid, stack or
       square (square icons, as many as fit: up to 7 games) */
    var take = 3, picFmt = '';
    if (fmt) {
      shape = fmt === '92x43' ? 'r' + (43 / 92).toFixed(4) : fmt === '2x3' ? 'r1.5' : '';
      var fs = folderShapeStyle(fmt);
      stack = fs === 'stack' ? 'stack' : '';
      if (fs === 'square') { stack = 'sq'; take = 7; picFmt = '1x1'; }
      else if (fs === 'icons') { stack = 'sq1'; picFmt = '1x1'; } /* 1:1 icons in one row */
      else picFmt = '2x3';
      more = ids.length > take ? '+' + (ids.length - take) : '';
    }
    var icons = ids.slice(0, take).map(function (id) {
      var g = T.allGames && T.allGames[id];
      var icon = String(g && g.icon || '/user/appmeta/' + id + '/icon0.png').split('?')[0];
      if (!picFmt) return mosaicIcon(id, icon);
      var p = customPick(id, picFmt);
      return p && /\.png$/i.test(p.file) ? CUSTOM_DIR + p.file : icon;
    });
    /* games with their own picture give another mosaic */
    var own = icons.filter(function (ic) { return ic.indexOf(CUSTOM_DIR) === 0; }).join(',');
    var name = 'zt_folder_' + foldHash(ids.slice(0, take).join(',') + col + al + (more ? more + 'b' : '') + shape + stack +
                                       (own ? 'c' + own : '')) + '.png';
    return { name: name, msg: [name, col, al].concat(icons, more ? [more] : [], shape ? [shape] : [],
                                                     stack ? [stack] : []).join('|') };
  }
  function folderSave(parts, why, select, quiet) {
    var kept = parts.filter(function (p) { return p.ids.length; });
    /* folders without their own image (empty, 'auto' or an older mosaic) get
       a mosaic, made by ZhiThemes (THEME-MOSAIC) before the reload */
    var mosaics = [], iconChanged = null;
    kept.forEach(function (p) {
      var h = p.head.split('|');
      var icon = (h[1] || '').trim();
      if (icon && icon !== 'auto' && !/^zt_folder_/.test(icon)) return;
      var col = /^#[0-9a-f]{6}$/i.test((h[4] || '').trim()) ? h[4].trim() : THEME.foldersColor || '#24345a';
      var mo = mosaicFor(p.ids, col, parseFloat(h[5]));
      while (h.length < 2) h.push('');
      if (icon !== mo.name && !iconChanged) iconChanged = p;
      h[1] = mo.name;
      p.head = h.join('|');
      mosaics.push(mo.msg);
    });
    var value = kept.map(function (p) {
      return p.head + ': ' + p.ids.join(', ');
    }).join('; ').replace(/['\\\r\n]/g, '');
    /* a new mosaic only shows after the Home reads its list again: with
       a reload, the folder selected (a removed game stayed drawn) */
    if (quiet && iconChanged) {
      quiet = false;
      if (!select) select = iconChanged;
    }
    var sel = typeof select === 'string' ? select : select && kept.indexOf(select) >= 0 ? FOLDER + kept.indexOf(select) : '';
    log('folder menu: ' + why + ' -> folders: ' + value.slice(0, 300) + (sel ? ' (then select ' + sel + ')' : ''));
    if (quiet) {
      /* nothing the Home lists changes: no reload, this Home goes on with it */
      THEME.folders = value;
      try {
        mosaics.forEach(function (m) { console.log('THEME-MOSAIC ' + m); });
        console.log('THEME-SETQ folders ' + value);
      } catch (e) {}
      setTimeout(folderChanged, 0);
      if (T.toastNext) {
        var tq = T.toastNext;
        T.toastNext = null;
        setTimeout(function () { showToast(tq.text); }, 400);
      }
      return;
    }
    /* (THEME.folders is not changed here: the old Home then drew the folder
       without it in its app list; the reload brings it) */
    /* after the menu has closed */
    setTimeout(function () {
      try {
        mosaics.forEach(function (m) { console.log('THEME-MOSAIC ' + m); });
        /* the new Home selects it (comes back as __themeData('zt-select')) */
        if (sel) {
          T.sentSelect = Date.now();
          console.log('THEME-DATA zt-select ' + JSON.stringify({ id: sel, t: T.sentSelect }));
        }
        /* the message for the new Home */
        if (T.toastNext) {
          T.sentToast = Date.now();
          console.log('THEME-DATA zt-toast ' + JSON.stringify({ text: T.toastNext.text, t: T.sentToast }));
          T.toastNext = null;
        }
        console.log('THEME-SET folders ' + value);
      } catch (e) {}
    }, 400);
  }
  /* after a folder change: the Home selects the folder (or game) the menu
     acted on, once its row and its app list both have it (the Home
     first came back with a cached list and the wrong tile, "circle") */
  /* while the guard lasts, a selectedItem other than the target goes back
     to it (neighbour, then it, like selectAfterReload) */
  function selectGuard(props) {
    var g = T.selectGuard;
    if (!g || !T.rowOnFocus || !Array.isArray(props.data)) return;
    if (Date.now() > g.until) { T.selectGuard = null; return; }
    /* the row shows the target: done (kept correcting renders that
       still had the old selectedItem, the selector flashed 5 times) */
    if (props.selectedItem === g.id) { if (g.n || T.lastBounce) T.selectGuard = null; return; }
    if (Date.now() - g.last < 1200 || g.n >= 2) return;
    var at = -1;
    for (var i = 0; i < props.data.length; i++) if (props.data[i] && props.data[i].id === g.id) { at = i; break; }
    if (at < 0) return;
    g.last = Date.now();
    g.n++;
    log('folder: Home went to ' + props.selectedItem + ', back to ' + g.id + ' at ' + at);
    setTimeout(function () { bounceTo(g.id, 'guard'); }, 0);
  }
  /* the Home selects `id` through the row's own onFocus: a neighbour first,
     then it, so the row moves its highlight twice and grows the tile (the
     "circle" was a tile selected for the Home but small in the row). With
     the newest row list (it changes after a reload); userInitiated true so
     the Home keeps it as its own choice */
  function bounceTo(id, why) {
    var tell = T.rowOnFocus, data = null, at = -1, ref = null;
    [[T.rowData, T.strandRefGame], [T.rowDataMedia, T.strandRefMedia]].forEach(function (pair) {
      var d = pair[0];
      if (at >= 0 || !Array.isArray(d)) return;
      for (var i = 0; i < d.length; i++) if (d[i] && d[i].id === id) { at = i; data = d; ref = pair[1]; break; }
    });
    if (at < 0) return;
    /* the Strand's own focus(index, userInitiated): selects the item AND
       gives its focus layer the native focus (the selector stayed on the
       old tile ); an older version called it without an index, so nothing */
    var strand = ref && ref.current;
    if (strand && typeof strand.focus === 'function') {
      /* once per row list: the same list and place again only replayed the
         selector animation (showed it several times) */
      var ids = data.map(function (d) { return d && d.id; }).join(',');
      var lb = T.lastBounce;
      if (lb && lb.id === id && lb.ids === ids && lb.at === at && why !== 'guard') return;
      T.lastBounce = { id: id, ids: ids, at: at };
      try {
        strand.focus(at, true);
        if (!T.done['strand focus(index)']) done('strand focus(index) ' + id + ' at ' + at + ' (' + why + ')');
        return;
      } catch (e) { log('strand focus error: ' + e); }
    }
    if (!tell) return;
    var nb = data[at + 1] && data[at + 1].id ? at + 1 : at - 1;
    var other = nb >= 0 ? data[nb] : null;
    if (DEBUG.on) log('folder: bounce to ' + id + ' at ' + at + ' (' + why + ')');
    try {
      if (other) tell({ item: other, index: nb, userInitiated: true });
      setTimeout(function () {
        try { tell({ item: data[at], index: at, userInitiated: true }); } catch (e) { log('folder select error: ' + e); }
      }, other ? 150 : 0);
    } catch (e) { log('folder select error: ' + e); }
  }
  function selectAfterReload(props) {
    var id = T.selectAfter;
    if (!id || !T.rowOnFocus || !Array.isArray(props.data) || !T.folderRecordsDone) return;
    for (var i = 0; i < props.data.length; i++) {
      var it = props.data[i];
      if (it && it.id === id) {
        T.selectAfter = '';
        /* the Home put its first game back after the list came (move
           left/right): keep it on the target for 4 s */
        T.selectGuard = { id: id, until: Date.now() + 4000, last: Date.now(), n: 0 };
        log('folder: Home selects ' + id + ' at ' + i + ' after the reload');
        /* the 2nd folder once stayed small (row not ready at 300 ms);
           move left/right stayed small until the final list came: the
           last ones run after it */
        [300, 1500, 2500, 4000].forEach(function (ms) {
          setTimeout(function () { bounceTo(id, ms); }, ms);
        });
        return;
      }
    }
  }
  function menuItem(id, label, url) {
    return { id: id, label: label, disabled: false, actionId: undefined, actionUrl: url, subItems: undefined };
  }
  /* ---- Options menu > ZhiThemes, first item of every tile's menu
     (also with ZhiThemes off): the themes, "PS5 default" and the theme
     files on a USB stick (/mnt/usbN/ZhiThemes/) and in Install/.
     "THEME-THEMES" is answered at once by ZhiThemes with __ztThemeMenu(json). */
  T.themeMenu = null;
  globalThis.__ztThemeMenu = function (text) {
    try { T.themeMenu = JSON.parse(text); } catch (e) { log('theme menu: ' + e); }
  };
  function themesMenuItem() {
    var last = T.themeMenu;
    T.themeMenu = null;
    try { console.log('THEME-THEMES'); } catch (e) {}
    if (!T.themeMenu) T.themeMenu = last;
    var d = T.themeMenu, subs = [];
    var top = menuItem('zt-themes', '🎨 ZhiThemes', undefined);
    top.subItems = subs;
    if (!d) {
      subs.push(menuItem('zt-th-none', 'ZhiThemes is not answering', 'ztthemes:none'));
      return top;
    }
    var off = !!(d.off || d.usbOff), list = (d.list && d.list.themes) || [], active = d.list && d.list.active;
    if (d.installing) {
      var busy = menuItem('zt-th-busy', 'Installing a theme...', 'ztthemes:none');
      busy.disabled = true;
      subs.push(busy);
    }
    list.forEach(function (t, i) {
      var cur = !off && t.name === active;
      var it = menuItem('zt-th-' + i, t.name + (cur ? '  (in use)' : ''), 'ztthemes:use?' + t.name);
      if (cur) it.disabled = true;
      subs.push(it);
    });
    var stock = menuItem('zt-th-off', 'PS5 default (ZhiThemes off)' + (off ? '  (in use)' : ''), 'ztthemes:off');
    if (off) stock.disabled = true;
    subs.push(stock);
    (d.files || []).forEach(function (f, i) {
      /* a USB file installed before: "(installed)" (X only puts its
         theme in use), or "Update" when the file on the stick changed */
      if (f.from === 'usb' && f.state === 'installed' && f.theme) {
        var cur = !off && f.theme === active;
        var done = menuItem('zt-th-f' + i, 'From USB: ' + f.name + (cur ? '  (installed, in use)' : '  (installed)'),
                            'ztthemes:use?' + f.theme);
        if (cur) done.disabled = true;
        subs.push(done);
        return;
      }
      subs.push(menuItem('zt-th-f' + i, (f.from !== 'usb' ? 'Install from the Install folder: ' :
                                         f.state === 'update' ? 'Update from USB: ' : 'Install from USB: ') + f.name,
                         'ztthemes:file?' + f.path));
    });
    if (!T.done['theme menu']) done('theme menu (' + list.length + ' themes, ' + (d.files || []).length + ' files' + (off ? ', off' : '') + ')');
    return top;
  }
  function themesAction(url) {
    var m = /^ztthemes:(\w+)\??(.*)$/.exec(url);
    if (!m || m[1] === 'none') return;
    log('theme menu: ' + url);
    var cmd = m[1] === 'use' ? 'THEME-THEMEUSE ' + m[2] : m[1] === 'off' ? 'THEME-THEMEOFF' :
              m[1] === 'file' ? 'THEME-THEMEFILE ' + m[2] : '';
    if (cmd) try { console.log(cmd); } catch (e) {}
  }
  /* "Move to / Add to folder" submenu: the folders of the same space + new */
  function folderTargets(id, gid, space, skip) {
    var parts = folderParts(), n = -1, subs = [];
    parts.forEach(function (p) {
      if (!p.valid) return;
      n++;
      if (FOLDER + n === skip || partSpace(p) !== space) return;
      subs.push(menuItem(id + '-' + n, p.head.split('|')[0].trim(), 'ztfolder:put?' + gid + ',' + FOLDER + n + ',' + (skip || '')));
    });
    subs.push(menuItem(id + '-new', 'New folder', 'ztfolder:put?' + gid + ',new,' + (skip || '')));
    return subs;
  }
  function folderMenuItems(fid) {
    var items = [];
    var parts = folderParts(), p = folderPart(parts, fid);
    if (!p) return items;
    if (THEME.foldersOpenWithX !== false)
      items.push(menuItem('zt-open', folderIsOpen() && T.folderSel === fid ? 'Close folder' : 'Open folder', 'ztfolder:open?' + fid));
    /* the PS5 keyboard through ZhiThemes' native TextField (RN's
       TextInput took ShellUI down ) */
    items.push(menuItem('zt-rename', 'Rename folder', 'ztfolder:renamekb?' + fid));
    items.push(menuItem('zt-sort', 'Sort games by name', 'ztfolder:sort?' + fid));
    items.push(menuItem('zt-left', 'Move folder left', 'ztfolder:left?' + fid));
    items.push(menuItem('zt-right', 'Move folder right', 'ztfolder:right?' + fid));
    items.push(menuItem('zt-delete', 'Remove folder (games back to the row)', 'ztfolder:delete?' + fid));
    return items;
  }
  /* the highlighted game of the open folder, or null */
  function stripGame() {
    var f = folderIsOpen() && T.folders[T.folderSel];
    return f && f.games[T.stripIdx] ? { fid: T.folderSel, game: f.games[T.stripIdx], index: T.stripIdx, count: f.games.length } : null;
  }
  function gameMenuItems(id) {
    if (typeof id !== 'string' || /^NPXS/.test(id) || id.indexOf(FOLDER) === 0) return [];
    var s = stripGame();
    if (s && s.game.id === id) {
      var p = folderPart(folderParts(), s.fid);
      var space = p ? partSpace(p) : 'game';
      var items = [];
      if (s.index > 0) items.push(menuItem('zt-gleft', 'Move left in the folder', 'ztfolder:gleft?' + s.fid + ',' + id));
      if (s.index < s.count - 1) items.push(menuItem('zt-gright', 'Move right in the folder', 'ztfolder:gright?' + s.fid + ',' + id));
      items.push(menuItem('zt-out', 'Remove from the folder', 'ztfolder:out?' + s.fid + ',' + id));
      var to = menuItem('zt-move', 'Move to folder', undefined);
      to.subItems = folderTargets('zt-move', id, space, s.fid);
      items.push(to);
      return items;
    }
    if (folderOfGame(id)) return [];
    var add = menuItem('zt-add', 'Add to folder', undefined);
    add.subItems = folderTargets('zt-add', id, T.space === 'media' ? 'media' : 'game', '');
    return [add];
  }
  function folderAction(url) {
    var m = /^ztfolder:(\w+)\?(.*)$/.exec(url);
    if (!m) return;
    var cmd = m[1], a = m[2].split(',');
    log('folder menu: ' + cmd + ' ' + m[2]);
    if (cmd === 'open') {
      if (T.folderSel === a[0]) folderOpenSet(folderIsOpen() ? '' : a[0]);
      return;
    }
    if (cmd === 'renamekb') {
      var rp = folderPart(folderParts(), a[0]);
      var cur = rp ? rp.head.split('|')[0].trim() : '';
      /* after the menu has closed; the answer comes as data 'zt-rename' */
      setTimeout(function () {
        try { console.log('THEME-RENAME ' + a[0] + '|' + cur); } catch (e) {}
      }, 400);
      return;
    }
    var parts = folderParts();
    if (cmd === 'put') {
      /* a[0] game, a[1] folder or 'new', a[2] the folder it leaves ('' = row) */
      var from = a[2] ? folderPart(parts, a[2]) : null;
      if (from) from.ids = from.ids.filter(function (x) { return x !== a[0]; });
      var to = a[1] === 'new' ? null : folderPart(parts, a[1]);
      if (!to) {
        var space = from ? partSpace(from) : T.space === 'media' ? 'media' : 'game';
        var used = {};
        parts.forEach(function (p) { used[p.head.split('|')[0].trim()] = true; });
        var k = 1;
        while (used['Folder ' + k]) k++;
        to = { head: 'Folder ' + k + (space === 'media' ? '|||media' : ''), ids: [], valid: true };
        parts.push(to);
      }
      if (to.ids.indexOf(a[0]) < 0) to.ids.push(a[0]);
      T.toastNext = folderToast('Added to ' + to.head.split('|')[0].trim());
      return folderSave(parts, 'put ' + a[0], to);
    }
    var select = null;
    var p = folderPart(parts, a[0]);
    if (!p) { log('folder menu: no folder ' + a[0]); return; }
    if (cmd === 'rename') {
      var nm = a.slice(1).join(',').replace(/[;:|'"\\\r\n]/g, '').trim();
      if (!nm) return;
      var hp = p.head.split('|');
      hp[0] = nm;
      p.head = hp.join('|');
    } else if (cmd === 'sort') {
      p.ids.sort(function (x, y) { return gameName(x).toLowerCase() < gameName(y).toLowerCase() ? -1 : 1; });
    } else if (cmd === 'left' || cmd === 'right') {
      var h = p.head.split('|');
      while (h.length < 3) h.push('');
      var f = T.folders && T.folders[a[0]];
      var pos = parseInt(h[2], 10);
      if (isNaN(pos)) pos = f && typeof f.pos === 'number' ? f.pos : Math.round(THEME.foldersPosition) || 0;
      h[2] = String(Math.max(0, pos + (cmd === 'left' ? -1 : 1)));
      p.head = h.join('|');
    } else if (cmd === 'delete') {
      select = p.ids[0];   /* its first game, back in the row */
      p.ids = [];
    } else if (cmd === 'out') {
      p.ids = p.ids.filter(function (x) { return x !== a[1]; });
      select = p.ids.length ? p : a[1];
    } else if (cmd === 'gleft' || cmd === 'gright') {
      var i = p.ids.indexOf(a[1]), j = i + (cmd === 'gleft' ? -1 : 1);
      if (i < 0 || j < 0 || j >= p.ids.length) return;
      p.ids[i] = p.ids[j];
      p.ids[j] = a[1];
    } else return;
    var fname = p.head.split('|')[0].trim();
    T.toastNext = folderToast(cmd === 'rename' ? 'Renamed to ' + fname : cmd === 'sort' ? 'Sorted' :
                              cmd === 'delete' ? 'Folder deleted' : cmd === 'out' ? 'Removed from ' + fname :
                              cmd === 'left' || cmd === 'right' ? 'Folder moved' : 'Moved');
    folderSave(parts, cmd + ' ' + m[2], select || p);
  }
  function hookOptionsMenu(exp) {
    if (APP !== 'home' || !exp) return;
    var fetchFn = exp.fetchExperienceOptionsByTitleId;
    if (typeof fetchFn === 'function' && !fetchFn.__theme) {
      var fetchWrapped = function (titleId) {
        var folderOn = !PLAIN && folderMenuOn();
        /* Options > ZhiThemes on top */
        var top = [];
        try { top = [themesMenuItem()]; } catch (e) { log('theme menu error: ' + e); }
        if (folderOn && typeof titleId === 'string' && titleId.indexOf(FOLDER) === 0) {
          var own = top.concat(folderMenuItems(titleId), customMenuItems(titleId));
          log('options menu: folder ' + titleId + ' (' + own.length + ' items)');
          return Promise.resolve(own);
        }
        var extra = PLAIN ? [] : (folderOn ? gameMenuItems(titleId) : []).concat(customMenuItems(titleId), favMenuItems(titleId));
        var hide = PLAIN ? { any: false, ids: {} } : menuHidden();
        var native = fetchFn.apply(this, arguments);
        if (!top.length && !extra.length && !hide.any) return native;
        if (extra.length) log('options menu: ' + titleId + ' + ' + extra.length + ' folder items');
        return Promise.resolve(native).then(function (items) {
          var gone = [];
          var list = Array.isArray(items) ? (hide.any ? menuFilter(items, hide, gone) : items) : [];
          if (!T.done['options menu ids']) {
            done('options menu ids (' + (Array.isArray(items) ? items.map(function (i) { return i && i.id; }).join(', ') : typeof items) + ')');
          }
          if (gone.length && !T.done['options menu items removed']) done('options menu items removed (' + gone.join(', ') + ')');
          return top.concat(list, extra);
        }, function (e) {
          log('options menu: native options of ' + titleId + ' failed: ' + e);
          return top.concat(extra);
        });
      };
      fetchWrapped.__theme = true;
      if (replace(exp, 'fetchExperienceOptionsByTitleId', fetchWrapped)) done('options menu items');
    }
    var keepFn = exp.useKeepInHome;
    if (typeof keepFn === 'function' && !keepFn.__theme) {
      var keepWrapped = function () {
        var r = keepFn.apply(this, arguments);
        if (r && typeof r === 'object' && r.keepInHomeComponent && !PLAIN && menuHidden().keep) {
          var c = {};
          for (var k in r) c[k] = r[k];
          c.keepInHomeComponent = null;
          if (!T.done['options menu: keep in Home removed']) done('options menu: keep in Home removed');
          return c;
        }
        return r;
      };
      keepWrapped.__theme = true;
      if (replace(exp, 'useKeepInHome', keepWrapped)) done('keep in Home hook');
    }
    var hookFn = exp.useExperienceOptionsMenu;
    if (typeof hookFn === 'function' && !hookFn.__theme) {
      /* the extra hooks are decided once, so every render calls the same ones */
      var React = T.React;
      var hookWrapped = function (args) {
        var isFolder = !!(args && typeof args.titleId === 'string' && args.titleId.indexOf(FOLDER) === 0);
        if (React) {
          /* the folder tile renders again when the highlighted game changes,
             so the menu is built for that game */
          var tick = React.useState(0)[1];
          React.useEffect(function () {
            if (!isFolder) return undefined;
            var f = function () { tick(function (n) { return n + 1; }); };
            folderListeners.push(f);
            return function () {
              var i = folderListeners.indexOf(f);
              if (i >= 0) folderListeners.splice(i, 1);
            };
          }, [isFolder]);
        }
        /* always wrapped (Options > ZhiThemes is in every menu) */
        if (!args || typeof args !== 'object') return hookFn.apply(this, arguments);
        var a = {};
        for (var k in args) a[k] = args[k];
        var s = isFolder && T.folderSel === args.titleId ? stripGame() : null;
        if (s) {
          a.titleId = s.game.id;
          a.titleName = s.game.name;
          var r = T.stripRefs[s.index];
          if (r) a.target = { current: r };
        }
        /* Delete: read the installed titles again a few times (the game
           leaves its folder, folderPrune) */
        var del = args.onDeleteApp;
        if (typeof del === 'function' && !PLAIN) {
          a.onDeleteApp = function () {
            /* the game being deleted is still in every title for a while:
               it must not come back into the row as a filler (the Home kept it
               selected and the focus jumped to the end of the row) */
            var gid = String(args.titleId || '').replace(/_\d+$/, '');
            if (gid) { (T.leftRow = T.leftRow || {})[gid] = Date.now(); log('row: ' + gid + ' deleted, not used to fill the row'); }
            [8000, 25000, 60000].forEach(function (ms) {
              setTimeout(function () { refreshTitles(0, 'after delete'); }, ms);
            });
            return del.apply(this, arguments);
          };
        }
        var deeplink = args.onDeeplink;
        a.onDeeplink = function (url) {
          if (typeof url === 'string' && url.indexOf('ztfolder:') === 0) {
            try { folderAction(url); } catch (e) { log('folder menu error: ' + e); }
            return undefined;
          }
          if (typeof url === 'string' && url.indexOf('zttile:') === 0) {
            try { customAction(url); } catch (e) { log('custom tile menu error: ' + e); }
            return undefined;
          }
          if (typeof url === 'string' && url.indexOf('ztthemes:') === 0) {
            try { themesAction(url); } catch (e) { log('theme menu error: ' + e); }
            return undefined;
          }
          if (typeof url === 'string' && url.indexOf('ztfav:') === 0) {
            try { favAction(url); } catch (e) { log('favourites menu error: ' + e); }
            return undefined;
          }
          return typeof deeplink === 'function' ? deeplink.apply(this, arguments) : undefined;
        };
        return hookFn.call(this, a);
      };
      hookWrapped.__theme = true;
      if (replace(exp, 'useExperienceOptionsMenu', hookWrapped))
        done('options menu hook' + (React ? '' : ' (no React yet)'));
    }
  }
  function hookAtom(exp) {
    /* the Home's useAtomValue comes from the bundled jotai/utils (module 6),
       which also exports atomFamily, selectAtom, ... but not atom */
    /* always on in the Home: the editor's folders tab needs the game list */
    if (APP !== 'home' || !exp ||
        typeof exp.useAtomValue !== 'function' ||
        typeof exp.atomFamily !== 'function' || exp.useAtomValue.__theme)
      return;
    var original = exp.useAtomValue;
    var swapped = function () {
      var v = original.apply(this, arguments);
      /* the space atom (Search reads it for pssearch:main?space=) */
      if ((v === 'game' || v === 'media' || isExtraSpace(v)) && T.space !== v) {
        T.space = v;
        if (APP === 'home' && THEME.fakeTrophies) tileChanged();
        if (T.folderSel) { T.folderSel = ''; setTimeout(folderChanged, 0); }
      }
      return filterRow(v);
    };
    swapped.__theme = true;
    if (replace(exp, 'useAtomValue', swapped)) done('useAtomValue (store)');
  }
  /* The Home keeps the selected tile's id and looks the experience up in its
     full list (an atom read with useAtomValue): for a folder the lookup gives
     undefined, so the row had no selectedItem (back from the hub the focus
     went to the first tile), the strand could not focus it again (O), and the
     tabs pointed at another game. An atom that returned the tile the
     row had just reported is remembered; while a folder is selected and that
     atom gives nothing, it gives the folder tile. */
  var selAtoms = new WeakSet(), selAtomCount = 0;
  function folderAtom(atom, v) {
    if (!atom || typeof atom !== 'object') return v;
    if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.id === 'string' &&
        'hubUri' in v && 'experienceName' in v && (v.id === T.lastSelId || !T.lastSelId) &&
        v.id.indexOf(FOLDER) !== 0 && !selAtoms.has(atom)) {
      selAtoms.add(atom);
      if (selAtomCount++ < 5) log('folder: selected-tile atom found (' + selAtomCount + ')');
    }
    if (!selAtoms.has(atom) || !T.folderTiles) return v;
    if (v == null && T.folderSel && T.folderTiles[T.folderSel]) {
      if (!T.done['folder: atom gives the folder']) done('folder: atom gives the folder');
      return T.folderTiles[T.folderSel];
    }
    /* the Home starting on (or going back to) a game that is in a folder: the
       row does not have it, the focus went up to the tabs */
    var inFolder = v && typeof v.id === 'string' && T.folderOf && T.folderOf[v.id];
    if (inFolder && T.folderTiles[inFolder]) {
      if (T.folderSel !== inFolder) {
        T.folderSel = inFolder;
        log('folder: selected game ' + v.id + ' is in ' + inFolder);
        setTimeout(folderChanged, 0);
      }
      return T.folderTiles[inFolder];
    }
    return v;
  }
  /* When the row list changes (a game uninstalled), module 93's
     findSelectedExperienceId({selectedExperienceId, experiences,
     prevExperiences, fallbackId}) picks the new selected tile from the full
     list: if the selected one is gone it walks left in the old list. Removing
     the first game lands on the Store, which is hidden -> nothing selected.
     Hidden ids are taken out of both lists (and the fallback) first. */
  var selFolderLogs = 0;
  /* diagnostic: what the strand gets (selectedItem and where it is in
     its data), once per change; a new game showed the Home's selection
     (name, background, hub) on the 2nd tile while the 1st was drawn big */
  var strandSeen = {}, strandProbes = 0;
  function strandProbe(props) {
    if (!('selectedItem' in props) || typeof props.keyExtractor !== 'function' ||
        !Array.isArray(props.data) || strandProbes >= 40)
      return;
    try {
      var sel = props.selectedItem, ids = [], at = -1;
      for (var i = 0; i < props.data.length; i++) {
        var k = props.data[i] ? props.keyExtractor(props.data[i], i) : '?';
        if (k === sel) at = i;
        if (i < 5) ids.push(k);
      }
      var sig = String(sel) + '|' + props.data.length + '|' + ids.join(',');
      if (strandSeen[sig]) return;
      strandSeen[sig] = true;
      strandProbes++;
      log('strand: selectedItem ' + (typeof sel === 'string' ? sel : typeof sel) + ' at ' + at + ' of ' +
          props.data.length + ' [' + ids.join(',') + ']' + (props.ref ? ' ref' : ''));
    } catch (e) { log('strand probe error: ' + e); }
  }
  /* A game added before the selected tile (an install finishing, seen in a log:
     DAVE THE DIVER back at index 0 with Hades II selected at 0 -> 1): the
     strand moves its highlight only in an effect on selectedItem (fun6306),
     and selectedItem did not change, so the tile now at the old index was
     drawn big while the Home (name, background, hub) kept the other game.
     The strand tells the Home with onFocus/onChange({item, index,
     userInitiated}) when its highlight moves; here it is told the same for
     the tile that stayed highlighted. */
  /* space between the row's tiles. The strand of the Home row gets
     itemMargin 8 (module of fun6255); its scroll (index × -(size + margin)),
     positions and offsets all use it */
  function tileGap() {
    var g = Number(THEME.rowTileGap);
    return isFinite(g) && g >= -100 && g <= 400 ? g : 8;
  }
  var gapLogs = 0;
  function strandTune(props) {
    if (APP !== 'home' || !('selectedItem' in props) || typeof props.keyExtractor !== 'function' ||
        !Array.isArray(props.data))
      return;
    if (typeof props.selectedItem === 'string') T.strandSel = props.selectedItem;
    if (props.itemMargin === 8 && tileGap() !== 8) {
      props.itemMargin = tileGap();
      if (gapLogs++ < 2) log('row: space between tiles ' + tileGap());
      if (!T.done['space between tiles']) done('space between tiles');
    }
  }
  var strandState = new WeakMap(), strandFollowLogs = 0;
  function strandFollow(props) {
    if (!('selectedItem' in props) || typeof props.keyExtractor !== 'function' ||
        !Array.isArray(props.data) || !props.ref || typeof props.ref !== 'object')
      return;
    var sel = props.selectedItem, data = props.data, at = -1;
    if (typeof sel !== 'string' || !sel) return;
    try {
      for (var i = 0; i < data.length; i++)
        if (data[i] && props.keyExtractor(data[i], i) === sel) { at = i; break; }
    } catch (e) { return; }
    var prev = strandState.get(props.ref);
    strandState.set(props.ref, { sel: sel, at: at, len: data.length });
    /* a game came in before the selected one (it moved right). The
       list need not grow: with rowMaxGames the last game leaves the row
       (a game being installed got the focus, the Home kept the name
       of the game after it) */
    if (!prev || prev.sel !== sel || prev.at < 0 || at < 0 || at <= prev.at ||
        data.length < prev.len || prev.at >= data.length)
      return;
    var item = data[prev.at], index = prev.at;
    var calls = [props.onFocus, props.onChange].filter(function (f, n, all) {
      return typeof f === 'function' && all.indexOf(f) === n;
    });
    if (!item || !calls.length) return;
    if (strandFollowLogs++ < 10)
      log('strand: ' + sel + ' moved ' + prev.at + ' -> ' + at + ' (games added), Home told ' +
          (item.id || '?') + ' at ' + index);
    setTimeout(function () {
      calls.forEach(function (f) {
        try { f({ item: item, index: index, userInitiated: false }); }
        catch (e) { log('strand follow error: ' + e); }
      });
    }, 0);
  }
  var tabFirstLogs = 0;
  function hookSelected(exp) {
    if (!(THEME.hideStore || THEME.hideAllApps || THEME.hideGallery || THEME.hideTiles || THEME.folders ||
          extraTabs().length) || APP !== 'home' ||
        typeof exp.findSelectedExperienceId !== 'function' ||
        exp.findSelectedExperienceId.__theme)
      return;
    var original = exp.findSelectedExperienceId;
    var keep = function (list, ids) {
      return Array.isArray(list)
                 ? list.filter(function (e) { return !e || !ids[e.id]; })
                 : list;
    };
    var swapped = function (o) {
      try {
        var ids = removedIds();
        if (o && typeof o === 'object') {
          var p = {};
          for (var k in o) p[k] = o[k];
          p.experiences = keep(o.experiences, ids);
          p.prevExperiences = keep(o.prevExperiences, ids);
          var fo = folderOfGame(o.selectedExperienceId);
          if (fo && listHas(o.experiences, fo)) {
            p.selectedExperienceId = fo;
            if (selFolderLogs++ < 10) log('selected tile in a folder: ' + o.selectedExperienceId + ' -> ' + fo);
          }
          if (p.fallbackId && ids[p.fallbackId]) p.fallbackId = undefined;
          /* a row of our tabs starts on its first tile (the Home's
             default id, NPXS40063, is not in it and its fallback is the 2nd) */
          if (isTabRow(o.experiences) && o.experiences[0] && !listHas(o.experiences, o.selectedExperienceId)) {
            var first = o.experiences[0].id;
            if (tabFirstLogs++ < 6) log('tab first tile: ' + o.selectedExperienceId + ' -> ' + first);
            return first;
          }
          var r = original.call(this, p);
          var fr = folderOfGame(r);
          if (fr && listHas(o.experiences, fr)) r = fr;
          if (r !== o.selectedExperienceId) {
            var ids5 = function (l) {
              return Array.isArray(l) ? l.slice(0, 5).map(function (e) { return e && e.id; }).join(',') : String(l);
            };
            log('selected tile: ' + o.selectedExperienceId + ' -> ' + r + ' (now ' + ids5(o.experiences) +
                '; before ' + ids5(o.prevExperiences) + ')');
          }
          return r;
        }
      } catch (e) { log('selected tile error: ' + e); }
      return original.apply(this, arguments);
    };
    swapped.__theme = true;
    if (replace(exp, 'findSelectedExperienceId', swapped)) done('selected tile skips hidden');
  }

  /* ---- footer ----
     The Home container ("container" style of module 261) is drawn with
     jsx/jsxs; with footer on, one more child goes in, in absolute position. */
  function footerElement() {
    var React = T.React, rn = T.rn;
    if (!React || !rn || !rn.View || !rn.Text) return null;
    var text = merge({ color: THEME.footerColor || '#ffffff', opacity: THEME.footerOpacity },
                     fontStyle(THEME.footerFontStyle));
    var px = fontSize(THEME.footerFontSize);
    if (px) text.fontSize = px;
    var items = [];
    [THEME.footerText1, THEME.footerText2, THEME.footerText3].forEach(
        function (t, i) {
          if (!t) return;
          var style = items.length
                          ? [text, { marginLeft: THEME.footerSpacing }]
                          : text;
          var iconId = buttonIcon(THEME['footerIcon' + (i + 1)]);
          var Icon = iconId ? iconComponent() : null;
          if (iconId && !Icon && !T.done['IconPS missing']) {
            T.done['IconPS missing'] = true;
            log('footer: IconPS not found');
          }
          if (Icon) {
            var size = THEME.footerIconSize || 40;
            var st = { width: size, height: size, marginRight: 12 };
            if (items.length) st.marginLeft = THEME.footerSpacing;
            /* IconPS draws its own colour; with footerIconColor the
               same picture (IconPS.getImageProps) goes in an Image, tinted */
            var src = null;
            if (THEME.footerIconColor && typeof Icon.getImageProps === 'function' && rn.Image) {
              try { src = (Icon.getImageProps({ iconId: iconId }) || {}).source; } catch (e) {}
            }
            if (THEME.footerIconColor && rn.Image && ownButtonUri(iconId)) src = src || true;
            if (src) {
              var outer = { marginRight: st.marginRight };
              if (st.marginLeft != null) outer.marginLeft = st.marginLeft;
              items.push(pulseWrap('b' + i, THEME['footerIcon' + (i + 1)],
                                   tintedIcon(React, rn, src, size, THEME.footerIconColor, 'b' + i, outer, iconId)));
              if (!T.done['footer button colour']) done('footer button colour');
            } else {
              if (THEME.footerIconColor) { st.tintColor = THEME.footerIconColor; st.color = THEME.footerIconColor; }
              items.push(pulseWrap('b' + i, THEME['footerIcon' + (i + 1)], React.createElement(Icon, { key: 'b' + i, iconId: iconId, style: st })));
            }
            items.push(withShadow(React, rn, 'r' + i, text, t, shadowPx('footerShadow')));
            if (!T.done['controller buttons']) done('controller buttons');
            return;
          }
          var icon = iconId ? null : symbol(THEME['footerIcon' + (i + 1)]);
          if (icon)
            items.push(pulseWrap('i' + i, THEME['footerIcon' + (i + 1)], React.createElement(rn.Text, {
              key: 'i' + i, numberOfLines: 1,
              style: [style, { marginRight: 12 },
                      THEME.footerIconFont ? { fontFamily: THEME.footerIconFont } : null] }, icon)));
          items.push(withShadow(React, rn, 'r' + i, icon ? text : style, t, shadowPx('footerShadow')));
        });
    /* outer View = the width used for the alignment; inner row = only the
       texts/buttons (that one is measured, so the editor box is the content) */
    var p = { pointerEvents: 'none', style: { flexDirection: 'row', alignItems: 'center' } };
    if (THEME.measureScreen) withMeasure('footer', p);
    return React.createElement(rn.View, {
      key: 'theme-footer', pointerEvents: 'none',
      style: { position: 'absolute', left: THEME.footerX, top: THEME.footerY,
               flexDirection: 'row', alignItems: 'center', width: THEME.footerWidth || 1728,
               justifyContent: align(THEME.footerAlign, true) || 'flex-start' }
    }, React.createElement(rn.View, p, items));
  }
  /* ---- the name of the fake title ----
     From the Home row itself: its onFocus({item}) (the wrap of
     folderRowProps) gives the focused tile with experienceName (a folder
     tile has the folder name there); before the first one, the strand's
     selectedItem in its data (the strand keeps an old one while moving). The hub relay
     of the old homeTitle (THEME-NAME) never gave the right name and is gone.
     A selected folder shows its name (FakeTitle); an open one, the
     highlighted game. */
  var nameListeners = [];
  function newName(name) {
    if (typeof name !== 'string' || T.gameName === name) return;
    T.gameName = name;
    if (DEBUG.on) log('focused name: ' + name);
    setTimeout(function () {
      nameListeners.forEach(function (f) { try { f(name); } catch (e) {} });
    }, 0);
  }
  function itemName(item) {
    if (!item || typeof item !== 'object') return '';
    var n = item.experienceName || item.name || item.titleName || item.title;
    return typeof n === 'string' ? n : '';
  }
  /* the logo's game before the row's first onFocus (the strand's
     selectedItem, as the fake title) */
  function strandLogo(props) {
    if (!logoOn() || T.logoFocusSeen || !('selectedItem' in props) ||
        typeof props.keyExtractor !== 'function' || !Array.isArray(props.data))
      return;
    var sel = props.selectedItem, item = null;
    if (typeof sel !== 'string' || !sel) return;
    try {
      for (var i = 0; i < props.data.length; i++)
        if (props.data[i] && props.keyExtractor(props.data[i], i) === sel) { item = props.data[i]; break; }
    } catch (e) { return; }
    var id = item && typeof item.id === 'string' ? item.id : '';
    if (id) logoIdSet(id);
  }
  var rowNameLogs = 0;
  function strandName(props) {
    if (APP !== 'home' || titleMode() !== 'fake' || !('selectedItem' in props) ||
        typeof props.keyExtractor !== 'function' || !Array.isArray(props.data))
      return;
    var sel = props.selectedItem, item = null;
    if (typeof sel !== 'string' || !sel) return;
    try {
      for (var i = 0; i < props.data.length; i++)
        if (props.data[i] && props.keyExtractor(props.data[i], i) === sel) { item = props.data[i]; break; }
    } catch (e) { return; }
    var name = itemName(item);
    /* the strand keeps an old selectedItem while the focus moves along
       the row (the name of the tile before); only until the row's
       first onFocus */
    if (T.rowFocusSeen) return;
    if (!name) {
      if (item && !T.done['row item without name'])
        done('row item without name: ' + Object.keys(item).slice(0, 20).join(','));
      return;
    }
    if (name !== T.gameName && rowNameLogs++ < 10) log('fake title: ' + sel + ' = ' + name);
    newName(name);
  }
  /* The hub always shows the right name of the focused item. The hub's
     theme.js writes it to the console ("THEME-NAME ..."); ZhiThemes keeps it
     and, when the Home asks ("THEME-ASK", on the Home's own thread), hands it
     over with __themeName(name). */
  var trophyListeners = [];
  if (APP === 'home' && (THEME.fakeTrophies || THEME.folders || THEME.animToast)) {
    globalThis.__themeData = function (key, text) {
      if (toastData(key, text)) return;
      if (key === 'zt-select') {
        /* from the Home before the reload (not this one, not an old one) */
        try {
          var s = JSON.parse(String(text));
          if (s && s.id && s.t !== T.sentSelect && Date.now() - s.t < 30000 && T.selectSeen !== s.t) {
            T.selectSeen = s.t;
            T.selectAfter = s.id;
            log('folder: will select ' + s.id + ' after the reload');
            /* used: a later reload must not select it again */
            console.log('THEME-DATA zt-select done');
          }
        } catch (e) {}
        return;
      }
      if (key === 'zt-fbg') {
        var made = [];
        try { made = JSON.parse(String(text)); } catch (e) {}
        if (!Array.isArray(made)) made = [];
        T.fbgReady = {};
        made.forEach(function (n) { T.fbgReady[n] = true; });
        log('folder backgrounds ready: ' + made.length);
        /* the folder focused now shows it (not while its games are open) */
        if (T.lastBgImg && folderBgUri(T.lastBgImg) && !folderIsOpen() && T.sceneControl)
          try { T.sceneControl.setBackground(T.lastBgImg); } catch (e) {}
        return;
      }
      if (key === 'zt-rename') {
        /* the keyboard closed (ZhiThemes' TextField): save the name; the
           reload also gives the focus back to the row */
        var rn = null;
        try { rn = JSON.parse(String(text)); } catch (e) {}
        if (!rn || !rn.id || Date.now() / 1000 - rn.t > 300) return;
        console.log('THEME-DATA zt-rename done');
        var rpart = folderPart(folderParts(), rn.id);
        var nm = String(rn.name || '').trim() || (rpart ? rpart.head.split('|')[0].trim() : '');
        log('folder rename: ' + rn.id + ' -> "' + nm + '"');
        if (nm) folderAction('ztfolder:rename?' + rn.id + ',' + nm);
        return;
      }
      if (key === 'allgames') {
        if (T.allGamesFromDb) return;
        try {
          var all = {};
          JSON.parse(String(text)).forEach(function (g) { all[g.id] = g; });
          T.allGames = all;
          T.allGamesVer = (T.allGamesVer || 0) + 1;
          done('installed games: ' + Object.keys(all).length);
          setTimeout(folderChanged, 0);
        } catch (e) { log('installed games: bad data ' + e); }
        return;
      }
      if (key !== 'trophies' || !THEME.fakeTrophies) return;
      var v;
      try { v = JSON.parse(String(text)); } catch (e) { log('trophies: bad data ' + e); return; }
      if (v && v.id) (T.trophyCache = T.trophyCache || {})[v.id] = v;
      /* only the focused game's are shown (a prefetched one waits in the cache) */
      if (v && v.id && T.focusedId && v.id !== T.focusedId) return;
      T.trophies = v;
      if (!T.done['trophies received']) done('trophies received: ' + String(text).slice(0, 120));
      setTimeout(function () {
        trophyListeners.forEach(function (f) { try { f(v); } catch (e) {} });
      }, 0);
    };
  }
  if (APP === 'home' && (THEME.fakeTrophies || THEME.folders))
    setInterval(function () { try { console.log('THEME-ASK'); } catch (e) {} },
                THEME.fakeTrophies && THEME.fakeTrophiesFast !== false ? 120 : 250);
  var TROPHY_ICONS = ['trophy_grade1_platinum', 'trophy_grade2_gold', 'trophy_grade3_silver', 'trophy_grade4_bronze'];
  function HomeTrophies() {
    var React = T.React, rn = T.rn, Icon = iconComponent();
    var st = React.useState(T.trophies || null), t = st[0], set = st[1];
    var tick = React.useState(0)[1];
    React.useEffect(function () {
      var redraw = function () { tick(function (n) { return n + 1; }); };
      tileListeners.push(redraw);
      return function () {
        var i = tileListeners.indexOf(redraw);
        if (i >= 0) tileListeners.splice(i, 1);
      };
    }, []);
    React.useEffect(function () {
      trophyListeners.push(set);
      if (T.trophies && T.trophies !== t) set(T.trophies);
      return function () {
        var i = trophyListeners.indexOf(set);
        if (i >= 0) trophyListeners.splice(i, 1);
      };
    }, []);
    if (!t || t.none || !t.e) return null;
    /* only in the Games space and for the focused tile (when the Home has
       said which one it is) */
    if (T.space === 'media') return null;
    if (typeof T.focusedId === 'string' && t.id && T.focusedId !== t.id) return null;
    var px = fontSize(THEME.fakeTrophiesFontSize || 27) || 27, color = THEME.fakeTrophiesColor || '#ffffff';
    var text = { fontSize: px, color: color };
    var rows = [];
    if (THEME.fakeTrophiesProgress && typeof t.p === 'number') {
      var p = Math.max(0, Math.min(100, t.p));
      rows.push(React.createElement(rn.View, { key: 'p', style: { flexDirection: 'row', alignItems: 'center', marginBottom: Math.round(px * 0.5) } }, [
        React.createElement(rn.Text, { key: 't', style: [text, { marginRight: Math.round(px * 0.6) }] }, p + '%'),
        /* the bar takes the rest of the row: as wide as the box (the trophy
           row sets the width, also with the totals) */
        React.createElement(rn.View, { key: 'b', style: { flex: 1, minWidth: Math.round(px * 4), height: Math.max(4, Math.round(px * 0.22)),
                                                           borderRadius: Math.max(2, Math.round(px * 0.11)),
                                                           backgroundColor: 'rgba(255,255,255,0.25)' } },
          React.createElement(rn.View, { style: { width: p + '%', height: '100%',
                                                  borderRadius: Math.max(2, Math.round(px * 0.11)),
                                                  backgroundColor: THEME.fakeTrophiesBarColor || '#2fd0e6' } }))
      ]));
    }
    var size = Math.round(px * 1.3), items = [];
    TROPHY_ICONS.forEach(function (id, i) {
      var n = String(t.e[i] | 0) + (THEME.fakeTrophiesTotals && t.d ? '/' + (t.d[i] | 0) : '');
      items.push(React.createElement(rn.View, { key: 'g' + i, style: { flexDirection: 'row', alignItems: 'center',
                                                                      marginLeft: i ? Math.round(px * 0.9) : 0 } }, [
        Icon ? React.createElement(Icon, { key: 'i', iconId: id, style: { width: size, height: size, marginRight: Math.round(px * 0.3) } }) : null,
        React.createElement(rn.Text, { key: 'n', style: text }, n)
      ]));
    });
    rows.push(React.createElement(rn.View, { key: 'g', style: { flexDirection: 'row', alignItems: 'center' } }, items));
    var pad = Math.round(px * 0.7), sc = THEME.fakeTrophiesScale || 1;
    var box = { position: 'absolute', left: THEME.fakeTrophiesX, top: THEME.fakeTrophiesY, padding: pad };
    if (sc !== 1) box.transform = [{ scale: sc }];
    var children = [];
    if (THEME.fakeTrophiesBgOpacity > 0)
      children.push(React.createElement(rn.View, { key: 'bg', style: {
        position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: THEME.fakeTrophiesCorners || 0,
        backgroundColor: THEME.fakeTrophiesBg || '#000000', opacity: THEME.fakeTrophiesBgOpacity } }));
    children = children.concat(rows);
    var props = { pointerEvents: 'none', style: box };
    if (THEME.measureScreen) withMeasure('homeTrophies', props);
    if (!T.done['home trophies']) done('home trophies');
    return infoAnim('theme-trophies-anim', t.id || T.focusedId, React.createElement(rn.View, props, children));
  }

  /* decorations: icons only to see, in the Home front layer (pointerEvents
     none, not focusable): a controller button / system icon (IconPS iconId)
     or an uploaded image (rn.Image from /data/ZhiThemes/backgrounds) */
  /* a controller button ('l1'), a system icon name or a .png, size x size */
  /* a controller button tinted with a colour. The PS5's own pictures are
     grey and the PS5 multiplies tintColor by them (measured on a capture:
     ~75% of the colour, also with copies stacked), so the usual buttons use
     white ones of ZhiThemes (THEME/make_button_icons.py, written with the
     particle textures to Assets/particles/btn_<name>.png): exact colour. */
  var OWN_BUTTONS = { face_cross: 'cross', face_circle: 'circle', face_square: 'square', face_triangle: 'triangle',
                      l1: 'l1', r1: 'r1', l2: 'l2', r2: 'r2', options: 'options' };
  function ownButtonUri(iconId) {
    var k = OWN_BUTTONS[String(iconId || '').replace(/^controller_key_/, '')];
    return k ? 'file://' + ZT_ASSETS + 'particles/btn_' + k + '.png' : null;
  }
  function tintedIcon(React, rn, src, size, color, key, outer, iconId) {
    var own = ownButtonUri(iconId);
    var st = { width: size, height: size, tintColor: color };
    if (outer) for (var ok in outer) st[ok] = outer[ok];
    if (own && !T.done['white button pictures']) done('white button pictures');
    return React.createElement(rn.Image, { key: key, source: own ? { uri: own } : src, resizeMode: 'contain', style: st });
  }
  function decoIcon(v, size, color) {
    var React = T.React, rn = T.rn;
    if (!React || !rn || typeof v !== 'string' || !v.trim()) return null;
    if (/\.(png|jpe?g)$/i.test(v.trim()) || v.trim().charAt(0) === '/') {
      var path = iconValue(v);
      return rn.Image ? React.createElement(rn.Image, { source: { uri: 'file://' + path }, resizeMode: 'contain',
                                                         style: { width: size, height: size } }) : null;
    }
    var Icon = iconComponent(), id = buttonIcon(v) || v.trim();
    var st = { width: size, height: size };
    /* IconPS ignores tintColor and draws its own grey (the L1/R1 of the tabs
       group came out darker than names of the same colour): with a colour
       the same picture goes in an Image, tinted, as the footer does */
    if (color && Icon && typeof Icon.getImageProps === 'function' && rn.Image) {
      var src = null;
      try { src = (Icon.getImageProps({ iconId: id }) || {}).source; } catch (e) {}
      if (src || ownButtonUri(id)) return tintedIcon(React, rn, src, size, color, 'tint', null, id);
    }
    if (color) { st.tintColor = color; st.color = color; }
    return Icon ? React.createElement(Icon, { iconId: id, style: st }) : null;
  }

  /* tabs group: the L1 / R1 icons and a background go INSIDE the tabs layer
     (FocusLayerPS 'space-switcher', a row of 'space-switcher-<space>' Views,
     module ~255160), so they follow the width of the tab names in any
     language and move with tabsX / tabsY. The layer has flex 1 in a 126 px
     column (spaceSwitcherWrapper): it gets a fixed height and is centred */
  function tabsGroup(props) {
    var React = T.React, rn = T.rn;
    if (!THEME.tabsGroup || !React || !rn || props.name !== 'space-switcher') return;
    var kids = Array.isArray(props.children) ? props.children.slice()
             : props.children != null ? [props.children] : [];
    /* FocusLayerPS passes the same props (name included) on to the view
       inside it: the second pass found the group already there and doubled
       the icons */
    for (var j = 0; j < kids.length; j++) {
      var kk = kids[j] && (kids[j].key || (kids[j].props && kids[j].props.key));
      if (typeof kk === 'string' && kk.indexOf('zt-group-') === 0) {
        if (!T.done['tabs group (inner pass skipped)']) done('tabs group (inner pass skipped)');
        return;
      }
    }
    /* the tabs can come as one array inside the children (as tabsOrder sees them) */
    if (kids.length === 1 && Array.isArray(kids[0])) kids = kids[0].slice();
    var last = kids.length - 1;
    var notTab = function (k) { return !(k && k.props) || /^zt-/.test(tabIdOf(k)); };
    while (last >= 0 && notTab(kids[last])) last--;
    if (last >= 0 && React.cloneElement)
      kids[last] = React.cloneElement(kids[last], { style: [kids[last].props.style, { marginRight: 0 }] });
    /* the pill gives each tab marginLeft -tabsPillPadX (so the names stay
       where the stock ones were): on the first tab that pulled its pill
       over the left icon, while the right icon kept the whole gap. The
       first tab starts at 0 so both icons sit tabsGroupIconGap from the pill */
    var first = 0;
    while (first < kids.length && notTab(kids[first])) first++;
    if (first < kids.length && React.cloneElement)
      kids[first] = React.cloneElement(kids[first], { style: [kids[first].props.style, { marginLeft: 0 }] });
    /* the clones above do not reach the tab Views: tabEnds does it there */
    if (first <= last) {
      var ends = { first: tabIdOf(kids[first]), last: tabIdOf(kids[last]) };
      if (!T.tabEnds || T.tabEnds.first !== ends.first || T.tabEnds.last !== ends.last) {
        T.tabEnds = ends;
        log('tabs group ends: ' + ends.first + ' / ' + ends.last);
      }
    }
    var size = THEME.tabsGroupIconSize || 40, gap = THEME.tabsGroupIconGap || 0;
    var op = THEME.tabsGroupIconOpacity == null ? 1 : THEME.tabsGroupIconOpacity;
    function side(v, key, st) {
      var el = decoIcon(v, size, THEME.tabsGroupIconColor);
      if (!el) return null;
      st.width = size; st.height = size; st.opacity = op;
      return React.createElement(rn.View, { key: key, pointerEvents: 'none', focusable: false, style: st }, pulseWrap('p', v, el));
    }
    var left = side(THEME.tabsGroupLeft, 'zt-group-left', { marginRight: gap });
    var right = side(THEME.tabsGroupRight, 'zt-group-right', { marginLeft: gap });
    var h = THEME.tabsGroupHeight || 72, out = [];
    if (THEME.tabsGroupBgOn && THEME.tabsGroupBg)
      out.push(React.createElement(rn.View, {
        key: 'zt-group-bg', pointerEvents: 'none', focusable: false,
        style: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
                 borderRadius: THEME.tabsGroupCorners, backgroundColor: THEME.tabsGroupBg,
                 opacity: THEME.tabsGroupBgOpacity == null ? 1 : THEME.tabsGroupBgOpacity }
      }));
    if (left) out.push(left);
    out = out.concat(kids);
    if (right) out.push(right);
    props.children = out;
    var pad = THEME.tabsGroupPadding || 0;
    props.style = [props.style, { flex: 0, height: h, marginTop: Math.round((126 - h) / 2),
                                  alignSelf: 'flex-start', paddingLeft: pad, paddingRight: pad }];
    if (!T.done['tabs group']) done('tabs group: ' + (THEME.tabsGroupLeft || '-') + ' / ' + (THEME.tabsGroupRight || '-'));
  }

  function decoElements() {
    var React = T.React, rn = T.rn, out = [];
    if (!React || !rn || APP !== 'home') return out;
    for (var i = 1; i <= 4; i++) {
      var k = 'deco' + i, v = THEME[k + 'Icon'];
      if (!THEME[k + 'On'] || typeof v !== 'string' || !v.trim()) continue;
      var size = THEME[k + 'Size'] || 40;
      var box = { position: 'absolute', left: THEME[k + 'X'], top: THEME[k + 'Y'], width: size, height: size,
                  opacity: THEME[k + 'Opacity'] == null ? 1 : THEME[k + 'Opacity'] };
      var el = decoIcon(v, size, THEME[k + 'Color']);
      if (!el) continue;
      var props = { key: 'theme-' + k, pointerEvents: 'none', style: box };
      if (THEME.measureScreen) withMeasure(k, props);
      out.push(React.createElement(rn.View, props, pulseWrap('p', v, el)));
      if (!T.done['decoration ' + i]) done('decoration ' + i + ': ' + v);
    }
    return out;
  }

  /* user name (from the profile button) with the status dot */
  var userListeners = [];
  function newUser(name, presence) {
    var online = presence === true || /online|available/i.test(String(
        presence && typeof presence === 'object' ? JSON.stringify(presence) : presence));
    if (T.userName === name && T.userOnline === online) return;
    if (!T.userName) log('user: "' + name + '" status=' + String(
        presence && typeof presence === 'object' ? JSON.stringify(presence) : presence).slice(0, 120));
    T.userName = name;
    T.userOnline = online;
    setTimeout(function () {
      userListeners.forEach(function (f) { try { f(name + '|' + online); } catch (e) {} });
    }, 0);
  }
  function User() {
    var React = T.React, rn = T.rn;
    var st = React.useState(''), set = st[1];
    React.useEffect(function () {
      userListeners.push(set);
      return function () {
        var i = userListeners.indexOf(set);
        if (i >= 0) userListeners.splice(i, 1);
      };
    }, []);
    /* the name the system gives the foreground user (the module reads it
       with sceUserServiceGetUserName): the Home does not pass it in any props */
    if (!T.userName && typeof globalThis.__ztUser === 'string' && globalThis.__ztUser) {
      T.userName = globalThis.__ztUser;
      T.userOnline = true;
      log('user: "' + T.userName + '" (from the system)');
    }
    if (!T.userName) return null;
    var px = fontSize(THEME.userFontSize || 27) || 27;
    var children = [];
    if (THEME.userDot)
      children.push(React.createElement(rn.View, { key: 'p', style: {
        /* radius = half the diameter: with a bigger radius the PS5 did not draw it */
        width: Math.round(px * 0.45), height: Math.round(px * 0.45),
        borderRadius: Math.round(px * 0.45) / 2,
        marginRight: Math.round(px * 0.4),
        backgroundColor: T.userOnline ? (THEME.userDotColor || '#3ad04a') : '#7a7a7a' } }));
    var nameProps = { key: 't', numberOfLines: 1,
                      style: merge({ fontSize: px, color: THEME.userColor || '#ffffff' },
                                   fontStyle(THEME.userFontStyle)), children: T.userName };
    /* the shadow sits in a box together with the name, below it:
       it follows the name whatever the alignment */
    var nameShadow = shadowOf(function (t, pr) { return React.createElement(t, pr); }, rn.Text,
                              { key: 'ts', numberOfLines: 1,
                                style: [nameProps.style, { position: 'absolute', left: 0, top: 0 }],
                                children: T.userName }, null, shadowPx('userShadow'));
    children.push(React.createElement(rn.View, { key: 'n' },
                                      nameShadow ? [nameShadow, React.createElement(rn.Text, nameProps)]
                                                 : React.createElement(rn.Text, nameProps)));
    return React.createElement(rn.View, { pointerEvents: 'none', style: {
      position: 'absolute', left: THEME.userX, top: THEME.userY,
      width: THEME.userWidth || 400, flexDirection: 'row', alignItems: 'center',
      justifyContent: align(THEME.userAlign, true) || 'flex-start' } }, children);
  }
  /* ---- fake title ----
     Drawn in the Home's front layer (fades out as the Home goes up to the
     hub), at fakeTitleX/Y on the screen, with the nameCopy* look (size,
     colour, font, alignment, width, wrap, scroll, background, shadow).
     Not part of the tile title, so the PS5 symbol arriving late or the
     names' strip sliding after a reload no longer move it. Name: the row's
     selected tile (strandName); a folder open with its games: the
     highlighted game. */
  /* old themes (titleMode empty): the Big name was placed from the tile
     name text (nameCopyX/Y relative to it); that text is measured once the
     row has settled and the same screen position is used */
  var oldCopyTexts = [], oldCopyTimer = 0;
  function oldCopyMeasure(props) {
    var before = props.onLayout;
    props.onLayout = function (ev) {
      if (typeof before === 'function') before.apply(this, arguments);
      var target = ev && (ev.currentTarget || ev.target);
      if (!target || typeof target.measureInWindow !== 'function' || T.oldCopyOrigin) return;
      if (oldCopyTexts.indexOf(target) < 0) oldCopyTexts.push(target);
      clearTimeout(oldCopyTimer);
      /* after the strip of names slid to the selected tile */
      oldCopyTimer = setTimeout(oldCopyPick, 1000);
    };
  }
  function oldCopyPick() {
    /* the focused tile's name starts ~102 px right of the focused tile (as
       the editor reckons it): the measured text nearest to that */
    var want = 172 + (THEME.rowX || 0) + (THEME.focusX || 0) + (THEME.focusSize || 168) + 102 + (THEME.tileNameX || 0);
    var got = [], left = oldCopyTexts.length;
    var end = function () {
      oldCopyTexts = [];
      if (!got.length || T.oldCopyOrigin) return;
      got.sort(function (p, q) { return Math.abs(p[0] - want) - Math.abs(q[0] - want); });
      T.oldCopyOrigin = [Math.round(got[0][0]), Math.round(got[0][1])];
      log('fake title: old Big name placed from the tile name at ' + T.oldCopyOrigin.join(',') +
          ' -> fakeTitleX ' + (T.oldCopyOrigin[0] + (THEME.nameCopyX || 0)) +
          ', fakeTitleY ' + (T.oldCopyOrigin[1] + (THEME.nameCopyY || 0)));
      setTimeout(function () { nameListeners.forEach(function (f) { try { f(T.gameName); } catch (e) {} }); }, 0);
    };
    if (!left) return;
    oldCopyTexts.forEach(function (t) {
      try {
        t.measureInWindow(function (x, y, w, h) {
          if (w > 0 && h > 0) got.push([x, y]);
          if (--left === 0) end();
        });
      } catch (e) { if (--left === 0) end(); }
    });
  }
  /* ---- the theme's own animations ----
     ZtEnter: an Animated.View (native driver) whose children come in
     (opacity, translate, scale from props.from to rest) when it mounts and
     each time props.k changes. The values jump back to the start in the
     render that brings the new key (so the new children are not drawn at
     full opacity first); the timing starts in the effect. Only opacity and
     transform are animated (never layout). Overlays get a full screen box
     (absolute, 1920x1080) so they take no place in the Home's flex and the
     opacity group is never clipped. Without Animated (harness): the
     children as they are. */
  var ZT_SCREEN = { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 };
  function canAnimate() {
    var React = T.React, A = T.rn && T.rn.Animated;
    return !!(React && typeof React.useRef === 'function' && typeof React.useEffect === 'function' &&
              A && A.View && typeof A.Value === 'function' && typeof A.timing === 'function');
  }
  function easeOut(t) { return 1 - (1 - t) * (1 - t) * (1 - t); }
  function enterStart(v, from) {
    v.op.setValue(from.op == null ? 0 : from.op);
    v.x.setValue(from.x || 0);
    v.y.setValue(from.y || 0);
    v.s.setValue(from.scale == null ? 1 : from.scale);
  }
  function ZtEnter(props) {
    var React = T.React, A = T.rn.Animated;
    /* the start (props.from) is kept from the render that brought the key:
       a later render with another from (e.g. the folder strip after 300 ms)
       does not change the animated props half way */
    var r = React.useRef(null);
    var from;
    if (!r.current) {
      from = props.from || {};
      r.current = { op: new A.Value(from.op == null ? 0 : from.op), x: new A.Value(from.x || 0),
                    y: new A.Value(from.y || 0), s: new A.Value(from.scale == null ? 1 : from.scale),
                    k: props.k, from: from };
    } else if (r.current.k !== props.k) {
      from = props.from || {};
      r.current.k = props.k;
      r.current.from = merge(merge({}, r.current.from), from);
      try { enterStart(r.current, from); } catch (e) {}
    }
    var v = r.current;
    from = v.from;
    React.useEffect(function () {
      var ms = props.ms > 0 ? props.ms : 240, delay = props.delay > 0 ? props.delay : 0, list = [];
      var go = function (val, to) {
        return A.timing(val, { toValue: to, duration: ms, delay: delay, useNativeDriver: true,
                               easing: easeOut, isInteraction: false });
      };
      try {
        list.push(go(v.op, 1));
        if (from.x) list.push(go(v.x, 0));
        if (from.y) list.push(go(v.y, 0));
        if (from.scale != null && from.scale !== 1) list.push(go(v.s, 1));
        list.forEach(function (a) { a.start(); });
      } catch (e) {
        try { v.op.setValue(1); v.x.setValue(0); v.y.setValue(0); v.s.setValue(1); } catch (e2) {}
        if (!T.done['animation error']) done('animation error: ' + e);
      }
      return function () { list.forEach(function (a) { try { a.stop(); } catch (e) {} }); };
    }, [props.k]);
    var tf = [];
    if (from.x) tf.push({ translateX: v.x });
    if (from.y) tf.push({ translateY: v.y });
    if (from.scale != null && from.scale !== 1) tf.push({ scale: v.s });
    var style = { opacity: v.op };
    if (tf.length) style.transform = tf;
    var p = { style: props.style ? [props.style, style] : style };
    if (props.pointerEvents) p.pointerEvents = props.pointerEvents;
    return React.createElement(A.View, p, props.children);
  }
  /* child in a ZtEnter (overlay: full screen box unless opts.style) */
  function animWrap(key, k, from, ms, child, opts) {
    if (child == null || !canAnimate()) return child;
    var p = { key: key, k: k, from: from, ms: ms, pointerEvents: 'none', style: ZT_SCREEN };
    if (opts) for (var o in opts) p[o] = opts[o];
    return T.React.createElement(ZtEnter, p, child);
  }
  function nameFrom() {
    var s = THEME.animNamesStyle;
    return s === 'fade' ? { op: 0 } : s === 'rise' ? { op: 0, y: 18 } : { op: 0, x: 28 };
  }
  function animNames() { return THEME.animNames !== false && canAnimate(); }
  function nameAnim(key, text, child) {
    return animNames() ? animWrap(key, text, nameFrom(), THEME.animNamesMs || 240, child) : child;
  }
  /* tab change: one opacity and one translateX for the row box (module 26
     container, an Animated.View while animTabs is on, so the row is never
     remounted), started from the T.space setter. Shown at once, then it
     fades / slides in from the side of the new tab: from the right when
     the new tab is to the right of the old one. */
  function tabAnimOn() { return APP === 'home' && THEME.animTabs !== false && canAnimate(); }
  function tabAnimValues() {
    var A = T.rn && T.rn.Animated;
    if (!T.tabAnim && A && typeof A.Value === 'function') T.tabAnim = { op: new A.Value(1), x: new A.Value(0) };
    return T.tabAnim;
  }
  function spaceMoved(from, to) {
    if (!tabAnimOn() || !T.rowBox) return;
    var v = tabAnimValues(), A = T.rn.Animated;
    if (!v) return;
    var ids = spaceOrder();
    var a = ids.indexOf(from), b = ids.indexOf(to);
    var dir = a < 0 || b < 0 ? 1 : b > a ? 1 : -1;
    var dist = THEME.animTabsSlide == null ? 90 : Number(THEME.animTabsSlide) || 0;
    var ms = THEME.animTabsMs > 0 ? THEME.animTabsMs : 280;
    try {
      if (T.tabAnimRun) T.tabAnimRun.forEach(function (x) { try { x.stop(); } catch (e) {} });
      v.op.setValue(0);
      v.x.setValue(dir * dist);
      /* a short wait: the new tab's row comes a frame or two later */
      T.tabAnimRun = [
        A.timing(v.op, { toValue: 1, duration: ms, delay: 60, useNativeDriver: true, easing: easeOut, isInteraction: false }),
        A.timing(v.x, { toValue: 0, duration: ms, delay: 60, useNativeDriver: true, easing: easeOut, isInteraction: false })];
      T.tabAnimRun.forEach(function (x) { x.start(); });
      pulseButton(dir > 0 ? 'r1' : 'l1');
      if ((T.tabAnimLogs = (T.tabAnimLogs || 0) + 1) <= 6) log('tab animation ' + from + ' -> ' + to + (dir > 0 ? ' (from the right)' : ' (from the left)'));
    } catch (e) {
      try { v.op.setValue(1); v.x.setValue(0); } catch (e2) {}
      log('tab animation: ' + e);
    }
  }
  /* favourites (and animToast folder changes): a message over the
     focused tile that comes in and goes after 3 s. it plays once: the Home's
     front layer mounts again when the tab changes (played it again in
     every tab), so a mount after it played draws nothing. One
     Animated.Value 0 -> 1 (native driver), the rest interpolated. */
  var favFxListeners = [], FAV_MS = 3000;
  function showToast(text) {
    if (APP !== 'home' || !text) return;
    T.favFx = { n: ((T.favFx && T.favFx.n) || 0) + 1, text: text, at: Date.now(), played: false };
    favFxListeners.forEach(function (f) { try { f(); } catch (e) {} });
  }
  function favEffect(add, name) {
    var text = THEME.animFav !== false ? (add ? 'Added to favourites' : 'Removed from favourites') : '';
    showToast(text);
  }
  function toastOn() {
    return APP === 'home' && canAnimate() && T.React && typeof T.React.useState === 'function' &&
           ((THEME.tabFavOn && THEME.animFav !== false) || THEME.animToast);
  }
  function FavBurst() {
    var React = T.React, rn = T.rn, A = rn.Animated;
    var tick = React.useState(0)[1];
    var p = React.useRef(null);
    if (!p.current) p.current = new A.Value(1);
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      favFxListeners.push(f);
      return function () {
        var i = favFxListeners.indexOf(f);
        if (i >= 0) favFxListeners.splice(i, 1);
      };
    }, []);
    var fx = T.favFx, n = fx ? fx.n : 0;
    var live = !!fx && (!fx.played || p.current.__ztN === n);
    React.useEffect(function () {
      if (!fx || fx.played) return;
      fx.played = true;
      p.current.__ztN = n;
      var anim = null;
      try {
        p.current.setValue(0);
        anim = A.timing(p.current, { toValue: 1, duration: FAV_MS, useNativeDriver: true,
                                     easing: function (t) { return t; }, isInteraction: false });
        anim.start();
        log('message: ' + fx.text);
      } catch (e) { log('message: ' + e); }
      return function () { try { if (anim) anim.stop(); } catch (e) {} };
    }, [n]);
    if (!live) return null;
    var v = p.current, kids = [];
    var w = THEME.focusSize || 168, h = THEME.focusSize ? focusHeight() : 168;
    var left = 172 + (THEME.rowX || 0) + (THEME.focusX || 0), top = 126 + (THEME.rowOffsetY || 0) + (THEME.focusY || 0);
    var ip = function (inR, outR) { return v.interpolate({ inputRange: inR, outputRange: outR, extrapolate: 'clamp' }); };
    if (fx.text) {
      var tpx = fontSize(28) || 28;
      kids.push(React.createElement(A.View, { key: 'label', style: {
        position: 'absolute', left: left - 300, top: top - tpx - 40, width: w + 600, alignItems: 'center',
        opacity: ip([0, 0.07, 0.9, 1], [0, 1, 1, 0]), transform: [{ translateY: ip([0, 0.07], [-14, 0]) }] } },
        React.createElement(rn.View, { style: { paddingLeft: 20, paddingRight: 20, paddingTop: 6, paddingBottom: 6,
                                                borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.65)' } },
          React.createElement(rn.Text, { style: { fontSize: tpx, color: '#ffffff' } }, fx.text))));
    }
    if (!T.done['favourites message ready']) done('favourites message ready');
    return React.createElement(rn.View, { pointerEvents: 'none', style: ZT_SCREEN }, kids);
  }
  /* animToast: the folder menu's message. A change that reloads the
     Home goes over as data 'zt-toast' (like zt-select) and the new Home shows
     it. */
  function folderToast(text) {
    return THEME.animToast ? { text: text } : null;
  }
  function toastData(key, text) {
    if (key !== 'zt-toast') return false;
    try {
      var s = JSON.parse(String(text));
      if (s && s.t && s.t !== T.sentToast && Date.now() - s.t < 15000 && T.toastSeen !== s.t) {
        T.toastSeen = s.t;
        console.log('THEME-DATA zt-toast done');
        setTimeout(function () { showToast(s.text); }, 900);
      }
    } catch (e) {}
    return true;
  }

  /* animInfo: play info / Home trophies come in when the game changes */
  function infoAnim(key, k, child) {
    return THEME.animInfo ? animWrap(key, k, { op: 0, y: 12 }, 260, child) : child;
  }

  /* animButtons: a footer / tab group / icon button bounces when that
     button does something (pulseButton('x' | 'options' | 'l1' | 'r1')) */
  var buttonListeners = [];
  function pulseButton(name) {
    if (APP !== 'home' || !THEME.animButtons) return;
    T.btnPulse = { name: name, n: ((T.btnPulse && T.btnPulse.n) || 0) + 1 };
    setTimeout(function () { buttonListeners.forEach(function (f) { try { f(); } catch (e) {} }); }, 0);
  }
  function BtnPulse(props) {
    var React = T.React, A = T.rn.Animated;
    var tick = React.useState(0)[1];
    var s = React.useRef(null);
    if (!s.current) s.current = { v: new A.Value(1), n: T.btnPulse ? T.btnPulse.n : 0 };
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      buttonListeners.push(f);
      return function () {
        var i = buttonListeners.indexOf(f);
        if (i >= 0) buttonListeners.splice(i, 1);
      };
    }, []);
    var bp = T.btnPulse, mine = bp && bp.n !== s.current.n && bp.name === props.btn;
    var n = bp ? bp.n : 0;
    React.useEffect(function () {
      var st = s.current;
      if (!bp || bp.n === st.n) return;
      st.n = bp.n;
      if (!mine) return;
      try {
        A.timing(st.v, { toValue: 1.25, duration: 90, useNativeDriver: true, easing: easeOut, isInteraction: false })
          .start(function () {
            A.timing(st.v, { toValue: 1, duration: 220, useNativeDriver: true, easing: easeOut, isInteraction: false }).start();
          });
      } catch (e) { try { st.v.setValue(1); } catch (e2) {} }
    }, [n]);
    return React.createElement(A.View, { style: { transform: [{ scale: s.current.v }] } }, props.children);
  }
  function pulseWrap(key, btn, el) {
    if (!THEME.animButtons || !el || typeof btn !== 'string' || !btn || !canAnimate() ||
        typeof T.React.useState !== 'function')
      return el;
    return T.React.createElement(BtnPulse, { key: key, btn: btn.trim().toLowerCase() }, el);
  }

  /* animFolderClose: the strip's last drawing, dropping out and fading
     (ZtExit), for 130 ms after the folder closed (twice as fast) */
  function ZtExit(props) {
    var React = T.React, A = T.rn.Animated;
    var r = React.useRef(null);
    if (!r.current) r.current = new A.Value(0);
    React.useEffect(function () {
      var a = null;
      try {
        a = A.timing(r.current, { toValue: 1, duration: 110, useNativeDriver: true, easing: easeOut, isInteraction: false });
        a.start();
      } catch (e) {}
      return function () { try { if (a) a.stop(); } catch (e) {} };
    }, []);
    var v = r.current;
    return React.createElement(A.View, { pointerEvents: 'none', style: [ZT_SCREEN, {
      opacity: v.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
      transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, 24] }) }] }] }, props.children);
  }

  /* animTitleGlow: a copy of the fake title in the glow colour, over it,
     that lights up and goes out every animTitleGlowSec seconds */
  function TitleGlow(props) {
    var React = T.React, A = T.rn.Animated;
    var r = React.useRef(null);
    if (!r.current) r.current = new A.Value(0);
    React.useEffect(function () {
      var alive = true, timer = null, v = r.current;
      var wait = (THEME.animTitleGlowSec > 0 ? THEME.animTitleGlowSec : 6) * 1000;
      var cycle = function () {
        if (!alive) return;
        try {
          A.timing(v, { toValue: 1, duration: 450, useNativeDriver: true, easing: easeOut, isInteraction: false })
            .start(function () {
              if (!alive) return;
              A.timing(v, { toValue: 0, duration: 900, useNativeDriver: true, easing: easeOut, isInteraction: false })
                .start(function () { if (alive) timer = setTimeout(cycle, wait); });
            });
        } catch (e) {}
      };
      timer = setTimeout(cycle, 1200);
      return function () { alive = false; if (timer) clearTimeout(timer); };
    }, []);
    return React.createElement(A.View, { pointerEvents: 'none', style: [ZT_SCREEN, {
      opacity: r.current.interpolate({ inputRange: [0, 1], outputRange: [0, 0.75] }) }] }, props.children);
  }

  function fakeTitlePos() {
    if (!oldTitles()) return [Number(THEME.fakeTitleX) || 0, Number(THEME.fakeTitleY) || 0];
    if (!THEME.nameCopy) return [Number(THEME.homeTitleX) || 0, Number(THEME.homeTitleY) || 0];
    var o = T.oldCopyOrigin;
    return o ? [o[0] + (THEME.nameCopyX || 0), o[1] + (THEME.nameCopyY || 0)] : null;
  }
  function fakeTitleElement(text, left, top, glow) {
    var React = T.React, rn = T.rn;
    var create = function (t, p, k) {
      var q = {};
      for (var x in p) q[x] = p[x];
      if (k) q.key = k;
      return React.createElement(t, q);
    };
    /* sharp up to the largest size of the table: Size5X (the largest, which
       the other theme fonts do not use); above that it scales (less sharp) */
    var want = THEME.nameCopyFontSize || 54;
    var t5 = rn.FontSizePS && rn.FontSizePS.Size5X;
    var px = t5 && want >= (t5 + 72) / 2 ? t5 : fontSize(Math.min(want, 72));
    var width = THEME.nameCopyWidth || 1200, sh = shadowPx('nameCopyShadow');
    var measured = THEME.measureScreen || oldTitles();
    var textStyle = { color: THEME.nameCopyColor || '#ffffff' };
    if (THEME.nameCopyFontStyle) merge(textStyle, fontStyle(THEME.nameCopyFontStyle));
    if (px) textStyle.fontSize = px;
    var bg = nameCopyBg(create, rn), k = px && want > px * 1.05 ? want / px : 1;
    /* the glow copy: only the letters, where they are inside the box */
    if (glow) {
      textStyle.color = glow.color;
      sh = 0;
      measured = false;
      if (bg) { left += bg.pad; top += bg.padV; width -= 2 * bg.pad; bg = null; }
    }
    /* the PS5 scales from the centre of the box (transformOrigin is
       ignored: the name showed up to (k−1)·width/2 left of fakeTitleX, 200 px
       for 96 px in 1200): translated back so its top left corner stays at
       fakeTitleX/Y, as the editor draws it. Old themes keep the old place. */
    var scale = null;
    if (k !== 1) {
      var bh = Math.round(px * 1.11) + (bg ? 2 * bg.padV : 0);
      scale = oldTitles() ? [{ scale: k }]
            : [{ translateX: width * (k - 1) / 2 }, { translateY: bh * (k - 1) / 2 }, { scale: k }];
      if (!T.done['fake title scale']) done('fake title scale ' + k.toFixed(3) + ' (font ' + px + ')');
    }
    var box = { pointerEvents: 'none', style: { position: 'absolute', left: left, top: top, width: width } };
    if (scale) { box.style.transform = scale; box.style.transformOrigin = 'left'; }
    if (bg) {
      box.style.flexDirection = 'row';
      box.style.alignItems = 'flex-start';
      box.style.justifyContent = align(THEME.nameCopyAlign, true) || 'flex-start';
    }
    if (THEME.nameCopyScroll && canScroll()) {
      /* room for the shadow below the text (it is shifted down) */
      var clipPad = sh > 0 ? Math.max(1, Math.round(sh / 2)) : 0;
      if (!bg) {
        box.style.overflow = 'hidden';
        if (clipPad) box.style.paddingBottom = clipPad;
      }
      if (measured) withMeasure('fakeTitle', box);
      return create(NameScroll, { text: text, box: box, bg: !!bg, clipPad: clipPad,
                                  width: width - (bg ? 2 * bg.pad : 0), textStyle: textStyle, shadow: sh,
                                  justify: align(THEME.nameCopyAlign, true) }, 'theme-fake-scroll');
    }
    var tStyle = merge({ textAlign: align(THEME.nameCopyAlign) || 'left' }, textStyle);
    if (bg) {
      var tProps = { style: tStyle, children: text };
      if (!THEME.nameCopyWrap) tProps.numberOfLines = 1;
      var inner = [bg.el];
      var shProps = { style: [tStyle, { position: 'absolute', left: bg.pad, right: bg.pad, top: bg.padV }],
                      children: text };
      if (tProps.numberOfLines) shProps.numberOfLines = 1;
      var bgShadow = shadowOf(create, rn.Text, shProps, 'theme-fake-shadow', sh);
      if (bgShadow) inner.push(bgShadow);
      inner.push(create(rn.Text, tProps, 'theme-fake-text'));
      if (measured) withMeasure('fakeTitle', box);
      box.children = create(rn.View, { style: bg.style, children: inner }, 'theme-fake-in');
      return create(rn.View, box, 'theme-fake-box');
    }
    var copyStyle = merge({ position: 'absolute', left: left, top: top, width: width }, tStyle);
    if (scale) { copyStyle.transform = scale; copyStyle.transformOrigin = 'left'; }
    var copyProps = { style: copyStyle, children: text };
    /* nameCopyWrap: no line limit, a long name goes on below */
    if (!THEME.nameCopyWrap) copyProps.numberOfLines = 1;
    var shadow = shadowOf(create, rn.Text, copyProps, 'theme-fake-shadow', sh);
    if (measured) withMeasure('fakeTitle', copyProps);
    var copy = create(rn.Text, copyProps, 'theme-fake-text');
    return shadow ? create(rn.View, { pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0 },
                                      children: [shadow, copy] }, 'theme-fake-box')
                  : copy;
  }
  function FakeTitle() {
    var React = T.React;
    var tick = React.useState(0)[1];
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      nameListeners.push(f);
      folderListeners.push(f);
      logoListeners.push(f);
      favEmptyListeners.push(f);
      return function () {
        [nameListeners, folderListeners, logoListeners, favEmptyListeners].forEach(function (list) {
          var i = list.indexOf(f);
          if (i >= 0) list.splice(i, 1);
        });
      };
    }, []);
    /* like the tile title: the open folder's highlighted game, the selected
       folder's name, else the row's selected tile */
    var g = stripGame(), f = !g && T.folderSel && T.folders && T.folders[T.folderSel];
    var text = g ? g.game.name : f && f.name ? f.name : T.gameName, pos = fakeTitlePos();
    if (!text || !pos) return null;
    if (favEmptyNow()) return null;
    /* a game with a logo shows the logo instead (logoHidesTitle) */
    if (THEME.logoHidesTitle !== false && logoShown()) return null;
    if (!T.done['fake title']) done('fake title at ' + pos.join(',') + (oldTitles() ? ' (old fields)' : ''));
    var el = fakeTitleElement(text, pos[0], pos[1]);
    /* animTitleGlow: a copy in the glow colour over it, lighting up */
    if (THEME.animTitleGlow && !THEME.nameCopyScroll && canAnimate() && typeof T.React.useState === 'function')
      el = T.React.createElement(T.rn.View, { pointerEvents: 'none', style: ZT_SCREEN },
        el, T.React.createElement(TitleGlow, { key: 'theme-title-glow' },
          fakeTitleElement(text, pos[0], pos[1], { color: THEME.animTitleGlowColor || '#ffffff' })));
    /* a new name comes in with animNamesStyle */
    return nameAnim('theme-fake-anim', text, el);
  }

  /* ---- debug panel (Experimental, debugOverlay) ----
     Like the fake title, drawn by the Home in its front layer at its own
     place (debugX/Y). About once a second the Home prints "THEME-STATS";
     ZhiThemes answers with __ztStats(json) (zt_stats.cpp: ShellUI fps,
     console RAM/VRAM, ShellUI free memory, mono heap, CPU use, CPU/SoC
     temperature, fan, uptime, injections into this ShellUI). A number the
     console does not give is left out. */
  var statsListeners = [];
  if (APP === 'home' && THEME.debugOverlay) {
    globalThis.__ztStats = function (text) {
      try { T.stats = JSON.parse(String(text)); } catch (e) { return; }
      if (!T.done['debug stats']) done('debug stats: ' + String(text).slice(0, 200));
      statsListeners.forEach(function (f) { try { f(); } catch (e) {} });
    };
    setInterval(function () {
      try {
        var AS = T.rn && T.rn.AppState;
        if (AS && /background/i.test(String(AS.currentState || ''))) return;
        console.log('THEME-STATS');
      } catch (e) {}
    }, 1000);
  }
  function debugTime(s) {
    s = Math.max(0, Math.floor(s));
    var h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, sec = s % 60;
    return ((h ? h + 'h ' : '') + (h || m ? m + 'm ' : '') + (h ? '' : sec + 's')).trim();
  }
  /* the panel's lines, [label, value] (pure: the harness checks it) */
  function debugLines(st) {
    st = st || {};
    var out = [], num = function (v) { return typeof v === 'number' && isFinite(v); };
    var items = String(THEME.debugItems || 'fps ram vram shell mono cpu temp fan up loads videos').split(/[\s,;]+/);
    items.forEach(function (it) {
      switch (it.toLowerCase()) {
        case 'fps': if (num(st.fps)) out.push(['FPS', st.fps.toFixed(1)]); break;
        case 'ram': if (num(st.ramUsed)) out.push(['RAM', st.ramUsed + ' / ' + st.ramTotal + ' MB']); break;
        case 'vram': if (num(st.vramUsed)) out.push(['VRAM', st.vramUsed + ' / ' + st.vramTotal + ' MB']); break;
        case 'shell': if (num(st.shellFree)) out.push(['ShellUI free', st.shellFree.toFixed(1) + ' MB']); break;
        case 'mono':
          if (num(st.monoUsed) || num(st.monoHeap))
            out.push(['Mono', (num(st.monoUsed) ? st.monoUsed.toFixed(1) : '?') + ' / ' +
                              (num(st.monoHeap) ? st.monoHeap.toFixed(1) : '?') + ' MB']);
          break;
        case 'cpu': if (num(st.cpu)) out.push(['CPU', st.cpu + ' %']); break;
        case 'temp':
          if (num(st.cpuT)) out.push(['CPU temp', st.cpuT + ' °C']);
          if (num(st.socT)) out.push(['SoC temp', st.socT + ' °C']);
          break;
        case 'fan': if (num(st.fan)) out.push(['Fan', st.fan + ' %']); break;
        case 'up':
          if (num(st.up)) out.push(['Uptime', debugTime(st.up)]);
          if (num(st.mod)) out.push(['Theme up', debugTime(st.mod)]);
          break;
        case 'loads': if (num(st.loads) && st.loads > 0) out.push(['Loads', st.loads + (st.loads >= 4 ? ' (restart soon)' : '')]); break;
        case 'videos': out.push(['Videos', String(T.animLive || 0)]); break;
        case 'errors': out.push(['JS errors', String(T.errors || 0)]); break;
      }
    });
    if (!out.length) out.push(['Debug', T.stats ? 'nothing to show' : 'waiting...']);
    return out;
  }
  T.debugLines = debugLines;
  function DebugPanel() {
    var React = T.React, rn = T.rn;
    var tick = React.useState(0)[1];
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      statsListeners.push(f);
      return function () {
        var i = statsListeners.indexOf(f);
        if (i >= 0) statsListeners.splice(i, 1);
      };
    }, []);
    var lines = debugLines(T.stats), size = fontSize(THEME.debugFontSize || 24);
    var text = { color: THEME.debugColor || '#ffffff' };
    if (size) text.fontSize = size;
    var a = Math.max(0, Math.min(1, THEME.debugBgOpacity == null ? 0.55 : +THEME.debugBgOpacity || 0));
    var box = { position: 'absolute', left: Number(THEME.debugX) || 0, top: Number(THEME.debugY) || 0,
                paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, borderRadius: 12,
                backgroundColor: 'rgba(0,0,0,' + a + ')' };
    var kids = THEME.debugRow
      ? [React.createElement(rn.Text, { key: 'r', numberOfLines: 1, style: text,
                                         children: lines.map(function (l) { return l[0] + ' ' + l[1]; }).join('   ') })]
      : lines.map(function (l, i) {
          return React.createElement(rn.Text, { key: 'l' + i, numberOfLines: 1, style: text, children: l[0] + ': ' + l[1] });
        });
    if (!T.done['debug panel']) done('debug panel at ' + box.left + ',' + box.top);
    return React.createElement(rn.View, { pointerEvents: 'none', style: ZT_SCREEN },
      React.createElement(rn.View, { style: box }, kids));
  }

  /* a selected folder hides its hub page (and with it the game title):
     with the fake title off, the folder's name is drawn where the game title
     goes (folderTitleX/Y; old themes: homeTitleX/Y) while its games are not
     shown */
  function FolderTitle() {
    var React = T.React, rn = T.rn;
    var tick = React.useState(0)[1];
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      folderListeners.push(f);
      return function () {
        var i = folderListeners.indexOf(f);
        if (i >= 0) folderListeners.splice(i, 1);
      };
    }, []);
    var f = T.folderSel && T.folders[T.folderSel];
    if (!f || !f.name || stripShown()) return null;
    var old = oldTitles();
    var px = (old ? THEME.homeTitleFontSize : THEME.folderTitleSize) || 72, base = fontSize(Math.min(px, 72)) || 0;
    var text = { color: (old ? THEME.homeTitleColor : THEME.folderTitleColor) || '#ffffff' };
    if (base) text.fontSize = base;
    var box = { position: 'absolute', left: old ? THEME.homeTitleX : THEME.folderTitleX,
                top: old ? THEME.homeTitleY : THEME.folderTitleY, width: 1600 };
    if (base && px > base) {
      /* bigger than the table: scales from the top left corner */
      var k = px / base;
      box.transform = [{ translateX: 800 * (k - 1) }, { translateY: base * 0.7 * (k - 1) }, { scale: k }];
    }
    if (!T.done['folder title']) done('folder title');
    return nameAnim('theme-folder-title-anim', f.name, React.createElement(rn.View, { pointerEvents: 'none', style: box },
        withShadow(React, rn, 'ft', text, f.name, shadowPx('homeTitleShadow'))));
  }

  /* ---- video wallpaper: the system's own RN video view (RCTVideoPS =
     ReactNative.PUI ReactVideoView, the one the game hub uses for trailers).
     Native props: source {source: uri, autoLoad}, paused (true by default),
     repeat, muted, volume, resizeMode, suppressBgm. Paused while the Home is
     in the background (a game in front) and taken out after 20 s there, so
     the decoder is free for the game. ---- */
  function videoComponent() {
    if (T.videoComp !== undefined) return T.videoComp;
    var rn = T.rn, c = null, how = 'none';
    try { if (rn.VideoPS) { c = rn.VideoPS; how = 'VideoPS'; } } catch (e) {}
    if (!c && typeof rn.requireNativeComponent === 'function')
      try { c = rn.requireNativeComponent('RCTVideoPS'); how = 'requireNativeComponent(RCTVideoPS)'; }
      catch (e) { log('video: ' + e); }
    T.videoComp = c;
    log('video: component ' + how);
    try {
      var um = rn.UIManager, cfg = um && (um.getViewManagerConfig ? um.getViewManagerConfig('RCTVideoPS') : um.RCTVideoPS);
      if (cfg) log('video: commands ' + JSON.stringify(cfg.Commands || {}).slice(0, 200));
    } catch (e) {}
    return c;
  }
  function videoEvent(name, e) {
    T.videoLogs = (T.videoLogs || 0) + 1;
    if (T.videoLogs > 40) return;
    var ev = e && e.nativeEvent ? e.nativeEvent : e;
    var text = '';
    try { text = ev == null ? '' : JSON.stringify(ev); } catch (x) { text = String(ev); }
    log('video: ' + name + ' ' + text.slice(0, 200));
  }
  function VideoWallpaper(props) {
    var React = T.React, rn = T.rn, Video = videoComponent();
    /* also behind Settings and Trophies (props.uri, props.sound) */
    var own = props && props.uri;
    var AS = rn.AppState;
    var away = function (s) { return /background/i.test(String(s || '')); };
    var st = React.useState(!away(AS && AS.currentState)), active = st[0], setActive = st[1];
    var gone = React.useState(false), released = gone[0], setReleased = gone[1];
    /* decoder size asked to the player: the hub passes 'fullHD' ('UHD' for
       4K trailers); without one a 4K file gave Error_SrcNotSupported.
       On an error the next one is tried. */
    var tries = React.useState(0), attempt = tries[0], setAttempt = tries[1];
    /* fullHD first (a 4K file errors and goes on to UHD): asking UHD
       made the PS5 show "Stopping Features: <game>" after a game */
    var kinds = ['fullHD', 'UHD', ''];
    /* every kind failed (the decoder still busy just after a game):
       tried again later instead of never again */
    var rounds = React.useState(0), round = rounds[0], setRound = rounds[1];
    /* 'end' despite repeat (it stalled while another player held the
       decoder): the view is made again */
    var restarts = React.useState(0), restart = restarts[0], setRestart = restarts[1];
    React.useEffect(function () {
      if (!AS || typeof AS.addEventListener !== 'function') return undefined;
      var timer = null;
      var onChange = function (s) {
        T.videoStates = (T.videoStates || 0) + 1;
        if (T.videoStates <= 20) log('video: app state ' + s);
        clearTimeout(timer);
        if (!away(s)) { setActive(true); setReleased(false); setAttempt(0); setRound(0); return; }
        setActive(false);
        timer = setTimeout(function () { setReleased(true); log('video: released (Home in the background)'); }, 20000);
      };
      var sub = AS.addEventListener('change', onChange);
      return function () {
        clearTimeout(timer);
        try { if (sub && sub.remove) sub.remove(); else AS.removeEventListener('change', onChange); } catch (e) {}
      };
    }, []);
    var uri = own ? props.uri : videoUri();
    React.useEffect(function () {
      if (attempt < kinds.length || round >= 5 || !active) return undefined;
      var t = setTimeout(function () { log('video: trying again (round ' + (round + 2) + ')'); setAttempt(0); setRound(round + 1); }, 4000);
      return function () { clearTimeout(t); };
    }, [attempt, round, active]);
    if (!Video || !uri || released || attempt >= kinds.length) return null;
    var kind = kinds[attempt];
    if (T.videoUriLogged !== uri + kind) { T.videoUriLogged = uri + kind; log('video: wallpaper ' + uri + ' (' + (kind || 'no resource type') + ')'); }
    /* the Home music (Sounds tab) wins over the wallpaper's own sound */
    var sound = own ? !!props.sound : !!THEME.wallpaperVideoSound && !homeMusicFile();
    var vol = THEME.wallpaperVideoVolume == null ? 0.5 : Math.max(0, Math.min(1, +THEME.wallpaperVideoVolume || 0));
    var source = { source: uri, autoLoad: true };
    if (kind) source.coreResourceType = kind;
    return React.createElement(Video, {
      key: 'v' + round + '-' + attempt + '-' + restart,
      pointerEvents: 'none',
      source: source,
      repeat: true, paused: !active, muted: !sound, volume: sound ? vol : 0,
      suppressBgm: sound, resizeMode: 'cover',
      onLoad: function (e) { videoEvent('load', e); if (!T.done['video wallpaper']) done('video wallpaper'); },
      onStartPlaying: function (e) { videoEvent('playing', e); },
      onError: function (e) {
        videoEvent('error', e);
        if (attempt + 1 < kinds.length) log('video: trying ' + (kinds[attempt + 1] || 'no resource type'));
        else log(round < 5 ? 'video: no resource type worked; again in 4 s' : 'video: no resource type worked; the file itself is not supported (try H.264 1080p)');
        setAttempt(attempt + 1);
      },
      onPlaybackStalled: function (e) { videoEvent('stalled', e); },
      onEnd: function (e) {
        videoEvent('end', e);
        if (restart < 50) setTimeout(function () { setRestart(restart + 1); }, 300);
      },
      style: { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }
    });
  }

  /* ---- vignette, edges and particles (AniketosHEN has them as
     native layers; here plain views) ---- */
  function fadeStrips(out, key, from, height, top, amount, n) {
    /* top = darkest at the top edge; otherwise darkest at the bottom edge */
    var rn = T.rn, h = Math.ceil(height / n);
    for (var i = 0; i < n; i++) {
      var t = (i + 1) / n, a = amount * t * t * (3 - 2 * t);
      out.push(T.React.createElement(rn.View, {
        key: key + i, pointerEvents: 'none',
        style: { position: 'absolute', left: 0, width: 1920, height: h,
                 top: top ? from + (n - 1 - i) * h : from + i * h, backgroundColor: '#000000', opacity: a }
      }));
    }
  }
  function vignetteElements(out) {
    var v = Math.max(0, Math.min(1, +THEME.bgVignette || 0));
    if (!(v > 0)) return;
    /* rings from the screen edge inwards, darker towards the edge (they do
       not overlap, so the alpha of each ring is what shows) */
    var size = Math.max(40, Math.min(540, +THEME.bgVignetteSize || 360)), n = 24, t = size / n;
    for (var i = 0; i < n; i++) {
      var k = 1 - i / n, inset = i * t;
      out.push(T.React.createElement(T.rn.View, {
        key: 'theme-vig' + i, pointerEvents: 'none',
        style: { position: 'absolute', left: inset, top: inset, width: 1920 - 2 * inset, height: 1080 - 2 * inset,
                 borderWidth: Math.ceil(t), borderColor: 'rgba(0,0,0,' + (v * k * k).toFixed(3) + ')' }
      }));
    }
    if (!T.done.vignette) done('vignette');
  }
  function edgeElements(out) {
    var e = Math.max(0, Math.min(1, +THEME.bgEdges || 0));
    if (!(e > 0)) return;
    var h = Math.max(40, Math.min(540, +THEME.bgEdgesHeight || 260));
    fadeStrips(out, 'theme-edge-top', 0, h, true, e, 20);
    fadeStrips(out, 'theme-edge-bottom', 1080 - h, h, false, e, 20);
    if (!T.done.edges) done('edges');
  }
  function particleUri() {
    var n = THEME.particlesImage;
    if (typeof n !== 'string' || !n) return null;
    return 'file://' + (n.charAt(0) === '/' ? n : ztPath('icons', n));
  }
  /* rising from the lower part of the screen in a wide fan; near ones big,
     bright and fast, far ones small, dim and slow; each fades in and out.
     One Animated.Value per particle, native driver, loop. */
  function Particles() {
    var React = T.React, rn = T.rn, A = rn.Animated;
    var ref = React.useRef(null);
    if (!ref.current) {
      var count = Math.max(1, Math.min(120, Math.round(+THEME.particlesCount || 40)));
      var speed = THEME.particlesSpeed > 0 ? +THEME.particlesSpeed : 1;
      /* the theme's animationSpeed scales every timing (hookTiming): undone here */
      var undo = A.timing && A.timing.__theme && THEME.animationSpeed > 0 ? +THEME.animationSpeed : 1;
      var seed = 7;
      var rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
      var list = [];
      for (var i = 0; i < count; i++) {
        var depth = 0.35 + 0.65 * rnd();
        var x = 1920 * (0.5 + (rnd() - 0.5) * 1.1);
        list.push({
          v: new A.Value(0), depth: depth,
          x: x, drift: (x - 960) * 0.25 * rnd(), sway: 10 + 30 * rnd(),
          start: 1080 - 260 * rnd(), rise: 500 + 600 * depth,
          size: Math.max(1, (+THEME.particlesSize || 6) * depth),
          ms: (9000 + 9000 * rnd()) / (0.6 + 0.6 * depth) / speed * undo,
          delay: 12000 * rnd() / speed
        });
      }
      ref.current = list;
    }
    React.useEffect(function () {
      var anims = [], timers = [];
      ref.current.forEach(function (p) {
        var anim = A.loop(A.timing(p.v, { toValue: 1, duration: p.ms, easing: function (t) { return t; },
                                          useNativeDriver: true, isInteraction: false }));
        anims.push(anim);
        timers.push(setTimeout(function () { anim.start(); }, p.delay));
      });
      if (!T.done.particles) done('particles (' + ref.current.length + ')');
      return function () {
        timers.forEach(clearTimeout);
        anims.forEach(function (a) { try { a.stop(); } catch (e) {} });
      };
    }, []);
    /* built once: a new render made new interpolations for every particle */
    if (ref.el) return ref.el;
    var colour = THEME.particlesColor || '#ffffff';
    var peak = Math.max(0, Math.min(1, THEME.particlesOpacity == null ? 0.7 : +THEME.particlesOpacity));
    var img = particleUri();
    return ref.el = React.createElement(rn.View, {
      pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }
    }, ref.current.map(function (p, i) {
      var st = {
        position: 'absolute', left: p.x, top: p.start, width: p.size, height: p.size,
        opacity: p.v.interpolate({ inputRange: [0, 0.15, 0.75, 1], outputRange: [0, peak * p.depth, peak * p.depth * 0.8, 0] }),
        transform: [
          { translateY: p.v.interpolate({ inputRange: [0, 1], outputRange: [0, -p.rise] }) },
          { translateX: p.v.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1],
                                          outputRange: [0, p.drift * 0.25 + p.sway, p.drift * 0.5, p.drift * 0.75 - p.sway, p.drift] }) }
        ]
      };
      if (img && A.Image) return React.createElement(A.Image, { key: 'p' + i, source: { uri: img }, fadeDuration: 0, style: st });
      st.borderRadius = p.size / 2;
      st.backgroundColor = colour;
      return React.createElement(A.View, { key: 'p' + i, style: st });
    }));
  }

  /* ---- built-in particle styles. The 23 styles of AniketosHEN
     (GPL-3, source/shellui/src/aniketos_shell/home/particle_presets and
     particle_sim.cpp, textures in assets/particles/builtin), there a native
     simulation stepped every frame; here each particle's whole life is worked
     out once as a path (points of an interpolation) and played by one
     Animated.Value on the native driver, so the JS thread does nothing per
     frame. Each new life starts somewhere else along the style's edge or box
     (two offsets set between lives). Textures: written by the C++ into
     Assets/particles/<name>.png. Not here: additive light (glows only add
     up natively); coloured textures are not tinted (RN tintColor paints the
     whole picture one colour). Layer fields: sh share, t textures, c colours,
     a area (0 screen, 1 top, 2 bottom, 3 left, 4 right, 5 box x0 y0 x1 y1),
     d direction (degrees, 0 right, 90 down) sp spread, v0 v1 speed px/s,
     gx gy gravity, sw sf sway px/s Hz, s0 s1 size, o0 o1 opacity, tw tf
     twinkle, l0 l1 life s, fi fo fade s, r0 r1 spin degrees/s, rk rock,
     dp depth power, al turned along its motion ---- */
  var PARTICLE_STYLES = {
    snowfall: [{'sh':0.72,'t':['dot'],'c':['#ffffff','#eef5ff','#dde9ff'],'a':1,'d':84,'sp':8,'v0':40,'v1':75,'sw':14,'sf':0.3,'s0':5,'s1':14,'o0':0.5,'o1':0.95,'l0':70,'l1':90,'fi':1,'dp':1.6}, {'sh':0.14,'t':['a_crystal'],'c':['#ffffff','#e6f1ff'],'a':1,'d':84,'sp':8,'v0':35,'v1':60,'sw':22,'sf':0.22,'s0':14,'s1':34,'o0':0.5,'o1':0.9,'l0':70,'l1':90,'fi':1,'r0':10,'r1':40,'dp':1.2}, {'sh':0.14,'t':['soft_dot'],'c':['#ffffff','#e8f0ff'],'a':1,'d':84,'sp':10,'v0':80,'v1':130,'sw':30,'sf':0.15,'s0':30,'s1':70,'o0':0.22,'o1':0.45,'l0':30,'l1':40,'fi':1,'dp':0.7}],
    sakura: [{'sh':0.62,'t':['a_petal'],'c':['#ffb7cc','#ff9fbd','#ffd2e0','#f790b0','#ffe4ec'],'a':1,'d':42,'sp':12,'v0':70,'v1':130,'sw':40,'sf':0.35,'s0':9,'s1':36,'o0':0.55,'o1':0.95,'l0':40,'l1':60,'fi':1,'r0':40,'r1':160,'dp':1.8}, {'sh':0.38,'t':['a_petal'],'c':['#ffb7cc','#ff9fbd','#ffd2e0','#f790b0','#ffe4ec'],'a':3,'d':42,'sp':12,'v0':70,'v1':130,'sw':40,'sf':0.35,'s0':9,'s1':36,'o0':0.55,'o1':0.95,'l0':40,'l1':60,'fi':1,'r0':40,'r1':160,'dp':1.8}],
    autumn_leaves: [{'sh':0.74,'t':['a_maple','a_leaf'],'c':['#e8590c','#d63a1c','#f2a33a','#9c4a1a','#c77d1e','#b5301f'],'a':1,'d':104,'sp':14,'v0':45,'v1':90,'sw':60,'sf':0.25,'s0':18,'s1':56,'o0':0.6,'o1':1,'l0':50,'l1':70,'fi':1,'r0':30,'r1':110,'dp':2}, {'sh':0.14,'t':['a_maple','a_leaf'],'c':['#e8590c','#d63a1c','#f2a33a','#9c4a1a','#c77d1e','#b5301f'],'a':4,'d':104,'sp':14,'v0':45,'v1':90,'sw':60,'sf':0.25,'s0':18,'s1':56,'o0':0.6,'o1':1,'l0':50,'l1':70,'fi':1,'r0':30,'r1':110,'dp':2}, {'sh':0.12,'t':['a_maple','a_leaf'],'c':['#e8590c','#f2a33a','#c77d1e','#d63a1c'],'a':4,'d':168,'sp':8,'v0':160,'v1':240,'gy':4,'sw':40,'sf':0.4,'s0':18,'s1':40,'o0':0.6,'o1':1,'l0':20,'l1':30,'fi':0.5,'fo':1,'r0':120,'r1':260,'dp':1.2}],
    fireflies: [{'sh':0.85,'t':['a_firefly'],'c':['#ffffff','#fff6c8','#e2ffd0'],'a':5,'y0':0.4,'d':-90,'sp':70,'v0':6,'v1':18,'sw':22,'sf':0.18,'s0':28,'s1':72,'o0':0.7,'o1':1,'tw':0.95,'tf':0.3,'fo':3}, {'sh':0.15,'t':['soft_dot'],'c':['#d8ff7a','#fff07a'],'a':5,'y0':0.45,'d':-90,'sp':70,'v0':10,'v1':24,'sw':30,'sf':0.12,'s0':50,'s1':90,'o1':0.38,'tw':0.9,'tf':0.2,'l1':18,'fi':3,'fo':3,'dp':1}],
    rain: [{'sh':0.76,'t':['a_rain'],'c':['#cfe2ff','#b9d3f5','#e8f1ff'],'a':1,'d':76,'sp':1.5,'v0':900,'v1':1400,'s0':50,'s1':110,'o0':0.18,'o1':0.42,'l0':3,'l1':3.5,'fi':0.12,'fo':0.2}, {'sh':0.11,'t':['a_rain'],'c':['#cfe2ff','#b9d3f5','#e8f1ff'],'a':3,'d':76,'sp':1.5,'v0':900,'v1':1400,'s0':50,'s1':110,'o0':0.18,'o1':0.42,'l0':3,'l1':3.5,'fi':0.12,'fo':0.2}, {'sh':0.13,'t':['a_rain'],'c':['#ffffff','#e0ecff'],'d':76,'sp':1.5,'v0':1600,'v1':2000,'s0':110,'s1':170,'o0':0.35,'o1':0.55,'l0':0.3,'l1':0.6,'fi':0.08,'fo':0.15,'dp':1}],
    bokeh: [{'sh':0.42,'t':['b_bokeh'],'c':['#ffb47a','#ff8fb8','#ffd88a','#8ab8ff','#b39cff','#8affdc'],'d':-70,'sp':70,'v0':3,'v1':9,'sw':4,'sf':0.08,'s0':50,'s1':160,'o0':0.09,'o1':0.24,'l0':16,'l1':30,'fi':4,'fo':5,'dp':1.4}, {'sh':0.13,'t':['b_bokeh'],'c':['#ffb47a','#ff8fb8','#ffd88a','#8ab8ff','#b39cff','#8affdc'],'d':-70,'sp':70,'v0':2,'v1':5,'sw':3,'sf':0.06,'s0':240,'s1':440,'o0':0.035,'o1':0.08,'l0':20,'l1':36,'fi':6,'fo':6,'dp':1}, {'sh':0.45,'t':['b_bokeh'],'c':['#ffc89a','#ffa8cc','#ffe4a8','#a8ccff','#c8b4ff','#a8ffe6'],'d':-70,'sp':70,'v0':4,'v1':12,'sw':5,'sf':0.1,'s0':12,'s1':36,'o1':0.5,'l0':12,'l1':24,'fi':3,'fo':4,'dp':1.2}],
    golden_dust: [{'sh':0.035,'t':['b_ray'],'c':['#ffd890','#ffe8b8','#ffc870'],'a':5,'x0':0.05,'y0':0.12,'x1':0.45,'y1':0.42,'d':52,'sp':9,'v0':4,'v1':10,'s0':900,'s1':1500,'o0':0.15,'o1':0.26,'fi':4,'fo':5,'dp':1,'al':1}, {'sh':0.76,'t':['soft_dot'],'c':['#ffc14d','#ffd56b','#ffe9a8','#ffb238','#fff3d0'],'a':5,'x1':0.4,'y1':0.02,'d':52,'sp':6,'v0':18,'v1':40,'sw':20,'sf':0.15,'s0':4,'s1':13,'o0':0.45,'o1':1,'l0':60,'l1':120,'fo':3}, {'sh':0.2,'t':['b_glint'],'c':['#fff1c4','#ffd98a','#ffffff'],'a':5,'x1':0.4,'y1':0.02,'d':52,'sp':6,'v0':18,'v1':40,'sw':20,'sf':0.15,'s0':18,'s1':48,'o0':0.6,'o1':1,'tw':0.95,'tf':0.45,'l0':60,'l1':120,'fo':3}],
    embers: [{'sh':0.12,'t':['soft_dot'],'c':['#ff5a14','#ff7a1e','#d8380c'],'a':5,'y0':0.9,'y1':1.02,'d':-90,'sp':30,'v0':10,'v1':25,'s0':240,'s1':460,'o0':0.16,'o1':0.3,'tw':0.3,'tf':0.4,'l0':6,'l1':12,'fi':3,'fo':3,'dp':1}, {'sh':0.5,'t':['b_ember'],'c':['#ffffff','#ffd8b0','#ffb080'],'a':2,'d':-90,'sp':18,'v0':70,'v1':170,'gx':6,'gy':-18,'sw':30,'sf':0.5,'s0':20,'s1':56,'o0':0.65,'o1':1,'tw':0.55,'tf':2.5,'l0':4,'l1':10,'fi':0.3,'dp':1.3,'al':1}, {'sh':0.38,'t':['soft_dot'],'c':['#ff7a26','#ff5418','#ffa040','#ff3b14'],'a':2,'d':-90,'sp':22,'v0':35,'v1':90,'gx':4,'gy':-8,'sw':45,'sf':0.3,'s0':10,'s1':30,'o0':0.45,'o1':1,'tw':0.5,'tf':1.2,'l0':6,'l1':14,'fi':0.5,'fo':3}],
    aurora: [{'sh':0.4,'t':['b_aurora'],'c':['#ffffff','#d8fff4','#f0e0ff'],'a':5,'x0':-0.12,'y0':0.06,'y1':0.34,'sp':4,'v0':6,'v1':16,'sw':10,'sf':0.07,'s0':240,'s1':560,'o0':0.16,'o1':0.38,'tw':0.45,'tf':0.12,'l0':14,'l1':26,'fi':5,'fo':5,'dp':1}, {'sh':0.15,'t':['soft_dot'],'c':['#2fe39a','#2bc8c8','#7a5cff'],'a':5,'x0':-0.12,'y0':0.08,'y1':0.3,'sp':4,'v1':12,'s0':280,'s1':560,'o0':0.04,'o1':0.1,'l0':18,'l1':30,'fi':6,'fo':6,'dp':1}, {'sh':0.45,'t':['soft_dot'],'c':['#7dffb2','#5ff0d8','#b48cff','#8cc8ff'],'a':5,'y0':0.04,'y1':0.44,'sp':10,'v0':12,'v1':32,'sw':28,'sf':0.12,'s0':5,'s1':14,'o0':0.4,'o1':0.95,'l0':12,'l1':24,'fi':3,'fo':3}],
    magic_sparkles: [{'sh':0.13,'t':['soft_dot'],'c':['#ff8ad8','#b07cff','#6fe0ff'],'d':-90,'v0':4,'v1':10,'sw':20,'sf':0.1,'s0':70,'s1':170,'o0':0.12,'o1':0.28,'tw':0.5,'tf':0.2,'l0':8,'l1':16,'fi':3,'fo':3,'dp':1}, {'sh':0.45,'t':['b_star','b_star','sparkle'],'c':['#ff8ad8','#c08cff','#7fe8ff','#ffffff','#ffb8f0'],'d':-90,'v0':6,'sw':50,'sf':0.15,'s0':24,'s1':72,'o0':0.6,'o1':1,'tw':0.85,'tf':0.5,'l0':4,'l1':9,'fi':0.6,'fo':1.5,'r0':25,'r1':70,'dp':1.3}, {'sh':0.42,'t':['soft_dot'],'c':['#ff9ce6','#c59cff','#8cf0ff','#ffffff'],'d':-90,'sp':60,'v0':8,'v1':24,'sw':20,'sf':0.25,'s0':5,'s1':14,'o0':0.5,'o1':1,'tw':0.8,'tf':1.6,'l0':6,'l1':12,'fi':1}],
    starfield: [{'sh':0.5,'t':['c_star'],'c':['#ffffff','#d6e4ff','#b8ccff','#fff0dc'],'d':180,'sp':3,'v0':1.5,'v1':5,'s0':6,'s1':12,'o0':0.35,'o1':0.85,'l0':30,'l1':60,'fi':4,'fo':4,'dp':2}, {'sh':0.42,'t':['c_star'],'c':['#ffffff','#dce8ff','#a9c4ff','#ffe2c0'],'d':180,'sp':3,'v0':2,'v1':7,'s0':9,'s1':20,'o0':0.55,'o1':1,'tw':0.75,'tf':0.55,'l0':25,'l1':50,'fi':3,'fo':3,'dp':1.6}, {'sh':0.08,'t':['c_glint'],'c':['#ffffff','#d0e0ff','#fff2e0'],'d':180,'sp':3,'v0':3,'v1':8,'s0':40,'s1':84,'o0':0.6,'o1':1,'tw':0.6,'tf':0.22,'l0':20,'l1':40,'fi':4,'fo':4,'dp':1.2}],
    meteor_shower: [{'sh':0.04,'t':['c_meteor_145'],'c':['#ffffff','#e0f0ff','#d4ffe4','#fff6ea'],'a':5,'x0':0.25,'y1':0.55,'d':145,'sp':4,'v0':1100,'v1':1700,'s0':260,'s1':560,'o0':0.7,'o1':1,'tw':1,'tf':0.12,'l0':0.6,'l1':1.1,'fi':0.12,'fo':0.45}, {'sh':0.07,'t':['c_meteor_145'],'c':['#d8e6ff','#c0d4ff','#e8f0ff'],'a':5,'x0':0.1,'y1':0.7,'d':145,'sp':4,'v0':500,'v1':900,'s0':90,'s1':200,'o1':0.5,'tw':1,'tf':0.15,'l0':0.5,'l1':1,'fi':0.1,'fo':0.4}, {'sh':0.89,'t':['c_star'],'c':['#ffffff','#d6e4ff','#c4d4ff'],'v0':0,'v1':0.5,'s0':5,'s1':11,'o1':0.65,'l0':40,'l1':80,'fi':5,'fo':5,'dp':2.5}],
    warp: [{'sh':0.6,'t':['streak','streak','c_meteor'],'c':['#eaf0ff','#b4ccff','#8fb0ff','#c6a8ff','#a8ecff'],'a':5,'x0':0.47,'y0':0.44,'x1':0.53,'y1':0.56,'v0':450,'v1':1300,'s0':60,'s1':380,'o1':0.9,'l0':3,'l1':3,'fi':0.6,'fo':0.2,'dp':1.4,'al':1}, {'sh':0.36,'t':['c_star'],'c':['#ffffff','#c8d8ff','#d8c8ff'],'a':5,'x0':0.44,'y0':0.4,'x1':0.56,'y1':0.6,'v0':120,'v1':520,'s0':5,'s1':14,'o0':0.3,'o1':1,'l0':7,'l1':7,'fi':1.2,'fo':0.2,'dp':1.4}, {'sh':0.04,'t':['soft_dot'],'c':['#6a7cff','#9a6cff','#5ab0ff'],'a':5,'x0':0.49,'y0':0.48,'x1':0.51,'y1':0.52,'v0':0,'v1':4,'s0':260,'s1':560,'o0':0.1,'o1':0.2,'tw':0.45,'tf':0.3,'l0':6,'l1':10,'fi':3,'fo':3,'dp':1}],
    nebula: [{'sh':0.11,'t':['c_cloud'],'c':['#e040c8','#8a4cff','#4a5cff','#24b8c8','#ff5a9e'],'d':200,'sp':25,'v0':4,'v1':12,'s0':480,'s1':1000,'o0':0.18,'o1':0.36,'l0':25,'l1':45,'fi':7,'fo':7,'r0':0.5,'r1':1.8,'dp':1}, {'sh':0.06,'t':['c_cloud'],'c':['#ff70d8','#50e0e0','#a070ff'],'d':200,'sp':25,'v0':6,'v1':14,'s0':200,'s1':400,'o0':0.18,'o1':0.35,'l0':18,'l1':32,'fi':6,'fo':6,'r0':1,'r1':3,'dp':1}, {'sh':0.83,'t':['c_star'],'c':['#ffffff','#ffd0f4','#d0f4ff','#e0d4ff'],'d':200,'sp':25,'v0':2,'v1':9,'s0':5,'s1':14,'o0':0.35,'o1':0.95,'tw':0.45,'tf':0.35,'l0':20,'l1':40,'fi':3,'fo':3,'dp':1.8}],
    digital_rain: [{'sh':0.7,'t':['c_code_a','c_code_b'],'c':['#4dff88','#4dff88','#4dff88','#2cffb0','#8cffb4','#48e0ff'],'a':1,'d':90,'sp':0,'v0':150,'v1':420,'s0':170,'s1':400,'o0':0.35,'o1':1,'tw':0.3,'tf':3,'l0':8,'l1':18,'fi':0.3,'fo':1,'dp':1.6}, {'sh':0.3,'t':['c_code_b','c_code_a'],'c':['#30c070','#28b890','#2a9cc0'],'a':1,'d':90,'sp':0,'v0':80,'v1':160,'s0':100,'s1':160,'o0':0.15,'o1':0.35,'l0':8,'l1':18,'fi':0.3,'fo':1,'dp':1}],
    ps_symbols: [{'sh':0.62,'t':['d_ps_triangle','d_ps_circle','d_ps_cross','d_ps_square'],'c':['#ffffff'],'d':-90,'sp':30,'v0':10,'v1':28,'sw':8,'sf':0.12,'s0':16,'s1':64,'o0':0.3,'o1':0.95,'l0':12,'l1':22,'fi':3,'fo':3,'r0':6,'r1':24,'dp':1.4}, {'sh':0.2,'t':['soft_dot'],'c':['#40e2b0','#ff5466','#6ea2ff','#ff8cce'],'d':-90,'sp':40,'v0':4,'v1':12,'s0':60,'s1':170,'o1':0.42,'l0':14,'l1':24,'fi':4,'fo':4,'dp':1}, {'sh':0.18,'t':['soft_dot'],'c':['#ffffff','#d8e6ff'],'d':-90,'sp':40,'v0':6,'v1':18,'sw':6,'s0':5,'s1':13,'o0':0.4,'o1':0.95,'tw':0.6,'tf':0.5,'l0':8,'l1':16}],
    confetti: [{'sh':0.62,'t':['d_confetti','d_confetti','d_confetti','d_ribbon'],'c':['#ff4f6d','#ffc93c','#3cd4ff','#7cf06a','#b57bff','#ff8a3c'],'a':1,'d':90,'sp':18,'v0':45,'v1':95,'gy':2,'sw':45,'sf':0.5,'s0':18,'s1':50,'o0':0.6,'o1':1,'l0':30,'l1':40,'fi':0,'r0':80,'r1':320,'dp':1.4}, {'sh':0.24,'t':['dot'],'c':['#ff4f6d','#ffc93c','#3cd4ff','#7cf06a','#b57bff','#ff8a3c'],'a':1,'d':90,'sp':18,'v0':40,'v1':85,'gy':2,'sw':30,'sf':0.7,'s0':6,'s1':15,'o0':0.6,'o1':1,'l0':30,'l1':40,'fi':0,'dp':1.4}, {'sh':0.14,'t':['sparkle'],'c':['#ffffff','#ffe9a8'],'a':1,'d':90,'sp':18,'v0':30,'v1':60,'sw':20,'sf':0.4,'s0':14,'s1':36,'o0':0.6,'o1':1,'tw':0.9,'tf':1.2,'l0':30,'l1':40,'fi':0}],
    bubbles: [{'sh':0.62,'t':['d_bubble'],'c':['#ffffff'],'a':2,'d':-90,'sp':10,'v0':30,'v1':75,'sw':22,'sf':0.55,'s0':18,'s1':92,'o0':0.45,'o1':0.95,'l0':14,'l1':40,'fi':1,'fo':0.4,'dp':1.8}, {'sh':0.38,'t':['d_bubble'],'c':['#ffffff'],'a':2,'d':-90,'sp':12,'v0':50,'v1':110,'sw':14,'sf':1.2,'s0':5,'s1':14,'o0':0.5,'o1':0.9,'l1':26,'fi':1,'fo':0.4}],
    hearts: [{'sh':0.7,'t':['d_heart'],'c':['#ff5c8a','#ff7eb3','#ff3d6a','#ffa3c4','#e8366e','#ffc6dc'],'a':2,'d':-90,'sp':12,'v0':22,'v1':55,'sw':26,'sf':0.22,'s0':18,'s1':66,'o0':0.45,'o1':0.95,'l0':12,'l1':22,'fi':1,'fo':6,'dp':1.6}, {'sh':0.18,'t':['sparkle'],'c':['#ffffff','#ffd6e6','#ffb3cf'],'a':5,'y0':0.35,'d':-90,'sp':30,'v0':6,'v1':18,'s0':12,'s1':34,'o0':0.6,'o1':1,'tw':0.9,'tf':0.8,'l0':4,'l1':8,'fi':1.5,'fo':1.5}, {'sh':0.12,'t':['soft_dot'],'c':['#ff6fa5','#ff9ec4','#ff4f7e'],'a':2,'d':-90,'sp':15,'v0':10,'v1':25,'sw':12,'sf':0.15,'s0':60,'s1':150,'o0':0.14,'o1':0.32,'l0':14,'l1':24,'fo':7,'dp':1}],
    neon_wave: [{'sh':0.42,'t':['d_neon_diamond'],'c':['#ff2fa0','#22e6ff','#a45cff','#ff4fd8'],'a':5,'x0':1,'y0':0.48,'y1':0.78,'d':180,'sp':4,'v0':70,'v1':150,'sw':90,'sf':0.14,'s0':20,'s1':54,'o0':0.6,'o1':1,'l0':30,'l1':40,'fi':0.5}, {'sh':0.38,'t':['streak'],'c':['#ff2fa0','#22e6ff','#a45cff'],'a':5,'x0':1,'y0':0.48,'y1':0.78,'d':180,'sp':3,'v0':160,'v1':320,'sw':90,'sf':0.14,'s0':40,'s1':150,'o0':0.5,'o1':1,'l0':15,'fi':0.5,'al':1}, {'sh':0.2,'t':['ring'],'c':['#22e6ff','#ff2fa0'],'a':5,'x0':1,'y0':0.48,'y1':0.78,'d':180,'sp':4,'v0':50,'v1':110,'sw':90,'sf':0.14,'s1':24,'o0':0.5,'o1':1,'tw':0.5,'tf':2,'l0':30,'l1':40,'fi':0.5}],
    xmas_lights: [{'sh':0.3,'t':['e_orb'],'c':['#ff2414','#0fcf55','#ffa21e','#2c58ff','#ff4f96','#ffc070'],'d':180,'v0':2,'v1':6,'sw':4,'sf':0.06,'s0':110,'s1':340,'o0':0.07,'o1':0.18,'tw':0.35,'tf':0.12,'l0':18,'l1':34,'fi':5,'fo':6,'dp':1.2}, {'sh':0.56,'t':['e_bulb_red','e_bulb_green','e_bulb_gold','e_bulb_blue'],'c':['#ffffff','#fff6ee'],'d':-90,'v0':1,'v1':4,'sw':3,'sf':0.12,'s0':44,'s1':170,'o0':0.7,'o1':1,'tw':0.6,'tf':0.35,'l0':14,'l1':30,'fi':2.5,'fo':3,'dp':1.7}, {'sh':0.14,'t':['e_glint'],'c':['#ffffff','#fff0d0','#ffe6b8'],'d':-90,'v0':1,'v1':3,'s0':44,'s1':150,'o0':0.75,'o1':1,'tw':0.92,'tf':0.3,'l0':6,'l1':14,'fi':1.5,'dp':2}],
    xmas_eve: [{'sh':0.22,'t':['f_flake_a','f_flake_b','f_flake_c','f_flake_d'],'c':['#ffffff','#ffffff','#f0f6ff','#e4efff','#fff8ee'],'a':1,'d':90,'sp':12,'v0':26,'v1':52,'sw':18,'sf':0.12,'s0':30,'s1':128,'o0':0.45,'o1':0.95,'l0':80,'l1':110,'fo':4,'r0':4,'r1':18,'rk':16,'dp':1.7}, {'sh':0.52,'t':['f_glitter','f_glitter','f_star'],'c':['#ffffff','#e6eeff','#fff1c4','#ffd77a'],'d':90,'sp':30,'v0':6,'sw':8,'s0':14,'s1':44,'o0':0.5,'o1':1,'tw':0.9,'tf':1.3,'l0':5,'l1':10,'fi':1.2,'dp':1.3}, {'sh':0.26,'t':['soft_dot'],'c':['#8fc4ff','#b8d8ff','#ffe1a6','#fff0d2'],'d':90,'sp':40,'v1':16,'sw':12,'sf':0.1,'s0':24,'s1':130,'o0':0.28,'o1':0.55,'l0':12,'l1':22,'fi':4,'fo':5,'dp':1}],
    xmas_ornaments: [{'sh':0.36,'t':['g_bauble_red','g_bauble_gold','g_bauble_green','g_bauble_blue'],'c':['#ffffff'],'a':1,'d':90,'sp':5,'v0':26,'v1':52,'sw':16,'sf':0.16,'s0':26,'s1':92,'o0':0.6,'o1':1,'l0':100,'l1':120,'fi':1,'rk':14,'dp':1.45}, {'sh':0.32,'t':['g_cane','g_gingerbread','g_holly','g_gift'],'c':['#ffffff'],'a':1,'d':90,'sp':7,'v0':24,'v1':50,'sw':22,'s0':26,'s1':92,'o0':0.6,'o1':1,'l0':100,'l1':120,'fi':1,'r0':4,'r1':22,'rk':18,'dp':1.45}, {'sh':0.32,'t':['sparkle','g_star'],'c':['#ffbf48','#ffd36e','#ffe4a0'],'d':90,'sp':20,'v0':6,'v1':18,'sw':8,'sf':0.3,'s0':12,'s1':40,'o0':0.45,'o1':0.9,'tw':0.9,'tf':1.1,'l0':4,'l1':9,'fi':1.2,'fo':1.5,'r0':5,'r1':20}],
  };
  var PARTICLE_LAYER = { sh: 0, a: 0, x0: 0, y0: 0, x1: 1, y1: 1, d: 0, sp: 180, v0: 5, v1: 20, gx: 0, gy: 0,
                         sw: 0, sf: 0.2, s0: 8, s1: 32, o0: 0.2, o1: 0.8, tw: 0, tf: 1, l0: 10, l1: 20,
                         fi: 2, fo: 2, r0: 0, r1: 0, rk: 0, dp: 1.5, al: 0 };
  /* pictures with colours of their own: a tint would make them one flat colour */
  var PARTICLE_COLOURED = /^(a_firefly|b_aurora|b_ember|d_bubble|d_ps_|e_bulb_|e_glint|f_flake_|f_star|g_)/;
  function particleStyle() {
    var k = THEME.particlesStyle;
    return typeof k === 'string' && PARTICLE_STYLES.hasOwnProperty(k) ? PARTICLE_STYLES[k] : null;
  }
  /* a colour turned round the wheel; white and grey take the hue of the
     angle (as AniketosHEN's ShiftHue) */
  function particleHue(hex, deg) {
    deg = ((Math.round(deg) % 360) + 360) % 360;
    if (!deg) return hex;
    var n = parseInt(hex.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    var hi = Math.max(r, g, b), lo = Math.min(r, g, b), c = hi - lo, h = 0, s = hi > 0 ? c / hi : 0;
    if (s < 0.12) { h = deg; s = 0.45; }
    else {
      h = hi === r ? 60 * (((g - b) / c + 6) % 6) : hi === g ? 60 * ((b - r) / c + 2) : 60 * ((r - g) / c + 4);
      h = (h + deg) % 360;
    }
    var cc = hi * s, x = cc * (1 - Math.abs((h / 60) % 2 - 1)), m = hi - cc, o;
    switch (Math.floor(h / 60) % 6) {
      case 0: o = [cc, x, 0]; break;
      case 1: o = [x, cc, 0]; break;
      case 2: o = [0, cc, x]; break;
      case 3: o = [0, x, cc]; break;
      case 4: o = [x, 0, cc]; break;
      default: o = [cc, 0, x];
    }
    return '#' + o.map(function (v) { var t = Math.round((v + m) * 255).toString(16); return t.length < 2 ? '0' + t : t; }).join('');
  }
  /* which layer particle i of n belongs to, by the layers' shares */
  function particleLayerFor(layers, i, n) {
    var at = (i + 0.5) / Math.max(n, 1), total = 0;
    for (var k = 0; k < layers.length; k++) { total += layers[k].sh; if (at < total) return k; }
    return layers.length - 1;
  }
  /* where a life starts: the centre, px */
  function particleSpot(L, size, rnd) {
    var out = size * 0.5;
    switch (L.a) {
      case 1: return [1920 * rnd(), -out];
      case 2: return [1920 * rnd(), 1080 + out];
      case 3: return [-out, 1080 * rnd()];
      case 4: return [1920 + out, 1080 * rnd()];
      case 5: return [1920 * (L.x0 + (L.x1 - L.x0) * rnd()), 1080 * (L.y0 + (L.y1 - L.y0) * rnd())];
      default: return [1920 * rnd(), 1080 * rnd()];
    }
  }
  /* one particle: its look and its whole path, as interpolation points */
  function particleMake(L, rnd, scale, hue) {
    var D2R = Math.PI / 180;
    var tex = L.t[Math.min(L.t.length - 1, Math.floor(rnd() * L.t.length))];
    var col = L.c && L.c.length ? L.c[Math.min(L.c.length - 1, Math.floor(rnd() * L.c.length))] : '#ffffff';
    var depth = Math.pow(rnd(), Math.max(L.dp, 0.1)), pace = 0.45 + 0.55 * depth;
    var size = Math.max(2, (L.s0 + (L.s1 - L.s0) * depth) * scale);
    var peak = L.o0 + (L.o1 - L.o0) * depth;
    var head = (L.d + (rnd() * 2 - 1) * L.sp) * D2R;
    var speed = (L.v0 + (L.v1 - L.v0) * rnd()) * pace;
    var vx = Math.cos(head) * speed, vy = Math.sin(head) * speed;
    var gx = L.gx * pace, gy = L.gy * pace;
    var px = -Math.sin(head), py = Math.cos(head);
    var sph = rnd() * 2 * Math.PI, sw = 2 * Math.PI * L.sf * (0.7 + 0.6 * rnd()), samp = L.sw * pace;
    var tph = rnd() * 2 * Math.PI, tw = 2 * Math.PI * L.tf * (0.6 + 0.8 * rnd());
    var turns = L.r0 || L.r1, turn = turns ? rnd() * 360 : 0;
    var spin = (L.r0 + (L.r1 - L.r0) * rnd()) * (rnd() < 0.5 ? -1 : 1);
    var life = L.l0 + (L.l1 - L.l0) * rnd();
    var spot = particleSpot(L, size, rnd);
    var at = function (t) {
      var s = sw > 0 && samp ? samp / sw * (Math.cos(sph) - Math.cos(sph + sw * t)) : 0;
      return [vx * t + 0.5 * gx * t * t + px * s, vy * t + 0.5 * gy * t * t + py * s];
    };
    /* the life ends early once it has left the screen (it would not come back) */
    var end = life, margin = size + 4, steps = 120, k;
    for (k = 1; k <= steps; k++) {
      var tt = life * k / steps, q = at(tt), qx = spot[0] + q[0], qy = spot[1] + q[1];
      if (qx < -margin || qx > 1920 + margin || qy < -margin || qy > 1080 + margin) { end = tt; break; }
    }
    var cycles = Math.max(samp || L.rk ? L.sf : 0, (gx || gy) ? 0.25 : 0) * end;
    var n = Math.max(2, Math.min(48, Math.ceil(cycles * 8)));
    var ins = [], xs = [], ys = [], rs = [];
    var turning = !!(turns || L.rk || L.al);
    for (k = 0; k <= n; k++) {
      var t = end * k / n, p = at(t);
      ins.push(k / n); xs.push(+p[0].toFixed(1)); ys.push(+p[1].toFixed(1));
      if (turning) {
        var a = L.al ? Math.atan2(vy + gy * t, vx + gx * t) / D2R : turn + spin * t;
        if (L.rk) a += L.rk * Math.sin(sph + sw * t);
        rs.push(a.toFixed(2) + 'deg');
      }
    }
    /* opacity: fades at both ends of the life, dips when it twinkles */
    var oin = [0], fi = L.fi, fo = L.fo;
    /* a twinkle much slower than the life (meteors): one dip for the whole
       life, drawn again for each life (particleMove) */
    var slow = L.tw > 0 && L.tf * life < 0.5, tws = slow ? 0 : L.tw;
    var on = tws ? Math.max(2, Math.min(48, Math.ceil(L.tf * end * 6))) : 2;
    for (k = 1; k < on; k++) oin.push(k / on);
    if (fi > 0 && fi < end) oin.push(fi / end);
    if (fo > 0 && life - fo > 0 && life - fo < end) oin.push((life - fo) / end);
    oin.push(1);
    oin.sort(function (u, w) { return u - w; });
    var ops = [], uniq = [];
    oin.forEach(function (u) {
      if (uniq.length && u - uniq[uniq.length - 1] < 1e-4) return;
      uniq.push(u);
      var t = u * end;
      var fade = Math.max(0, Math.min(fi > 0 ? t / fi : 1, fo > 0 ? (life - t) / fo : 1, 1));
      var dip = tws * (0.5 + 0.5 * Math.sin(tph + tw * t));
      ops.push(+(peak * fade * (1 - dip)).toFixed(3));
    });
    return {
      tex: tex, tint: PARTICLE_COLOURED.test(tex) || col === '#ffffff' && !hue ? null : particleHue(col, hue),
      size: size, x: spot[0] - size / 2, y: spot[1] - size / 2, ms: end * 1000,
      ins: ins, xs: xs, ys: ys, rs: turning ? rs : null, oin: uniq, ops: ops, slowTw: slow ? L.tw : 0
    };
  }
  /* a new life: the same path from another spot of the style's area */
  function particleMove(p, rnd) {
    var s = particleSpot(p.L, p.size, rnd);
    p.ox.setValue(p.L.a === 3 || p.L.a === 4 ? 0 : s[0] - p.size / 2 - p.x);
    p.oy.setValue(p.L.a === 1 || p.L.a === 2 ? 0 : s[1] - p.size / 2 - p.y);
    if (p.slowTw) p.ow.setValue(1 - p.slowTw * (0.5 + 0.5 * Math.sin(2 * Math.PI * rnd())));
  }
  /* what the particles are made from: the same while the theme is the same */
  function particleSig() {
    return [THEME.particlesStyle, THEME.particlesCount, THEME.particlesSize, THEME.particlesSpeed, THEME.particlesScale,
            THEME.particlesHue, THEME.particlesColor, THEME.particlesOpacity, THEME.particlesImage, THEME.animationSpeed].join('|');
  }
  /* where a particle is in its life now (0..1), from when its timing started */
  function particleAt(p) {
    if (!(p.t0 > 0)) return p.first || 0;
    return (p.from || 0) + (Date.now() - p.t0) / Math.max(1, p.ms);
  }
  /* The particles are made once per theme (kept in T) and their elements
     built once: the Home root renders again on a tab change (and mounts its
     layers again), and each render made a new interpolation per particle
     and property (~200 native animated nodes torn down and made again).
     A new mount goes on from where each particle was. */
  function StyledParticles() {
    var React = T.React, rn = T.rn, A = rn.Animated;
    var ref = React.useRef(null);
    var sig = particleSig();
    if (!ref.current && T.partStyled && T.partStyled.sig === sig) {
      /* a new mount keeps each particle's path and place, but with new
         Animated.Values: the old ones' native nodes went with the old
         views (reused, the particles stood still) */
      var old = T.partStyled;
      var num = function (a, d) { try { var n = a.__getValue(); return typeof n === 'number' ? n : d; } catch (e) { return d; } };
      ref.current = T.partStyled = { sig: sig, rnd: old.rnd, el: null, mounts: old.mounts, list: old.list.map(function (p) {
        var q = {};
        for (var k in p) q[k] = p[k];
        q.v = new A.Value(0); q.ox = new A.Value(num(p.ox, 0)); q.oy = new A.Value(num(p.oy, 0)); q.ow = new A.Value(num(p.ow, 1));
        q.anim = null;
        return q;
      }) };
    }
    if (!ref.current) {
      var layers = particleStyle() || [];
      var count = Math.max(1, Math.min(120, Math.round(+THEME.particlesCount || 40)));
      var speed = THEME.particlesSpeed > 0 ? +THEME.particlesSpeed : 1;
      /* the theme's animationSpeed scales every timing (hookTiming): undone here */
      var undo = A.timing && A.timing.__theme && THEME.animationSpeed > 0 ? +THEME.animationSpeed : 1;
      var scale = Math.max(0.25, Math.min(3, THEME.particlesScale > 0 ? +THEME.particlesScale : 1));
      var hue = +THEME.particlesHue || 0;
      var seed = 11;
      var rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
      var full = layers.map(function (l) {
        var o = {};
        for (var key in PARTICLE_LAYER) o[key] = l.hasOwnProperty(key) ? l[key] : PARTICLE_LAYER[key];
        o.t = l.t; o.c = l.c;
        return o;
      });
      var list = [];
      for (var i = 0; full.length && i < count; i++) {
        var L = full[particleLayerFor(full, i, count)];
        var p = particleMake(L, rnd, scale, hue);
        p.L = L; p.v = new A.Value(0); p.ox = new A.Value(0); p.oy = new A.Value(0); p.ow = new A.Value(1);
        if (p.slowTw) p.ow.setValue(1 - p.slowTw * (0.5 + 0.5 * Math.sin(2 * Math.PI * rnd())));
        p.ms = Math.max(200, p.ms / speed * undo);
        p.first = rnd(); /* already this far along its first life: the screen starts full */
        list.push(p);
      }
      ref.current = T.partStyled = { sig: sig, list: list, rnd: rnd, el: null, mounts: 0 };
    }
    React.useEffect(function () {
      var alive = true, st = ref.current;
      var run = function (p, from) {
        if (!alive) return;
        p.v.setValue(from);
        p.from = from;
        p.t0 = Date.now();
        p.anim = A.timing(p.v, { toValue: 1, duration: p.ms * (1 - from), easing: function (t) { return t; },
                                 useNativeDriver: true, isInteraction: false });
        p.anim.start(function (r) {
          if (!alive || (r && r.finished === false)) return;
          particleMove(p, st.rnd);
          run(p, 0);
        });
      };
      st.list.forEach(function (p) {
        var at = particleAt(p);
        if (at >= 1) { particleMove(p, st.rnd); at = 0; }
        run(p, Math.max(0, Math.min(0.999, at)));
      });
      if (++st.mounts === 2) log('particles: mounted again, they go on where they were');
      if (!T.done.particlesStyle) done('particles style ' + THEME.particlesStyle + ' (' + st.list.length + ')');
      return function () {
        alive = false;
        st.list.forEach(function (p) { try { if (p.anim) p.anim.stop(); } catch (e) {} });
      };
    }, []);
    if (ref.current.el) return ref.current.el;
    var dir = 'file://' + ZT_ASSETS + 'particles/';
    /* particlesOpacity on a style: 0.7 (the default) = the style as made,
       lower fainter, higher brighter (each point at most 1) */
    var bright = THEME.particlesOpacity == null || THEME.particlesOpacity === '' ? 1
      : Math.max(0, Math.min(1, +THEME.particlesOpacity || 0)) / 0.7;
    return ref.current.el = React.createElement(rn.View, {
      pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden' }
    }, ref.current.list.map(function (p, i) {
      var tf = [
        { translateX: p.v.interpolate({ inputRange: p.ins, outputRange: p.xs }) },
        { translateY: p.v.interpolate({ inputRange: p.ins, outputRange: p.ys }) }
      ];
      if (p.rs) tf.push({ rotate: p.v.interpolate({ inputRange: p.ins, outputRange: p.rs }) });
      var st = { position: 'absolute', left: 0, top: 0, width: p.size, height: p.size,
                 opacity: p.v.interpolate({ inputRange: p.oin, outputRange: bright === 1 ? p.ops
                   : p.ops.map(function (o) { return +Math.min(1, o * bright).toFixed(3); }) }), transform: tf };
      if (p.tint) st.tintColor = p.tint;
      return React.createElement(A.View, {
        key: 'sp' + i, style: { position: 'absolute', left: p.x, top: p.y, width: p.size, height: p.size,
                                opacity: p.slowTw ? p.ow : 1, transform: [{ translateX: p.ox }, { translateY: p.oy }] }
      }, React.createElement(A.Image, { source: { uri: dir + p.tex + '.png' }, fadeDuration: 0, style: st }));
    }));
  }

  /* ---- own clock. The stock Clock updates itself and wrapping it
     took ShellUI down: this one is a separate Text in the front
     layer and the stock one only goes transparent ---- */
  var CLOCK_NAMES = {
    en: [['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
         ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
         ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']],
    pt: [['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
         ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
         ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']],
    es: [['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
         ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
         ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']],
    fr: [['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'], ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
         ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
         ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']],
    de: [['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
         ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
         ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']],
    it: [['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'], ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
         ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
         ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']]
  };
  function two(n) { return n < 10 ? '0' + n : String(n); }
  function clockTime(d) {
    var h = d.getHours(), m = two(d.getMinutes()), sec = THEME.ownClockSeconds ? ':' + two(d.getSeconds()) : '';
    if (THEME.ownClock24h !== false) return two(h) + ':' + m + sec;
    return ((h % 12) || 12) + ':' + m + sec + (h < 12 ? ' AM' : ' PM');
  }
  function clockDate(d) {
    var names = CLOCK_NAMES[THEME.ownClockLang] || CLOCK_NAMES.en;
    var f = String(THEME.ownClockDateFormat || 'ddd d MMM');
    return f.replace(/dddd|ddd|dd|d|MMMM|MMM|MM|yyyy|yy/g, function (t) {
      switch (t) {
        case 'dddd': return names[1][d.getDay()];
        case 'ddd': return names[0][d.getDay()];
        case 'dd': return two(d.getDate());
        case 'd': return String(d.getDate());
        case 'MMMM': return names[3][d.getMonth()];
        case 'MMM': return names[2][d.getMonth()];
        case 'MM': return two(d.getMonth() + 1);
        case 'yyyy': return String(d.getFullYear());
        default: return two(d.getFullYear() % 100);
      }
    });
  }
  function OwnClock() {
    var React = T.React, rn = T.rn;
    var st = React.useState(Date.now()), setNow = st[1];
    React.useEffect(function () {
      var timer = null;
      /* ticks on the second (or on the minute) */
      var tick = function () {
        var now = Date.now();
        setNow(now);
        var step = THEME.ownClockSeconds ? 1000 : 60000;
        timer = setTimeout(tick, step - now % step + 20);
      };
      tick();
      return function () { clearTimeout(timer); };
    }, []);
    var d = new Date(st[0]);
    if (!T.done['own clock']) {
      done('own clock');
      log('own clock: ' + clockTime(d) + ' / ' + clockDate(d) + ' (timezone offset ' + d.getTimezoneOffset() + ' min)');
    }
    var align = /^(left|center|right)$/.test(THEME.ownClockAlign) ? THEME.ownClockAlign : 'right';
    var timeStyle = { color: THEME.ownClockColor || '#ffffff', textAlign: align };
    var px = fontSize(THEME.ownClockFontSize || 31);
    if (px) timeStyle.fontSize = px;
    if (THEME.ownClockFontStyle) merge(timeStyle, fontStyle(THEME.ownClockFontStyle));
    var kids = [React.createElement(rn.Text, { key: 't', numberOfLines: 1, style: timeStyle }, clockTime(d))];
    if (THEME.ownClockDate) {
      var dateStyle = { color: THEME.ownClockDateColor || '#ffffffb7', textAlign: align, marginTop: +THEME.ownClockDateGap || 0 };
      var dpx = fontSize(THEME.ownClockDateFontSize || 17);
      if (dpx) dateStyle.fontSize = dpx;
      kids.push(React.createElement(rn.Text, { key: 'd', numberOfLines: 1, style: dateStyle }, clockDate(d)));
    }
    return React.createElement(rn.View, {
      pointerEvents: 'none',
      style: { position: 'absolute', left: +THEME.ownClockX || 0, top: +THEME.ownClockY || 0,
               width: +THEME.ownClockWidth || 280 }
    }, kids);
  }

  /* ---- background: layers below the Home content ---- */
  function backgroundElements() {
    var React = T.React, rn = T.rn, out = [];
    if (APP !== 'home' || !React || !rn || !rn.View) return out;
    var color = THEME.bgColor || '#000000';
    var libOp = rn.Animated && rn.Animated.View ? libVideoOp() : null;
    if (videoUri() && typeof React.useState === 'function')
      out.push(libOp ? React.createElement(rn.Animated.View, {
        key: 'theme-video-box', pointerEvents: 'none',
        style: { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: libOp }
      }, React.createElement(VideoWallpaper, { key: 'theme-video' }))
        : React.createElement(VideoWallpaper, { key: 'theme-video' }));
    else if (bgVideosUsed() && typeof React.useState === 'function')
      out.push(React.createElement(BgVideo, { key: 'theme-bg-video' }));
    if (homeMusicFile() && homeMusicVideo() && typeof React.useState === 'function')
      out.push(React.createElement(HomeMusic, { key: 'theme-home-music' }));
    if (THEME.bgDim > 0)
      out.push(React.createElement(rn.View, {
        key: 'theme-bg', pointerEvents: 'none',
        style: { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080,
                 backgroundColor: THEME.bgDimColor || color, opacity: THEME.bgDim }
      }));
    /* overlay image over the game art (glows, vignettes...): a PNG with
       transparency from /data/ZhiThemes/backgrounds, stretched to the screen */
    var overlay = overlayUri();
    if (overlay && rn.Image)
      out.push(React.createElement(rn.Image, {
        key: 'theme-overlay', pointerEvents: 'none', source: { uri: overlay },
        resizeMode: 'stretch', fadeDuration: 0,
        onLoad: function () { if (!T.done['overlay image']) done('overlay image'); },
        onError: function (e) {
          var why = e && e.nativeEvent ? e.nativeEvent.error || JSON.stringify(e.nativeEvent) : e;
          log('overlay image failed: ' + overlay + ' ' + why);
        },
        style: { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080,
                 opacity: THEME.bgOverlayOpacity == null ? 1 : THEME.bgOverlayOpacity }
      }));
    /* background boxes (field prefix), bottom first: box 3, box 2, box 1,
       then the footer and the top bar backgrounds always over the free boxes */
    var boxes = [];
    ['box3', 'box2', 'box1', 'footerBg', 'topBarBg'].forEach(function (k) {
      if (!THEME[k + 'On'] || !THEME[k] || (k === 'footerBg' && !THEME.footer)) return;
      boxes.push(React.createElement(rn.View, {
        key: 'theme-' + k, pointerEvents: 'none',
        style: { position: 'absolute', left: THEME[k + 'X'], top: THEME[k + 'Y'],
                 width: THEME[k + 'Width'], height: THEME[k + 'Height'],
                 borderRadius: THEME[k + 'Corners'],
                 backgroundColor: THEME[k], opacity: THEME[k + 'Opacity'] }
      }));
    });
    var boxOp = boxes.length ? boxesShown() : null;
    if (boxOp && rn.Animated && rn.Animated.View)
      out.push(React.createElement(rn.Animated.View, {
        key: 'theme-boxes', pointerEvents: 'none',
        style: { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: boxOp }
      }, boxes));
    else out = out.concat(boxes);
    if (THEME.bgGradient > 0) {
      /* no native gradient: strips with rising opacity; 'smooth' follows a
         smoothstep so the top starts at ~0 and the edge disappears */
      var n = Math.max(8, Math.min(128, Math.round(THEME.bgGradientSteps) || 24));
      var height = THEME.bgGradientHeight || 600, h = Math.ceil(height / n);
      var smooth = /^(smooth|suave)$/i.test(THEME.bgGradientCurve || '');
      for (var i = 0; i < n; i++) {
        var t = (i + 1) / n;
        out.push(React.createElement(rn.View, {
          key: 'theme-grad' + i, pointerEvents: 'none',
          style: { position: 'absolute', left: 0, width: 1920, height: h,
                   top: 1080 - height + i * h, backgroundColor: color,
                   opacity: THEME.bgGradient * (smooth ? t * t * (3 - 2 * t) : t) }
        }));
      }
    }
    vignetteElements(out);
    edgeElements(out);
    /* the key holds every particle field: both kinds are built once per
       mount, so a changed field (opacity, colour, size...) needs a new one */
    if (THEME.particlesOn && typeof React.useRef === 'function' && rn.Animated)
      out.push(particleStyle()
        ? React.createElement(StyledParticles, { key: 'theme-particles-' + particleSig() })
        : React.createElement(Particles, { key: 'theme-particles-' + particleSig() }));
    return out;
  }

  /* the name next to the tile is a Text with no style or testID (module 691):
     jsx(Text, {ellipsizeMode: 'marquee', numberOfLines: 1, children: name}).
     The colour goes in through jsx. */
  function isTileName(props) {
    return props.ellipsizeMode === 'marquee' && props.numberOfLines === 1 &&
           props.style == null && props.testID == null &&
           typeof props.children === 'string';
  }
  /* hub: the "..." button gets a button model whose isOverflowButton()
     (uiType === OVERFLOW_BUTTON) is true; with hideMore that element is
     not drawn */
  function isMoreButton(props) {
    for (var k in props) {
      var v = props[k];
      if (v && typeof v === 'object' && typeof v.isOverflowButton === 'function') {
        try { if (v.isOverflowButton()) return true; } catch (e) {}
      }
    }
    return false;
  }
  /* hub: sections to hide by title (the section header, e.g. "Activities"):
     the element that gets that title as a property is the whole section, and
     with it goes the place where the focus would land */
  var TITLE_KEYS = ['title', 'headerText', 'header', 'headerTitle', 'sectionTitle', 'heading', 'label'];
  function hiddenTitles() {
    var out = String(THEME.hideByTitle || '').split(',').map(function (t) {
      return t.trim().toLowerCase();
    }).filter(function (t) { return t; });
    if (THEME.hideActivities) out.push('atividades', 'activities', 'actividades');
    return out;
  }
  function hiddenByTitle(props) {
    var list = hiddenTitles();
    if (!list.length) return null;
    for (var i = 0; i < TITLE_KEYS.length; i++) {
      var v = props[TITLE_KEYS[i]];
      if (typeof v === 'string' && list.indexOf(v.trim().toLowerCase()) >= 0)
        return 'section "' + v + '"';
    }
    return null;
  }
  /* only the card (summary-tile-trophy): the background comes from the native
     component and does not change by style, so there is card opacity instead
     of a colour */
  function trophiesStyle(props) {
    var op = THEME.trophiesOpacity;
    if (!THEME.trophiesX && !THEME.trophiesY && !THEME.trophiesCorners && !(op >= 0 && op < 1)) return;
    var e = {};
    if (THEME.trophiesX || THEME.trophiesY)
      e.transform = [{ translateX: THEME.trophiesX }, { translateY: THEME.trophiesY }];
    if (THEME.trophiesCorners) { e.borderRadius = THEME.trophiesCorners; e.overflow = 'hidden'; }
    if (op >= 0 && op < 1) e.opacity = op;
    props.style = [props.style, e];
    if (!T.done['trophies style']) done('trophies style');
  }

  /* ---- trophies drawn by the Home (fakeTrophies; homeTrophies in older versions) ----
     The hub card (wrapper-trophy-tile) gets data with the trophy title of the
     game: {earnedTrophies, definedTrophies: {platinum, gold, silver, bronze},
     progress, trophyTitleName...} (gamehub ~756290). The hub writes it to the
     console ("THEME-DATA trophies {json}"); ZhiThemes hands it to the Home
     (__themeData) like the game name. */
  function findTrophies(v, depth) {
    if (!v || typeof v !== 'object' || depth > 4) return null;
    if (v.earnedTrophies && typeof v.earnedTrophies === 'object') return v;
    for (var k in v) {
      var r = null;
      try { r = findTrophies(v[k], depth + 1); } catch (e) {}
      if (r) return r;
    }
    return null;
  }
  function grades(o) {
    o = o || {};
    return [o.platinum | 0, o.gold | 0, o.silver | 0, o.bronze | 0];
  }
  function sendTrophyData(msg) {
    var text = JSON.stringify(msg);
    if (text === T.trophySent) return;
    T.trophySent = text;
    try { console.log('THEME-DATA trophies ' + text); } catch (e) {}
  }
  function hubTitleId() {
    var q = T.hubContext && T.hubContext.queryParams;
    return (q && q.titleId) || '';
  }
  function sendTrophies(data, from) {
    if (fromLibrary()) return;
    var t = findTrophies(data, 0);
    if (!T.done['trophies for the Home ' + (from || 'card')]) {
      T.done['trophies for the Home ' + (from || 'card')] = true;
      log('trophies for the Home (' + (from || 'card') + '): ' + (t ? 'found' : 'not found, data: ' +
          (data && typeof data === 'object' ? Object.keys(data).join(',').slice(0, 200) : String(data))));
    }
    if (!t) return;
    T.trophyGotFor = hubTitleId();
    sendTrophyData({ id: hubTitleId(), e: grades(t.earnedTrophies), d: grades(t.definedTrophies),
                     p: typeof t.progress === 'number' ? t.progress : null });
  }

  /* With big tiles and the row low the hub is entirely below the screen and
     does not mount its card row, so neither the card nor its data hook (2558)
     run (bisected on the console: tileSize/focusSize + rowOffsetY).
     Then the theme calls the same fetch the hook uses:
     fetchTrophyProgressData({npTitleId}) = module 2559 default (a promise
     with the mapped trophy title, gamehub ~755945). */
  var NP_SUFFIXES = ['_00', ''];
  function fetchTrophies(titleId) {
    if (!titleId || !T.require || T.trophyGotFor === titleId) return;
    var mod;
    try { mod = T.require(2559); } catch (e) { log('trophies fetch: module 2559 ' + e); return; }
    var fn = mod && (mod.default || mod);
    if (typeof fn !== 'function') { log('trophies fetch: no function in 2559'); return; }
    var i = 0;
    var next = function () {
      if (i >= NP_SUFFIXES.length || T.trophyGotFor === titleId || hubTitleId() !== titleId) return;
      var np = titleId + NP_SUFFIXES[i++], p;
      try { p = fn({ npTitleId: np }); } catch (e) { log('trophies fetch ' + np + ': ' + e); next(); return; }
      if (!p || typeof p.then !== 'function') { log('trophies fetch ' + np + ': not a promise'); return; }
      p.then(function (r) {
        var t = findTrophies(r, 0);
        if (!T.done['trophies fetch result']) {
          T.done['trophies fetch result'] = true;
          log('trophies fetch ' + np + ': ' + (t ? 'found' : 'no trophies, keys: ' +
              (r && typeof r === 'object' ? Object.keys(r).join(',').slice(0, 200) : String(r))));
        }
        if (t && hubTitleId() === titleId && T.trophyGotFor !== titleId) {
          T.trophyGotFor = titleId;
          sendTrophyData({ id: titleId, e: grades(t.earnedTrophies), d: grades(t.definedTrophies),
                           p: typeof t.progress === 'number' ? t.progress : null });
          if (!T.done['trophies by fetch']) done('trophies by fetch (' + np + ')');
        } else if (!t) next();
      }, function (err) {
        if (!T.done['trophies fetch error ' + np])
          { T.done['trophies fetch error ' + np] = true; log('trophies fetch ' + np + ' failed: ' + (err && (err.message || err.error || JSON.stringify(err).slice(0, 160)))); }
        next();
      });
    };
    next();
  }
  /* a game of an open folder on the Home: its trophies are asked here
     (ZhiThemes hands "THEME-TROPHY-ASK <id>" over when the hub prints
     "THEME-HUBASK"); the answer goes to the Home like the hub's own */
  function trophiesFor(titleId, after) {
    var end = function () { if (after) { var a = after; after = null; a(); } };
    if (!titleId || !T.require) return end();
    var mod;
    try { mod = T.require(2559); } catch (e) { log('trophies for ' + titleId + ': ' + e); return end(); }
    var fn = mod && (mod.default || mod);
    if (typeof fn !== 'function') return end();
    var i = 0;
    var next = function () {
      if (i >= NP_SUFFIXES.length) return end();
      var np = titleId + NP_SUFFIXES[i++], p;
      try { p = fn({ npTitleId: np }); } catch (e) { next(); return; }
      if (!p || typeof p.then !== 'function') return end();
      p.then(function (r) {
        var t = findTrophies(r, 0);
        if (!t) { next(); return; }
        end();
        log('trophies asked by the Home: ' + titleId);
        sendTrophyData({ id: titleId, e: grades(t.earnedTrophies), d: grades(t.definedTrophies),
                         p: typeof t.progress === 'number' ? t.progress : null });
      }, function () { next(); });
    };
    next();
  }
  if (APP === 'hub' && THEME.fakeTrophies && THEME.fakeTrophiesFast !== false) {
    var trophyQueue = [], trophyBusy = false;
    var trophyNext = function () {
      if (trophyBusy || !trophyQueue.length) return;
      trophyBusy = true;
      trophiesFor(trophyQueue.shift(), function () { trophyBusy = false; trophyNext(); });
    };
    globalThis.__themeTrophyAsk = function (ids) {
      String(ids || '').split(',').forEach(function (id) {
        id = id.trim();
        if (id && trophyQueue.indexOf(id) < 0) trophyQueue.push(id);
      });
      trophyNext();
    };
    setInterval(function () { try { console.log('THEME-HUBASK ' + (globalThis.__ztHubId || '')); } catch (e) {} }, 150);
  }
  /* the native video / picture behind the system apps (shared wallpaper
     or Settings' own sysBg) stays out of the Game / App Library and the
     hubs opened from them: while one of those is in front it says so twice
     a second (THEME-LIBRARY), ZhiThemes hides it while it hears it */
  if ((APP === 'library' || APP === 'hub' || APP === 'media') && THEME.sysOn) {
    var libraryPing = function () {
      var R = T.rn || T.libRN, AS = R && R.AppState;
      var st = AS ? AS.currentState : null;
      if (st !== 'active' || (APP !== 'library' && !fromLibrary())) return;
      if (!T.done['library ping']) done('library ping (system video hidden here)');
      try { console.log('THEME-LIBRARY'); } catch (e) {}
    };
    setInterval(libraryPing, 400);
    var libraryTries = 0;
    var libraryWatch = setInterval(function () {
      var R = T.rn || T.libRN, AS = R && R.AppState;
      if (++libraryTries > 600) clearInterval(libraryWatch);
      if (!AS || typeof AS.addEventListener !== 'function') return;
      clearInterval(libraryWatch);
      try { AS.addEventListener('change', function (st) { if (st === 'active') libraryPing(); }); } catch (e) {}
      libraryPing();
    }, 100);
  }
  /* the hub card row (module 2592) gets {isTrophyShowing, trophyData,
     friendsData...} from its parent: the data is there even when the
     trophies card itself is not drawn (not drawn with the user's theme) */
  function hubSummary(props) {
    if (!('trophyData' in props) || !('isTrophyShowing' in props)) return;
    if (!T.done['trophies summary']) {
      T.done['trophies summary'] = true;
      log('trophies summary: showing=' + props.isTrophyShowing + ' data=' + typeof props.trophyData +
          ' loading=' + props.isDataLoading);
    }
    if (props.trophyData) sendTrophies(props.trophyData, 'summary');
  }

  /* hub: sections to hide, by testID */
  var SECTIONS = [
    ['hideTrophies', 'trophies', ['wrapper-trophy-tile', 'trophy-tile', 'consolidated-trophy']],
    ['hideActivities', 'activities', ['uam-strand', 'uam-card', 'uam-*', '*activit*', 'tag-activity']],
    ['hideNews', 'news', ['post-news-section', 'pre-news-section', 'news-grid']],
    ['hideRecommendations', 'recommendations', ['recommendations-section']],
    ['hideTournaments', 'tournaments', ['tournament-section', 'tournament-card', 'summary-tile-tournament', 'wrapper-tournament-tile']],
    ['hideFriends', 'friends', ['wrapper-friends-tile', 'summary-tile-friends']],
    ['hideCommunity', 'community', ['ugc-section', 'socialproof-section', 'social-cover-summary']],
    ['hideHubStore', 'hub store', ['merchandise-section', 'addons-section', 'game-plan-section', 'pvu-section', 'cover-product-offer']],
    ['hideAbout', 'about', ['ucm-about-section', 'pre-about-section']]
  ];
  function matches(pattern, id) {
    pattern = pattern.trim();
    if (!pattern) return false;
    var start = pattern.charAt(0) === '*', end = pattern.charAt(pattern.length - 1) === '*';
    var p = pattern.replace(/^\*|\*$/g, '');
    if (start && end) return id.indexOf(p) >= 0;
    if (end) return id.indexOf(p) === 0;
    if (start) return id.slice(-p.length) === p;
    return id === p;
  }
  function hiddenSection(id) {
    /* without trophies or friends the card row is empty but focusable */
    /* the Game Library keeps its trophies (hideTrophies is for the Home hub) */
    var lib = fromLibrary();
    if (id === 'summary-tile-section' && THEME.hideTrophies && THEME.hideFriends && !lib)
      return 'hub cards';
    for (var i = 0; i < SECTIONS.length; i++) {
      if (!THEME[SECTIONS[i][0]]) continue;
      if (lib && SECTIONS[i][0] === 'hideTrophies') continue;
      for (var j = 0; j < SECTIONS[i][2].length; j++)
        if (matches(SECTIONS[i][2][j], id)) return SECTIONS[i][1];
    }
    if (THEME.hideHubIds) {
      var list = String(THEME.hideHubIds).split(',');
      for (var k = 0; k < list.length; k++)
        if (matches(list[k], id)) return 'hub: ' + list[k].trim();
    }
    return null;
  }
  /* diagnostics: which hub layer gets the focus (invisible menu) */
  function hubFocus(props) {
    var id = props.testID;
    ['onFocus', 'onHighlight'].forEach(function (ev) {
      var before = props[ev];
      if (typeof before !== 'function') return;
      props[ev] = function () {
        try { log('hub focus: ' + id + ' (' + ev + ')'); } catch (e) {}
        return before.apply(this, arguments);
      };
    });
  }
  /* diagnostics: list of the hub testIDs (for hideHubIds) */
  var testIDs = {}, newTestIDs = [], testIDsTimer = 0;
  function seeTestID(id) {
    if (testIDs[id]) return;
    testIDs[id] = true;
    newTestIDs.push(id);
    clearTimeout(testIDsTimer);
    testIDsTimer = setTimeout(function () {
      var line = '';
      newTestIDs.forEach(function (t) {
        if (line.length + t.length > 380) { log('testIDs: ' + line); line = ''; }
        line += (line ? ', ' : '') + t;
      });
      if (line) log('testIDs: ' + line);
      newTestIDs = [];
    }, 1500);
  }

  /* hub: lists and views with overflow hidden stop clipping */
  function isList(type) {
    var rn = T.rn;
    if (!rn || !type) return false;
    var name = typeof type === 'string' ? type : (type.displayName || type.name || '');
    return type === rn.ScrollView || type === rn.FlatList || type === rn.SectionList ||
           type === rn.VirtualizedList || /Scroll|List/.test(name);
  }
  function flat(st) {
    try { return (T.rn && T.rn.StyleSheet.flatten(st)) || {}; } catch (e) { return {}; }
  }
  /* diagnostics: position of every part with a testID, lists and clips */
  var mapN = 0, mapSeen = {};
  function mapPart(type, props) {
    var name = null;
    if (typeof props.testID === 'string' && props.testID) name = 'id:' + props.testID;
    if (isList(type)) name = 'list:' + (props.testID || ++mapN);
    else if (props.style != null && flat(props.style).overflow === 'hidden')
      name = 'clip:' + (props.testID || (typeof type === 'string' ? type : (type && (type.displayName || type.name)) || '?') + '#' + (++mapN));
    if (!name) return;
    if (!mapSeen[name] && Object.keys(mapSeen).length > 400) return;
    mapSeen[name] = true;
    withMeasure(name, props);
  }
  var libSeen = {}, libN = 0;
  function seeLibrary(type, props) {
    if (libN >= 60) return;
    var list = props.numColumns != null || props.getItemLayout || props.renderItem ||
               props.contentContainerStyle || props.scrollEnabled != null;
    var id = typeof props.testID === 'string' ? props.testID : '';
    if (!list && !id) return;
    var key = (list ? 'list:' : 'id:') + (id || Object.keys(props).sort().join(','));
    if (libSeen[key]) return;
    libSeen[key] = true;
    libN++;
    var summary = Object.keys(props).filter(function (k) { return k !== 'children'; }).map(function (k) {
      var v = props[k];
      if (typeof v === 'function') return k;
      try { return k + '=' + JSON.stringify(v).slice(0, 80); } catch (e) { return k; }
    }).join(' ');
    log('lib ' + key.slice(0, 60) + ' :: ' + summary.slice(0, 600));
  }
  /* ---- settings / trophies: rows as rounded "pills" ----
     The Settings rows are native views (RCTMenuListButton and the other
     RCTMenuList*); like every native view of the PUI they take
     backgroundColor, borderRadius, borderColor/borderWidth and
     focusCustomSettings (PUI FocusCustomSettings, camelCase keys as Sony's
     canMoveDown). Popup menu items stay stock. The trophy list rows are RN
     views (testID title-list-item). The background is the native one of
     the app (SceneControl.setBackground, as the Home wallpaper): an image
     put inside the native scene (RCTScenePS) crashed the ShellUI. */
  function sysNum(v) { v = Number(v); return isFinite(v) ? v : 0; }
  function sysColor(hex, a) {
    var m = /^#?([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(String(hex || '').trim());
    if (!m) return null;
    var n = parseInt(m[1], 16), al = m[2] ? parseInt(m[2], 16) / 255 : 1;
    if (typeof a === 'number') al *= a;
    al = Math.max(0, Math.min(1, al));
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + Math.round(al * 1000) / 1000 + ')';
  }
  /* pre = 'sysRow' (Settings) or 'sysTrophy' (Trophies): Color, Opacity,
     Corners, BorderWidth, BorderColor */
  function sysBoxStyle(pre) {
    var st = {}, bg = sysNum(THEME[pre + 'Opacity']) > 0 && sysColor(THEME[pre + 'Color'], sysNum(THEME[pre + 'Opacity']));
    if (bg) st.backgroundColor = bg;
    if (sysNum(THEME[pre + 'Corners']) > 0) st.borderRadius = sysNum(THEME[pre + 'Corners']);
    var line = sysNum(THEME[pre + 'BorderWidth']) > 0 && sysColor(THEME[pre + 'BorderColor']);
    if (line) { st.borderWidth = sysNum(THEME[pre + 'BorderWidth']); st.borderColor = line; }
    return st;
  }
  /* the file behind Settings and Trophies: their own (sysBg) or,
     with sysBgWallpaper, the Home wallpaper; an .mp4 plays as a video */
  function sysBgName() {
    if (THEME.bgClean) return '';
    if (THEME.sysBgWallpaper && THEME.wallpaperOn && !THEME.bgClean && typeof THEME.wallpaper === 'string' && THEME.wallpaper)
      return THEME.wallpaper;
    var n = THEME.sysBg;
    return THEME.sysBgOn && typeof n === 'string' ? n : '';
  }
  /* the wallpaper picture shared with Settings / Trophies is also
     drawn by the C++ stage in the system background layer
     (zt_sys_video.cpp), over this one */
  function sysBgUri() {
    var n = sysBgName();
    /* set again as before (under the native stage) in case the
       stage's picture does not load (not seen on the console) */
    if (!n || isVideo(n)) return null;
    return 'file://' + (n.charAt(0) === '/' ? n : ztPath('wallpapers', n));
  }
  function sysVideoUri() {
    var n = sysBgName();
    if (!THEME.sysOn || !n || !isVideo(n)) return null;
    return 'http://127.0.0.1:4445/v/' + n.split('/').pop();
  }
  /* The video goes under the app's root, never inside the native RCTScenePS
     (an Image there took ShellUI down). first through
     AppRegistry.setWrapperComponentProvider (React Native draws every root
     inside that wrapper); the older registerComponent wrap never drew
     anything, so it stays only as the fallback, with logs of what the app
     calls. */
  function sysVideoRoot(rn) {
    if (T.sysVideoWrapped || !sysVideoUri()) return;
    var AR = null;
    try { AR = rn.AppRegistry; } catch (e) {}
    if (!AR) { log('system screens: no AppRegistry for the video'); return; }
    T.sysVideoWrapped = true;
    var keys = [];
    try { keys = Object.keys(AR); } catch (e) {}
    log('system screens: AppRegistry ' + keys.join(',').slice(0, 300));
    if (typeof AR.setWrapperComponentProvider === 'function') {
      var setWrapper = AR.setWrapperComponentProvider, theirs = null;
      var provide = function (params) {
        var Inner = null;
        try { Inner = theirs ? theirs(params) : null; } catch (e) { log('system screens: app wrapper ' + e); }
        log('system screens: wrapper asked' + (Inner ? ' (with the app\'s own)' : ''));
        return T.React ? sysVideoWrapper(Inner) : Inner;
      };
      try {
        setWrapper.call(AR, provide);
        T.sysVideoHow = 'wrapper';
        log('system screens: video wrapper set');
      } catch (e) { log('system screens: setWrapperComponentProvider ' + e); }
      try {
        AR.setWrapperComponentProvider = function (p) { theirs = p; log('system screens: the app has a wrapper too'); };
      } catch (e) {}
    }
    if (typeof AR.runApplication === 'function') {
      var run = AR.runApplication;
      try {
        AR.runApplication = function (name) {
          log('system screens: runApplication ' + name + (T.sysVideoDrawn ? '' : ' (video not drawn yet)'));
          return run.apply(this, arguments);
        };
      } catch (e) {}
    }
    if (typeof AR.registerComponent !== 'function') return;
    var register = AR.registerComponent;
    var replaced = function (name, getComponent) {
      log('system screens: registerComponent ' + name);
      var args = Array.prototype.slice.call(arguments);
      if (typeof getComponent === 'function' && T.sysVideoHow !== 'wrapper')
        args[1] = function () {
          var App = getComponent.apply(this, arguments);
          return sysVideoApp(App, name);
        };
      return register.apply(this, args);
    };
    try { AR.registerComponent = replaced; } catch (e) {}
    log('system screens: registerComponent ' + (AR.registerComponent === replaced ? 'wrapped' : 'NOT writable'));
  }
  function sysVideoWrapper(Inner) {
    var React = T.React;
    var Wrapper = function (props) {
      var kids = Inner ? React.createElement(Inner, props) : props.children;
      var uri = sysVideoUri();
      /* the player starts 1.5 s after the app (a video loading while
         the editor's Apply reloaded Settings came right before two crashes,
         like the setBackground at bundle start ) */
      var ready = React.useState(false), setReady = ready[1];
      React.useEffect(function () {
        var t = setTimeout(function () { setReady(true); }, 1500);
        return function () { clearTimeout(t); };
      }, []);
      /* always the same shape [video slot, app]: returning the app
         alone first and [video, app] 1.5 s later made React mount the
         whole app again, and Settings came back with only the background */
      var on = !!(uri && ready[0]);
      if (on) {
        T.sysVideoDrawn = true;
        if (!T.done['system video']) { done('system video'); log('system screens: video ' + uri + ' (wrapper)'); }
      }
      return React.createElement(T.Fragment || React.Fragment, null,
        on ? React.createElement(VideoWallpaper, { key: 'zt-sys-video', uri: uri, sound: !!THEME.sysBgVideoSound }) : null,
        React.createElement(T.Fragment || React.Fragment, { key: 'zt-sys-app' }, kids));
    };
    Wrapper.displayName = 'ZtSysVideoWrapper';
    return Wrapper;
  }
  function sysVideoApp(App, name) {
    var React = T.React;
    if (!React || !App || typeof React.useState !== 'function') return App;
    var Wrapped = function (props) {
      var uri = sysVideoUri();
      if (!uri) return React.createElement(App, props);
      T.sysVideoDrawn = true;
      if (!T.done['system video']) { done('system video'); log('system screens: video ' + uri + ' behind ' + name); }
      return React.createElement(T.Fragment || React.Fragment, null,
        React.createElement(VideoWallpaper, { key: 'zt-sys-video', uri: uri, sound: !!THEME.sysBgVideoSound }),
        React.createElement(App, props));
    };
    Wrapped.displayName = 'ZtSysVideo';
    return Wrapped;
  }
  function sysStyle(type, props) {
    var name = typeof type === 'string' ? type : '';
    if (/^RCTMenuList/.test(name) && !/Selectable/.test(name) && !props.isPopupMenuItem) {
      var rowStyle = sysBoxStyle('sysRow'), gap = sysNum(THEME.sysRowGap);
      /* the main list grows with the margin; making the row shorter
         spoilt it and did not help the Network page (its list has an
         itemMargin, see below) */
      if (gap > 0) rowStyle.marginVertical = gap / 2;
      props.style = [props.style, rowStyle];
      if (!T.sysRowLaid) {
        T.sysRowLaid = true;
        var before = props.onLayout;
        props.onLayout = function (ev) {
          if (typeof before === 'function') before.apply(this, arguments);
          try {
            var l = ev.nativeEvent.layout;
            log('system screens: row ' + Math.round(l.width) + 'x' + Math.round(l.height) + ' at y ' + Math.round(l.y) + ' (gap ' + gap + ')');
          } catch (e) {}
        };
      }
      if (THEME.sysNoSeparators && 'showSeparator' in props) props.showSeparator = false;
      if (!T.done['system rows']) { done('system rows'); log('system screens: rows are ' + name); }
      return;
    }
    /* the testID title-list-item is on six elements of a trophy row (the
       name and progress boxes too): only the native box gets the pill */
    /* lines between the games: the trophy lists do not pass showSeparator
       (Settings passes false), so the native list draws its separators.
       (The grey backgroundSpace belongs to the game icons.) */
    var isList = name === 'RCTListViewPS' || (typeof type !== 'string' && typeName(type) === 'ListViewPSBase');
    if (isList && APP === 'trophy' && THEME.sysTrophies && THEME.sysTrophyNoLine) {
      props.showSeparator = false;
      if (!T.done['trophy separators off']) done('trophy separators off');
      return;
    }
    /* Settings pages (Network...) whose lists draw their own separators */
    if (isList && APP === 'settings' && THEME.sysNoSeparators && props.showSeparator !== false) {
      props.showSeparator = false;
      if (!T.done['settings list separators off']) done('settings list separators off');
    }
    /* list item slots: in the main list RCTListItemPS has no height and grows
       with the row margin; in other pages (Network) it gets a fixed height
       and the pills overlapped (itemMargin is 0 in every list and
       adding to it changed nothing): that height gets the gap added */
    if (APP === 'settings' && name === 'RCTListItemPS' && sysNum(THEME.sysRowGap) > 0 && props.style != null) {
      var slot = flat(props.style);
      if (typeof slot.height === 'number') {
        props.style = [props.style, { height: slot.height + sysNum(THEME.sysRowGap) }];
        if (!T.done['settings item slots']) {
          done('settings item slots');
          log('system screens: item slot ' + slot.height + ' -> ' + (slot.height + sysNum(THEME.sysRowGap)));
        }
      }
    }
    if (props.testID === 'title-list-item' && name === 'RCTView') {
      if (!THEME.sysTrophies) return;
      /* the row sits in a fixed 146 px list slot: the gap makes it shorter
         and centres it, so the slot keeps its size */
      var tst = sysBoxStyle('sysTrophy'), tg = sysNum(THEME.sysTrophyGap);
      if (tg > 0) {
        var fl = flat(props.style), th = sysNum(fl.height) || 146;
        tst.height = Math.max(60, th - tg);
        tst.marginTop = tg / 2;
        tst.marginBottom = sysNum(fl.marginBottom) + tg / 2;
      }
      props.style = [props.style, tst];
      if (!T.done['trophy rows']) done('trophy rows');
      return;
    }
    /* side bar of the pages with tabs (Accessibility, Sound...) */
    if (name === 'RCTVerticalTabViewPS') {
      sysSideBar(name, props);
      return;
    }
    if (APP === 'settings' && name === 'RCTListViewPS' && (sysNum(THEME.sysListX) || sysNum(THEME.sysListY))) {
      props.style = [props.style, { transform: [{ translateX: sysNum(THEME.sysListX) }, { translateY: sysNum(THEME.sysListY) }] }];
      if (!T.done['system list moved']) done('system list moved');
      return;
    }
  }
  /* The focus colour cannot be changed per row: focusCustomSettings only
     knows focusImageFilterColor, focusImageRectangle, canMove* and
     *Candidate; the colour as text crashed the ShellUI and as a
     processed number did nothing. */
  /* Side bar: the native tab list ignores backgroundColor/borderRadius in
     tabListStyle. Its background is an RN View drawn before the
     TabViewPS, at the same place (sysSideWrap). When focus goes to the page
     the bar shrinks to its icons (onTabCollapseStateChange of the native
     RCTVerticalTabViewPS): the background follows (sysSideCollapsedWidth). */
  var sideListeners = [];
  function sysSideBar(name, props) {
    if (name !== 'RCTVerticalTabViewPS' || typeof props.onTabCollapseStateChange !== 'function' ||
        props.onTabCollapseStateChange.__zt) return;
    var original = props.onTabCollapseStateChange;
    var wrapped = function (ev) {
      try {
        var e = ev && ev.nativeEvent ? ev.nativeEvent : ev, c = null;
        if (typeof e === 'boolean') c = e;
        else if (e && typeof e === 'object')
          for (var k in e) if (/collap/i.test(k) && typeof e[k] === 'boolean') c = e[k];
        T.sideEvents = (T.sideEvents || 0) + 1;
        if (T.sideEvents <= 4) log('system screens: side bar collapse ' + JSON.stringify(e).slice(0, 200));
        if (c !== null && c !== !!T.sideCollapsed) {
          T.sideCollapsed = c;
          sideListeners.slice().forEach(function (f) { f(); });
        }
      } catch (x) {}
      return original.apply(this, arguments);
    };
    wrapped.__zt = true;
    props.onTabCollapseStateChange = wrapped;
  }
  function SideBg(p) {
    var R = T.React, tick = typeof R.useState === 'function' && typeof R.useEffect === 'function' ? R.useState(0)[1] : null;
    if (tick) R.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      sideListeners.push(f);
      return function () { var i = sideListeners.indexOf(f); if (i >= 0) sideListeners.splice(i, 1); };
    }, []);
    var b = p.box, small = sysNum(THEME.sysSideCollapsedWidth);
    var w = T.sideCollapsed && small > 0 ? Math.min(small, b.width) : b.width;
    return R.createElement(T.rn.View, { pointerEvents: 'none', style: { position: 'absolute', left: b.left, top: b.top,
      width: w, height: b.height, backgroundColor: b.bg, borderRadius: b.radius } });
  }
  function sysSideWrap(fn, self, args, props) {
    var fs = flat(props.style), ls = props.tabListStyle && typeof props.tabListStyle === 'object' ? props.tabListStyle : {};
    var box = { left: sysNum(fs.left), top: sysNum(fs.top), width: sysNum(ls.width) || 388, height: sysNum(ls.height) || 884,
                bg: sysColor(THEME.sysSideColor, sysNum(THEME.sysSideOpacity)), radius: sysNum(THEME.sysSideCorners) };
    var el = fn.apply(self, args);
    if (!T.done['side bar background']) {
      done('side bar background');
      try { log('system screens: side bar background ' + JSON.stringify(box)); } catch (e) {}
    }
    return fn(T.Fragment, { children: [T.React.createElement(SideBg, { key: 'zt-side-bg', box: box }), el] });
  }
  /* not while the bundle starts: the editor's Apply reloads Settings and
     Trophies even when they are open, and a setBackground right then (at
     module time) crashed the ShellUI twice (Trophies). Only
     once the app has settled and is in front. */
  function sysBackgroundLater(ms) {
    clearTimeout(T.sysBgTimer);
    T.sysBgTimer = setTimeout(function () {
      var st = T.rn && T.rn.AppState ? T.rn.AppState.currentState : 'active';
      if (st && st !== 'active') { log('system screens: background not set (' + st + ')'); return; }
      sysBackground();
    }, ms);
  }
  function sysBackground() {
    var uri = sysBgUri(), sc = T.sysScene;
    if (!uri || !sc || typeof sc.setBackground !== 'function') return;
    try {
      sc.setBackground({ uri: uri });
      if (!T.done['system background']) { done('system background'); log('system screens: background ' + uri); }
    } catch (e) { log('system screens: background failed ' + e); }
  }

  /* ---- settings / trophies (debug sys): what the screens are made of ----
     Nothing is changed: every kind of element (component, testID, props)
     is logged once with its flattened style and text, the ones with a
     testID also with their place on the screen. Lines start with "map".
     Every line is a file write on the JS thread: slow, so off by default. */
  var sysSeen = {}, sysN = 0, sysLaid = {}, sysLaidN = 0, sysMods = 0, sysSheets = 0;
  function typeName(type) {
    if (typeof type === 'string') return type;
    if (!type) return '?';
    return type.displayName || type.name || (type.render && (type.render.displayName || type.render.name)) ||
           (type.type && (type.type.displayName || type.type.name)) || 'anon';
  }
  function sysValue(v) {
    if (typeof v === 'function') return 'fn';
    if (v && typeof v === 'object' && v.$$typeof) return 'el';
    try { return JSON.stringify(v).slice(0, 60); } catch (e) { return typeof v; }
  }
  function sysText(c) {
    if (typeof c === 'string' || typeof c === 'number') return String(c);
    if (Array.isArray(c)) return c.map(sysText).filter(Boolean).join(' ');
    return '';
  }
  function seeSys(type, props, key) {
    var id = typeof props.testID === 'string' ? props.testID : '';
    var name = typeName(type);
    if (id && !sysLaid[id] && sysLaidN < 80) {
      sysLaid[id] = true;
      sysLaidN++;
      var before = props.onLayout;
      props.onLayout = function (ev) {
        if (typeof before === 'function') before.apply(this, arguments);
        try {
          var l = ev.nativeEvent.layout;
          log('map layout #' + id + ' ' + Math.round(l.x) + ',' + Math.round(l.y) + ' ' +
              Math.round(l.width) + 'x' + Math.round(l.height));
        } catch (e) {}
      };
    }
    if (sysN >= 220) return;
    var sig = name + '|' + id.replace(/\d+/g, '#') + '|' + Object.keys(props).sort().join(',');
    if (sysSeen[sig]) return;
    sysSeen[sig] = true;
    sysN++;
    var summary = Object.keys(props).filter(function (k) {
      return k !== 'children' && k !== 'style' && k !== 'testID';
    }).map(function (k) { var v = sysValue(props[k]); return v === 'fn' ? k : k + '=' + v; }).join(' ');
    var st = props.style != null ? flat(props.style) : null;
    var line = 'map ' + name + (id ? ' #' + id : '') + (key != null ? ' k=' + String(key).slice(0, 30) : '') +
               (isList(type) ? ' LIST' : '') + ' :: ' + summary.slice(0, 220);
    if (st && Object.keys(st).length) { try { line += ' style=' + JSON.stringify(st).slice(0, 180); } catch (e) {} }
    var text = sysText(props.children);
    if (text) line += ' text="' + text.slice(0, 40) + '"';
    log(line);
  }
  function sysModule(exp, id) {
    findReact(exp);
    if (!T.rn && 'AppRegistry' in exp && exp.StyleSheet) T.rn = exp;
    /* the video behind Settings / Trophies is native now (C++
       zt_sys_video.cpp, in the background layer); the React view in the
       app was drawn in front of the pages and took the focus */
    if (THEME.sysOn && T.rn === exp && THEME.sysVideoInApp) sysVideoRoot(exp);
    if (THEME.sysOn && sysBgUri() && !T.sysScene && 'SceneControl' in exp) {
      try { T.sysScene = exp.SceneControl; } catch (e) {}
      sysBackgroundLater(1500);
    }
    /* back to the app (it stays open behind the Home): the Home changed the background */
    if (T.sysScene && T.rn && T.rn.AppState && !T.sysAppState) {
      T.sysAppState = true;
      try {
        T.rn.AppState.addEventListener('change', function (st) { if (st === 'active') sysBackgroundLater(400); });
      } catch (e) { log('system screens: no AppState ' + e); }
    }
    if (!DEBUG.sys) return;
    if (T.rn === exp && !T.done['StyleSheet (map)']) {
      var sheet = exp.StyleSheet, create = sheet.create;
      if (typeof create === 'function') {
        var replaced = function (s) {
          if (s && typeof s === 'object' && sysSheets < 120) {
            sysSheets++;
            var keys = Object.keys(s);
            log('map sheet ' + keys.join(',').slice(0, 300));
            keys.forEach(function (k) {
              if (sysSheets < 120 && /item|row|list|cell|container|focus|background|basemat|card|switch|toggle/i.test(k)) {
                try { log('map sheet.' + k + ' ' + JSON.stringify(s[k]).slice(0, 300)); } catch (e) {}
              }
            });
          }
          return create.apply(this, arguments);
        };
        try { sheet.create = replaced; } catch (e) {}
        if (sheet.create === replaced) done('StyleSheet (map)');
      }
    }
    if ('SceneControl' in exp) {
      var sc;
      try { sc = exp.SceneControl; } catch (e) {}
      if (sc && typeof sc === 'object' && !sc.__themeMap) {
        log('map SceneControl ' + Object.keys(sc).join(','));
        Object.keys(sc).forEach(function (k) {
          if (typeof sc[k] !== 'function') return;
          var orig = sc[k], n = 0;
          var logged = function () {
            if (n++ < 6) {
              try { log('map SceneControl.' + k + ' ' + JSON.stringify(Array.prototype.slice.call(arguments)).slice(0, 300)); } catch (e) {}
            }
            return orig.apply(this, arguments);
          };
          try { sc[k] = logged; } catch (e) {}
        });
        try { sc.__themeMap = true; } catch (e) {}
      }
    }
    if (sysMods < 80) {
      var keys = Object.keys(exp);
      var dflt = exp.default;
      var dname = dflt && typeof dflt === 'function' ? (dflt.displayName || dflt.name || '') : '';
      var look = /List|Item|Row|Switch|Toggle|Basemat|BaseMat|Categor|Menu|Panel|Background|Scene|Focus|Trophy|Card/;
      if (keys.some(function (k) { return look.test(k); }) || look.test(dname)) {
        sysMods++;
        log('map module ' + id + (dname ? ' default=' + dname : '') + ' :: ' + keys.slice(0, 30).join(',').slice(0, 300));
      }
    }
  }
  /* hub: Play / Start buttons. The hub app gets a HubAppContext value
     (module 124: isStandaloneMode, queryParams, marginTop...); under the Home
     row it is embedded, opened from the Game Library it runs standalone. The
     Game Library always keeps its buttons. */
  function seeHubContext(props) {
    var v = props.value;
    if (!v || typeof v !== 'object' || !('isStandaloneMode' in v) || !('queryParams' in v)) return;
    T.hubContext = v;
    var line;
    try { line = 'standalone=' + v.isStandaloneMode + ' queryParams=' + JSON.stringify(v.queryParams).slice(0, 300); }
    catch (e) { line = 'standalone=' + v.isStandaloneMode; }
    if (T.hubContextLine === line) return;
    T.hubContextLine = line;
    if (APP === 'hub' && THEME.fakeTrophies && !fromLibrary()) {
      var tid = hubTitleId();
      sendTrophyData({ id: tid, none: true });
      setTimeout(function () { if (hubTitleId() === tid && !fromLibrary()) fetchTrophies(tid); }, 1500);
    }
    log('hub context: ' + line + (fromLibrary() ? ' -> Game Library (buttons kept)' : ''));
  }
  function fromLibrary() {
    var c = T.hubContext;
    if (!c) return false;
    if (c.isStandaloneMode) return true;
    try { return /librar/i.test(JSON.stringify(c.queryParams || {})); } catch (e) { return false; }
  }
  function hubButtons(props) {
    /* game hub: the row with Play (ctaContainer / preCtaContainer) */
    if (THEME.hideButtons && T.ctaStyles.length && props.style) {
      for (var i = 0; i < T.ctaStyles.length; i++) {
        if (!hasStyle(props.style, T.ctaStyles[i])) continue;
        if (fromLibrary()) return;
        props.style = [props.style, { display: 'none' }];
        done('game buttons hidden');
        return;
      }
    }
    /* apps / Media hub (poster cover, module 683): Start comes in
       mainButtonComponent (in the Media app the whole poster goes). The
       pre-purchase game poster (with platforms) follows hideButtons. */
    if ('mainButtonComponent' in props && 'mainText' in props) {
      seeButton('poster', props);
      /* Media hub (NPXS40016): without Start the poster (name, text) can still
         take the focus, so ↓ still went into the hub; the whole poster goes,
         like the game hub on the Home */
      if (APP === 'media' && THEME.hideMediaButtons && !fromLibrary()) {
        done('media poster hidden');
        return true;
      }
      if (props.mainButtonComponent &&
          (('platforms' in props) ? THEME.hideButtons : THEME.hideMediaButtons) && !fromLibrary()) {
        props.mainButtonComponent = null;
        done(('platforms' in props) ? 'game buttons hidden (poster)' : 'media buttons hidden');
      }
    }
  }
  /* diagnostics: what draws Start / Play in the apps hub */
  var buttonLogs = 0;
  function seeButton(what, props, type) {
    if (buttonLogs >= 12) return;
    buttonLogs++;
    var keys = Object.keys(props).filter(function (k) { return k !== 'children'; });
    var name = typeof type === 'string' ? type : (type && (type.displayName || type.name)) || '';
    log('button ' + what + (name ? ' <' + name + '>' : '') + ' testID=' + (props.testID || '') +
        ' main=' + typeof props.mainButtonComponent + ' standalone=' + (T.hubContext && T.hubContext.isStandaloneMode) +
        ' keys=' + keys.join(',').slice(0, 300));
  }
  /* diagnostics: focus props of the Media hub layers */
  var layerLogs = {};
  function seeFocusLayer(props, type) {
    var id = props.testID;
    if (layerLogs[id]) return;
    layerLogs[id] = true;
    var name = typeof type === 'string' ? type : (type && (type.displayName || type.name)) || '';
    var out = Object.keys(props).filter(function (k) { return k !== 'children'; }).map(function (k) {
      var v = props[k];
      if (typeof v === 'function') return k + '()';
      if (v && typeof v === 'object') { try { return k + '=' + JSON.stringify(v).slice(0, 60); } catch (e) { return k + '={}'; } }
      return k + '=' + String(v).slice(0, 60);
    });
    log('layer ' + id + (name ? ' <' + name + '>' : '') + ': ' + out.join(' ').slice(0, 500));
  }
  function startLike(props) {
    var k = ['label', 'text', 'title', 'accessibilityLabel', 'children'];
    for (var i = 0; i < k.length; i++) {
      var v = props[k[i]];
      if (typeof v === 'string' && /^(start|play|iniciar|jogar)$/i.test(v.trim())) return true;
    }
    return false;
  }
  /* apps hub: R3 "Health / Privacy / Terms" comes in the key guide (props
     r3, l3, triangle, enableBackground...), not from useSystemVoice */
  function isKeyGuide(props) {
    return 'r3' in props && 'l3' in props && 'enableBackground' in props && 'triangle' in props;
  }
  /* Game/Apps Library page under a low row: each hub page is a native
     AppModule inside FocusLayerPS {style: appModule 1920x1080} (HubProvider,
     module ~113420); the page follows that layout. marginTop only goes to the
     hub app by context (the library ignores it) and the styles
     around it did nothing. The component above it (~166670) passes
     isHubFocused = (vertical position === 'hub'): while it is false the
     library page's style gets `top: libraryPeekDown` (plain layout, nothing
     animated); when the library opens it goes back to its place. */
  /* Game Library: 'pslibraryhub:main?space=game' (Apps: space=media) */
  function isLibraryUrl(u) { return /^pslibraryhub:|NPXS40071|NPXS40139/.test(String(u || '')); }
  var hubUrlLogs = {};
  /* the Home's own video wallpaper stays out of the Game / App Library
     page (drawn by the Home, under the row) while it has the focus */
  function libVideoOp() {
    var A = T.rn && T.rn.Animated;
    if (!T.libVidOp && A && A.Value) T.libVidOp = new A.Value(1);
    return T.libVidOp || null;
  }
  function libraryVideo(on) {
    if (T.libVidIn === on) return;
    T.libVidIn = on;
    var op = libVideoOp();
    if (!op) return;
    setTimeout(function () {
      try { T.rn.Animated.timing(op, { toValue: on ? 0 : 1, duration: 250, useNativeDriver: true }).start(); }
      catch (e) { try { op.setValue(on ? 0 : 1); } catch (e2) {} }
    }, 0);
    if ((T.libVidLogs = (T.libVidLogs || 0) + 1) <= 6) log('library: Home video ' + (on ? 'hidden' : 'back'));
  }
  function libraryHub(props) {
    var u = String(props.hubUrl || '');
    var lib = isLibraryUrl(u), focused = 'isHubFocused' in props;
    var tag = u + (focused ? ' focused=' + props.isHubFocused : '');
    if (!hubUrlLogs[tag] && Object.keys(hubUrlLogs).length < 16) {
      hubUrlLogs[tag] = true;
      log('library: hub page ' + tag.slice(0, 140) + ' marginTop=' + props.marginTop +
          (lib && focused ? ' style=' + JSON.stringify(props.style) : ''));
    }
    if (!lib || !focused) return;
    libraryVideo(!!props.isHubFocused);
    T.libOpened = T.libOpened || {};
    if (props.isHubFocused) { T.libOpened[u] = true; return; }
    /* libraryHideGames: the page waits out of the screen until it opens
       (its games showed under the row); always in an empty Favourites tab.
       Once the library was open it is never moved while its tile is still
       the selected one: moving that page (the selected tile's hub, the
       row's way down) sent the focus straight back into the library, so O
       never got back to the row. It goes out of the screen again when
       another tile is selected (T.selectedId, the tabs' downCandidate). */
    if (T.libOpened[u]) {
      var selLib = isLibraryUrl(T.selectedId) || T.selectedId == null;
      if (selLib) {
        if (!T.libKept || T.libKept !== u) {
          T.libKept = u;
          if ((T.libBackLogs = (T.libBackLogs || 0) + 1) <= 6) log('library: back from ' + u.slice(0, 60) + ', page left in place while its tile is selected');
        }
        /* left in place but not seen (its games showed under the row):
           opacity changes no layout, so the focus path stays the same */
        if (THEME.libraryHideGames || favEmptyNow()) {
          props.style = [props.style, { opacity: 0 }];
          if (!T.done['library page see-through']) done('library page see-through while its tile is selected');
        }
        return;
      }
      T.libOpened[u] = false;
      T.libKept = null;
      log('library: another tile selected (' + T.selectedId + '), page hidden again');
    }
    if (THEME.libraryHideGames || favEmptyNow()) {
      props.style = [props.style, { top: 2000 }];
      if (!T.done['library games hidden']) done('library games hidden until opened');
      return;
    }
    if (!(THEME.libraryPeekDown > 0)) return;
    props.style = [props.style, { top: THEME.libraryPeekDown }];
    if (!T.done['library page down']) done('library page down ' + THEME.libraryPeekDown);
  }
  function wrapJsx(fn) {
    if (typeof fn !== 'function' || fn.__theme) return fn;
    var wrapped = function (type, props) {
      if (SYS_APP) {
        if (props && typeof props === 'object') {
          if (DEBUG.sys) {
            try { seeSys(type, props, arguments[2]); } catch (e) { T.errors++; log('map: ' + e); }
          }
          if (THEME.sysOn) {
            try { sysStyle(type, props); } catch (e) { T.errors++; log('system screens: ' + e); }
            if (APP === 'settings' && sysNum(THEME.sysSideOpacity) > 0 && typeof type !== 'string' &&
                typeName(type) === 'TabViewPS' && T.Fragment && T.React && T.rn && T.rn.View) {
              try { return sysSideWrap(fn, this, arguments, props); } catch (e) { T.errors++; log('side bar: ' + e); }
            }
          }
        }
        return fn.apply(this, arguments);
      }
      /* focusShape: the focused tile's own shape (see FocusShapeSlot) */
      if (APP === 'home' && props && typeof props === 'object' && typeof props.testID === 'string' &&
          focusSlotUsed() && T.React && typeof T.React.useState === 'function') {
        if (props.testID.indexOf('focused-item-') === 0) {
          var shaped = null;
          try { shaped = focusShapeWrap(fn, this, arguments, props); } catch (e) { T.errors++; log('focus shape: ' + e); }
          if (shaped) return shaped;
        } else if (focusShapeUsed() && props.testID.indexOf('experience-switcher-') === 0 && props.style) {
          try { shapeWrapper(props); } catch (e) { T.errors++; log('focus shape: ' + e); }
        }
      }
      var shapedImage = false;
      /* taken before shapeImage makes the style an array (no video with a focus shape) */
      var tileImg = APP === 'home' && props && typeof props === 'object' && props.style &&
                    (props.style === T.tileImage || props.style === T.tileImage2);
      if (APP === 'home' && focusShapeUsed() && props && typeof props === 'object' &&
          props.source && typeof props.source === 'object' && typeof props.source.uri === 'string' && props.style &&
          (props.style === T.tileImage || props.style === T.tileImage2)) {
        try { shapedImage = shapeImage(props); } catch (e) { T.errors++; log('focus shape: ' + e); }
      }
      if (APP === 'home' && !shapedImage && customTilesUsed() && props && typeof props === 'object' &&
          props.source && typeof props.source === 'object' && typeof props.source.uri === 'string' && props.style &&
          (props.style === T.tileImage || props.style === T.tileImage2)) {
        try { tileCover(props); } catch (e) { T.errors++; log('cover: ' + e); }
      }
      /* vertical tiles, Game / App Library and All apps: their
         icon (a dark see-through square with the symbol) was stretched; they
         get a taller copy made by ZhiThemes, only the background grows.
         the focused shape (Steam 92:43 / vertical) gets a copy of its
         own shape (wider: the side columns repeat); before the animated
         tiles' Fragment (it returned before this ran) */
      if (tileImg && props.source && typeof props.source === 'object' && typeof props.source.uri === 'string') {
        var sysRatio = focusShapeUsed() && shapeUriFor(props.source.uri) ? formatRatio(focusFormat()) : tileRatio();
        if (sysRatio !== 1)
          try { systemTile(props, sysRatio); } catch (e) { T.errors++; log('system tile: ' + e); }
      }
      /* the focused tile's animated picture */
      if (tileImg && animTilesUsed() && props.source &&
          typeof props.source === 'object' && typeof props.source.uri === 'string' && T.React && T.React.Fragment) {
        var animEl = null;
        try { animEl = animTileWrap(fn, this, arguments, props); } catch (e) { T.errors++; log('animated tile: ' + e); }
        if (animEl) return animEl;
      }
      if (APP === 'home' && tileRatio() !== 1 && props && typeof props === 'object') {
        if (THEME.folders && folderVerticalStyle() === 'square') {
          if (props.source && typeof props.source === 'object' && props.style)
            try { folderSquare(props); } catch (e) { T.errors++; log('folder square: ' + e); }
          if (typeof props.testID === 'string')
            try { folderSquareView(props); } catch (e) { T.errors++; log('folder square: ' + e); }
        }
      }
      /* Options menu items (Home and Game Library): key '<MENU_ID_...>-<index>' */
      if ((APP === 'home' || APP === 'library') && typeof arguments[2] === 'string' &&
          arguments[2].indexOf('MENU_ID_') === 0) {
        var mid = arguments[2].replace(/-\d+$/, '');
        if (APP === 'library' && !T.done['library menu ' + mid]) done('library menu ' + mid);
        if (menuHidden().ids[mid]) {
          if (!T.done['menu item hidden ' + mid]) done('menu item hidden ' + mid + ' (' + APP + ')');
          return null;
        }
      }
      /* the hidden items above are null in the menu's list: out of it, the
         native menu kept an empty row for each */
      if ((APP === 'home' || APP === 'library') && props && typeof props === 'object' &&
          Array.isArray(props.contextItems) && props.contextItems.some(function (e) { return e == null || e === false; }))
        props.contextItems = props.contextItems.filter(function (e) { return e != null && e !== false; });
      if (APP === 'library' && props && typeof props === 'object') {
        libSpace(props);
        libVertical(props);
      }
      if (APP === 'library' && props && typeof props === 'object' && Array.isArray(props.contextItems))
        libraryMenu(props, fn);
      if (APP === 'home' && THEME.folders && props && typeof props === 'object' && isTileName(props)) {
        if (props.__ztSwap) delete props.__ztSwap;
        else if (folderByName(props.children) && T.React) {
          if (!T.done['folder name follows the game']) done('folder name follows the game');
          return T.React.createElement(FolderTileName, { key: arguments[2], type: type, props: props, jsx: wrapped });
        }
      }
      if ((APP === 'hub' || APP === 'media') && props && typeof props === 'object') {
        if (props.value) seeHubContext(props);
        if (APP === 'media' && typeof props.testID === 'string' && props.testID) {
          seeTestID(props.testID);
          if (/focusLayer$|^hub-preview$|^hubsdk-hub-container$|^hubsdk-content-view$/.test(props.testID))
            seeFocusLayer(props, type);
          /* Media hub without Start: the empty focus layers (hub-preview, then
             scene0-focusLayer inside hubsdk-hub-container) still took the
             focus, so ↓ went down to an empty page; the whole hub container
             goes (the background is the Home's) */
          if ((props.testID === 'hubsdk-hub-container' || props.testID === 'hub-preview') &&
              THEME.hideMediaButtons && !fromLibrary()) {
            done('media hub hidden (' + props.testID + ')');
            return null;
          }
        }
        if (THEME.hideButtons || THEME.hideMediaButtons) {
          if (hubButtons(props)) return null;
          if (startLike(props)) seeButton('start', props, type);
        }
        if (THEME.hideHints && (isKeyGuide(props) || props.testID === 'mc-key-guide')) {
          if (!T.done['hints (key guide)']) done('hints (key guide)');
          return null;
        }
      }
      if (APP === 'hub' && THEME.hideMore && props &&
          typeof props === 'object' && isMoreButton(props)) {
        if (!T.done['... button']) done('... button');
        return null;
      }
      /* "Friends who play" card (module 2594): the inner card carries
         emptyHeaderIconId 'friend' */
      if (APP === 'hub' && THEME.hideFriends && props &&
          typeof props === 'object' && props.emptyHeaderIconId === 'friend') {
        if (!T.done['friends card']) done('friends card');
        return null;
      }
      /* fake title on (or no title): the game title only while
         the focus is in the hub (hubTitleValue). the whole element
         (name Text or logo Image) goes in an Animated.View with the opacity;
         an older version put an Animated.View inside the title (a Text): the hub drew
         nothing and the Home could not go down to it */
      if (APP === 'hub' && hubTitleGated() && props && typeof props === 'object' && T.rn && T.rn.Animated &&
          T.rn.Animated.View && !props.__ztHubTitle &&
          ((T.hubTitleText && styleHas(props.style, T.hubTitleText)) ||
           (T.hubTitleLogo && styleHas(props.style, T.hubTitleLogo)))) {
        var op = hubTitleValue();
        if (op) {
          props.__ztHubTitle = true;
          if (!T.done['game title only in the hub view']) done('game title only in the hub view (' + typeName(type) + ')');
          return fn(T.rn.Animated.View, { pointerEvents: 'none', style: { opacity: op },
                                          children: fn.apply(this, arguments) }, arguments[2]);
        }
      }
      if (APP === 'hub' && THEME.fakeTrophies && props && typeof props === 'object') hubSummary(props);
      if (APP === 'hub' && props && typeof props === 'object' &&
          typeof props.testID === 'string' && props.testID) {
        if (DEBUG.on) {
          seeTestID(props.testID);
          if (/focusLayer$|-section$|-strand$/.test(props.testID)) hubFocus(props);
        }
        if (THEME.fakeTrophies && props.testID === 'wrapper-trophy-tile') sendTrophies(props.data);
        var sec = hiddenSection(props.testID);
        if (sec) {
          if (!T.done[sec]) done(sec);
          return null;
        }
        if (props.testID === 'summary-tile-trophy' && !fromLibrary()) trophiesStyle(props);
        if (/trophy-tile$|^summary-tile-trophy$/.test(props.testID) && !fromLibrary() && DEBUG.on && !T.done['props ' + props.testID]) {
          T.done['props ' + props.testID] = true;
          log('props ' + props.testID + ': ' + Object.keys(props).join(', '));
        }
      }
      if (APP === 'hub' && props && typeof props === 'object') {
        var byTitle = hiddenByTitle(props);
        if (byTitle) {
          if (!T.done[byTitle]) done(byTitle);
          return null;
        }
      }
      /* font style: only on React Native Texts (Home and hub); the rest of
         the PS5 draws text with the native engine */
      /* tabs: the unfocused tab gets another weight over the theme style
         (it ended up in light italic = the SST italic, not the new font); the
         font style goes last on the Text itself */
      if (THEME.tabsFontStyle && T.tabStyle && T.rn && type === T.rn.Text && props &&
          typeof props === 'object' && (hasStyle(props.style, T.tabStyle) ||
                                     (T.tabStyle2 && hasStyle(props.style, T.tabStyle2)))) {
        props.style = [props.style, fontStyle(THEME.tabsFontStyle)];
        if (!T.done['tabs font']) done('tabs font');
      }
      if (APP === 'home' && THEME.tileShadow > 0 && T.selected && props && typeof props === 'object' &&
          props.style && typeof props.style === 'object' && T.selected.has(props.style)) {
        /* a square folder (foldersVertical 'square') is the bottom W x W of the box */
        var sqTop = 0;
        if (tileRatio() !== 1 && THEME.folders && folderVerticalStyle() === 'square') {
          var sqExp = null;
          try { sqExp = tileExperience(props.children, 0); } catch (e) {}
          if (sqExp && String(sqExp.id).indexOf(FOLDER) === 0) sqTop = tileHeight() - THEME.tileSize;
        }
        var plates = tileShadow(sqTop);
        /* the focused tile changes shape: the plates follow it */
        if (plates.length && focusShapeUsed() && T.React && typeof T.React.useState === 'function') {
          var shExp = null;
          try { shExp = tileExperience(props.children, 0); } catch (e) {}
          if (shExp && typeof shExp.id === 'string')
            plates = [T.React.createElement(ShapeShadow, { key: 'theme-shadow-shape', id: String(shExp.id), top: sqTop })];
        }
        if (plates.length) {
          var chs = props.children;
          props.children = plates.concat(Array.isArray(chs) ? chs : chs == null ? [] : [chs]);
          if (!T.done['tile shadow']) done('tile shadow');
        }
      }
      if (APP === 'home' && THEME.tileReflection > 0 && T.selected && props && typeof props === 'object' &&
          props.style && typeof props.style === 'object' && T.selected.has(props.style)) {
        var refl = null;
        try { refl = tileReflection(props.children); } catch (e) { T.errors++; log('reflection: ' + e); }
        if (refl) {
          var chr = props.children;
          props.children = [refl].concat(Array.isArray(chr) ? chr : chr == null ? [] : [chr]);
        }
      }
      if (APP === 'home' && THEME.rowWindow && T.rowWinBy && props && typeof props === 'object' &&
          props.style && typeof props.style === 'object' && Array.isArray(props.children)) {
        try { rowWindowCount(props); } catch (e) { T.errors++; log('row window count: ' + e); }
      }
      /* rowWindow: the tile name stands right of the stock focused tile; it
         follows the focused tile (same native value as the row). A child of
         title-container, never the View itself */
      if (APP === 'home' && THEME.rowWindow && props && typeof props === 'object' && props.testID === 'title-container' &&
          (T.rowWin || T.rowWinNew) && T.rn && T.rn.Animated) {
        var rw = T.rowWin || T.rowWinNew;
        if (!T.done['row window: tile name']) done('row window: tile name');
        props.children = fn(T.rn.Animated.View, {
          style: { flexDirection: 'row', alignItems: 'center', transform: [{ translateX: rw.shift }] },
          children: props.children
        }, 'theme-name-window');
      }
      /* (clock shadow removed : duplicating or wrapping the PS5 Clock,
         which updates itself, took ShellUI down) */
      /* (textShadow* on every Text was removed: the PS5 does not draw the
         shadow and some texts, like the big title, disappeared with it) */
      /* focused shape: the name's shift (shapeExtra, see styles) is the
         width the focused shape adds in the row; in the hub / library view the
         tile is the small one (MINIMIZED_EXP_SIZE) and adds only shapeExtra *
         minScale -> the name stood far from it. Its child (never the
         title-container View itself) moves back with the Home's lift. */
      if (APP === 'home' && props && typeof props === 'object' && props.testID === 'title-container' &&
          shapeExtra() && T.homeLift && typeof T.homeLift.interpolate === 'function' && T.rn && T.rn.Animated) {
        /* on the PS5 this translateX counts twice too (-194 moved
           ~388 px, the name sat on the picture); measured on the console
           (106/168 vertical + Steam) the name needs -55 here for the stock
           44 px gap -> the theory's value / 3.5 */
        var back = Math.round(shapeExtra() * ((T.minScale > 0 ? T.minScale : 80 / THEME.focusSize) - 1) / 3.5);
        if (!T.done['tile name in the hub view']) done('tile name in the hub view (' + back + ' px)');
        props.children = fn(T.rn.Animated.View, {
          style: { flexDirection: 'row', alignItems: 'center',
                   transform: [{ translateX: T.homeLift.interpolate({ inputRange: [-150, 0], outputRange: [back, 0], extrapolate: 'clamp' }) }] },
          children: props.children
        }, 'theme-name-hub');
      }
      /* the PS5/PS4 symbol of the tile title. Hidden alone it goes (an
         invisible one would leave a gap before the name); hidden with the
         name text too, both come back in the hub view */
      if (APP === 'home' && ps5IconHidden() && props && typeof props === 'object' &&
          typeof props.testID === 'string' && props.testID.indexOf('platformIcon-') === 0) {
        if (!T.done['PS5 icon']) done('PS5 icon' + (tileTextHidden() ? ' (back in the hub view)' : ''));
        if (!tileTextHidden() || !T.rn || !T.rn.Animated) return null;
        return fn(T.rn.Animated.View, { style: { opacity: hubOpacity() }, children: fn.apply(this, arguments) },
                  'theme-hub-only');
      }
      /* the text of the tile title (no style, no testID), only in the
         hub view; the fake title is not tied to it */
      if (APP === 'home' && props && typeof props === 'object' && isTileName(props)) {
        if (oldTitles() && THEME.nameCopy && !T.oldCopyOrigin) oldCopyMeasure(props);
        if (tileTextHidden()) hubOnly(props, arguments);
      }
      /* the profile button (module 270) gets accountId/userId/presence and
         the user name in accessibilityLabel */
      if (APP === 'home' && props && typeof props === 'object' &&
          (props.accountId != null || props.onlineId != null || props.userId != null)) {
        if (!T.done['user props']) {
          T.done['user props'] = true;
          var summary = Object.keys(props).map(function (k) {
            var v = props[k];
            return k + '=' + (typeof v === 'string' ? '"' + v.slice(0, 30) + '"' : typeof v);
          }).join(', ');
          log('user props: ' + summary.slice(0, 420));
        }
        var who = typeof props.onlineId === 'string' ? props.onlineId
                : typeof props.userName === 'string' ? props.userName
                : typeof props.accessibilityLabel === 'string' ? props.accessibilityLabel : '';
        if (who) newUser(who, props.presence != null ? props.presence : props.onlineStatus);
        /* the controller's battery is asked per user */
        var uidN = typeof props.userId === 'number' ? props.userId : typeof props.userId === 'string' && /^\d+$/.test(props.userId) ? Number(props.userId) : null;
        if (uidN != null && uidN > 0 && T.homeUserId !== uidN) T.homeUserId = uidN;
      }
      if (THEME.fontStyle && T.rn && type === T.rn.Text && props && typeof props === 'object') {
        props.style = [props.style, fontStyle(THEME.fontStyle)];
        if (!T.done['font style']) done('font style');
      }
      if (APP === 'home' && props && typeof props === 'object') {
        topIcons(props, type);
        seeRow(props);
        tileLeftKeys(props);
        iconSfx(props);
        favEmptyItem(props);
        hubLayer(props);
        if ('hubUrl' in props && 'focusLayerName' in props) {
          libraryHub(props);
          hubFocusRelay(props);
          /* the hub page under a folder (its first game's): out of the screen */
          /* (not once the focus is in it: down from the folder goes there) */
          if (T.folderHubs && T.folderHubs[props.hubUrl] && T.folderSel && !props.isHubFocused) {
            props.style = [props.style, { top: 2000 }];
            if (!T.done['folder hub hidden']) done('folder hub hidden');
          }
        }
        tabItem(props);
        tabSeen(props);
        tabPill(props);
        tabIcons(props);
        tabEnds(props);
        tabWorm(props);
        barReveal(props);
        if (THEME.menuMove || THEME.menuNoDim) optionsMenu(props);
        strandProbe(props);
        strandTune(props);
        strandFollow(props);
        strandName(props);
        strandLogo(props);
        if (props.focusCustomSettings && typeof props.focusCustomSettings === 'object') {
          rowLayer(props);
          topLayers(props);
          tabsOrder(props);
          tabsAlignLayer(props);
          tabsGroup(props);
        }
        /* Game Library open: the Home only moves up SYSTEM_HEIGHT +
           VERTICAL_HEIGHT_CHANGE, so with a low row / focusY < 0 the library
           tile and its name stayed at the top of the page. The row box
           (module 26 `container`) becomes an Animated.View (always, so the
           row is not remounted) whose opacity follows the Home lift only
           while the Game Library tile is selected. */
        /* the fake title follows the row's onFocus (also without folders) */
        if (!(THEME.folders || DEBUG.on) && (titleMode() === 'fake' || focusSlotUsed() || logoOn() || THEME.rowWindow) && props.loadComponents &&
            'selected' in props && props.spaceId != null)
          folderRowProps(props);
        if (THEME.folders || DEBUG.on) {
          folderItem(props);
          if (props.loadComponents && 'selected' in props && props.spaceId != null) {
            folderRowProps(props);
            if (THEME.folders && type && typeof type !== 'string' && !type.__ztFolder) {
              var fRow = folderRowType(type);
              if (fRow) {
                var fArgs = Array.prototype.slice.call(arguments);
                fArgs[0] = fRow;
                return fn.apply(this, fArgs);
              }
            }
          }
          folderTileKeys(props);
          folderStrand(props);
        }
        /* the tall focused tile of vertical rows always peeks in at the
           top of the library, so the row hides there even with the switch off */
        /* also while animTabs is on (the tab change slides / fades the
           row in); both: the opacities multiplied */
        var libHide = false, tabA = null, favOp = null;
        if (T.rowBox && props.style === T.rowBox && T.rn && T.rn.Animated && T.rn.Animated.View) {
          libHide = (THEME.hideRowInLibrary || tileRatio() > 1) && !!T.homeLift;
          tabA = tabAnimOn() && tabAnimValues();
          /* the Favourites tab with no favourites hides its row */
          favOp = extraTabsOn() ? favEmptyOpacity() : null;
        }
        if (libHide || tabA || favOp) {
          var AN = T.rn.Animated, rowSt = {};
          if (libHide) {
            var lib = T.selectedId === 'NPXS40071' || T.selectedId === 'NPXS40139';
            rowSt.opacity = T.homeLift.interpolate({
              inputRange: [-150, 0], outputRange: [lib ? 0 : 1, 1], extrapolate: 'clamp' });
            if (!T.done['row hidden in library']) done('row hidden in library');
          }
          if (tabA) {
            if (!libHide) rowSt.opacity = tabA.op;
            else if (typeof AN.multiply === 'function') rowSt.opacity = AN.multiply(rowSt.opacity, tabA.op);
            var rowTf = [{ translateX: tabA.x }];
            rowSt.transform = (Array.isArray(T.rowBox.transform) ? T.rowBox.transform : []).concat(rowTf);
            if (!T.done['tab animation ready']) done('tab animation ready');
          }
          if (favOp) {
            if (rowSt.opacity == null) rowSt.opacity = favOp;
            else if (typeof AN.multiply === 'function') rowSt.opacity = AN.multiply(rowSt.opacity, favOp);
          }
          props.style = [props.style, rowSt];
          var rowArgs = Array.prototype.slice.call(arguments);
          rowArgs[0] = AN.View;
          return fn.apply(this, rowArgs);
        }
      }
      if (APP === 'home' && props && typeof props === 'object' && props.iconSize &&
          props.icon != null) {
        if (!T.ButtonType && typeof type !== 'string') T.ButtonType = type;
        if (DEBUG.on && !T.done['icon props']) {
          T.done['icon props'] = true;
          log('top icon props: ' + Object.keys(props).join(', '));
        }
      }
      if (APP === 'home' && typeof T.hubMargin === 'number' && props && typeof props === 'object' &&
          'HubCache' in props && props.hubStyles && typeof props.marginTop === 'number') {
        props.marginTop = T.hubMargin; /* hubOffset only changes the Home lift */
        if (!T.done['hub margin']) done('hub margin ' + props.marginTop);
      }
      /* library: what holds the page (for the clipped last line) */
      if (APP === 'library' && props && typeof props === 'object') seeLibrary(type, props);
      if (DEBUG.on && (APP === 'hub' || APP === 'library') && props &&
          typeof props === 'object') mapPart(type, props);
      if (THEME.measureScreen && props && typeof props === 'object' &&
          props.style != null && marks.size) {
        var name = nameOfStyle(props.style);
        if (name) withMeasure(name, props);
      }

      if ((THEME.tileNameColor || THEME.tileNameFontStyle) && props && typeof props === 'object' &&
          isTileName(props)) {
        var nameStyle = {};
        if (THEME.tileNameColor) nameStyle.color = THEME.tileNameColor;
        if (THEME.tileNameFontStyle) merge(nameStyle, fontStyle(THEME.tileNameFontStyle));
        props.style = [props.style, nameStyle];
      }
      if ((THEME.footer || THEME.bgDim > 0 || THEME.bgGradient > 0 || THEME.bgOverlayOn || videoUri() || bgVideosUsed() ||
           THEME.bgVignette > 0 || THEME.bgEdges > 0 || THEME.particlesOn || THEME.ownClock ||
           THEME.topBarBgOn || THEME.footerBgOn || titleMode() === 'fake' || THEME.logoOn ||
           THEME.box1On || THEME.box2On || THEME.box3On || THEME.user ||
           THEME.searchDetached || THEME.settingsDetached || THEME.profileDetached || THEME.iconsNav ||
           THEME.fakeTrophies || THEME.deco1On || THEME.deco2On || THEME.deco3On || THEME.deco4On ||
           THEME.folders || THEME.menuMove || THEME.playInfoOn || extraTabsOn() || THEME.animToast || THEME.debugOverlay) &&
          T.root && props && typeof props === 'object' && props.style === T.root) {
        var children = props.children;
        children = Array.isArray(children) ? children.slice() : children == null ? [] : [children];
        var bg = backgroundElements();
        if (bg.length) {
          children = single('back', homeLayer('theme-layer-back', bg)).concat(children);
          if (!T.done.background) done('background');
        }
        var front = [];
        if (THEME.user && T.React)
          front.push(T.React.createElement(User, { key: 'theme-user' }));
        front = front.concat(detachedIcons());
        if (THEME.ownClock && T.React && APP === 'home' && typeof T.React.useState === 'function')
          front.push(T.React.createElement(OwnClock, { key: 'theme-own-clock' }));
        if (titleMode() === 'fake' && T.React && APP === 'home')
          front.push(T.React.createElement(FakeTitle, { key: 'theme-fake-title' }));
        if (extraTabsOn() && T.React && APP === 'home' && typeof T.React.useState === 'function')
          front.push(T.React.createElement(FavEmptyMsg, { key: 'theme-fav-empty' }));
        if (logoOn() && T.React && typeof T.React.useState === 'function')
          front.push(T.React.createElement(GameLogo, { key: 'theme-game-logo' }));
        if (THEME.folders && titleMode() !== 'fake' && THEME.foldersTitle !== false && T.React && APP === 'home')
          front.push(T.React.createElement(FolderTitle, { key: 'theme-folder-title' }));
        if (THEME.fakeTrophies && T.React && APP === 'home')
          front.push(T.React.createElement(HomeTrophies, { key: 'theme-trophies' }));
        if (THEME.playInfoOn && T.React && APP === 'home')
          front.push(T.React.createElement(PlayInfo, { key: 'theme-play-info' }));
        if (toastOn())
          front.push(T.React.createElement(FavBurst, { key: 'theme-fav-burst' }));
        front = front.concat(decoElements());
        if (THEME.folders && T.React && APP === 'home')
          front.push(T.React.createElement(FolderStrip, { key: 'theme-folder-strip' }));
        if (THEME.menuMove && T.React && APP === 'home')
          front.push(T.React.createElement(MenuAnchor, { key: 'theme-menu-anchor' }));
        var extra = THEME.footer ? footerElement() : null;
        if (extra) {
          front.push(extra);
          if (!T.done['footer']) done('footer');
        }
        /* the debug panel, over everything */
        if (THEME.debugOverlay && T.React && APP === 'home' && typeof T.React.useState === 'function')
          front.push(T.React.createElement(DebugPanel, { key: 'theme-debug-panel' }));
        props.children = front.length ? children.concat(single('front', homeLayer('theme-layer-front', readyGate(front))))
                                      : children;
      }
      return fn.apply(this, arguments);
    };
    wrapped.__theme = true;
    return wrapped;
  }
  function hookJsx(exp) {
    if (!T.Fragment && exp && exp.Fragment) T.Fragment = exp.Fragment;
    var needed = APP === 'library' || SYS_APP || (APP === 'media' && (THEME.hideMediaButtons || THEME.hideHints)) || THEME.measureScreen || DEBUG.on || titleMode() !== 'game' || THEME.fontStyle ||
                 THEME.tileNameFontStyle || THEME.searchIcon || THEME.settingsIcon ||
                 THEME.searchDetached || THEME.settingsDetached || THEME.profileDetached || THEME.iconsNav ||
                 THEME.fakeTrophies || THEME.folders || THEME.menuMove || THEME.menuNoDim ||
                 THEME.tabsPillOn || THEME.playInfoOn || THEME.animToast || THEME.animButtons || THEME.debugOverlay ||
                 customTilesUsed() || tileRatio() !== 1 || tileGap() !== 8 || tileTextHidden() ||
                 THEME.menuOffline || THEME.menuHideIds ||
                 THEME.textShadow > 0 || ps5IconHidden() || THEME.user ||
                 (APP === 'home' ? (THEME.footer || THEME.tileNameColor)
                                 : APP === 'hub' && (THEME.hideMore || THEME.hideFriends ||
                                                     THEME.hideButtons || THEME.hideMediaButtons || THEME.hideHints));
    if (!needed || !exp ||
        typeof exp !== 'object' || typeof exp.jsx !== 'function' ||
        typeof exp.jsxs !== 'function' || !('Fragment' in exp) ||
        exp.jsx.__theme)
      return;
    try {
      exp.jsx = wrapJsx(exp.jsx);
      exp.jsxs = wrapJsx(exp.jsxs);
    } catch (e) { log('jsx not replaceable: ' + e); return; }
    if (exp.jsx.__theme) done('jsx');
  }

  /* ---- hub: "Friends who play" card and button hints ----
     The card is only drawn when useIsFriendsWhoPlayEnabled() returns true
     (read at draw time); with hideFriends it becomes false.
     The R3 (Health/Ratings/Privacy/Terms), L3 and △ hints are set by
     useSystemVoice() with navigation.setParams({systemVoice}); with
     hideHints, the functions it returns do nothing. */
  function nothing() {}
  function hookHub(exp) {
    if (APP !== 'hub' || !exp || typeof exp !== 'object') return;
    ['useIsFriendsWhoPlayEnabled', 'isFriendsWhoPlayEnabledForUser'].forEach(
        function (name) {
          var f = exp[name];
          if (!THEME.hideFriends || typeof f !== 'function' || f.__theme)
            return;
          var no = function () { return false; };
          no.__theme = true;
          if (replace(exp, name, no)) done('friends (' + name + ')');
        });
    var voice = exp.useSystemVoice;
    if (THEME.hideHints && typeof voice === 'function' && !voice.__theme) {
      var silent = function () {
        var r = voice.apply(this, arguments);
        return Array.isArray(r)
                   ? r.map(function (x) { return typeof x === 'function' ? nothing : x; })
                   : r;
      };
      silent.__theme = true;
      if (replace(exp, 'useSystemVoice', silent)) done('hints (useSystemVoice)');
    }
  }

  /* ---- wallpaper: the Home and the hub ask for the screen background with
     SceneControl.setBackground({uri, basemat...}) (module 90, native);
     with wallpaperOn the uri becomes the user's image ---- */
  function overlayUri() {
    var n = THEME.bgOverlay;
    if (!THEME.bgOverlayOn || typeof n !== 'string' || !n) return null;
    return 'file://' + (n.charAt(0) === '/' ? n : ztPath('wallpapers', n));
  }
  function wallpaperUri() {
    var n = THEME.wallpaper;
    if (!THEME.wallpaperOn || THEME.bgClean || typeof n !== 'string' || !n || isVideo(n)) return null;
    return 'file://' + (n.charAt(0) === '/' ? n : ztPath('wallpapers', n));
  }
  /* .mp4 wallpaper: the video player only plays http, so ZhiThemes serves
     backgrounds/ on 127.0.0.1:4445 (C++ theme_web.cpp); the native background keeps the game art (hubs, library) */
  function isVideo(n) { return /\.(mp4|m4v)$/i.test(String(n || '')); }
  /* the same .mp4 behind Settings and Trophies (sysBgWallpaper): the
     C++ player in the system background layer plays it for the Home too
     (one player, no restart between screens); the Home's own video is off */
  function nativeVideoShared() {
    return !!(THEME.sysOn && THEME.sysBgWallpaper && THEME.wallpaperOn && !THEME.bgClean && isVideo(THEME.wallpaper));
  }
  function videoUri() {
    var n = THEME.wallpaper;
    if (!THEME.wallpaperOn || THEME.bgClean || typeof n !== 'string' || !isVideo(n) || nativeVideoShared()) return null;
    return 'http://127.0.0.1:4445/v/' + n.split('/').pop();
  }
  /* The Home asks for the background of every focused tile
     ({uri: '/user/appmeta/PPSA18026/pic0.dds...'}): the title id in it says
     which tile is focused. The Home trophies only show for that tile (the
     Game Library tile and the Media apps do not use the game hub, so the
     last game's trophies stayed on screen). */
  function focusedFrom(img) {
    var uri = img && typeof img === 'object' ? String(img.uri || '') : '';
    var m = /([A-Z]{4}\d{5})/.exec(uri), id = m ? m[1] : '';
    if (id === T.focusedId) return;
    T.focusedId = id;
    T.focusLogs = (T.focusLogs || 0) + 1;
    if (THEME.fakeTrophies && T.focusLogs <= 20) log('focused tile: ' + (id || '(none) ' + uri.slice(0, 80)));
    tileChanged();
  }
  var tileListeners = [];
  function tileChanged() {
    if (APP === 'home' && THEME.fakeTrophies && THEME.fakeTrophiesFast !== false) trophiesForFocused();
    setTimeout(function () { tileListeners.forEach(function (f) { try { f(); } catch (e) {} }); }, 0);
  }
  /* Fake trophies: the ones already received show at once (cache); others are
     asked to the hub right away instead of waiting for its page to load and
     fetch them (it felt slow, folder or not) */
  var trophyAsked = {};
  function trophiesForFocused() {
    var id = T.focusedId;
    if (!id) return;
    var c = T.trophyCache && T.trophyCache[id];
    if (c) {
      if (T.trophies !== c) {
        T.trophies = c;
        setTimeout(function () { trophyListeners.forEach(function (f) { try { f(c); } catch (e) {} }); }, 0);
      }
      return;
    }
    askTrophies([id]);
  }
  function askTrophies(ids) {
    var now = Date.now();
    ids = ids.filter(function (id) {
      if (!id || (T.trophyCache && T.trophyCache[id]) || now - (trophyAsked[id] || 0) < 20000) return false;
      trophyAsked[id] = now;
      return true;
    });
    if (ids.length) try { console.log('THEME-TROPHY-ASK ' + ids.join(',')); } catch (e) {}
  }
  /* ---- custom game backgrounds ----
     Pictures in /data/ZhiThemes/Assets/custombg, listed by ZhiThemes at every Home
     and hub start (globalThis.__ztCustomBgs): <titleId>_16x9_<n>.png|jpg
     (uploaded 16:9 pictures, or made by the PS5 from a SteamGridDB hero).
     setBackground gets the game's art ({uri: .../<titleId>/pic0...}): a
     game with backgrounds gets its background 1, or the one picked in the
     editor (customBgChoice 'ID:n', 0 = its own art). */
  var bgFiles = null, bgPicks = null;
  function bgPics(key) {
    if (!bgFiles) {
      bgFiles = {};
      var list = globalThis.__ztCustomBgs;
      (Array.isArray(list) ? list : []).forEach(function (f) {
        var m = /^([A-Za-z]{4}\d{5})_16x9_(\d+)\.(png|jpe?g)$/i.exec(String(f));
        if (!m) return;
        var id = m[1].toUpperCase();
        (bgFiles[id] = bgFiles[id] || []).push({ n: parseInt(m[2], 10), file: String(f) });
      });
      for (var id in bgFiles) bgFiles[id].sort(function (x, y) { return x.n - y.n; });
    }
    return bgFiles[key] || [];
  }
  function bgChoice(key) {
    if (!bgPicks) {
      bgPicks = {};
      String(THEME.customBgChoice || '').split(';').forEach(function (t) {
        var m = /^\s*([A-Za-z]{4}\d{5})\s*:\s*(\d+)\s*$/.exec(t);
        if (m) bgPicks[m[1].toUpperCase()] = parseInt(m[2], 10);
      });
    }
    return key in bgPicks ? bgPicks[key] : 1;
  }
  var bgLogs = 0;
  function customBgUri(img) {
    if (THEME.customBgOn === false || THEME.bgClean || !img || typeof img !== 'object') return null;
    var m = /\/([A-Za-z]{4}\d{5})(?:_\d+)?\//.exec(String(img.uri || ''));
    if (!m || /^NPXS/i.test(m[1])) return null;
    var key = m[1].toUpperCase(), pics = bgPics(key), c = bgChoice(key);
    if (!pics.length || c === 0) return null;
    var pick = pics[0];
    pics.forEach(function (p) { if (p.n === c) pick = p; });
    var uri = 'file:///user/data/ZhiThemes/Assets/custombg/' + pick.file;
    if (bgLogs++ < 6) log('custom background: ' + key + ' -> ' + pick.file);
    return uri;
  }
  /* ---- animated game backgrounds ----
     <ID>_16x9_<n>.mp4 next to the background PNG (made by the editor from an
     animated hero / upload): while that game is the focused tile (the Home
     asks for its background: focusedFrom -> tileChanged) the video plays in
     the Home's back layer over the still one, from 127.0.0.1:4445/b/.
     Not with your wallpaper on (the wallpaper wins) nor in a folder. */
  var bgVideoFiles = null;
  function bgVideosUsed() {
    if (APP !== 'home' || THEME.customBgOn === false || THEME.bgClean || THEME.tileAnimOn === false) return false;
    if (!bgVideoFiles) {
      bgVideoFiles = {};
      var n = 0;
      (Array.isArray(globalThis.__ztCustomBgs) ? globalThis.__ztCustomBgs : []).forEach(function (f) {
        var m = /^([A-Za-z]{4}\d{5}_16x9_\d+)\.mp4$/i.exec(String(f));
        if (m) { bgVideoFiles[m[1].toLowerCase()] = String(f); n++; }
      });
      T.bgVideoCount = n;
      log('animated backgrounds: ' + n + ' videos');
    }
    return T.bgVideoCount > 0;
  }
  function bgVideoFor(id) {
    var key = customKey(id || '');
    if (!key || wallpaperSet() || T.folderSel) return '';
    var pics = bgPics(key), c = bgChoice(key);
    if (!pics.length || c === 0) return '';
    var pick = pics[0];
    pics.forEach(function (p) { if (p.n === c) pick = p; });
    return bgVideoFiles[pick.file.replace(/\.\w+$/, '').toLowerCase()] || '';
  }
  function BgVideo() {
    var React = T.React;
    var tick = React.useState(0)[1];
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      tileListeners.push(f);
      return function () { var i = tileListeners.indexOf(f); if (i >= 0) tileListeners.splice(i, 1); };
    }, []);
    var file = bgVideoFor(T.shapeFocus || T.focusedId || T.strandSel);
    if (!file) return null;
    return React.createElement(AnimTileVideo, { key: file, file: file, dir: 'b', w: 1920, h: 1080, focused: true });
  }

  /* Bloodborne (no pic0) with its own background showed it and lost it
     at once: after the request with the record's file (ownBgRecords) another
     one came without a game in its uri (empty / the default art). Such a
     request right after the same game's own background, or in a hub of a
     game with one, keeps the game's own background. */
  var sameBgLogs = 0, bgTrace = 0, keepLogs = 0;
  function sameGameBg(img) {
    if (THEME.customBgOn === false || THEME.bgClean || T.folderSel || wallpaperSet()) return img;
    var uri = img && typeof img === 'object' ? String(img.uri || '') : '';
    if (/\/custombg\//.test(uri)) {
      var mo = /([A-Z]{4}\d{5})_16x9_/.exec(uri);
      if (mo) T.ownBgId = mo[1];
      return img;
    }
    /* a local file of a game (/user/appmeta/<id>/...): customBgUri sees it */
    var local = /\/([A-Z]{4}\d{5})(?:_\d+)?\//.exec(uri);
    if (local) return img;
    /* the hub of a game asks for its art with a uri without the
       game's folder (Bloodborne: it fails and the hub's fallbackUri, the
       default space picture, showed; the Home's own background went):
       the hub's game, when it has its own background. With your wallpaper
       on the hub keeps the old way (in a folder the wallpaper wins). */
    var id = APP === 'hub' ? (wallpaperSet() ? '' : hubTitleId())
           /* Home: only while the focused tile is still that game (the
              last game asked for, T.focusedId; the strand's selectedItem
              lags behind: the log had PPSA22520 with Bloodborne focused) */
           : APP === 'home' && T.ownBgId && T.focusedId === T.ownBgId ? T.ownBgId : '';
    if (!id) return img;
    var own = customBgUri({ uri: '/' + id + '/' });
    if (!own) return img;
    var copy = {};
    if (img && typeof img === 'object') for (var k in img) copy[k] = img[k];
    copy.uri = '/' + id + '/';
    if (sameBgLogs++ < 6) log('background without a game (' + (uri || 'none') + ') -> own one of ' + id);
    return copy;
  }
  /* bgClean: every background request (Home, hub, folders, games without
     art) becomes the stock system background (BGLayer base + light).
     bgCleanTry: 2 = an empty uri (default) and 3 = no uri + basemat None
     show it at once; 1 = a missing picture shows it only after the PS5
     gives up loading (black for a few seconds after a reload); 4 = a
     transparent picture is drawn over a black base. The game's fallback
     picture (bg_hub_default) is never left in. */
  var cleanLogs = 0;
  function cleanBg(img) {
    var copy = {};
    if (img && typeof img === 'object') for (var k in img) copy[k] = img[k];
    var mode = Number(THEME.bgCleanTry) || 2;
    delete copy.blurUri;
    if (mode === 3) {
      delete copy.uri;
      delete copy.fallbackUri;
      copy.basemat = 'None';
    } else if (mode === 4) {
      /* a transparent picture: drawn over a black base (all black) */
      copy.uri = 'file://' + ZT_ASSETS + 'particles/bg_clear.png';
      copy.fallbackUri = copy.uri;
    } else if (mode === 2) {
      copy.uri = '';
      delete copy.fallbackUri;
    } else {
      /* a picture that does not exist, no fallback: the PS5 keeps its own
         background with the light at the top (as an app without art
         before its fallback picture arrives) */
      copy.uri = '/user/data/ZhiThemes/Assets/particles/zt_no_background.dds';
      delete copy.fallbackUri;
    }
    if (mode !== 3 && !copy.basemat) copy.basemat = 'EllipseNarrow';
    if (!copy.type) copy.type = 'Fade';
    if (cleanLogs++ < 4) log('clean background (try ' + mode + '): ' + JSON.stringify(copy).slice(0, 200));
    return copy;
  }
  /* ---- Home music (Sounds tab) ----
     The Home asks for the focused tile's music with
     SceneControl.setSystemBgm({src: <its snd0>, type: 'AppSnd0'})
     (useBackgroundImageAndMusic) and passes null for a tile without one
     (system tiles, games without music): that null becomes the theme's
     music. homeMusicPlayer 'system' hands the file to the same PS5 music
     player; 'video' plays it with the video player (HomeMusic) instead. */
  /* not working on the PS5 yet (the Sounds tab is greyed out in the
     editor): off whatever a theme says, no hook, the Home as stock */
  var HOME_MUSIC_READY = false;
  function homeMusicFile() {
    if (!HOME_MUSIC_READY) return '';
    var n = THEME.homeMusic;
    if (APP !== 'home' || !THEME.homeMusicOn || typeof n !== 'string' || !n) return '';
    return n;
  }
  /* the PS5's music player of the games stayed silent with .mp3 and .mp4: always the video player */
  function homeMusicVideo() { return true; }
  /* a game's own music is its snd0 under /user/ (appmeta, app); any
     other request (the system's own sound for a tile without one) is
     replaced by the theme's music */
  function gameMusic(bgm) {
    if (!bgm || typeof bgm !== 'object') return false;
    if (THEME.homeMusicGames) return false;
    return /^(file:\/\/)?\/user\//.test(String(bgm.src || bgm.uri || ''));
  }
  var musicListeners = [], musicLogs = 0;
  function setMusicWanted(on) {
    if (T.musicWanted === on) return;
    T.musicWanted = on;
    if (musicLogs++ < 12) log('home music: ' + (on ? 'tile without music, theme music on' : 'tile with its own music'));
    setTimeout(function () { musicListeners.forEach(function (f) { try { f(); } catch (e) {} }); }, 0);
  }
  function hookMusic(sc) {
    if (!HOME_MUSIC_READY || APP !== 'home' || !sc || typeof sc.setSystemBgm !== 'function' || sc.setSystemBgm.__theme) return;
    var original = sc.setSystemBgm;
    var replaced = function (bgm) {
      var file = homeMusicFile();
      /* after a game (the Home went to the background) the PS5 player
         may have stopped: the next request is sent again */
      var AS = T.rn && T.rn.AppState;
      if (AS && !T.musicAS && typeof AS.addEventListener === 'function') {
        T.musicAS = true;
        try { AS.addEventListener('change', function () { T.musicOurs = false; }); } catch (e) {}
      }
      if (file && (T.askLogs = (T.askLogs || 0) + 1) <= 30) { try { log('home music: the Home asks ' + JSON.stringify(bgm).slice(0, 160)); } catch (e) {} }
      if (!file || gameMusic(bgm)) {
        T.musicOurs = false;
        if (file) setMusicWanted(false);
        return original.apply(this, arguments);
      }
      setMusicWanted(true);
      /* the theme's music plays: the system's own one is stopped */
      if (homeMusicVideo()) { T.musicOurs = false; return original.call(this, null); }
      /* already playing it: not started again on every tile */
      if (T.musicOurs) return undefined;
      T.musicOurs = true;
      var ask = { src: ztPath('wallpapers', file), type: 'AppSnd0' };
      if (musicLogs++ < 12) log('home music: system player ' + JSON.stringify(ask));
      try { return original.call(this, ask); } catch (e) {
        log('home music: ' + e);
        T.musicOurs = false;
        return original.apply(this, arguments);
      }
    };
    replaced.__theme = true;
    try { sc.setSystemBgm = replaced; } catch (e) {}
    if (sc.setSystemBgm === replaced) done('home music hook'); else log('home music: setSystemBgm not replaceable');
  }
  /* homeMusicPlayer 'video': the file played by a small native video
     player in the back layer (not hidden: a hidden player stalls), paused
     while a tile has its own music or the Home is in the background */
  function HomeMusic() {
    var React = T.React, rn = T.rn, Video = videoComponent();
    var tick = React.useState(0)[1];
    var AS = rn.AppState;
    var away = function (s) { return /background/i.test(String(s || '')); };
    var st = React.useState(!away(AS && AS.currentState)), active = st[0], setActive = st[1];
    var tries = React.useState(0), attempt = tries[0], setAttempt = tries[1];
    var restarts = React.useState(0), restart = restarts[0], setRestart = restarts[1];
    var kinds = ['fullHD', '', 'UHD'];
    React.useEffect(function () {
      var f = function () { tick(function (n) { return n + 1; }); };
      musicListeners.push(f);
      var sub = null;
      var onChange = function (s) { setActive(!away(s)); if (!away(s)) setAttempt(0); };
      if (AS && typeof AS.addEventListener === 'function') try { sub = AS.addEventListener('change', onChange); } catch (e) {}
      return function () {
        var i = musicListeners.indexOf(f); if (i >= 0) musicListeners.splice(i, 1);
        try { if (sub && sub.remove) sub.remove(); else if (AS) AS.removeEventListener('change', onChange); } catch (e) {}
      };
    }, []);
    var file = homeMusicFile();
    if (!Video || !file || attempt >= kinds.length) return null;
    var uri = 'http://127.0.0.1:4445/v/' + file.split('/').pop(), kind = kinds[attempt];
    var source = { source: uri, autoLoad: true };
    if (kind) source.coreResourceType = kind;
    var vol = THEME.homeMusicVolume == null ? 0.5 : Math.max(0, Math.min(1, +THEME.homeMusicVolume || 0));
    var play = active && T.musicWanted === true;
    if (T.musicLogged !== uri + kind) { T.musicLogged = uri + kind; log('home music: video player ' + uri + ' (' + (kind || 'no resource type') + ')'); }
    return React.createElement(rn.View, {
      pointerEvents: 'none',
      style: { position: 'absolute', left: 0, top: 0, width: 8, height: 8, opacity: 0.01 }
    }, React.createElement(Video, {
      key: 'm' + attempt + '-' + restart,
      pointerEvents: 'none',
      source: source,
      repeat: true, paused: !play, muted: false, volume: vol,
      suppressBgm: false, resizeMode: 'cover',
      onStartPlaying: function (e) { if (!T.done['home music playing']) { videoEvent('home music playing', e); done('home music playing'); } },
      onError: function (e) {
        var ev = e && e.nativeEvent ? e.nativeEvent : e;
        try { log('home music: error ' + JSON.stringify(ev).slice(0, 200)); } catch (x) {}
        if (attempt + 1 >= kinds.length) log('home music: ' + file + ' not played by the video player (try .m4a / .mp4 AAC)');
        setAttempt(attempt + 1);
      },
      onEnd: function () { if (restart < 500) setTimeout(function () { setRestart(restart + 1); }, 50); },
      style: { position: 'absolute', left: 0, top: 0, width: 8, height: 8 }
    }));
  }
  function hookBackground(exp) {
    var sc;
    try { sc = exp.SceneControl; } catch (e) { return; }
    hookMusic(sc);
    if (!sc || typeof sc.setBackground !== 'function' || sc.setBackground.__theme) return;
    var original = sc.setBackground;
    var replaced = function (img) {
      var asked = img && typeof img === 'object' ? String(img.uri || '') : String(img);
      if (THEME.bgClean) {
        /* the focused game still comes from the uri asked (trophies, names) */
        if (APP === 'home') focusedFrom(img);
        if (img && typeof img === 'object') T.lastBgImg = img;
        if (!T.done['clean background']) done('clean background');
        return original.call(this, cleanBg(img));
      }
      /* in a folder, a request with the hub's default picture (a game
         with no pic0: Bloodborne alone in a folder) keeps the background the
         theme showed last (the strip game's own one, or the folder's) */
      /* never a system tile's picture (the Media Gallery's dark
         bg_NPXS40075.dds stayed when the folder was reached from the
         Gallery tile): then the folder's own background, else as asked */
      var keepUri = T.lastShownBg;
      if (/\/system_ex\/vsh_asset\/bg_NPXS/.test(String(keepUri || '')))
        keepUri = (T.folderBgOf || {})[T.folderSel] || '';
      if (APP === 'home' && T.folderSel && keepUri && /bg_hub_default/.test(asked) &&
          img && typeof img === 'object') {
        var keep = {};
        for (var kk in img) keep[kk] = img[kk];
        keep.uri = keepUri;
        if (keepLogs++ < 6) log('folder: default picture asked, keeping ' + String(keepUri).slice(0, 100));
        return original.call(this, keep);
      }
      img = sameGameBg(img);
      /* every request (Bloodborne's own background went away again) */
      if (bgTrace++ < 20)
        log('bg ' + (APP === 'hub' ? 'hub ' + hubTitleId() : 'row ' + (T.focusedId || '?')) + ': ' + asked.slice(0, 160) +
            (img && typeof img === 'object' && String(img.uri || '') !== asked ? ' => ' + String(img.uri).slice(0, 80) : '') +
            (img && img.fallbackUri ? ' (fallback ' + String(img.fallbackUri).split('/').pop() + ')' : ''));
      if (APP === 'home') focusedFrom(img);
      if (img && typeof img === 'object') {
        T.lastBgImg = img;
        if (T.folderSel) T.folderBgImg = img;
      }
      if (!T.done['background requested']) {
        T.done['background requested'] = true;
        log('background requested: ' + JSON.stringify(img).slice(0, 300));
      }
      /* a game's own background before the wallpaper */
      /* a folder with your wallpaper on shows the wallpaper, not its
         first game's own background */
      /* (user): your wallpaper, when it is on, always comes before a
         game's own background (row, folder, hub) */
      var mine = folderBgUri(img) || (wallpaperSet() ? wallpaperUri() : customBgUri(img));
      /* a request that already is a game's own background (the record of
         a game without pic0, ownBgRecords) stays as it is */
      if (!wallpaperSet() && img && typeof img === 'object' && /\/custombg\//.test(String(img.uri || '')) &&
          !/\/zt_fbg_/.test(mine))
        mine = '';
      if (mine) {
        var copy = {};
        if (img && typeof img === 'object') for (var k in img) copy[k] = img[k];
        else for (var lk in (T.lastBgImg || {})) copy[lk] = T.lastBgImg[lk];
        if (!copy.type) copy.type = 'Fade';
        copy.uri = mine;
        if (/\/zt_fbg_/.test(mine)) {
          if (T.folderSel) (T.folderBgOf = T.folderBgOf || {})[T.folderSel] = mine;
          if (!T.done['folder background']) done('folder background ' + mine);
        }
        else if (/\/custombg\//.test(mine)) { if (!T.done['custom background']) done('custom background'); }
        else if (!T.done['own wallpaper']) done('own wallpaper ' + mine);
        if (APP === 'home') T.lastShownBg = copy.uri;
        return original.call(this, copy);
      }
      if (APP === 'home' && img && typeof img === 'object' && img.uri && !/bg_hub_default/.test(String(img.uri)))
        T.lastShownBg = img.uri;
      return original.apply(this, arguments);
    };
    replaced.__theme = true;
    try {
      var names = [];
      for (var nk in sc) if (typeof sc[nk] === 'function') names.push(nk);
      log('SceneControl (' + APP + '): ' + names.join(',').slice(0, 300));
    } catch (e) {}
    try { sc.setBackground = replaced; } catch (e) { return; }
    if (sc.setBackground !== replaced) { log('background: setBackground not replaceable'); return; }
    T.setBackground = original;
    T.sceneControl = sc;
    done('screen background');
    /* the Home shows it right away, without waiting for the next focused game */
    if (APP === 'home' && THEME.bgClean) {
      try { original.call(sc, cleanBg(T.lastBgImg)); } catch (e) { log('background: ' + e); }
    } else if (APP === 'home' && wallpaperUri()) {
      try { original.call(sc, { uri: wallpaperUri() }); } catch (e) { log('background: ' + e); }
    }
  }
  function afterModule(module, id) {
    try {
      var exp = module && module.exports;
      /* some modules export text or numbers: 'in' only works on objects */
      if (!exp || (typeof exp !== 'object' && typeof exp !== 'function'))
        return;
      /* ZhiThemes off: the Home stays stock, only Options > ZhiThemes */
      if (STOCK) {
        findReact(exp);
        hookOptionsMenu(exp);
        return;
      }
      /* settings (NPXS40008) and trophies (NPXS40025): only their own look */
      if (SYS_APP) {
        sysModule(exp, id);
        hookJsx(exp);
        return;
      }
      if ('AppRegistry' in exp && APP !== 'media') hookStyleSheet(exp);
      /* library: only background and diagnostics; the rest of the theme
         (tile sizes, icons, row) belongs to the Home */
      if (APP === 'library') {
        findReact(exp);
        if ('SceneControl' in exp) hookBackground(exp);
        hookNativeOptionMenu(exp);
        hookJsx(exp);
        return;
      }
      /* hub module 2558: the hook that fetches the card row data
         ({trophyFetchStatus, trophyData, friendsData...}) */
      if (APP === 'hub' && THEME.fakeTrophies && String(id) === '2558' && typeof exp.default === 'function' &&
          !exp.default.__theme) {
        var fetchHook = exp.default;
        var wrappedHook = function () {
          var r = fetchHook.apply(this, arguments);
          try { if (r && r.trophyData) sendTrophies(r.trophyData, 'hook'); } catch (e) {}
          return r;
        };
        wrappedHook.__theme = true;
        try { exp.default = wrappedHook; } catch (e) {}
        if (exp.default === wrappedHook) done('trophies hook (2558)');
        else log('trophies hook (2558) not replaceable');
      }
      /* media (NPXS40016 "monte-carlo", the hub of the Media space: YouTube,
         Discover, All apps...): only the Start button and the hints */
      if (APP === 'media') {
        findReact(exp);
        if (!T.libRN && 'AppRegistry' in exp && exp.AppState) T.libRN = exp;
        hookJsx(exp);
        return;
      }
      if (!T.IconPS && exp.IconPS && typeof exp.IconPS !== 'string') T.IconPS = exp.IconPS;
      if (!T.FocusLayer && exp.FocusLayerPS && typeof exp.FocusLayerPS !== 'string') T.FocusLayer = exp.FocusLayerPS;
      /* the system menu parts (the Power button's menu) */
      if (!T.rnps && exp.OptionsMenuPS && exp.MenuListItemPS && typeof exp.OptionsMenuPS !== 'string') { T.rnps = exp; done('system menu parts'); }
      if (!T.useLink && typeof exp.useLink === 'function') { T.useLink = exp.useLink; done('useLink'); }
      if ('SceneControl' in exp) hookBackground(exp);
      findReact(exp);
      rowConstants(exp);
      verticalConstants(exp);
      topConstants(exp);
      springs(exp);
      moveIcons(exp);
      hookJsx(exp);
      hookAtom(exp);
      hookAppItems(exp);
      patchSpaces(exp, id);
      hookTitleSpace(exp);
      hookSpaceFocus(exp);
      hookDefaultTile(exp);
      hookHubViewer(exp);
      hookTitleStore(exp);
      hookOptionsMenu(exp);
      hookNativeOptionMenu(exp);
      hookSelected(exp);
      hookHub(exp);
      if (exp.default && typeof exp.default === 'object') {
        findReact(exp.default);
        rowConstants(exp.default);
        patchSpaces(exp.default, id);
      }
    } catch (e) {
      T.errors++;
      log('error in module ' + id + ': ' + e);
    }
  }

  /* ---- catching the webpack require ----
     require is private to the bundle; it shows up in the call that runs each
     module: factory.call(exports, module, exports, require). On the first call
     every factory (require.m) is wrapped and the detour goes away. */
  var callOriginal = Function.prototype.call;
  function hookRequire(require) {
    T.require = require;
    var factories = require.m, n = 0;
    var wrap = function (factory, id) {
      return function (module, exports, req) {
        var r = factory.call(this, module, exports, req);
        afterModule(module, id);
        return r;
      };
    };
    for (var id in factories) {
      if (typeof factories[id] === 'function') {
        factories[id] = wrap(factories[id], id);
        n++;
      }
    }
    log('require caught, ' + n + ' modules');
  }
  Function.prototype.call = function (thisArg, module, exports, require) {
    if (!T.hooked && arguments.length === 4 &&
        typeof require === 'function' && module &&
        typeof module === 'object' && module.exports === exports &&
        exports === thisArg && require.m && require.c) {
      T.hooked = true;
      Function.prototype.call = callOriginal;
      try { hookRequire(require); } catch (e) { log('failed: ' + e); }
      var r = callOriginal.call(this, thisArg, module, exports, require);
      afterModule(module, module.i);
      return r;
    }
    return callOriginal.apply(this, arguments);
  };

  /* 30 s after the start, the cache names this Home uses (mosaics,
     folder backgrounds, tall icons): ZhiThemes deletes the other old ones.
     A deleted one is made again when it is asked for. */
  if (APP === 'home' && !PLAIN)
    setTimeout(function () {
      try {
        var mos =Object.keys(T.mosaicAsked || {}), fbg = Object.keys(T.fbgAsked || {});
        for (var g in (T.fbgFirst || {})) if (fbg.indexOf(T.fbgFirst[g]) < 0) fbg.push(T.fbgFirst[g]);
        folderList().forEach(function (f) { if (/^zt_folder_/.test(f.icon) && mos.indexOf(f.icon) < 0) mos.push(f.icon); });
        if (/^zt_folder_/.test(String(THEME.foldersIcon || ''))) mos.push(String(THEME.foldersIcon));
        console.log('THEME-CACHE-KEEP mosaics|' + mos.join(','));
        console.log('THEME-CACHE-KEEP folderbg|' + fbg.join(','));
        console.log('THEME-CACHE-KEEP icons|' + Object.keys(tallAsked).join(','));
      } catch (e) { log('cache keep: ' + e); }
    }, 30000);
  setTimeout(function () {
    log('state: hooked=' + T.hooked + ' done=' +
        JSON.stringify(T.done) + ' errors=' + T.errors);
  }, 8000);
  log('installed: ' + JSON.stringify(THEME));
  /* the JSON above is cut in the log: the most tested fields go on their own */
  log('options: titleMode=' + titleMode() + (oldTitles() ? ' (old fields)' : '') + 
      ' fontStyle=' + THEME.fontStyle + ' focusThickness=' + THEME.focusThickness +
      ' focusGap=' + THEME.focusGap + ' focusCorners=' + THEME.focusCorners);
})();
