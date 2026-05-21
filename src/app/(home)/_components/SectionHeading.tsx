import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  level?: 2 | 3;
  className?: string;
};

/**
 * Consistent section heading with optional eyebrow + supporting lead.
 * The lead block uses the wider stone/fog color so the title carries
 * the visual weight.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "dark",
  level = 2,
  className,
}: SectionHeadingProps) {
  const Tag: "h2" | "h3" = level === 2 ? "h2" : "h3";

  return (
    <div
      className={cn(
        "max-w-[44rem]",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "eyebrow mb-6",
            tone === "light" && "eyebrow-light"
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          "text-display-2xl font-semibold",
          tone === "light" ? "text-paper" : "text-ink"
        )}
        style={{
          fontSize: "var(--text-display-2xl)",
          lineHeight: "var(--text-display-2xl--line-height)",
          letterSpacing: "var(--text-display-2xl--letter-spacing)",
        }}
      >
        {title}
      </Tag>
      {lead && (
        <p
          className={cn(
            "mt-6 text-lg leading-relaxed",
            tone === "light" ? "text-fog" : "text-stone"
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
