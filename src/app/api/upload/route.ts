import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";

import { getAdmin } from "@/lib/auth";

/**
 * POST /api/upload — admin-only image upload.
 * sharp pipeline: resize to ≤2400px, convert to AVIF (q60) with a WebP
 * fallback name, store under public/uploads. Mirrors the future Supabase
 * storage bucket layout (same returned path shape).
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "not_an_image" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });

    const id = randomUUID().slice(0, 12);
    const output = `${id}.avif`;

    await sharp(buffer)
      .rotate() // respect EXIF
      .resize({
        width: 2400,
        height: 2400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .avif({ quality: 60, effort: 5 })
      .toFile(path.join(UPLOAD_DIR, output));

    return NextResponse.json({ path: `/uploads/${output}` });
  } catch (e) {
    console.error("upload failed", e);
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }
}
