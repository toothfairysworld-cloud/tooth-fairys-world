"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CircleHelp, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { pick } from "@/content/types";
import type { FaqItem, Locale } from "@/content/types";
import { STAGGER } from "@/lib/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/** "Ask the student" — FAQ accordion + mini question form. */
export function AskSection({
  faq,
  heading,
}: {
  faq: FaqItem[];
  heading: { title: string; subtitle: string };
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const h = heading;

  return (
    <section id="ask" className="section-pad scroll-mt-20 aurora-blush">
      <div className="container-site">
        <Reveal>
          <SectionHeader
            eyebrow={t("contact")}
            title={h.title}
            subtitle={h.subtitle}
            isSample
          />
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <Reveal delay={STAGGER}>
            <Accordion
              type="single"
              collapsible
              className="rounded-2xl border border-border bg-card px-5 shadow-soft"
            >
              {faq.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    i === 0 && "border-t-0",
                  )}
                >
                  <AccordionTrigger
                    className="text-start text-h3 py-5 hover:no-underline hover:text-primary [&[data-state=open]]:text-primary [&>svg]:text-accent-warm"
                  >
                    {pick(item.q, locale)}
                  </AccordionTrigger>
                  <AccordionContent className="text-body text-muted-foreground">
                    {pick(item.a, locale)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          <Reveal delay={STAGGER * 2}>
            <AskForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const questionSchema = z.object({
  question: z.string().trim().min(10),
});
type QuestionValues = z.infer<typeof questionSchema>;

function AskForm() {
  const t = useTranslations("ask");
  const locale = useLocale() as Locale;
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuestionValues>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit = async (_values: QuestionValues) => {
    // Phase 2: POST to Supabase-backed route
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
    reset();
  };

  return (
    <div className="gradient-border flex h-full flex-col rounded-2xl p-6 shadow-soft">
      <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-strong text-primary-foreground shadow-sm">
        <CircleHelp className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-h3">{t("questionTitle")}</h3>

      {sent ? (
        <div className="mt-4 flex-1 rounded-xl bg-success/10 p-4 text-center animate-in zoom-in-95 duration-300">
          <p className="font-bold text-success">{t("sentTitle")}</p>
          <p className="mt-1 text-caption text-muted-foreground">
            {t("sentText")}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 rounded-full"
            onClick={() => setSent(false)}
          >
            {t("submit")}
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-1 flex-col gap-3"
          noValidate
        >
          <Textarea
            {...register("question")}
            rows={4}
            aria-invalid={!!errors.question}
            placeholder={t("questionPlaceholder")}
            className="flex-1 resize-none rounded-xl"
          />
          {errors.question && (
            <p className="text-caption text-destructive" role="alert">
              {locale === "ar" ? "اكتب سؤالاً أوضح قليلاً (10 أحرف على الأقل)." : "Write a slightly clearer question (10+ characters)."}
            </p>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-pill self-start"
          >
            <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            {isSubmitting ? t("sending") : t("submit")}
          </Button>
        </form>
      )}
    </div>
  );
}
