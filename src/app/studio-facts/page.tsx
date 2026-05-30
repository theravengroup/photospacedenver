import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { buildStudioFacts } from "@/lib/content/studio-facts";
import { usd } from "@/lib/content/pricing-data";

export const metadata = pageMeta({
  title: "Studio Facts — photospace Denver",
  description:
    "A plain, structured fact sheet for photospace Denver: location, studio specs, rates, memberships, included gear, services, booking, and policies.",
  path: "/studio-facts",
  keywords: ["photospace Denver facts", "Denver studio specs", "studio rental rates Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Studio Facts", path: "/studio-facts" },
];

const f = buildStudioFacts();

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline pt-6">
      <h2 className="font-display text-display-md">{title}</h2>
      <div className="mt-4 space-y-2 text-muted">{children}</div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[12rem_1fr] sm:gap-4">
      <dt className="text-sm uppercase tracking-[0.12em] text-muted">{k}</dt>
      <dd className="text-foreground">{v}</dd>
    </div>
  );
}

export default function StudioFactsPage() {
  return (
    <>
      <PageHero
        eyebrow="Studio Facts"
        title="Everything, in plain terms."
        lede="A structured fact sheet for photospace Denver — for humans and AI assistants alike. A machine-readable version is available at /studio-facts.json."
        breadcrumbs={breadcrumbs}
      />

      <Section tone="light" containerSize="default">
        <div className="space-y-12">
          <Block title="Overview">
            <dl className="space-y-3">
              <Row k="Business" v={`${f.business.name} (${f.business.alternateName})`} />
              <Row k="Founded" v={f.business.founded} />
              <Row k="Owner" v={f.business.owner} />
              <Row k="What it is" v={f.business.positioning} />
            </dl>
          </Block>

          <Block title="Location & contact">
            <dl className="space-y-3">
              <Row k="Address" v={f.location.address} />
              {f.location.neighborhood && (
                <Row k="Neighborhood" v={f.location.neighborhood} />
              )}
              <Row k="Service area" v={f.location.serviceAreas.join(", ")} />
              <Row k="Phone" v={<a className="hover:text-tungsten" href={`tel:${f.contact.phone}`}>{f.contact.phone}</a>} />
              <Row k="Email" v={<a className="hover:text-tungsten" href={`mailto:${f.contact.email}`}>{f.contact.email}</a>} />
            </dl>
          </Block>

          <Block title="Hours">
            <dl className="space-y-3">
              <Row k="Gear pickup" v={f.hours.gearPickup} />
              <Row k="Studio" v={f.hours.studio} />
              <Row k="Event venue" v={f.hours.eventVenue} />
            </dl>
          </Block>

          <Block title="The studio">
            <dl className="space-y-3">
              <Row k="Total size" v={`${f.studio.totalSqFt.toLocaleString()} ft²`} />
              <Row k="Shooting floor" v={`${f.studio.shootingSqFt.toLocaleString()} ft²`} />
              <Row k="Cyclorama" v={f.studio.cyclorama} />
              <Row k="Power" v={f.studio.power} />
              <Row k="Tether software" v={f.studio.tetherSoftware.join(", ")} />
              <Row k="Parking" v={f.studio.parking} />
            </dl>
            <p className="mt-4 text-sm"><strong className="text-foreground">Included with every rental:</strong> {f.studio.includedWithRental.join(", ")}.</p>
            <p className="mt-2 text-sm"><strong className="text-foreground">Amenities:</strong> {f.studio.amenities.join("; ")}.</p>
          </Block>

          <Block title="Rental rates">
            <dl className="space-y-3">
              <Row k="Hourly" v={`${usd(f.rentalRates.hourly.price)}/hr — ${f.rentalRates.hourly.note}`} />
              <Row k="Half day" v={`${usd(f.rentalRates.halfDay.price)} — ${f.rentalRates.halfDay.hours} hours`} />
              <Row k="Full day" v={`${usd(f.rentalRates.fullDay.price)} — ${f.rentalRates.fullDay.hours} hours (${f.rentalRates.fullDay.note})`} />
              <Row k="Studio tour" v={`Free, ${f.rentalRates.tour.durationMinutes} minutes`} />
              <Row k="Overtime" v={`${usd(f.rentalRates.overtimePerHour)}/hr`} />
              <Row k="Minimum rental" v={usd(f.rentalRates.minimumRental)} />
            </dl>
          </Block>

          <Block title="Memberships">
            <ul className="space-y-1">
              {f.memberships.tiers.map((t) => (
                <li key={t.name}>
                  <strong className="text-foreground">{t.name}</strong> — {t.hoursPerMonth} hrs/mo, {usd(t.pricePerMonth)}/mo (≈ {usd(t.effectiveHourly)}/hr)
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              Billed every {f.memberships.terms.billingCycleDays} days · {f.memberships.terms.minimumCommitmentDays}-day
              minimum · extra hours {usd(f.memberships.terms.extraHourRate)}/hr · hours don&rsquo;t roll over · a membership
              is not required to rent.
            </p>
          </Block>

          <Block title="Services">
            <p>{f.services.join(" · ")}</p>
          </Block>

          <Block title="Booking">
            <dl className="space-y-3">
              <Row k="Book the studio" v={<Link className="text-tungsten hover:underline" href="/book-studio">/book-studio</Link>} />
              <Row k="Request an estimate" v={<Link className="text-tungsten hover:underline" href="/request-estimate">/request-estimate</Link>} />
              <Row k="Apply for membership" v={<Link className="text-tungsten hover:underline" href="/memberships">/memberships</Link>} />
              <Row k="Free tour" v={f.booking.freeTour} />
            </dl>
          </Block>

          <Block title="Policies">
            <dl className="space-y-3">
              <Row k="Insurance" v={f.policies.insurance} />
              <Row k="Cancellation" v={f.policies.cancellation} />
              <Row k="Deposit" v={f.policies.deposit} />
            </dl>
          </Block>

          <Block title="Ideal use cases">
            <p>{f.idealUseCases.join(" · ")}</p>
          </Block>
        </div>

        <p className="mt-12 text-sm text-muted">
          Machine-readable version:{" "}
          <a href="/studio-facts.json" className="text-tungsten hover:underline">/studio-facts.json</a>. Last updated {f.lastUpdated}.
        </p>
      </Section>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
