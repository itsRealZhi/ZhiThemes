/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#pragma once

#include <functional>
#include <string>

/* SteamGridDB for the editor's Tiles tab: the PS5 makes the HTTPS
   requests (the API and its CDN send no CORS headers, so the editor page
   cannot). Only https://www.steamgriddb.com and https://cdnN.steamgriddb.com
   are allowed. key = the user's API key (Authorization: Bearer), empty for
   the CDN. body gets at most max_bytes; http = the HTTP status (0 when the
   request failed, err says why). */
bool zt_sgdb_get(const std::string &url, const std::string &key, std::string &body, long &http,
                 std::string &err, size_t max_bytes);
/* the same from the CDN into a file (animated heroes can be 50+ MB:
   not kept in memory); size = bytes written; the file is removed on failure */
bool zt_sgdb_get_file(const std::string &url, const std::string &path, size_t &size, long &http,
                      std::string &err, size_t max_bytes);
/* the same from the CDN, handed on piece by piece as it arrives (the editor
   gets the first bytes at once and sees the progress). chunk(data, n, http,
   total) is called for each piece: http = the CDN status, total = its
   Content-Length or -1; returning false stops the download. */
bool zt_sgdb_stream(const std::string &url, size_t max_bytes,
                    const std::function<bool(const char *, size_t, long, long long)> &chunk, long &http,
                    std::string &err);
/* a page of https://motionbgs.com (the editor's animated backgrounds
   search): redirects inside the site are followed, final_url = the
   address of the page that answered */
bool zt_web_page(const std::string &url, std::string &body, std::string &final_url, long &http, std::string &err,
                 size_t max_bytes);
