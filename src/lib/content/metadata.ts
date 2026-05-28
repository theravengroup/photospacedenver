/**
 * Per-page metadata helper. Produces a Next.js Metadata object with a unique
 * title, description, canonical URL, and Open Graph / Twitter cards from a
 * small input. OG images come from file-based `opengraph-image` conventions.
 */

import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site-config";

export type PageMetaInput = {
  /** Complete, crafted page title (used as-is — not run through the brand template). */
  title: string;
  description: string;
  /** Route path, e.g. "/studio". Used for the canonical + og:url. */
  path: string;
  keywords?: string[];
  noindex?: boolean;
};

export function pageMeta({ title, description, path, keywords, noindex }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      title,
      description,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}
