/**
 * FAQ content — powers /faq, on-page FAQ blocks, and FAQPage schema.
 * The first 12 are verbatim from photospace.studio (accurate as of audit).
 * Tag entries so pages can surface a relevant subset.
 */

export type FaqTag =
  | "booking"
  | "pricing"
  | "studio"
  | "video"
  | "commercial"
  | "membership"
  | "gear"
  | "location"
  | "tour"
  | "content"
  | "policy";

export type Faq = { q: string; a: string; tags: FaqTag[] };

export const FAQS: Faq[] = [
  {
    q: "Can I rent a photo studio in Denver by the hour?",
    a: "Yes. Hourly rentals are $100/hour with a two-hour minimum, the same rate 24/7 — no evening or weekend surcharge. Half-day (5 hours, $485) and full-day (10 hours, $925) blocks are available for longer productions, and recurring shoots can move onto a monthly membership at member rates.",
    tags: ["booking", "pricing", "studio"],
  },
  {
    q: "Can I rent a video studio in Denver?",
    a: "Yes. The shooting floor is built for video as well as photo — continuous LED lighting, real sound dampening, a working cyclorama, a monitor lounge for clients and art directors, and a full kitchen for craft service. Most productions pair their own camera package with our lighting, grip, and tether station.",
    tags: ["video", "studio"],
  },
  {
    q: "What equipment is included with a studio rental?",
    a: "Every booking includes the full 2,400 ft² space, 1,900 ft² shooting floor, real cyclorama, a starter strobe or LED lighting kit, a working grip & stand package, tether station (Capture One, Lightroom, Phocus), backdrops, kitchen, make-up station, changing room, outdoor deck, free parking, and load-in ramp. Premium lighting, modifiers, cameras, and lenses — Phase One XF IQ4 150MP, Profoto B1X / B10X Plus / D2 / Pro8a kits, premium Canon / Nikon / Sony / Fuji bodies and lenses, plus on-call assistants and digital techs — are available on-site as add-ons at member-friendly rates.",
    tags: ["gear", "studio"],
  },
  {
    q: "Does PhotoSpace offer studio memberships?",
    a: "Yes. Three monthly memberships — Spark (5 hrs/mo, $425), Creator (10 hrs/mo, $895), and Visionary (20 hrs/mo, $1,495) — give Denver photographers and videographers recurring access at member rates, plus discounted camera, lens, and lighting add-ons.",
    tags: ["membership", "pricing"],
  },
  {
    q: "Is PhotoSpace good for commercial shoots and brand campaigns?",
    a: "It's what the studio is built for. Brands including Nike, Under Armour, Oakley, New Balance, Amazon, Allstate, RH, the Denver Broncos, and Marie Claire have shot campaigns, editorials, and lookbooks on this floor. The space is sized and equipped for multi-look productions, agency teams, art-director-friendly client lounges, and full-day takeovers.",
    tags: ["commercial", "studio"],
  },
  {
    q: "Can I bring my own camera and crew?",
    a: "Absolutely. Most clients bring their own camera package and crew and use the studio for the space, lighting, grip, cyclorama, and tether station. There's no per-person fee for your team.",
    tags: ["studio", "policy"],
  },
  {
    q: "Where is PhotoSpace located in Denver?",
    a: "209 Kalamath St, Unit 1, Denver, CO 80223 — in Denver's Sun Valley neighborhood, just off I-25 and minutes from downtown. The building has free parking, a load-in ramp, and an outdoor deck.",
    tags: ["location"],
  },
  {
    q: "How do I book PhotoSpace?",
    a: "Book directly through the live availability scheduler on the booking page — pick your block, confirm, and the studio is yours. Free 20-minute studio tours are bookable through the same scheduler if you'd like to walk the space first. For multi-day campaigns or custom productions, request an estimate and we'll send a written quote.",
    tags: ["booking", "tour"],
  },
  {
    q: "Is lighting equipment included with the studio rental?",
    a: "A starter strobe or LED kit and a working grip package come with every booking — no setup fees, and the same rate 24/7 with no evening or weekend surcharge. Premium Profoto kits (B1X, B10X Plus, D2, Pro8a), additional continuous lighting, and lighting modifiers are available as on-site add-ons at member-friendly rates.",
    tags: ["gear", "studio", "pricing"],
  },
  {
    q: "Is PhotoSpace designed for content creators and brand teams?",
    a: "Yes. The studio is built for the full range of professional creative work — photographers, videographers, content creators, influencers, agencies, and in-house brand teams. The Creator membership in particular is built for recurring content output.",
    tags: ["content", "membership"],
  },
  {
    q: "What are the cancellation and rescheduling policies?",
    a: "Reschedule or cancel up to 72 hours before your booking for a full credit on file. Inside 72 hours, the booking is non-refundable but rebookable for up to 60 days. Members get a more flexible window — full details are in the membership terms.",
    tags: ["policy", "booking"],
  },
  {
    q: "Can I tour the studio before I book?",
    a: "Yes. Free 20-minute studio tours are available 7 days a week and bookable through the same scheduler — pick the “Studio Tour” option. Walking the space before a campaign day is the smart move, and we recommend it.",
    tags: ["tour", "booking"],
  },
  {
    q: "Do I need a rental account to rent gear on location?",
    a: "Yes. To take equipment on location you register for a rental account once — a quick step that includes a driver's license scan and either a certificate of insurance on file or a credit-card hold for the replacement value of the rental. Renting just the studio doesn't require this.",
    tags: ["gear", "booking", "policy"],
  },
  {
    q: "Do you deliver gear, or is it pickup only?",
    a: "Both. Pick up at the Kalamath St. shop Monday–Friday, 8:30am–5:30pm by appointment, or schedule local Denver-metro delivery for an additional fee. Out-of-town crews can have gear staged on arrival, and equipment can be shipped.",
    tags: ["gear", "location"],
  },
];

/** Return FAQs that carry any of the given tags. */
export function faqsByTag(...tags: FaqTag[]): Faq[] {
  return FAQS.filter((f) => f.tags.some((t) => tags.includes(t)));
}
