/**
 * All pricing in one typed module. Feeds /pricing, /memberships, /studio,
 * /book, service pages, and schema makesOffer. Verbatim from the 2026-05-28
 * audits. Items marked TODO(confirm) await owner confirmation.
 */

export type PriceTier = {
  id: string;
  name: string;
  price: number;
  unit: string;
  /** e.g. "5 hours" */
  detail?: string;
  blurb?: string;
  badge?: string;
  featured?: boolean;
};

/** Headline studio rental tiers (marketed). */
export const STUDIO_PRICING: PriceTier[] = [
  {
    id: "hourly",
    name: "Hourly",
    price: 100,
    unit: "/hr",
    detail: "2-hour minimum",
    blurb: "Same rate 24/7 — no evening or weekend surcharge.",
  },
  {
    id: "half-day",
    name: "Half Day",
    price: 485,
    unit: "",
    detail: "5 hours",
    blurb: "Most booked — editorial, lookbook, and product.",
    badge: "Most booked",
    featured: true,
  },
  {
    id: "full-day",
    name: "Full Day",
    price: 925,
    unit: "",
    detail: "10 hours",
    blurb: "Full takeover for campaigns and multi-look productions.",
  },
];

/** Live Acuity booking ladder (granular). Full day caps 10–12 hrs at $925. */
export const ACUITY_LADDER: { hours: number; price: number; label?: string }[] = [
  { hours: 2, price: 200 },
  { hours: 3, price: 295 },
  { hours: 4, price: 390 },
  { hours: 5, price: 485, label: "Half day" },
  { hours: 6, price: 575 },
  { hours: 7, price: 665 },
  { hours: 8, price: 755 },
  { hours: 9, price: 840 },
  { hours: 10, price: 925, label: "Full day" },
  { hours: 11, price: 925 },
  { hours: 12, price: 925 },
];

export const TOUR = { price: 0, durationMin: 20, label: "Free studio tour" };

export type MembershipTier = {
  id: string;
  name: string;
  hoursPerMonth: number;
  price: number;
  /** Computed effective hourly (not shown on old site; surfaced per REBUILD_PLAN §12). */
  effectiveHourly: number;
  blurb: string;
  badge?: string;
  featured?: boolean;
};

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: "spark",
    name: "Spark",
    hoursPerMonth: 5,
    price: 425,
    effectiveHourly: 85,
    blurb: "Perfect for starting out. Flexible hours to ignite projects and keep a creative habit.",
  },
  {
    id: "creator",
    name: "Creator",
    hoursPerMonth: 10,
    price: 895,
    effectiveHourly: 89.5,
    blurb: "Double your creative time. Built for consistent creators and growing brands.",
    badge: "Best balance",
    featured: true,
  },
  {
    id: "visionary",
    name: "Visionary",
    hoursPerMonth: 20,
    price: 1495,
    effectiveHourly: 74.75,
    blurb: "Maximum access for ambitious professionals who need ample time and total creative freedom.",
  },
];

/** What members get on top of a standard rental. */
export const MEMBERSHIP_BENEFITS = [
  "24/7 private studio access",
  "Everything in a standard rental",
  "More Profoto strobe lighting",
  "More LED kits",
  "Tons of lighting modifiers",
  "Backdrops including chroma blue + green",
  "FX: fog & haze machines",
  "Discounted cameras, lenses & premium add-ons",
];

/**
 * Membership terms — from WP /memberships.
 * TODO(confirm): still current? (90-day minimum, auto-renew, no rollover).
 * TODO(confirm): actual member hourly rate (never published).
 */
export const MEMBERSHIP_TERMS = {
  billingCycleDays: 30,
  minimumCommitmentDays: 90,
  autoRenew: true,
  cancellationNoticeDays: 30,
  rollover: false,
  extraHourRate: 65,
  notRequiredToRent: true,
};

/** Add-on studio lighting kits (from /book-online). Profoto strobes + Chimera modifiers; Fiilex/Astra/Nanlux LED. */
export const LIGHTING_KITS = {
  strobe: [
    { name: "Strobe — Level One", label: "One light", price: 110, contents: "1× Profoto D4 2400ws pack, 1× head, lamp extension, PocketWizard, reflector, softbox" },
    { name: "Strobe — Level Two", label: "2-point lighting", price: 180, contents: "1× Profoto D4 2400ws pack, 2× heads, lamp extensions, PocketWizard, 2× reflector, 2× softbox" },
    { name: "Strobe — Level Three", label: "3-point lighting", price: 200, contents: "1× Profoto D4 2400ws pack, 3× heads, 2× lamp extension, PocketWizard, 3× reflector, 3× softbox" },
    { name: "Strobe — Level Four", label: "4-point lighting", price: 270, contents: "2× Profoto D4 2400ws packs, 4× heads, 2× lamp extension, PocketWizard, 4× reflector, 4× softbox" },
    { name: "Strobe — Pro", label: "Ultimate strobe package", price: 300, contents: "2× Profoto Pro-8a 2400ws packs (Air Remote), 4× Pro heads, 2× lamp extension, Air Remote, 4× reflector, 4× softbox, beauty dish" },
  ],
  video: [
    { name: "Video — Level One", label: "3-light LED", price: 135, contents: "3× Fiilex P360 head, 3× barndoor, 3× diffuser, 3× standard umbrella" },
    { name: "Video — Level Two", label: "Panel kit", price: 225, contents: "2× Astra LED panel, 2× Chimera softbox" },
    { name: "Video — Level Three", label: "High output", price: 375, contents: "2× Nanlux Dyno 650c" },
    { name: "Video — Pro", label: "Pro output kit", price: 575, contents: "2× Nanlux Dyno 650c, 2× Nanlux TK-280B" },
  ],
};

/** On-call studio crew — added at checkout after a time block is selected. */
export const STUDIO_CREW = [
  { name: "Digital Tech", label: "2–5 hours", price: 575, blurb: "Manages every part of a tethered shoot — Capture One, Lightroom, Phocus." },
  { name: "Digital Tech", label: "6–10 hours", price: 875, blurb: "Manages every part of a tethered shoot — Capture One, Lightroom, Phocus." },
  { name: "Grip / Light Tech", label: "6–10 hours", price: 675, blurb: "An assistant to build sets and light your shoot." },
];

/** ShootPod mobile studio + event-venue pricing. */
export const SERVICE_PRICING = {
  shootPod: {
    daily: 175,
    freeMiles: 100,
    perMileAfter: 0.55,
  },
  eventVenue: { price: 1125, unit: "/day", hours: "7:00am–midnight" },
};

/**
 * Fees & policies. TODO(confirm): card fee 3% vs 3.5%; studio "4×" vs gear "3×"
 * multi-day rule.
 */
export const FEES = {
  cardFeePct: 3, // TODO(confirm): policies say 3%, estimate form said 3.5%.
  achFeePct: 1,
  overtimeHourly: 65,
  cycRepaint: 175, // white repaint (owner-updated 2026-05-29; was $150)
  cycRepaintCustom: 600, // custom color — client provides paint 48h ahead
  minimumRental: 100,
  multiDay: {
    studio: "4× daily rate", // TODO(confirm)
    gear: "3× daily rate", // TODO(confirm)
    weekendBilling: "weekends billed as 1× day",
  },
} as const;

/** Format a USD price without trailing .00. */
export function usd(n: number): string {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}
