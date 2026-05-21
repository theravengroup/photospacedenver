import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "./RevealOnScroll";
import { CONTACT, LINKS } from "../_data/site";
import { ArrowIcon } from "./OutboundIcon";

/**
 * Final CTA. Three balanced contact moments — estimate, phone, email.
 * Estimate gets slight visual primacy via filled button styling.
 *
 * Atmospheric grip-rack image backs the section for a strong closing
 * moment after the long scroll.
 */
export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      {/* Atmospheric backdrop */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src="/images/003photospace-gearjpg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-ink/60" />
        <div className="absolute inset-0 bg-ink-grain opacity-60" />
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-12 py-24 lg:py-32">
        <RevealOnScroll stagger>
          <div className="reveal max-w-[40rem]">
            <p className="eyebrow eyebrow-light">Start the conversation</p>
            <h2
              className="mt-5 font-semibold text-paper"
              style={{
                fontSize: "var(--text-display-2xl)",
                lineHeight: "var(--text-display-2xl--line-height)",
                letterSpacing: "var(--text-display-2xl--letter-spacing)",
              }}
            >
              Tell us what you need for your shoot.
            </h2>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-fog">
              Estimate, phone, or email — whichever you prefer. We reply same
              business day during shop hours, and after-hours by arrangement.
            </p>
          </div>

          {/* Contact trio */}
          <div className="reveal mt-12 grid gap-4 sm:grid-cols-3 lg:gap-6">
            {/* Estimate — primary */}
            <Link
              href={LINKS.estimate}
              className="group flex flex-col justify-between gap-6 rounded-sm bg-paper p-7 text-ink hover:bg-bone transition-colors"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                  Request
                </p>
                <p className="mt-4 text-2xl font-semibold tracking-tight">
                  Send an estimate request
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone">
                  Share your shoot dates, gear list, and any unknowns. We reply
                  same business day.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                Start a request
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>

            {/* Phone */}
            <a
              href={CONTACT.phoneHref}
              className="group flex flex-col justify-between gap-6 rounded-sm border border-hair-light bg-white/[0.02] p-7 text-paper hover:bg-white/[0.05] transition-colors"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-copper-soft">
                  Call
                </p>
                <p className="mt-4 text-2xl font-semibold tracking-tight">
                  {CONTACT.phone}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-fog">
                  Real humans answer during shop hours. 24/7 by arrangement for
                  active productions.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-paper">
                Tap to call
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </a>

            {/* Email */}
            <a
              href={CONTACT.emailHref}
              className="group flex flex-col justify-between gap-6 rounded-sm border border-hair-light bg-white/[0.02] p-7 text-paper hover:bg-white/[0.05] transition-colors"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-copper-soft">
                  Email
                </p>
                <p className="mt-4 text-2xl font-semibold tracking-tight break-words">
                  {CONTACT.email}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-fog">
                  Send your brief, treatment, or kit list. We&rsquo;ll come
                  back with a written estimate.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-paper">
                Open in mail
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>

          {/* Address & hours strip */}
          <div className="reveal mt-12 grid gap-6 border-t border-hair-light pt-8 text-sm text-fog sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="eyebrow eyebrow-light mb-2">Visit</p>
              <p className="text-paper">
                {CONTACT.address.line1}, {CONTACT.address.line2}
              </p>
            </div>
            <div>
              <p className="eyebrow eyebrow-light mb-2">Hours</p>
              <p className="text-paper">{CONTACT.hours.primary}</p>
              <p>{CONTACT.hours.secondary}</p>
            </div>
            <div>
              <p className="eyebrow eyebrow-light mb-2">Response</p>
              <p className="text-paper">Same business day, typically.</p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
