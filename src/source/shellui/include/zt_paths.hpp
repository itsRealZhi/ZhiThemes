/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/* Where the theme keeps its files: OnionHEN's folder, or ZhiThemes' own
   (/data/ZhiThemes) when built as the standalone ZhiThemes module. */
#pragma once

#if defined(ZHITHEMES) && ZHITHEMES
#define ZT_DIR "/user/data/ZhiThemes"
#else
#define ZT_DIR "/user/data/OnionHEN"
#endif

/* /data/ZhiThemes holds only these three folders and a few small
   files (active_theme.txt, steamgrid.key, watcher.pid, inject_delay):
     Assets/  the user's own files, shared by every theme (custom tiles,
              game backgrounds, folder icons, avatars, cache)
     Themes/  <Name>.ztheme + <Name>/ (wallpapers, icons, fonts of that theme)
     Logs/    the logs (logs/ in older versions) */
#define ZT_ASSETS ZT_DIR "/Assets"
#define ZT_THEMES ZT_DIR "/Themes"
#define ZT_LOGS ZT_DIR "/Logs"
