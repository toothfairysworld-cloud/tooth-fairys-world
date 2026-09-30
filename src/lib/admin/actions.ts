"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { hit, ipHashOf, reset } from "@/lib/rate-limit";
import {
  createSession,
  destroySession,
  hashPassword,
  requireAdmin,
  verifyPassword,
} from "@/lib/auth";
import { getEntity, type EntityDef } from "./registry";

/**
 * Admin server actions — every mutation flows through here after an
 * auth guard. Results use a small error-code contract the client maps
 * to bilingual messages.
 */

export type ActionResult = {
  ok: boolean;
  error?:
    | "validation"
    | "slug_taken"
    | "consent"
    | "not_found"
    | "db"
    | "auth"
    | "password_wrong"
    | "password_short"
    | "password_mismatch";
  id?: string;
};

// ---------------------------------------------------------------------------
// model delegate map

const MODELS = {
  timelineEntry: db.timelineEntry,
  caseStudy: db.caseStudy,
  certificate: db.certificate,
  researchItem: db.researchItem,
  volunteeringItem: db.volunteeringItem,
  blogPost: db.blogPost,
  faqItem: db.faqItem,
  resourceItem: db.resourceItem,
  testimonial: db.testimonial,
  sectionConfig: db.sectionConfig,
} as const;

type ModelKey = keyof typeof MODELS;

function revalidateSite() {
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// auth

/**
 * Brute-force guard — 5 failed sign-ins per hashed IP per 15 minutes.
 * Successful sign-in clears the counter so owners never lock themselves out.
 */
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

/** Constant-time decoy so "unknown email" costs the same as a bad password. */
const DECOY_HASH = `00:${"0".repeat(128)}`; // never validates anything

export async function loginAction(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "missing" };

  const key = `login:${ipHashOf(await headers())}`;
  if (hit(key, { limit: LOGIN_LIMIT, windowMs: LOGIN_WINDOW_MS }).blocked) {
    return { error: "too_many" };
  }

  const admin = await db.adminUser.findUnique({ where: { email } });
  const ok = admin
    ? verifyPassword(password, admin.passwordHash)
    : verifyPassword(password, DECOY_HASH); // equalize timing

  if (!admin || !ok) {
    return { error: "invalid" };
  }

  await createSession(admin.id);
  reset(key); // success forgives recent failures
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export async function changePasswordAction(
  current: string,
  next: string,
  confirm: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (next !== confirm) return { ok: false, error: "password_mismatch" };
  if (next.length < 8) return { ok: false, error: "password_short" };

  const row = await db.adminUser.findUnique({ where: { id: admin.id } });
  if (!row || !verifyPassword(current, row.passwordHash)) {
    return { ok: false, error: "password_wrong" };
  }
  await db.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: hashPassword(next) },
  });
  return { ok: true };
}

// ---------------------------------------------------------------------------
// generic entity CRUD

/** Coerce a submitted value into the Prisma column value. */
function coerce(
  entity: EntityDef,
  field: { key: string; kind: string },
  value: unknown,
): Record<string, unknown> {
  switch (field.kind) {
    case "number":
      return { [field.key]: Number.isFinite(Number(value)) ? Number(value) : 0 };
    case "checkbox":
      return { [field.key]: Boolean(value) };
    case "pairs":
      // {ar: string[], en: string[]} → two JSON columns
      return {
        [`${field.key}Ar`]: JSON.stringify(
          (value as { ar?: string[] })?.ar ?? [],
        ),
        [`${field.key}En`]: JSON.stringify(
          (value as { en?: string[] })?.en ?? [],
        ),
      };
    case "blocks":
      return {
        [`${field.key}Ar`]: JSON.stringify(
          (value as { ar?: unknown[] })?.ar ?? [],
        ),
        [`${field.key}En`]: JSON.stringify(
          (value as { en?: unknown[] })?.en ?? [],
        ),
      };
    case "stats":
    case "story":
      // single JSON column
      return { [field.key]: JSON.stringify(value ?? (field.kind === "stats" ? [] : {})) };
    case "categoryAr":
    case "categoryEn":
      return { [field.key]: String(value ?? "") };
    default:
      return { [field.key]: String(value ?? "") };
  }
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function saveEntityAction(
  entityKey: string,
  id: string | null,
  values: Record<string, unknown>,
): Promise<ActionResult> {
  await requireAdmin();
  const entity = getEntity(entityKey);
  if (!entity) return { ok: false, error: "not_found" };
  if (entity.fixed && id === null) return { ok: false, error: "validation" };

  const model = MODELS[entity.model as ModelKey];

  // ---- validate required simple fields
  for (const field of entity.fields) {
    if (field.required) {
      const v = values[field.key];
      const empty =
        v === undefined || v === null || String(v).trim() === "";
      if (field.kind !== "pairs" && field.kind !== "stats" && empty) {
        return { ok: false, error: "validation" };
      }
    }
  }

  // ---- slug validation + uniqueness
  if (entity.slugField) {
    const slug = String(values[entity.slugField] ?? "").trim().toLowerCase();
    if (!SLUG_RE.test(slug)) return { ok: false, error: "validation" };
    const clash = await (model as { findFirst: (a: unknown) => Promise<{ id: string }> }).findFirst({
      where: { [entity.slugField]: slug, ...(id ? { id: { not: id } } : {}) },
    });
    if (clash) return { ok: false, error: "slug_taken" };
    values[entity.slugField] = slug;
  }

  // ---- consent gate
  if (entity.consentGate && values.published && !values.patientConsent) {
    return { ok: false, error: "consent" };
  }

  // ---- build prisma data
  const data: Record<string, unknown> = {};
  for (const field of entity.fields) {
    Object.assign(data, coerce(entity, field, values[field.key]));
  }

  // blog category: two plain bilingual columns (categoryAr/categoryEn already
  // simple text — nothing special needed beyond coerce)

  try {
    let savedId = id ?? "";
    if (id) {
      const updated = await (model as { update: (a: unknown) => Promise<{ id: string }> }).update({
        where: { id },
        data,
      });
      savedId = updated.id;
    } else {
      // new row → append at the end of the sort order
      if (entity.sortOrderField) {
        const count = await (model as { count: (a?: unknown) => Promise<number> }).count();
        data.sortOrder = count;
      }
      const created = await (model as { create: (a: unknown) => Promise<{ id: string }> }).create({ data });
      savedId = created.id;
    }
    revalidateSite();
    return { ok: true, id: savedId };
  } catch (e) {
    console.error("saveEntityAction", e);
    return { ok: false, error: "db" };
  }
}

export async function deleteEntityAction(
  entityKey: string,
  id: string,
): Promise<ActionResult> {
  await requireAdmin();
  const entity = getEntity(entityKey);
  if (!entity || entity.fixed) return { ok: false, error: "validation" };

  try {
    await (MODELS[entity.model as ModelKey] as { delete: (a: unknown) => Promise<unknown> }).delete({
      where: { id },
    });
    revalidateSite();
    return { ok: true };
  } catch {
    return { ok: false, error: "db" };
  }
}

export async function togglePublishedAction(
  entityKey: string,
  id: string,
  next: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  const entity = getEntity(entityKey);
  if (!entity) return { ok: false, error: "not_found" };
  const model = MODELS[entity.model as ModelKey];

  // consent gate applies when publishing a case
  if (entity.consentGate && next) {
    const row = await (model as { findUnique: (a: unknown) => Promise<{ patientConsent?: boolean } | null> }).findUnique({ where: { id } });
    if (!row?.patientConsent) return { ok: false, error: "consent" };
  }

  try {
    await (model as { update: (a: unknown) => Promise<unknown> }).update({
      where: { id },
      data: entity.key === "sections" ? { enabled: next } : { published: next },
    });
    revalidateSite();
    return { ok: true };
  } catch {
    return { ok: false, error: "db" };
  }
}

export async function moveEntityAction(
  entityKey: string,
  id: string,
  dir: "up" | "down",
): Promise<ActionResult> {
  await requireAdmin();
  const entity = getEntity(entityKey);
  if (!entity || !entity.sortOrderField) {
    return { ok: false, error: "validation" };
  }
  const model = MODELS[entity.model as ModelKey];

  try {
    const rows = await (model as {
      findMany: (a?: unknown) => Promise<{ id: string; sortOrder: number }[]>;
    }).findMany({ orderBy: { sortOrder: "asc" } });
    const index = rows.findIndex((r) => r.id === id);
    if (index === -1) return { ok: false, error: "not_found" };
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= rows.length) return { ok: true };

    // swap sort orders
    await (model as { update: (a: unknown) => Promise<unknown> }).update({
      where: { id: rows[index].id },
      data: { sortOrder: rows[target].sortOrder },
    });
    await (model as { update: (a: unknown) => Promise<unknown> }).update({
      where: { id: rows[target].id },
      data: { sortOrder: rows[index].sortOrder },
    });
    revalidateSite();
    return { ok: true };
  } catch {
    return { ok: false, error: "db" };
  }
}

// ---------------------------------------------------------------------------
// profile (singleton)

export async function saveProfileAction(
  values: Record<string, unknown>,
): Promise<ActionResult> {
  await requireAdmin();

  const required = [
    "nameAr",
    "nameEn",
    "roleAr",
    "roleEn",
    "valueStatementAr",
    "valueStatementEn",
  ];
  for (const key of required) {
    if (!String(values[key] ?? "").trim()) {
      return { ok: false, error: "validation" };
    }
  }

  const data: Record<string, unknown> = {
    nameAr: String(values.nameAr ?? ""),
    nameEn: String(values.nameEn ?? ""),
    initials: String(values.initials ?? "TF").slice(0, 3),
    roleAr: String(values.roleAr ?? ""),
    roleEn: String(values.roleEn ?? ""),
    universityAr: String(values.universityAr ?? ""),
    universityEn: String(values.universityEn ?? ""),
    valueStatementAr: String(values.valueStatementAr ?? ""),
    valueStatementEn: String(values.valueStatementEn ?? ""),
    portraitSrc: String(values.portraitSrc ?? "/images/hero-portrait.webp"),
    portraitAltAr: String(values.portraitAltAr ?? ""),
    portraitAltEn: String(values.portraitAltEn ?? ""),
    aboutImage1: String(values.aboutImage1 ?? "/images/about-1.webp"),
    aboutImage2: String(values.aboutImage2 ?? "/images/about-2.webp"),
    aboutImage3: String(values.aboutImage3 ?? "/images/about-3.webp"),
    bioAr: JSON.stringify((values.bio as { ar?: string[] })?.ar ?? []),
    bioEn: JSON.stringify((values.bio as { en?: string[] })?.en ?? []),
    philosophyAr: String(values.philosophyAr ?? ""),
    philosophyEn: String(values.philosophyEn ?? ""),
    interestsAr: JSON.stringify((values.interests as { ar?: string[] })?.ar ?? []),
    interestsEn: JSON.stringify((values.interests as { en?: string[] })?.en ?? []),
    instagram: String(values.instagram ?? ""),
    cvPdf: String(values.cvPdf ?? ""),
    graduationDate: String(values.graduationDate ?? "2027-06-30T18:30:00+03:00"),
    isSample: Boolean(values.isSample),
  };

  try {
    await db.profile.upsert({
      where: { id: "main" },
      update: data as Prisma.ProfileUncheckedUpdateInput,
      create: {
        id: "main",
        ...data,
      } as unknown as Prisma.ProfileUncheckedCreateInput,
    });
    revalidateSite();

    // Keep the social-share preview in sync with the saved profile.
    // Best-effort: an OG failure must never fail the save itself.
    try {
      const { regenerateOgImage } = await import("./og");
      await regenerateOgImage({
        nameAr: String(data.nameAr ?? ""),
        nameEn: String(data.nameEn ?? ""),
        roleEn: String(data.roleEn ?? ""),
        taglineAr: String(data.valueStatementAr ?? ""),
      });
    } catch (e) {
      console.warn("OG regeneration skipped:", e);
    }

    return { ok: true };
  } catch (e) {
    console.error("saveProfileAction", e);
    return { ok: false, error: "db" };
  }
}

// ---------------------------------------------------------------------------
// inbox

export async function messageAction(
  id: string,
  action: "read" | "unread" | "archive" | "unarchive" | "delete",
): Promise<ActionResult> {
  await requireAdmin();
  try {
    switch (action) {
      case "read":
        await db.contactMessage.update({ where: { id }, data: { read: true } });
        break;
      case "unread":
        await db.contactMessage.update({ where: { id }, data: { read: false } });
        break;
      case "archive":
        await db.contactMessage.update({
          where: { id },
          data: { archived: true, read: true },
        });
        break;
      case "unarchive":
        await db.contactMessage.update({ where: { id }, data: { archived: false } });
        break;
      case "delete":
        await db.contactMessage.delete({ where: { id } });
        break;
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "db" };
  }
}
