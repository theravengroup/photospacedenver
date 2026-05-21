import Image from "next/image";
import { SectionShell } from "./SectionShell";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";
import { WHY_POINTS } from "../_data/why";

/**
 * "Why productions rent from PhotoSpace" — the operator credibility
 * section. The first point (sole-source in Denver) is featured as a
 * larger editorial moment; the rest live in a calm numbered grid.
 */
export function WhyPhotoSpace() {
  const [featured, ...rest] = WHY_POINTS;

  return (
    <SectionShell tone="ink" grain id="why">
      <RevealOnScroll stagger className="grid gap-12 lg:grid-cols-12">
        {/* Left rail — heading + Denver locality image */}
        <div className="reveal lg:col-span-5">
          <SectionHeading
            eyebrow="Why PhotoSpace"
            tone="light"
            title={
              <>
                Operator-run,
                <br />
                production-ready.
              </>
            }
            lead="The reasons Denver productions — and out-of-town crews shooting Denver — choose PhotoSpace, in plain language."
          />

          <div className="mt-10 relative aspect-[5/4] overflow-hidden rounded-sm ring-1 ring-white/[0.04]">
            <Image
              src="/images/008photospace-gearjpg.jpg"
              alt="PhotoSpace's shootpod delivery van parked on a Colorado mountain road with snow and pines in the background"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
            <p className="absolute bottom-5 left-6 right-6 text-sm leading-relaxed text-paper">
              <span className="eyebrow eyebrow-light block mb-2">
                On location
              </span>
              Pick up at Kalamath St., or schedule local Denver delivery. Out-of-town crews — we&rsquo;ll stage on arrival.
            </p>
          </div>
        </div>

        {/* Right side — featured point + grid of remaining */}
        <div className="reveal lg:col-span-7 lg:pt-2">
          {/* Featured: sole source */}
          <article className="border-l-2 border-copper pl-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-copper-soft">
              {featured.index} · Featured
            </p>
            <h3
              className="mt-3 font-semibold text-paper"
              style={{
                fontSize: "var(--text-display-xl)",
                lineHeight: 1.05,
                letterSpacing: "-0.018em",
              }}
            >
              {featured.title}
            </h3>
            <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-fog">
              {featured.body}
            </p>
          </article>

          {/* Remaining points */}
          <div className="mt-12 grid gap-y-10 gap-x-10 sm:grid-cols-2">
            {rest.map((p) => (
              <article key={p.index}>
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-medium tracking-[0.18em] text-copper-soft">
                    {p.index}
                  </span>
                  <span className="h-px flex-1 bg-paper/10" />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-paper">
                  {p.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-fog">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </SectionShell>
  );
}
