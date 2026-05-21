import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  /** Show the same content statically on mobile for readability. */
  staticOnMobile?: boolean;
};

/**
 * Slow, paused-on-hover horizontal marquee. Pure CSS — no motion lib.
 * Children are rendered twice (the second copy is aria-hidden) so the
 * CSS `translateX(-50%)` loop reads as continuous.
 *
 * On mobile, we optionally render a single static row to avoid
 * burning battery on a slow autoscroll.
 */
export function Marquee({
  children,
  className,
  staticOnMobile = true,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "marquee overflow-hidden",
        staticOnMobile ? "hidden md:block" : "block",
        className
      )}
      aria-roledescription="marquee"
    >
      <div className="marquee-track flex">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
