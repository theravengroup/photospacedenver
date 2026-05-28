import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FaqList } from "@/components/sections/FaqList";
import { RelatedPages } from "@/components/sections/RelatedPages";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { EstimateCTA } from "@/components/cta/Ctas";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { SERVICES, serviceBySlug } from "@/lib/content/service-pages";
import { SERVICE_PRICING, usd } from "@/lib/content/pricing-data";
import { SITE } from "@/lib/content/site-config";
import { faqsByTag } from "@/lib/content/faqs";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const svc = serviceBySlug(slug);
  if (!svc) return {};
  return pageMeta({
    title: `${svc.seo.title} — PhotoSpace`,
    description: svc.seo.description,
    path: `/services/${slug}`,
    keywords: svc.seo.keywords,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = serviceBySlug(slug);
  if (!svc) notFound();

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: svc.title, path: `/services/${slug}` },
  ];

  const related = svc.related
    .map((s) => serviceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: `/services/${s.slug}`, blurb: s.lede }));

  const pricing =
    svc.pricingKey === "cameraCleaning"
      ? SERVICE_PRICING.cameraCleaning
      : svc.pricingKey === "drone"
        ? SERVICE_PRICING.drone
        : null;

  const faqs = faqsByTag(...svc.faqTags).slice(0, 5);

  return (
    <>
      <PageHero eyebrow={svc.eyebrow} title={svc.h1} lede={svc.lede} breadcrumbs={breadcrumbs}>
        <EstimateCTA page={`service-${slug}`} location="hero" />
        <Button href={SITE.contact.phoneHref} variant="outline">Call {SITE.contact.phone}</Button>
      </PageHero>

      <Section tone="light" containerSize="wide">
        <p className="measure text-lg">{svc.intro}</p>
        <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {svc.includes.map((inc) => (
            <div key={inc.heading} className="border-t border-hairline pt-4">
              <h2 className="font-medium">{inc.heading}</h2>
              <p className="mt-2 text-sm text-muted">{inc.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {pricing && (
        <Section tone="dark" className="grain" containerSize="wide">
          <SectionHeading eyebrow="Pricing" title="What it costs." />
          <ul className="mt-8 max-w-2xl border-t border-hairline">
            {pricing.map((row) => (
              <li key={row.name} className="flex items-baseline justify-between gap-4 border-b border-hairline py-3">
                <span>{row.name}</span>
                <span className="text-sm text-muted">{usd(row.price)}{row.unit ?? ""}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {faqs.length > 0 && (
        <Section tone="light" containerSize="default">
          <SectionHeading eyebrow="FAQ" title="Good to know." />
          <div className="mt-8">
            <FaqList faqs={faqs} />
          </div>
        </Section>
      )}

      {related.length > 0 && (
        <Section tone="light" className="!pt-0" containerSize="wide">
          <SectionHeading eyebrow="Related" title="More production services." />
          <div className="mt-8">
            <RelatedPages items={related} />
          </div>
        </Section>
      )}

      <FinalCTA eyebrow="Let's plan it" title="Request an estimate." body="Send your brief and dates — we'll scope it and send a written quote.">
        <EstimateCTA page={`service-${slug}`} location="final" size="lg" />
      </FinalCTA>

      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          serviceSchema({ name: svc.title, description: svc.seo.description, path: `/services/${slug}`, serviceType: svc.title }),
        ]}
      />
    </>
  );
}
