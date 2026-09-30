#!/usr/bin/env python3
"""Phase 1 asset pipeline — OG image text overlay (PIL + libraqm for
correct Arabic shaping/direction). Run: python3 scripts/og-text.py"""
from PIL import Image, ImageDraw, ImageFont

BASE = "/home/z/my-project/public/images/og-base.png"
OUT = "/home/z/my-project/public/images/og-image.png"
FONTS = "/home/z/.fonts"

REDEX_BOLD = f"{FONTS}/arabic-700-normal.ttf"
REDEX_REG = f"{FONTS}/arabic-400-normal.ttf"
JAKARTA_SEMI = f"{FONTS}/latin-600-normal.ttf"
JAKARTA_REG = f"{FONTS}/latin-400-normal.ttf"

img = Image.open(BASE).convert("RGB")
draw = ImageDraw.Draw(img)

X = 80

# Arabic name (RTL, shaped by raqm)
draw.text(
    (X, 268),
    "عالم جنية الأسنان",
    font=ImageFont.truetype(REDEX_BOLD, 96),
    fill=(242, 232, 234),
    anchor="ls",
    direction="rtl",
    features=["kern", "liga"],
)

# English name + title
draw.text(
    (X, 336),
    "Tooth Fairy's World — Dental Student",
    font=ImageFont.truetype(JAKARTA_SEMI, 42),
    fill=(227, 157, 171),
    anchor="ls",
    direction="ltr",
)

# Arabic tagline
draw.text(
    (X, 408),
    "محفظة أكاديمية لطالبة طب أسنان: خبرة، دراسات حالة، وبحوث",
    font=ImageFont.truetype(REDEX_REG, 33),
    fill=(181, 160, 168),
    anchor="ls",
    direction="rtl",
)

# domain
draw.text(
    (X, 528),
    "toothfairysworld.com",
    font=ImageFont.truetype(JAKARTA_REG, 26),
    fill=(138, 117, 128),
    anchor="ls",
    direction="ltr",
)

img.save(OUT, "PNG")
print("OK og-image.png (text via raqm)")
