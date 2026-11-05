/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#pragma once

#include <string>
#include <vector>

/* Folder mosaic icon in /data/ZhiThemes/backgrounds/<name> (512x512 PNG, as
   the editor makes it; 512 x 512*ratio for vertical tiles); nothing to do
   when the file already exists; stack = the covers stacked instead of the
   2x2 squares, an older version; squares = square icons, as many as fit, an older version; made
   again when a game picture is newer than it). */
bool zt_folder_mosaic(const std::string &name, const std::string &colour, double alpha,
                      const std::vector<std::string> &icons, int more = 0, double ratio = 1,
                      bool stack = false, bool squares = false, bool oneRow = false);

/* Folder background in /data/ZhiThemes/backgrounds/<name> (1920x1080 PNG)
   from the art of the first 4 games (title ids); style slices | grid. Slow
   (about a second per game): call it off the JS thread. */
bool zt_folder_background(const std::string &name, const std::string &style, const std::string &colour,
                          const std::vector<std::string> &ids,
                          const std::vector<std::string> &own = std::vector<std::string>());

/* Game background (1920x1080 PNG at dest) from a SteamGridDB hero PNG at
   src (about 3:1): enlarged to the full height, the 16:9 window at pos
   (0 left .. 1 right) kept. */
bool zt_hero_background(const std::string &src, const std::string &dest, double pos = 0.5);

/* Taller copy of a square system icon (Game / App Library): the square in
   the middle, its top / bottom rows repeated up to w x w*ratio. */
bool zt_tall_icon(const std::string &src, const std::string &dest, double ratio);
