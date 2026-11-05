/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/*
 * Folder mosaic icon, the same picture the editor draws on a canvas
 * (editor.html foldMosaic): 512x512, the folder colour as a diagonal
 * gradient to 40 % (with the folder opacity), three game icons in a 2x2 grid
 * with round corners and the folder symbol in the first free square. Made on
 * the console when the Home's Options menu changes a folder, so the tile
 * does not wait for the editor. PNG read / written with zlib (homebrew
 * libz.a of the SDK).
 */

#include "zt_mosaic.hpp"
#include "zt_paths.hpp"
#include "zt_storage.hpp"
#include "zt_log.hpp"

#include <algorithm>
#include <dirent.h>
#include <fcntl.h>
#include <math.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

#include <string>
#include <vector>

/* zlib of the SDK's homebrew libs (include path: shellui CMakeLists.txt) */
#include <zlib.h>


namespace {

struct Image {
  int w = 0, h = 0;
  std::vector<unsigned char> px; /* RGBA, not premultiplied */
};

unsigned be32(const unsigned char *p) {
  return (unsigned)p[0] << 24 | (unsigned)p[1] << 16 | (unsigned)p[2] << 8 | p[3];
}

int paeth(int a, int b, int c) {
  const int p = a + b - c, pa = abs(p - a), pb = abs(p - b), pc = abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

bool read_exact(int fd, void *buf, size_t n) {
  for (size_t off = 0; off < n;) {
    const ssize_t r = read(fd, (char *)buf + off, n - off);
    if (r <= 0)
      return false;
    off += (size_t)r;
  }
  return true;
}

/* PNG rows, read and inflated a piece at a time: only the row being
   decoded and the one above it exist, so a 17 MB 4K pic0 costs its output
   picture plus some kilobytes (held the file, the IDAT data and
   every row at once: ~90 MB inside ShellUI, which went down after it) */
struct PngReader {
  int fd = -1;
  z_stream zs;
  bool zinit = false;
  int w = 0, h = 0, depth = 0, ctype = 0, bpp = 0;
  size_t stride = 0;
  std::string plte, trns;
  std::vector<unsigned char> cur, prev; /* filter byte + stride */
  size_t filled = 0;
  unsigned idat_left = 0; /* bytes of the current IDAT not read yet */
  int y = 0;
  ~PngReader() {
    if (zinit)
      inflateEnd(&zs);
    if (fd >= 0)
      close(fd);
  }
  /* chunks up to the first IDAT: IHDR, PLTE, tRNS */
  bool open_png(const char *path) {
    fd = open(path, O_RDONLY);
    unsigned char sig[8];
    if (fd < 0 || !read_exact(fd, sig, 8) || memcmp(sig, "\x89PNG\r\n\x1a\n", 8) != 0)
      return false;
    for (;;) {
      unsigned char hd[8];
      if (!read_exact(fd, hd, 8))
        return false;
      const unsigned len = be32(hd);
      if (!memcmp(hd + 4, "IDAT", 4)) {
        idat_left = len;
        break;
      }
      if (!memcmp(hd + 4, "IEND", 4) || len > (1u << 20))
        return false;
      std::string body(len, '\0');
      unsigned char crc[4];
      if ((len && !read_exact(fd, &body[0], len)) || !read_exact(fd, crc, 4))
        return false;
      const unsigned char *b = (const unsigned char *)body.data();
      if (!memcmp(hd + 4, "IHDR", 4) && len >= 13) {
        w = (int)be32(b);
        h = (int)be32(b + 4);
        depth = b[8];
        ctype = b[9];
        if (b[12] != 0) /* interlaced */
          return false;
      } else if (!memcmp(hd + 4, "PLTE", 4)) {
        plte = body;
      } else if (!memcmp(hd + 4, "tRNS", 4)) {
        trns = body;
      }
    }
    if (w <= 0 || h <= 0 || w > 4096 || h > 4096 || (depth != 8 && depth != 16) || (ctype == 3 && depth != 8))
      return false;
    const int ch = ctype == 0 ? 1 : ctype == 2 ? 3 : ctype == 3 ? 1 : ctype == 4 ? 2 : ctype == 6 ? 4 : 0;
    if (!ch)
      return false;
    bpp = ch * depth / 8;
    stride = (size_t)w * bpp;
    cur.assign(stride + 1, 0);
    prev.assign(stride + 1, 0);
    memset(&zs, 0, sizeof(zs));
    zinit = inflateInit(&zs) == Z_OK;
    return zinit;
  }
  /* the next row, unfiltered, in cur[1..stride] */
  bool next_row() {
    if (inbuf.empty())
      inbuf.resize(65536);
    while (filled < cur.size()) {
      if (zs.avail_in == 0) {
        while (idat_left == 0) {
          /* the CRC of this IDAT, then the next chunk must be an IDAT */
          unsigned char hd[12];
          if (!read_exact(fd, hd, 12) || memcmp(hd + 8, "IDAT", 4) != 0)
            return false;
          idat_left = be32(hd + 4);
        }
        const size_t n = std::min<size_t>(inbuf.size(), idat_left);
        if (!read_exact(fd, inbuf.data(), n))
          return false;
        idat_left -= (unsigned)n;
        zs.next_in = inbuf.data();
        zs.avail_in = (unsigned)n;
      }
      zs.next_out = &cur[filled];
      zs.avail_out = (unsigned)(cur.size() - filled);
      const int r = inflate(&zs, Z_NO_FLUSH);
      filled = cur.size() - zs.avail_out;
      if (r == Z_STREAM_END && filled < cur.size())
        return false;
      if (r != Z_OK && r != Z_STREAM_END && r != Z_BUF_ERROR)
        return false;
    }
    filled = 0;
    const int ft = cur[0];
    unsigned char *r = &cur[1];
    const unsigned char *p = &prev[1];
    for (size_t i = 0; i < stride; ++i) {
      const int a = i >= (size_t)bpp ? r[i - bpp] : 0, b = p[i], c = i >= (size_t)bpp ? p[i - bpp] : 0;
      int v = r[i];
      if (ft == 1) v += a;
      else if (ft == 2) v += b;
      else if (ft == 3) v += (a + b) / 2;
      else if (ft == 4) v += paeth(a, b, c);
      else if (ft != 0) return false;
      r[i] = (unsigned char)v;
    }
    ++y;
    return true;
  }
  std::vector<unsigned char> inbuf; /* IDAT bytes; what zlib has not taken stays for the next row */
};

/* 8/16-bit, non-interlaced grey / RGB / palette / grey+alpha / RGBA; with
   max_w, a wider picture is shrunk by a whole factor while it is read */
bool load_png(const char *path, Image &img, int max_w = 0) {
  PngReader pr;
  if (!pr.open_png(path))
    return false;
  const int w = pr.w, h = pr.h, bpp = pr.bpp, ctype = pr.ctype;
  const int k = max_w > 0 && w > max_w ? w / max_w : 1;
  img.w = w / k;
  img.h = h / k;
  if (img.w <= 0 || img.h <= 0)
    return false;
  img.px.assign((size_t)img.w * img.h * 4, k > 1 ? 0 : 255);
  std::vector<unsigned> acc(k > 1 ? (size_t)img.w * 4 : 0);
  const int step = pr.depth / 8; /* 16-bit: the high byte */
  for (int y = 0; y < img.h * k; ++y) {
    if (!pr.next_row()) {
      img = Image();
      return false;
    }
    const unsigned char *r = &pr.cur[1];
    for (int x = 0; x < img.w * k; ++x) {
      const unsigned char *s = r + (size_t)x * bpp;
      unsigned char one[4] = {0, 0, 0, 255};
      unsigned char *o = k > 1 ? one : &img.px[((size_t)y * img.w + x) * 4];
      if (ctype == 0 || ctype == 4) {
        o[0] = o[1] = o[2] = s[0];
        if (ctype == 4) o[3] = s[step];
      } else if (ctype == 2 || ctype == 6) {
        o[0] = s[0]; o[1] = s[step]; o[2] = s[2 * step];
        if (ctype == 6) o[3] = s[3 * step];
      } else {
        const size_t i = s[0];
        if (i * 3 + 2 < pr.plte.size()) {
          o[0] = (unsigned char)pr.plte[i * 3]; o[1] = (unsigned char)pr.plte[i * 3 + 1];
          o[2] = (unsigned char)pr.plte[i * 3 + 2];
        }
        if (i < pr.trns.size()) o[3] = (unsigned char)pr.trns[i];
      }
      if (k > 1)
        for (int c = 0; c < 4; ++c)
          acc[(size_t)(x / k) * 4 + c] += one[c];
    }
    pr.prev.swap(pr.cur);
    if (k > 1 && y % k == k - 1) {
      unsigned char *out = &img.px[(size_t)(y / k) * img.w * 4];
      for (size_t i = 0; i < acc.size(); ++i) {
        out[i] = (unsigned char)(acc[i] / (unsigned)(k * k));
        acc[i] = 0;
      }
    }
  }
  return true;
}

/* RGBA PNG, deflated a row at a time into IDAT chunks of up to 64 KB (no copy of the whole picture, raw or compressed) */
bool save_png(const char *path, const Image &img) {
  const std::string tmp = std::string(path) + ".tmp";
  const int fd = open(tmp.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (fd < 0)
    return false;
  bool ok = true;
  auto put = [&](const void *data, size_t len) {
    for (size_t off = 0; ok && off < len;) {
      const ssize_t n = write(fd, (const char *)data + off, len - off);
      ok = n > 0;
      off += ok ? (size_t)n : 0;
    }
  };
  auto chunk = [&](const char *type, const unsigned char *data, size_t len) {
    const unsigned char be[4] = {(unsigned char)(len >> 24), (unsigned char)(len >> 16), (unsigned char)(len >> 8),
                                 (unsigned char)len};
    unsigned long crc = crc32(0, (const unsigned char *)type, 4);
    if (len)
      crc = crc32(crc, data, (unsigned)len);
    const unsigned char cb[4] = {(unsigned char)(crc >> 24), (unsigned char)(crc >> 16), (unsigned char)(crc >> 8),
                                 (unsigned char)crc};
    put(be, 4);
    put(type, 4);
    put(data, len);
    put(cb, 4);
  };
  put("\x89PNG\r\n\x1a\n", 8);
  unsigned char ihdr[13] = {0};
  for (int i = 0; i < 4; ++i) {
    ihdr[i] = (unsigned char)(img.w >> (24 - 8 * i));
    ihdr[4 + i] = (unsigned char)(img.h >> (24 - 8 * i));
  }
  ihdr[8] = 8;
  ihdr[9] = 6;
  chunk("IHDR", ihdr, 13);
  z_stream zs;
  memset(&zs, 0, sizeof(zs));
  ok = ok && deflateInit(&zs, 6) == Z_OK;
  std::vector<unsigned char> row((size_t)img.w * 4 + 1, 0), out(65536);
  for (int y = 0; ok && y <= img.h; ++y) {
    const bool last = y == img.h;
    if (!last)
      memcpy(&row[1], &img.px[(size_t)y * img.w * 4], (size_t)img.w * 4);
    zs.next_in = last ? nullptr : row.data();
    zs.avail_in = last ? 0 : (unsigned)row.size();
    int r;
    do {
      zs.next_out = out.data();
      zs.avail_out = (unsigned)out.size();
      r = deflate(&zs, last ? Z_FINISH : Z_NO_FLUSH);
      if (r == Z_STREAM_ERROR) {
        ok = false;
        break;
      }
      const size_t made = out.size() - zs.avail_out;
      if (made)
        chunk("IDAT", out.data(), made);
    } while (ok && (last ? r != Z_STREAM_END : zs.avail_in > 0 || zs.avail_out == 0));
  }
  deflateEnd(&zs);
  chunk("IEND", nullptr, 0);
  close(fd);
  return ok && rename(tmp.c_str(), path) == 0;
}

/* coverage (0..1) of pixel (x, y) by a round rectangle */
float rr_cover(float x, float y, float l, float t, float w, float h, float r) {
  const float px = x + 0.5f, py = y + 0.5f;
  if (px < l || py < t || px > l + w || py > t + h) {
    /* a half pixel of soft edge */
    const float dx = fmaxf(fmaxf(l - px, px - (l + w)), 0), dy = fmaxf(fmaxf(t - py, py - (t + h)), 0);
    return fmaxf(0, 1 - 2 * fmaxf(dx, dy));
  }
  const float cx = px < l + r ? l + r : px > l + w - r ? l + w - r : px;
  const float cy = py < t + r ? t + r : py > t + h - r ? t + h - r : py;
  const float dist = sqrtf((px - cx) * (px - cx) + (py - cy) * (py - cy));
  return fminf(1, fmaxf(0, r - dist + 0.5f));
}

/* src-over of a colour with alpha a (0..1) */
void blend(unsigned char *o, float r, float g, float b, float a) {
  if (a <= 0)
    return;
  const float da = o[3] / 255.0f, oa = a + da * (1 - a);
  if (oa <= 0)
    return;
  o[0] = (unsigned char)lroundf((r * a + o[0] * da * (1 - a)) / oa);
  o[1] = (unsigned char)lroundf((g * a + o[1] * da * (1 - a)) / oa);
  o[2] = (unsigned char)lroundf((b * a + o[2] * da * (1 - a)) / oa);
  o[3] = (unsigned char)lroundf(oa * 255);
}

void fill_rr(Image &img, float l, float t, float w, float h, float r, float cr, float cg, float cb, float ca) {
  for (int y = (int)floorf(t) - 1; y <= (int)ceilf(t + h) + 1; ++y)
    for (int x = (int)floorf(l) - 1; x <= (int)ceilf(l + w) + 1; ++x) {
      if (x < 0 || y < 0 || x >= img.w || y >= img.h)
        continue;
      const float c = rr_cover((float)x, (float)y, l, t, w, h, r);
      if (c > 0)
        blend(&img.px[((size_t)y * img.w + x) * 4], cr, cg, cb, ca * c);
    }
}

/* the icon scaled into a round w x h box (box filter); a box of another
   shape than the icon shows its middle (cover, vertical tiles) */
void draw_icon(Image &img, const Image &icon, float l, float t, float w, float h, float r) {
  const int x0 = (int)floorf(l), y0 = (int)floorf(t), nw = (int)ceilf(w), nh = (int)ceilf(h);
  const float sc = fmaxf(w / icon.w, h / icon.h);
  const int cw = std::max(1, std::min(icon.w, (int)lroundf(w / sc)));
  const int ch = std::max(1, std::min(icon.h, (int)lroundf(h / sc)));
  const int ox = (icon.w - cw) / 2, oy = (icon.h - ch) / 2;
  for (int y = 0; y < nh; ++y)
    for (int x = 0; x < nw; ++x) {
      const int X = x0 + x, Y = y0 + y;
      if (X < 0 || Y < 0 || X >= img.w || Y >= img.h)
        continue;
      const float c = rr_cover((float)X, (float)Y, l, t, w, h, r);
      if (c <= 0)
        continue;
      const int sx0 = ox + x * cw / nw, sx1 = std::max(sx0 + 1, ox + (x + 1) * cw / nw);
      const int sy0 = oy + y * ch / nh, sy1 = std::max(sy0 + 1, oy + (y + 1) * ch / nh);
      float s[4] = {0, 0, 0, 0};
      int cnt = 0;
      for (int sy = sy0; sy < sy1 && sy < icon.h; ++sy)
        for (int sx = sx0; sx < sx1 && sx < icon.w; ++sx) {
          const unsigned char *p = &icon.px[((size_t)sy * icon.w + sx) * 4];
          const float a = p[3] / 255.0f;
          s[0] += p[0] * a; s[1] += p[1] * a; s[2] += p[2] * a; s[3] += a;
          ++cnt;
        }
      if (!cnt || s[3] <= 0)
        continue;
      blend(&img.px[((size_t)Y * img.w + X) * 4], s[0] / s[3], s[1] / s[3], s[2] / s[3], s[3] / cnt * c);
    }
}

bool load_icon(const std::string &dir, Image &icon); /* below */

/* a game icon: the path asked for or, when that fails (the Home may not
   know the real name yet: icon0_07.png, homebrew in /user/app), any
   icon0*.png of that title id */
bool load_game_icon(const std::string &path, Image &icon) {
  if (load_png(path.c_str(), icon))
    return true;
  for (const char *root : {"/user/appmeta/", "/user/app/"}) {
    const size_t at = path.find(root);
    if (at != 0)
      continue;
    const std::string id = path.substr(strlen(root), 9);
    return id.size() == 9 && (load_icon("/user/appmeta/" + id + "/", icon) ||
                              load_icon("/user/app/" + id + "/sce_sys/", icon));
  }
  return false;
}

/* "+N" without a font: digits as round-capped strokes on a 0.6 x 1
   box (y down); the editor draws the same strokes on its canvas */
struct Pt {
  float x, y;
};
using Stroke = std::vector<Pt>;

Stroke arc(float cx, float cy, float rx, float ry, float a0, float a1, Stroke s = {}) {
  for (int i = 0; i <= 24; ++i) {
    const float a = (a0 + (a1 - a0) * i / 24) * 3.14159265f / 180;
    s.push_back({cx + rx * cosf(a), cy + ry * sinf(a)});
  }
  return s;
}

std::vector<Stroke> glyph(char c) {
  switch (c) {
  case '+': return {{{0.3f, 0.2f}, {0.3f, 0.8f}}, {{0, 0.5f}, {0.6f, 0.5f}}};
  case '0': return {arc(0.3f, 0.5f, 0.3f, 0.5f, 0, 360)};
  case '1': return {{{0.1f, 0.18f}, {0.34f, 0}, {0.34f, 1}}};
  case '2': {
    Stroke s = arc(0.3f, 0.29f, 0.29f, 0.29f, 195, 380);
    s.push_back({0, 1});
    s.push_back({0.6f, 1});
    return {s};
  }
  case '3': return {arc(0.3f, 0.26f, 0.27f, 0.24f, 200, 450), arc(0.3f, 0.74f, 0.3f, 0.26f, 270, 520)};
  case '4': return {{{0.46f, 1}, {0.46f, 0}, {0, 0.68f}, {0.62f, 0.68f}}};
  case '5': return {arc(0.3f, 0.68f, 0.3f, 0.32f, 215, 510, {{0.56f, 0}, {0.1f, 0}})};
  case '6': return {arc(0.32f, 0.5f, 0.28f, 0.5f, 300, 160), arc(0.3f, 0.7f, 0.28f, 0.3f, 180, 540)};
  case '7': return {{{0, 0}, {0.6f, 0}, {0.18f, 1}}};
  case '8': return {arc(0.3f, 0.25f, 0.24f, 0.25f, 0, 360), arc(0.3f, 0.73f, 0.29f, 0.27f, 0, 360)};
  case '9': return {arc(0.3f, 0.3f, 0.28f, 0.3f, 0, 360), arc(0.28f, 0.5f, 0.3f, 0.5f, 0, 140, {{0.58f, 0.3f}})};
  default: return {};
  }
}

/* white text centred on (cx, cy), `h` pixels high */
void draw_text(Image &img, const std::string &text, float cx, float cy, float h) {
  const float adv = 0.78f, sw = 0.15f * h;
  const float width = (text.size() * adv - 0.18f) * h;
  std::vector<std::pair<Pt, Pt>> segs;
  for (size_t i = 0; i < text.size(); ++i) {
    const float ox = cx - width / 2 + i * adv * h, oy = cy - h / 2;
    for (const Stroke &s : glyph(text[i]))
      for (size_t k = 0; k + 1 < s.size(); ++k)
        segs.push_back({{ox + s[k].x * h, oy + s[k].y * h}, {ox + s[k + 1].x * h, oy + s[k + 1].y * h}});
  }
  const int x0 = std::max(0, (int)(cx - width / 2 - sw)), x1 = std::min(img.w - 1, (int)(cx + width / 2 + sw));
  const int y0 = std::max(0, (int)(cy - h / 2 - sw)), y1 = std::min(img.h - 1, (int)(cy + h / 2 + sw));
  for (int y = y0; y <= y1; ++y)
    for (int x = x0; x <= x1; ++x) {
      const float px = x + 0.5f, py = y + 0.5f;
      float d = 1e9f;
      for (const auto &sg : segs) {
        const float vx = sg.second.x - sg.first.x, vy = sg.second.y - sg.first.y;
        const float len = vx * vx + vy * vy;
        float t = len > 0 ? ((px - sg.first.x) * vx + (py - sg.first.y) * vy) / len : 0;
        t = fminf(1, fmaxf(0, t));
        const float dx = px - sg.first.x - t * vx, dy = py - sg.first.y - t * vy;
        d = fminf(d, sqrtf(dx * dx + dy * dy));
      }
      const float c = fminf(1, fmaxf(0, sw / 2 + 0.5f - d));
      if (c > 0)
        blend(&img.px[((size_t)y * img.w + x) * 4], 255, 255, 255, c);
    }
}

/* the folder symbol (tab + body), w wide, top-left at (l, t) */
void draw_folder_mark(Image &img, float l, float t, float w) {
  const float h = w * 0.74f;
  fill_rr(img, l, t, w * 0.42f, h * 0.3f, w * 0.08f, 255, 255, 255, 1);
  fill_rr(img, l, t + h * 0.14f, w, h * 0.86f, w * 0.1f, 255, 255, 255, 1);
}

/* vertical tiles: up to 3 covers stacked diagonally (the first game in
   front, the others behind it and darker) and a dark pill with the folder
   symbol and "+N" on the front cover */
void draw_stack(Image &img, const std::vector<std::string> &icons, int more, int &loaded) {
  const size_t n = std::min<size_t>(icons.size(), 3);
  /* a wide picture (the Steam focused tile): 2:3 covers side by side,
     overlapping, the first one in front on the left */
  const bool wide = img.w > img.h;
  const float P = 28, W = wide ? (img.h - 2 * P) / 1.5f : img.w * 0.66f, H = wide ? img.h - 2 * P : W * img.h / img.w,
              R = 22;
  const float step = wide && n > 1 ? std::min(W * 0.62f, (img.w - 2 * P - W) / (n - 1)) : 0;
  const float wl = (img.w - W - (n > 1 ? (n - 1) * step : 0)) / 2;
  const float dx = n > 1 ? (img.w - 2 * P - W) / (n - 1) : 0, dy = n > 1 ? (img.h - 2 * P - H) / (n - 1) : 0;
  float fl = (img.w - W) / 2, ft = (img.h - H) / 2; /* the front cover */
  for (size_t i = n; i-- > 0;) {
    float l = n > 1 ? P + (n - 1 - i) * dx : fl, t = n > 1 ? P + i * dy : ft;
    if (wide) {
      l = wl + i * step;
      t = P;
    }
    if (i == 0) {
      fl = l;
      ft = t;
    }
    fill_rr(img, l - 4, t - 4, W + 8, H + 8, R + 4, 0, 0, 0, 0.45f); /* edge between covers */
    Image icon;
    if (load_game_icon(icons[i], icon)) {
      draw_icon(img, icon, l, t, W, H, R);
      ++loaded;
    } else {
      fill_rr(img, l, t, W, H, R, 255, 255, 255, 0.08f);
    }
    if (i > 0)
      fill_rr(img, l, t, W, H, R, 0, 0, 0, i == 1 ? 0.25f : 0.45f);
  }
  /* the pill: folder symbol, then "+N" (games not drawn) */
  const float ph = std::min(76.f, W * 0.45f), mw = ph * 0.56f, th = ph * 0.42f;
  const std::string txt = more > 0 ? "+" + std::to_string(more) : "";
  const float tw = txt.empty() ? 0 : (txt.size() * 0.78f - 0.18f) * th;
  const float pw = ph * 0.5f + mw + (txt.empty() ? 0 : ph * 0.28f + tw) + ph * 0.5f;
  const float pl = n ? fl + W - pw - 18 : (img.w - pw) / 2, pt = n ? ft + H - ph - 18 : (img.h - ph) / 2;
  fill_rr(img, pl, pt, pw, ph, ph / 2, 0, 0, 0, 0.62f);
  draw_folder_mark(img, pl + ph * 0.5f, pt + (ph - mw * 0.74f) / 2 + 2, mw);
  if (!txt.empty())
    draw_text(img, txt, pl + ph * 0.5f + mw + ph * 0.28f + tw / 2, pt + ph / 2, th);
}

} // namespace

bool zt_folder_mosaic(const std::string &name, const std::string &colour, double alpha,
                      const std::vector<std::string> &icons, int more, double ratio, bool stack, bool squares, bool oneRow) {
  const std::string dir = ZT_CACHE_MOSAICS; /* (backgrounds/ before) */
  const std::string path = dir + "/" + name;
  struct stat st;
  if (stat(path.c_str(), &st) == 0) {
    /* same games, colour and opacity: already made, unless a game's picture
       was changed after it (a custom tile replaced under the same name) */
    bool newer = false;
    for (const std::string &ic : icons) {
      struct stat is;
      if (stat(ic.c_str(), &is) == 0 && is.st_mtime > st.st_mtime)
        newer = true;
    }
    if (!newer)
      return true;
    zt_log("folders: mosaic %s made again (a picture is newer)", name.c_str());
  }
  zt_mkdirs(dir);
  unsigned rgb = 0x24345a;
  if (colour.size() == 7 && colour[0] == '#')
    rgb = (unsigned)strtoul(colour.c_str() + 1, nullptr, 16);
  const float cr = (float)(rgb >> 16 & 255), cg = (float)(rgb >> 8 & 255), cb = (float)(rgb & 255);
  const float a = (float)fmin(1.0, fmax(0.0, alpha));
  /* vertical tiles (tileRatio) get a mosaic of their shape, 512 wide */
  const int S = 512, SH = (int)lround(S * fmin(3.0, fmax(0.3, ratio > 0 ? ratio : 1.0)));
  /* a wide one (the Steam 92:43 focused tile) has its 4 squares in a row */
  int cols = SH * 4 < S * 3 ? 4 : 2, rows = 4 / cols;
  const float P = 28, G = 20;
  float Q = (S - 2 * P - (cols - 1) * G) / cols, QH = (SH - 2 * P - (rows - 1) * G) / rows, ox = P, oy = P;
  /* squares: square icons in 2 rows (wide) or 2 columns (tall), as many
     as fit, the grid in the middle; the last square: folder symbol or "+N" */
  if (squares && oneRow) {
    /* 4 square icons in one row (3 games + folder symbol / "+N") */
    cols = 4;
    rows = 1;
    Q = std::min((S - 2 * P - 3 * G) / 4, SH - 2 * P);
  } else if (squares) {
    if (S >= SH) {
      rows = 2;
      Q = (SH - 2 * P - G) / 2;
      cols = std::max(1, (int)((S - 2 * P + G) / (Q + G)));
    } else {
      cols = 2;
      Q = (S - 2 * P - G) / 2;
      rows = std::max(1, (int)((SH - 2 * P + G) / (Q + G)));
    }
  }
  if (squares) {
    QH = Q;
    ox = (S - cols * Q - (cols - 1) * G) / 2;
    oy = (SH - rows * Q - (rows - 1) * G) / 2;
  }
  const size_t cells = squares ? (size_t)(cols * rows) : 4;
  const float RR = std::min(22.f, Q * 0.2f);
  Image img;
  img.w = S;
  img.h = SH;
  img.px.assign((size_t)S * SH * 4, 0);
  for (int y = 0; y < SH; ++y)
    for (int x = 0; x < S; ++x) {
      /* canvas linear gradient (0,0) -> (S,SH): colour -> colour * 0.4 */
      const float t = (x + y + 1) / (float)(S + SH), k = 1 - 0.6f * t;
      unsigned char *o = &img.px[((size_t)y * S + x) * 4];
      o[0] = (unsigned char)lroundf(cr * k);
      o[1] = (unsigned char)lroundf(cg * k);
      o[2] = (unsigned char)lroundf(cb * k);
      o[3] = (unsigned char)lroundf(a * 255);
    }
  const size_t games = std::min<size_t>(icons.size(), std::min<size_t>(cells - 1, squares ? 7 : 3));
  if (squares)
    more += (int)(icons.size() - games); /* sent but no room */
  const size_t mark = games; /* the folder symbol: first free square */
  int loaded = 0;
  if (stack)
    draw_stack(img, icons, more, loaded);
  for (size_t k = 0; !stack && k < cells; ++k) {
    const float l = ox + (k % cols) * (Q + G), t = oy + (k / cols) * (QH + G);
    Image icon;
    if (k < games && load_game_icon(icons[k], icon)) {
      draw_icon(img, icon, l, t, Q, QH, RR);
      ++loaded;
    } else {
      fill_rr(img, l, t, Q, QH, RR, 255, 255, 255, 0.08f);
    }
    if (k == cells - 1 && more > 0) {
      /* games that do not fit in the mosaic */
      draw_text(img, "+" + std::to_string(more), l + Q / 2, t + QH / 2, Q * 0.24f);
    } else if (k == mark) {
      const float w = Q * 0.62f, h = w * 0.74f, fl = l + (Q - w) / 2, ft = t + (QH - h) / 2 + 4;
      /* the corners fit small squares (the 4-in-a-row icons) */
      fill_rr(img, fl, ft, w * 0.42f, h * 0.3f, std::min(8.f, h * 0.14f), 255, 255, 255, 1);
      fill_rr(img, fl, ft + h * 0.14f, w, h * 0.86f, std::min(10.f, h * 0.2f), 255, 255, 255, 1);
    }
  }
  const bool ok = save_png(path.c_str(), img);
  zt_log("folders: mosaic %s %s (%d of %zu icons%s)", name.c_str(), ok ? "written" : "NOT written",
                 loaded, games, stack ? ", stack" : squares ? ", squares" : "");
  return ok;
}

/*
 * Folder background: one 1920x1080 picture made from the pic0 of the
 * folder's games, shown by the Home when the folder is focused (the
 * SceneControl background, like a game's art). Styles: "slices"
 * (diagonal strips, one per game) and "grid" (2 / big + 2 / 2x2 cells), with
 * the first 4 games. Each game's art is centred on
 * its own strip / cell. Darker at the bottom (row, title) and a little at the
 * top (tabs). Made on a thread of its own: about a second per game.
 */
namespace {

const int BW = 1920, BH = 1080;
const float SKEW = 0.21256f, SKEW_COS = 0.97815f; /* tan / cos of 12 degrees */

struct Rgb {
  float r, g, b;
};

/* small noise against banding in the gradients */
struct Noise {
  unsigned s;
  float operator()(float amp) {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return ((s & 0xffff) / 65535.0f - 0.5f) * 2 * amp;
  }
};

/* the picture cropped to fill w x h (centred), box filtered */
Image cover(const Image &s, int w, int h) {
  Image o;
  o.w = w;
  o.h = h;
  o.px.assign((size_t)w * h * 4, 255);
  const double sc = std::max((double)w / s.w, (double)h / s.h);
  const double ox = (s.w - w / sc) / 2, oy = (s.h - h / sc) / 2;
  std::vector<int> x0(w), x1(w);
  for (int x = 0; x < w; ++x) {
    x0[x] = std::min(s.w - 1, (int)(ox + x / sc));
    x1[x] = std::min(s.w, std::max(x0[x] + 1, (int)(ox + (x + 1) / sc)));
  }
  for (int y = 0; y < h; ++y) {
    const int y0 = std::min(s.h - 1, (int)(oy + y / sc));
    const int y1 = std::min(s.h, std::max(y0 + 1, (int)(oy + (y + 1) / sc)));
    for (int x = 0; x < w; ++x) {
      unsigned acc[3] = {0, 0, 0}, n = 0;
      for (int sy = y0; sy < y1; ++sy)
        for (int sx = x0[x]; sx < x1[x]; ++sx) {
          const unsigned char *p = &s.px[((size_t)sy * s.w + sx) * 4];
          acc[0] += p[0];
          acc[1] += p[1];
          acc[2] += p[2];
          ++n;
        }
      unsigned char *q = &o.px[((size_t)y * w + x) * 4];
      for (int c = 0; c < 3; ++c)
        q[c] = (unsigned char)(acc[c] / n);
    }
  }
  return o;
}

/* separable box blur, `passes` times (about a gaussian) */
void blur(Image &img, int r, int passes) {
  std::vector<unsigned char> tmp(img.px.size(), 255);
  for (int p = 0; p < passes; ++p)
    for (int dir = 0; dir < 2; ++dir) {
      const int len = dir ? img.h : img.w, lines = dir ? img.w : img.h;
      for (int l = 0; l < lines; ++l)
        for (int c = 0; c < 3; ++c) {
          auto at = [&](int i) -> size_t {
            i = std::max(0, std::min(len - 1, i));
            return dir ? ((size_t)i * img.w + l) * 4 + c : ((size_t)l * img.w + i) * 4 + c;
          };
          int sum = 0;
          for (int i = -r; i <= r; ++i)
            sum += img.px[at(i)];
          for (int i = 0; i < len; ++i) {
            tmp[at(i)] = (unsigned char)(sum / (2 * r + 1));
            sum += img.px[at(i + r + 1)] - img.px[at(i - r)];
          }
        }
      img.px.swap(tmp);
    }
}

float smooth(float a, float b, float x) {
  const float t = fminf(1, fmaxf(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/* darker at the bottom (the row and the title) and a little at the top */
void shade(Image &img, float overall, float top) {
  Noise noise{7};
  for (int y = 0; y < img.h; ++y) {
    const float v = (float)y / img.h;
    const float k = overall * (1 - 0.72f * smooth(0.42f, 1.0f, v)) * (1 - top * (1 - smooth(0.0f, 0.16f, v)));
    for (int x = 0; x < img.w; ++x) {
      unsigned char *p = &img.px[((size_t)y * img.w + x) * 4];
      for (int c = 0; c < 3; ++c)
        p[c] = (unsigned char)fminf(255, fmaxf(0, p[c] * k + noise(0.5f)));
    }
  }
}

Image upscale(const Image &s, int w, int h) {
  Image o;
  o.w = w;
  o.h = h;
  o.px.assign((size_t)w * h * 4, 255);
  for (int y = 0; y < h; ++y) {
    const float fy = std::max(0.0f, (y + 0.5f) * s.h / h - 0.5f);
    const int y0 = std::min(s.h - 1, (int)fy), y1 = std::min(s.h - 1, y0 + 1);
    const float ty = fy - y0;
    for (int x = 0; x < w; ++x) {
      const float fx = std::max(0.0f, (x + 0.5f) * s.w / w - 0.5f);
      const int xa = std::min(s.w - 1, (int)fx), xb = std::min(s.w - 1, xa + 1);
      const float tx = fx - xa;
      for (int c = 0; c < 3; ++c) {
        auto P = [&](int X, int Y) { return (float)s.px[((size_t)Y * s.w + X) * 4 + c]; };
        o.px[((size_t)y * w + x) * 4 + c] = (unsigned char)lroundf(
            (P(xa, y0) * (1 - tx) + P(xb, y0) * tx) * (1 - ty) + (P(xa, y1) * (1 - tx) + P(xb, y1) * tx) * ty);
      }
    }
  }
  return o;
}

/* a game without art (homebrew with only pic0.dds, some apps): its icon,
   blurred and darker, fills the picture and the icon itself sits in the
   middle (such games were left out) */
Image icon_card(const Image &icon) {
  Image small = cover(icon, 192, 108);
  blur(small, 4, 3);
  Image o = upscale(small, BW, BH);
  for (size_t i = 0; i < o.px.size(); i += 4)
    for (int c = 0; c < 3; ++c)
      o.px[i + c] = (unsigned char)(o.px[i + c] * 0.55f);
  const float q = 300;
  draw_icon(o, icon, (BW - q) / 2, 460 - q / 2, q, q, 36);
  for (size_t i = 3; i < o.px.size(); i += 4)
    o.px[i] = 255;
  return o;
}

/* icon0.png, or the first icon0*.png (icon0_07.png...) of the folder */
std::string icon_path(const std::string &dir) {
  struct stat st;
  if (stat((dir + "icon0.png").c_str(), &st) == 0)
    return dir + "icon0.png";
  DIR *d = opendir(dir.c_str());
  if (!d)
    return std::string();
  std::string out;
  while (struct dirent *e = readdir(d)) {
    const std::string n = e->d_name;
    if (n.rfind("icon0", 0) == 0 && n.size() > 9 && n.compare(n.size() - 4, 4, ".png") == 0) {
      out = dir + n;
      break;
    }
  }
  closedir(d);
  return out;
}

bool load_icon(const std::string &dir, Image &icon) {
  const std::string p = icon_path(dir);
  return !p.empty() && load_png(p.c_str(), icon);
}

Image filled(Rgb c) {
  Image o;
  o.w = BW;
  o.h = BH;
  o.px.assign((size_t)BW * BH * 4, 255);
  for (size_t i = 0; i < o.px.size(); i += 4) {
    o.px[i] = (unsigned char)c.r;
    o.px[i + 1] = (unsigned char)c.g;
    o.px[i + 2] = (unsigned char)c.b;
  }
  return o;
}

/* where a game's picture comes from: its art (pic0.png, pic1.png for PS4
   games) or, without art, its icon (a card) */
struct GameArt {
  std::string id, path;
  bool icon = false;
};

bool exists(const std::string &p) {
  struct stat st;
  return stat(p.c_str(), &st) == 0 && st.st_size > 0;
}

GameArt find_art(const std::string &id) {
  GameArt a;
  a.id = id;
  const std::string meta = "/user/appmeta/" + id + "/", app = "/user/app/" + id + "/sce_sys/";
  for (const std::string &p : {meta + "pic0.png", app + "pic0.png", meta + "pic1.png", app + "pic1.png"})
    if (exists(p)) {
      a.path = p;
      return a;
    }
  a.path = icon_path(meta);
  if (a.path.empty())
    a.path = icon_path(app);
  a.icon = !a.path.empty();
  return a;
}

/* the game's picture at 1920x1080; one at a time (kept every
   game's picture until the end) */
bool load_art(const GameArt &a, Image &out) {
  Image src;
  if (!load_png(a.path.c_str(), src, a.icon ? 0 : BW))
    return false;
  if (a.icon)
    out = icon_card(src);
  else if (src.w == BW && src.h == BH)
    out = std::move(src);
  else
    out = cover(src, BW, BH);
  return true;
}

/* diagonal strips; weights = share of the width of each game */
Image slices(const std::vector<GameArt> &arts, const std::vector<float> &weights, Rgb line, size_t *used) {
  const size_t n = arts.size();
  const float gap = 5;
  std::vector<float> edge(n + 1, 0);
  float total = 0;
  for (float w : weights)
    total += w;
  for (size_t i = 0; i < n; ++i)
    edge[i + 1] = edge[i] + weights[i] / total * BW;
  Image o = filled({line.r * 0.3f, line.g * 0.3f, line.b * 0.3f});
  for (size_t i = 0; i < n; ++i) {
    Image pic;
    if (!load_art(arts[i], pic))
      continue;
    ++*used;
    /* the middle of the game's picture in the middle of its strip; x, not
       u: the picture moves with the strip but is not sheared */
    const float centre = (edge[i] + edge[i + 1]) / 2;
    for (int y = 0; y < BH; ++y) {
      const float lean = (BH / 2.0f - y) * SKEW;
      const int x0 = i == 0 ? 0 : std::max(0, (int)ceilf(edge[i] + lean));
      const int x1 = i + 1 == n ? BW : std::min(BW, (int)ceilf(edge[i + 1] + lean));
      for (int x = x0; x < x1; ++x) {
        const int sx = std::max(0, std::min(BW - 1, (int)lroundf(x - centre + BW / 2.0f)));
        memcpy(&o.px[((size_t)y * BW + x) * 4], &pic.px[((size_t)y * BW + sx) * 4], 3);
      }
    }
  }
  for (int y = 0; y < BH; ++y) {
    const float lean = (BH / 2.0f - y) * SKEW;
    for (int x = 0; x < BW; ++x) {
      const float u = x - lean;
      float d = 1e9f;
      for (size_t e = 1; e < n; ++e)
        d = fminf(d, fabsf(u - edge[e]) * SKEW_COS);
      const float c = fminf(1, fmaxf(0, gap / 2 + 0.5f - d));
      if (c > 0)
        blend(&o.px[((size_t)y * BW + x) * 4], line.r, line.g, line.b, c);
    }
  }
  return o;
}

/* cells: 2 side by side, 3 = one big + two stacked, 4 = 2x2, 5 = 2 over 3,
   6 = 3x2 */
Image grid(const std::vector<GameArt> &arts, Rgb line, size_t *used) {
  struct Cell {
    float l, t, w, h;
  };
  std::vector<Cell> cells;
  const size_t n = arts.size();
  if (n == 1)
    cells = {{0, 0, 1, 1}};
  else if (n == 2)
    cells = {{0, 0, .5f, 1}, {.5f, 0, .5f, 1}};
  else if (n == 3)
    cells = {{0, 0, .6f, 1}, {.6f, 0, .4f, .5f}, {.6f, .5f, .4f, .5f}};
  else if (n == 4)
    cells = {{0, 0, .5f, .5f}, {.5f, 0, .5f, .5f}, {0, .5f, .5f, .5f}, {.5f, .5f, .5f, .5f}};
  else if (n == 5)
    cells = {{0, 0, .5f, .5f}, {.5f, 0, .5f, .5f}, {0, .5f, 1 / 3.0f, .5f}, {1 / 3.0f, .5f, 1 / 3.0f, .5f},
             {2 / 3.0f, .5f, 1 / 3.0f, .5f}};
  else
    for (int k = 0; k < 6; ++k)
      cells.push_back({(k % 3) / 3.0f, (k / 3) / 2.0f, 1 / 3.0f, .5f});
  Image o = filled(line);
  const float g = 4; /* half the gap */
  for (size_t k = 0; k < cells.size() && k < n; ++k) {
    Image pic;
    if (!load_art(arts[k], pic))
      continue;
    ++*used;
    const Cell &e = cells[k];
    const int l = (int)lroundf(e.l * BW + (e.l > 0 ? g : 0));
    const int t = (int)lroundf(e.t * BH + (e.t > 0 ? g : 0));
    const int r = (int)lroundf((e.l + e.w) * BW - (e.l + e.w < 0.999f ? g : 0));
    const int b = (int)lroundf((e.t + e.h) * BH - (e.t + e.h < 0.999f ? g : 0));
    const Image c = cover(pic, r - l, b - t);
    for (int y = 0; y < c.h; ++y)
      memcpy(&o.px[((size_t)(t + y) * BW + l) * 4], &c.px[(size_t)y * c.w * 4], (size_t)c.w * 4);
  }
  return o;
}

} // namespace

bool zt_folder_background(const std::string &name, const std::string &style, const std::string &colour,
                          const std::vector<std::string> &ids, const std::vector<std::string> &own) {
  const std::string dir = ZT_CACHE_FOLDERBG; /* (backgrounds/ before) */
  const std::string path = dir + "/" + name;
  struct stat st;
  if (stat(path.c_str(), &st) == 0)
    return true; /* same games, style and colour: already made */
  zt_mkdirs(dir);
  unsigned rgb = 0x24345a;
  if (colour.size() == 7 && colour[0] == '#')
    rgb = (unsigned)strtoul(colour.c_str() + 1, nullptr, 16);
  const Rgb line = {(float)(rgb >> 16 & 255), (float)(rgb >> 8 & 255), (float)(rgb & 255)};
  const size_t most = 4; /* the first 4 games */
  std::vector<GameArt> arts;
  for (size_t i = 0; i < ids.size() && arts.size() < most; ++i) {
    GameArt a = find_art(ids[i]);
    /* the game's own background (custombg, 1920x1080 PNG) */
    if (i < own.size() && !own[i].empty() && exists(std::string(ZT_CUSTOMBG "/") + own[i])) {
      a.path = std::string(ZT_CUSTOMBG "/") + own[i];
      a.icon = false;
      zt_log("folders: background %s: own background %s for %s", name.c_str(), own[i].c_str(), ids[i].c_str());
    }
    if (a.path.empty()) {
      zt_log("folders: background %s: no picture for %s", name.c_str(), ids[i].c_str());
      continue;
    }
    if (a.icon)
      zt_log("folders: background %s: icon card for %s", name.c_str(), ids[i].c_str());
    arts.push_back(a);
  }
  if (arts.empty()) {
    zt_log("folders: background %s NOT made (no picture)", name.c_str());
    return false;
  }
  size_t used = 0;
  Image out;
  if (style == "grid") {
    out = grid(arts, line, &used);
    shade(out, 0.85f, 0.35f);
  } else {
    out = slices(arts, std::vector<float>(arts.size(), 1), line, &used);
    shade(out, 1, 0.35f);
  }
  const bool ok = used > 0 && save_png(path.c_str(), out);
  zt_log("folders: background %s %s (%s, %zu of %zu games)", name.c_str(), ok ? "written" : "NOT written",
                 style.c_str(), used, ids.size());
  return ok;
}

/*
 * Game background from a SteamGridDB "hero" (zoom): heroes are
 * about 3:1 (1920x620 / 3840x1240), the Home's background is 16:9. The hero
 * is enlarged until its top and bottom edges fill the 1080 lines and a 16:9
 * window of it is kept; pos (0 = left edge, 0.5 = middle, 1 = right edge) is
 * where the window sits, picked in the editor.
 */
bool zt_hero_background(const std::string &src, const std::string &dest, double pos) {
  Image hero;
  if (!load_png(src.c_str(), hero, 4096) || hero.w < 16 || hero.h < 16) {
    zt_log("custombg: %s is not a PNG it can read", src.c_str());
    return false;
  }
  pos = fmin(1.0, fmax(0.0, pos));
  const int win = std::min(hero.w, std::max(1, (int)lround(hero.h * 16.0 / 9.0)));
  const int left = (int)lround(pos * (hero.w - win));
  Image part;
  part.w = win;
  part.h = hero.h;
  part.px.resize((size_t)win * hero.h * 4);
  for (int y = 0; y < hero.h; ++y)
    memcpy(&part.px[(size_t)y * win * 4], &hero.px[((size_t)y * hero.w + left) * 4], (size_t)win * 4);
  /* 3840x1240 shrinks (box filter of cover), 1920x620 is enlarged
     (bilinear); the window is 16:9 to a pixel */
  Image out = part.w >= BW ? cover(part, BW, BH) : upscale(part, BW, BH);
  for (size_t i = 3; i < out.px.size(); i += 4)
    out.px[i] = 255;
  const bool ok = save_png(dest.c_str(), out);
  zt_log("custombg: %s from a %dx%d hero at %.2f %s", dest.c_str(), hero.w, hero.h, pos, ok ? "written" : "NOT written");
  return ok;
}

/*
 * A system tile's icon for vertical tiles: Game / App Library and
 * All apps are a see-through dark square with the symbol on it; stretching
 * it to 2:3 stretched the symbol. The square stays as it is in the middle of
 * a taller picture and the rows above and below repeat its own top and
 * bottom row (the plain background), so only the background grows.
 */
bool zt_tall_icon(const std::string &src, const std::string &dest, double ratio) {
  struct stat st;
  if (stat(dest.c_str(), &st) == 0)
    return true;
  Image icon;
  if (!load_png(src.c_str(), icon) || icon.w < 8 || icon.h < 8) {
    zt_log("system tile: %s is not a PNG it can read", src.c_str());
    return false;
  }
  ratio = fmin(3.0, fmax(0.3, ratio));
  Image out;
  if (ratio < 1.0) {
    /* a wider copy (Steam 92:43 focused shape): the square stays in
       the middle and the columns left and right repeat its own first and
       last column */
    out.h = icon.h;
    out.w = (int)lround(icon.h / ratio);
    out.px.resize((size_t)out.w * out.h * 4);
    const int left = (out.w - icon.w) / 2;
    for (int y = 0; y < out.h; ++y)
      for (int x = 0; x < out.w; ++x) {
        const int sx = std::min(icon.w - 1, std::max(0, x - left));
        memcpy(&out.px[((size_t)y * out.w + x) * 4], &icon.px[((size_t)y * icon.w + sx) * 4], 4);
      }
    const bool ok = save_png(dest.c_str(), out);
    zt_log("system tile: %s %dx%d %s", dest.c_str(), out.w, out.h, ok ? "written" : "NOT written");
    return ok;
  }
  out.w = icon.w;
  out.h = (int)lround(icon.w * ratio);
  out.px.resize((size_t)out.w * out.h * 4);
  const int top = (out.h - icon.h) / 2;
  for (int y = 0; y < out.h; ++y) {
    const int sy = std::min(icon.h - 1, std::max(0, y - top));
    memcpy(&out.px[(size_t)y * out.w * 4], &icon.px[(size_t)sy * icon.w * 4], (size_t)icon.w * 4);
  }
  const bool ok = save_png(dest.c_str(), out);
  zt_log("system tile: %s %dx%d %s", dest.c_str(), out.w, out.h, ok ? "written" : "NOT written");
  return ok;
}
