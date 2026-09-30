import { notFound } from "next/navigation";

/**
 * Catch-all inside the locale segment: any unmatched path renders the
 * locale's designed not-found page (instead of Next's default 404).
 */
export default function CatchAllPage() {
  notFound();
}
