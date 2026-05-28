import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";

/** Consistent dark hero for interior pages. Clears the fixed header and
 *  carries the single page <h1>, an optional lede, breadcrumbs, and CTAs. */
export function PageHero({
  eyebrow,
  title,
  lede,
  breadcrumbs,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <Section tone="dark" className="grain pt-32 sm:pt-40" containerSize="wide">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-7" />}
      <Reveal>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="font-display mt-4 max-w-[18ch] text-display-2xl">{title}</h1>
        {lede && <p className="measure mt-6 text-lg text-muted">{lede}</p>}
        {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
      </Reveal>
    </Section>
  );
}
