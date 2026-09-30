/**
 * Phase 1 asset pipeline:
 *  1. download final image assignments (free-license sources)
 *  2. optimize to WebP in /public/images
 *  3. derive case "before" variants (desaturated/darker filter)
 *  Run: bun scripts/build-assets.ts
 */
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const OUT = path.join(ROOT, "public", "images");

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=85&fm=jpg`;

const STOCKSNAP = (id: string) => `https://cdn.stocksnap.io/img-thumbs/960w/${id}.jpg`;

interface PlanEntry {
  out: string;
  url?: string;
  /** Read the full URL from a saved Openverse JSON result. */
  json?: string;
  idx?: number;
  width?: number;
}

const PLAN: PlanEntry[] = [
  { out: "hero-portrait", url: UNSPLASH("1507003211169-0a1dd7228f2d"), width: 1000 },
  { out: "about-1", url: UNSPLASH("1523240795612-9a054b0db644"), width: 1400 },
  { out: "about-2", url: UNSPLASH("1629909613654-28e377c37b09"), width: 1400 },
  { out: "about-3", url: "https://pd.w.org/2026/04/67469efbf72491a05.40591059-2048x1536.jpg", width: 1400 },
  { out: "case-1-after", url: UNSPLASH("1500648767791-00dcc994a43e"), width: 1200 },
  { out: "case-2-after", url: UNSPLASH("1544005313-94ddf0286df2"), width: 1200 },
  { out: "case-3-after", url: UNSPLASH("1571772996211-2f02c9727629"), width: 1200 },
  { out: "case-4-after", url: UNSPLASH("1438761681033-6461ffad8d80"), width: 1200 },
  { out: "case-5-after", json: "ov2-dental-clinic.json", idx: 0, width: 1200 },
  { out: "case-6-after", url: UNSPLASH("1494790108377-be9c29b29330"), width: 1200 },
  { out: "vol-1", url: UNSPLASH("1577896851231-70ef18881754"), width: 1200 },
  { out: "vol-2", url: UNSPLASH("1579684385127-1ef15d508118"), width: 1200 },
  { out: "vol-3", url: UNSPLASH("1522202176988-66273c2fd55f"), width: 1200 },
  { out: "blog-1", json: "ov4-toothbrush-toothpaste.json", idx: 0, width: 1200 },
  { out: "blog-2", url: UNSPLASH("1606811841689-23dfddce3e95"), width: 1200 },
  { out: "blog-3", json: "ov4-glass-of-water.json", idx: 0, width: 1200 },
  { out: "blog-4", json: "ov2-dental-floss.json", idx: 0, width: 1200 },
];

const CASES = [1, 2, 3, 4, 5, 6] as const;

async function resolveUrl(entry: PlanEntry): Promise<string> {
  if (entry.url) return entry.url;
  const jsonPath = path.join(import.meta.dir, entry.json!);
  const data = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  return data.results[entry.idx ?? 0].url as string;
}

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      Accept: "image/*,*/*;q=0.8",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url.slice(0, 80)}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4000 || buf.subarray(0, 4).toString("hex") === "3c2144") {
    // "3c2144" = "<!DO" — HTML error page
    throw new Error(`Not an image (${buf.length}b) for ${url.slice(0, 80)}`);
  }
  return buf;
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const failures: string[] = [];

  for (const entry of PLAN) {
    const target = path.join(OUT, `${entry.out}.webp`);
    try {
      const url = await resolveUrl(entry);
      const raw = await download(url);
      await sharp(raw)
        .rotate() // respect EXIF
        .resize({ width: entry.width ?? 1600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(target);
      const meta = await sharp(target).metadata();
      console.log(`✓ ${entry.out}.webp ${meta.width}x${meta.height}`);
    } catch (err) {
      failures.push(entry.out);
      console.error(`✗ ${entry.out}: ${(err as Error).message}`);
    }
  }

  // Derive "before" variants (desaturated + slightly darker/warmer)
  for (const n of CASES) {
    const after = path.join(OUT, `case-${n}-after.webp`);
    const before = path.join(OUT, `case-${n}-before.webp`);
    try {
      await sharp(after)
        .modulate({ saturation: 0.45, brightness: 0.9, hue: -8 })
        .webp({ quality: 80 })
        .toFile(before);
      console.log(`✓ case-${n}-before.webp (derived)`);
    } catch (err) {
      failures.push(`case-${n}-before`);
      console.error(`✗ case-${n}-before: ${(err as Error).message}`);
    }
  }

  if (failures.length) {
    console.error(`\nFAILED: ${failures.join(", ")}`);
    process.exit(1);
  }
  console.log("\nAll images built.");
}

main();
