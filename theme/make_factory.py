"""Creates a theme.js with every field at the PS5 stock value.

Usage: python make_factory.py <theme.js> <output.js>

Same format the editor uses: each "key: value," field of the
var THEME = { ... } block has the stock value in parentheses at the end of its
comment, e.g. /* side of the normal tiles (106) */. Fields without that value
stay as they are. This is the file ZhiThemes writes when there is no theme.js.
"""
import re
import sys

LINE = re.compile(r"^(\s*)([A-Za-z_]\w*)(\s*:\s*)(-?\d+(?:\.\d+)?|true|false|'[^'\n]*')(\s*,?\s*)(/\*\s*(.*?)\s*\*/)?\s*$")
FACTORY = re.compile(r"\((-?\d+(?:\.\d+)?|true|false|'[^']*')\)\s*$")

src = open(sys.argv[1], encoding='utf-8').read()
start = re.search(r"var\s+THEME\s*=\s*\{", src).end()
end = src.index('};', start)
out, changed = [], 0
for line in src[start:end].split('\n'):
    m = LINE.match(line)
    if m and m.group(7):
        f = FACTORY.search(m.group(7))
        if f and f.group(1) != m.group(4):
            line = m.group(1) + m.group(2) + m.group(3) + f.group(1) + m.group(5) + (m.group(6) or '')
            changed += 1
    out.append(line)
open(sys.argv[2], 'w', encoding='utf-8', newline='\n').write(src[:start] + '\n'.join(out) + src[end:])
print('ok', changed, 'fields reset')
