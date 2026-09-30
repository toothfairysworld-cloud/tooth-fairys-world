#!/usr/bin/env python3
"""Objective check: lowest content pixel in each half of the About grid.

Screenshots are 1280x900 (viewport). The About grid band is located by
finding rows with non-background content, then split into left/right
halves (RTL: story=text=left, collage=right) and reporting the lowest
row that contains content (pixel differs from the section bg) in each.
"""
from PIL import Image
import sys

img = Image.open("scripts/screenshots/p4-ar-about-final.png").convert("RGB")
w, h = img.size
px = img.load()

BG = None
# sample the background from a definitely-empty strip (top-left corner)
BG = px[10, 10]


def diff(p, bg, tol=14):
    return abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2]) > tol


def content_rows(x0, x1):
    rows = []
    for y in range(h):
        found = False
        for x in range(x0, x1, 8):
            if diff(px[x, y], BG):
                found = True
                break
        if found:
            rows.append(y)
    return rows


left = content_rows(0, w // 2)
right = content_rows(w // 2, w)

# Focus on the grid band: exclude header (top 30%) and footer/next-section
# (bottom 20%) heuristically — find the band between first content after
# the header whitespace and the pull-quote zone.
print(f"image {w}x{h}")
print(f"left  half: content rows {min(left)}..{max(left)}  span={max(left)-min(left)}")
print(f"right half: content rows {min(right)}..{max(right)}  span={max(right)-min(right)}")

# The grid band specifically: after the section header (~first 25% content
# cluster). Take the last 60% of content rows as the grid+quote band.
def band(rows):
    n = len(rows)
    return rows[int(n * 0.35):]

bl, br = band(left), band(right)
print(f"grid band   : left {min(bl)}..{max(bl)}  right {min(br)}..{max(br)}")
print(f"band bottoms: left={max(bl)}  right={max(br)}  delta={abs(max(bl)-max(br))}px")
