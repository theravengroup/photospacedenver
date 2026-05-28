/**
 * Typed JSON-LD builders. Rendered via the <JsonLd> component. Schema must
 * match visible page content. No AggregateRating / Review without a compliant,
 * verified source (see REBUILD_PLAN §9).
 */

import { SITE, absoluteUrl } from "./content/site-config";
import { STUDIO } from "./content/studio-data";
import { STUDIO_PRICING, MEMBERSHIP_TIERS, usd } from "./content/pricing-data";
import type { Faq } from "./content/faqs";

const ORG_ID = absoluteUrl("/#organization");
const BUSINESS_ID = absoluteUrl("/#business");

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: SITE.alternateName,
    legalName: SITE.legalName,
    url: SITE.url,
    email: SITE.contact.email,
    telephone: SITE.contact.phone,
    foundingDate: String(SITE.foundedYear),
    sameAs: [SITE.social.instagram],
    address: postalAddress(),
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": BUSINESS_ID,
    name: SITE.name,
    description: SITE.positioning,
    url: SITE.url,
    telephone: SITE.contact.phone,
    email: SITE.contact.email,
    foundingDate: String(SITE.foundedYear),
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Credit Card, Debit Card, ACH",
    address: postalAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    areaServed: SITE.serviceAreas.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: SITE.hours.schema.opens,
      closes: SITE.hours.schema.closes,
    },
    amenityFeature: STUDIO.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.name,
      value: true,
    })),
    makesOffer: [
      ...STUDIO_PRICING.map((t) => ({
        "@type": "Offer",
        name: `Studio rental — ${t.name}`,
        price: t.price,
        priceCurrency: "USD",
        url: absoluteUrl("/book"),
      })),
      ...MEMBERSHIP_TIERS.map((t) => ({
        "@type": "Offer",
        name: `${t.name} membership`,
        price: t.price,
        priceCurrency: "USD",
        url: absoluteUrl("/memberships"),
      })),
    ],
    parentOrganization: { "@id": ORG_ID },
  };
}

export function serviceSchema(input: { name: string; description: string; path: string; serviceType?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType ?? input.name,
    url: absoluteUrl(input.path),
    areaServed: SITE.serviceAreas.map((name) => ({ "@type": "City", name })),
    provider: { "@id": BUSINESS_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function videoObjectSchema(input: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    ...input,
  };
}

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: SITE.address.line1,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  };
}

/** Re-export for convenience in pages that show a price in copy + schema. */
export { usd };
