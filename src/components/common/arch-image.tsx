import Image from "next/image";

import { cn } from "@/lib/utils";

interface ArchImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Tailwind aspect class, defaults to portrait 4/5. */
  aspect?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Portrait in the signature dental-arch mask (both top corners fully
 * rounded — mirrors automatically in RTL via logical border radii).
 */
export function ArchImage({
  src,
  alt,
  className,
  aspect = "aspect-[4/5]",
  sizes = "(max-width: 768px) 55vw, 360px",
  priority = false,
}: ArchImageProps) {
  return (
    <div className={cn("arch-mask relative bg-surface-2", aspect, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
