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
  brand: "PhotoSpace",
  /** Public-facing name. */
  name: "PhotoSpace Denver",
  /** Used in schema Organization.alternateName. */
  alternateName: "PhotoSpace Studio",
  legalName: "PhotoSpace",
  tagline: "Denver's Creative Production Hub",
  positioning:
    "Studio rental, memberships, gear rental, podcast & interview production, and full production services — under one roof in Denver.",
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
    neighborhood: "Sun Valley",
    /** Single-line for display. */
    full: "209 Kalamath St, Unit 1, Denver, CO 80223",
    directionsNote: "Entrance is around the corner on W 2nd Ave.",
    locationNote: "In Denver's Sun Valley neighborhood — just off I-25, minutes from downtown.",
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
  bookTour: "Book a Studio Tour",
  viewMemberships: "View Memberships",
  requestEstimate: "Request an Estimate",
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

/** Primary navigation. Pillars first, Book is rendered as the header CTA. */
export const NAV_PRIMARY: NavItem[] = [
  {
    label: "Studio",
    href: "/studio",
    blurb: "1,900 ft² shooting floor, real cyclorama, gear included.",
    children: [
      { label: "The Studio", href: "/studio", blurb: "Specs, space, and what's included." },
      { label: "Photo Studio Rental", href: "/photo-studio-rental-denver" },
      { label: "Video Studio Rental", href: "/video-studio-rental-denver" },
      { label: "Cyclorama Wall", href: "/cyclorama-wall-denver" },
      { label: "Product Photography", href: "/product-photography-studio-denver" },
      { label: "Content Creator Studio", href: "/content-creator-studio-denver" },
      { label: "Commercial Photo Studio", href: "/commercial-photo-studio-denver" },
      { label: "Podcast & Interview Studio", href: "/podcast-studio-denver" },
    ],
  },
  {
    label: "Memberships",
    href: "/memberships",
    blurb: "Recurring studio access at member rates.",
  },
  {
    label: "Gear Rental",
    href: "/gear-rental",
    blurb: "Cameras, lighting, grip — Profoto, Phase One, and more.",
  },
  {
    label: "Productions",
    href: "/productions",
    blurb: "Production support, services, and the ShootPod mobile studio.",
    children: [
      { label: "Production Support", href: "/productions" },
      { label: "All Services", href: "/services" },
      { label: "Location Scouting", href: "/services/location-scouting" },
      { label: "Production Management", href: "/services/production-management" },
      { label: "Drone Services", href: "/services/drone-services" },
      { label: "Camera Cleaning", href: "/services/camera-cleaning" },
      { label: "Retouching", href: "/services/retouching" },
    ],
  },
  { label: "Pricing", href: "/pricing", blurb: "Simple pricing. Nothing hidden." },
];

/** Footer link columns. */
export const FOOTER_COLUMNS: { heading: string; links: NavItem[] }[] = [
  {
    heading: "Studio",
    links: [
      { label: "The Studio", href: "/studio" },
      { label: "Photo Studio Rental", href: "/photo-studio-rental-denver" },
      { label: "Video Studio Rental", href: "/video-studio-rental-denver" },
      { label: "Cyclorama Wall", href: "/cyclorama-wall-denver" },
      { label: "Podcast & Interview", href: "/podcast-studio-denver" },
    ],
  },
  {
    heading: "Rent",
    links: [
      { label: "Gear Rental", href: "/gear-rental" },
      { label: "Pricing", href: "/pricing" },
      { label: "Memberships", href: "/memberships" },
      { label: "Book the Studio", href: "/book" },
      { label: "Request an Estimate", href: "/request-estimate" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Productions", href: "/productions" },
      { label: "Services", href: "/services" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/** Build an absolute URL on the canonical domain. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, CANONICAL_DOMAIN).toString();
}
