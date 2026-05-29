import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { SpecList } from "@/components/sections/SpecList";
import { IncludedGrid } from "@/components/sections/IncludedGrid";
import { UseCaseGrid } from "@/components/sections/UseCaseGrid";
import { StudioFrames } from "@/components/sections/StudioFrames";
import { Testimonials } from "@/components/sections/Testimonials";
import { ShotHereGallery } from "@/components/sections/ShotHereGallery";
import { FaqList } from "@/components/sections/FaqList";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { BookingCTA, TourCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { STUDIO } from "@/lib/content/studio-data";
import { getShotArchive } from "@/lib/content/shot-archive";
import { TESTIMONIALS } from "@/lib/content/testimonials";
import { faqsByTag } from "@/lib/content/faqs";

export const metadata = pageMeta({
  title: "Photo & Video Studio Rental in Denver — photospace",
  description:
    "Rent photospace Denver's 1,900 ft² studio — a real cyclorama, a starter light & grip kit, a calibrated tether station, and 24/7 access. From $100/hr.",
  path: "/studio",
  keywords: ["studio rental Denver", "photo studio Denver", "video studio Denver", "cyclorama studio Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Studio", path: "/studio" },
];

const ARCHIVE = getShotArchive();

export default function StudioPage() {
  return (
    <>
      <PageHero
        image="/images/space/stage.jpg"
        eyebrow="The Studio"
        title="Where creativity finds its space."
        lede="A custom-built photo & video studio in Denver's Sun Valley since 2008 — 1,900 ft² of controllable light, a real cyclorama, a starter light and grip kit, a calibrated tether station, and 24/7 access."
        breadcrumbs={breadcrumbs}
      >
        <BookingCTA page="studio" location="hero" />
        <TourCTA page="studio" location="hero" />
      </PageHero>

      {/* A Denver original */}
      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="A Denver original"
            title="This is not a converted warehouse."
            intro="photospace was custom-built from the ground up by working photographers and videographers — designed to capture your best work with unmatched comfort and creative flexibility. A real cyclorama, controllable daylight, and the power to run a serious set."
          />
          <SpecList items={STUDIO.specs} />
        </div>
      </Section>

      {/* Inside the studio — four frames */}
      <StudioFrames />

      {/* Included + add-ons */}
      <Section tone="light" containerSize="wide">
        <SectionHeading
          eyebrow="Included with every rental"
          title="Walk in ready."
          intro="A starter light and grip kit comes with the room — no setup fees, the same rate 24/7. Here's what's in the box."
        />
        <div className="mt-10">
          <IncludedGrid items={STUDIO.included} columns={2} />
        </div>
        <div className="mt-12 rounded-card border border-hairline p-7">
          <h3 className="text-sm uppercase tracking-[0.14em] text-tungsten">Available as add-ons</h3>
          <p className="mt-2 text-sm text-muted">
            À la carte from the on-site gear house — discounted for members. Premium lighting, modifiers,
            cameras, and lenses are not included with the room.
          </p>
          <ul className="mt-4 grid gap-x-10 gap-y-2 sm:grid-cols-2">
            {STUDIO.addOns.map((a) => (
              <li key={a} className="border-t border-hairline pt-2 text-sm">{a}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm">
            <Link href="/gear-rental" className="text-tungsten hover:underline">Browse gear rental &rarr;</Link>
          </p>
        </div>
      </Section>

      {/* Step inside — amenities */}
      <Section tone="light" className="!pt-0" containerSize="wide">
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

      {/* Built for the work */}
      <Section tone="dark" containerSize="wide">
        <SectionHeading
          eyebrow="Built for the work"
          title="From a 30-minute headshot to a three-day campaign."
          intro="If you can imagine it, the studio scales to fit. A few of the formats that walk in most:"
        />
        <div className="mt-10">
          <UseCaseGrid />
        </div>
      </Section>

      {/* From the archive — shot here */}
      <ShotHereGallery shots={ARCHIVE} />

      {/* Testimonials */}
      <Section tone="dark" containerSize="wide">
        <SectionHeading eyebrow="From the floor" title="What creators say." />
        <div className="mt-10">
          <Testimonials items={TESTIMONIALS.slice(0, 6)} />
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="light">
        <SectionHeading eyebrow="FAQ" title="Studio questions, answered." />
        <div className="mt-8">
          <FaqList faqs={faqsByTag("studio", "booking", "video")} />
        </div>
      </Section>

      <FinalCTA
        eyebrow="The studio is open"
        title="Pick a day. Make the work."
        body="The lights are on. The cyc is clean. The espresso is hot. Reserve your time and walk in ready — or come by for a free 20-minute tour first."
      >
        <BookingCTA page="studio" location="final" size="lg" />
        <TourCTA page="studio" location="final" variant="ghost" size="lg" />
      </FinalCTA>

      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          serviceSchema({
            name: "Photo & video studio rental",
            description:
              "Hourly, half-day, and full-day photo and video studio rental in Denver with a real cyclorama and a starter light and grip kit included.",
            path: "/studio",
            serviceType: "Studio rental",
          }),
        ]}
      />
    </>
  );
}
