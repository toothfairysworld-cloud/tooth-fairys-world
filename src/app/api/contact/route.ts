import { NextResponse } from "next/server";

import { contactSchema } from "@/components/contact/contact-schema";
import { db } from "@/lib/db";
import { hit, ipHashOf } from "@/lib/rate-limit";

/**
 * POST /api/contact — public contact form endpoint.
 * Mirrors the Supabase RLS design: anonymous visitors may ONLY insert;
 * nothing in this handler reads messages back.
 */

const WINDOW_MS = 60 * 60 * 1000; // 1h
const LIMIT = 5; // per hashed IP

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_failed" }, { status: 422 });
  }

  // Honeypot tripped → silently pretend success (bots get no signal)
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const key = ipHashOf(request);
  if (hit(key, { limit: LIMIT, windowMs: WINDOW_MS }).blocked) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const locale =
    typeof (body as { locale?: unknown }).locale === "string" &&
    (body as { locale: string }).locale === "en"
      ? "en"
      : "ar";

  try {
    await db.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        locale,
        ipHash: key,
      },
    });
  } catch {
    return NextResponse.json({ error: "storage_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
