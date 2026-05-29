import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { PricingCards } from "@/components/sections/PricingCards";
import { MembershipCards } from "@/components/sections/MembershipCards";
import { FaqList } from "@/components/sections/FaqList";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { BookingCTA } from "@/components/cta/Ctas";
import { MultiDayRequest } from "@/components/forms/MultiDayRequest";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import {
  ACUITY_LADDER,
  LIGHTING_KITS,
  STUDIO_CREW,
  SERVICE_PRICING,
  MEMBERSHIP_TERMS,
  TOUR,
  FEES,
  usd,
} from "@/lib/content/pricing-data";
import { faqsByTag } from "@/lib/content/faqs";

export const metadata = pageMeta({
  title: "Studio Rental Pricing — photospace Denver",
  description:
    "Studio rental pricing: $100/hr (2-hr minimum), half-day $485, full-day $925. Add lighting kits, on-call assistants, and digital techs. Studio memberships from $425/mo.",
  path: "/studio-pricing",
  keywords: ["studio rental pricing Denver", "photo studio rates Denver", "studio membership pricing Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Studio", path: "/studio" },
  { name: "Pricing", path: "/studio-pricing" },
];

function RateRows({ rows }: { rows: { name: string; price: number; unit?: string }[] }) {
  return (
    <ul className="border-t border-hairline">
      {rows.map((r) => (
        <li key={r.name} className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5">
          <span className="text-base">{r.name}</span>
          <span className="shrink-0 text-sm text-muted">{usd(r.price)}{r.unit ?? ""}</span>
        </li>
      ))}
    </ul>
  );
}

export default function StudioPricingPage() {
  return (
    <>
      <PageHero
        image="/images/space/lounge.jpg"
        eyebrow="Studio rental · pricing"
        title="Simple pricing. Nothing hidden."
        lede="No setup fees, same rate 24/7 — no evening or weekend surcharge. A starter light and grip kit comes with the room; premium lighting, cameras, and lenses are à la carte add-ons, discounted for members."
        breadcrumbs={breadcrumbs}
      >
        <BookingCTA page="studio-pricing" location="hero" />
      </PageHero>

      {/* Studio rental rates */}
      <Section tone="light" containerSize="wide">
        <SectionHeading eyebrow="Studio rental · rates" title="Book by the hour, half-day, or day." />
        <div className="mt-10">
          <PricingCards page="studio-pricing" />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h3 className="text-sm uppercase tracking-[0.14em] text-muted">Hourly ladder</h3>
            <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-hairline bg-[var(--hairline)] sm:grid-cols-3">
              {ACUITY_LADDER.map((row) => (
                <div key={row.hours} className="bg-panel px-4 py-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm">{row.hours} hr</span>
                    <span className="font-display text-lg">{usd(row.price)}</span>
                  </div>
                  {row.label && <span className="text-xs text-tungsten">{row.label}</span>}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted">
              2-hour minimum. Full-day rate covers 10–12 hours. Free {TOUR.durationMin}-minute studio
              tours, 7 days a week.
            </p>
            <p className="mt-4 text-sm text-muted">
              Shooting multiple days? Multi-day bookings are by request, not self-booked —{" "}
              <MultiDayRequest page="studio-pricing">request your dates</MultiDayRequest>.
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.14em] text-muted">Studio extras</h3>
            <RateRows
              rows={[
                { name: "Overtime (full day)", price: FEES.overtimeHourly, unit: "/hr" },
                { name: "Cyclorama repaint — white", price: FEES.cycRepaint, unit: "" },
                { name: "Cyclorama repaint — custom color (paint 48h ahead)", price: FEES.cycRepaintCustom, unit: "" },
                { name: "Event venue (7am–midnight)", price: SERVICE_PRICING.eventVenue.price, unit: SERVICE_PRICING.eventVenue.unit },
              ]}
            />
          </div>
        </div>
      </Section>

      {/* Add-on lighting kits */}
      <Section tone="dark" className="grain" containerSize="wide">
        <SectionHeading
          eyebrow="Studio rental · add-ons"
          title="Lighting kits & assistants."
          intro="Add premium lighting, on-call crew, and more at checkout. Starter light and grip are already included with every rental — these are upgrades."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Strobe kits */}
          <div>
            <h3 className="mb-5 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-tungsten">
              Profoto strobe kits
              <span className="h-px flex-1 bg-hairline block" />
            </h3>
            <div className="space-y-3">
              {LIGHTING_KITS.strobe.map((k) => (
                <div key={k.name} className="rounded-card border border-hairline bg-ink/50 p-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <span className="font-medium text-bone">{k.name}</span>
                      <span className="ml-2 text-xs uppercase tracking-[0.14em] text-tungsten">{k.label}</span>
                    </div>
                    <span className="shrink-0 font-display text-xl text-tungsten">{usd(k.price)}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted">{k.contents}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Video kits + assistants */}
          <div className="space-y-10">
            <div>
              <h3 className="mb-5 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-tungsten">
                LED video kits
                <span className="h-px flex-1 bg-hairline block" />
              </h3>
              <div className="space-y-3">
                {LIGHTING_KITS.video.map((k) => (
                  <div key={k.name} className="rounded-card border border-hairline bg-ink/50 p-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <div>
                        <span className="font-medium text-bone">{k.name}</span>
                        <span className="ml-2 text-xs uppercase tracking-[0.14em] text-tungsten">{k.label}</span>
                      </div>
                      <span className="shrink-0 font-display text-xl text-tungsten">{usd(k.price)}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted">{k.contents}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Assistants */}
            <div>
              <h3 className="mb-5 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-tungsten">
                On-call crew
                <span className="h-px flex-1 bg-hairline block" />
              </h3>
              <div className="space-y-3">
                {STUDIO_CREW.map((c) => (
                  <div key={`${c.name}-${c.label}`} className="rounded-card border border-hairline bg-ink/50 p-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <div>
                        <span className="font-medium text-bone">{c.name}</span>
                        <span className="ml-2 text-xs uppercase tracking-[0.14em] text-tungsten">{c.label}</span>
                      </div>
                      <span className="shrink-0 font-display text-xl text-tungsten">{usd(c.price)}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted">{c.blurb}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">Add crew after selecting your time block.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Studio memberships */}
      <Section tone="light" containerSize="wide">
        <SectionHeading
          eyebrow="Studio rental · memberships"
          title="Shoot more, pay less per hour."
          intro="Three studio membership levels — recurring monthly access at member rates. Everything included with a standard studio rental still comes with your membership; the same premium add-ons stay available à la carte, discounted for members."
        />
        <div className="mt-10">
          <MembershipCards page="studio-pricing" />
        </div>
        <p className="mt-6 text-sm text-muted">
          Billed every {MEMBERSHIP_TERMS.billingCycleDays} days · {MEMBERSHIP_TERMS.minimumCommitmentDays}-day
          minimum · extra hours {usd(MEMBERSHIP_TERMS.extraHourRate)}/hr · hours don&rsquo;t roll over.{" "}
          <Link href="/memberships" className="text-tungsten hover:underline">Compare memberships</Link>.
        </p>
      </Section>

      <Section tone="light" className="!pt-0">
        <SectionHeading eyebrow="FAQ" title="Pricing questions." />
        <div className="mt-8">
          <FaqList faqs={faqsByTag("pricing", "membership", "booking")} />
        </div>
      </Section>

      <FinalCTA
        eyebrow="Ready when you are"
        title="Lock in your time."
        body="Book the studio in under a minute — pick your block and add lighting kits or crew at checkout."
      >
        <BookingCTA page="studio-pricing" location="final" size="lg" />
      </FinalCTA>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
