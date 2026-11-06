/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/*
 * SteamGridDB requests for the editor's Tiles tab, made by the PS5
 * with the SDK's homebrew libcurl + OpenSSL and the CA bundle built in (as
 * onionHEN's cheat catalog does, util/source/cheats/sync/http_transport_ps5.cpp).
 * Called from the web server thread only (one request at a time); the curl
 * handle is kept so the TLS connection is reused between thumbnails.
 */

#include "zt_sgdb.hpp"
#include "zt_log.hpp"

#include <stdio.h>
#include <string.h>
#include <unistd.h>

#if defined(ZHITHEMES) && ZHITHEMES

#include <curl/curl.h>

#include <mutex>

extern "C" {
__asm__(".pushsection .rodata\n"
        ".balign 1\n"
        ".global zt_sgdb_ca_start\n"
        "zt_sgdb_ca_start:\n"
        ".incbin \"" ZT_SGDB_CA_BUNDLE "\"\n"
        ".global zt_sgdb_ca_end\n"
        "zt_sgdb_ca_end:\n"
        ".popsection\n");
extern const unsigned char zt_sgdb_ca_start[];
extern const unsigned char zt_sgdb_ca_end[];
int sceNetInit(void);
}

namespace {

std::mutex g_lock;
CURL *g_curl = nullptr;
int g_state = 0; /* 1 ready, -1 failed */

struct Sink {
  std::string *body;
  size_t max;
  bool over;
  FILE *file = nullptr; /* written to a file instead (big pictures) */
  size_t got = 0;
  CURL *curl = nullptr;
  const std::function<bool(const char *, size_t, long, long long)> *chunk = nullptr; /* handed on instead */
  bool stopped = false;
};

size_t on_data(char *ptr, size_t size, size_t n, void *user) {
  Sink *s = static_cast<Sink *>(user);
  const size_t len = size * n;
  if (s->got + len > s->max) {
    s->over = true;
    return 0;
  }
  s->got += len;
  if (s->chunk) {
    long code = 0;
    curl_off_t total = -1;
    curl_easy_getinfo(s->curl, CURLINFO_RESPONSE_CODE, &code);
    curl_easy_getinfo(s->curl, CURLINFO_CONTENT_LENGTH_DOWNLOAD_T, &total);
    if (!(*s->chunk)(ptr, len, code, (long long)total)) {
      s->stopped = true;
      return 0;
    }
    return len;
  }
  if (s->file)
    return fwrite(ptr, 1, len, s->file) == len ? len : 0;
  s->body->append(ptr, len);
  return len;
}

/* https://www.steamgriddb.com/... or https://cdn<N>.steamgriddb.com/... */
bool allowed(const std::string &url) {
  if (url.rfind("https://", 0) != 0)
    return false;
  const size_t end = url.find('/', 8);
  const std::string host = url.substr(8, end == std::string::npos ? std::string::npos : end - 8);
  if (host == "www.steamgriddb.com")
    return true;
  if (host.rfind("cdn", 0) != 0 || host.size() < 20)
    return false;
  const std::string tail = ".steamgriddb.com";
  if (host.compare(host.size() - tail.size(), tail.size(), tail) != 0)
    return false;
  for (size_t i = 3; i < host.size() - tail.size(); ++i)
    if (host[i] < '0' || host[i] > '9')
      return false;
  return true;
}

} // namespace

namespace {
bool sgdb_fetch(const std::string &url, const std::string &key, std::string &body, FILE *file, long &http,
                std::string &err, size_t max_bytes, long timeout_ms,
                const std::function<bool(const char *, size_t, long, long long)> *chunk = nullptr);
}

bool zt_sgdb_get(const std::string &url, const std::string &key, std::string &body, long &http,
                 std::string &err, size_t max_bytes) {
  return sgdb_fetch(url, key, body, nullptr, http, err, max_bytes, 30000L);
}

bool zt_sgdb_get_file(const std::string &url, const std::string &path, size_t &size, long &http,
                      std::string &err, size_t max_bytes) {
  size = 0;
  FILE *f = fopen(path.c_str(), "wb");
  if (!f) {
    err = "cannot write " + path;
    return false;
  }
  std::string unused;
  const bool ok = sgdb_fetch(url, "", unused, f, http, err, max_bytes, 240000L);
  size = (size_t)ftell(f);
  fclose(f);
  if (!ok)
    unlink(path.c_str());
  return ok;
}

bool zt_sgdb_stream(const std::string &url, size_t max_bytes,
                    const std::function<bool(const char *, size_t, long, long long)> &chunk, long &http,
                    std::string &err) {
  std::string unused;
  return sgdb_fetch(url, "", unused, nullptr, http, err, max_bytes, 240000L, &chunk);
}

namespace {
bool sgdb_fetch(const std::string &url, const std::string &key, std::string &body, FILE *file, long &http,
                std::string &err, size_t max_bytes, long timeout_ms,
                const std::function<bool(const char *, size_t, long, long long)> *chunk) {
  body.clear();
  http = 0;
  if (!allowed(url)) {
    err = "address not allowed";
    return false;
  }
  std::lock_guard<std::mutex> lock(g_lock);
  if (g_state == 0) {
    sceNetInit();
    const CURLcode rc = curl_global_init(CURL_GLOBAL_DEFAULT);
    g_state = rc == CURLE_OK ? 1 : -1;
    zt_log("sgdb: curl %s (%s)", g_state > 0 ? "ready" : "FAILED", curl_version());
  }
  if (g_state < 0) {
    err = "curl not available";
    return false;
  }
  if (!g_curl)
    g_curl = curl_easy_init();
  if (!g_curl) {
    err = "curl_easy_init failed";
    return false;
  }
  CURL *c = g_curl;
  curl_easy_reset(c);
  Sink sink{&body, max_bytes, false, file, 0, c, chunk};
  struct curl_blob ca {
    const_cast<unsigned char *>(zt_sgdb_ca_start), (size_t)(zt_sgdb_ca_end - zt_sgdb_ca_start), CURL_BLOB_NOCOPY
  };
  curl_easy_setopt(c, CURLOPT_URL, url.c_str());
  curl_easy_setopt(c, CURLOPT_USERAGENT, "ZhiThemes");
  curl_easy_setopt(c, CURLOPT_NOSIGNAL, 1L);
  curl_easy_setopt(c, CURLOPT_FOLLOWLOCATION, 0L);
  curl_easy_setopt(c, CURLOPT_CAINFO_BLOB, &ca);
  curl_easy_setopt(c, CURLOPT_SSL_VERIFYPEER, 1L);
  curl_easy_setopt(c, CURLOPT_SSL_VERIFYHOST, 2L);
  curl_easy_setopt(c, CURLOPT_CONNECTTIMEOUT_MS, 10000L);
  curl_easy_setopt(c, CURLOPT_TIMEOUT_MS, timeout_ms);
  curl_easy_setopt(c, CURLOPT_WRITEFUNCTION, on_data);
  curl_easy_setopt(c, CURLOPT_WRITEDATA, &sink);
  struct curl_slist *headers = nullptr;
  if (!key.empty())
    headers = curl_slist_append(headers, ("Authorization: Bearer " + key).c_str());
  if (headers)
    curl_easy_setopt(c, CURLOPT_HTTPHEADER, headers);
  const CURLcode rc = curl_easy_perform(c);
  curl_easy_getinfo(c, CURLINFO_RESPONSE_CODE, &http);
  if (headers)
    curl_slist_free_all(headers);
  if (rc != CURLE_OK) {
    err = sink.over ? "answer too large" : sink.stopped ? "stopped" : curl_easy_strerror(rc);
    zt_log("sgdb: %.160s failed: %s", url.c_str(), err.c_str());
    http = 0;
    return false;
  }
  return true;
}
} // namespace

#else

bool zt_sgdb_get(const std::string &, const std::string &, std::string &body, long &http, std::string &err,
                 size_t) {
  body.clear();
  http = 0;
  err = "not in this build";
  return false;
}

bool zt_sgdb_get_file(const std::string &, const std::string &, size_t &size, long &http, std::string &err, size_t) {
  size = 0;
  http = 0;
  err = "not in this build";
  return false;
}

bool zt_sgdb_stream(const std::string &, size_t, const std::function<bool(const char *, size_t, long, long long)> &,
                    long &http, std::string &err) {
  http = 0;
  err = "not in this build";
  return false;
}

#endif
