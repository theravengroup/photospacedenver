import { NextResponse, type NextRequest } from "next/server";
import { CANONICAL_DOMAIN } from "@/lib/content/site-config";
import { LEGACY_HOST, legacyDestination } from "@/lib/content/redirect-map";

/**
 * Legacy-domain consolidation: 301 every request on photospace.studio (and
 * www) to the mapped path on the canonical photospacedenver.com domain.
 * Path-level redirects within the canonical domain are handled in next.config.
 *
 * (Next 16 "proxy" convention — the renamed successor to middleware.)
 */
export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];

  if (LEGACY_HOST.includes(host)) {
    const destination = legacyDestination(req.nextUrl.pathname);
    return NextResponse.redirect(new URL(destination, CANONICAL_DOMAIN), 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on page requests; skip Next internals and static asset files.
  matcher: ["/((?!_next/|favicon.ico|robots.txt|sitemap.xml|.*\\.[a-zA-Z0-9]+$).*)"],
};
