"""Mimics the console server (port 4444) to test THEME/editor.html on the PC.

Usage: python editor_mock_server.py editor.html theme.js [port] [layout.txt]
  layout.txt: optional "THEME [home] layout ..." lines (e.g. from a probe.log)
  served by /layout before the first Apply.
  ZT_CUSTOMTILE=<folder>: the custom tile pictures (Tiles tab); uploads
  are written there.
  /sgdb/* asks the real SteamGridDB, with the X-Key header or
  ZT_SGDB_KEY.
"""
import http.server
import json
import os
import re
import sys
import urllib.parse
import urllib.request

PAGE = sys.argv[1]
THEME = open(sys.argv[2], encoding='utf-8').read()
PORT = int(sys.argv[3]) if len(sys.argv) > 3 else 4444
EXTRA = open(sys.argv[4], encoding='utf-8').read().splitlines() if len(sys.argv) > 4 else []
GAMES = [('PPSA19115', 'DAVE THE DIVER'), ('PPSA01474', 'Ratchet & Clank'), ('PPSA99360', 'PS5-ECAM'),
         ('PPSA99000', 'Game 3'), ('PPSA99764', 'Dolphin'), ('PPSA09076', 'DREDGE'), ('PPSA18026', 'Planet Zoo'),
         ('PPSA99008', 'Emulator'), ('PPSA01528', 'Overcooked'), ('PPSA99403', 'NFS Most Wanted'),
         ('PPSA99309', 'Wind Waker'), ('PPSA34015', 'EA FC 27'), ('NPXS40071', 'Game Library')] +         [('PPSA%05d' % (50000 + i), 'Extra game %d' % (i + 1)) for i in range(30)]
GAMES_JSON = '[' + ','.join('{"id":"%s","name":"%s","icon":"/user/app/%s/sce_sys/icon0.png","space":"game"}' % (i, n, i)
                            for i, n in GAMES) + ',{"id":"PPSA77001","name":"YouTube","icon":"/user/app/PPSA77001/sce_sys/icon0.png","space":"media"},{"id":"PPSA77002","name":"Netflix","icon":"/user/app/PPSA77002/sce_sys/icon0.png","space":"media"}]'
state = {'theme': THEME, 'log': ['js: hooks RunScript=1 ConsoleLog=1 name_field=1',
                                 'web: theme editor on port %d' % PORT] + EXTRA,
         'bgs': [], 'bgdata': {},
         # files by kind (wallpapers, icons, fonts), debug mode, saved logs
         'files': {'wallpapers': {}, 'icons': {}, 'fonts': {}, 'avatars': {}}, 'debug': False, 'sys': False,
         'saved': {'previous.log': b'2026-10-30 10:00:00.000 +0.000  ==== ZhiThemes (mock) ====\n',
                   'payload.log': b'2026-10-30 10:00:00  payload start\n'}}
CUSTOM = os.environ.get('ZT_CUSTOMTILE', '')
# game backgrounds next to it (<customtile>_bg)
CUSTOMBG = CUSTOM + '_bg' if CUSTOM else ''
if CUSTOMBG and not os.path.isdir(CUSTOMBG):
    os.makedirs(CUSTOMBG)


# several themes (Themes/<name>.ztheme + their wallpapers/icons/fonts);
# state['theme'] / state['files'] are the active one's
PERSONAL = ('folders', 'foldersIcon', 'customTileChoice', 'customBgChoice')
state['active'] = 'My-theme'
state['themes'] = {}
THEME_NAME = re.compile(r'^(?![.-])[A-Za-z0-9._-]{1,40}$')


def _store():
    state['themes'][state['active']] = {'text': state['theme'], 'files': {k: state['files'][k] for k in ('wallpapers', 'icons', 'fonts')}}


def _theme(name):
    if name == state['active']:
        _store()
    return state['themes'].get(name)


VALUE = r"\s*:\s*'((?:\\.|[^'\\\n])*)'"


def _raw(text, key):
    m = re.search(r"(?<![\w])" + key + VALUE, text)
    return m.group(1) if m else None


def _carry(src, dst):
    for k in PERSONAL:
        v = _raw(src, k)
        if v is None:
            continue
        if _raw(dst, k) is not None:
            dst = re.sub(r"(?<![\w])(" + k + r"\s*:\s*)'((?:\\.|[^'\\\n])*)'",
                         lambda m: m.group(1) + "'" + v + "'", dst, count=1)
        else:
            dst = dst.replace('var THEME = {', "var THEME = {\n    " + k + ": '" + v + "',", 1)
    return dst


def themes_json():
    _store()
    items = []
    for n in sorted(state['themes'], key=str.lower):
        f = state['themes'][n]['files']
        lst = [[k, nm, len(b)] for k, d in f.items() for nm, b in d.items()]
        items.append('{"name":"%s","files":%d,"bytes":%d,"modified":0,"list":%s}' % (
            n, sum(len(d) for d in f.values()), sum(len(b) for d in f.values() for b in d.values()),
            json.dumps(lst)))
    return '{"active":"%s","themes":[%s]}' % (state['active'], ','.join(items))


def themes_post(path, q, body=''):
    _store()
    n = q.get('name', '')
    T = state['themes']
    if path == '/themes/use':
        if n not in T:
            return 'no theme ' + n
        if n != state['active']:
            T[n]['text'] = _carry(state['theme'], T[n]['text'])
        state['active'] = n
        state['theme'] = T[n]['text']
        for k in ('wallpapers', 'icons', 'fonts'):
            state['files'][k] = T[n]['files'].setdefault(k, {})
        state['log'].append('storage: theme %s in use' % n)
    elif path == '/themes/new':
        if not THEME_NAME.match(n):
            return 'invalid name (letters, digits, . - _ only)'
        if n in T:
            return 'a theme called %s already exists' % n
        frm = q.get('from', '')
        if frm and frm not in T:
            return 'no theme ' + frm
        src = T[frm] if frm else {'text': THEME, 'files': {}}
        T[n] = {'text': src['text'], 'files': {k: dict(src['files'].get(k, {})) for k in ('wallpapers', 'icons', 'fonts')}}
    elif path == '/themes/rename':
        to = q.get('to', '')
        if n not in T:
            return 'no theme ' + n
        if not THEME_NAME.match(to):
            return 'invalid name'
        if to in T and to != n:
            return 'a theme called %s already exists' % to
        T[to] = T.pop(n)
        if state['active'] == n:
            state['active'] = to
    elif path == '/themes/delete':
        if n not in T:
            return 'no theme ' + n
        if n == state['active']:
            return 'the theme in use cannot be deleted: use another one first'
        del T[n]
    elif path == '/themes/clean':
        t = _theme(n)
        if not t:
            return 'no theme ' + n
        files = state['files'] if n == state['active'] else t['files']
        for line in (body or '').splitlines():
            k, _, f = line.partition('/')
            if k in ('wallpapers', 'icons', 'fonts'):
                files.get(k, {}).pop(f, None)
    elif path == '/themes/clear':
        t = T.setdefault(n, {'text': THEME, 'files': {}})
        for k in ('wallpapers', 'icons', 'fonts'):
            t['files'].setdefault(k, {}).clear()
    else:
        return 'not found'
    return ''


def folder(path):
    return CUSTOMBG if path.startswith('/custombg') else CUSTOM
SAFE = re.compile(r'^[A-Za-z0-9._-]{1,79}$')
API = 'https://www.steamgriddb.com/api/v2/'


def sgdb(url, key=''):
    req = urllib.request.Request(url, headers={'User-Agent': 'ZhiThemes'})
    if key:
        req.add_header('Authorization', 'Bearer ' + key)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read()


def measures():
    """"layout" lines as the console writes them (measured stock Home + fields)."""
    v = {k: float(n) for k, n in re.findall(r'(\w+):\s*(-?\d+(?:\.\d+)?)\s*,', state['theme'])}
    g = lambda k: v.get(k, 0)
    dy = g('rowOffsetY') + g('focusSize') - 168
    boxes = {
        ('home', 'tabs'): (84 + g('tabsX'), g('tabsY'), 611, 126, ['tabsX', 'tabsY']),
        ('home', 'search'): (1232 + g('iconsX') - g('clockGap') + g('searchX'), 35 + g('iconsY') + g('searchY'), 104, 56,
                             ['iconsX', 'iconsY', 'clockGap', 'searchX', 'searchY']),
        ('home', 'clock'): (1736 + g('iconsX'), 38 + g('iconsY') + g('clockY'), 100, 50, ['iconsX', 'iconsY', 'clockY']),
        ('home', 'row'): (0, 126 + g('rowOffsetY'), 1920, g('focusSize'), ['rowOffsetY', 'tileSize', 'focusSize']),
        ('hub', 'title'): (172 + g('titleX'), 1549 + dy + g('titleY'), 772, 76, ['titleX', 'titleY']),
        ('hub', 'buttons'): (172 + g('buttonsX'), 1705 + dy + g('buttonsY'), 422, 73, ['buttonsX', 'buttonsY']),
    }
    out = []
    for (app, name), (x, y, w, h, fields) in boxes.items():
        rec = ','.join('%s=%g' % (k, g(k)) for k in fields)
        out.append('js: THEME [%s] layout %s %d %d %d %d window %s' % (app, name, x, y, w, h, rec))
    # tiles: Store, focused (+ its own offset), the others
    t, f = g('tileSize'), g('focusSize')
    xs, x = [], 50
    for i in range(14):
        focus = i == 1
        y = 126 + g('rowOffsetY') + (g('focusY') if focus else 0)
        xs.append('%d:%d:%d' % (x + (g('focusX') if focus else 0), y, t))
        x += (f + 17) if focus else (t + 16 if i == 0 else t + 8)
    rec = ','.join('%s=%g' % (k, g(k)) for k in ['rowOffsetY', 'tileSize', 'focusSize', 'focusX', 'focusY'])
    out.append('js: THEME [home] layout tiles 50 126 1920 %d window %s xs=%s' % (t, rec, '/'.join(xs)))
    return out


class H(http.server.BaseHTTPRequestHandler):
    def _send(self, code, body, ctype='text/plain; charset=utf-8'):
        data = body.encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _bytes(self, code, data, ctype):
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _sgdb(self, method):
        u = urllib.parse.urlparse(self.path)
        q = {k: v[0] for k, v in urllib.parse.parse_qs(u.query).items()}
        key = self.headers.get('X-Key') or os.environ.get('ZT_SGDB_KEY', '')
        try:
            if method == 'GET' and u.path == '/sgdb/search':
                if not key:
                    return self._send(400, 'no SteamGridDB API key')
                code, data = sgdb(API + 'search/autocomplete/' + urllib.parse.quote(q.get('q', ''), safe=''), key)
                return self._bytes(code, data, 'application/json')
            if method == 'GET' and u.path == '/sgdb/grids':
                if not key:
                    return self._send(400, 'no SteamGridDB API key')
                # anim=1 -> only the animated pictures (webp / apng)
                kind = ('&types=animated&mimes=image/webp,image/png' if q.get('anim') == '1'
                        else '&types=static&mimes=image/png,image/jpeg')
                if q.get('fmt') == '16x9':
                    code, data = sgdb(API + 'heroes/game/%s?nsfw=false&humor=any&limit=12&page=%s%s'
                                      % (q.get('id', ''), q.get('page', '0'), kind), key)
                    return self._bytes(code, data, 'application/json')
                if q.get('fmt') == 'logo':  # game logos
                    code, data = sgdb(API + 'logos/game/%s?nsfw=false&humor=any&limit=12&page=%s%s'
                                      % (q.get('id', ''), q.get('page', '0'),
                                         kind if q.get('anim') == '1' else '&types=static&mimes=image/png'), key)
                    return self._bytes(code, data, 'application/json')
                dims ={'2x3': '600x900', '92x43': '460x215,920x430'}.get(q.get('fmt'), '512x512,1024x1024')
                code, data = sgdb(API + 'grids/game/%s?dimensions=%s&nsfw=false&humor=any&limit=12&page=%s%s'
                                  % (q.get('id', ''), dims, q.get('page', '0'), kind), key)
                return self._bytes(code, data, 'application/json')
            url = q.get('u', '')
            if not re.match(r'^https://cdn\d+\.steamgriddb\.com/', url):
                return self._send(400, 'address not allowed')
            ext = 'jpg' if url.lower().endswith(('.jpg', '.jpeg')) else 'png'
            if method == 'GET' and u.path == '/sgdb/img':
                code, data = sgdb(url)
                low = url.lower()
                mime = next((m for e, m in (('.webp', 'image/webp'), ('.gif', 'image/gif'), ('.webm', 'video/webm'),
                                             ('.mp4', 'video/mp4')) if low.endswith(e)),
                            'image/' + ('jpeg' if ext == 'jpg' else 'png'))
                return self._bytes(code, data, mime)
            if method == 'POST' and u.path == '/sgdb/save':
                tid, fmt = q.get('id', '').upper(), q.get('fmt', '')
                code, data = sgdb(url)
                pre = '%s_%s_' % (tid, fmt)
                where = CUSTOMBG if fmt == '16x9' else CUSTOM
                ns = [int(m.group(1)) for n in os.listdir(where)
                      for m in [re.match(re.escape(pre) + r'(\d+)\.', n, re.I)] if m]
                name = '%s%d.%s' % (pre, max(ns + [0]) + 1, ext)
                if fmt == '16x9':
                    # as the PS5 (zt_hero_background): full height, the 16:9 window at pos
                    import io
                    from PIL import Image
                    im = Image.open(io.BytesIO(data)).convert('RGB')
                    pos = min(1.0, max(0.0, float(q.get('pos', '0.5'))))
                    win = min(im.width, round(im.height * 16 / 9))
                    left = round(pos * (im.width - win))
                    im = im.crop((left, 0, left + win, im.height)).resize((1920, 1080), Image.LANCZOS)
                    name = name.rsplit('.', 1)[0] + '.png'
                    buf = io.BytesIO()
                    im.save(buf, 'PNG')
                    data = buf.getvalue()
                open(os.path.join(where, name), 'wb').write(data)
                state['log'].append('sgdb: %s saved (%d bytes)' % (name, len(data)))
                return self._send(200, name)
        except Exception as e:
            return self._send(502, 'SteamGridDB: %s' % e)
        return self._send(404, 'not found')

    def _bytes(self, data, kind='application/octet-stream', extra=None):
        self.send_response(200)
        self.send_header('Content-Type', kind)
        self.send_header('Content-Length', str(len(data)))
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path == '/sgdb/key':  # like the PS5, only says if there is one
            return self._send(200, '{"set":%s}' % ('true' if state.get('sgkey') else 'false'), 'application/json')
        if self.path.startswith('/sgdb/'):
            return self._sgdb('GET')
        u = urllib.parse.urlparse(self.path)
        q = dict(urllib.parse.parse_qsl(u.query))
        if u.path == '/injectdelay':
            return self._send(200, '{"seconds":%d}' % state.get('inject', 15), 'application/json')
        if u.path == '/themes':
            return self._send(200, themes_json(), 'application/json')
        if u.path == '/themes/text':
            t = _theme(q.get('name', ''))
            return self._send(200, t['text'], 'text/plain') if t and t.get('text') else self._send(404, 'no such theme', 'text/plain')
        if u.path == '/sysinfo':
            return self._send(200, '{"name":"ZhiThemes","version":"0.1.0-alpha","build":292,"author":"Zhi","home":"https://github.com/itsRealZhi/ZhiThemes","kofi":"https://ko-fi.com/zhi",'
                                   '"fw":"9.60","fwHex":"0x09600004","debug":%s,"sys":%s,"started":0}'
                              % ('true' if state['debug'] else 'false', 'true' if state['sys'] else 'false'),
                              'application/json')
        if u.path == '/logs':
            items = [('zhithemes.log', len('\n'.join(state['log'])))] + [(n, len(d)) for n, d in state['saved'].items()]
            return self._send(200, '[' + ','.join('{"name":"%s","size":%d,"time":1793000000}' % i for i in items) + ']',
                              'application/json')
        if u.path == '/logs/file':
            n = q.get('name', '')
            data = '\n'.join(state['log']).encode() if n == 'zhithemes.log' else state['saved'].get(n)
            if data is None:
                return self._send(404, 'no such log')
            return self._bytes(data, 'text/plain; charset=utf-8', {'Content-Disposition': 'attachment; filename="%s"' % n})
        if u.path == '/asset':
            data = state['files'].get(q.get('kind', ''), {}).get(q.get('name', ''))
            if data is None:
                return self._send(404, 'no such file')
            return self._bytes(data)
        if u.path == '/backgrounds' and q.get('kind') in state['files']:
            return self._send(200, '[' + ','.join('"%s"' % n for n in state['files'][q['kind']]) + ']', 'application/json')
        if self.path in ('/', '/index.html'):
            return self._send(200, open(PAGE, encoding='utf-8').read(), 'text/html; charset=utf-8')
        if self.path == '/theme.js':
            return self._send(200, state['theme'])
        if self.path == '/log':
            return self._send(200, '\n'.join(state['log']))
        if self.path == '/layout':
            return self._send(200, '\n'.join(l for l in state['log'] if '] layout ' in l))
        if self.path == '/games':
            return self._send(200, GAMES_JSON, 'application/json')
        if self.path.startswith('/icon?p='):
            # a coloured square with the id, instead of the real icon0.png
            tid = re.sub(r'[^A-Z0-9]', '', self.path.split('/')[4] if self.path.count('/') > 4 else 'X')
            hue = sum(map(ord, tid)) * 37 % 360
            svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">'
                   '<rect width="128" height="128" fill="hsl(%d,55%%,40%%)"/>'
                   '<text x="64" y="70" font-size="18" fill="#fff" text-anchor="middle" '
                   'font-family="sans-serif">%s</text></svg>') % (hue, tid[-5:])
            return self._send(200, svg, 'image/svg+xml')
        if self.path == '/backgrounds':
            return self._send(200, '[' + ','.join('"%s"' % n for n in state['bgs']) + ']', 'application/json')
        if self.path.startswith('/bg/') and self.path[4:] in state['bgdata']:
            data = state['bgdata'][self.path[4:]]
            self.send_response(200)
            self.send_header('Content-Type', 'image/png')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        if self.path == '/fonts':
            return self._send(200, '[' + ','.join('"%s"' % n for n in state['files']['fonts']) + ']', 'application/json')
        if self.path in ('/customtiles', '/custombgs'):
            d = folder(self.path.replace('tiles', 'tile').replace('bgs', 'bg'))
            names = sorted(n for n in os.listdir(d) if os.path.isfile(os.path.join(d, n))) if d and os.path.isdir(d) else []
            return self._send(200, '[' + ','.join('"%s"' % n for n in names if not n.endswith('.part')) + ']',
                              'application/json')
        if self.path.startswith(('/customtile?name=', '/custombg?name=')):
            name = self.path.split('=', 1)[1]
            path = os.path.join(folder(self.path), name)
            if not SAFE.match(name) or not os.path.isfile(path):
                return self._send(404, 'missing')
            data = open(path, 'rb').read()
            self.send_response(200)
            self.send_header('Content-Type', 'image/png' if name.lower().endswith('.png') else 'video/mp4' if name.lower().endswith('.mp4') else 'image/jpeg')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        self._send(404, 'not found')

    def do_POST(self):
        n = int(self.headers.get('Content-Length') or 0)
        raw = self.rfile.read(n)
        if self.path == '/sgdb/key':
            state['sgkey'] = raw.decode('utf-8', 'replace').strip()
            return self._send(200, '{"set":%s}' % ('true' if state['sgkey'] else 'false'), 'application/json')
        if self.path.startswith('/sgdb/'):
            return self._sgdb('POST')
        u = urllib.parse.urlparse(self.path)
        q = dict(urllib.parse.parse_qsl(u.query))
        if u.path in ('/background', '/font') and 'kind' in q or u.path == '/font':
            kind = 'fonts' if u.path == '/font' else q['kind']
            name = q.get('name', '')
            if not SAFE.match(name) or not raw:
                return self._send(400, 'invalid name or file')
            th = q.get('theme', '')
            if th and th != state['active'] and kind in ('wallpapers', 'icons', 'fonts'):
                state['themes'].setdefault(th, {'text': THEME, 'files': {}})['files'].setdefault(kind, {})[name] = raw
            else:
                state['files'].setdefault(kind, {})[name] = raw
            state['log'].append('web: %s %s saved (%d bytes)' % (kind, name, len(raw)))
            return self._send(200, 'saved')
        if u.path.startswith('/themes/'):
            err = themes_post(u.path, q, raw.decode('utf-8', 'replace'))
            if err:
                return self._send(400, err)
            return self._send(200, themes_json(), 'application/json')
        if u.path == '/theme.js' and q.get('name'):
            body = raw.decode('utf-8')
            if q.get('personal') == '1':
                body = _carry(state['theme'], body)
            if q['name'] == state['active']:
                state['theme'] = body
            else:
                state['themes'].setdefault(q['name'], {'files': {}})['text'] = body
            state['log'].append('web: Themes/%s.ztheme saved (%d bytes)' % (q['name'], len(body.encode())))
            return self._send(200, 'saved')
        if u.path == '/injectdelay':
            state['inject'] = max(5, min(120, int(q.get('s', '15') or 15)))
            return self._send(200, '{"seconds":%d}' % state['inject'], 'application/json')
        if u.path == '/debug':
            on, sysm = q.get('on') == '1', q.get('sys') == '1'
            saved = ''
            if not on and state['debug']:
                saved = 'debug-20261030-120000.log'
                state['saved'][saved] = '\n'.join(state['log']).encode()
            state['debug'], state['sys'] = on, on and sysm
            state['log'].append('debug mode: ' + ('on' if on else 'stopped'))
            return self._send(200, '{"debug":%s,"saved":"%s"}' % ('true' if on else 'false', saved), 'application/json')
        if u.path == '/avatar/delete':
            gone = state['files']['avatars'].pop(q.get('name', ''), None) is not None
            return self._send(200 if gone else 404, 'deleted' if gone else 'missing')
        if u.path == '/logs/delete':
            state['saved'].pop(q.get('name', ''), None)
            return self._send(200, 'deleted')
        if self.path.startswith('/background?name='):
            name = self.path.split('=', 1)[1]
            if name not in state['bgs']:
                state['bgs'].append(name)
            state['bgdata'][name] = raw
            state['log'].append('web: background %s saved (%d bytes)' % (name, len(raw)))
            return self._send(200, 'saved')
        if self.path.startswith(('/customtile/delete?name=', '/custombg/delete?name=')):
            name = self.path.split('=', 1)[1]
            path = os.path.join(folder(self.path), name)
            if not SAFE.match(name) or not os.path.isfile(path):
                return self._send(404, 'missing')
            os.remove(path)
            state['log'].append('web: %s deleted' % name)
            return self._send(200, 'deleted')
        if self.path.startswith(('/customtile?name=', '/custombg?name=')):
            name = self.path.split('=', 1)[1]
            if not CUSTOM or not SAFE.match(name) or not raw:
                return self._send(400, 'invalid name or file')
            open(os.path.join(folder(self.path), name), 'wb').write(raw)
            state['log'].append('web: customtile %s saved (%d bytes)' % (name, len(raw)))
            return self._send(200, 'saved')
        body = raw.decode('utf-8')
        if self.path == '/theme.js':
            state['theme'] = body
            state['log'].append('web: theme.js saved (%d bytes)' % len(body.encode()))
            return self._send(200, 'saved')
        if self.path == '/reload':
            state['log'] += ['web: HomeUI reload requested',
                             'js: THEME installed: (mock)', 'js: THEME applied: constants'] + measures()
            return self._send(200, 'reload queued')
        if self.path == '/log/clear':
            state['log'] = []
            return self._send(200, 'cleared')
        self._send(404, 'not found')

    def log_message(self, *a):
        pass


http.server.ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
