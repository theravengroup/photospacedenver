import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionShellProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Background tone for the whole section block. */
  tone?: "paper" | "bone" | "ink";
  /** Add subtle grain texture overlay. */
  grain?: boolean;
  /** Drop vertical padding (when sections need to butt up against each other). */
  flush?: boolean;
  innerClassName?: string;
};

/**
 * Standard section wrapper. Owns vertical rhythm, max-width, and
 * tone — keeps every page section consistent without each one having
 * to re-declare padding/grid.
 */
export function SectionShell({
  children,
  tone = "paper",
  grain = false,
  flush = false,
  className,
  innerClassName,
  ...rest
}: SectionShellProps) {
  const toneClass =
    tone === "ink"
      ? "bg-ink text-paper"
      : tone === "bone"
      ? "bg-bone text-graphite"
      : "bg-paper text-graphite";

  const grainClass =
    grain && tone === "ink" ? "bg-ink-grain" : grain ? "bg-paper-grain" : "";

  return (
    <section
      className={cn(
        "relative w-full",
        toneClass,
        grainClass,
        !flush && "py-[var(--spacing-section-y)]",
        className
      )}
      {...rest}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-12",
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
