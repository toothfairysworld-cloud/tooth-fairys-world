import { setRequestLocale } from "next-intl/server";

import { PasswordForm } from "@/components/admin/password-form";
import { requireAdmin } from "@/lib/auth";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  await requireAdmin();

  return <PasswordForm locale={locale} />;
}
