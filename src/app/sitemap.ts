import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/content/site-config";
import { SEO_SLUGS } from "@/lib/content/seo-pages";
import { SERVICES } from "@/lib/content/service-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/studio", priority: 0.9, freq: "monthly" },
    { path: "/memberships", priority: 0.9, freq: "monthly" },
    { path: "/gear-rental", priority: 0.9, freq: "monthly" },
    { path: "/pricing", priority: 0.8, freq: "monthly" },
    { path: "/book", priority: 0.8, freq: "monthly" },
    { path: "/productions", priority: 0.7, freq: "monthly" },
    { path: "/services", priority: 0.7, freq: "monthly" },
    { path: "/contact", priority: 0.7, freq: "yearly" },
    { path: "/about", priority: 0.6, freq: "yearly" },
    { path: "/faq", priority: 0.6, freq: "monthly" },
    { path: "/studio-facts", priority: 0.5, freq: "monthly" },
    { path: "/request-estimate", priority: 0.5, freq: "yearly" },
    { path: "/policies", priority: 0.3, freq: "yearly" },
  ];

  const seo = SEO_SLUGS.map((slug) => ({ path: `/${slug}`, priority: 0.8, freq: "monthly" as const }));
  const services = SERVICES.map((s) => ({ path: `/services/${s.slug}`, priority: 0.6, freq: "monthly" as const }));

  return [...core, ...seo, ...services].map(({ path, priority, freq }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));
}
