import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { brand } from "@/lib/brand";

/**
 * Premium interior-page hero, shared site-wide. Clears the fixed header and
 * carries the single page <h1>, an optional lede, breadcrumbs, and CTAs over a
 * layered atmospheric backdrop. Entrance is staggered (eyebrow → title → lede →
 * CTAs) and reduced-motion-aware via <Reveal>.
 */
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
    <Section tone="dark" className="grain relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28" containerSize="wide">
      {/* Atmospheric backdrop — layered tungsten glow + a grounding vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-48 h-[620px] w-[620px] rounded-full bg-tungsten/[0.13] blur-[170px]" />
        <div className="absolute -right-32 top-1/3 h-[460px] w-[460px] rounded-full bg-tungsten/[0.05] blur-[150px]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="relative">
        {breadcrumbs && (
          <Reveal>
            <Breadcrumbs items={breadcrumbs} className="mb-8" />
          </Reveal>
        )}
        {eyebrow && (
          <Reveal delay={0.05}>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-tungsten">
              <span aria-hidden className="h-px w-8 bg-tungsten/60" />
              {eyebrow}
            </p>
          </Reveal>
        )}
        <Reveal delay={0.1}>
          <h1 className="font-display mt-6 max-w-[15ch] leading-[1.02] tracking-tight text-display-2xl">{title}</h1>
        </Reveal>
        {lede && (
          <Reveal delay={0.16}>
            <p className="measure mt-6 text-lg leading-relaxed text-muted sm:text-xl">{brand(lede)}</p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={0.22}>
            <div className="mt-10 flex flex-wrap gap-3">{children}</div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
