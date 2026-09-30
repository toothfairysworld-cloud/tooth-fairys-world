/**
 * Phase 1.5 — female persona asset swap (Rosé Editorial redesign).
 *  1. hero-portrait.webp  ← Unsplash 1559839734 (female clinician, warm smile)
 *  2. about-1.webp        ← Pexels 3845624 (shade matching — anterior restorations)
 *  3. blog-2.webp         ← Pexels 3845810 (female dentist consulting patient)
 * All processed with sharp → WebP q85, progressive-ish (webp has no progressive).
 * Run: bun scripts/build-female-assets.ts
 */
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const OUT = path.join(ROOT, "public", "images");

const PLAN: { out: string; src: string; width: number }[] = [
  {
    out: "hero-portrait.webp",
    src: "scripts/fd/fden-10.jpg",
    width: 2400,
  },
  {
    out: "about-1.webp",
    src: "scripts/fd/pex-06.jpg",
    width: 1400,
  },
  {
    out: "blog-2.webp",
    src: "scripts/fd/pex-03.jpg",
    width: 1200,
  },
];

async function main() {
  for (const { out, src, width } of PLAN) {
    const abs = path.join(ROOT, src);
    const input = await fs.readFile(abs);
    const img = sharp(input, { failOn: "none" });
    const meta = await img.metadata();
    const target = Math.min(width, meta.width ?? width);

    await img
      .resize({ width: target, withoutEnlargement: true })
      .modulate({
        saturation: out === "hero-portrait.webp" ? 0.82 : 1,
      })
      .webp({ quality: 85 })
      .toFile(path.join(OUT, out));

    const outMeta = await sharp(path.join(OUT, out)).metadata();
    console.log(
      `OK ${out} — src ${meta.width}x${meta.height} → ${outMeta.width}x${outMeta.height}`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
