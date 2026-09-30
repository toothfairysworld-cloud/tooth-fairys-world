import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/auth";
import { getProfile } from "@/lib/data";
import { pick } from "@/content/types";
import type { Locale } from "@/content/types";
import { routing, type AppLocale } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Standalone sign-in screen — no site chrome, no dashboard shell. */
export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  // already signed in → straight to the dashboard
  const admin = await getAdmin();
  if (admin) redirect("/admin");

  const t = await getTranslations({ locale, namespace: "a11y" });
  const profile = await getProfile();
  const name = profile ? pick(profile.name, locale as AppLocale) : "";

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-10">
      {/* soft rose ambience */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_0%,--alpha(var(--color-primary)/12%),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 end-[-10%] size-[28rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 start-[-8%] size-80 rounded-full bg-accent-warm/10 blur-3xl"
      />

      <main className="relative w-full max-w-md">
        <a
          href="/"
          className="mb-6 flex items-center justify-center gap-2 text-caption font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <span aria-hidden="true">←</span>
          {t("skip")}
        </a>
        <LoginForm locale={locale} name={name} />
      </main>
    </div>
  );
}
