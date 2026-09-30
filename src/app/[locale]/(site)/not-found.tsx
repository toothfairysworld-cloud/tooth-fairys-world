import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="container-site flex flex-col items-center py-24 text-center">
      <span className="grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary">
        <FileQuestion className="size-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-h2">{t("title")}</h1>
      <p className="mt-3 max-w-md text-body text-muted-foreground">
        {t("text")}
      </p>
      <Button asChild className="mt-8 rounded-xl px-6">
        <Link href="/">{t("back")}</Link>
      </Button>
    </div>
  );
}
