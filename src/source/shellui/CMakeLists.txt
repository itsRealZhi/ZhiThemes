cmake_minimum_required (VERSION 3.20)

set(basename "shellui")
project(${basename} C CXX ASM)

onion_module_prologue(C_STANDARD 11 CXX_STANDARD 20)

set(D_CWD "${CMAKE_CURRENT_SOURCE_DIR}")
onion_output_dirs()
set(D_SRC ${D_CWD}/src)

add_executable(${PROJECT_NAME})
set_target_properties(${PROJECT_NAME} PROPERTIES OUTPUT_NAME "${PROJECT_NAME}.elf")

# Finalize main target sources
target_compile_options(${PROJECT_NAME} PUBLIC
	$<$<COMPILE_LANGUAGE:C>:${C_DEFS} ${C_FLAGS}>
	$<$<COMPILE_LANGUAGE:CXX>:${CXX_DEFS} ${CXX_FLAGS}>
	$<$<COMPILE_LANGUAGE:ASM>:${ASM_FLAGS}>
)
target_link_options(${PROJECT_NAME} PRIVATE "-Wl,--gc-sections" "-Wl,--icf=safe")

# A/B: disable HomeUI top-nav Hermes patch without editing sources.
#   cmake -DONIONHEN_SHELLUI_HOMEUI_TOP_NAV_PATCH=OFF ...
option(ONIONHEN_SHELLUI_HOMEUI_TOP_NAV_PATCH
	"Patch HomeUI top-nav Fps slot into OnionHEN entry" ON)
if(NOT ONIONHEN_SHELLUI_HOMEUI_TOP_NAV_PATCH)
	target_compile_definitions(${PROJECT_NAME} PRIVATE SHELLUI_HOMEUI_TOP_NAV_PATCH=0)
	message(STATUS "shellui: HomeUI top-nav patch DISABLED")
endif()

find_package(Python3 REQUIRED COMPONENTS Interpreter)

set(I18N_DIR "${D_CWD}/../i18n")
set(I18N_GENERATED_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(I18N_CATALOG "${I18N_GENERATED_DIR}/toolbox_i18n_catalog.inc")
file(GLOB I18N_LOCALE_JSON CONFIGURE_DEPENDS "${I18N_DIR}/*.json")
add_custom_command(
	OUTPUT "${I18N_CATALOG}"
	COMMAND "${Python3_EXECUTABLE}" "${I18N_DIR}/generate_catalog.py"
		--locales-dir "${I18N_DIR}"
		--catalog toolbox
		--output "${I18N_CATALOG}"
	DEPENDS
		"${I18N_DIR}/generate_catalog.py"
		${I18N_LOCALE_JSON}
	COMMENT "Generating toolbox i18n catalog"
	VERBATIM
)
add_custom_target(shellui_i18n_catalog DEPENDS "${I18N_CATALOG}")

file(GLOB SrcFiles CONFIGURE_DEPENDS ${D_SRC}/*.c ${D_SRC}/*.cpp ${D_SRC}/../include/*.h ${D_SRC}/../include/*.hpp ${D_SRC}/*.s ${ONIONHEN_THIRD_PARTY_DIR}/cjson/*.cpp ${ONIONHEN_THIRD_PARTY_DIR}/cjson/*.hpp)
# ZhiThemes' notify (zt_notify.cpp) only in the slim ZhiThemes module
list(REMOVE_ITEM SrcFiles ${D_SRC}/zt_notify.cpp)

set(CMAKE_C_FLAGS "${ONION_PS5_TARGET_FLAGS} ")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wno-nested-anon-types -Wno-gnu-anonymous-struct -Wno-zero-length-array -Wno-keyword-macro -fPIC -fPIE -march=znver2 -Wall -Werror -fstack-protector-all -ffunction-sections -fdata-sections")
set(CMAKE_CXX_FLAGS "${CMAKE_C_FLAGS} -gfull -gdwarf-2 -pedantic -pedantic-errors")
set(CMAKE_C_FLAGS_RELEASE "-Os -DNDEBUG")
set(CMAKE_CXX_FLAGS_RELEASE "-Os -DNDEBUG")

target_sources(${PROJECT_NAME} PRIVATE ${SrcFiles})
add_dependencies(${PROJECT_NAME} shellui_i18n_catalog onion_version onion_ipc onion_settings onion_detour onion_proc onion_platform onion_ready onion_plugin_ui onion_plugin_bridge)
onion_target_debug_define(${PROJECT_NAME})
target_include_directories(${PROJECT_NAME} PRIVATE
	"${D_CWD}/include"
	"${I18N_GENERATED_DIR}"
	"${ONIONHEN_THIRD_PARTY_DIR}/cjson"
	"${ONIONHEN_THIRD_PARTY_DIR}/sha1"
	"${PROJECT_ROOT}/libonion_ipc/include"
	"${PROJECT_ROOT}/libonion_settings/include"
	"${PROJECT_ROOT}/libonion_detour/include"
	"${PROJECT_ROOT}/libonion_proc/include"
	"${PROJECT_ROOT}/libonion_platform/include"
	"${PROJECT_ROOT}/libonion_fps/include"
	"${PROJECT_ROOT}/libonion_plugin_ui/include"
	"${PROJECT_ROOT}/libonion_plugin_bridge/include"
	"${PROJECT_ROOT}/include"
)
target_link_directories	(${PROJECT_NAME} PUBLIC "${ONIONHEN_PS5_STUB_DIR}")
target_link_libraries	(${PROJECT_NAME} PUBLIC onion_payload onion_detour onion_proc onion_platform onion_ipc onion_settings onion_ready onion_plugin_ui onion_plugin_bridge SceRegMgr SceSystemService SceUserService SceNetCtl)
target_link_libraries	(${PROJECT_NAME} PUBLIC "${PS5_PAYLOAD_SDK}/target/user/homebrew/lib/libz.a")

# Add post-build command
onion_strip_debug(${PROJECT_NAME})

# ZhiThemes: the same module built with only the theme (see prx.cpp
# zhithemes_main); embedded in the standalone ZhiThemes payload.
add_executable(zt_shellui)
set_target_properties(zt_shellui PROPERTIES OUTPUT_NAME "zt_shellui.elf")
target_compile_options(zt_shellui PUBLIC
	$<$<COMPILE_LANGUAGE:C>:${C_DEFS} ${C_FLAGS}>
	$<$<COMPILE_LANGUAGE:CXX>:${CXX_DEFS} ${CXX_FLAGS}>
	$<$<COMPILE_LANGUAGE:ASM>:${ASM_FLAGS}>
)
target_compile_definitions(zt_shellui PRIVATE ZHITHEMES=1)
# ZT_DIAG=ON: the diagnostic module/payload (ZhiThemes-diag.elf, see zt_brand.hpp)
option(ZT_DIAG "ZhiThemes diagnostic build" OFF)
if(ZT_DIAG)
	target_compile_definitions(zt_shellui PRIVATE ZT_DIAG=1)
endif()
target_link_options(zt_shellui PRIVATE "-Wl,--gc-sections" "-Wl,--icf=safe")
# ZhiThemes module with only the theme's files. An older build with
# such a list crashed ShellUI: __sys_regmgr_call was only defined in
# hook_functions.cpp (now in external_symbols.cpp). Off by default (the
# whole module); ZT_SLIM_MODULE=ON for the slim one.
# (renamed from ZT_SLIM: a build tree kept ZT_SLIM=ON in its cache)
option(ZT_SLIM_MODULE "ZhiThemes module with only the theme's files (experimental, crashed when tested)" OFF)
if(ZT_SLIM_MODULE)
	set(ZtSrcFiles
		${D_SRC}/prx.cpp
		${D_SRC}/homeui_js_inject.cpp
		${D_SRC}/theme_web.cpp
		${D_SRC}/zt_log.cpp
		${D_SRC}/zt_mosaic.cpp
		${D_SRC}/zt_native_theme.cpp
		${D_SRC}/zt_sgdb.cpp
		${D_SRC}/zt_stats.cpp
		${D_SRC}/zt_storage.cpp
		${D_SRC}/zt_install.cpp
		${D_SRC}/external_symbols.cpp
		${D_SRC}/mono_runtime.cpp
		${D_SRC}/mono_utils.cpp
		${D_SRC}/zt_notify.cpp
	)
	target_sources(zt_shellui PRIVATE ${ZtSrcFiles})
	target_compile_definitions(zt_shellui PRIVATE ZT_SLIM=1)
else()
	target_sources(zt_shellui PRIVATE ${SrcFiles})
endif()
# every KERNEL_DLSYM pointer must be defined in the module (see
# source/zhithemes/check_dlsym.py); otherwise the build stops here
find_program(ZT_LLVM_NM NAMES llvm-nm HINTS "${PS5_PAYLOAD_SDK}/bin" /usr/lib/llvm-18/bin)
add_custom_command(TARGET zt_shellui PRE_LINK
	COMMAND "${Python3_EXECUTABLE}" "${D_CWD}/../zhithemes/check_dlsym.py" "${ZT_LLVM_NM}"
		"${D_SRC}/prx.cpp" -- "$<TARGET_OBJECTS:zt_shellui>"
	COMMAND_EXPAND_LISTS
	VERBATIM)
add_dependencies(zt_shellui shellui_i18n_catalog onion_version onion_ipc onion_settings onion_detour onion_proc onion_platform onion_ready onion_plugin_ui onion_plugin_bridge)
onion_target_debug_define(zt_shellui)
get_target_property(_shellui_incs ${PROJECT_NAME} INCLUDE_DIRECTORIES)
target_include_directories(zt_shellui PRIVATE ${_shellui_incs})
target_link_directories(zt_shellui PUBLIC "${ONIONHEN_PS5_STUB_DIR}")
target_link_libraries(zt_shellui PUBLIC onion_payload onion_detour onion_proc onion_platform onion_ipc onion_settings onion_ready onion_plugin_ui onion_plugin_bridge SceRegMgr SceSystemService SceUserService SceNetCtl)
# folder mosaics (zt_mosaic.cpp): zlib of the SDK's homebrew libs
target_link_libraries(zt_shellui PUBLIC "${PS5_PAYLOAD_SDK}/target/user/homebrew/lib/libz.a")
# zlib.h for the PNG reader that inflates a piece at a time, only there
set_source_files_properties(src/zt_mosaic.cpp src/zt_install.cpp PROPERTIES
  COMPILE_OPTIONS "-isystem${PS5_PAYLOAD_SDK}/target/user/homebrew/include")
# SteamGridDB for the editor's Tiles tab (zt_sgdb.cpp): the homebrew
# libcurl + OpenSSL and its CA bundle (built in with .incbin), as util's
# cheat catalog uses them; only the ZhiThemes module has the real code
set(ZT_CURL_ROOT "${PS5_PAYLOAD_SDK}/target/user/homebrew")
set(ZT_SGDB_CA_BUNDLE "${ZT_CURL_ROOT}/etc/ca-bundle.crt")
set_source_files_properties(src/zt_sgdb.cpp PROPERTIES
  COMPILE_OPTIONS "-isystem${ZT_CURL_ROOT}/include"
  OBJECT_DEPENDS "${ZT_SGDB_CA_BUNDLE}")
target_compile_definitions(zt_shellui PRIVATE CURL_STATICLIB ZT_SGDB_CA_BUNDLE="${ZT_SGDB_CA_BUNDLE}")
target_link_libraries(zt_shellui PUBLIC
  "${ZT_CURL_ROOT}/lib/libcurl.a" "${ZT_CURL_ROOT}/lib/libpsl.a" "${ZT_CURL_ROOT}/lib/libssl.a"
  "${ZT_CURL_ROOT}/lib/libcrypto.a" "${ZT_CURL_ROOT}/lib/libzstd.a" "${ZT_CURL_ROOT}/lib/libiconv.a"
  "${ZT_CURL_ROOT}/lib/libz.a")
onion_strip_debug(zt_shellui)
