import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Steps } from "@/components/sections/Steps";
import { GearGrid } from "@/components/sections/GearGrid";
import { FaqList } from "@/components/sections/FaqList";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { EstimateCTA } from "@/components/cta/Ctas";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { SHOOTPOD } from "@/lib/content/gear-data";
import { usd } from "@/lib/content/pricing-data";
import { faqsByTag } from "@/lib/content/faqs";

export const metadata = pageMeta({
  title: "Camera, Lighting & Grip Rental in Denver — PhotoSpace",
  description:
    "Denver gear rental: Profoto, Phase One, Canon, Nikon, Blackmagic, Arri, and more — cameras, lighting, grip, and production supplies. Pickup or Denver-metro delivery. Request an estimate.",
  path: "/gear-rental",
  keywords: ["gear rental Denver", "camera rental Denver", "lighting rental Denver", "grip rental Denver", "production equipment rental Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Gear Rental", path: "/gear-rental" },
];

const RENT_STEPS = [
  { title: "Register once", body: "First-time on-location renters set up a rental account — a driver's license scan and either a certificate of insurance or a card hold for replacement value." },
  { title: "Request an estimate", body: "Send your gear list (or a brief) and shoot dates. We confirm availability and send a written estimate — usually the same business day." },
  { title: "Pick up or we deliver", body: "Pick up at the Kalamath St. shop Mon–Fri, 8:30am–5:30pm by appointment, or schedule Denver-metro delivery. Out-of-town crews: we stage on arrival." },
];

export default function GearRentalPage() {
  return (
    <>
      <PageHero
        eyebrow="Gear Rental"
        title="Camera, lighting & grip rental in Denver."
        lede="Medium format through cinema, Profoto strobes, Arri and Nanlux continuous, and a full grip package — picked up at our shop or delivered across the Denver metro."
        breadcrumbs={breadcrumbs}
      >
        <EstimateCTA page="gear-rental" location="hero" />
        <Button href="#catalog" variant="outline">Browse the catalog</Button>
      </PageHero>

      <Section tone="light" containerSize="wide">
        <SectionHeading eyebrow="How renting works" title="Quick steps to get your gear." />
        <div className="mt-10">
          <Steps steps={RENT_STEPS} />
        </div>
      </Section>

      <Section tone="light" id="catalog" className="!pt-0" containerSize="wide">
        <SectionHeading
          eyebrow="The catalog"
          title="What we carry."
          intro="Daily rates below; weekly and multi-day available. Don't see it? Ask — we add and swap constantly."
        />
        <div className="mt-12">
          <GearGrid />
        </div>
      </Section>

      <Section tone="dark" className="grain" containerSize="wide">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Mobile studio"
            title={SHOOTPOD.title}
            intro={SHOOTPOD.blurb}
          />
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
                Part of full <Link href="/productions" className="text-tungsten hover:underline">production support</Link>.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light" className="!pt-0">
        <SectionHeading eyebrow="FAQ" title="Rental questions." />
        <div className="mt-8">
          <FaqList faqs={faqsByTag("gear", "location", "booking")} />
        </div>
      </Section>

      <FinalCTA
        eyebrow="Tell us what you need"
        title="Request an estimate."
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
              "Camera, lighting, grip, and production-supply rental in Denver — pickup or Denver-metro delivery, with insurance options.",
            path: "/gear-rental",
            serviceType: "Equipment rental",
          }),
        ]}
      />
    </>
  );
}
