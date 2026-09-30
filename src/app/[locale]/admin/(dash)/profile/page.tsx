import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { EntityForm } from "@/components/admin/entity-form";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { PROFILE_FIELDS } from "@/lib/admin/registry";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function parseJson(raw: unknown, fallback: unknown): unknown {
  if (typeof raw !== "string") return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Profile editor — the singleton "main" row (name, portrait, socials…). */
export default async function AdminProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  await requireAdmin();

  const row = await db.profile.findUnique({ where: { id: "main" } });
  if (!row) notFound();

  const values: Record<string, unknown> = {};
  for (const field of PROFILE_FIELDS) {
    switch (field.kind) {
      case "pairs":
        values[field.key] = {
          ar: parseJson(row[`${field.key}Ar` as keyof typeof row], []) as string[],
          en: parseJson(row[`${field.key}En` as keyof typeof row], []) as string[],
        };
        break;
      case "checkbox":
        values[field.key] = Boolean(row[field.key as keyof typeof row]);
        break;
      default:
        values[field.key] = String(row[field.key as keyof typeof row] ?? "");
    }
  }

  return (
    <EntityForm
      locale={locale}
      entityKey="__profile__"
      label={{ ar: "بياناتي", en: "My profile" }}
      fields={PROFILE_FIELDS}
      id="main"
      isNew={false}
      slugField={null}
      consentGate={false}
      values={values}
    />
  );
}
