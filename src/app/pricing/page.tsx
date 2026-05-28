import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { PricingCards } from "@/components/sections/PricingCards";
import { MembershipCards } from "@/components/sections/MembershipCards";
import { FaqList } from "@/components/sections/FaqList";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { BookingCTA, EstimateCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import {
  ACUITY_LADDER,
  LIGHTING_KITS,
  SERVICE_PRICING,
  MEMBERSHIP_TERMS,
  TOUR,
  FEES,
  usd,
} from "@/lib/content/pricing-data";
import { faqsByTag } from "@/lib/content/faqs";

export const metadata = pageMeta({
  title: "PhotoSpace Denver Pricing — Studio, Memberships & Add-Ons",
  description:
    "Transparent pricing: studio $100/hr (2-hr minimum), half-day $485, full-day $925, memberships from $425/mo, plus add-on lighting kits, gear rental, and the ShootPod mobile studio.",
  path: "/pricing",
  keywords: ["studio rental pricing Denver", "photo studio rates Denver", "studio membership pricing Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
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

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple pricing. Nothing hidden."
        lede="No setup fees, and the same rate 24/7 — no evening or weekend surcharge. A starter light and grip kit comes with the room; premium lighting, modifiers, cameras, and lenses are à la carte add-ons, discounted for members."
        breadcrumbs={breadcrumbs}
      >
        <BookingCTA page="pricing" location="hero" />
        <EstimateCTA page="pricing" location="hero" variant="outline" />
      </PageHero>

      {/* Studio rental */}
      <Section tone="light" containerSize="wide">
        <SectionHeading eyebrow="Studio rental" title="Book by the hour, half-day, or day." />
        <div className="mt-10">
          <PricingCards page="pricing" />
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
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.14em] text-muted">Studio extras</h3>
            <RateRows
              rows={[
                { name: "Overtime (full day)", price: FEES.overtimeHourly, unit: "/hr" },
                { name: "Cyclorama repaint", price: FEES.cycRepaint, unit: " + paint" },
                { name: "Event venue (7am–midnight)", price: SERVICE_PRICING.eventVenue.price, unit: SERVICE_PRICING.eventVenue.unit },
              ]}
            />
            <h4 className="mt-6 text-sm uppercase tracking-[0.14em] text-muted">Add-on lighting kits</h4>
            <RateRows rows={[...LIGHTING_KITS.strobe, ...LIGHTING_KITS.video]} />
          </div>
        </div>
      </Section>

      {/* Memberships */}
      <Section tone="dark" className="grain" containerSize="wide">
        <SectionHeading
          eyebrow="Memberships"
          title="Shoot more, pay less per hour."
          intro="Recurring monthly access at member rates, plus discounted camera, lens, and lighting add-ons."
        />
        <div className="mt-10">
          <MembershipCards page="pricing" />
        </div>
        <p className="mt-6 text-sm text-muted">
          Billed every {MEMBERSHIP_TERMS.billingCycleDays} days · {MEMBERSHIP_TERMS.minimumCommitmentDays}-day
          minimum · extra hours {usd(MEMBERSHIP_TERMS.extraHourRate)}/hr · hours don&rsquo;t roll over.{" "}
          <Link href="/memberships" className="text-tungsten hover:underline">Compare memberships</Link>.
        </p>
      </Section>

      {/* Gear rental & ShootPod */}
      <Section tone="light" containerSize="wide">
        <SectionHeading
          eyebrow="Gear rental"
          title="Add the gear to match."
          intro="Cameras, lighting, modifiers, and grip from the top brands — by the day, picked up at the shop or delivered across the Denver metro."
        />
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="font-medium">ShootPod mobile studio</h3>
            <p className="mt-1 text-sm text-muted">Grip van, pre-packed and ready.</p>
            <RateRows rows={[{ name: "Per day", price: SERVICE_PRICING.shootPod.daily, unit: "/day" }]} />
            <p className="mt-2 text-xs text-muted">
              First {SERVICE_PRICING.shootPod.freeMiles} miles free, then ${SERVICE_PRICING.shootPod.perMileAfter}/mile.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Full gear catalog</h3>
            <p className="mt-1 text-sm text-muted">
              Daily rates across seven categories — cameras &amp; lenses, flash and continuous lighting,
              modifiers, grip &amp; electrical, accessories, and production supplies.
            </p>
            <p className="mt-3 text-sm">
              <Link href="/gear-rental" className="text-tungsten hover:underline">Browse all gear rental &rarr;</Link>
            </p>
          </div>
        </div>
        <p className="mt-8 text-sm text-muted">
          Renting gear on location or planning a multi-day shoot? <Link href="/request-estimate" className="text-tungsten hover:underline">Request a quote</Link> for a written estimate.
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
        body="Book the studio in under a minute, or request a quote for gear or a multi-day shoot."
      >
        <BookingCTA page="pricing" location="final" size="lg" />
        <EstimateCTA page="pricing" location="final" variant="outline" size="lg" />
      </FinalCTA>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
