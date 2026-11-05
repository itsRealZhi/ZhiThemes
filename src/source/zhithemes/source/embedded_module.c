/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/* ZhiThemes: the theme module injected into SceShellUI. */
#ifndef ZHITHEMES_SHELLUI_ELF
#define ZHITHEMES_SHELLUI_ELF "../bin/zt_shellui.elf"
#endif

__asm__(
    ".global zt_shellui_elf_start\n"
    ".type   zt_shellui_elf_start, @object\n"
    ".align  16\n"
    "zt_shellui_elf_start:\n"
    ".incbin \"" ZHITHEMES_SHELLUI_ELF "\"\n"
    "zt_shellui_elf_end:\n"
    ".global zt_shellui_elf_size\n"
    ".type   zt_shellui_elf_size, @object\n"
    ".align  4\n"
    "zt_shellui_elf_size:\n"
    ".int    zt_shellui_elf_end - zt_shellui_elf_start\n");
