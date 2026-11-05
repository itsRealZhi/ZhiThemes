/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#pragma once

struct MonoImage;

/*
 * HomeUI theme script: before HomeUI's bundle runs, ShellUI's JS executor
 * (ReactNative.PUI, JSJavaScriptExecutor) evaluates /user/data/OnionHEN/theme.js
 * in the same Hermes runtime. console.log lines starting with "THEME" go to
 * logs/zhithemes.log. A default theme is written when there is none.
 *
 * Disable (must recompile shellui):
 *   -D SHELLUI_HOMEUI_JS_INJECT=0
 */
#ifndef SHELLUI_HOMEUI_JS_INJECT
#define SHELLUI_HOMEUI_JS_INJECT 1
#endif

/* react_pui: ReactNative.PUI (JS executor); pui: Sce.PlayStation.PUI (focus
   frame colour). */
void install_homeui_js_hooks(MonoImage *react_pui, MonoImage *pui);

#include <stdint.h>
#include <string>
/* theme.js as it runs: module code + the values of the user's file */
std::string theme_script();
/* the Games row sent by the Home's theme.js (JSON list of {id, name, icon}) */
std::string theme_games();
/* systemFont / elementFont (SST-BoldItalic): full path of the font that
   takes the place of this SST font ("" = the system's); asked for names
   "SST-<x>.k??" (theme_psm_names) */
std::string theme_system_font(const char *sst_name);
/* libScePsm's SST font names (prx.cpp): generation >= 0 points each one at a
   copy ending in ".k" + 2 base36 chars of it, < 0 puts the stock names back;
   returns how many names there are */
int theme_psm_names(int generation);
/* the UI-thread tick */
void theme_tick();
/* ZhiThemes: hooks that can be taken out again (theme_unload) */
bool theme_hook(uint64_t address, void *destination, void **original);
bool theme_quitting();
void theme_status(int *hooks, int *doubles);
int theme_unload();
/* THEME number / string value of theme.js (zt_native_theme.cpp) */
double zt_theme_number(const std::string &src, const char *key, double fallback);
std::string zt_theme_text(const std::string &src, const char *key);
