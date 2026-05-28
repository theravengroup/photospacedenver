/**
 * Production service detail pages — drive /services/[slug] from one template.
 * Copy grounded in the WP audit. Each is a real page with unique content,
 * not a thin SEO stub.
 */

import type { FaqTag } from "./faqs";

export type ServicePage = {
  slug: string;
  title: string;
  h1: string;
  eyebrow: string;
  lede: string;
  intro: string;
  /** What the service includes / how it works. */
  includes: { heading: string; body: string }[];
  /** Optional pricing rows (id into SERVICE_PRICING handled in the page). */
  pricingKey?: "cameraCleaning" | "drone" | "shootPod";
  faqTags: FaqTag[];
  related: string[];
  seo: { title: string; description: string; keywords: string[] };
};

export const SERVICES: ServicePage[] = [
  {
    slug: "location-scouting",
    title: "Location Scouting",
    h1: "Location scouting in Denver & Colorado",
    eyebrow: "Service",
    lede: "We find and lock the right location so your shoot day is the only thing you think about.",
    intro:
      "From a contemporary city loft to a secluded forest grove or a clifftop over the plains, we know the Front Range. We find the spot, handle the owner, and clear the red tape before your crew arrives.",
    includes: [
      { heading: "Finding the spot", body: "Curated location options matched to your brief, mood, and budget." },
      { heading: "Permits", body: "We pull the permits and coordinate with municipalities and land managers." },
      { heading: "License & usage", body: "Owner negotiation and usage-fee terms handled on your behalf." },
      { heading: "Location pre-prep", body: "Walkthroughs, access, power, and load-in confirmed before the shoot day." },
    ],
    faqTags: ["location"],
    related: ["production-management", "drone-services"],
    seo: {
      title: "Location Scouting Denver & Colorado",
      description:
        "PhotoSpace finds, permits, and preps photo and video shoot locations across Denver and Colorado — city lofts to clifftops. Request an estimate.",
      keywords: ["location scouting Denver", "Colorado film locations", "shoot permits Denver", "location scout Colorado"],
    },
  },
  {
    slug: "production-management",
    title: "Production Management",
    h1: "Production management for shoots of any size",
    eyebrow: "Service",
    lede: "A shoot isn't just time behind the camera. We run the parts around it so the day stays on the rails.",
    intro:
      "Travel, crew, talent, gear, transport, and food — we coordinate the moving pieces of a production so you can stay focused on the work and the client.",
    includes: [
      { heading: "Crew & talent", body: "Grip and lighting assistants, digital techs, hair, make-up, and stylists, booked and coordinated." },
      { heading: "Logistics", body: "Travel booking, airport pickups, car transportation, and on-location catering." },
      { heading: "Gear & transport", body: "Rentals pulled, packed, and moved — including the ShootPod mobile studio." },
      { heading: "Insurance & workflow", body: "Production insurance and on-site workflow management from call time to wrap." },
    ],
    faqTags: ["gear"],
    related: ["location-scouting", "camera-cleaning"],
    seo: {
      title: "Production Management Denver",
      description:
        "Full-service production management in Denver — crew, talent, logistics, gear, transport, insurance, and on-set workflow. PhotoSpace runs the day.",
      keywords: ["production management Denver", "production services Denver", "shoot coordination Colorado"],
    },
  },
  {
    slug: "drone-services",
    title: "Drone Services",
    h1: "Licensed, insured aerial photo & video",
    eyebrow: "Service",
    lede: "Legal, licensed, permitted, and insured aerial — planned around your shot list, not the other way around.",
    intro:
      "We plan the flight with you, plotting points of interest and shots, then fly and capture what you need. Want to operate the camera yourself? Our FAA-licensed pilot flies while you shoot.",
    includes: [
      { heading: "We Fly & Shoot", body: "Our pilot flies and captures; raw footage delivered within 24 hours." },
      { heading: "We Fly, You Shoot", body: "You operate the camera on-site while our licensed pilot handles the aircraft." },
      { heading: "Edited deliverables", body: "Edited aerial video by the minute, or retouched aerial stills by the image." },
      { heading: "Legal & insured", body: "FAA-licensed and fully insured operation — permitting handled where required." },
    ],
    pricingKey: "drone",
    faqTags: ["location"],
    related: ["production-management", "location-scouting"],
    seo: {
      title: "Drone Services Denver — Aerial Photo & Video",
      description:
        "FAA-licensed, insured aerial photo and video in Denver and Colorado. Fly-and-shoot or you-operate options, edited video, and retouched stills.",
      keywords: ["drone services Denver", "aerial video Denver", "FAA licensed drone pilot Colorado", "aerial photography Denver"],
    },
  },
  {
    slug: "camera-cleaning",
    title: "Camera Cleaning",
    h1: "Camera & sensor cleaning in Denver",
    eyebrow: "Service",
    lede: "Nothing ruins a frame like a dust spot. We'll have your camera sparkling and ready to shoot.",
    intro:
      "Sensor, body, compartments, contacts, viewfinder, and LCD — cleaned and checked, with one lens included. Choose a turnaround that fits your schedule.",
    includes: [
      { heading: "What's cleaned", body: "Sensor, exterior, compartments and contacts, viewfinder and LCD polish, plus one lens." },
      { heading: "Turnaround tiers", body: "1-day, 2-day, or 3-day per kit — the longer the window, the lower the rate." },
      { heading: "Add-ons", body: "Additional lenses, large sensors (Hasselblad, Phase One, RED), and firmware updates available." },
      { heading: "Notes", body: "Viewfinder dust is cosmetic and not included; lenses aren't disassembled, to protect the warranty." },
    ],
    pricingKey: "cameraCleaning",
    faqTags: ["gear"],
    related: ["production-management", "retouching"],
    seo: {
      title: "Camera & Sensor Cleaning Denver",
      description:
        "Professional camera and sensor cleaning in Denver from $75/kit. Sensor, body, contacts, viewfinder, and LCD — with firmware checks available.",
      keywords: ["camera cleaning Denver", "sensor cleaning Denver", "camera maintenance Colorado"],
    },
  },
  {
    slug: "retouching",
    title: "Retouching",
    h1: "Professional photo retouching",
    eyebrow: "Service",
    lede: "Multiple retouchers, specialized by genre — a new clarity of vision for your images.",
    intro:
      "Fashion, beauty, food, product, architecture, portrait, and wedding — we match your images to a retoucher who lives in that genre.",
    includes: [
      { heading: "Beauty & fashion", body: "Skin, hair, and garment retouching that respects texture and intent." },
      { heading: "Product & food", body: "Clean, accurate product and food finishing for commerce and campaigns." },
      { heading: "Architecture & portrait", body: "Perspective, light, and detail work for spaces and people." },
    ],
    faqTags: ["gear"],
    related: ["camera-cleaning", "production-management"],
    seo: {
      title: "Photo Retouching Denver",
      description:
        "Professional photo retouching in Denver — fashion, beauty, food, product, architecture, and portrait, matched to a genre specialist.",
      keywords: ["photo retouching Denver", "product retouching", "beauty retouching Colorado"],
    },
  },
];

export function serviceBySlug(slug: string): ServicePage | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
