/**
 * Phase 1 asset pipeline — static OG image (1200x630).
 * Bilingual: name in Arabic + English, dental-arch mark, teal/amber.
 * Run: bun scripts/build-og.ts
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
      <stop offset="0%" stop-color="#0B1513"/>
      <stop offset="100%" stop-color="#11201C"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.5" r="0.45">
      <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#14B8A6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="tealStroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14B8A6"/>
      <stop offset="100%" stop-color="#2DD4BF"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- arch mark -->
  <g transform="translate(830,150) scale(2.6)">
    <path d="M 7 31 V 17 a 11 11 0 0 1 22 0 V 31" fill="none"
      stroke="#14B8A6" stroke-width="2.6" stroke-linecap="round"/>
    <path d="${MOLAR}" transform="translate(36,64) scale(1.05) translate(-60,-70)"
      fill="none" stroke="url(#tealStroke)" stroke-width="7"/>
  </g>

  <!-- amber sparkle -->
  <path d="M 0 -7 C 1 -2.5, 2.5 -1, 7 0 C 2.5 1, 1 2.5, 0 7 C -1 2.5, -2.5 1, -7 0 C -2.5 -1, -1 -2.5, 0 -7 Z"
    transform="translate(1075 210) scale(1.3)" fill="#FBBF24"/>

  <!-- texts (Arabic pre-shaped to visual order — librsvg lacks bidi) -->
  <text x="80" y="270" text-anchor="start"
    font-family="Readex Pro" font-size="80"
    font-weight="700" fill="#E9F1ED">عالم جنية الأسنان</text>
  <text x="80" y="340" text-anchor="start"
    font-family="Plus Jakarta Sans" font-size="44" font-weight="600"
    fill="#2DD4BF">Tooth Fairy's World — Dental Student</text>
  <text x="80" y="410" text-anchor="start"
    font-family="Readex Pro" font-size="34"
    fill="#A3B8B0">محفظة أكاديمية لطالبة طب أسنان: خبرة، دراسات حالة، وبحوث</text>

  <!-- baseline -->
  <rect x="80" y="480" width="120" height="5" rx="2.5" fill="#B45309"/>
  <text x="80" y="530" text-anchor="start"
    font-family="Plus Jakarta Sans" font-size="26" fill="#7A958D">
    toothfairysworld.com</text>
</svg>`;

async function main() {
  const out = path.join(ROOT, "public", "images", "og-image.png");
  await sharp(Buffer.from(svg)).png().toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`OK og-image.png ${meta.width}x${meta.height}`);
}

main();
