import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Testimonials } from "@/components/sections/Testimonials";
import { ClientLogoWall } from "@/components/sections/ClientLogoWall";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { TourCTA, BookingCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/content/site-config";
import { TESTIMONIALS } from "@/lib/content/testimonials";

export const metadata = pageMeta({
  title: "About photospace Denver — Built by Production Pros",
  description:
    "photospace has been Denver's home for professional production since 2008 — a purpose-built studio and gear house run by working photographers and videographers.",
  path: "/about",
  keywords: ["about photospace Denver", "Denver production studio", "Dan Jahn photospace"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

// TODO(confirm): "John" appears in client testimonials alongside owner Dan Jahn — confirm role before adding to team copy.
const WHY = [
  { t: "Operator-run since 2008", b: "Run by working pros who've staged shoots in Denver for over fifteen years. You talk to the people who actually answer the call." },
  { t: "Sole source for some of what we carry", b: "Medium-format Phase One and Hasselblad, Profoto Pro heads, and select grip you won't find elsewhere on the Front Range." },
  { t: "Current and clean", b: "Bodies, computing, and grip are updated continuously. Gear leaves the shop checked, charged, packed, and inventoried." },
  { t: "Local pickup and delivery", b: "No shipping waits. Pick up at the Kalamath St. shop or schedule Denver-metro delivery. Out-of-town crews — we stage on arrival." },
  { t: "Last-minute capability", b: "Productions move; we move with them. Add-ons, swaps, and after-hours by arrangement — usually a fast yes." },
  { t: "Studio and gear under one roof", b: "A fully equipped commercial studio plus the gear inside it, from a single point of contact. A real, daily option." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={`A real working studio, since ${SITE.foundedYear}.`}
        lede="photospace was custom-built from the ground up by photographers and videographers — designed to remove friction from production days, for creators and commercial teams alike."
        breadcrumbs={breadcrumbs}
      >
        <TourCTA page="about" location="hero" />
      </PageHero>

      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="The story"
            title="This is not a converted warehouse."
            intro={`Founded in ${SITE.foundedYear} and run by owner Dan Jahn, photospace is a purpose-built studio and gear house in Denver — the city's home for professional photo and video production.`}
          />
          <p className="measure text-lg text-muted">
            The idea is simple: a serious, comfortable, fully-equipped place to make great work, backed
            by people who know the work. Lighting and grip are included and maintained. The cyclorama is
            real. The kitchen actually works. And when a production needs something fast, the answer is
            usually a fast yes. Brands, agencies, and independent creators have been shooting here for
            over fifteen years.
          </p>
        </div>
      </Section>

      <Section tone="dark" className="grain" containerSize="wide">
        <SectionHeading eyebrow="Why creators choose us" title="Built for actual shoots." />
        <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.t} className="border-t border-hairline pt-4">
              <h2 className="font-medium">{w.t}</h2>
              <p className="mt-2 text-sm text-muted">{w.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="dark" className="border-t border-hairline !py-12" container={false}>
        <p className="mb-6 text-center text-xs uppercase tracking-[0.18em] text-muted">
          Shot at photospace
        </p>
        <ClientLogoWall />
      </Section>

      <Section tone="light" containerSize="wide">
        <SectionHeading eyebrow="From the floor" title="What creators say." />
        <div className="mt-10">
          <Testimonials items={TESTIMONIALS.slice(0, 6)} />
        </div>
      </Section>

      <FinalCTA eyebrow="Come see for yourself" title="Book a tour." body="Walk the space, meet the team, and see why serious productions happen here.">
        <TourCTA page="about" location="final" size="lg" />
        <BookingCTA page="about" location="final" variant="outline" size="lg" />
      </FinalCTA>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
