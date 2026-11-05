"""Build check for the ZhiThemes module (zt_shellui).

KERNEL_DLSYM(handle, name) writes a function address into a global pointer
called `name`. If no compiled file defines that pointer, the linker binds
the name to the library function of the same name instead, and
KERNEL_DLSYM writes over that function's code: ShellUI dies at start-up
(__sys_regmgr_call was only defined in a file left out).

Usage: python3 check_dlsym.py <llvm-nm> <source files...> -- <object files...>
Fails (exit 1) when a KERNEL_DLSYM name is not a data symbol of the objects.
"""
import re
import subprocess
import sys

args = sys.argv[1:]
nm, args = args[0], args[1:]
sep = args.index('--')
sources, objects = args[:sep], args[sep + 1:]

names = set()
for src in sources:
    text = open(src, encoding='utf-8', errors='replace').read()
    # names that are local variables (e.g. `static long getpid = 0;`)
    local = set(re.findall(r'(?:static\s+)?(?:__attribute__\(\(used\)\)\s+)?(?:long|void\s*\*)\s+(\w+)\s*=\s*(?:0|nullptr)\s*;', text))
    for m in re.finditer(r'KERNEL_DLSYM\(\s*[^,]+,\s*(\w+)\s*\)', text):
        if m.group(1) not in local:
            names.add(m.group(1))

data = set()
out = subprocess.run([nm, '--defined-only'] + objects, capture_output=True, text=True).stdout
for line in out.splitlines():
    parts = line.split()
    if len(parts) >= 3 and parts[1] in 'BbDdSs':
        data.add(parts[2])

missing = sorted(n for n in names if n not in data)
if missing:
    print('check_dlsym: KERNEL_DLSYM pointers not defined in the module: ' + ', '.join(missing))
    print('  (define them, e.g. in external_symbols.cpp, or the name binds to the library function)')
    sys.exit(1)
print('check_dlsym: ok, %d pointers defined' % len(names))
