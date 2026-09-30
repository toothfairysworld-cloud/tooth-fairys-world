import { z } from "zod";

/**
 * Shared contact validation — Phase 2 reuses this exact schema on the
 * server route so public form and API can never disagree.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(3).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(20).max(2000),
  /**
   * Honeypot — must stay empty; humans never see it. Accepted by the
   * schema on purpose (filled = bot) and handled silently in onSubmit.
   */
  company: z.string().optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;

/** Client-side rate limit: 3 messages per hour, persisted locally. */
const RATE_KEY = "yousef-portfolio:contact-timestamps";
const LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000;

export function checkRateLimit(): boolean {
  try {
    const raw = localStorage.getItem(RATE_KEY);
    const now = Date.now();
    const stamps: number[] = raw ? JSON.parse(raw) : [];
    const recent = stamps.filter((s) => now - s < WINDOW_MS);
    localStorage.setItem(RATE_KEY, JSON.stringify(recent));
    return recent.length < LIMIT;
  } catch {
    // storage unavailable — allow the attempt (server enforces in Phase 2)
    return true;
  }
}

export function recordSubmission(): void {
  try {
    const raw = localStorage.getItem(RATE_KEY);
    const stamps: number[] = raw ? JSON.parse(raw) : [];
    stamps.push(Date.now());
    localStorage.setItem(RATE_KEY, JSON.stringify(stamps.slice(-LIMIT)));
  } catch {
    /* ignore */
  }
}
