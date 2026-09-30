/**
 * OG image regeneration — sharp + SVG text overlay (pango/raqm shapes the
 * Arabic correctly; fonts registered with fontconfig in ~/.fonts).
 * Mirrors the layout of scripts/og-text.py (PIL baseline).
 * Run: bun scripts/og-sharp-test.ts
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const BASE = "public/images/og-base.png";
const OUT = "scripts/og-sharp-test.png";

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Arabic name, RTL-shaped by pango bidi within an LTR line box -->
  <text x="80" y="268" font-family="Readex Pro" font-weight="700" font-size="80"
        fill="#F2E8EA">عالم جنية الأسنان</text>
  <!-- English name + role -->
  <text x="80" y="345" font-family="Plus Jakarta Sans" font-weight="600" font-size="42"
        fill="#E39DAB">Tooth Fairy's World — Dental Student</text>
  <!-- Arabic tagline -->
  <text x="80" y="412" font-family="Readex Pro" font-weight="400" font-size="33"
        fill="#B5A0A8">محفظة أكاديمية لطالبة طب أسنان: خبرة، دراسات حالة، وبحوث</text>
  <!-- domain -->
  <text x="80" y="528" font-family="Plus Jakarta Sans" font-weight="400" font-size="26"
        fill="#8A7580">toothfairysworld.com</text>
</svg>`;

mkdirSync("scripts", { recursive: true });

const out = await sharp(BASE)
  .composite([{ input: Buffer.from(svg) }])
  .png()
  .toFile(OUT);

console.log("OK", OUT, out.width, "x", out.height);
