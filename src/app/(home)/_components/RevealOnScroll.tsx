import type { HTMLAttributes, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type RevealProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  as?: ElementType;
  /** Stagger nested .reveal children via CSS animation-delay. */
  stagger?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * Wrapper for a group of `.reveal` children.
 *
 * Adds the `.reveal` class to the wrapper itself and a
 * `data-reveal-stagger` attribute when staggering is requested.
 * The actual entrance animation is CSS-only (see globals.css —
 * the `.js .reveal` rule applies `animation: reveal-in`).
 *
 * This used to use IntersectionObserver to drive a per-element
 * `data-reveal="in"` attribute, but the JS path was too brittle
 * across many wrappers (occasional missed mounts left content at
 * opacity 0). A simple CSS animation on mount is far more robust
 * and preserves the calm, staggered entrance feel.
 */
export function RevealOnScroll({
  as: Tag = "div",
  stagger = false,
  className,
  children,
  ...rest
}: RevealProps) {
  return (
    <Tag
      className={cn("reveal", className)}
      data-reveal-stagger={stagger ? "" : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
