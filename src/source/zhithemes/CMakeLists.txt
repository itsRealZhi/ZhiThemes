cmake_minimum_required (VERSION 3.20)

# ZhiThemes: standalone theme payload (injects zt_shellui.elf into ShellUI).
set(basename "zhithemes")
project(${basename} C CXX ASM)

onion_module_prologue(C_STANDARD 11 CXX_STANDARD 20)

set(D_CWD "${CMAKE_CURRENT_SOURCE_DIR}")
onion_output_dirs()
set(D_SRC ${D_CWD}/source)

add_executable(${PROJECT_NAME})
if(ZT_DIAG)
	set_target_properties(${PROJECT_NAME} PROPERTIES OUTPUT_NAME "ZhiThemes-diag.elf")
	target_compile_definitions(${PROJECT_NAME} PRIVATE ZT_DIAG=1)
else()
	set_target_properties(${PROJECT_NAME} PROPERTIES OUTPUT_NAME "ZhiThemes.elf")
endif()

target_compile_options(${PROJECT_NAME} PUBLIC
	$<$<COMPILE_LANGUAGE:C>:${C_DEFS} ${C_FLAGS}>
	$<$<COMPILE_LANGUAGE:CXX>:${CXX_DEFS} ${CXX_FLAGS}>
	$<$<COMPILE_LANGUAGE:ASM>:${ASM_FLAGS}>
)
target_link_options(${PROJECT_NAME} PRIVATE "-Wl,--gc-sections" "-Wl,--icf=safe")

set(CMAKE_C_FLAGS "${ONION_PS5_TARGET_FLAGS} ")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wno-keyword-macro -fPIC -fPIE -march=znver2 -Wall -Werror -fstack-protector-all -ffunction-sections -fdata-sections")
set(CMAKE_CXX_FLAGS "${CMAKE_C_FLAGS} -gfull -gdwarf-2")
set(CMAKE_C_FLAGS_RELEASE "-Os -DNDEBUG")
set(CMAKE_CXX_FLAGS_RELEASE "-Os -DNDEBUG")

target_sources(${PROJECT_NAME} PRIVATE ${D_SRC}/main.cpp ${D_SRC}/embedded_module.c)
set_source_files_properties(${D_SRC}/embedded_module.c PROPERTIES
	OBJECT_DEPENDS "${ONIONHEN_OUT_BIN}/zt_shellui.elf")
target_compile_definitions(${PROJECT_NAME} PRIVATE
	ZHITHEMES_SHELLUI_ELF="${ONIONHEN_OUT_BIN}/zt_shellui.elf")
onion_target_debug_define(${PROJECT_NAME})
target_include_directories(${PROJECT_NAME} PRIVATE
	"${PROJECT_ROOT}/libonion_proc/include"
	"${PROJECT_ROOT}/libonion_conflict/include"
	"${PROJECT_ROOT}/libonion_platform/include"
	"${PROJECT_ROOT}/include"
)
target_link_directories(${PROJECT_NAME} PUBLIC "${ONIONHEN_PS5_STUB_DIR}")
add_dependencies(${PROJECT_NAME} zt_shellui NineS onion_proc onion_platform onion_elfldr onion_conflict)
target_link_libraries(${PROJECT_NAME} PUBLIC NineS onion_elfldr onion_conflict onion_proc onion_platform SceSystemService SceNotification kernel_sys)

onion_strip_debug(${PROJECT_NAME})
