"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckCircle2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { contactSchema, checkRateLimit, recordSubmission } from "./contact-schema";
import type { ContactValues } from "./contact-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Contact form — inline friendly validation (Zod), honeypot spam trap,
 * rate limiting (client + server), real persistence via /api/contact.
 */
export function ContactForm() {
  const t = useTranslations("contact.form");
  const contactT = useTranslations("contact");
  const errT = useTranslations("contact.errors");
  const locale = useLocale();
  const [sentName, setSentName] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

  const onSubmit = async (values: ContactValues) => {
    // Honeypot: pretend success, never send
    if (values.company) {
      setSentName(values.name);
      return;
    }

    if (!checkRateLimit()) {
      setRateLimited(true);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
          company: values.company,
          locale,
        }),
      });

      if (res.status === 429) {
        setRateLimited(true);
        return;
      }
      if (!res.ok) throw new Error("contact failed");

      recordSubmission();
      setSentName(values.name);
      toast.success(t("sentTitle"));
      reset();
    } catch {
      toast.error(errT("generic"));
    }
  };

  if (rateLimited) {
    return (
      <div className="rounded-2xl border border-warning/40 bg-warning/10 p-6">
        <h3 className="text-h3">{errT("rateLimited")}</h3>
        <Button
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() => setRateLimited(false)}
        >
          {t("send")}
        </Button>
      </div>
    );
  }

  if (sentName) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/10 p-8 text-center">
        <CheckCircle2
          className="mx-auto size-10 text-success"
          aria-hidden="true"
        />
        <h3 className="mt-3 text-h3">{t("sentTitle")}</h3>
        <p className="mt-2 text-body text-muted-foreground">
          {t("sentText", { name: sentName })}
        </p>
        <Button
          variant="outline"
          className="mt-5 rounded-xl"
          onClick={() => setSentName(null)}
        >
          {t("another")}
        </Button>
      </div>
    );
  }

  const honeypotStyle: React.CSSProperties = {
    position: "absolute",
    insetInlineStart: "-9999px",
    height: "1px",
    width: "1px",
    opacity: 0,
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8"
    >
      <div className="grid gap-2">
        <Label htmlFor="contact-name">{t("name")}</Label>
        <Input
          id="contact-name"
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className="rounded-xl"
          {...register("name")}
        />
        {errors.name && (
          <p id="contact-name-error" role="alert" className="text-caption text-destructive">
            {errors.name.type === "too_small"
              ? errT("nameShort")
              : errT("nameRequired")}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact-email">{t("email")}</Label>
        <Input
          id="contact-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          placeholder={t("emailPlaceholder")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className="rounded-xl"
          {...register("email")}
        />
        {errors.email && (
          <p id="contact-email-error" role="alert" className="text-caption text-destructive">
            {errors.email.type === "invalid_string"
              ? errT("emailInvalid")
              : errT("emailRequired")}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact-message">{t("message")}</Label>
        <Textarea
          id="contact-message"
          rows={5}
          placeholder={t("messagePlaceholder")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className="resize-none rounded-xl"
          {...register("message")}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="text-caption text-destructive">
            {errors.message.type === "too_small"
              ? errT("messageShort")
              : errT("messageRequired")}
          </p>
        )}
      </div>

      {/* honeypot — visually hidden, ignored by assistive tech */}
      <div aria-hidden="true" style={honeypotStyle}>
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="rounded-xl justify-self-start px-6"
      >
        <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {isSubmitting ? t("sending") : t("send")}
      </Button>

      <p className="text-caption text-muted-foreground/70">
        {contactT("note")}
      </p>
    </form>
  );
}
