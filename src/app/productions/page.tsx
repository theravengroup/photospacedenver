import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { EstimateCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { serviceBySlug } from "@/lib/content/service-pages";
import { SHOOTPOD } from "@/lib/content/gear-data";
import { usd } from "@/lib/content/pricing-data";

export const metadata = pageMeta({
  title: "Production Support in Denver — PhotoSpace",
  description:
    "Full-service production support in Denver — crew, talent, logistics, gear and transport, insurance, on-set workflow, plus the ShootPod mobile studio. We run the day.",
  path: "/productions",
  keywords: ["production studio Denver", "production support Denver", "production company Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Productions", path: "/productions" },
];

const caps = serviceBySlug("production-management")?.includes ?? [];

export default function ProductionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Productions"
        title="Serious productions happen here."
        lede="From a content day to a multi-day campaign — we coordinate the moving pieces so you stay focused on the work and the client."
        breadcrumbs={breadcrumbs}
      >
        <EstimateCTA page="productions" location="hero" />
      </PageHero>

      <Section tone="light" containerSize="wide">
        <SectionHeading eyebrow="What we run" title="The day, handled." />
        <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {caps.map((c) => (
            <div key={c.heading} className="border-t border-hairline pt-4">
              <h2 className="font-medium">{c.heading}</h2>
              <p className="mt-2 text-sm text-muted">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">
          Explore individual <Link href="/services" className="text-tungsten hover:underline">production services</Link> &mdash;
          location scouting, drone, camera cleaning, and retouching.
        </p>
      </Section>

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
                <EstimateCTA page="productions" location="shootpod" label="Reserve the ShootPod" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <FinalCTA eyebrow="Let's plan it" title="Tell us about the production." body="Send the brief and dates — we'll scope crew, gear, and logistics and send a written estimate.">
        <EstimateCTA page="productions" location="final" size="lg" />
      </FinalCTA>

      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          serviceSchema({
            name: "Production support",
            description: "Full-service production support in Denver — crew, logistics, gear, transport, insurance, and on-set workflow.",
            path: "/productions",
            serviceType: "Production services",
          }),
        ]}
      />
    </>
  );
}
