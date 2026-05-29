import type { MetadataRoute } from "next";
import { CANONICAL_DOMAIN, absoluteUrl } from "@/lib/content/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: CANONICAL_DOMAIN,
  };
}
