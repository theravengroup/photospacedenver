import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { brand } from "@/lib/brand";

/**
 * Closing conversion band. Pass CTA buttons as children. Defaults to a dark
 * cinematic surface with film grain.
 */
export function FinalCTA({
  eyebrow,
  title,
  body,
  children,
  tone = "dark",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <Section tone={tone} className={tone === "dark" ? "grain" : undefined}>
      <Reveal className="mx-auto max-w-3xl text-center">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="font-display mt-3 text-display-lg">{title}</h2>
        {body && <p className="measure mx-auto mt-4 text-lg text-muted">{brand(body)}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>
      </Reveal>
    </Section>
  );
}
