/**
 * Physical studio specs, amenities, included gear, and ideal use cases.
 * Feeds /studio, the SEO landing pages, /studio-facts, the JSON export,
 * and schema amenityFeature. Facts from the 2026-05-28 audits.
 */

export type Spec = { label: string; value: string };
export type Amenity = { name: string; detail?: string };

export const STUDIO = {
  totalSqFt: 2400,
  shootingSqFt: 1900,
  purposeBuilt: true,

  cyc: {
    width: "20'",
    depth: "17'",
    height: "15'",
    /** Display string. */
    dimensions: "20' w × 17' d × 15' h",
    note: "A real, permanent cyclorama — repainted between campaigns. Not quarter-inch plywood.",
  },

  /** Headline specs for spec tables. */
  specs: [
    { label: "Total space", value: "2,400 ft² purpose-built" },
    { label: "Shooting floor", value: "1,900 ft²" },
    { label: "Cyclorama wall", value: "20' w × 17' d × 15' h" },
    { label: "Power", value: "8 × 20-amp dedicated circuits" },
    { label: "Daylight", value: "Giant windows, individually controllable blinds" },
    { label: "Access", value: "24/7 keyless entry (UniFi)" },
    { label: "Parking", value: "Free street parking + load-in ramp" },
  ] satisfies Spec[],

  /** Everything included with a studio rental, no surcharge. */
  included: [
    "Strobe lighting (Profoto)",
    "Continuous LED lighting",
    "Lighting modifiers",
    "Full grip package",
    "Tether station (Capture One, Lightroom, Phocus)",
    "Chroma green & blue, seamless paper, and V-flat backdrops",
    "Working kitchen & client lounge",
    "Free parking & load-in ramp",
  ],

  /** Facility amenities. */
  amenities: [
    { name: "Cyclorama wall", detail: "20' w × 17' d × 15' h, repainted between campaigns" },
    { name: "Controllable daylight", detail: "Individually controllable blinds on giant windows" },
    { name: "Tether station", detail: "Capture One, Lightroom, Phocus, Resolve, Photoshop — wired + WiFi" },
    { name: "Client lounge", detail: "Sofa, second monitor for art directors, espresso" },
    { name: "Entry library", detail: "Teak treads, leather chairs, a curated editorial reference library" },
    { name: "Working kitchen", detail: "A real kitchen used by food stylists — prep, water, coffee" },
    { name: "Make-up station & changing room" },
    { name: "Motor-controlled backdrop system" },
    { name: "Outdoor deck & load-in ramp" },
    { name: "Free parking", detail: "Unlimited on side streets; 2-hr on Kalamath" },
    { name: "Sound dampening" },
    { name: "5-zone mini-split HVAC" },
    { name: "24/7 keyless access", detail: "UniFi door access; codes active around your booking" },
  ] satisfies Amenity[],

  tetherSoftware: ["Capture One", "Lightroom", "Phocus", "DaVinci Resolve", "Photoshop"],

  power: "8 × 20-amp dedicated circuits via aluminum wall plates either side of the cyc.",

  /** Who the space is built for — drives SEO landing pages + homepage.
   *  `href` cross-links to the matching high-intent landing page. */
  useCases: [
    {
      slug: "editorial-brand",
      title: "Editorial & brand campaigns",
      blurb: "From a single-subject portrait to a full agency takeover — cyc wall, modifier wall, full grip cart, tether station calibrated to your bay.",
      href: "/commercial-photo-studio-denver",
    },
    {
      slug: "motion-film",
      title: "Motion & film",
      blurb: "Continuous LED, a monitor lounge for clients, real sound dampening, and a kitchen for craft service. Sets that hold up under a 12-hour day.",
      href: "/video-studio-rental-denver",
    },
    {
      slug: "product-food",
      title: "Product & food",
      blurb: "Tabletop, flat-lay, and lifestyle stills. The kitchen isn't a set piece — it's a working kitchen used by food stylists every week.",
      href: "/product-photography-studio-denver",
    },
    {
      slug: "content-days",
      title: "Content days",
      blurb: "Shoot an entire month of content in one afternoon. Batch 20–50 pieces with variety of looks and zero gear-wrangling.",
      href: "/content-creator-studio-denver",
    },
    {
      slug: "podcast-interview",
      title: "Podcast & interview",
      blurb: "Multi-camera interview and podcast recording in a controlled, sound-dampened space with a comfortable client lounge.", // TODO(confirm): turnkey podcast lighting/audio/sets offering.
      href: "/podcast-studio-denver",
    },
    {
      slug: "headshots-personal-brand",
      title: "Headshots & personal brand",
      blurb: "Fast, client-ready sessions — executives, talent, founders, and teams. Reliable lighting, easy load-in, no weather.",
      href: "/photo-studio-rental-denver",
    },
  ],

  /** High-converting short-session segments (2–4 hr sweet spot). */
  shortSessionSegments: [
    "Commercial & headshot photographers",
    "Content creators & influencers",
    "E-commerce & small brands",
    "Corporate & executive content",
    "Podcast & interview creators",
    "Creative agencies",
  ],
} as const;
