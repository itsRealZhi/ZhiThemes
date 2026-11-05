#!/usr/bin/env bash
# Builds ZhiThemes.elf -> release/ZhiThemes.elf
#
# Needs (see docs/BUILDING.md): the PS5 payload SDK (PS5_PAYLOAD_SDK,
# default /opt/ps5-payload-sdk), LLVM/clang 18, cmake, ninja, python3.
#
#   ./scripts/build_zhithemes.sh            configure once, then build
#   ./scripts/build_zhithemes.sh --clean    start from an empty build folder
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="${ROOT}/src"
THEME="${ROOT}/theme"
export PS5_PAYLOAD_SDK="${PS5_PAYLOAD_SDK:-/opt/ps5-payload-sdk}"
export PATH="${PS5_PAYLOAD_SDK}/bin:/usr/lib/llvm-18/bin:${PATH}"
export LLVM_CONFIG="${LLVM_CONFIG:-/usr/lib/llvm-18/bin/llvm-config}"

[[ "${1:-}" == "--clean" ]] && rm -rf "${SRC}/build"

# 1) the stock theme (every field at its PS5 value), the editor page and the
#    particle textures,
#    built into the module as C++ byte arrays
python3 "${THEME}/make_factory.py" "${THEME}/theme.js" "${THEME}/theme_factory.js"
python3 "${THEME}/gen_theme_header.py" "${THEME}/theme_factory.js" \
  "${SRC}/source/shellui/include/theme_default_js.hpp" kThemeDefaultJs
python3 "${THEME}/gen_theme_header.py" "${THEME}/editor.html" \
  "${SRC}/source/shellui/include/theme_web_page.hpp" kThemeWebPage
# the textures of the built-in particle styles (theme/particles, from AniketosHEN)
python3 "${THEME}/gen_particles_header.py" "${THEME}/particles"   "${SRC}/source/shellui/include/zt_particle_textures.hpp"

# 2) configure once (OnionHEN's pipeline), 3) build only the ZhiThemes payload
cd "${SRC}"
if [[ ! -f build/build.ninja ]]; then
  ./scripts/build.sh --release --configure-only
fi
cmake --build build --target zhithemes

mkdir -p "${ROOT}/release"
cp build/bin/ZhiThemes.elf "${ROOT}/release/ZhiThemes.elf"
ls -la "${ROOT}/release/ZhiThemes.elf"
