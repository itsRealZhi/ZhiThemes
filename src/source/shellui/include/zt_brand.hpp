/* ZhiThemes â€” PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE (additional term under section 7(b):
keep the author attribution).  */

/* Name, author and version shown by the payload, the editor and the logs.
   One place to change them. */
#pragma once

#define ZT_NAME "ZhiThemes"
#define ZT_AUTHOR "Zhi"
#define ZT_VERSION "0.1.0-alpha"
#define ZT_BUILD 361
#define ZT_STR2(x) #x
#define ZT_STR(x) ZT_STR2(x)
#define ZT_BUILD_TEXT ZT_STR(ZT_BUILD)
/* the diagnostic build (ZhiThemes-diag.elf, CMake ZT_DIAG=ON): debug mode
   and the screen dump always on, start-up heartbeat, ShellUI thread states,
   system lists in the logs. The normal build has none of it. */
#ifndef ZT_DIAG
#define ZT_DIAG 0
#endif
#define ZT_EDITION (ZT_DIAG ? " diag" : "")
/* links shown in the editor's About tab; empty = "coming soon" */
#define ZT_HOME "https://github.com/itsRealZhi/ZhiThemes"
#define ZT_KOFI "https://ko-fi.com/zhi"
