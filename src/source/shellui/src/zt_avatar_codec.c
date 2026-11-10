/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.

Adapted from AniketosHEN (Copyright (C) 2026 AniketosHEN, GPL-3.0,
git.etawen.dev/Alex0/AniketosHEN: avatar_codec.c); the crop chosen in the
editor's avatar maker is new. Uses stb_image / stb_image_resize2 (Sean
Barrett, public domain) and msf_gif (Miles Fogle, public domain). */

#include "zt_avatar_codec.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wall"
#pragma clang diagnostic ignored "-Wextra"
#pragma clang diagnostic ignored "-Wunused-function"
#pragma clang diagnostic ignored "-Wsign-compare"
#pragma clang diagnostic ignored "-Wunused-but-set-variable"

#define STB_IMAGE_IMPLEMENTATION
#define STBI_ONLY_GIF
#define STBI_NO_HDR
#define STBI_NO_LINEAR
#define STBI_NO_STDIO
#include "zt_third/stb_image.h"

#define STB_IMAGE_RESIZE_IMPLEMENTATION
#define STBIR_NO_SIMD
#include "zt_third/stb_image_resize2.h"

#define MSF_GIF_IMPL
#include "zt_third/msf_gif.h"

#pragma clang diagnostic pop

enum {
  ZT_AV_MAX_INPUT = 8 * 1024 * 1024,
  ZT_AV_MAX_FRAMES = 120,
  /* the system plays the fitted file by its size and frames (256 px and 120
     frames are inside its 300x300 / 150 limits), not by its bytes: a clip of
     60 frames is 0.4 to 0.8 MB at 256 */
  ZT_AV_MAX_BYTES = 2 * 1024 * 1024,
  ZT_AV_MAX_DIMENSION = 4096,
  ZT_AV_MAX_PIXELS = 16 * 1024 * 1024,
  ZT_AV_KEPT_SIDE = 256,
  ZT_AV_PATH_SIZE = 1024
};

volatile int zt_avatar_cancel = 0;

typedef struct {
  unsigned char *pixels[ZT_AV_MAX_FRAMES];
  int delay[ZT_AV_MAX_FRAMES]; /* milliseconds, then centiseconds */
  int count;
} Kept;

static void set_error(char *error, unsigned long size, const char *text) {
  if (error && size)
    (void)snprintf(error, (size_t)size, "%s", text);
}

static int read_file(const char *path, unsigned char **out, size_t *out_size) {
  FILE *file = fopen(path, "rb");
  long length = 0;
  unsigned char *data = NULL;
  if (!file)
    return -1;
  if (fseek(file, 0, SEEK_END) == 0)
    length = ftell(file);
  if (length > 0 && length <= ZT_AV_MAX_INPUT && fseek(file, 0, SEEK_SET) == 0)
    data = (unsigned char *)malloc((size_t)length);
  if (data && fread(data, 1, (size_t)length, file) != (size_t)length) {
    free(data);
    data = NULL;
  }
  fclose(file);
  if (!data)
    return -1;
  *out = data;
  *out_size = (size_t)length;
  return 0;
}

static int file_info(const char *path, long long *size, long long *mtime) {
  struct stat info;
  if (stat(path, &info) != 0 || !S_ISREG(info.st_mode))
    return -1;
  if (size)
    *size = (long long)info.st_size;
  if (mtime)
    *mtime = (long long)info.st_mtime;
  return 0;
}

static int has_crop(const ZtAvatarCrop *crop) { return crop && crop->side > 0; }

static void meta_text(char *text, size_t size, long long bytes, long long mtime,
                      const ZtAvatarCrop *crop) {
  (void)snprintf(text, size, "zhithemes-avatar %lld %lld %d %d %d\n", bytes, mtime,
                 has_crop(crop) ? crop->x : 0, has_crop(crop) ? crop->y : 0,
                 has_crop(crop) ? crop->side : 0);
}

static int meta_matches(const char *cache, long long bytes, long long mtime,
                        const ZtAvatarCrop *crop) {
  char path[ZT_AV_PATH_SIZE], want[128], have[128] = {0};
  FILE *file;
  if (snprintf(path, sizeof(path), "%s.meta", cache) >= (int)sizeof(path))
    return 0;
  file = fopen(path, "r");
  if (!file)
    return 0;
  if (!fgets(have, sizeof(have), file))
    have[0] = 0;
  fclose(file);
  meta_text(want, sizeof(want), bytes, mtime, crop);
  return strcmp(want, have) == 0;
}

int zt_avatar_should_fit(const char *path, const ZtAvatarCrop *crop) {
  unsigned char header[10];
  long long size = 0;
  size_t got;
  FILE *file;
  if (!path || file_info(path, &size, NULL) != 0)
    return 0;
  file = fopen(path, "rb");
  if (!file)
    return 0;
  got = fread(header, 1, sizeof(header), file);
  fclose(file);
  if (got < sizeof(header) ||
      (memcmp(header, "GIF87a", 6) != 0 && memcmp(header, "GIF89a", 6) != 0))
    return 0;
  if (has_crop(crop))
    return 1;
  const unsigned width = (unsigned)header[6] | ((unsigned)header[7] << 8);
  const unsigned height = (unsigned)header[8] | ((unsigned)header[9] << 8);
  return width > 256 || height > 256 || width != height || size > 140000;
}

int zt_avatar_cache_valid(const char *source, const char *cache, const ZtAvatarCrop *crop) {
  long long cache_size = 0, cache_mtime = 0, source_size = 0, source_mtime = 0;
  if (!source || !cache)
    return 0;
  if (file_info(cache, &cache_size, &cache_mtime) != 0 || cache_size <= 0)
    return 0;
  if (file_info(source, &source_size, &source_mtime) != 0 || cache_mtime < source_mtime)
    return 0;
  return meta_matches(cache, source_size, source_mtime, crop);
}

/* stbi_load_gif_from_memory keeps every frame whole (92 MB for 480x480 x
   100). Here the frames come one at a time with a pause after each (this
   runs beside the UI thread); past ZT_AV_MAX_FRAMES every second one is dropped
   and its time given to the one before it. */
static int decode_kept(const unsigned char *data, size_t size, const ZtAvatarCrop *crop,
                       Kept *kept) {
  stbi__context context;
  stbi__gif *gif = (stbi__gif *)calloc(1, sizeof(stbi__gif));
  int step = 1, comp = 0, ok = gif != NULL;
  stbi__start_mem(&context, data, (int)size);
  for (int frame = 0; ok && !zt_avatar_cancel; ++frame) {
    unsigned char *canvas = stbi__gif_load_next(&context, gif, &comp, 4, gif->background);
    if (!canvas || canvas == (unsigned char *)&context)
      break;
    if (frame / step == ZT_AV_MAX_FRAMES) {
      for (int i = 0; i < ZT_AV_MAX_FRAMES / 2; ++i) {
        free(kept->pixels[2 * i + 1]);
        kept->pixels[i] = kept->pixels[2 * i];
        kept->delay[i] = kept->delay[2 * i] + kept->delay[2 * i + 1];
      }
      kept->count = ZT_AV_MAX_FRAMES / 2;
      step *= 2;
    }
    if (frame % step == 0) {
      int side = gif->w < gif->h ? gif->w : gif->h;
      int x = (gif->w - side) / 2, y = (gif->h - side) / 2;
      if (has_crop(crop)) {
        side = crop->side;
        if (side > gif->w)
          side = gif->w;
        if (side > gif->h)
          side = gif->h;
        x = crop->x < 0 ? 0 : crop->x > gif->w - side ? gif->w - side : crop->x;
        y = crop->y < 0 ? 0 : crop->y > gif->h - side ? gif->h - side : crop->y;
      }
      const size_t corner = ((size_t)y * (size_t)gif->w + (size_t)x) * 4u;
      unsigned char *pixels = (unsigned char *)malloc((size_t)ZT_AV_KEPT_SIDE * ZT_AV_KEPT_SIDE * 4u);
      ok = pixels && stbir_resize_uint8_srgb(canvas + corner, side, side, gif->w * 4, pixels,
                                             ZT_AV_KEPT_SIDE, ZT_AV_KEPT_SIDE, 0, STBIR_RGBA) != NULL;
      if (!ok) {
        free(pixels);
        break;
      }
      kept->pixels[kept->count] = pixels;
      kept->delay[kept->count++] = 0;
    }
    if (kept->count > 0 && kept->delay[kept->count - 1] < 655350)
      kept->delay[kept->count - 1] += gif->delay;
    usleep(1000);
  }
  if (gif) {
    STBI_FREE(gif->out);
    STBI_FREE(gif->history);
    STBI_FREE(gif->background);
  }
  free(gif);
  for (int i = 0; i < kept->count; ++i) {
    const int cs = kept->delay[i] / 10;
    kept->delay[i] = cs < 2 ? 2 : cs > 65535 ? 65535 : cs;
  }
  return ok && !zt_avatar_cancel && kept->count > 0;
}

static MsfGifResult encode_target(const Kept *kept, int target) {
  unsigned char *resized = (unsigned char *)malloc((size_t)target * (size_t)target * 4u);
  MsfGifState state;
  MsfGifResult result;
  int ok = 1;
  memset(&state, 0, sizeof(state));
  memset(&result, 0, sizeof(result));
  msf_gif_alpha_threshold = 128;
  if (!resized || !msf_gif_begin(&state, target, target)) {
    free(resized);
    return result;
  }
  for (int i = 0; ok && !zt_avatar_cancel && i < kept->count; ++i) {
    ok = stbir_resize_uint8_srgb(kept->pixels[i], ZT_AV_KEPT_SIDE, ZT_AV_KEPT_SIDE, 0, resized, target,
                                 target, 0, STBIR_RGBA) != NULL &&
         msf_gif_frame(&state, resized, kept->delay[i], 8, 0);
    usleep(1000);
  }
  free(resized);
  result = msf_gif_end(&state);
  if (!ok || !result.data || result.dataSize == 0) {
    msf_gif_free(result);
    memset(&result, 0, sizeof(result));
  }
  return result;
}

static MsfGifResult encode_within_limit(const Kept *kept) {
  static const int targets[] = {ZT_AV_KEPT_SIDE, 192, 128};
  MsfGifResult encoded;
  for (size_t i = 0; i < sizeof(targets) / sizeof(targets[0]); ++i) {
    encoded = encode_target(kept, targets[i]);
    if (encoded.data && encoded.dataSize <= ZT_AV_MAX_BYTES)
      return encoded;
    msf_gif_free(encoded);
  }
  memset(&encoded, 0, sizeof(encoded));
  return encoded;
}

/* written beside, then renamed over: the system never reads half a file */
static int save_file(const char *path, const void *data, size_t size) {
  char temp[ZT_AV_PATH_SIZE];
  FILE *file;
  int ok;
  if (snprintf(temp, sizeof(temp), "%s.tmp", path) >= (int)sizeof(temp))
    return 0;
  file = fopen(temp, "wb");
  if (!file)
    return 0;
  ok = fwrite(data, 1, size, file) == size;
  ok = fclose(file) == 0 && ok;
  if (!ok || rename(temp, path) != 0) {
    remove(temp);
    return 0;
  }
  chmod(path, 0644);
  return 1;
}

static int write_meta(const char *source, const char *cache, const ZtAvatarCrop *crop) {
  char path[ZT_AV_PATH_SIZE], text[128];
  long long size = 0, mtime = 0;
  if (file_info(source, &size, &mtime) != 0 ||
      snprintf(path, sizeof(path), "%s.meta", cache) >= (int)sizeof(path))
    return -1;
  meta_text(text, sizeof(text), size, mtime, crop);
  return save_file(path, text, strlen(text)) ? 0 : -1;
}

int zt_avatar_fit(const char *source, const char *cache, const ZtAvatarCrop *crop,
                  char *error, unsigned long error_size) {
  unsigned char *data = NULL;
  Kept kept;
  MsfGifResult encoded;
  size_t data_size = 0;
  int w = 0, h = 0, comp = 0, decoded, result = -1;
  memset(&kept, 0, sizeof(kept));
  memset(&encoded, 0, sizeof(encoded));
  if (!source || !cache) {
    set_error(error, error_size, "invalid arguments");
    return -1;
  }
  if (read_file(source, &data, &data_size) != 0) {
    set_error(error, error_size, "read failed (over 8 MB?)");
    return -1;
  }
  if (!stbi_info_from_memory(data, (int)data_size, &w, &h, &comp) || w <= 0 || h <= 0 ||
      w > ZT_AV_MAX_DIMENSION || h > ZT_AV_MAX_DIMENSION || (long long)w * h > ZT_AV_MAX_PIXELS) {
    free(data);
    set_error(error, error_size, "dimensions rejected");
    return -1;
  }
  if (!zt_avatar_decode_fits(data, data_size)) {
    free(data);
    set_error(error, error_size, "too big to decode");
    return -1;
  }
  decoded = decode_kept(data, data_size, crop, &kept);
  free(data);
  if (decoded)
    encoded = encode_within_limit(&kept);
  if (!decoded)
    set_error(error, error_size, "decode failed");
  else if (!encoded.data)
    set_error(error, error_size, "output too large");
  else if (!save_file(cache, encoded.data, encoded.dataSize))
    set_error(error, error_size, "write failed");
  else if (write_meta(source, cache, crop) != 0) {
    remove(cache);
    set_error(error, error_size, "meta failed");
  } else
    result = 0;
  msf_gif_free(encoded);
  for (int i = 0; i < kept.count; ++i)
    free(kept.pixels[i]);
  return result;
}
