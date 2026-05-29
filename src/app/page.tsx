import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ClientLogoWall } from "@/components/sections/ClientLogoWall";
import { PricingCards } from "@/components/sections/PricingCards";
import { MembershipCards } from "@/components/sections/MembershipCards";
import { Testimonials } from "@/components/sections/Testimonials";
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


export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Section tone="dark" className="grain pt-32 sm:pt-44" containerSize="wide">
        <Reveal>
          <p className="eyebrow">Denver, Colorado · Est. {SITE.foundedYear}</p>
          <h1 className="font-display mt-5 tracking-tight leading-[1.03] text-[clamp(1.55rem,7.5vw,5.5rem)]">
            A studio for shooting here.<br />Gear for shooting anywhere.
          </h1>
          <p className="mt-8 leading-[1.35] text-muted text-[clamp(1rem,2.5vw,1.5rem)]">
            Since {SITE.foundedYear}, <strong className="font-semibold text-bone">photospace</strong> has
            given Denver creatives two things worth having:<br />a studio worth shooting in, and pro gear worth taking on the road.
          </p>
        </Reveal>

        {/* Two services — studio (shoot here) vs. gear (take anywhere) */}
        <Reveal delay={0.1} className="mt-12 grid gap-5 lg:grid-cols-2">

          {/* 01 — Studio Rental: shoot HERE, at this address */}
          <div className="group flex flex-col overflow-hidden rounded-card border border-hairline bg-bone/[0.04] transition-colors hover:border-tungsten/40">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/space/stage.jpg"
                alt="photospace shooting floor — 1,900 ft² with real cyclorama and grip wall"
                fill
                priority
                className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-[1.04]"
                sizes="(min-width: 1024px) 44vw, 100vw"
              />
              {/* Location badge — reinforces "this address" */}
              <span className="absolute left-5 top-4 flex items-center gap-1.5 rounded-full bg-bone px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink shadow-lg">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="shrink-0 text-tungsten fill-current"><circle cx="5" cy="4" r="2"/><path d="M5 1a3 3 0 0 1 3 3c0 2-3 5.5-3 5.5S2 6 2 4a3 3 0 0 1 3-3z" fillRule="evenodd" clipRule="evenodd"/></svg>
                209 Kalamath St · Denver
              </span>
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-tungsten">01 · Rent the studio</p>
              <h2 className="font-display mt-2 text-display-lg">Shoot here.</h2>
              <p className="mt-3 text-muted">
                A custom-built 1,900 ft² photo &amp; video studio at 209 Kalamath St — real cyclorama,
                Colorado&rsquo;s largest in-studio grip selection, a starter lighting kit, and 24/7 access.
                From $100/hr.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted">
                <li><span className="mr-2 text-tungsten">&bull;</span>Real 20&prime;-wide cyclorama wall</li>
                <li><span className="mr-2 text-tungsten">&bull;</span>CO&rsquo;s largest in-studio grip selection — included</li>
                <li><span className="mr-2 text-tungsten">&bull;</span>Tether station · client lounge · working kitchen</li>
                <li><span className="mr-2 text-tungsten">&bull;</span>$100/hr · 2-hour minimum · same rate 24/7</li>
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                <BookingCTA page="home" location="hero-studio" />
                <Button href="/studio" variant="ghost">The studio &rarr;</Button>
              </div>
            </div>
          </div>

          {/* 02 — Gear Rental: take it anywhere, on location */}
          <div className="group flex flex-col overflow-hidden rounded-card border border-hairline bg-bone/[0.04] transition-colors hover:border-tungsten/40">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/gear/gear.jpg"
                alt="Cameras, Profoto lighting, lenses, and grip — available for on-location rental"
                fill
                priority
                className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-[1.04]"
                sizes="(min-width: 1024px) 44vw, 100vw"
              />
              {/* Location badge — reinforces "take it anywhere" */}
              <span className="absolute left-5 top-4 flex items-center gap-1.5 rounded-full bg-[var(--color-brand-green)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="shrink-0 fill-current"><path d="M1 5h8M6 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                On location · anywhere
              </span>
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-tungsten">02 · Rent the gear</p>
              <h2 className="font-display mt-2 text-display-lg">Take it anywhere.</h2>
              <p className="mt-3 text-muted">
                A deep rental inventory you pick up and take on location — cameras &amp; lenses, flash
                &amp; continuous lighting, modifiers, grip, video, audio, and production supplies.
                No studio booking required. Pickup at the shop, or we ship anywhere.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted">
                <li><span className="mr-2 text-tungsten">&bull;</span>Phase One · Canon · Nikon · Fuji · Blackmagic</li>
                <li><span className="mr-2 text-tungsten">&bull;</span>Profoto · Arri · Nanlux · Kino Flo lighting</li>
                <li><span className="mr-2 text-tungsten">&bull;</span>Video, audio &amp; production supplies</li>
                <li><span className="mr-2 text-tungsten">&bull;</span>~400 items · daily rates · pickup or delivery</li>
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                <Button href="/gear-rental">Browse all gear rental</Button>
                <EstimateCTA page="home" location="hero-gear" variant="ghost" />
              </div>
            </div>
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

      {/* ── STUDIO LANE ── space, pricing, memberships all clearly in context */}
      <Section tone="light" containerSize="wide">
        {/* The space */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Studio rental · 209 Kalamath St"
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
                alt="The photospace client lounge"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 44vw, 100vw"
              />
            </div>
          </Reveal>
        </div>

        {/* Studio rental pricing — still in the same section/context */}
        <Reveal className="mt-20 border-t border-hairline pt-16">
          <SectionHeading
            eyebrow="Studio rental · pricing"
            title="Simple pricing. Nothing hidden."
            intro="No setup fees, same rate 24/7 — no evening or weekend surcharge. A starter light and grip kit comes with the room; premium lighting, cameras, and lenses are à la carte add-ons."
          />
          <div className="mt-10">
            <PricingCards page="home" />
          </div>
          <p className="mt-6 text-sm text-muted">
            Need something different? Multi-day campaigns and member rates —{" "}
            <Link href="/studio-pricing" className="text-tungsten hover:underline">see full pricing</Link>.
          </p>
        </Reveal>

        {/* Studio memberships — still in the same section/context */}
        <Reveal className="mt-20 border-t border-hairline pt-16">
          <SectionHeading
            eyebrow="Studio rental · memberships"
            title="Create more. Pay less."
            intro="Three studio membership levels, designed around how you actually shoot — recurring access at member rates plus discounted gear add-ons. Studio access only; gear rental is separate."
          />
          <div className="mt-10">
            <MembershipCards page="home" />
          </div>
        </Reveal>
      </Section>

      {/* ── GEAR LANE ── clearly separated from the studio content above */}
      <Section tone="dark" className="grain" containerSize="wide">
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
              eyebrow="Gear rental · take it anywhere"
              title="Gear from all the top brands."
              intro="A deep rental inventory — cameras & lenses, flash & continuous lighting, modifiers, grip, video, audio, and production supplies. Pick up at the shop or we ship anywhere. No studio booking required."
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

      {/* Testimonials */}
      <Section tone="light" containerSize="wide">
        <SectionHeading eyebrow="From the floor" title="What creators say." />
        <div className="mt-10">
          <Testimonials items={TESTIMONIALS.slice(0, 3)} />
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
