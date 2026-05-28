import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { EstimateCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { SERVICES } from "@/lib/content/service-pages";

export const metadata = pageMeta({
  title: "Production Services in Denver — PhotoSpace",
  description:
    "Denver production services: location scouting, production management, drone, camera cleaning, and retouching. Full support from pre-production to final image.",
  path: "/services",
  keywords: ["production services Denver", "location scouting Denver", "drone services Denver", "camera cleaning Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Production services, start to finish."
        lede="Pre- and post-production, pristine tools, and the people to run the day — the keys to a shoot that actually goes well."
        breadcrumbs={breadcrumbs}
      >
        <EstimateCTA page="services" location="hero" />
      </PageHero>

      <Section tone="light" containerSize="wide">
        <div className="grid gap-px overflow-hidden rounded-card border border-hairline bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="group bg-panel p-7">
              <h2 className="font-display text-display-md transition-colors group-hover:text-tungsten">{s.title}</h2>
              <p className="mt-2 text-sm text-muted">{s.lede}</p>
              <span className="mt-4 inline-block text-sm text-tungsten opacity-0 transition-opacity group-hover:opacity-100">
                Learn more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <FinalCTA
        eyebrow="Let's plan it"
        title="Tell us about the shoot."
        body="Send the brief and dates — we'll scope the services you need and send a written estimate."
      >
        <EstimateCTA page="services" location="final" size="lg" />
      </FinalCTA>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
