/**
 * 301 redirect map. Single source of truth consumed by:
 *  - next.config.ts  → path-level redirects on photospacedenver.com
 *  - middleware.ts    → host-level redirects for the legacy photospace.studio domain
 *  - redirect regression checks (Phase 5)
 *
 * `from` is written WITHOUT a trailing slash; next.config expands each into
 * both slashed and unslashed sources so indexed WP URLs (which used trailing
 * slashes) and bare paths both resolve.
 */

export type Redirect = { from: string; to: string };

/** Old WordPress (photospacedenver.com) → new routes. All 301 permanent. */
export const REDIRECTS: Redirect[] = [
  // Studio
  { from: "/studio", to: "/studio" },
  { from: "/studio-guide", to: "/studio-facts" },
  { from: "/location", to: "/contact" },
  { from: "/lifespace", to: "/content-creator-studio-denver" }, // TODO(confirm)

  // Gear
  { from: "/gear", to: "/gear-rental" },
  { from: "/gear/cameras-lenses", to: "/gear-rental#cameras" },
  { from: "/gear/flash-lighting", to: "/gear-rental#flash" },
  { from: "/gear/continuous-lighting", to: "/gear-rental#continuous" },
  { from: "/gear/lighting-modifiers", to: "/gear-rental#modifiers" },
  { from: "/gear/grip", to: "/gear-rental#grip" },
  { from: "/gear/production-supplies", to: "/gear-rental#production-supplies" },
  { from: "/gear/photo-and-video-accessories", to: "/gear-rental#accessories" },
  { from: "/shootpod", to: "/productions" },

  // Services
  { from: "/services", to: "/services" },
  { from: "/location-scouting", to: "/services/location-scouting" },
  { from: "/production-management", to: "/services/production-management" },
  { from: "/camera-cleaning", to: "/services/camera-cleaning" },
  { from: "/drone-services", to: "/services/drone-services" },
  { from: "/retouching", to: "/services/retouching" },
  { from: "/resources", to: "/productions" },

  // Memberships
  { from: "/memberships", to: "/memberships" },
  { from: "/membership-payment", to: "/memberships" },
  { from: "/membership-conversation", to: "/memberships" },
  { from: "/join", to: "/about" }, // crew recruitment — NOT membership

  // Booking / estimate / account
  { from: "/how-to-rent", to: "/book" },
  { from: "/book-online", to: "/book" },
  { from: "/estimate", to: "/request-estimate" },
  { from: "/request-estimate", to: "/request-estimate" },
  { from: "/booking", to: "/request-estimate" },
  { from: "/register", to: "/book" }, // TODO(confirm): account flow
  { from: "/registration-conversation", to: "/book" },
  { from: "/registered", to: "/thank-you" },
  { from: "/update-information", to: "/contact" },

  // Policies / legal (anchors handled on /policies)
  { from: "/policies", to: "/policies" },
  { from: "/insurance", to: "/policies#insurance" },
  { from: "/no-insurance", to: "/policies#insurance" },
  { from: "/liability-waiver", to: "/policies#liability" },
  { from: "/privacy-statement-us", to: "/policies#privacy" },
  { from: "/disclaimer", to: "/policies#disclaimer" },
  { from: "/imprint", to: "/policies" },

  // About / internship
  { from: "/internship", to: "/about" },

  // Low-value / stale (301 to nearest relevant; 410 optional later)
  { from: "/workshops", to: "/services" },
  { from: "/workshop", to: "/" },
  { from: "/workshop-casting", to: "/" },
  { from: "/blog", to: "/" },
  { from: "/mj-test", to: "/" },
  { from: "/sitemap", to: "/" },
  { from: "/opt-out-preferences", to: "/" },
];

/**
 * Legacy domain (photospace.studio) host redirects → photospacedenver.com.
 * Matched in middleware by request host. Unlisted paths fall back to "/".
 */
export const LEGACY_HOST = ["photospace.studio", "www.photospace.studio"];

export const LEGACY_PATH_MAP: Record<string, string> = {
  "/": "/studio",
  "/apply": "/memberships",
  "/membership-application-photospace": "/memberships",
};

export function legacyDestination(pathname: string): string {
  return LEGACY_PATH_MAP[pathname] ?? "/";
}
