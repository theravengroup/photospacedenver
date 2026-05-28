import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FaqList } from "@/components/sections/FaqList";
import { RelatedPages } from "@/components/sections/RelatedPages";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { BookingCTA, TourCTA, EstimateCTA, MembershipCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { SEO_SLUGS, seoPageBySlug, type SeoCta, type SeoLanding } from "@/lib/content/seo-pages";
import {
  GEAR_CATEGORIES,
  GEAR_SEO_SLUGS,
  gearCategoryBySeoSlug,
  type GearCategory,
  type GearItem,
} from "@/lib/content/gear-data";
import { usd } from "@/lib/content/pricing-data";
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

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.h1} lede={page.lede} breadcrumbs={breadcrumbs}>
        <PrimaryCta kind={page.primaryCta} page={slug} />
        {page.primaryCta !== "tour" && <TourCTA page={slug} location="hero" variant="outline" />}
      </PageHero>

      <Section tone="light" containerSize="wide">
        <p className="measure text-lg">{page.intro}</p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {page.highlights.map((h) => (
            <span key={h} className="text-sm">
              <span className="mr-2 text-tungsten">&bull;</span>{h}
            </span>
          ))}
        </div>
      </Section>

      <Section tone="dark" className="grain" containerSize="wide">
        <div className="grid gap-x-16 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {page.sections.map((s) => (
            <Reveal key={s.heading} className="border-t border-hairline pt-5">
              <h2 className="font-display text-display-md">{s.heading}</h2>
              <p className="mt-3 text-muted">{s.body}</p>
            </Reveal>
          ))}
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
        {page.primaryCta !== "tour" && <TourCTA page={slug} location="final" variant="outline" size="lg" />}
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

function rate(item: GearItem): string {
  if (item.price == null) return "Inquire";
  return `${usd(item.price)}${item.unit ?? "/day"}`;
}

function GearCategoryView({ c }: { c: GearCategory }) {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Gear Rental", path: "/gear-rental" },
    { name: c.title, path: `/${c.seoSlug}` },
  ];

  const related = GEAR_CATEGORIES.filter((x) => x.seoSlug !== c.seoSlug).map((x) => ({
    label: x.title,
    href: `/${x.seoSlug}`,
    blurb: x.blurb,
  }));

  const faqs = faqsByTag("gear", "location", "booking").slice(0, 6);

  return (
    <>
      <PageHero eyebrow="Gear Rental" title={`${c.title} rental in Denver`} lede={c.blurb} breadcrumbs={breadcrumbs}>
        <EstimateCTA page={`gear-${c.slug}`} location="hero" />
        <Button href="/gear-rental" variant="outline">All gear rental</Button>
      </PageHero>

      <Section tone="light" containerSize="wide">
        <p className="measure text-lg">{c.intro ?? c.blurb}</p>
        {c.brands.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {c.brands.map((b) => (
              <span key={b} className="text-sm text-muted">
                <span className="mr-2 text-tungsten">&bull;</span>{b}
              </span>
            ))}
          </div>
        )}
      </Section>

      <Section tone="dark" className="grain" containerSize="wide">
        <SectionHeading
          eyebrow="The catalog"
          title="What we carry."
          intro="Daily rates below; weekly and multi-day available. Don't see it? Ask — we add and swap constantly."
        />
        <ul className="mt-10 border-t border-hairline">
          {c.items.map((item) => (
            <li key={item.name} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline py-4">
              <div className="min-w-0">
                <span className="text-base">{item.name}</span>
                {item.brand && <span className="ml-2 text-xs uppercase tracking-[0.14em] text-muted">{item.brand}</span>}
                {item.note && <p className="mt-0.5 text-sm text-muted">{item.note}</p>}
              </div>
              <span className="shrink-0 font-display text-lg">{rate(item)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          First-time on-location renters set up a rental account once.{" "}
          <Link href="/request-estimate" className="text-tungsten hover:underline">Request a quote</Link> with your list and dates.
        </p>
      </Section>

      {faqs.length > 0 && (
        <Section tone="light" containerSize="default">
          <SectionHeading eyebrow="FAQ" title="Rental questions." />
          <div className="mt-8">
            <FaqList faqs={faqs} />
          </div>
        </Section>
      )}

      <Section tone="light" className="!pt-0" containerSize="wide">
        <SectionHeading eyebrow="More gear" title="Browse the rest of the kit." />
        <div className="mt-8">
          <RelatedPages items={related} />
        </div>
      </Section>

      <FinalCTA
        eyebrow="Tell us what you need"
        title="Request a quote."
        body="Send your gear list and dates — we'll check availability and send a written quote, usually same business day."
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
