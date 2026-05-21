import { LINKS } from "./site";

/**
 * Gear rental categories.
 *
 * Mirrors the live photospacedenver.com category structure, with
 * AUDIO promoted to a top-level category per project direction.
 *
 * Each card pairs with an existing image in /public/images.
 * Where an image isn't a perfect category match, we lean on
 * typographic + atmospheric treatments instead of forcing imagery.
 */

export type GearCategory = {
  slug: string;
  title: string;
  blurb: string;
  image?: { src: string; alt: string };
  href: string;
  /** Visual weight on the editorial grid: hero | wide | tall | standard */
  size: "hero" | "wide" | "tall" | "standard";
};

export const GEAR_CATEGORIES: GearCategory[] = [
  {
    slug: "cameras-lenses",
    title: "Cameras & Lenses",
    blurb:
      "Phase One medium format, Hasselblad, Nikon, Fuji and Blackmagic — paired with lenses for the work.",
    image: {
      src: "/images/001photospace-gearjpg.jpg",
      alt: "Phase One XF medium-format camera with lens, dramatically lit on a dark background",
    },
    href: LINKS.gear + "/cameras",
    size: "hero",
  },
  {
    slug: "flash-lighting",
    title: "Flash Lighting",
    blurb:
      "Profoto strobes — B10, B10X, Pro heads — with PocketWizard, modifiers, and the rigging to run them.",
    image: {
      src: "/images/009photospace-gearjpg.jpg",
      alt: "Two Profoto B10 strobe heads side by side on a dark background",
    },
    href: LINKS.gear + "/flash",
    size: "standard",
  },
  {
    slug: "continuous-lighting",
    title: "Continuous Lighting",
    blurb:
      "KinoFlo, LitePanel and Lowel — color-accurate continuous light for video and hybrid shoots.",
    image: {
      src: "/images/004photospace-gearjpg.jpg",
      alt: "Profoto flash and grip equipment laid out on a clean surface",
    },
    href: LINKS.gear + "/continuous",
    size: "standard",
  },
  {
    slug: "lighting-modifiers",
    title: "Lighting Modifiers",
    blurb:
      "Deep parabolic umbrellas, Chimera, Westcott, SunBounce. Hard, soft, big, small — shaped to your call.",
    image: {
      src: "/images/007photospace-gearjpg.jpg",
      alt: "Four large deep-parabolic Profoto umbrellas on a black background",
    },
    href: LINKS.gear + "/modifiers",
    size: "wide",
  },
  {
    slug: "grip-electrical",
    title: "Grip & Electrical",
    blurb:
      "Matthews, Avenger, Manfrotto, Gitzo — c-stands, knuckles, arms, flags. The room behind the room.",
    image: {
      src: "/images/003photospace-gearjpg.jpg",
      alt: "Photo of organized grip rack — arms, knuckles, baby pins and stands",
    },
    href: LINKS.gear + "/grip",
    size: "wide",
  },
  {
    slug: "audio",
    title: "Audio",
    blurb:
      "Sennheiser, Rode, Zoom — wireless lavs, shotguns, recorders and the boom kit to run them.",
    href: LINKS.gear + "/audio",
    size: "tall",
  },
  {
    slug: "production-supplies",
    title: "Production Supplies",
    blurb:
      "The kit you forgot at the office — gels, tape, batteries, chargers, dust pads, gloves, cables, snacks.",
    image: {
      src: "/images/005photospace-gearjpg.jpg",
      alt: "Flat lay of production supplies — peli case, gaff tape, multi-tools, cables, gloves and utility kit",
    },
    href: LINKS.gear + "/production-supplies",
    size: "tall",
  },
  {
    slug: "accessories",
    title: "Photo & Video Accessories",
    blurb:
      "Zacuto, Cinevate, Hoodman, Eizo, Apple, GoPro, DJI — the in-between gear that makes a shoot work.",
    image: {
      src: "/images/002photospace-gearjpg.jpg",
      alt: "Two Hasselblad H-system medium-format cameras side-by-side",
    },
    href: LINKS.gear + "/accessories",
    size: "standard",
  },
];
