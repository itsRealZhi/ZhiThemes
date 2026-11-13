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
 * Concurrent requests borrow separate handles. Idle handles retain their
 * connections for reuse without serializing active transfers.
 */

#include "zt_sgdb.hpp"
#include "zt_log.hpp"

#include <stdio.h>
#include <string.h>
#include <unistd.h>

#if defined(ZHITHEMES) && ZHITHEMES

#include <curl/curl.h>

#include <array>
#include <memory>
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
std::array<CURL *, 4> g_idle_handles{};
int g_state = 0; /* 1 ready, -1 failed */

constexpr long kRequestTimeoutMs = 30000;
constexpr long kPreviewTimeoutMs = 45000;
constexpr long kMediaTimeoutMs = 240000;
constexpr long kDownloadStallSeconds = 45;

CURL *acquire_handle() {
  std::lock_guard<std::mutex> lock(g_lock);
  if (g_state == 0) {
    sceNetInit();
    const CURLcode rc = curl_global_init(CURL_GLOBAL_DEFAULT);
    g_state = rc == CURLE_OK ? 1 : -1;
    zt_log("sgdb: curl %s (%s)", g_state > 0 ? "ready" : "FAILED", curl_version());
  }
  if (g_state < 0)
    return nullptr;
  for (CURL *&idle : g_idle_handles) {
    if (idle) {
      CURL *handle = idle;
      idle = nullptr;
      return handle;
    }
  }
  return curl_easy_init();
}

void release_handle(CURL *handle) {
  curl_easy_reset(handle);
  {
    std::lock_guard<std::mutex> lock(g_lock);
    for (CURL *&idle : g_idle_handles) {
      if (!idle) {
        idle = handle;
        return;
      }
    }
  }
  curl_easy_cleanup(handle);
}

struct Sink {
  std::string *body;
  size_t max;
  bool over;
  FILE *file = nullptr; /* written to a file instead (big pictures) */
  size_t got = 0;
  CURL *curl = nullptr;
  const std::function<bool(const char *, size_t, long, long long)> *chunk = nullptr; /* handed on instead */
  bool stopped = false;
  bool follow = false; /* redirects followed: each answer must still come from an allowed host */
  const std::function<bool()> *cancel = nullptr;
};

bool allowed(const std::string &url);

int on_progress(void *user, curl_off_t, curl_off_t, curl_off_t, curl_off_t) {
  auto *s = static_cast<Sink *>(user);
  if (s->cancel && (*s->cancel)()) {
    s->stopped = true;
    return 1;
  }
  return 0;
}

size_t on_data(char *ptr, size_t size, size_t n, void *user) {
  Sink *s = static_cast<Sink *>(user);
  const size_t len = size * n;
  if (s->follow) {
    char *eff = nullptr;
    curl_easy_getinfo(s->curl, CURLINFO_EFFECTIVE_URL, &eff);
    if (!eff || !allowed(eff)) {
      s->stopped = true;
      return 0;
    }
  }
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

std::string host_of(const std::string &url) {
  if (url.rfind("https://", 0) != 0)
    return "";
  const size_t end = url.find_first_of("/?#", 8);
  return url.substr(8, end == std::string::npos ? std::string::npos : end - 8);
}

/* motionbgs.com: animated game backgrounds the user searches in the
   editor (its pages and its own /dl/ links redirect inside the site) */
bool site_follows(const std::string &url) { return host_of(url) == "motionbgs.com"; }

/* https://www.steamgriddb.com/..., https://cdn<N>.steamgriddb.com/...
   or https://motionbgs.com/... */
bool allowed(const std::string &url) {
  const std::string host = host_of(url);
  if (host.empty())
    return false;
  if (host == "www.steamgriddb.com" || host == "motionbgs.com")
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
                const std::function<bool(const char *, size_t, long, long long)> *chunk = nullptr,
                std::string *final_url = nullptr, const std::function<bool()> *cancel = nullptr);
}

bool zt_web_page(const std::string &url, std::string &body, std::string &final_url, long &http, std::string &err,
                 size_t max_bytes) {
  return sgdb_fetch(url, "", body, nullptr, http, err, max_bytes, kRequestTimeoutMs, nullptr, &final_url);
}

bool zt_sgdb_get(const std::string &url, const std::string &key, std::string &body, long &http,
                 std::string &err, size_t max_bytes) {
  return sgdb_fetch(url, key, body, nullptr, http, err, max_bytes, kRequestTimeoutMs);
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
  const bool ok = sgdb_fetch(url, "", unused, f, http, err, max_bytes, kMediaTimeoutMs);
  size = (size_t)ftell(f);
  fclose(f);
  if (!ok)
    unlink(path.c_str());
  return ok;
}

bool zt_sgdb_stream(const std::string &url, size_t max_bytes,
                    const std::function<bool(const char *, size_t, long, long long)> &chunk, long &http,
                    std::string &err, bool preview, bool selected, const std::function<bool()> &cancel) {
  std::string unused;
  const long timeout_ms = selected ? 0L : (preview ? kPreviewTimeoutMs : kMediaTimeoutMs);
  return sgdb_fetch(url, "", unused, nullptr, http, err, max_bytes, timeout_ms, &chunk, nullptr,
                    cancel ? &cancel : nullptr);
}

namespace {
bool sgdb_fetch(const std::string &url, const std::string &key, std::string &body, FILE *file, long &http,
                std::string &err, size_t max_bytes, long timeout_ms,
                const std::function<bool(const char *, size_t, long, long long)> *chunk,
                std::string *final_url, const std::function<bool()> *cancel) {
  body.clear();
  http = 0;
  if (!allowed(url)) {
    err = "address not allowed";
    return false;
  }
  std::unique_ptr<CURL, decltype(&release_handle)> handle(acquire_handle(), release_handle);
  if (!handle) {
    err = "curl not available";
    return false;
  }
  CURL *c = handle.get();
  Sink sink{&body, max_bytes, false, file, 0, c, chunk};
  sink.follow = site_follows(url);
  sink.cancel = cancel;
  struct curl_blob ca {
    const_cast<unsigned char *>(zt_sgdb_ca_start), (size_t)(zt_sgdb_ca_end - zt_sgdb_ca_start), CURL_BLOB_NOCOPY
  };
  curl_easy_setopt(c, CURLOPT_URL, url.c_str());
  curl_easy_setopt(c, CURLOPT_USERAGENT, "ZhiThemes");
  curl_easy_setopt(c, CURLOPT_NOSIGNAL, 1L);
  curl_easy_setopt(c, CURLOPT_FOLLOWLOCATION, sink.follow ? 1L : 0L);
  if (sink.follow) {
    curl_easy_setopt(c, CURLOPT_MAXREDIRS, 4L);
    curl_easy_setopt(c, CURLOPT_REDIR_PROTOCOLS_STR, "https");
  }
  curl_easy_setopt(c, CURLOPT_CAINFO_BLOB, &ca);
  curl_easy_setopt(c, CURLOPT_SSL_VERIFYPEER, 1L);
  curl_easy_setopt(c, CURLOPT_SSL_VERIFYHOST, 2L);
  curl_easy_setopt(c, CURLOPT_CONNECTTIMEOUT_MS, 10000L);
  curl_easy_setopt(c, CURLOPT_TIMEOUT_MS, timeout_ms);
  if (timeout_ms == 0) {
    curl_easy_setopt(c, CURLOPT_LOW_SPEED_LIMIT, 1L);
    curl_easy_setopt(c, CURLOPT_LOW_SPEED_TIME, kDownloadStallSeconds);
  }
  if (cancel) {
    curl_easy_setopt(c, CURLOPT_NOPROGRESS, 0L);
    curl_easy_setopt(c, CURLOPT_XFERINFOFUNCTION, on_progress);
    curl_easy_setopt(c, CURLOPT_XFERINFODATA, &sink);
  }
  curl_easy_setopt(c, CURLOPT_WRITEFUNCTION, on_data);
  curl_easy_setopt(c, CURLOPT_WRITEDATA, &sink);
  struct curl_slist *headers = nullptr;
  if (!key.empty())
    headers = curl_slist_append(headers, ("Authorization: Bearer " + key).c_str());
  if (headers)
    curl_easy_setopt(c, CURLOPT_HTTPHEADER, headers);
  const CURLcode rc = curl_easy_perform(c);
  curl_easy_getinfo(c, CURLINFO_RESPONSE_CODE, &http);
  if (final_url) {
    char *eff = nullptr;
    curl_easy_getinfo(c, CURLINFO_EFFECTIVE_URL, &eff);
    *final_url = eff ? eff : url;
  }
  if (headers) {
    curl_easy_setopt(c, CURLOPT_HTTPHEADER, nullptr);
    curl_slist_free_all(headers);
  }
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

bool zt_web_page(const std::string &, std::string &body, std::string &final_url, long &http, std::string &err, size_t) {
  body.clear();
  final_url.clear();
  http = 0;
  err = "not in this build";
  return false;
}

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
                    long &http, std::string &err, bool, bool, const std::function<bool()> &) {
  http = 0;
  err = "not in this build";
  return false;
}

#endif
