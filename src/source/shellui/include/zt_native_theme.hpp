/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#pragma once

#include <string>

struct MonoImage;

/*
 * native looks that the theme.js cannot reach, the way AniketosHEN
 * (GPL-3.0, github.com/xS3Cx/AniketosHEN) does them:
 *   - avatarOn / avatar: the signed-in user's picture (also animated GIF /
 *     WebP) wherever the system draws it, by ImageBox.LoadAsync;
 *   - panelTintOn / panelTintColor / panelTintStrength / panelTintOpacity:
 *     the native panels (Settings and Trophies pages, menus, the native
 *     pages of Users and Family) tinted, by Panel.set_BackgroundColor and
 *     the "surface" colour tokens;
 *   - iconTintOn / iconTintColor: every system colour token with "icon" in
 *     its name;
 * Values are read from theme.js when the Home's theme is evaluated.
 */
void zt_native_install(MonoImage *pui);
void zt_native_apply(const std::string &script);
/* UI thread, every frame */
void zt_native_tick();

/* (zt_sys_video.cpp): native video behind Settings and Trophies */
void zt_sys_video_install(MonoImage *pui);
void zt_sys_video_apply(const std::string &script);
void zt_sys_video_tick();
