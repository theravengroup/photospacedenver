import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Steps } from "@/components/sections/Steps";
import { FaqList } from "@/components/sections/FaqList";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { EstimateCTA } from "@/components/cta/Ctas";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { GEAR_CATEGORIES, GEAR_BRANDS, SHOOTPOD, RENTAL_WEEK } from "@/lib/content/gear-data";
import { usd } from "@/lib/content/pricing-data";
import { faqsByTag } from "@/lib/content/faqs";

export const metadata = pageMeta({
  title: "Camera, Lighting & Grip Rental in Denver — photospace",
  description:
    "Denver gear rental: Profoto, Phase One, Canon, Nikon, Blackmagic, Arri, and more — cameras, lighting, modifiers, grip, accessories, and production supplies. Pickup or delivery within 500 miles of Denver.",
  path: "/gear-rental",
  keywords: ["gear rental Denver", "camera rental Denver", "lighting rental Denver", "grip rental Denver", "production equipment rental Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Gear Rental", path: "/gear-rental" },
];

const RENT_STEPS = [
  {
    title: "Register once",
    body: (
      <>
        First-time on-location renters set up a rental account — a driver&rsquo;s license scan and{" "}
        <strong className="font-medium text-ink">either a Certificate of Insurance or a card authorization</strong>{" "}
        for the replacement value of the gear.{" "}
        <Link href="/register" className="text-tungsten underline-offset-2 hover:underline">Set up your rental account &rarr;</Link>
      </>
    ),
  },
  {
    title: "Request a quote",
    body: (
      <>
        Send your gear list (or a brief) and shoot dates. We confirm availability and send a written quote — usually the same business day.{" "}
        <Link href="/request-estimate" className="text-tungsten underline-offset-2 hover:underline">Request a quote &rarr;</Link>
      </>
    ),
  },
  {
    title: "Pick up or we deliver",
    body: (
      <>
        Pick up at the Kalamath St. shop Mon–Fri, 8:30am–5:30pm by appointment, or we deliver within 500 miles of Denver. Out-of-town crews: we stage on arrival. Off-hours pickup and drop-off can be arranged for a fee.
      </>
    ),
  },
];

export default function GearRentalPage() {
  return (
    <>
      <PageHero
        image="/images/gear/gear.jpg"
        eyebrow="Gear Rental"
        title="Camera, lighting & grip rental in Denver."
        lede="A full rental house — medium format through cinema, Profoto strobes, Arri and Nanlux continuous, modifiers, grip, and production supplies. Picked up at our shop or delivered anywhere within 500 miles of Denver."
        breadcrumbs={breadcrumbs}
      >
        <EstimateCTA page="gear-rental" location="hero" />
        <Button href="#categories" variant="outline">Browse categories</Button>
      </PageHero>

      {/* Brand wall */}
      <Section tone="dark" className="!py-12" containerSize="wide">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-tungsten">Gear from all the top brands</p>
        <div className="mx-auto mt-7 flex max-w-5xl flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {GEAR_BRANDS.map((b) => (
            <span key={b} className="text-sm font-medium uppercase tracking-[0.12em] text-muted">{b}</span>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section tone="light" id="categories" containerSize="wide">
        <SectionHeading
          eyebrow="The catalog"
          title="Seven categories, one shop."
          intro="Browse by category for rates and brand coverage. Don't see it? Ask — we add and swap constantly."
        />
        <div className="mt-8 rounded-card border border-hairline bg-panel p-5 sm:flex sm:items-baseline sm:gap-4">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-tungsten">{RENTAL_WEEK.label}</p>
          <p className="mt-1.5 text-sm sm:mt-0">
            <span className="font-semibold">{RENTAL_WEEK.statement}</span>{" "}
            <span className="text-muted">{RENTAL_WEEK.detail}</span>
          </p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-card border border-hairline bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
          {GEAR_CATEGORIES.map((c) => (
            <Link key={c.seoSlug} href={`/${c.seoSlug}`} className="group bg-panel p-7">
              <h3 className="font-display text-display-md transition-colors group-hover:text-tungsten">{c.title}</h3>
              <p className="mt-2 text-sm text-muted">{c.blurb}</p>
              <span className="mt-4 inline-block text-sm text-tungsten opacity-0 transition-opacity group-hover:opacity-100">
                Browse &rarr;
              </span>
            </Link>
          ))}
          <div className="flex flex-col justify-center gap-3 bg-panel p-7">
            <p className="text-sm text-muted">Building a kit or planning a multi-day shoot?</p>
            <EstimateCTA page="gear-rental" location="categories" variant="outline" size="sm" />
          </div>
        </div>
      </Section>

      {/* How renting works */}
      <Section tone="light" className="!pt-0" containerSize="wide">
        <SectionHeading eyebrow="How renting works" title="Quick steps to get your gear." />
        <div className="mt-10">
          <Steps steps={RENT_STEPS} />
        </div>
      </Section>

      {/* ShootPod */}
      <Section tone="dark" className="grain" containerSize="wide">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading eyebrow="Mobile studio" title={SHOOTPOD.title} intro={SHOOTPOD.blurb} />
          <div className="lg:justify-self-end">
            <div className="rounded-card border border-hairline p-7">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl">{usd(SHOOTPOD.daily)}</span>
                <span className="text-muted">/day</span>
              </div>
              <p className="mt-2 text-sm text-muted">{SHOOTPOD.mileage}.</p>
              <div className="mt-6">
                <EstimateCTA page="gear-rental" location="shootpod" label="Reserve the ShootPod" />
              </div>
              <p className="mt-4 text-xs text-muted">
                A custom grip van, pre-packed and ready to roll to your location.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <SectionHeading eyebrow="FAQ" title="Rental questions." />
        <div className="mt-8">
          <FaqList faqs={faqsByTag("gear")} />
        </div>
      </Section>

      <FinalCTA
        eyebrow="Tell us what you need"
        title="Request a quote."
        body="Send your gear list and dates — we'll check availability and send a written quote, usually same business day."
      >
        <EstimateCTA page="gear-rental" location="final" size="lg" />
      </FinalCTA>

      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          serviceSchema({
            name: "Photo & video gear rental",
            description:
              "Camera, lighting, grip, and production-supply rental in Denver — pickup or delivery within 500 miles of Denver, with insurance options.",
            path: "/gear-rental",
            serviceType: "Equipment rental",
          }),
        ]}
      />
    </>
  );
}
