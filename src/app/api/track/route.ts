import { NextResponse } from "next/server";

import { recordPageView } from "@/lib/analytics";
import { hit, ipHashOf } from "@/lib/rate-limit";

/**
 * POST /api/track — aggregate page-view beacon.
 * Accepts { path, locale } only; stores a counter row per day/path/locale.
 * No cookies, no IP storage (the hashed IP lives in memory for 60s of
 * rate limiting only).
 */

const WINDOW_MS = 60 * 1000; // 1 min
const LIMIT = 30; // beacons per visitor per minute (SPA navigations included)

const PATH_RE = /^\/[a-z0-9\-\/]*$/i;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const raw = body as { path?: unknown; locale?: unknown };
  const path = typeof raw.path === "string" ? raw.path : "";

  // Sanitize: site-relative path, no query, no hash, sane length
  const clean = path.split(/[?#]/)[0].slice(0, 200);
  if (!clean.startsWith("/") || !PATH_RE.test(clean)) {
    return NextResponse.json({ error: "invalid_path" }, { status: 422 });
  }
  if (clean === "/admin" || clean.startsWith("/admin/")) {
    // the dashboard itself is never tracked
    return NextResponse.json({ ok: true });
  }

  const locale = raw.locale === "en" ? "en" : "ar";

  if (hit(ipHashOf(request), { limit: LIMIT, windowMs: WINDOW_MS }).blocked) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  await recordPageView(clean, locale);
  return NextResponse.json({ ok: true });
}
