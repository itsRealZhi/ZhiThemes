/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#pragma once

/*
 * Theme editor on http://<console-ip>:4444 — edit theme.js, save it and
 * reload HomeUI without restarting. No authentication: LAN only.
 *
 * Disable (must recompile shellui):
 *   -D SHELLUI_THEME_WEB=0
 */
#ifndef SHELLUI_THEME_WEB
#define SHELLUI_THEME_WEB 1
#endif

#include <string>

void theme_web_start();
bool theme_set_field(const std::string &key, const std::string &value);
/* the same in another theme file */
bool theme_set_field_in(const std::string &file, const std::string &key, const std::string &value);
