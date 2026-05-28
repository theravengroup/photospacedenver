"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Restrained entrance reveal — fades + lifts content into place once on scroll.
 * Honors prefers-reduced-motion (renders statically). Keep usage tasteful:
 * wrap section blocks, not every element.
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.65, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
