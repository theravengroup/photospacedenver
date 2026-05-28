import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { SpecList } from "@/components/sections/SpecList";
import { IncludedGrid } from "@/components/sections/IncludedGrid";
import { UseCaseGrid } from "@/components/sections/UseCaseGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqList } from "@/components/sections/FaqList";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { BookingCTA, TourCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { STUDIO } from "@/lib/content/studio-data";
import { TESTIMONIALS } from "@/lib/content/testimonials";
import { faqsByTag } from "@/lib/content/faqs";

export const metadata = pageMeta({
  title: "Photo & Video Studio Rental in Denver — PhotoSpace",
  description:
    "Rent PhotoSpace Denver's 1,900 ft² studio — real cyclorama, Profoto lighting and grip included, tether station, and 24/7 access. $100/hr, half-day $485, full-day $925.",
  path: "/studio",
  keywords: ["studio rental Denver", "photo studio Denver", "video studio Denver", "cyclorama studio Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Studio", path: "/studio" },
];

export default function StudioPage() {
  return (
    <>
      <PageHero
        eyebrow="The Studio"
        title="A photo & video studio built for the work."
        lede="1,900 ft² of controllable light with a real cyclorama, pro lighting and grip included, a calibrated tether station, and 24/7 access — in Denver's Sun Valley."
        breadcrumbs={breadcrumbs}
      >
        <BookingCTA page="studio" location="hero" />
        <TourCTA page="studio" location="hero" />
      </PageHero>

      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="The space"
            title="This is not a converted warehouse."
            intro="Custom-built from the ground up by working photographers and videographers — a real cyclorama, controllable daylight, and the power to run a serious set."
          />
          <SpecList items={STUDIO.specs} />
        </div>
      </Section>

      <Section tone="dark" className="grain" containerSize="wide">
        <SectionHeading eyebrow="Included with every rental" title="Walk in ready." />
        <div className="mt-10">
          <IncludedGrid items={STUDIO.included} columns={2} />
        </div>
      </Section>

      <Section tone="light" containerSize="wide">
        <SectionHeading eyebrow="Step inside" title="Everything the day needs." />
        <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIO.amenities.map((a) => (
            <div key={a.name} className="border-t border-hairline pt-4">
              <h3 className="font-medium">{a.name}</h3>
              {a.detail && <p className="mt-1 text-sm text-muted">{a.detail}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section tone="dark" containerSize="wide">
        <SectionHeading
          eyebrow="Built for the work"
          title="From a 30-minute headshot to a three-day campaign."
          intro="The studio scales to fit. A few of the formats that walk in most:"
        />
        <div className="mt-10">
          <UseCaseGrid />
        </div>
      </Section>

      <Section tone="light" containerSize="wide">
        <SectionHeading eyebrow="From the floor" title="What creators say." />
        <div className="mt-10">
          <Testimonials items={TESTIMONIALS.slice(0, 6)} />
        </div>
      </Section>

      <Section tone="light" className="!pt-0">
        <SectionHeading eyebrow="FAQ" title="Studio questions, answered." />
        <div className="mt-8">
          <FaqList faqs={faqsByTag("studio", "booking", "video")} />
        </div>
      </Section>

      <FinalCTA
        eyebrow="The lights are on"
        title="Reserve your time."
        body="Book a session 24/7, or come by for a free 20-minute tour first."
      >
        <BookingCTA page="studio" location="final" size="lg" />
        <TourCTA page="studio" location="final" variant="outline" size="lg" />
      </FinalCTA>

      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          serviceSchema({
            name: "Photo & video studio rental",
            description:
              "Hourly, half-day, and full-day photo and video studio rental in Denver with a real cyclorama and pro lighting and grip included.",
            path: "/studio",
            serviceType: "Studio rental",
          }),
        ]}
      />
    </>
  );
}
