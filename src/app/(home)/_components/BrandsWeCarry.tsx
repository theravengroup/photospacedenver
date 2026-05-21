import { SectionShell } from "./SectionShell";
import { RevealOnScroll } from "./RevealOnScroll";
import { BRANDS } from "../_data/brands";

/**
 * Editorial brand run.
 *
 * Not a logo wall — a confident typographic display of the brands
 * we actually carry. Separated by middle-dots, wrapped naturally,
 * sized to read like a magazine credit roll.
 */
export function BrandsWeCarry() {
  return (
    <SectionShell tone="bone" innerClassName="">
      <RevealOnScroll stagger className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="reveal lg:col-span-4">
          <p className="eyebrow mb-5">Brands we carry</p>
          <h2
            className="font-semibold text-ink"
            style={{
              fontSize: "var(--text-display-xl)",
              lineHeight: "var(--text-display-xl--line-height)",
              letterSpacing: "var(--text-display-xl--letter-spacing)",
            }}
          >
            The kit your shot
            <br />
            list already calls for.
          </h2>
          <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-stone">
            Professional gear from the brands working productions specify by
            name. Updated continuously — bodies, computing, and grip.
          </p>
        </div>

        <div className="reveal lg:col-span-8 min-w-0">
          <ul
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-graphite"
            style={{
              fontSize: "clamp(1.125rem, 1vw + 0.75rem, 1.875rem)",
              lineHeight: 1.4,
              letterSpacing: "-0.015em",
              fontWeight: 450,
            }}
          >
            {BRANDS.map((b, i) => (
              <li key={b} className="flex items-baseline gap-3">
                <span className="whitespace-nowrap">{b}</span>
                {i < BRANDS.length - 1 && (
                  <span aria-hidden="true" className="text-fog">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </RevealOnScroll>
    </SectionShell>
  );
}
