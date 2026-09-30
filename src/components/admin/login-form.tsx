"use client";

import { useActionState } from "react";
import { GraduationCap, Lock, LogIn } from "lucide-react";

import { loginAction } from "@/lib/admin/actions";
import { al } from "@/lib/admin/dict";
import type { Locale } from "@/content/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Sign-in form — useActionState drives the pending state and the
 * bilingual error message. Demo credentials are shown because this
 * sandbox ships with a seeded account.
 */
export function LoginForm({ locale, name }: { locale: Locale; name: string }) {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
      <div className="grid place-items-center text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <GraduationCap className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-h2 font-heading">{al("loginTitle", locale)}</h1>
        <p className="mt-1.5 text-caption text-muted-foreground">
          {name
            ? `${al("loginSubtitle", locale)} — ${name}`
            : al("loginSubtitle", locale)}
        </p>
      </div>

      <form action={formAction} className="mt-8 grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="admin-email" dir="ltr">
            {al("loginEmail", locale)}
          </Label>
          <Input
            id="admin-email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            required
            className="rounded-xl"
            placeholder="admin@toothfairysworld.com"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="admin-password" dir="ltr">
            {al("loginPassword", locale)}
          </Label>
          <Input
            id="admin-password"
            name="password"
            type="password"
            dir="ltr"
            autoComplete="current-password"
            required
            className="rounded-xl"
          />
        </div>

        {state?.error && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-caption font-medium text-destructive"
          >
            {state.error === "too_many"
              ? al("loginTooMany", locale)
              : al("loginError", locale)}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="rounded-full px-6"
        >
          {pending ? (
            al("loginWorking", locale)
          ) : (
            <>
              <LogIn className="size-4" aria-hidden="true" />
              {al("loginSubmit", locale)}
            </>
          )}
        </Button>

        <p
          dir="ltr"
          className="flex items-center justify-center gap-1.5 text-caption text-muted-foreground/70"
        >
          <Lock className="size-3" aria-hidden="true" />
          {al("loginDemoHint", locale)}
        </p>
      </form>
    </div>
  );
}
