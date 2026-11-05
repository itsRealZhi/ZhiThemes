/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/* ZhiThemes build with only the theme's files (ZT_SLIM): notify() as a plain
   PS5 notification ("ZhiThemes: ..."), without OnionHEN's translated
   messages (shellui_notify.cpp and its catalog, ~200 KB). Also logged. */

#include "external_symbols.hpp"
#include "zt_log.hpp"

#include <stdarg.h>
#include <stdio.h>

void notify(const char *text, ...) {
  char message[900];
  va_list args;
  va_start(args, text);
  vsnprintf(message, sizeof(message), text, args);
  va_end(args);
  zt_log("notify: %s", message);
  if (!sceKernelSendNotificationRequest)
    return;
  OrbisNotificationRequest req = {};
  snprintf(req.message, sizeof(req.message), "ZhiThemes: %s", message);
  sceKernelSendNotificationRequest(0, &req, sizeof(req), 0);
}
