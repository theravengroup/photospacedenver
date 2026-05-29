import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { brand } from "@/lib/brand";

/**
 * Premium interior-page hero, shared site-wide. Clears the fixed header and
 * carries the single page <h1>, an optional lede, breadcrumbs, and CTAs.
 *
 * When `image` is passed, it renders as a darkened, slowly-drifting (Ken Burns)
 * cinematic backdrop with layered ink gradients tuned for left-aligned text.
 * Without an image, it falls back to a moody tungsten atmosphere. Entrance is
 * staggered (eyebrow → title → lede → CTAs) and reduced-motion-aware.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  breadcrumbs,
  image,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  breadcrumbs?: Crumb[];
  /** Optional background photo (e.g. "/images/space/stage.jpg"). */
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <Section
      tone="dark"
      className="grain relative isolate overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-32"
      containerSize="wide"
    >
      {/* Cinematic backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {image ? (
          <>
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-[0.55] will-change-transform motion-safe:animate-[kenburns_28s_ease-in-out_infinite_alternate]"
            />
            {/* Left-weighted wash keeps text legible; vertical wash grounds top + bottom */}
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70" />
            <div className="absolute -left-32 top-1/4 h-[460px] w-[460px] rounded-full bg-tungsten/[0.10] blur-[150px]" />
          </>
        ) : (
          <>
            <div className="absolute -left-40 -top-48 h-[640px] w-[640px] rounded-full bg-tungsten/[0.16] blur-[160px]" />
            <div className="absolute right-0 top-1/4 h-[520px] w-[520px] rounded-full bg-tungsten/[0.07] blur-[150px]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
          </>
        )}
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
          <h1 className="font-display mt-6 max-w-[15ch] leading-[1.02] tracking-tight text-display-2xl [text-shadow:0_2px_40px_rgba(0,0,0,0.35)]">
            {title}
          </h1>
        </Reveal>
        {lede && (
          <Reveal delay={0.16}>
            <p className="measure mt-6 text-lg leading-relaxed text-bone/80 sm:text-xl">{brand(lede)}</p>
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
