import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

/**
 * Minimal, dependency-free admin auth:
 * - passwords: scrypt (salted, constant-time compare)
 * - sessions : HMAC-SHA256 signed cookie with expiry
 *
 * In production (Vercel + Supabase) this upgrades to Supabase Auth —
 * the API surface (requireAdmin / createSession / destroySession) stays.
 */

const COOKIE_NAME = "gsd_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12h

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "dev-only-secret-change-me";
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  );
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

/** Create the signed session cookie for an admin user. */
export async function createSession(adminId: string): Promise<void> {
  const expiry = Date.now() + SESSION_TTL_MS;
  const payload = `${adminId}.${expiry}`;
  const store = await cookies();
  store.set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export interface AdminSession {
  id: string;
  email: string;
  displayName: string | null;
}

/** Verify the session cookie and return the admin user, or null. */
export async function getAdmin(): Promise<AdminSession | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [adminId, expiryStr, signature] = parts;
  const payload = `${adminId}.${expiryStr}`;
  const expected = sign(payload);

  if (
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return null;

  const admin = await db.adminUser.findUnique({ where: { id: adminId } });
  if (!admin) return null;
  return {
    id: admin.id,
    email: admin.email,
    displayName: admin.displayName,
  };
}

/** Page-level guard — redirects to the login screen when unauthenticated. */
export async function requireAdmin(): Promise<AdminSession> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
