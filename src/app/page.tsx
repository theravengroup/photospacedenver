import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ClientLogoWall } from "@/components/sections/ClientLogoWall";
import { UseCaseGrid } from "@/components/sections/UseCaseGrid";
import { PricingCards } from "@/components/sections/PricingCards";
import { MembershipCards } from "@/components/sections/MembershipCards";
import { Testimonials } from "@/components/sections/Testimonials";
import { Steps } from "@/components/sections/Steps";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FaqList } from "@/components/sections/FaqList";
import { BookingCTA, TourCTA, MembershipCTA, EstimateCTA } from "@/components/cta/Ctas";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/content/site-config";
import { STUDIO } from "@/lib/content/studio-data";
import { TESTIMONIALS } from "@/lib/content/testimonials";
import { faqsByTag } from "@/lib/content/faqs";

const PILLARS = [
  { label: "Studio Rental", href: "/studio", blurb: "1,900 ft² floor, real cyclorama, lighting & grip included — by the hour or the day." },
  { label: "Memberships", href: "/memberships", blurb: "Recurring studio access at member rates, built for how you actually shoot." },
  { label: "Gear Rental", href: "/gear-rental", blurb: "Cameras, lighting, and grip — Profoto, Phase One, Arri, and more, on location." },
  { label: "Podcast & Interview", href: "/podcast-studio-denver", blurb: "Sound-dampened, multi-camera-ready sets with a comfortable guest lounge." },
  { label: "Production Services", href: "/productions", blurb: "Scouting, management, drone, and on-set support — the day, run for you." },
];

const HERO_STATS = [
  { value: "2,400 ft²", label: "Purpose-built" },
  { value: "$100/hr", label: "2-hour minimum" },
  { value: "24/7", label: "Studio access" },
  { value: `Since ${SITE.foundedYear}`, label: "Denver-run" },
];

const HOME_STEPS = [
  { title: "Book or apply", body: "Reserve a session, request an estimate, or apply for a membership — each takes about a minute." },
  { title: "Walk in and shoot", body: "Grip, lighting, and the tether station are ready. Be set up and shooting within fifteen minutes." },
  { title: "Do it again", body: "Save your kit, refine your looks, and build a creative habit that pays off on a membership." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Section tone="dark" className="grain pt-32 sm:pt-44" containerSize="wide">
        <Reveal>
          <p className="eyebrow">Denver, Colorado · Est. {SITE.foundedYear}</p>
          <h1 className="font-display mt-5 max-w-[15ch] text-display-2xl">
            Denver&rsquo;s creative production hub.
          </h1>
          <p className="measure mt-6 text-lg text-muted">
            A real working studio built by production professionals — 1,900 ft² of controllable
            light, a real cyclorama, pro lighting and grip included. Plus gear rental, memberships,
            and production services under one roof.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <BookingCTA page="home" location="hero" size="lg" />
            <TourCTA page="home" location="hero" size="lg" />
            <MembershipCTA page="home" location="hero" variant="ghost" size="lg" />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-hairline pt-8 sm:grid-cols-4">
            {HERO_STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-display-md">{s.value}</dt>
                <dd className="mt-1 text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* Trusted by */}
      <Section tone="dark" className="border-t border-hairline !py-10" container={false}>
        <p className="mb-6 text-center text-xs uppercase tracking-[0.18em] text-muted">
          Trusted by top creators in Denver &amp; beyond
        </p>
        <ClientLogoWall />
      </Section>

      {/* Pillars */}
      <Section tone="light" containerSize="wide">
        <SectionHeading eyebrow="What we do" title="Five ways to work here." />
        <div className="mt-10 grid gap-px overflow-hidden rounded-card border border-hairline bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <Link key={p.href} href={p.href} className="group bg-panel p-7">
              <h3 className="font-display text-display-md transition-colors group-hover:text-tungsten">{p.label}</h3>
              <p className="mt-2 text-sm text-muted">{p.blurb}</p>
              <span className="mt-4 inline-block text-sm text-tungsten opacity-0 transition-opacity group-hover:opacity-100">
                Explore &rarr;
              </span>
            </Link>
          ))}
          <div className="flex flex-col justify-center gap-3 bg-panel p-7">
            <p className="text-sm text-muted">Not sure where to start? Walk the space first.</p>
            <TourCTA page="home" location="pillars" variant="outline" size="sm" />
          </div>
        </div>
      </Section>

      {/* Studio highlight */}
      <Section tone="dark" className="grain" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="The studio"
              title="This is not a converted warehouse."
              intro="Custom-built from the ground up by photographers and videographers — designed to capture your best work with unmatched comfort and creative flexibility."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/studio" variant="outline">Tour the studio</Button>
              <BookingCTA page="home" location="studio-highlight" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
              {STUDIO.included.map((item) => (
                <li key={item} className="border-t border-hairline pt-3 text-sm">{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Built for the work */}
      <Section tone="light" containerSize="wide">
        <SectionHeading
          eyebrow="Built for the work"
          title="Your vision, unlimited."
          intro="From a 30-minute headshot to a three-day campaign — if you can imagine it, the studio scales to fit. A few of the formats that walk in most:"
        />
        <div className="mt-10">
          <UseCaseGrid />
        </div>
      </Section>

      {/* Pricing teaser */}
      <Section tone="dark" className="grain" containerSize="wide">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing. Nothing hidden."
          intro="No setup fees. No equipment surcharges. The number you see is the number you pay."
        />
        <div className="mt-10">
          <PricingCards page="home" />
        </div>
        <p className="mt-6 text-sm text-muted">
          Need something different? Multi-day campaigns and member rates —{" "}
          <Link href="/pricing" className="text-tungsten hover:underline">see full pricing</Link>.
        </p>
      </Section>

      {/* Memberships teaser */}
      <Section tone="light" containerSize="wide">
        <SectionHeading
          eyebrow="Memberships"
          title="Create more. Pay less."
          intro="Three commitment levels, designed around how you actually shoot — recurring access at member rates plus discounted add-ons."
        />
        <div className="mt-10">
          <MembershipCards page="home" />
        </div>
      </Section>

      {/* Testimonials */}
      <Section tone="dark" containerSize="wide">
        <SectionHeading eyebrow="From the floor" title="What creators say." />
        <div className="mt-10">
          <Testimonials items={TESTIMONIALS.slice(0, 3)} />
        </div>
      </Section>

      {/* How it works */}
      <Section tone="light" containerSize="wide">
        <SectionHeading eyebrow="How it works" title="Three steps from click to created." />
        <div className="mt-10">
          <Steps steps={HOME_STEPS} />
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="light" containerSize="default" className="!pt-0">
        <SectionHeading eyebrow="FAQ" title="Questions, answered." />
        <div className="mt-8">
          <FaqList faqs={faqsByTag("booking", "studio", "pricing").slice(0, 6)} />
        </div>
      </Section>

      {/* Final CTA */}
      <FinalCTA
        eyebrow="The studio is open"
        title="Pick a day. Make the work."
        body="The lights are on. The cyc is clean. Reserve your time and walk in ready — or request an estimate for gear and production."
      >
        <BookingCTA page="home" location="final" size="lg" />
        <EstimateCTA page="home" location="final" variant="outline" size="lg" />
      </FinalCTA>
    </>
  );
}
