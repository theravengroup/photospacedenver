/**
 * High-intent studio-rental landing pages — driven from one template
 * (/[slug]). Each has unique, concrete copy and its own FAQ subset and
 * related links. No thin pages.
 */

import type { FaqTag } from "./faqs";

export type SeoCta = "book" | "tour" | "estimate" | "membership";

export type SeoLanding = {
  slug: string;
  eyebrow: string;
  h1: string;
  /** Hero subhead. */
  lede: string;
  intro: string;
  sections: { heading: string; body: string }[];
  highlights: string[];
  faqTags: FaqTag[];
  related: string[];
  primaryCta: SeoCta;
  seo: { title: string; description: string; keywords: string[] };
};

export const SEO_LANDING: SeoLanding[] = [
  {
    slug: "photo-studio-rental-denver",
    eyebrow: "Photo studio rental",
    h1: "Photo studio rental in Denver",
    lede: "1,900 ft² of controllable light, a real cyclorama, and a starter lighting & grip kit included — by the hour, half-day, or full day.",
    intro:
      "Walk in and shoot. The shooting floor is calibrated, the cyc is clean, and the lighting and grip are already here. Book two hours for a single setup or take the whole day for a campaign.",
    sections: [
      { heading: "A floor built for stills", body: "1,900 ft² of shooting space with a 20'-wide cyclorama, individually controllable blinds on giant windows, and 8 dedicated 20-amp circuits. Tether to Capture One, Lightroom, or Phocus at a station with a second monitor for art directors." },
      { heading: "Lighting and grip to start", body: "A starter Profoto strobe or LED kit and a working grip package come with the room — no setup fees. Premium lighting, modifiers, cameras, and lenses are available on-site as add-ons, discounted for members." },
      { heading: "Easy in, easy out", body: "Free parking, a load-in ramp, a working kitchen, and a client lounge. Book a session 24/7 at the same rate, or come by for a free 20-minute tour first." },
    ],
    highlights: ["1,900 ft² shooting floor", "Real cyclorama wall", "Starter light & grip included", "$100/hr · 2-hr minimum", "24/7 access"],
    faqTags: ["studio", "booking", "pricing", "gear"],
    related: ["cyclorama-wall-denver", "commercial-photo-studio-denver", "product-photography-studio-denver"],
    primaryCta: "book",
    seo: {
      title: "Photo Studio Rental Denver — Real Cyclorama, 24/7 Access",
      description:
        "Rent a 1,900 ft² photo studio in Denver with a real cyclorama, a starter lighting & grip kit, and 24/7 access. $100/hr, 2-hour minimum. Book or tour.",
      keywords: ["photo studio rental Denver", "photography studio Denver", "studio with cyclorama Denver", "studio rental Denver hourly"],
    },
  },
  {
    slug: "video-studio-rental-denver",
    eyebrow: "Video studio rental",
    h1: "Video studio rental in Denver",
    lede: "Continuous LED, real sound dampening, a cyclorama, and a client monitor lounge — a set that holds up under a 12-hour day.",
    intro:
      "Built for motion as much as stills. Bring your camera package and crew; use the floor, the lighting, the grip, and the tether station. There's a kitchen for craft service and a lounge for clients and art directors.",
    sections: [
      { heading: "Lit for motion", body: "Aputure and Arri-class continuous LED, modifiers, and grip are on hand. The cyclorama gives you a seamless background; the blinds let you add or kill ambient daylight on cue." },
      { heading: "Sound and comfort", body: "Real sound dampening, a 5-zone HVAC you can actually control, and a monitor lounge so clients can watch the take. The working kitchen keeps a long shoot fed." },
      { heading: "Scales with the production", body: "From a one-person interview to a multi-look brand film, the 1,900 ft² floor and 8 dedicated circuits handle the load. Add on-call assistants and digital techs as needed." },
    ],
    highlights: ["Continuous LED lighting", "Real sound dampening", "Client monitor lounge", "Craft-service kitchen", "12-hour-day ready"],
    faqTags: ["video", "studio", "booking", "gear"],
    related: ["podcast-studio-denver", "commercial-photo-studio-denver", "content-creator-studio-denver"],
    primaryCta: "book",
    seo: {
      title: "Video Studio Rental Denver — Lighting, Sound, Cyclorama",
      description:
        "Rent a Denver video studio with continuous LED lighting, sound dampening, a cyclorama, client monitor lounge, and craft-service kitchen. Book or tour.",
      keywords: ["video studio rental Denver", "video production studio Denver", "film studio Denver", "Denver soundstage"],
    },
  },
  {
    slug: "cyclorama-wall-denver",
    eyebrow: "Cyclorama studio",
    h1: "Cyclorama wall studio in Denver",
    lede: "A real, permanent cyc — 20' wide × 17' deep × 15' high — repainted between campaigns. Not quarter-inch plywood.",
    intro:
      "An infinity background that actually reads as infinite. Our cyclorama is purpose-built and maintained, with the lighting and grip to shape it however the shot needs.",
    sections: [
      { heading: "The wall", body: "20' w × 17' d × 15' h of seamless cove, swept, mopped, and re-painted between campaigns. Big enough for talent, vehicles-on-product scale sets, and full-length fashion." },
      { heading: "Light it your way", body: "Profoto strobes and continuous LED, deep parabolics, softboxes, and a full modifier wall — plus 8 dedicated circuits so you can push power without tripping the room." },
      { heading: "Clean every time", body: "A repaint is $150 if a shoot marks it up, but you'll start on a clean wall. Free 20-minute tours if you want to see it before you book." },
    ],
    highlights: ["20' × 17' × 15' cyc", "Seamless infinity cove", "Repainted between shoots", "Full modifier wall", "8 × 20-amp circuits"],
    faqTags: ["studio", "booking", "gear"],
    related: ["photo-studio-rental-denver", "product-photography-studio-denver", "commercial-photo-studio-denver"],
    primaryCta: "tour",
    seo: {
      title: "Cyclorama Wall Studio Denver — Real Cyc, 20' Wide",
      description:
        "Shoot on a real cyclorama wall in Denver — 20' × 17' × 15', repainted between campaigns, with Profoto lighting and a full modifier wall. Book or tour.",
      keywords: ["cyclorama wall Denver", "cyc wall studio Denver", "infinity wall studio Denver", "cyclorama rental Colorado"],
    },
  },
  {
    slug: "product-photography-studio-denver",
    eyebrow: "Product & food",
    h1: "Product photography studio in Denver",
    lede: "Tabletop, flat-lay, and lifestyle stills — with a working kitchen, controllable light, and the grip to lock every frame.",
    intro:
      "Built for e-commerce, packaging, and food. Controlled, repeatable lighting; a real kitchen used by food stylists every week; and the tether station to art-direct on a big screen.",
    sections: [
      { heading: "Repeatable light", body: "Strobe and continuous LED, modifiers, and a full grip cart to build consistent setups across hundreds of SKUs. Tether to Capture One so the client signs off in real time." },
      { heading: "A real working kitchen", body: "Not a kitchen-themed set piece — a working kitchen with real water, prep, and coffee, used by food stylists. Ideal for food, beverage, and lifestyle product." },
      { heading: "Batch a catalog in a day", body: "The 1,900 ft² floor and easy load-in make multi-setup product days efficient. Book a half-day for a launch or a full day for a full catalog." },
    ],
    highlights: ["Working stylist kitchen", "Repeatable lighting", "Tabletop & flat-lay setups", "Capture One tethering", "Batch-friendly floor"],
    faqTags: ["studio", "booking", "gear", "commercial"],
    related: ["commercial-photo-studio-denver", "content-creator-studio-denver", "photo-studio-rental-denver"],
    primaryCta: "book",
    seo: {
      title: "Product Photography Studio Denver — Kitchen, Tether, Lighting",
      description:
        "Denver product and food photography studio with a working stylist kitchen, repeatable lighting, grip, and Capture One tethering. Batch a catalog in a day.",
      keywords: ["product photography studio Denver", "food photography studio Denver", "e-commerce photography Denver", "tabletop studio Denver"],
    },
  },
  {
    slug: "content-creator-studio-denver",
    eyebrow: "Content days",
    h1: "Content creator studio in Denver",
    lede: "Shoot an entire month of content in one afternoon — variety of looks, pro lighting, and zero gear-wrangling.",
    intro:
      "Built for batch content. Walk in, plug in, and create. The lighting and grip are ready, the cyc gives you clean looks, and a membership makes recurring content days pay off.",
    sections: [
      { heading: "Built for batching", body: "Knock out 20–50 pieces in a session: stills, reels, sponsor deliverables, and seasonal refreshes. Multiple looks from one room — cyc, daylight, and set areas." },
      { heading: "Pro without the production headache", body: "A starter strobe or LED kit and grip come with the room, and the full lighting, modifier, and camera catalog is on-site as add-ons. No piecing rentals together across Denver — it's all here, and there's espresso." },
      { heading: "A membership that pays off", body: "If you shoot monthly, the Creator membership is built for you: recurring hours at member rates plus discounted camera and lens add-ons." },
    ],
    highlights: ["Batch 20–50 pieces", "Multiple looks, one room", "Starter light included", "Creator membership", "Walk in and shoot"],
    faqTags: ["content", "membership", "studio", "booking"],
    related: ["video-studio-rental-denver", "podcast-studio-denver", "photo-studio-rental-denver"],
    primaryCta: "membership",
    seo: {
      title: "Content Creator Studio Denver — Built for Content Days",
      description:
        "A Denver content creator studio built for batch days — pro lighting on hand, multiple looks, and a Creator membership for recurring shoots. Book or join.",
      keywords: ["content creator studio Denver", "content studio Denver", "creator studio rental Denver", "studio for content days Denver"],
    },
  },
  {
    slug: "commercial-photo-studio-denver",
    eyebrow: "Commercial & brand",
    h1: "Commercial photo studio in Denver",
    lede: "Where brands like Nike, Under Armour, Amazon, and the Denver Broncos have shot campaigns, editorials, and lookbooks.",
    intro:
      "Sized and equipped for agency days and multi-look productions — art-director-friendly lounge, full grip and lighting, and a team that knows commercial work.",
    sections: [
      { heading: "Trusted by national brands", body: "Campaigns for Nike, Under Armour, Oakley, New Balance, Amazon, Allstate, RH, the Denver Broncos, and Marie Claire have been lit and shot on this floor." },
      { heading: "Agency-ready", body: "A client lounge with a second tether monitor, a working kitchen for craft service, and a calibrated tether station. Comfortable for a full agency team through a long day." },
      { heading: "Full-day takeovers", body: "Private use of the full 2,400 ft² space for campaigns and multi-look productions. Add on-call assistants, digital techs, and premium camera packages." },
    ],
    highlights: ["National-brand proof", "Art-director lounge", "Full grip & lighting", "Private full-day takeover", "On-call crew add-ons"],
    faqTags: ["commercial", "studio", "booking"],
    related: ["photo-studio-rental-denver", "video-studio-rental-denver", "product-photography-studio-denver"],
    primaryCta: "estimate",
    seo: {
      title: "Commercial Photo Studio Denver — Agency-Ready Campaigns",
      description:
        "Denver's commercial photo studio for brand campaigns and agency days — used by Nike, Under Armour, Amazon, and the Denver Broncos. Lighting, grip, lounge.",
      keywords: ["commercial photo studio Denver", "brand campaign studio Denver", "agency studio Denver", "commercial photography studio Colorado"],
    },
  },
  {
    slug: "podcast-studio-denver",
    eyebrow: "Podcast & interview",
    h1: "Podcast & interview studio in Denver",
    // TODO(confirm): turnkey podcast lighting/audio/sets — confirm what's actually offered before launch.
    lede: "A controlled, sound-dampened space for multi-camera interviews and podcast recording, with a comfortable lounge for guests.",
    intro:
      "Record interviews and podcast episodes in a real production studio — controllable light, sound dampening, and room for a multi-camera setup, with espresso and a lounge to keep guests comfortable.",
    sections: [
      { heading: "Built for conversation", body: "Sound dampening, controllable daylight, and a 1,900 ft² floor give you room for a three-camera interview set without echo or clutter." },
      { heading: "Comfortable for guests", body: "A client lounge, a working kitchen, and free parking make it easy on guests and crew. The space reads premium on camera." },
      { heading: "Bring your kit or add ours", body: "Bring your audio and camera package, or add continuous lighting and on-call crew. Multi-day and recurring bookings welcome — ask about member rates." },
    ],
    highlights: ["Sound-dampened space", "Multi-camera room", "Guest lounge & kitchen", "Controllable light", "Recurring bookings"],
    faqTags: ["video", "studio", "booking"],
    related: ["video-studio-rental-denver", "content-creator-studio-denver", "commercial-photo-studio-denver"],
    primaryCta: "tour",
    seo: {
      title: "Podcast & Interview Studio Denver — Multi-Camera, Sound-Dampened",
      description:
        "A Denver podcast and interview studio — sound-dampened, controllable light, room for multi-camera setups, and a comfortable guest lounge. Book a tour.",
      keywords: ["podcast studio Denver", "interview studio Denver", "podcast recording studio Denver", "video podcast studio Colorado"],
    },
  },
];

export function seoPageBySlug(slug: string): SeoLanding | undefined {
  return SEO_LANDING.find((p) => p.slug === slug);
}

export const SEO_SLUGS = SEO_LANDING.map((p) => p.slug);
