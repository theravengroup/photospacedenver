/**
 * Gear rental catalog — 7 categories. Powers /gear-rental (GearGrid) and the
 * estimate flow. Daily rates are verbatim from the 2026-05-28 WP audit.
 *
 * This models the priced hero items + brand coverage per category. The full
 * line-item rate card (hundreds of SKUs) is preserved in
 * docs/audit/photospacedenver-inventory.md and can be expanded here as needed.
 */

export type GearItem = {
  name: string;
  brand?: string;
  /** Daily rate in USD. */
  price?: number;
  unit?: string;
  note?: string;
};

export type GearCategory = {
  slug: string;
  /** In-page anchor id; old /gear/<x>/ URLs 301 here. */
  anchor: string;
  title: string;
  blurb: string;
  brands: string[];
  items: GearItem[];
};

export const GEAR_CATEGORIES: GearCategory[] = [
  {
    slug: "cameras-lenses",
    anchor: "cameras",
    title: "Cameras & Lenses",
    blurb:
      "Medium format through mirrorless and cinema — bodies and lenses for the work. Body-only rentals include a battery and charger; lenses include a UV filter.",
    brands: ["Phase One", "Hasselblad", "Canon", "Nikon", "Fujifilm", "Blackmagic", "Sony", "GoPro", "DJI", "Mevo"],
    items: [
      { name: "Phase One IQ4 150MP Kit", brand: "Phase One", price: 825, note: "Medium format, XF/XT body + Schneider Kreuznach lens" },
      { name: "GFX 100s Kit", brand: "Fujifilm", price: 295, note: "Body $225 only" },
      { name: "EOS R5 Kit", brand: "Canon", price: 195, note: "Body $145 only" },
      { name: "Z8 Kit", brand: "Nikon", price: 195, note: "Body $145 only" },
      { name: "URSA Mini 4.6K G2 (EF)", brand: "Blackmagic", price: undefined, note: "Xeen cine prime kit available" },
      { name: "Hero 11 / Max", brand: "GoPro", price: 45, note: "PLUS kit $60" },
      { name: "Mevo Kit", brand: "Mevo", price: 95, note: "Multi-cam live; Mevo 3 kit $175" },
      { name: "Prime & zoom lenses", price: 8, unit: "–$85/day", note: "RF, Z, GF, Schneider, Xeen cine" },
    ],
  },
  {
    slug: "flash-lighting",
    anchor: "flash",
    title: "Flash Lighting",
    blurb:
      "Profoto strobes from on-camera speedlights to 2400ws studio packs. Kits ship in a case with your choice of Air Remote (Canon / Nikon / Sony / Fuji / Universal).",
    brands: ["Profoto", "PocketWizard"],
    items: [
      { name: "B10X Plus (500ws)", brand: "Profoto", price: 175 },
      { name: "B1 / B1X (500ws)", brand: "Profoto", price: 150 },
      { name: "D2 (1000ws)", brand: "Profoto", price: 175 },
      { name: "Pro-11 (2400ws)", brand: "Profoto", price: 275 },
      { name: "Pro-8a (2400ws)", brand: "Profoto", price: 185 },
      { name: "B2 (250ws)", brand: "Profoto", price: 115 },
      { name: "A10 speedlight (Canon)", brand: "Profoto", price: 75, note: "A1 (Nikon) $65" },
      { name: "PocketWizard / Air Remote", brand: "PocketWizard", price: 25, unit: "+", note: "Transceivers & TTL remotes" },
    ],
  },
  {
    slug: "continuous-lighting",
    anchor: "continuous",
    title: "Continuous Lighting",
    blurb:
      "Color-accurate continuous and LED for video and hybrid shoots — point sources, panels, tubes, and big soft fixtures.",
    brands: ["Arri", "Nanlux", "Aputure", "Kino Flo", "Astera", "Creamsource", "Quasar", "LitePanel", "Fiilex", "Lowel"],
    items: [
      { name: "Dyno 1200C", brand: "Nanlux", price: 500 },
      { name: "Sky 1.2k", brand: "Creamsource", price: 450 },
      { name: "Titan Tube 4' (8x)", brand: "Astera", price: 550 },
      { name: "Evoke 1200B", brand: "Nanlux", price: 250 },
      { name: "SkyPanel S60", brand: "Arri", price: 250 },
      { name: "SkyPanel S30", brand: "Arri", price: 175 },
      { name: "Celeb / Freestyle / Select", brand: "Kino Flo", price: 150, unit: "–$175" },
      { name: "MC RGBWW (12-light)", brand: "Aputure", price: 100 },
    ],
  },
  {
    slug: "lighting-modifiers",
    anchor: "modifiers",
    title: "Lighting Modifiers",
    blurb:
      "Hard, soft, big, small — shaped to your call. Softboxes, octas, parabolas, beauty dishes, grids, umbrellas, scrims, and sun control.",
    brands: ["Chimera", "Profoto", "Westcott", "SunBounce", "Photek", "Elinchrom", "Bron"],
    items: [
      { name: "Para 177", brand: "Bron", price: 225, note: "with Profoto adapter" },
      { name: "Indirect Octa 75\"", brand: "Elinchrom", price: 75 },
      { name: "OctaBank 3'/5'/7'", brand: "Chimera", price: 30, unit: "–$45" },
      { name: "SuperPro Plus softboxes", brand: "Chimera", price: 20, unit: "–$30" },
      { name: "Deep / shallow umbrellas", brand: "Profoto", price: 8, unit: "–$20" },
      { name: "SunBounce kits", brand: "SunBounce", price: 42 },
      { name: "Beauty dish (white/silver)", brand: "Profoto", price: 25 },
      { name: "Grids, snoots, barn doors", brand: "Profoto", price: 8, unit: "–$15" },
    ],
  },
  {
    slug: "grip-electrical",
    anchor: "grip",
    title: "Grip & Electrical",
    blurb:
      "The room behind the room. C-stands, flags, cutters, booms, clamps, apple boxes, sandbags, frames, fabrics, and distro.",
    brands: ["Matthews", "Avenger", "Manfrotto", "Gitzo", "Magliner"],
    items: [
      { name: "C-Stand 40\" w/ head + arm", brand: "Matthews", price: 10, note: "20\" $8" },
      { name: "MegaBoom", price: 75 },
      { name: "Super Boom w/ weight", price: 20 },
      { name: "Magliner Senior w/ shelf", brand: "Magliner", price: 45 },
      { name: "4×4' floppy cutters", price: 25 },
      { name: "12×12' frame + fabrics", price: 15, unit: "–$35" },
      { name: "Apple box kit", price: 10 },
      { name: "Sandbags 15/25/35 lb", price: 3, unit: "–$8" },
    ],
  },
  {
    slug: "photo-video-accessories",
    anchor: "accessories",
    title: "Photo & Video Accessories",
    blurb:
      "The in-between gear that makes a shoot work — tripods, gimbals, sliders, monitors, mics, recorders, media, and readers.",
    brands: ["Manfrotto", "Benro", "DJI", "Edelkrone", "Wooden Camera", "SmallHD", "Zoom", "Rode", "Sennheiser", "Kessler"],
    items: [
      { name: "Slider+ Pro Long", brand: "Edelkrone", price: 95 },
      { name: "Matte box + donut", brand: "Wooden Camera", price: 95 },
      { name: "Ronin RS2 Pro Combo", brand: "DJI", price: 65 },
      { name: "504HD + 546B tripod", brand: "Manfrotto", price: 45 },
      { name: "F6 field recorder", brand: "Zoom", price: 75, note: "H6 $35 · F3 $40" },
      { name: "Wireless lav kit", price: 45 },
      { name: "AC-7 OLED monitor", brand: "SmallHD", price: 45 },
      { name: "CFexpress / SD / CFast media", price: 5, unit: "–$12" },
    ],
  },
  {
    slug: "production-supplies",
    anchor: "production-supplies",
    title: "Production Supplies",
    blurb:
      "The kit you forgot at the office — tables, chairs, generators, comms, steamers, tents, SFX, and the utility gear that keeps a set running.",
    brands: ["Honda"],
    items: [
      { name: "Pop-up tent 10×10'", price: 75 },
      { name: "Generator 2000w", brand: "Honda", price: 100 },
      { name: "Smoke / fog / haze machine", price: 25 },
      { name: "Walkie + surveillance headset", price: 15 },
      { name: "Garment steamer & wardrobe rack", price: 5, unit: "+" },
      { name: "Folding table 6' + linens", price: 10 },
      { name: "Ladders 6'/10'/12'", price: 5, unit: "+" },
      { name: "Space heater", price: 5 },
    ],
  },
];

/** The ShootPod mobile studio — featured on gear + productions. */
export const SHOOTPOD = {
  title: "ShootPod — mobile grip van & studio",
  blurb:
    "A custom high-top van pre-packed with pro gear: custom shelving, 2,400w of distributed power and USB, a multi-brand battery charging station, and onboard WiFi. Everything nicely packed, ready to go.",
  daily: 175,
  mileage: "First 100 miles free, then $0.55/mile",
};

export function gearCategoryBySlug(slug: string): GearCategory | undefined {
  return GEAR_CATEGORIES.find((c) => c.slug === slug);
}
