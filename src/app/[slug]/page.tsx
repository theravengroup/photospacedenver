import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FaqList } from "@/components/sections/FaqList";
import { RelatedPages } from "@/components/sections/RelatedPages";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Reveal } from "@/components/ui/Reveal";
import { BookingCTA, TourCTA, EstimateCTA, MembershipCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { SEO_SLUGS, seoPageBySlug, type SeoCta } from "@/lib/content/seo-pages";
import { faqsByTag } from "@/lib/content/faqs";

export const dynamicParams = false;

export function generateStaticParams() {
  return SEO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = seoPageBySlug(slug);
  if (!page) return {};
  return pageMeta({
    title: page.seo.title,
    description: page.seo.description,
    path: `/${slug}`,
    keywords: page.seo.keywords,
  });
}

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

export default async function SeoLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = seoPageBySlug(slug);
  if (!page) notFound();

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
        <SectionHeading eyebrow="Keep exploring" title="Related spaces & services." />
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
