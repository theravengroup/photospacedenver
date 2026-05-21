import { RevealOnScroll } from "./RevealOnScroll";
import { OutboundIcon } from "./OutboundIcon";
import { SITE } from "../_data/site";

/**
 * Studio Division Bridge.
 *
 * Type-only — no studio imagery on this site per direction. The studio
 * lives at photospace.studio now. This section signals that the
 * studio is still a major PhotoSpace division and routes visitors
 * over to it without making the new site feel half-built.
 */
export function StudioBridge() {
  return (
    <section className="relative isolate overflow-hidden bg-paper text-graphite">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-12 py-24 lg:py-32">
        <RevealOnScroll
          stagger
          className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12"
        >
          <div className="reveal lg:col-span-7">
            <p className="eyebrow mb-5">Studio division · photospace.studio</p>
            <h2
              className="font-semibold text-ink"
              style={{
                fontSize: "var(--text-display-2xl)",
                lineHeight: "var(--text-display-2xl--line-height)",
                letterSpacing: "var(--text-display-2xl--letter-spacing)",
              }}
            >
              Need the studio too?
            </h2>
            <p className="mt-6 max-w-[44rem] text-lg leading-relaxed text-stone">
              PhotoSpace also operates a fully-equipped commercial production
              studio for photographers, filmmakers, podcasters, agencies, and
              content teams. Studio rentals and memberships now live at{" "}
              <span className="text-graphite font-medium">
                photospace.studio
              </span>
              .
            </p>
          </div>

          <div className="reveal lg:col-span-5 lg:pl-8 lg:border-l lg:border-hair">
            {/* Wordmark moment */}
            <div className="flex items-baseline gap-2 leading-none mb-6">
              <span className="text-[clamp(2rem,3vw,3rem)] font-medium tracking-[-0.03em] text-ink">
                photospace
              </span>
              <span className="text-[0.7rem] uppercase tracking-[0.28em] text-copper font-medium">
                .studio
              </span>
            </div>

            <ul className="space-y-1 text-base text-stone">
              <li className="flex items-baseline gap-3">
                <span
                  className="h-1 w-1 rounded-full bg-copper"
                  aria-hidden="true"
                />
                Commercial studio rentals
              </li>
              <li className="flex items-baseline gap-3">
                <span
                  className="h-1 w-1 rounded-full bg-copper"
                  aria-hidden="true"
                />
                Memberships
              </li>
              <li className="flex items-baseline gap-3">
                <span
                  className="h-1 w-1 rounded-full bg-copper"
                  aria-hidden="true"
                />
                Cyc wall · capture station
              </li>
              <li className="flex items-baseline gap-3">
                <span
                  className="h-1 w-1 rounded-full bg-copper"
                  aria-hidden="true"
                />
                Podcasting + content creation
              </li>
            </ul>

            <a
              href={SITE.studioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-graphite transition-colors"
            >
              <span>Visit photospace.studio</span>
              <OutboundIcon className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
