import Image from "next/image";
import { SITE, LINKS } from "../_data/site";
import { HeroPathwayCard } from "./HeroPathwayCard";
import { RevealOnScroll } from "./RevealOnScroll";

/**
 * Hero — Denver's home for professional production.
 *
 * Layered editorial composition:
 *   - Eyebrow + display headline + lead paragraph
 *   - A thin atmospheric image strip behind the type for depth
 *   - Two equal-weight pathway cards (Studio / Gear) immediately below
 */
export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-paper text-graphite"
      aria-label="PhotoSpace Denver"
    >
      {/* Atmospheric background — subtle warm tone, single image lightly
          composited at the top-right to give the hero depth without
          dominating the type. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[120vh] overflow-hidden"
      >
        <div className="absolute inset-0 bg-paper-grain" />
        <div className="absolute -right-[10%] -top-[6%] h-[80vh] w-[70vw] max-w-[1100px] opacity-[0.18] mix-blend-multiply">
          <Image
            src="/images/007photospace-gearjpg.jpg"
            alt=""
            fill
            priority
            sizes="70vw"
            className="object-cover"
          />
        </div>
        {/* Vignette to keep the headline contrast clean */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_30%,rgba(244,241,234,0.95),transparent_70%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-12 pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-24">
        {/* Brand statement */}
        <RevealOnScroll stagger className="max-w-[60rem]">
          <p className="eyebrow reveal">
            Denver · since {SITE.yearFounded} · operator-run
          </p>
          <h1
            className="reveal mt-6 font-semibold text-ink"
            style={{
              fontSize: "var(--text-display-3xl)",
              lineHeight: "var(--text-display-3xl--line-height)",
              letterSpacing: "var(--text-display-3xl--letter-spacing)",
            }}
          >
            Denver&rsquo;s home for{" "}
            <span className="italic font-normal text-graphite">
              professional production.
            </span>
          </h1>
          <p className="reveal mt-7 max-w-[44rem] text-lg sm:text-xl leading-relaxed text-stone">
            Commercial studio rentals, creative memberships, and professional
            photo and video equipment rentals for productions across Colorado.
          </p>
          <div className="reveal mt-8 inline-flex items-center gap-3 text-sm text-stone">
            <span className="h-px w-10 bg-stone/30" aria-hidden="true" />
            <span>Two pathways under one roof</span>
          </div>
        </RevealOnScroll>

        {/* Two-pathway split */}
        <RevealOnScroll
          stagger
          className="mt-14 grid grid-cols-1 gap-4 sm:gap-5 lg:mt-20 lg:grid-cols-2 lg:gap-6"
        >
          {/* Studio — type-only, outbound to photospace.studio */}
          <div className="reveal">
            <HeroPathwayCard
              eyebrow="Division 01 · Studio"
              title="Studio rentals & memberships"
              description="A fully-equipped commercial production studio for photographers, filmmakers, podcasters, and content teams. Cyc wall, lighting, capture station, lounge — and a memberships program now lives here too."
              ctaLabel="Explore the studio"
              ctaHref={LINKS.studio}
              external
              variant="type"
              highlights={[
                "Commercial studio rental",
                "Cyc wall",
                "Memberships",
                "Podcasting + content",
              ]}
            />
          </div>

          {/* Gear — image-led, scrolls down */}
          <div className="reveal">
            <HeroPathwayCard
              eyebrow="Division 02 · Gear"
              title="Professional gear rental"
              description="Cameras, lighting, grip, audio, monitoring, production supplies — and the local production support to back it. Pick up at the shop or schedule Denver delivery."
              ctaLabel="View gear & request estimate"
              ctaHref="#gear"
              variant="image"
              image={{
                src: "/images/001photospace-gearjpg.jpg",
                alt: "Phase One XF medium-format camera with prime lens, dramatically lit",
              }}
              highlights={[
                "Cameras & lenses",
                "Lighting & grip",
                "Audio",
                "Production supplies",
              ]}
            />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
