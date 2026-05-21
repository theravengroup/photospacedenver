import { cn } from "@/lib/cn";

type WordmarkProps = {
  className?: string;
  /** Render as a single block of stacked type, or inline. */
  variant?: "inline" | "stack";
  tone?: "dark" | "light";
};

/**
 * Typographic wordmark for PhotoSpace.
 * No SVG dependency — disciplined type does the work. The lowercase
 * "photospace" matches the existing brand presentation on the live
 * site (the original logo is also set lowercase).
 */
export function Wordmark({
  className,
  variant = "inline",
  tone = "dark",
}: WordmarkProps) {
  const toneClass = tone === "dark" ? "text-ink" : "text-paper";

  if (variant === "stack") {
    return (
      <span
        className={cn(
          "inline-flex flex-col leading-none",
          toneClass,
          className
        )}
      >
        <span className="text-[1.5rem] font-medium tracking-[-0.03em]">
          photospace
        </span>
        <span className="text-[0.625rem] uppercase tracking-[0.32em] mt-1 text-stone">
          Denver · since 2008
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-2 leading-none",
        toneClass,
        className
      )}
    >
      <span className="text-[1.375rem] font-medium tracking-[-0.03em]">
        photospace
      </span>
      <span className="hidden sm:inline text-[0.625rem] uppercase tracking-[0.28em] text-stone">
        Denver
      </span>
    </span>
  );
}
