import { cn } from "@/lib/cn";
import { Container } from "./Container";

type Tone = "dark" | "light";

/**
 * A full-width band with vertical rhythm and a surface tone. `tone="dark"`
 * is the cinematic base; `tone="light"` is the warm editorial reading surface.
 * The tone sets semantic vars (--fg, --muted, --hairline, --panel) consumed by
 * .text-muted / .border-hairline / .bg-panel utilities within.
 */
export function Section({
  tone = "dark",
  id,
  className,
  container = true,
  containerSize = "default",
  children,
}: {
  tone?: Tone;
  id?: string;
  className?: string;
  container?: boolean;
  containerSize?: "narrow" | "default" | "wide";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        tone === "light" ? "surface-light" : "surface-dark",
        "relative py-[var(--spacing-section)]",
        className,
      )}
    >
      {container ? <Container size={containerSize}>{children}</Container> : children}
    </section>
  );
}
