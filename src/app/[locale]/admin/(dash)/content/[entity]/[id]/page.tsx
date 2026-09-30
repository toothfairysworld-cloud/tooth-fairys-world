import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { EntityForm } from "@/components/admin/entity-form";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getEntity, type FieldDef } from "@/lib/admin/registry";
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

/** Extract a field's initial value from a DB row, deserializing JSON. */
function fieldValue(field: FieldDef, row: Record<string, unknown> | null): unknown {
  if (!row) {
    // new-item defaults
    switch (field.kind) {
      case "number":
        return 0;
      case "checkbox":
        return false;
      case "pairs":
        return { ar: [""], en: [""] };
      case "stats":
        return [];
      case "blocks":
        return { ar: [], en: [] };
      case "story":
        return {};
      default:
        return "";
    }
  }

  switch (field.kind) {
    case "pairs":
      return {
        ar: parseJson(row[`${field.key}Ar`], []) as string[],
        en: parseJson(row[`${field.key}En`], []) as string[],
      };
    case "blocks":
      return {
        ar: parseJson(row[`${field.key}Ar`], []) as unknown[],
        en: parseJson(row[`${field.key}En`], []) as unknown[],
      };
    case "stats":
      return parseJson(row[field.key], []);
    case "story":
      return parseJson(row[field.key], {});
    case "checkbox":
      return Boolean(row[field.key]);
    case "number":
      return Number(row[field.key] ?? 0);
    default:
      return String(row[field.key] ?? "");
  }
}

/** Generic entity editor — "new" or existing id, registry-driven. */
export default async function EntityEditPage({
  params,
}: {
  params: Promise<{ locale: string; entity: string; id: string }>;
}) {
  const { locale: rawLocale, entity: entityKey, id } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  await requireAdmin();

  const entity = getEntity(entityKey);
  if (!entity) notFound();

  const isNew = id === "new";
  if (isNew && entity.fixed) notFound();

  let row: Record<string, unknown> | null = null;
  if (!isNew) {
    const model = db[entity.model as keyof typeof db] as unknown as {
      findUnique: (args: Record<string, unknown>) => Promise<
        Record<string, unknown> | null
      >;
    };
    row = await model.findUnique({ where: { id } });
    if (!row) notFound();
  }

  const values: Record<string, unknown> = {};
  for (const field of entity.fields) {
    values[field.key] = fieldValue(field, row);
  }

  return (
    <EntityForm
      locale={locale}
      entityKey={entity.key}
      label={entity.label}
      fields={entity.fields.map(({ key, kind, label, group, options, help, rows, required, half }) => ({
        key,
        kind,
        label,
        group,
        options,
        help,
        rows,
        required,
        half,
      }))}
      id={isNew ? null : id}
      isNew={isNew}
      slugField={entity.slugField ?? null}
      consentGate={entity.consentGate ?? false}
      values={values}
    />
  );
}
