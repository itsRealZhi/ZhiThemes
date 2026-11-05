#pragma once

#include <string>

/* numbers for the debug panel (see zt_stats.cpp) */
void zt_stats_frame();
void zt_stats_set_memory_fns(void *flex_free, void *mono_heap, void *mono_used);
std::string zt_stats_memory_line();
std::string zt_stats_json();
