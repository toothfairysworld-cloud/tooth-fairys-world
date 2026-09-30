import { join } from "node:path";
import sharp from "sharp";

/**
 * OG image regeneration — composited over the branded base
 * (public/images/og-base.png) with SVG text. pango/raqm shapes the Arabic
 * correctly (VLM-verified). Called from saveProfileAction so the social
 * preview always matches the live profile.
 *
 * Production note: on Vercel the writable layer is /tmp, so swap the
 * output path to a Supabase-storage upload (see MIGRATION_GUIDE).
 */

const CWD = process.cwd();
const BASE = join(CWD, "public", "images", "og-base.png");
const OUT = join(CWD, "public", "images", "og-image.png");

export interface OgProfileText {
  nameAr: string;
  nameEn: string;
  roleEn: string;
  taglineAr: string;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(s: string, max: number): string {
  const clean = s.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

/** Height for a single line of ~1040px at 42px semi-bold Latin text. */
const SUB_MAX = 52;
/** Arabic tagline at 33px — stays clear of the tooth mark on the right. */
const TAGLINE_MAX = 56;

export async function regenerateOgImage(p: OgProfileText): Promise<void> {
  const nameAr = truncate(p.nameAr, 24);
  const nameEn = truncate(`${p.nameEn} — ${p.roleEn}`, SUB_MAX);
  const taglineAr = truncate(p.taglineAr, TAGLINE_MAX);

  // shrink the display name slightly for long Arabic names
  const nameSize = nameAr.length > 16 ? 84 : 96;

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <text x="80" y="268" font-family="Readex Pro" font-weight="700" font-size="${nameSize}"
        fill="#F2E8EA">${esc(nameAr)}</text>
  <text x="80" y="345" font-family="Plus Jakarta Sans" font-weight="600" font-size="38"
        fill="#E39DAB">${esc(nameEn)}</text>
  <text x="80" y="412" font-family="Readex Pro" font-weight="400" font-size="32"
        fill="#B5A0A8">${esc(taglineAr)}</text>
  <text x="80" y="528" font-family="Plus Jakarta Sans" font-weight="400" font-size="26"
        fill="#8A7580">tooth-fairys-world.vercel.app</text>
</svg>`;

  await sharp(BASE)
    .composite([{ input: Buffer.from(svg) }])
    .png({ compressionLevel: 9 })
    .toFile(OUT);
}
