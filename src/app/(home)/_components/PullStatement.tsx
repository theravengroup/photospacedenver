import Image from "next/image";
import { RevealOnScroll } from "./RevealOnScroll";

/**
 * Single editorial pull-statement moment.
 *
 * Hard cut into the page after the Why section — a big, calm line
 * that anchors the whole gear positioning.
 */
export function PullStatement() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      {/* Atmospheric backdrop — Profoto parabolic umbrellas on black */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src="/images/007photospace-gearjpg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/30" />
        <div className="absolute inset-0 bg-ink-grain opacity-50" />
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-12 py-24 lg:py-32">
        <RevealOnScroll stagger className="max-w-[58rem]">
          <p className="eyebrow eyebrow-light reveal">A note on inventory</p>
          <blockquote
            className="reveal mt-6 font-semibold text-paper"
            style={{
              fontSize: "clamp(2rem, 3vw + 1rem, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.022em",
            }}
          >
            For some of what we carry,
            <br />
            <span className="italic font-normal text-paper/90">
              we&rsquo;re the only source in Denver.
            </span>
          </blockquote>
          <p className="reveal mt-7 max-w-[44rem] text-lg leading-relaxed text-fog">
            Medium-format Phase One and Hasselblad. Profoto Pro heads. Select
            grip, lighting, and capture gear that doesn&rsquo;t live anywhere
            else on the Front Range. If your shot list needs it, we likely have it.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
