/**
 * Single source of truth for site-wide identity, contact (NAP), navigation,
 * booking destinations, and conversion constants.
 *
 * Nothing in this file may be hard-coded elsewhere — pages and components
 * import from here so a fact changes in exactly one place.
 *
 * Facts sourced from the 2026-05-28 audit of photospacedenver.com (WordPress)
 * and photospace.studio. Items marked TODO(confirm) await owner confirmation
 * (see docs/REBUILD_PLAN.md §16).
 */

export const CANONICAL_DOMAIN = "https://photospacedenver.com";
export const LEGACY_DOMAIN = "https://photospace.studio";

export const SITE = {
  /** Brand mark / wordmark text. */
  brand: "photospace",
  /** Public-facing name. */
  name: "photospace Denver",
  /** Used in schema Organization.alternateName. */
  alternateName: "photospace Studio",
  legalName: "photospace",
  tagline: "Studio & Gear Rental in Denver",
  positioning:
    "Two ways to create in Denver: a custom-built photo & video studio for rent, and a full gear-rental house — cameras, lighting, and grip from the top brands. Since 2008.",
  foundedYear: 2008, // TODO(confirm): "20+ years" copy refers to owner experience, not company age.
  owner: "Dan Jahn",
  url: CANONICAL_DOMAIN,
  legacyUrl: LEGACY_DOMAIN,

  contact: {
    phone: "(303) 284-6057",
    phoneHref: "tel:+13032846057",
    // TODO(confirm): canonical inbox. WP used inquiries@ and contact@; studio used hello@photospace.studio.
    email: "hello@photospacedenver.com",
    emailHref: "mailto:hello@photospacedenver.com",
  },

  address: {
    line1: "209 Kalamath St, Unit 1",
    city: "Denver",
    region: "CO",
    regionName: "Colorado",
    postalCode: "80223",
    country: "US",
    /** Public-facing neighborhood label. Left empty intentionally: 209
     * Kalamath / 80223 isn't a clean fit for any of the city's named
     * neighborhoods, so we describe the location by highway + downtown
     * distance instead (see `locationNote`). Consumers should skip
     * rendering when this is empty. */
    neighborhood: "",
    /** Single-line for display. */
    full: "209 Kalamath St, Unit 1, Denver, CO 80223",
    directionsNote: "Entrance is around the corner on W 2nd Ave.",
    locationNote: "Just off I-25, minutes from downtown Denver. Free parking, load-in ramp, outdoor deck.",
    mapsHref:
      "https://www.google.com/maps/dir/?api=1&destination=209%20Kalamath%20St%2C%20Denver%2C%20CO%2080223",
  },

  /** TODO(confirm): geo sanity-check against address. From studio.studio schema. */
  geo: { lat: 39.7339, lng: -105.0096 },

  hours: {
    pickup: "Mon–Fri, 8:30am–5:30pm (by appointment)",
    studio: "24/7 studio access",
    eventVenue: "7:00am–midnight",
    /** schema openingHoursSpecification — studio bookable 24/7. */
    schema: { opens: "00:00", closes: "23:59" },
  },

  social: {
    instagram: "https://instagram.com/photospacestudio",
    instagramHandle: "@photospacestudio",
  },

  serviceAreas: [
    "Denver",
    "Boulder",
    "Aurora",
    "Lakewood",
    "Littleton",
    "Front Range Colorado",
  ],
} as const;

/**
 * Booking & conversion destinations. Studio booking + free tours run on the
 * existing Acuity scheduler; membership application is the native /apply flow;
 * payments via Stripe. (Decision: reuse existing stack — REBUILD_PLAN §16.)
 */
export const BOOKING = {
  /** Acuity scheduler (owner 20797727). Canonical short link. */
  acuityScheduler: "https://app.acuityscheduling.com/schedule/3ce2128a",
  /** Embeddable iframe src. */
  acuityEmbed:
    "https://app.acuityscheduling.com/schedule.php?owner=20797727&ref=embedded_csp",
  acuityOwnerId: "20797727",
  /** In-site membership application (info → agreement → e-signature → payment). */
  applyPath: "/memberships/apply",
  tourNote: "Free 20-minute studio tours, 7 days a week.",
  estimatePath: "/request-estimate",
  bookPath: "/book",
} as const;

/** Canonical CTA labels — use these strings, don't invent new ones. */
export const CTA_LABELS = {
  checkAvailability: "Check Availability",
  bookStudio: "Book the Studio",
  bookTour: "Book a Free Tour",
  viewMemberships: "View Memberships",
  requestEstimate: "Request a Quote",
  compareOptions: "Compare Rental Options",
  applyMembership: "Apply for Membership",
  getDirections: "Get Directions",
  call: "Call",
} as const;

/** Analytics event names (prepared; analytics installed later — REBUILD_PLAN §11). */
export const ANALYTICS_EVENTS = {
  viewPricing: "view_pricing",
  clickBookStudio: "click_book_studio",
  clickBookTour: "click_book_tour",
  clickCall: "click_call",
  clickEmail: "click_email",
  startBooking: "start_booking",
  submitBooking: "submit_booking",
  viewMemberships: "view_memberships",
  startMembershipApplication: "start_membership_application",
  submitMembershipApplication: "submit_membership_application",
  requestEstimate: "request_estimate",
  submitContactForm: "submit_contact_form",
} as const;

export type NavItem = {
  label: string;
  href: string;
  /** Short description for mega-menu / footer context. */
  blurb?: string;
  children?: NavItem[];
};

/**
 * Primary navigation — two top-level lanes: Studio · Gear (both mega-menus).
 * Memberships, Studio Pricing, and Book live under Studio (not top-level).
 * SEO landing pages (/photo-studio-rental-denver etc.) are search-only —
 * no nav or footer links; they get indexed via the sitemap.
 * Book the Studio is also surfaced as the header CTA button.
 */
export const NAV_PRIMARY: NavItem[] = [
  {
    label: "Studio",
    href: "/studio",
    blurb: "1,900 ft² shooting floor, real cyclorama, 24/7 access.",
    children: [
      { label: "Studio Pricing", href: "/studio-pricing" },
      { label: "Memberships", href: "/memberships" },
      { label: "Book the Studio", href: "/book" },
    ],
  },
  {
    label: "Gear",
    href: "/gear-rental",
    blurb: "Cameras, lighting, and grip from the top brands.",
    children: [
      { label: "Cameras & Lenses", href: "/camera-lens-rental-denver" },
      { label: "Flash Lighting", href: "/flash-strobe-rental-denver" },
      { label: "Continuous Lighting", href: "/continuous-lighting-rental-denver" },
      { label: "Lighting Modifiers", href: "/lighting-modifier-rental-denver" },
      { label: "Grip & Electrical", href: "/grip-equipment-rental-denver" },
      { label: "Photo & Video Accessories", href: "/photo-video-accessory-rental-denver" },
      { label: "Production Supplies", href: "/production-supply-rental-denver" },
    ],
  },
];

/**
 * Footer link columns. SEO landing pages are NOT linked here — they are
 * search-only pages, discoverable via sitemap, not user navigation.
 */
export const FOOTER_COLUMNS: { heading: string; links: NavItem[] }[] = [
  {
    heading: "Studio",
    links: [
      { label: "The Studio", href: "/studio" },
      { label: "Studio Pricing", href: "/studio-pricing" },
      { label: "Memberships", href: "/memberships" },
      { label: "Book the Studio", href: "/book" },
    ],
  },
  {
    heading: "Gear Rental",
    links: [
      { label: "All Gear Rental", href: "/gear-rental" },
      { label: "Cameras & Lenses", href: "/camera-lens-rental-denver" },
      { label: "Flash Lighting", href: "/flash-strobe-rental-denver" },
      { label: "Continuous Lighting", href: "/continuous-lighting-rental-denver" },
      { label: "Grip & Electrical", href: "/grip-equipment-rental-denver" },
      { label: "Request a Quote", href: "/request-estimate" },
      { label: "Rental Account", href: "/register" },
      { label: "Insurance", href: "/insurance" },
    ],
  },
  {
    heading: "Info",
    links: [
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/** Build an absolute URL on the canonical domain. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, CANONICAL_DOMAIN).toString();
}
