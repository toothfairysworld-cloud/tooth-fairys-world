import type { SVGProps } from "react";

/**
 * Clean, anatomical tooth SVG emblem (شعار الأسنان).
 * Features refined molar cusps, roots, and optional sparkle accents.
 */
export function ToothIcon({
  className = "size-4",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12 2C9.2 2 7.5 3.2 6.2 4.9C4.2 7.4 3.5 10.7 3.8 13.9C4.1 16.9 5.6 20.6 7.7 22.2C8.7 23 10.1 22.5 10.7 21.2L11.5 17.6C11.7 16.9 12.3 16.9 12.5 17.6L13.3 21.2C13.9 22.5 15.3 23 16.3 22.2C18.4 20.6 19.9 16.9 20.2 13.9C20.5 10.7 19.8 7.4 17.8 4.9C16.5 3.2 14.8 2 12 2ZM8.5 7.5C9.3 7.5 10 8.2 10 9C10 9.8 9.3 10.5 8.5 10.5C7.7 10.5 7 9.8 7 9C7 8.2 7.7 7.5 8.5 7.5Z" />
    </svg>
  );
}

/**
 * Outlined variant of the tooth emblem with delicate precision lines.
 */
export function ToothOutlineIcon({
  className = "size-4",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12 3C9.5 2 7.5 2 5.5 2C2.5 2 1 4.5 1 8C1 13 3.5 17.5 6.5 21.5C7.5 22.8 9 22.5 9.8 19.5L10.5 16C10.8 15 11.3 14.5 12 14.5C12.7 14.5 13.2 15 13.5 16L14.2 19.5C15 22.5 16.5 22.8 17.5 21.5C20.5 17.5 23 13 23 8C23 4.5 21.5 2 18.5 2C16.5 2 14.5 2 12 3Z" />
      <path d="M9 7.5C10 8.5 14 8.5 15 7.5" opacity="0.6" />
    </svg>
  );
}
