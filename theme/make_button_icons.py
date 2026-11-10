"""Draws the white controller button pictures ZhiThemes tints with a colour.

Usage: python make_button_icons.py <THEME/particles>

The PS5's own button pictures (IconPS, PUI_UI3.rco) are grey: the PS5
multiplies tintColor by them, so a tinted button never reached the colour
of a text of the same colour (~75% of it). These are pure white (the
symbol cut out, transparent), so the tint gives the exact colour. They go
in THEME/particles to be embedded with the particle textures and written to
/data/ZhiThemes/Assets/particles/btn_<name>.png at start.
particles/ui_empty_box.png (empty tab picture) is the user's own icon, not
made here.
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

OUT = sys.argv[1]
S = 512          # drawn big, then scaled down (smooth edges)
SIZE = 128
FONT = None
for f in ('C:/Windows/Fonts/seguisb.ttf', 'C:/Windows/Fonts/segoeuib.ttf', 'C:/Windows/Fonts/arialbd.ttf',
          '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
    if os.path.exists(f):
        FONT = f
        break


def save(name, mask):
    img = Image.new('RGBA', (S, S), (255, 255, 255, 0))
    img.putalpha(mask)
    img = img.resize((SIZE, SIZE), Image.LANCZOS)
    img.save(os.path.join(OUT, 'btn_' + name + '.png'), optimize=True)


def disc():
    m = Image.new('L', (S, S), 0)
    d = ImageDraw.Draw(m)
    r = S * 0.44
    d.ellipse([S / 2 - r, S / 2 - r, S / 2 + r, S / 2 + r], fill=255)
    return m, d


def face(name):
    m, d = disc()
    c, w = S / 2, S * 0.055
    if name == 'cross':
        k = S * 0.17
        d.line([c - k, c - k, c + k, c + k], fill=0, width=int(w))
        d.line([c - k, c + k, c + k, c - k], fill=0, width=int(w))
    elif name == 'circle':
        r = S * 0.17
        d.ellipse([c - r, c - r, c + r, c + r], outline=0, width=int(w))
    elif name == 'square':
        k = S * 0.15
        d.rectangle([c - k, c - k, c + k, c + k], outline=0, width=int(w))
    elif name == 'triangle':
        k = S * 0.19
        pts = [(c, c - k), (c + k * 0.95, c + k * 0.62), (c - k * 0.95, c + k * 0.62)]
        d.line(pts + [pts[0]], fill=0, width=int(w), joint='curve')
    save(name, m)


def pill(name, text):
    m = Image.new('L', (S, S), 0)
    d = ImageDraw.Draw(m)
    w, h = S * 0.9, S * 0.62
    d.rounded_rectangle([(S - w) / 2, (S - h) / 2, (S + w) / 2, (S + h) / 2], radius=S * 0.14, fill=255)
    if text:
        f = ImageFont.truetype(FONT, int(S * 0.4)) if FONT else ImageFont.load_default()
        b = d.textbbox((0, 0), text, font=f)
        d.text(((S - (b[2] - b[0])) / 2 - b[0], (S - (b[3] - b[1])) / 2 - b[1]), text, font=f, fill=0)
    save(name, m)


def options():
    m = Image.new('L', (S, S), 0)
    d = ImageDraw.Draw(m)
    w, h = S * 0.62, S * 0.8
    d.rounded_rectangle([(S - w) / 2, (S - h) / 2, (S + w) / 2, (S + h) / 2], radius=S * 0.12, fill=255)
    lw = S * 0.32
    for k in (-1, 0, 1):
        y = S / 2 + k * S * 0.13
        d.line([S / 2 - lw / 2, y, S / 2 + lw / 2, y], fill=0, width=int(S * 0.05))
    save('options', m)


def bolt():
    """the charging bolt (controller battery, padInfoBattery 'inside')"""
    m = Image.new('L', (S, S), 0)
    d = ImageDraw.Draw(m)
    pts = [(0.56, 0.04), (0.22, 0.57), (0.47, 0.57), (0.38, 0.96), (0.78, 0.41), (0.53, 0.41), (0.70, 0.04)]
    d.polygon([(x * S, y * S) for x, y in pts], fill=255)
    save('bolt', m)


if len(sys.argv) > 2 and sys.argv[2] == 'bolt':
    bolt()
    sys.exit(0)
for n in ('cross', 'circle', 'square', 'triangle'):
    face(n)
for n in ('l1', 'r1', 'l2', 'r2'):
    pill(n, n.upper())
options()
bolt()
print('ok', FONT)
