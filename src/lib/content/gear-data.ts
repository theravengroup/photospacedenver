/**
 * Gear rental catalog — 7 categories. Powers the /gear-rental hub and the seven
 * SEO category pages (/<category>-rental-denver via /[slug]). Daily rates are
 * verbatim from the 2026-05-28 WP audit.
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
  /** Top-level SEO route slug, e.g. /camera-lens-rental-denver. */
  seoSlug: string;
  /** In-page anchor id; legacy /gear/<x>/ URLs 301 to the SEO page. */
  anchor: string;
  title: string;
  blurb: string;
  /** Longer hero/intro paragraph for the category page. */
  intro?: string;
  seo?: { title: string; description: string; keywords: string[] };
  brands: string[];
  items: GearItem[];
};

export const GEAR_CATEGORIES: GearCategory[] = [
  {
    slug: "cameras-lenses",
    seoSlug: "camera-lens-rental-denver",
    anchor: "cameras",
    title: "Cameras & Lenses",
    blurb:
      "Medium format through mirrorless and cinema — bodies and lenses for the work. Body-only rentals include a battery and charger; lenses include a UV filter.",
    intro:
      "Medium format through mirrorless and cinema — pro bodies and the glass to match, ready to shoot. Body-only rentals include a battery and charger; lenses ship with a UV filter. Pick up at the Kalamath St. shop or have it delivered across the Denver metro.",
    seo: {
      title: "Camera & Lens Rental in Denver — Phase One, Canon, Nikon, Sony",
      description:
        "Rent cameras and lenses in Denver — Phase One IQ4 150MP, Fujifilm GFX, Canon R5, Nikon Z8, Blackmagic cinema, plus RF/Z/GF and cine glass. Pickup or Denver-metro delivery.",
      keywords: ["camera rental Denver", "lens rental Denver", "Phase One rental Denver", "cinema camera rental Denver"],
    },
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
    seoSlug: "flash-strobe-rental-denver",
    anchor: "flash",
    title: "Flash Lighting",
    blurb:
      "Profoto strobes from on-camera speedlights to 2400ws studio packs. Kits ship in a case with your choice of Air Remote (Canon / Nikon / Sony / Fuji / Universal).",
    intro:
      "Profoto strobes from on-camera speedlights to 2400ws studio packs — battery-powered B-series for location, pack-and-head systems for the studio. Every kit ships in a case with your choice of Air Remote (Canon / Nikon / Sony / Fuji / Universal) and PocketWizard options.",
    seo: {
      title: "Strobe & Flash Lighting Rental in Denver — Profoto",
      description:
        "Rent Profoto strobes in Denver — B10X Plus, B1X, D2, Pro-11 (2400ws), Pro-8a, and A10 speedlights, plus PocketWizard remotes. Pickup or Denver-metro delivery.",
      keywords: ["strobe rental Denver", "Profoto rental Denver", "flash rental Denver", "studio lighting rental Denver"],
    },
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
    seoSlug: "continuous-lighting-rental-denver",
    anchor: "continuous",
    title: "Continuous Lighting",
    blurb:
      "Color-accurate continuous and LED for video and hybrid shoots — point sources, panels, tubes, and big soft fixtures.",
    intro:
      "Color-accurate continuous and LED for video and hybrid shoots — from Arri SkyPanels and Nanlux point sources to Astera tubes, Kino Flo soft fixtures, and Aputure RGBWW. High output, dialable color, and the modifiers to shape it.",
    seo: {
      title: "Continuous & LED Lighting Rental in Denver — Arri, Nanlux, Aputure",
      description:
        "Rent continuous LED lighting in Denver — Arri SkyPanel, Nanlux Dyno/Evoke, Creamsource, Astera tubes, Kino Flo, and Aputure. Pickup or Denver-metro delivery.",
      keywords: ["continuous lighting rental Denver", "LED lighting rental Denver", "Arri SkyPanel rental Denver", "video lighting rental Denver"],
    },
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
    seoSlug: "lighting-modifier-rental-denver",
    anchor: "modifiers",
    title: "Lighting Modifiers",
    blurb:
      "Hard, soft, big, small — shaped to your call. Softboxes, octas, parabolas, beauty dishes, grids, umbrellas, scrims, and sun control.",
    intro:
      "Hard, soft, big, small — the light, shaped to your call. Chimera and Profoto softboxes, deep octas and parabolics, the Bron Para 177, beauty dishes, grids, umbrellas, and SunBounce sun control. Adapters for every head we rent.",
    seo: {
      title: "Lighting Modifier Rental in Denver — Softboxes, Octas, Parabolics",
      description:
        "Rent lighting modifiers in Denver — Chimera and Profoto softboxes, octas, the Bron Para 177, beauty dishes, grids, umbrellas, and SunBounce. Pickup or delivery.",
      keywords: ["softbox rental Denver", "lighting modifier rental Denver", "octabank rental Denver", "beauty dish rental Denver"],
    },
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
    seoSlug: "grip-equipment-rental-denver",
    anchor: "grip",
    title: "Grip & Electrical",
    blurb:
      "The room behind the room. C-stands, flags, cutters, booms, clamps, apple boxes, sandbags, frames, fabrics, and distro.",
    intro:
      "The room behind the room. Matthews and Avenger C-stands, flags and cutters, the MegaBoom and Super Boom, Magliner carts, 12×12 frames with full fabric sets, apple boxes, sandbags, clamps, and electrical distribution.",
    seo: {
      title: "Grip & Electrical Rental in Denver — C-Stands, Flags, Booms",
      description:
        "Rent grip and electrical in Denver — Matthews C-stands, MegaBoom, Magliner carts, flags and cutters, 12×12 frames and fabrics, apple boxes, and sandbags.",
      keywords: ["grip rental Denver", "C-stand rental Denver", "grip equipment rental Denver", "flag and cutter rental Denver"],
    },
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
    seoSlug: "photo-video-accessory-rental-denver",
    anchor: "accessories",
    title: "Photo & Video Accessories",
    blurb:
      "The in-between gear that makes a shoot work — tripods, gimbals, sliders, monitors, mics, recorders, media, and readers.",
    intro:
      "The in-between gear that makes a shoot work — DJI Ronin gimbals, Edelkrone sliders, Manfrotto fluid heads and tripods, SmallHD monitors, matte boxes, Zoom/Rode/Sennheiser audio, wireless lavs, and CFexpress/SD/CFast media with readers.",
    seo: {
      title: "Photo & Video Accessory Rental in Denver — Gimbals, Sliders, Audio",
      description:
        "Rent photo and video accessories in Denver — DJI Ronin gimbals, Edelkrone sliders, Manfrotto tripods, SmallHD monitors, Zoom/Rode/Sennheiser audio, and media.",
      keywords: ["gimbal rental Denver", "slider rental Denver", "audio rental Denver", "monitor rental Denver"],
    },
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
    seoSlug: "production-supply-rental-denver",
    anchor: "production-supplies",
    title: "Production Supplies",
    blurb:
      "The kit you forgot at the office — tables, chairs, generators, comms, steamers, tents, SFX, and the utility gear that keeps a set running.",
    intro:
      "The kit you forgot at the office — pop-up tents, Honda generators, fog/haze and SFX machines, walkies and surveillance headsets, garment steamers and wardrobe racks, folding tables, ladders, and space heaters. The utility gear that keeps a set running.",
    seo: {
      title: "Production Supply Rental in Denver — Tents, Generators, Comms",
      description:
        "Rent production supplies in Denver — pop-up tents, Honda generators, fog/haze machines, walkies, garment steamers, folding tables, ladders, and space heaters.",
      keywords: ["production supplies rental Denver", "generator rental Denver", "fog machine rental Denver", "pop-up tent rental Denver"],
    },
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

export const GEAR_SEO_SLUGS = GEAR_CATEGORIES.map((c) => c.seoSlug);

export function gearCategoryBySeoSlug(seoSlug: string): GearCategory | undefined {
  return GEAR_CATEGORIES.find((c) => c.seoSlug === seoSlug);
}

/** "Gear from all the top brands" — the rental house's headline brand wall. */
export const GEAR_BRANDS = [
  "Profoto", "Phase One", "Chimera", "PocketWizard", "Nikon", "Fujifilm",
  "Westcott", "SunBounce", "Zacuto", "Foba", "Manfrotto", "Gitzo", "Apple",
  "Eizo", "GoPro", "Hoodman", "Litepanels", "Matthews", "Lowel", "DJI",
  "Avenger", "Cinevate", "Kino Flo", "Zoom", "Rode", "Sennheiser", "Blackmagic",
];
