import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { SpecList } from "@/components/sections/SpecList";
import { IncludedGrid } from "@/components/sections/IncludedGrid";
import { StudioFrames } from "@/components/sections/StudioFrames";
import { ShotHereGallery } from "@/components/sections/ShotHereGallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqList } from "@/components/sections/FaqList";
import { RelatedPages } from "@/components/sections/RelatedPages";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { BookingCTA, TourCTA, EstimateCTA, MembershipCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { STUDIO } from "@/lib/content/studio-data";
import { getShotArchive } from "@/lib/content/shot-archive";
import { TESTIMONIALS } from "@/lib/content/testimonials";
import { SEO_SLUGS, seoPageBySlug, type SeoCta, type SeoLanding } from "@/lib/content/seo-pages";
import {
  GEAR_CATEGORIES,
  GEAR_SEO_SLUGS,
  RENTAL_WEEK,
  gearCategoryBySeoSlug,
  type GearCategory,
} from "@/lib/content/gear-data";
import { faqsByTag } from "@/lib/content/faqs";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...SEO_SLUGS, ...GEAR_SEO_SLUGS].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = seoPageBySlug(slug);
  if (page) {
    return pageMeta({ title: page.seo.title, description: page.seo.description, path: `/${slug}`, keywords: page.seo.keywords });
  }
  const gear = gearCategoryBySeoSlug(slug);
  if (gear?.seo) {
    return pageMeta({ title: gear.seo.title, description: gear.seo.description, path: `/${slug}`, keywords: gear.seo.keywords });
  }
  return {};
}

export default async function DynamicLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = seoPageBySlug(slug);
  if (page) return <StudioSeoView page={page} slug={slug} />;
  const gear = gearCategoryBySeoSlug(slug);
  if (gear) return <GearCategoryView c={gear} />;
  notFound();
}

/* ------------------------------- Studio SEO ------------------------------- */

function PrimaryCta({ kind, page, location = "hero", size }: { kind: SeoCta; page: string; location?: string; size?: "md" | "lg" }) {
  switch (kind) {
    case "tour":
      return <TourCTA page={page} location={location} size={size} variant="primary" />;
    case "estimate":
      return <EstimateCTA page={page} location={location} size={size} />;
    case "membership":
      return <MembershipCTA page={page} location={location} size={size} />;
    default:
      return <BookingCTA page={page} location={location} size={size} />;
  }
}

function StudioSeoView({ page, slug }: { page: SeoLanding; slug: string }) {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Studio", path: "/studio" },
    { name: page.eyebrow, path: `/${slug}` },
  ];

  const related = page.related
    .map((s) => seoPageBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ label: p.h1, href: `/${p.slug}`, blurb: p.lede }));

  const faqs = faqsByTag(...page.faqTags).slice(0, 6);
  const archive = getShotArchive();

  return (
    <>
      <PageHero image="/images/space/stage.jpg" eyebrow={page.eyebrow} title={page.h1} lede={page.lede} breadcrumbs={breadcrumbs}>
        <PrimaryCta kind={page.primaryCta} page={slug} />
        {page.primaryCta !== "tour" && <TourCTA page={slug} location="hero" variant="outline" />}
      </PageHero>

      {/* Lead — this page's unique intro + highlights, with the studio at a glance */}
      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="measure text-lg">{page.intro}</p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {page.highlights.map((h) => (
                <span key={h} className="text-sm">
                  <span className="mr-2 text-tungsten">&bull;</span>{h}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-[0.14em] text-muted">The studio at a glance</h2>
            <div className="mt-4">
              <SpecList items={STUDIO.specs} />
            </div>
          </div>
        </div>
      </Section>

      {/* Inside the studio — four frames (shared with /studio) */}
      <StudioFrames />

      {/* Built for the work — this page's unique, format-specific angle */}
      <Section tone="dark" className="grain" containerSize="wide">
        <SectionHeading eyebrow={page.eyebrow} title="Built for the work." />
        <div className="mt-12 grid gap-x-16 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {page.sections.map((s) => (
            <Reveal key={s.heading} className="border-t border-hairline pt-5">
              <h3 className="font-display text-display-md">{s.heading}</h3>
              <p className="mt-3 text-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Included + add-ons (shared with /studio) */}
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

      {/* Step inside — amenities (shared with /studio) */}
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

      {/* From the archive — shot here (shared with /studio) */}
      <ShotHereGallery shots={archive} />

      {/* Testimonials (shared with /studio) */}
      <Section tone="dark" containerSize="wide">
        <SectionHeading eyebrow="From the floor" title="What creators say." />
        <div className="mt-10">
          <Testimonials items={TESTIMONIALS.slice(0, 6)} />
        </div>
      </Section>

      {faqs.length > 0 && (
        <Section tone="light" containerSize="default">
          <SectionHeading eyebrow="FAQ" title="Good to know." />
          <div className="mt-8">
            <FaqList faqs={faqs} />
          </div>
        </Section>
      )}

      <Section tone="light" className="!pt-0" containerSize="wide">
        <SectionHeading eyebrow="Keep exploring" title="Related ways to shoot here." />
        <div className="mt-8">
          <RelatedPages items={related} />
        </div>
      </Section>

      <FinalCTA eyebrow="Ready to shoot" title="Book the space — or see it first." body="Reserve a session 24/7, or come by for a free 20-minute tour.">
        <PrimaryCta kind={page.primaryCta} page={slug} location="final" size="lg" />
        {page.primaryCta !== "tour" && <TourCTA page={slug} location="final" variant="ghost" size="lg" />}
      </FinalCTA>

      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          serviceSchema({
            name: page.h1,
            description: page.seo.description,
            path: `/${slug}`,
            serviceType: "Studio rental",
          }),
        ]}
      />
    </>
  );
}

/* ------------------------------ Gear category ----------------------------- */

/** Stable anchor id from a catalog group heading (for the on-page jump menu). */
function groupId(heading: string): string {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function GearCategoryView({ c }: { c: GearCategory }) {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Gear Rental", path: "/gear-rental" },
    { name: c.title, path: `/${c.seoSlug}` },
  ];

  const related = GEAR_CATEGORIES.filter((x) => x.seoSlug !== c.seoSlug);
  const faqs = faqsByTag("gear").slice(0, 6);

  return (
    <>
      <PageHero
        image="/images/gear/gear.jpg"
        eyebrow={`Gear Rental · ${c.title}`}
        title={`${c.title} rental in Denver`}
        lede={c.intro ?? c.blurb}
        breadcrumbs={breadcrumbs}
      >
        <EstimateCTA page={`gear-${c.slug}`} location="hero" />
        <Button href="/gear-rental" variant="outline">All gear rental</Button>
      </PageHero>

      {/* On-page menu — jump to any catalog section */}
      {c.groups.length > 1 && (
        <div className="surface-light glass-light sticky top-16 z-30 border-b border-hairline sm:top-20">
          <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
            <nav
              aria-label={`${c.title} catalog sections`}
              className="flex gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {c.groups.map((g) => (
                <a
                  key={g.heading}
                  href={`#${groupId(g.heading)}`}
                  className="shrink-0 rounded-full border border-hairline px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:border-tungsten/50 hover:text-ink"
                >
                  {g.heading}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Catalog — light surface, dark readable text */}
      <Section tone="light" containerSize="wide">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-hairline pb-8">
          <div>
            <p className="eyebrow">Rental rates</p>
            <h2 className="font-display mt-2 text-display-lg">The catalog.</h2>
          </div>
          <p className="max-w-sm text-sm text-muted">
            <span className="font-semibold text-ink">{RENTAL_WEEK.statement}</span> {RENTAL_WEEK.detail}
          </p>
        </div>

        <div className="mt-14 space-y-16">
          {c.groups.map((g) => (
            <div key={g.heading} id={groupId(g.heading)} className="scroll-mt-36">
              {/* Editorial group divider */}
              <div className="mb-5 flex items-center gap-5">
                <h3 className="shrink-0 text-xs font-semibold uppercase tracking-[0.22em] text-ink">
                  {g.heading}
                </h3>
                <div className="h-px flex-1 bg-hairline" />
              </div>

              {/* Item cards — dark text on light, easy to scan */}
              <div className="grid gap-px overflow-hidden rounded-card border border-hairline bg-[var(--hairline)] sm:grid-cols-2 xl:grid-cols-3">
                {g.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start justify-between gap-4 bg-[var(--panel)] p-5 transition-colors hover:bg-[var(--color-sand)]"
                  >
                    <span className="text-sm leading-snug">{item.name}</span>
                    <span className="shrink-0 font-display text-lg font-medium text-ink">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted">
          First-time on-location renters set up a rental account once — a quick step covering insurance
          and a card hold for replacement value.{" "}
          <Link href="/request-estimate" className="text-tungsten hover:underline">
            Request a quote
          </Link>{" "}
          with your list and dates.
        </p>
      </Section>

      {/* More gear — category grid */}
      <Section tone="light" containerSize="wide">
        <SectionHeading eyebrow="More gear to rent" title="Browse by category." />
        <div className="mt-8 grid gap-px overflow-hidden rounded-card border border-hairline bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.seoSlug}
              href={`/${r.seoSlug}`}
              className="group bg-panel p-6"
            >
              <h3 className="font-display text-display-md transition-colors group-hover:text-tungsten">
                {r.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{r.blurb}</p>
              <span className="mt-4 inline-block text-sm text-tungsten opacity-0 transition-opacity group-hover:opacity-100">
                Browse &rarr;
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {faqs.length > 0 && (
        <Section tone="light" className="!pt-0" containerSize="default">
          <SectionHeading eyebrow="FAQ" title="Rental questions." />
          <div className="mt-8">
            <FaqList faqs={faqs} />
          </div>
        </Section>
      )}

      <FinalCTA
        eyebrow="Tell us what you need"
        title="Request a quote."
        body="Send your gear list and dates — we'll confirm availability and send a written quote, usually same business day."
      >
        <EstimateCTA page={`gear-${c.slug}`} location="final" size="lg" />
        <Button href="/gear-rental" variant="outline" size="lg">All gear rental</Button>
      </FinalCTA>

      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          serviceSchema({
            name: `${c.title} rental in Denver`,
            description: c.seo?.description ?? c.blurb,
            path: `/${c.seoSlug}`,
            serviceType: "Equipment rental",
          }),
        ]}
      />
    </>
  );
}
