/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.

Adapted from AniketosHEN (Copyright (C) 2026 AniketosHEN, GPL-3.0,
git.etawen.dev/Alex0/AniketosHEN: avatar_codec.h). */

#ifndef ZT_AVATAR_CODEC_H
#define ZT_AVATAR_CODEC_H

#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

/* The square of the source the avatar shows, in source pixels; side 0 =
   the middle square. */
typedef struct {
  int x, y, side;
} ZtAvatarCrop;

/* Whether the GIF is over 256 px, over 140 KB or cropped: then a fitted
   copy is made and shown instead. */
int zt_avatar_should_fit(const char *path, const ZtAvatarCrop *crop);
/* The fitted copy is newer than the source and made from it with this crop. */
int zt_avatar_cache_valid(const char *source, const char *cache, const ZtAvatarCrop *crop);
/* Decodes the source a frame at a time, keeps the crop at 256 px and
   at most 120 frames, writes a looping GIF of 256, 192 or 128 px under
   2 MB. 0 = done. Meant for its own thread. */
int zt_avatar_fit(const char *source, const char *cache, const ZtAvatarCrop *crop,
                  char *error, unsigned long error_size);
/* Set when the module leaves: a running fit stops at the next frame. */
extern volatile int zt_avatar_cancel;

/* Whether the GIF is small enough to decode at all (zt_native_theme.cpp). */
int zt_avatar_decode_fits(const unsigned char *data, size_t size);

#ifdef __cplusplus
}
#endif

#endif
