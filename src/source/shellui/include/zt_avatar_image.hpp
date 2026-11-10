/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.

From AniketosHEN (Copyright (C) 2026 AniketosHEN, GPL-3.0,
git.etawen.dev/Alex0/AniketosHEN: avatar_image.hpp). */

/* What the avatar has to know about a picture file, read from its bytes
 * (host-testable, no Mono/PS5 I/O). The picture's format comes from these
 * too: the system's image reader goes by them, not by the file's extension.
 */
#pragma once

#include <cstddef>
#include <cstdint>
#include <cstring>

namespace ZtAvatarImage {

/* The limits of libScePsm for an animated picture it decodes whole: past
   them it refuses the file and the image box shows its error picture. */
constexpr long kMaxPixels = 90000; /* 300x300 */
constexpr int kMaxFrames = 150;
/* The most zt_avatar_codec may decode inside ShellUI: one frame at a time, so
   memory is the canvas (stb holds 9 bytes a pixel of it), and the time is
   every pixel of every frame (150 frames of 1080p). */
constexpr long kMaxCanvasPixels = 1920 * 1080;
constexpr uint64_t kMaxDecodedPixels = 150ull * 1920 * 1080;

enum class Format { Unknown, Gif, WebP, Png, Jpeg };
enum class Problem { None, NotPicture, TooLarge, TooManyFrames };

struct Info {
  Format format = Format::Unknown;
  int width = 0;  /* known for animated pictures only */
  int height = 0;
  int frames = 1;
};

namespace detail {

inline uint32_t le(const uint8_t *data, int bytes) {
  uint32_t value = 0;
  for (int i = 0; i < bytes; ++i)
    value |= static_cast<uint32_t>(data[i]) << (8 * i);
  return value;
}

/* Past a chain of GIF data blocks. */
inline size_t skip_gif_blocks(const uint8_t *data, size_t size, size_t at) {
  while (at < size) {
    const size_t length = data[at++];
    if (length == 0)
      break;
    at += length;
  }
  return at;
}

inline size_t gif_colour_table(uint8_t flags) {
  return flags & 0x80 ? static_cast<size_t>(3) << ((flags & 7) + 1) : 0;
}

inline void read_gif(const uint8_t *data, size_t size, Info &info) {
  info.width = static_cast<int>(le(data + 6, 2));
  info.height = static_cast<int>(le(data + 8, 2));
  info.frames = 0;
  size_t at = 13 + gif_colour_table(data[10]);
  while (at < size && data[at] != 0x3B) {
    const uint8_t block = data[at];
    if (block == 0x21) {
      /* stb leaves a control block of any other size without its chain and
         reads a tag next: follow it, or frames behind one go uncounted. */
      if (at + 2 < size && data[at + 1] == 0xF9 && data[at + 2] != 4)
        at += 3 + data[at + 2];
      else
        at = skip_gif_blocks(data, size, at + 2);
    } else if (block == 0x2C && at + 10 < size) {
      at += 10 + gif_colour_table(data[at + 9]);
      at = skip_gif_blocks(data, size, at + 1);
      ++info.frames;
    } else {
      break;
    }
  }
}

/* Chunks after "RIFF" size "WEBP"; only an extended file (VP8X) animates. */
inline void read_webp(const uint8_t *data, size_t size, Info &info) {
  int frames = 0;
  size_t at = 12;
  while (at + 8 <= size) {
    const uint8_t *chunk = data + at;
    const size_t length = le(chunk + 4, 4);
    if (std::memcmp(chunk, "VP8X", 4) == 0 && at + 18 <= size) {
      info.width = static_cast<int>(le(chunk + 12, 3)) + 1;
      info.height = static_cast<int>(le(chunk + 15, 3)) + 1;
    } else if (std::memcmp(chunk, "ANMF", 4) == 0) {
      ++frames;
    }
    if (length > size - at - 8)
      break;
    at += 8 + length + (length & 1);
  }
  if (frames)
    info.frames = frames;
}

} // namespace detail

inline Info Inspect(const uint8_t *data, size_t size) {
  Info info;
  if (size >= 13 && (std::memcmp(data, "GIF87a", 6) == 0 ||
                     std::memcmp(data, "GIF89a", 6) == 0)) {
    info.format = Format::Gif;
    detail::read_gif(data, size, info);
  } else if (size >= 12 && std::memcmp(data, "RIFF", 4) == 0 &&
             std::memcmp(data + 8, "WEBP", 4) == 0) {
    info.format = Format::WebP;
    detail::read_webp(data, size, info);
  } else if (size >= 8 && std::memcmp(data, "\x89PNG\r\n\x1a\n", 8) == 0) {
    info.format = Format::Png;
  } else if (size >= 3 && std::memcmp(data, "\xFF\xD8\xFF", 3) == 0) {
    info.format = Format::Jpeg;
  }
  return info;
}

inline Problem Check(const Info &info) {
  if (info.format == Format::Unknown ||
      (info.format == Format::Gif && info.frames == 0))
    return Problem::NotPicture;
  if (info.frames < 2)
    return Problem::None;
  if (static_cast<long>(info.width) * info.height > kMaxPixels)
    return Problem::TooLarge;
  return info.frames > kMaxFrames ? Problem::TooManyFrames : Problem::None;
}

/* Whether the system may load the file as it is (`whole`: all of it was
   read, so the frames are all counted). An animated one only within its
   limits: it decodes every frame at once, and past them ShellUI froze and
   crashed. */
inline bool LoadsAsIs(const Info &info, bool whole) {
  return Check(info) == Problem::None && (whole || info.frames < 2);
}

inline bool DecodeFits(const Info &info) {
  return static_cast<long>(info.width) * info.height <= kMaxCanvasPixels &&
         static_cast<uint64_t>(info.width) * info.height * info.frames <=
             kMaxDecodedPixels;
}

} // namespace ZtAvatarImage
