/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#pragma once

/* the top bar Power button (theme.js powerBtnOn): "THEME-POWER rest|restart|off" */

/* at start (prx.cpp, with the module's privileges): libSceSystemStateMgr handle */
void zt_power_resolve(int handle);
/* rest | restart | off; queued, runs ~0.4 s later on the UI thread (the menu closes first) */
void zt_power_action(const char *what);
/* UI thread, every frame (theme_tick) */
void zt_power_tick();
