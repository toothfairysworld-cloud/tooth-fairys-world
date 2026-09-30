import { createHash } from "node:crypto";

/**
 * Shared in-memory rate limiter (single-process sandbox / single Vercel
 * instance; production upgrade path: Upstash or Postgres counters).
 *
 * API mirrors the contact route's original logic — sliding window per key,
 * unbounded map guarded by cold-key pruning.
 */

const store = new Map<string, number[]>();

export interface RateLimitOptions {
  /** Max events allowed inside the window. */
  limit: number;
  /** Window length in ms. */
  windowMs: number;
}

export interface RateLimitResult {
  /** true when the caller is over the limit and should be rejected. */
  blocked: boolean;
  /** Events recorded inside the window (including this one). */
  count: number;
}

/** Record one event for `key` and report whether it exceeded the limit. */
export function hit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  const recent = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  store.set(key, recent);
  if (store.size > 5000) {
    for (const [k, v] of store) {
      if (v.every((t) => now - t > windowMs)) store.delete(k);
    }
  }
  return { blocked: recent.length > limit, count: recent.length };
}

/** Clear a key's history — used e.g. after a successful login. */
export function reset(key: string): void {
  store.delete(key);
}

/** Stable, non-reversible per-visitor key (hashed IP). */
export function ipHashOf(
  source: Headers | Request,
): string {
  const h = source instanceof Request ? source.headers : source;
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}
