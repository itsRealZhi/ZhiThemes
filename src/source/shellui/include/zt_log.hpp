/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#pragma once

#include <string>

/*
 * Logs in /data/ZhiThemes/Logs/ (also over FTP/USB, for users who cannot
 * open the editor):
 *   zhithemes.log            this session: module + theme lines, each with
 *                            its UTC time and the seconds since the start
 *   previous.log             the session before (look here after a crash)
 *   debug-<date>.log         saved when debug mode is stopped
 *   crash-<date>.log         a session that ended without closing while
 *                            debug mode was on (crash, rest mode, power off)
 *   payload.log              the ZhiThemes.elf payload (injector/watcher)
 *   boot.log                 one line per start-up step of the module
 * Only the 2 newest debug-* and crash-* logs are kept. The state files
 * (debug.on, session.open, inject_count) are beside Logs/, not in it; the
 * token lists of debug mode go to Dumps/<firmware>/.
 * Every session starts with a header: ZhiThemes version and firmware.
 */

/* One line with its time. */
void zt_log(const char *fmt, ...) __attribute__((format(printf, 1, 2)));

/* Start of the module: keeps the last session, writes the header. */
void zt_log_session_start(const char *fw_text, unsigned fw_hex);
/* Clean end (POST /quit, a newer ZhiThemes replaces this one). */
void zt_log_session_end();

/* Debug mode (editor's Logs tab). */
bool zt_debug_on();
bool zt_debug_sys();
/* Turns it on/off; stopping saves the session so far as debug-<date>.log
   and returns that name (empty when nothing was saved). */
std::string zt_debug_set(bool on, bool sys);

/* {"name":..,"version":..,"build":..,"author":..,"home":..,"kofi":..,"fw":..,
    "fwHex":..,"debug":..,"sys":..,"started":..} */
std::string zt_sysinfo_json();
/* "9.60" style firmware text, empty when unknown */
const std::string &zt_fw_text();

/* Files of logs/: JSON [{"name":..,"size":..,"time":..}], newest first. */
std::string zt_log_list_json();
/* A log file by name (only names of logs/, no path); empty when missing. */
std::string zt_log_path(const std::string &name);
