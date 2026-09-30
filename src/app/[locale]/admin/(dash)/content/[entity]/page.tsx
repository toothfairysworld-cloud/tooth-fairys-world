import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { EntityList } from "@/components/admin/entity-list";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getEntity, SECTION_ROW_LABELS } from "@/lib/admin/registry";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";
import { bi } from "@/lib/admin/dict";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Generic entity list — registry-driven, one page for all content types. */
export default async function EntityListPage({
  params,
}: {
  params: Promise<{ locale: string; entity: string }>;
}) {
  const { locale: rawLocale, entity: entityKey } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  await requireAdmin();

  const entity = getEntity(entityKey);
  if (!entity) notFound();

  const model = db[entity.model as keyof typeof db] as unknown as {
    findMany: (args?: Record<string, unknown>) => Promise<
      Record<string, unknown>[]
    >;
  };
  const rows = await model.findMany({ orderBy: { sortOrder: "asc" } });

  const isSections = entity.key === "sections";
  const visibleFlag = isSections ? "enabled" : "published";

  const items = rows.map((row) => {
    const titleField = entity.titleField;
    let title = "";
    if (titleField) {
      const ar = String(row[`${titleField}Ar`] ?? "");
      const en = String(row[`${titleField}En`] ?? "");
      title = (locale === "ar" ? ar || en : en || ar).trim();
    } else if (entity.titleSharedField) {
      title = String(row[entity.titleSharedField] ?? "");
    }
    if (!title && isSections) {
      title = bi(
        SECTION_ROW_LABELS[String(row.id)] ?? { ar: String(row.id), en: String(row.id) },
        locale,
      );
    }

    const meta: string[] = [];
    if (entity.slugField) meta.push(String(row[entity.slugField] ?? ""));
    if (!isSections && entity.titleField === "title") {
      const ar = String(row[`${entity.titleField}Ar`] ?? "");
      const en = String(row[`${entity.titleField}En`] ?? "");
      const other = locale === "ar" ? en : ar;
      if (other) meta.push(other);
    }

    return {
      id: String(row.id),
      title: title || "—",
      meta,
      visible: Boolean(row[visibleFlag]),
    };
  });

  return (
    <EntityList
      locale={locale}
      entityKey={entity.key}
      label={entity.label}
      fixed={entity.fixed ?? false}
      consentGate={entity.consentGate ?? false}
      items={items}
    />
  );
}
