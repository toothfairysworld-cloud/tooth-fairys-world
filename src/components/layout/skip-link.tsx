/** Keyboard-first skip link — visible on focus. */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main-content"
      className="sr-only z-[60] rounded-lg bg-primary px-4 py-2.5 text-caption font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
    >
      {label}
    </a>
  );
}
