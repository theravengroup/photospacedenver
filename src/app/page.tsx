import Link from "next/link";
import Image from "next/image";
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
import { BookingCTA, EstimateCTA } from "@/components/cta/Ctas";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/content/site-config";
import { GEAR_BRANDS } from "@/lib/content/gear-data";
import { TESTIMONIALS } from "@/lib/content/testimonials";
import { faqsByTag } from "@/lib/content/faqs";

const HERO_STATS = [
  { value: "2,400 ft²", label: "Purpose-built studio" },
  { value: "27+ brands", label: "Gear rental house" },
  { value: "24/7", label: "Studio access" },
  { value: `Since ${SITE.foundedYear}`, label: "Denver-run" },
];

const HOME_STEPS = [
  { title: "Book or request a quote", body: "Reserve a studio session, or send a gear list and dates for a written quote — each takes about a minute." },
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
          <h1 className="font-display mt-5 max-w-[18ch] text-display-2xl">
            A studio to shoot in. The gear to shoot with.
          </h1>
          <p className="measure mt-6 text-lg text-muted">
            PhotoSpace is two things under one roof in Denver: a custom-built photo &amp; video studio
            for rent, and a full gear-rental house — cameras, lighting, and grip from the top brands.
            Both run by working pros, since {SITE.foundedYear}.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <BookingCTA page="home" location="hero" size="lg" />
            <Button href="/gear-rental" variant="outline" size="lg">Explore gear rental</Button>
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

      {/* The two lanes */}
      <Section tone="light" containerSize="wide">
        <SectionHeading
          eyebrow="Two ways to work here"
          title="Rent the space, or rent the gear."
          intro="Two equal sides of PhotoSpace — book the studio for the room, the cyc, and the light, or rent gear from the house for any shoot, anywhere in the metro."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Studio lane */}
          <Reveal className="group flex flex-col overflow-hidden rounded-card border border-hairline">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/space/stage.jpg"
                alt="PhotoSpace Denver shooting floor and cyclorama"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 44vw, 100vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-7">
              <p className="eyebrow">Rent the space</p>
              <h3 className="font-display mt-2 text-display-lg">The Studio</h3>
              <p className="mt-3 text-muted">
                1,900 ft² of controllable light with a real cyclorama, a starter light and grip kit,
                a calibrated tether station, and 24/7 access.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {["Real 20'-wide cyclorama wall", "Tether station + art-director lounge", "$100/hr · 2-hour minimum"].map((p) => (
                  <li key={p}><span className="mr-2 text-tungsten">&bull;</span>{p}</li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-7">
                <BookingCTA page="home" location="lane-studio" />
                <Button href="/studio" variant="ghost">Explore the studio &rarr;</Button>
              </div>
            </div>
          </Reveal>

          {/* Gear lane */}
          <Reveal delay={0.1} className="group flex flex-col overflow-hidden rounded-card border border-hairline">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/gear/gear.jpg"
                alt="Camera, lighting, and grip gear available for rental"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 44vw, 100vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-7">
              <p className="eyebrow">Rent the gear</p>
              <h3 className="font-display mt-2 text-display-lg">Gear Rental</h3>
              <p className="mt-3 text-muted">
                A full rental house — cameras, lighting, modifiers, and grip from Profoto, Phase One,
                Arri, and two dozen more of the top brands.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {["Medium format through cinema", "Profoto, Arri & Nanlux lighting", "Pickup or Denver-metro delivery"].map((p) => (
                  <li key={p}><span className="mr-2 text-tungsten">&bull;</span>{p}</li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-7">
                <EstimateCTA page="home" location="lane-gear" />
                <Button href="/gear-rental" variant="ghost">Browse gear &rarr;</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Studio: not a converted warehouse */}
      <Section tone="dark" className="grain" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="The studio"
              title="This is not a converted warehouse."
              intro="Custom-built from the ground up by photographers and videographers — a real cyclorama, controllable daylight, a working kitchen and lounge, and the power to run a serious set."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/studio" variant="outline">Tour the studio</Button>
              <BookingCTA page="home" location="studio-highlight" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-hairline">
              <Image
                src="/images/space/lounge.jpg"
                alt="The PhotoSpace client lounge"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 44vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Gear: the rental house + brands */}
      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal className="order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-hairline">
              <Image
                src="/images/gear/profoto-b10-plus.jpg"
                alt="Profoto lighting available for rental"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 44vw, 100vw"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="The rental house"
              title="Gear from all the top brands."
              intro="Cameras, lighting, modifiers, grip, accessories, and production supplies — by the day, picked up at the shop or delivered across the Denver metro."
            />
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {GEAR_BRANDS.slice(0, 14).map((b) => (
                <span key={b} className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{b}</span>
              ))}
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-tungsten">+ more</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/gear-rental">Browse gear rental</Button>
              <EstimateCTA page="home" location="gear-highlight" variant="ghost" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Built for the work */}
      <Section tone="light" className="!pt-0" containerSize="wide">
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
          intro="No setup fees, and the same rate 24/7 — no evening or weekend surcharge. A starter light and grip kit comes with the room; premium lighting, cameras, and lenses are à la carte add-ons."
        />
        <div className="mt-10">
          <PricingCards page="home" />
        </div>
        <p className="mt-6 text-sm text-muted">
          Need something different? Multi-day campaigns, gear, and member rates —{" "}
          <Link href="/pricing" className="text-tungsten hover:underline">see full pricing</Link>.
        </p>
      </Section>

      {/* Memberships teaser */}
      <Section tone="light" containerSize="wide">
        <SectionHeading
          eyebrow="Memberships"
          title="Create more. Pay less."
          intro="Three commitment levels, designed around how you actually shoot — recurring access at member rates plus discounted gear add-ons."
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
          <FaqList faqs={faqsByTag("booking", "studio", "gear", "pricing").slice(0, 6)} />
        </div>
      </Section>

      {/* Final CTA */}
      <FinalCTA
        eyebrow="The studio is open"
        title="Pick a day. Make the work."
        body="The lights are on, the cyc is clean, and the gear is charged. Book a session, or request a quote for gear."
      >
        <BookingCTA page="home" location="final" size="lg" />
        <EstimateCTA page="home" location="final" variant="outline" size="lg" />
      </FinalCTA>
    </>
  );
}
