"use client";

import { useEffect, useRef, type HTMLAttributes, type ElementType } from "react";
import { cn } from "@/lib/cn";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** Stagger children that carry the `.reveal` class. */
  stagger?: boolean;
  /** Threshold for IntersectionObserver (0–1). */
  threshold?: number;
  /** rootMargin offset for IntersectionObserver. */
  rootMargin?: string;
  className?: string;
};

/**
 * Reveal-on-scroll wrapper. Adds the `.reveal` class to itself (and
 * optionally toggles a stagger flag on the wrapper). When the element
 * enters the viewport, sets `data-reveal="in"` which the CSS picks up.
 *
 * Honors prefers-reduced-motion via CSS in globals.css.
 */
export function RevealOnScroll({
  as: Tag = "div",
  stagger = false,
  threshold = 0.12,
  rootMargin = "0px 0px -10% 0px",
  className,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If reduced motion is preferred, just flip the state immediately.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      el.dataset.reveal = "in";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.reveal = "in";
            io.unobserve(e.target);
          }
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", className)}
      data-reveal-stagger={stagger ? "" : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
