"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";

import { changePasswordAction } from "@/lib/admin/actions";
import { al } from "@/lib/admin/dict";
import type { Locale } from "@/content/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Change password — the only account setting in this build. */
export function PasswordForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (next !== confirm) {
      toast.error(al("passwordMismatch", locale));
      return;
    }
    if (next.length < 8) {
      toast.error(al("passwordShort", locale));
      return;
    }
    startTransition(async () => {
      const result = await changePasswordAction(current, next, confirm);
      if (result.ok) {
        toast.success(al("passwordChanged", locale));
        setCurrent("");
        setNext("");
        setConfirm("");
        router.refresh();
      } else {
        toast.error(
          result.error === "password_wrong"
            ? al("passwordWrong", locale)
            : result.error === "password_mismatch"
              ? al("passwordMismatch", locale)
              : al("passwordShort", locale),
        );
      }
    });
  }

  return (
    <div className="mx-auto max-w-lg">
      <header>
        <h1 className="text-h1 font-heading">{al("changePassword", locale)}</h1>
        <p className="mt-2 text-body text-muted-foreground">
          {locale === "ar"
            ? "احتفظي بكلمة مرور قوية لا تستخدمينها في مواقع أخرى."
            : "Use a strong password you don't reuse elsewhere."}
        </p>
      </header>

      <form
        className="mt-8 grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="pw-current">{al("currentPassword", locale)}</Label>
          <Input
            id="pw-current"
            type="password"
            dir="ltr"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="rounded-xl"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pw-new">{al("newPassword", locale)}</Label>
          <Input
            id="pw-new"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            minLength={8}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="rounded-xl"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pw-confirm">{al("confirmPassword", locale)}</Label>
          <Input
            id="pw-confirm"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="rounded-xl"
            required
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="w-fit rounded-full px-7"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <KeyRound className="size-4" aria-hidden="true" />
          )}
          {al("changePassword", locale)}
        </Button>
      </form>
    </div>
  );
}
