/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#pragma once

#include "zt_paths.hpp"

#include <string>

/* one folder per kind of file; the user's own files under
   Assets/, the theme's own files (wallpapers, icons, fonts) under
   Themes/<Name>/ next to Themes/<Name>.ztheme */
#define ZT_FOLDERS ZT_ASSETS "/folders"            /* uploaded folder icons */
#define ZT_CUSTOMTILE ZT_ASSETS "/customtile"      /* <titleId>_<format>_<n>.png (+ .mp4), logos */
#define ZT_CUSTOMBG ZT_ASSETS "/custombg"          /* <titleId>_16x9_<n>.png (+ .mp4) */
#define ZT_AVATARS ZT_ASSETS "/avatars"            /* avatar pictures */
#define ZT_CACHE ZT_ASSETS "/cache"                /* made by ZhiThemes; can be deleted any time */
#define ZT_CACHE_MOSAICS ZT_CACHE "/mosaics"       /* folder mosaics (zt_folder_*) */
#define ZT_CACHE_FOLDERBG ZT_CACHE "/folderbg"     /* folder backgrounds (zt_fbg_*) */
#define ZT_CACHE_ICONS ZT_CACHE "/icons"           /* tall system tile icons (zt_sys_*) */
#define ZT_PARTICLES ZT_ASSETS "/particles"      /* built-in particle textures (written at start) */
#define ZT_LEGACY ZT_ASSETS "/backgrounds"         /* in older versions; read when a file is still there */
#define ZT_SGDB_KEY_FILE ZT_DIR "/steamgrid.key"   /* the SteamGridDB API key, never in a theme */
#define ZT_ACTIVE_FILE ZT_DIR "/active_theme.txt"  /* the name of the theme in use */
#define ZT_FAVORITES_FILE ZT_DIR "/favorites.txt"  /* favourite games, console wide (not in a theme) */
#define ZT_THEME_BACKUPS ZT_THEMES "/.backup"      /* a copy of each theme at every start */

/* moves the files of the layout in older versions (everything in
   /data/ZhiThemes) to Assets/, Themes/<Name>/ and reads the active theme.
   Call first, before anything reads the theme. */
void zt_storage_migrate();

/* Makes the folders and, once, moves the files of backgrounds/ (and the
   folder icons of customtile/) to their folder by kind; the SteamGridDB key
   of an older theme goes to steamgrid.key. Call before the theme runs. */
void zt_storage_setup();

/* writes the built-in particle textures (AniketosHEN's, embedded) to
   Assets/particles/ when one is missing or not the same size. */
void zt_particles_install();

/* ---- themes ---- */
/* the theme in use ("Default" when none) */
std::string zt_theme_name();
/* Themes/<name>.ztheme (the active one when name is empty) */
std::string zt_theme_file(const std::string &name = std::string());
/* Themes/<active>/<kind> (wallpapers, icons, fonts) */
std::string zt_theme_dir(const char *kind);
/* the folder of one kind of a theme (the active one when name is empty) */
std::string zt_theme_dir_of(const std::string &name, const char *kind);
/* a theme name: letters, digits, '.', '-', '_' (no spaces), 1-40, not ".x" */
bool zt_theme_name_ok(const std::string &name);
/* {"active":"X","themes":[{"name":"A","files":3,"bytes":123}]} */
std::string zt_themes_json();
/* these return "" when done, else the reason */
std::string zt_theme_use(const std::string &name);
/* from = a theme to copy (its files linked), "" = the factory theme */
std::string zt_theme_new(const std::string &name, const std::string &from, bool *created = nullptr);
std::string zt_theme_rename(const std::string &name, const std::string &to);
std::string zt_theme_delete(const std::string &name);
/* empties a theme's folder (before a pack replaces it) */
std::string zt_theme_clear(const std::string &name);
/* deletes the files listed in `list` (lines "<wallpapers|icons|fonts>/<file>")
   from that theme's folder; *removed = how many */
std::string zt_theme_clean(const std::string &name, const std::string &list, int *removed);
/* after a file arrived in a theme folder: when another theme has the same
   file (same size and bytes), this one becomes a hard link to it (no space
   used twice; the space comes back when the last theme with it goes) */
void zt_dedupe(const std::string &file);
/* the personal values (folders, foldersIcon, customTileChoice,
   customBgChoice) of a theme text written into another theme file: they
   follow the user from theme to theme */
void zt_carry_personal(const std::string &from_text, const std::string &to_file);

/* The files still in backgrounds/ as a JSON list (the theme looks there
   when a name is not in its new folder). */
std::string zt_legacy_js();

/* "THEME-CACHE-KEEP <mosaics|folderbg|icons>|name,name,...": the Home's
   names in use; the other files of that cache folder older than 10 min
   are deleted (they are made again when needed). */
void zt_cache_keep(const std::string &text);

/* The favourite games, console wide: title ids separated by commas
   (favorites.txt). Older themes kept them in the theme's "favorites" field:
   zt_storage_setup gathers those once. */
std::string zt_favorites();
bool zt_favorites_set(const std::string &list);

/* The SteamGridDB key on the PS5 ("" = none); set "" removes it. */
std::string zt_sgdb_key();
bool zt_sgdb_key_set(const std::string &key);

/* installs the themes copied to /data/ZhiThemes/Install (pack or
   text, as the editor's Install) and deletes them from there; the last one
   is used. Call after zt_storage_setup, before the theme runs. */
void zt_install_dropped();

/* ---- the Home's Options menu > ZhiThemes ---- */
/* ZhiThemes off ("PS5 default"): /data/ZhiThemes/no_theme, or a USB stick
   with ZhiThemes/no_theme (safe mode, while it is in). The Home then runs
   only the Options menu item; the other apps stay stock. */
bool zt_stock_on();
/* writes / deletes /data/ZhiThemes/no_theme */
void zt_stock_set(bool on);
/* {"off":b,"usbOff":b,"installing":b,"list":<zt_themes_json>,
    "files":[{"path","name","from":"usb"|"install"}]} */
std::string zt_theme_menu_json();
/* switch to a theme and turn ZhiThemes on; "" when done, else the reason */
std::string zt_theme_menu_use(const std::string &name);
/* installs one file of zt_theme_menu_json's "files" in a thread (a USB file
   is kept, an Install/ file deleted); done() runs after a good install */
std::string zt_theme_menu_install(const std::string &path, void (*done)());
/* a PS5 notification "ZhiThemes: <text>" (no [OnionHEN] prefix) */
void zt_menu_notify(const std::string &text);

/* mkdir -p of a folder under ZT_DIR */
void zt_mkdirs(const std::string &path);
