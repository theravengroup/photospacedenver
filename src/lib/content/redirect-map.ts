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
  { from: "/pricing", to: "/studio-pricing" },
  { from: "/studio-guide", to: "/studio-facts" },
  { from: "/location", to: "/contact" },
  { from: "/lifespace", to: "/content-creator-studio-denver" }, // TODO(confirm)

  // Native booking system renamed 2026-05-30: /book-native → /book-studio
  // Keep these redirects so old confirmation/management email links work.
  { from: "/book-native", to: "/book-studio" },
  { from: "/book-native/success", to: "/book-studio/success" },

  // Gear (legacy /gear/<x> + old anchors → new SEO category pages)
  { from: "/gear", to: "/gear-rental" },
  { from: "/gear/cameras-lenses", to: "/camera-lens-rental-denver" },
  { from: "/gear/flash-lighting", to: "/flash-strobe-rental-denver" },
  { from: "/gear/continuous-lighting", to: "/continuous-lighting-rental-denver" },
  { from: "/gear/lighting-modifiers", to: "/lighting-modifier-rental-denver" },
  { from: "/gear/grip", to: "/grip-equipment-rental-denver" },
  { from: "/gear/production-supplies", to: "/production-supply-rental-denver" },
  { from: "/gear/photo-and-video-accessories", to: "/photo-video-accessory-rental-denver" },
  { from: "/shootpod", to: "/gear-rental" },

  // Production services (retired — focus is studio + gear)
  { from: "/productions", to: "/gear-rental" },
  { from: "/services", to: "/gear-rental" },
  { from: "/location-scouting", to: "/" },
  { from: "/production-management", to: "/" },
  { from: "/camera-cleaning", to: "/gear-rental" },
  { from: "/drone-services", to: "/" },
  { from: "/retouching", to: "/" },
  { from: "/resources", to: "/" },

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
  { from: "/registration-conversation", to: "/register" },
  { from: "/registered", to: "/register" },
  { from: "/update-information", to: "/contact" },
  { from: "/submit-coi", to: "/insurance" },

  // Policies / legal (anchors handled on /policies)
  { from: "/policies", to: "/policies" },
  { from: "/liability-waiver", to: "/policies#liability" },
  { from: "/privacy-statement-us", to: "/policies#privacy" },
  { from: "/disclaimer", to: "/policies#disclaimer" },
  { from: "/imprint", to: "/policies" },

  // About / internship
  { from: "/internship", to: "/about" },

  // Low-value / stale (301 to nearest relevant; 410 optional later)
  { from: "/workshops", to: "/" },
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
