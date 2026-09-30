/**
 * Phase 1.5 — OG base (1200x630), Rosé Editorial palette.
 * Base graphics only; text overlaid by og-text.py (PIL raqm).
 * Run: bun scripts/build-og-base.ts
 */
import sharp from "sharp";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");

const MOLAR =
  "M 60 8 C 38 8, 24 20, 24 38 C 24 50, 29 58, 29 70 C 29 84, 20 98, 20 112 C 20 128, 28 136, 36 136 C 44 136, 47 126, 50 116 C 52 109, 55 105, 60 105 C 65 105, 68 109, 70 116 C 73 126, 76 136, 84 136 C 92 136, 100 128, 100 112 C 100 98, 91 84, 91 70 C 91 58, 96 50, 96 38 C 96 20, 82 8, 60 8 Z";

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#191114"/>
      <stop offset="100%" stop-color="#2A1D22"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.5" r="0.45">
      <stop offset="0%" stop-color="#E39DAB" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#E39DAB" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="roseStroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E39DAB"/>
      <stop offset="100%" stop-color="#F2BCC5"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- arch mark -->
  <g transform="translate(830,150) scale(2.6)">
    <path d="M 7 31 V 17 a 11 11 0 0 1 22 0 V 31" fill="none"
      stroke="#E39DAB" stroke-width="2.6" stroke-linecap="round"/>
    <path d="${MOLAR}" transform="translate(36,64) scale(1.05) translate(-60,-70)"
      fill="none" stroke="url(#roseStroke)" stroke-width="7"/>
  </g>

  <!-- champagne sparkle -->
  <path d="M 0 -7 C 1 -2.5, 2.5 -1, 7 0 C 2.5 1, 1 2.5, 0 7 C -1 2.5, -2.5 1, -7 0 C -2.5 -1, -1 -2.5, 0 -7 Z"
    transform="translate(1075 210) scale(1.3)" fill="#E7C08A"/>

  <!-- baseline -->
  <rect x="80" y="480" width="120" height="5" rx="2.5" fill="#9E6B25"/>
</svg>`;

async function main() {
  const out = path.join(ROOT, "public", "images", "og-base.png");
  await sharp(Buffer.from(svg)).png().toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`OK og-base.png ${meta.width}x${meta.height}`);
}

main();
