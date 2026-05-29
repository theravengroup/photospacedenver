/**
 * Gear rental catalog — 7 categories, each with the full grouped, priced
 * line-item list transcribed verbatim from the live WordPress gear pages
 * (photospacedenver.com/gear/<category>/, 2026-05-28). Powers the /gear-rental
 * hub and the seven SEO category pages (/<category>-rental-denver via /[slug]).
 *
 * `groups` mirrors the WP page's own section headings so the lists stay clean
 * and organized. Prices are verbatim daily rates.
 */

export type GearLineItem = { name: string; price: string };
export type GearGroup = { heading: string; items: GearLineItem[] };

export type GearCategory = {
  slug: string;
  /** Top-level SEO route slug, e.g. /camera-lens-rental-denver. */
  seoSlug: string;
  /** Legacy /gear/<x>/ anchor id (kept for reference). */
  anchor: string;
  title: string;
  blurb: string;
  /** Longer hero/intro paragraph for the category page. */
  intro?: string;
  seo?: { title: string; description: string; keywords: string[] };
  brands: string[];
  groups: GearGroup[];
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
      title: "Camera & Lens Rental in Denver — Phase One, Canon, Nikon",
      description:
        "Rent cameras and lenses in Denver — Phase One IQ4 150MP, Fujifilm GFX, Canon R5, Nikon Z8, Blackmagic cinema, plus RF/Z/GF and Xeen cine glass.",
      keywords: ["camera rental Denver", "lens rental Denver", "Phase One rental Denver", "cinema camera rental Denver"],
    },
    brands: ["Phase One", "Canon", "Nikon", "Fujifilm", "Blackmagic", "GoPro", "DJI", "Mevo"],
    groups: [
      { heading: "Canon — Kit", items: [{ name: "Canon EOS R5 Kit", price: "$195" }] },
      { heading: "Canon — Body Only", items: [{ name: "Canon EOS R5", price: "$145" }] },
      { heading: "Canon — RF Lenses", items: [
        { name: "RF 50mm f/1.2", price: "$50" },
        { name: "RF 85mm DS f/1.2", price: "$65" },
        { name: "RF 100mm f/2.8 Macro", price: "$60" },
        { name: "RF 15-35mm f/2.8", price: "$50" },
        { name: "RF 28-70mm f/2", price: "$60" },
        { name: "RF 24-105mm f/4", price: "$35" },
        { name: "RF 70-200mm f/2.8", price: "$50" },
        { name: "RF 100-500mm f/4.5-7.1", price: "$50" },
      ] },
      { heading: "Canon — Accessories", items: [
        { name: "Control Ring Mount Adapter EF-RF", price: "$20" },
        { name: "LP-E6NH Battery", price: "$10" },
        { name: "USB-C → C Tether Cable, 9.5m", price: "$8" },
      ] },
      { heading: "Nikon — Kit", items: [{ name: "Nikon Z8 Kit", price: "$195" }] },
      { heading: "Nikon — Body Only", items: [{ name: "Nikon Z8", price: "$145" }] },
      { heading: "Nikon — Z Lenses", items: [
        { name: "Z 24-70mm f/2.8", price: "$50" },
        { name: "Z 70-200mm f/2.8", price: "$60" },
        { name: "Z 180-600mm f/5.6-6.3", price: "$45" },
      ] },
      { heading: "Nikon — Accessories", items: [
        { name: "Vertical Grip", price: "$20" },
        { name: "EN-EL15c Battery", price: "$10" },
        { name: "USB-C → C Tether Cable, 9.5m", price: "$8" },
      ] },
      { heading: "Phase One — Kit", items: [{ name: "IQ4 150MP Kit", price: "$825" }] },
      { heading: "Phase One — Body / Back Only", items: [
        { name: "XF Camera", price: "$145" },
        { name: "XT Camera", price: "$125" },
        { name: "IQ4 Digital Back", price: "$650" },
      ] },
      { heading: "Phase One — Schneider Kreuznach LS (Blue Ring) Lenses", items: [
        { name: "35mm LS f/3.5", price: "$75" },
        { name: "45mm LS f/3.5", price: "$75" },
        { name: "55mm LS f/3.5", price: "$65" },
        { name: "80mm LS f/3.5", price: "$60" },
        { name: "110mm LS f/2.8", price: "$65" },
        { name: "120mm LS f/4.5 Macro", price: "$75" },
        { name: "150mm LS f/3.5", price: "$65" },
        { name: "240mm LS f/3.5", price: "$75" },
      ] },
      { heading: "Phase One — Accessories", items: [
        { name: "IQ & P+ Battery", price: "$8" },
        { name: "Dual Battery Charger", price: "$20" },
        { name: "Ethernet Tether System", price: "$30" },
        { name: "V-Grip", price: "$45" },
        { name: "Waist Level Viewfinder", price: "$25" },
        { name: "USB-C → C Tether Cable, 4.6m", price: "$8" },
      ] },
      { heading: "Fujifilm — Kit", items: [{ name: "GFX 100s Kit", price: "$295" }] },
      { heading: "Fujifilm — Body Only", items: [{ name: "GFX 100s Body", price: "$225" }] },
      { heading: "Fujifilm — GF Lenses", items: [
        { name: "GF 20-35mm f/4 R WR", price: "$70" },
        { name: "GF 35-70mm f/4.5-5.6 WR", price: "$70" },
        { name: "GF 45-100mm f/4 R LM OIS WR", price: "$70" },
      ] },
      { heading: "Fujifilm — Accessories", items: [
        { name: "Battery", price: "$10" },
        { name: "USB-C → C Tether Cable, 9.5m", price: "$8" },
      ] },
      { heading: "Blackmagic — Body Only", items: [{ name: "URSA Mini 4.6K G2 (EF)", price: "$195" }] },
      { heading: "Blackmagic — Xeen Cinema Lenses (EF)", items: [
        { name: "Xeen 14mm T3.1", price: "$65" },
        { name: "Xeen 24mm T1.5", price: "$65" },
        { name: "Xeen 35mm T1.5", price: "$65" },
        { name: "Xeen 50mm T1.5", price: "$65" },
        { name: "Xeen 85mm T1.5", price: "$65" },
        { name: "Xeen 135mm T2.2", price: "$65" },
        { name: "Complete Xeen Kit (6 lenses)", price: "$375" },
        { name: "Sigma 18-35mm T2", price: "$85" },
      ] },
      { heading: "Blackmagic — Accessories", items: [
        { name: "NP-F570 Battery", price: "$10" },
        { name: "NP-F570 Dual Battery Charger", price: "$10" },
        { name: "BMPCC EVF", price: "$20" },
      ] },
      { heading: "GoPro — Kits", items: [
        { name: "GoPro 11 Standard Kit", price: "$45" },
        { name: "GoPro 11 PLUS Kit", price: "$60" },
      ] },
      { heading: "GoPro — Body Only", items: [
        { name: "Hero 11", price: "$35" },
        { name: "Max", price: "$60" },
      ] },
      { heading: "GoPro — Lenses & Accessories", items: [
        { name: "Max Wide Lens Mod", price: "$8" },
        { name: "Media Mod (Mounts + Mic)", price: "$8" },
        { name: "Display Mod (Front Camera)", price: "$8" },
        { name: "Light Mod (LED Light)", price: "$5" },
        { name: "Volta Battery Grip", price: "$10" },
      ] },
      { heading: "DJI", items: [{ name: "DJI Osmo Gen1", price: "$20" }] },
      { heading: "Mevo", items: [
        { name: "MEVO 1 Camera Kit", price: "$95" },
        { name: "MEVO 3 Camera Kit", price: "$175" },
        { name: "Mevo (body only)", price: "$35" },
      ] },
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
    groups: [
      { heading: "Kits — Speedlight / On-Camera Flash", items: [
        { name: "A1 (Nikon)", price: "$65" },
        { name: "A10 (Canon)", price: "$75" },
      ] },
      { heading: "Kits — Monolight", items: [
        { name: "B2 (250ws)", price: "$115" },
        { name: "B1 / B1X (500ws)", price: "$150" },
        { name: "B10X Plus (500ws)", price: "$175" },
        { name: "D2 (1000ws)", price: "$175" },
      ] },
      { heading: "Kits — Studio Packs & Heads", items: [
        { name: "D4 — 2 Head", price: "$125" },
        { name: "D4 — 4 Head", price: "$175" },
        { name: "Pro-7a — 2 Head", price: "$145" },
        { name: "Pro-8a — 2 Head", price: "$185" },
        { name: "Pro-11 — 2 Head", price: "$275" },
        { name: "B4", price: "$185" },
      ] },
      { heading: "Individual — Speedlight / On-Camera Flash", items: [
        { name: "A1 (Nikon)", price: "$25" },
        { name: "A10 (Canon)", price: "$30" },
      ] },
      { heading: "Individual — Studio Packs", items: [
        { name: "Pro-11 2400", price: "$145" },
        { name: "Pro-8a 2400", price: "$100" },
        { name: "Pro-7a 2400", price: "$65" },
        { name: "D4 2400", price: "$65" },
      ] },
      { heading: "Individual — Monolight", items: [
        { name: "B10X Plus AirTTL", price: "$70" },
        { name: "B1 / B1X 500 AirTTL", price: "$65" },
        { name: "D2 1000 AirTTL", price: "$65" },
      ] },
      { heading: "Battery Packs", items: [{ name: "Pro-B4 1000 Air", price: "$95" }] },
      { heading: "Strobe Heads", items: [
        { name: "RingFlash2", price: "$60" },
        { name: "ProTwin (Bi-Tube) Head", price: "$45" },
        { name: "Pro Head", price: "$30" },
        { name: "Pro-B Head", price: "$25" },
        { name: "Acute2-D4 Head", price: "$25" },
      ] },
      { heading: "Batteries + Chargers", items: [
        { name: "A1 / A10 Battery", price: "$10" },
        { name: "B1 Battery", price: "$15" },
        { name: "B2 Battery", price: "$15" },
        { name: "B4 Battery", price: "$20" },
        { name: "B10 Series Battery", price: "$15" },
        { name: "A1 / A10 Charger", price: "$8" },
        { name: "B1 Charger", price: "$15" },
        { name: "B2 Charger", price: "$15" },
        { name: "B4 Charger", price: "$20" },
        { name: "B10 Series Charger", price: "$15" },
      ] },
      { heading: "Triggers & Lighting Accessories", items: [
        { name: "PocketWizard Transceiver", price: "$15" },
        { name: "Connect Pro Remote", price: "$20" },
        { name: "Air Remote (Canon / Nikon / Sony / Fuji / Universal)", price: "$15" },
        { name: "Extension Cable for Pro Head, 5m", price: "$10" },
        { name: "Extension Cable for Acute-D Head, 5m", price: "$10" },
      ] },
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
      title: "Continuous & LED Lighting Rental in Denver — Arri, Aputure",
      description:
        "Rent continuous LED lighting in Denver — Arri SkyPanel, Nanlux Dyno/Evoke, Creamsource, Astera tubes, Kino Flo, LiteMat, and Aputure. Pickup or Denver-metro delivery.",
      keywords: ["continuous lighting rental Denver", "LED lighting rental Denver", "Arri SkyPanel rental Denver", "video lighting rental Denver"],
    },
    brands: ["Arri", "Nanlux", "Aputure", "Kino Flo", "Astera", "Creamsource", "LiteGear", "Quasar", "Litepanels", "Fiilex"],
    groups: [
      { heading: "Lighting Kits (LED)", items: [
        { name: "Litepanels Astra 1×1 Bi-Color", price: "$175" },
        { name: "Fiilex P360EX", price: "$150" },
        { name: "Astera Titan Tube 4', 8× Kit", price: "$550" },
        { name: "Astera Helios Tube 2', 8× Kit", price: "$450" },
        { name: "Quasar Q-Lion Kit 3×2", price: "$120" },
        { name: "Aputure MC 12-Light Production Kit", price: "$100" },
        { name: "Nanlux Dyno 650c Kit", price: "$400" },
        { name: "Nanlux TK-280B Kit", price: "$250" },
      ] },
      { heading: "Individual Lighting (LED)", items: [
        { name: "Nanlux Evoke 1200B", price: "$250" },
        { name: "Nanlux Dyno 1200C", price: "$500" },
        { name: "Nanlux Dyno 650c", price: "$200" },
        { name: "Nanlux TK-280B", price: "$125" },
        { name: "Arri SkyPanel S30", price: "$175" },
        { name: "Arri SkyPanel S60", price: "$250" },
        { name: "Arri L7", price: "$75" },
        { name: "Creamsource Sky 1.2k", price: "$450" },
        { name: "Creamsource Micro", price: "$160" },
        { name: "LiteMat 1×1 Series 2", price: "$90" },
        { name: "LiteMat 1×1 Spectrum", price: "$150" },
        { name: "LiteMat 2 Series 2", price: "$150" },
        { name: "LiteMat 2L Series 2", price: "$175" },
        { name: "LiteMat 2L PLUS", price: "$210" },
        { name: "LiteMat 3 Series 2", price: "$200" },
        { name: "LiteMat 4 Series 2", price: "$225" },
        { name: "LiteMat 4 PLUS", price: "$275" },
        { name: "LiteMat 4 Spectrum", price: "$300" },
        { name: "Colt LED Tube, 2ft", price: "$15" },
        { name: "Colt LED Tube, 4ft", price: "$20" },
        { name: "Quasar 4ft Crossfade Tube", price: "$20" },
        { name: "Kino Flo Celeb 200", price: "$150" },
        { name: "Kino Flo Freestyle 4", price: "$150" },
        { name: "Kino Flo Select 20", price: "$150" },
        { name: "Kino Flo Select 30", price: "$175" },
        { name: "Gemini 1×1' Panel", price: "$175" },
        { name: "Gemini 2×1' Panel", price: "$240" },
        { name: "1×1 Bi-Color LED Panel", price: "$95" },
      ] },
      { heading: "Batteries + Chargers", items: [
        { name: "Core Gold Mount, Single 98 wH Kit", price: "$55" },
        { name: "Core Gold Mount, Single 147 wH Kit", price: "$75" },
        { name: "Core Gold Mount, Dual 98 wH Kit", price: "$105" },
        { name: "Core Gold Mount, Dual 147 wH Kit", price: "$125" },
      ] },
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
    groups: [
      { heading: "Chimera", items: [
        { name: "SuperProPlus, White (Large Softbox)", price: "$30" },
        { name: "Pro II, White (Large Softbox)", price: "$30" },
        { name: "SuperProPlus/X, White (Medium Softbox)", price: "$25" },
        { name: "SuperProPlus, Silver (Medium Softbox)", price: "$25" },
        { name: "SuperProPlus, White (Small Softbox)", price: "$20" },
        { name: "Pro II, White (Small Softbox)", price: "$20" },
        { name: "Pro II, White (Large Strip)", price: "$30" },
        { name: "SuperProPlus, White (Medium Strip)", price: "$25" },
        { name: "SuperProPlus, White (Small Strip)", price: "$20" },
        { name: "Grid for Softbox, Small", price: "$10" },
        { name: "Grid for Strip, Small", price: "$10" },
        { name: "Grid for Strip, Medium", price: "$15" },
      ] },
      { heading: "Octas & Lanterns", items: [
        { name: "Octa 3'", price: "$30" },
        { name: "Octa 5'", price: "$45" },
        { name: "Octa 7' Extension", price: "$25" },
        { name: "24\" Collapsible Beauty Dish / Octa", price: "$25" },
        { name: "30\" Collapsible Beauty Dish / Octa", price: "$30" },
        { name: "Grid for Octa 3'", price: "$15" },
        { name: "Grid for Octa 5'", price: "$20" },
        { name: "Lantern 20\", White", price: "$25" },
      ] },
      { heading: "Profoto Modifiers", items: [
        { name: "Honeycomb Grid Set (5, 10, 20°)", price: "$15" },
        { name: "Zoom Reflector", price: "$8" },
        { name: "Barn Doors", price: "$8" },
        { name: "Grid / Filter Holder, 7\"", price: "$10" },
        { name: "Magnum Reflector", price: "$10" },
        { name: "10° Grid for Magnum", price: "$8" },
        { name: "Snoot", price: "$10" },
        { name: "Beauty Dish, White", price: "$25" },
        { name: "Beauty Dish, Silver", price: "$25" },
        { name: "Diffusion Sock for Beauty Dish", price: "$3" },
        { name: "Grid for Beauty Dish", price: "$10" },
        { name: "Speedring (Quad or Octa)", price: "$3" },
        { name: "Double Head Speedring", price: "$6" },
        { name: "Octa Speedring w/ Support Bracket", price: "$5" },
        { name: "Fresnel Spot", price: "$65" },
        { name: "Softlight Reflector for Ringflash", price: "$15" },
        { name: "Telezoom Reflector", price: "$30" },
        { name: "Hardbox", price: "$25" },
        { name: "Accessories + Modifiers Bag", price: "$20" },
      ] },
      { heading: "Profoto OCF Modifiers", items: [
        { name: "Disc Reflector", price: "$5" },
        { name: "Zoom Reflector", price: "$5" },
        { name: "Barn Door", price: "$5" },
        { name: "Magnum", price: "$8" },
        { name: "Grid Holder + Grid Set (10 / 20 / 30°)", price: "$10" },
        { name: "Grid Holder + Gel Set", price: "$10" },
        { name: "Snoot", price: "$8" },
        { name: "OCF Speedring", price: "$3" },
        { name: "Collapsible Beauty Dish, White, w/ Speedring", price: "$20" },
        { name: "Collapsible Beauty Dish, Silver, w/ Speedring", price: "$20" },
        { name: "Softbox, Square (16×16\"), w/ Speedring", price: "$20" },
        { name: "Softbox, Standard (2×3'), w/ Speedring", price: "$20" },
        { name: "Softbox, Strip (1×3'), w/ Speedring", price: "$20" },
        { name: "Grid for Softbox, Strip (1×3')", price: "$10" },
        { name: "Gel, Qtr CTB", price: "$4" },
        { name: "Gel, Qtr CTO", price: "$4" },
        { name: "Grid (10°)", price: "$4" },
        { name: "Grid + Gel Holder", price: "$6" },
      ] },
      { heading: "Profoto CLIC Modifiers (A1 / A10)", items: [
        { name: "Dome", price: "$3" },
        { name: "Creative Color Gels (Rose Pink, Peacock Blue, Yellow)", price: "$8" },
        { name: "Bounce Card", price: "$3" },
        { name: "Soft Bounce Card", price: "$5" },
      ] },
      { heading: "Umbrellas", items: [
        { name: "Westcott 7' White / Silver / Translucent", price: "$20" },
        { name: "Westcott 45\" White / Silver / Translucent", price: "$5" },
        { name: "Profoto Deep, M (41\") White / Silver / Translucent", price: "$8" },
        { name: "Profoto Deep, L (51\") White / Silver", price: "$10" },
      ] },
      { heading: "SunBounce", items: [
        { name: "Kit — 4×6' Frame + Silk (1/3, 2/3, Full)", price: "$42" },
        { name: "SunSwatter Kit — 4×6' Frame + Silk", price: "$42" },
        { name: "SunBounce, 3×4'", price: "$20" },
        { name: "SunBounce, 4×6'", price: "$25" },
        { name: "SunSwatter Pro, 4×6'", price: "$30" },
        { name: "3×4' Cloths (Zebra Gold & Silver / Silver-White)", price: "$15" },
        { name: "4×6' Cloths (Silk / Zebra / Silver-White)", price: "$20" },
      ] },
      { heading: "Photek", items: [
        { name: "Soft Lighter Kit 36\"", price: "$8" },
        { name: "Soft Lighter Kit 45\"", price: "$10" },
        { name: "Soft Lighter Kit 60\"", price: "$12" },
        { name: "SunBuster 84\"", price: "$30" },
      ] },
      { heading: "Scrim Jim", items: [
        { name: "Frame 8×8'", price: "$30" },
        { name: "Frame 6×6'", price: "$25" },
        { name: "Cloth (diffusion / grid / cine black / silver-white / single net)", price: "$20" },
      ] },
      { heading: "Reflectors, FlexFills, 5-in-1s & V-Flats", items: [
        { name: "Tri-Flector II Kit", price: "$15" },
        { name: "30\" 6-in-1", price: "$6" },
        { name: "42\" 5-in-1", price: "$6" },
        { name: "45\" 6-in-1", price: "$6" },
        { name: "72×40\" Silver / Black", price: "$5" },
        { name: "Omega Reflector", price: "$8" },
        { name: "Reflector Holder", price: "$5" },
        { name: "Eyelighter", price: "$15" },
        { name: "V-Flat, B+W, 40×80\"", price: "$20" },
      ] },
      { heading: "Elinchrom / Bron / Nanlux (w/ Profoto adapter)", items: [
        { name: "Elinchrom Deep Octa, 39\"", price: "$30" },
        { name: "Elinchrom Indirect Octa, 75\"", price: "$75" },
        { name: "Bron Para 177", price: "$225" },
        { name: "Nanlux 45° Reflector for Evoke 1200", price: "$15" },
        { name: "Nanlux Fresnel for Evoke 1200", price: "$95" },
        { name: "Nanlux Barndoors for 650c", price: "$20" },
      ] },
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
        "Rent grip and electrical in Denver — C-stands, MegaBoom, Magliner carts, flags and cutters, 12×12 frames and fabrics, apple boxes, sandbags, and stingers.",
      keywords: ["grip rental Denver", "C-stand rental Denver", "grip equipment rental Denver", "flag and cutter rental Denver"],
    },
    brands: ["Matthews", "Avenger", "Manfrotto", "Magliner", "Cardellini", "Pelican"],
    groups: [
      { heading: "Packing & Transport", items: [
        { name: "Pelican & Lightwave Cases (various)", price: "$15/ea" },
        { name: "Magliner (Senior) w/ Shelf", price: "$45" },
        { name: "FoldIt Cart", price: "$25" },
        { name: "Beach Cart", price: "$25" },
      ] },
      { heading: "Apple Boxes", items: [
        { name: "Apple Box Kit", price: "$10" },
        { name: "Full / Half / Quarter / Eighth", price: "$3/each" },
        { name: "Full / Half / Quarter / Eighth Mini", price: "$3/each" },
      ] },
      { heading: "Flags, Scrims & Cutters", items: [
        { name: "Single Scrim — Black", price: "$5/each" },
        { name: "Double Scrim — Black", price: "$5/each" },
        { name: "Artificial Silk — White", price: "$5/each" },
        { name: "Solid", price: "$5/each" },
        { name: "Scrim / Double / Silk / Solid Kit", price: "$16" },
        { name: "4×4' Floppy Cutter — Top Hinge", price: "$25" },
        { name: "4×4' Floppy Cutter — Bottom Hinge", price: "$25" },
      ] },
      { heading: "Clamps, Heads, Arms & Pins", items: [
        { name: "Super Clamp (Mafer) w/ Stud", price: "$4/each" },
        { name: "Super Clamp (Mafer) w/ J-Hook", price: "$4/each" },
        { name: "2½\" Grip Head", price: "$4/each" },
        { name: "A-Clamp (Micro / S / M / L)", price: "$4/each" },
        { name: "Double Grip Head", price: "$4/each" },
        { name: "Gobo Grip Head", price: "$4/each" },
        { name: "Flex Arm for Super Clamp", price: "$4/each" },
        { name: "Magic Arm", price: "$4/each" },
        { name: "Cardellini Clamp 2\"", price: "$4/each" },
        { name: "Big Ben Clamp", price: "$4/each" },
        { name: "Quacker Clamp", price: "$4/each" },
        { name: "Duckbill Clamp", price: "$4/each" },
        { name: "C-Clamp w/ Pin", price: "$4/each" },
        { name: "Baby Drop Down Pin", price: "$4/each" },
        { name: "Drop Ceiling Scissor Clamp", price: "$4/each" },
        { name: "Stand Adapter 1⅛\" → ⅝\"", price: "$4/each" },
        { name: "Pivoting Boom Arm Clamp", price: "$4/each" },
        { name: "Cold Shoe Flash / Umbrella Holder", price: "$4/each" },
        { name: "Reflector Holder", price: "$4/each" },
      ] },
      { heading: "Booms", items: [
        { name: "Mini Boom", price: "$10" },
        { name: "Super Boom w/ Weight", price: "$20" },
        { name: "MegaBoom", price: "$75" },
        { name: "Roller for Super Boom", price: "$10" },
      ] },
      { heading: "Specialty Grip", items: [
        { name: "AutoPole", price: "$5" },
        { name: "Speedrail, 5'", price: "$5" },
        { name: "Speedrail, Coupler", price: "$3" },
        { name: "Speedrail, Ear", price: "$5" },
      ] },
      { heading: "Stands", items: [
        { name: "C-Stand 40\" w/ Head & Arm", price: "$10" },
        { name: "C-Stand 20\" w/ Head & Arm", price: "$8" },
        { name: "Light Stand", price: "$8" },
        { name: "6\" Baby Plate on Pancake", price: "$8" },
        { name: "High Junior 3-Riser Roller Stand", price: "$20" },
        { name: "Mombo Combo", price: "$20" },
        { name: "Wheeled Wind-Up Stand", price: "$20" },
        { name: "Baby Roller", price: "$15" },
      ] },
      { heading: "Shotbags, Sandbags & Counterweights", items: [
        { name: "5lb Shotbag", price: "$2" },
        { name: "15lb Sandbag", price: "$3" },
        { name: "25lb Sandbag", price: "$5" },
        { name: "35lb Sandbag", price: "$8" },
        { name: "15lb Pumpkin Counterweight", price: "$4" },
      ] },
      { heading: "Frames, Fabrics & Backdrop Support", items: [
        { name: "9' Backdrop Support Kit", price: "$20" },
        { name: "12' Backdrop Support Kit", price: "$30" },
        { name: "Gel Frame (48×48\")", price: "$10" },
        { name: "6×6' Butterfly Frame", price: "$20" },
        { name: "12×12' Butterfly Frame", price: "$30" },
        { name: "12×12' Collapsible Frame (4' lengths)", price: "$35" },
        { name: "6×6' Fabrics (scrim / silk / china silk / griff / solid)", price: "$15" },
        { name: "12×12' Fabrics (scrim / silk / griff / solid / UltraBounce)", price: "$30" },
      ] },
      { heading: "Electrical", items: [
        { name: "Stinger (25 / 50 / 100')", price: "$3" },
        { name: "Power Strip", price: "$3" },
        { name: "UPS", price: "$10" },
      ] },
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
    brands: ["Honda", "Keurig"],
    groups: [
      { heading: "Tables + Chairs", items: [
        { name: "Folding Table, 6'", price: "$10" },
        { name: "Table Linen, White", price: "$10" },
        { name: "Table Linen, Black", price: "$10" },
        { name: "Padded Folding Chair", price: "$4" },
        { name: "Director Chair, Short", price: "$6" },
        { name: "Director Chair, Tall", price: "$8" },
        { name: "Tall Camp Chair", price: "$5" },
        { name: "Posing Stool", price: "$10" },
        { name: "Posing Table", price: "$10" },
      ] },
      { heading: "Generators & Communication", items: [
        { name: "Honda 2000w Generator", price: "$100" },
        { name: "Walkie", price: "$15" },
        { name: "Extra Battery for Walkie", price: "$5" },
      ] },
      { heading: "Special Effects", items: [
        { name: "Smoke Machine", price: "$25" },
        { name: "Fog Machine", price: "$25" },
        { name: "Haze Machine", price: "$25" },
        { name: "Leaf Blower w/ Battery + Charger", price: "$8" },
        { name: "Extra Battery for Leaf Blower", price: "$3" },
      ] },
      { heading: "Electrical", items: [
        { name: "Power Cord (Stinger), Heavy Gauge, 25 / 50 / 100'", price: "$3" },
        { name: "Power Cord (Stinger), Std Gauge, 25 / 50 / 100'", price: "$2" },
        { name: "Power Strip", price: "$5" },
        { name: "Cube Tap", price: "$2" },
        { name: "UPS", price: "$20" },
      ] },
      { heading: "Wardrobe", items: [
        { name: "Steamer, Handheld", price: "$10" },
        { name: "Steamer, Floor", price: "$15" },
        { name: "Wardrobe Rack", price: "$10" },
        { name: "Hangers", price: "$0.25" },
        { name: "Iron", price: "$10" },
        { name: "Ironing Board", price: "$5" },
        { name: "Robe", price: "$4" },
        { name: "Slippers", price: "$4" },
        { name: "Booties (foot covers)", price: "$3" },
        { name: "Towel", price: "$3" },
        { name: "Garment Bags", price: "$2" },
      ] },
      { heading: "Tents & Catering", items: [
        { name: "Pop-Up Tent, 10×10'", price: "$75" },
        { name: "Pop-Up Changing Tent", price: "$5" },
        { name: "Heavy-Duty Pop-Up Changing Tent", price: "$8" },
        { name: "Keurig K-Cup Coffee Machine", price: "$8" },
        { name: "Cooler", price: "$8" },
      ] },
      { heading: "Transport", items: [
        { name: "FoldIt Cart", price: "$45" },
        { name: "Beach Cart", price: "$45" },
        { name: "Magliner w/ Shelf", price: "$45" },
      ] },
      { heading: "Tools", items: [
        { name: "Snow Shovel", price: "$3" },
        { name: "Square Nose Shovel", price: "$3" },
        { name: "Round Nose Shovel", price: "$3" },
        { name: "Push Broom", price: "$3" },
        { name: "Broom & Pan", price: "$3" },
        { name: "Leaf Rake", price: "$3" },
        { name: "Air Compressor", price: "$5" },
      ] },
      { heading: "Miscellaneous", items: [
        { name: "Gas Can, 5 gal", price: "$3" },
        { name: "Furniture Pads", price: "$3" },
        { name: "Tarp, 10×10'", price: "$5" },
        { name: "Ratchet Strap", price: "$3" },
        { name: "Traffic Cone", price: "$5" },
        { name: "Ladder, 6'", price: "$6" },
        { name: "Ladder, 10'", price: "$8" },
        { name: "Ladder, 12'", price: "$10" },
        { name: "Flashlight", price: "$3" },
        { name: "Fire Extinguisher", price: "$3" },
        { name: "Megaphone", price: "$20" },
        { name: "Umbrella, Rain", price: "$2" },
        { name: "Umbrella, Golf", price: "$4" },
        { name: "Vacuum (Corded)", price: "$5" },
        { name: "Vacuum (Battery)", price: "$10" },
        { name: "Bluetooth Speaker", price: "$35" },
        { name: "Collapsible Trash Can", price: "$3" },
        { name: "LED Worklight", price: "$3" },
        { name: "Space Heater", price: "$5" },
      ] },
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
      title: "Photo & Video Accessory Rental in Denver — Gimbals & Audio",
      description:
        "Rent photo and video accessories in Denver — DJI Ronin gimbals, Edelkrone sliders, Manfrotto tripods, SmallHD monitors, Zoom/Rode/Sennheiser audio, and media.",
      keywords: ["gimbal rental Denver", "slider rental Denver", "audio rental Denver", "monitor rental Denver"],
    },
    brands: ["Manfrotto", "Benro", "DJI", "Edelkrone", "Wooden Camera", "SmallHD", "Zoom", "Rode", "Sennheiser", "Kessler"],
    groups: [
      { heading: "Photo Tripods & Heads", items: [
        { name: "Monopod (Manfrotto 334B)", price: "$8" },
        { name: "Travel Tripod (Peak Design Carbon Fiber)", price: "$15" },
        { name: "Travel Tripod (MeFoto RoadTrip Classic)", price: "$15" },
        { name: "Standard Tripod (Manfrotto 190XPro4)", price: "$15" },
        { name: "Heavy-Duty Tripod (Benro TMA47AXL)", price: "$25" },
        { name: "Ball Head (Manfrotto 488RC2)", price: "$8" },
        { name: "Ball Head (FOBA SuperBall)", price: "$15" },
        { name: "Ball Head (Benro B4)", price: "$15" },
        { name: "Geared Head (Manfrotto 405)", price: "$20" },
        { name: "Geared Head (Benro GD3WH)", price: "$15" },
        { name: "Flex / Tilt Head (Edelkrone)", price: "$8" },
      ] },
      { heading: "Video Tripods & Heads", items: [
        { name: "Manfrotto 504HD Head + 546B Tripod", price: "$45" },
        { name: "Manfrotto MVH502A Head + MVT502AM Tripod", price: "$40" },
        { name: "Fluid Head (Benro S8, 17.6 lb payload)", price: "$25" },
        { name: "Mevo Floor Stand", price: "$5" },
        { name: "Mevo Table Stand", price: "$3" },
      ] },
      { heading: "Tripod Add-Ons & Specialty Support", items: [
        { name: "Lateral Side Arm (Manfrotto 131D)", price: "$8" },
        { name: "Quick Release Universal (Edelkrone ONE)", price: "$3" },
        { name: "Suction Cup w/ Camera Support", price: "$15" },
      ] },
      { heading: "Gimbals", items: [
        { name: "DJI OM 5 (w/ fill)", price: "$6" },
        { name: "DJI Ronin RS2 Pro Combo", price: "$65" },
        { name: "DJI R Vertical Camera Mount", price: "$5" },
        { name: "DJI R Roll Axis Counterweight Set", price: "$2" },
        { name: "DJI R Twist Grip Dual Handle", price: "$8" },
        { name: "DJI RS 3D Focus System", price: "$8" },
      ] },
      { heading: "Sliders & Jibs", items: [
        { name: "Edelkrone Slider+ Pro Long", price: "$95" },
        { name: "Edelkrone SliderONE + Motion", price: "$50" },
        { name: "Kessler Pocket Jib Traveler", price: "$25" },
      ] },
      { heading: "Projection", items: [
        { name: "Epson 2600 Lumens, 1280×800 Projector", price: "$20" },
        { name: "Projector Screen, 114\", w/ Stand", price: "$45" },
        { name: "Apple TV", price: "$20" },
      ] },
      { heading: "Video Accessories", items: [
        { name: "Wooden Camera Matte Box & Donut", price: "$95" },
        { name: "SmallHD AC-7 OLED Monitor", price: "$45" },
        { name: "Foldio 10\" 360° Smart Turntable", price: "$10" },
        { name: "Foldio 360° Smart Dome", price: "$15" },
        { name: "Foldio 25\" Light Box", price: "$10" },
      ] },
      { heading: "Microphones & Audio", items: [
        { name: "Wireless Lavalier Kit", price: "$45" },
        { name: "Rode VideoMic Pro Compact Shotgun", price: "$10" },
        { name: "Azden SMX-30 Shotgun", price: "$20" },
        { name: "Comica BoomX-D iPhone Lavalier Kit", price: "$10" },
        { name: "Sennheiser HD 650 Reference Headphones", price: "$25" },
        { name: "Boom Pole w/ XLR Cable", price: "$20" },
        { name: "Fishing Pole Holder", price: "$3" },
        { name: "XLR Cables (mini→XLR, XLR→3.5mm, 10', 15')", price: "$2" },
      ] },
      { heading: "Recorders", items: [
        { name: "Zoom H6 Recorder", price: "$35" },
        { name: "Zoom F3", price: "$40" },
        { name: "Zoom F6", price: "$75" },
      ] },
      { heading: "Media, Readers & Storage", items: [
        { name: "CFexpress Type B, 165GB", price: "$8" },
        { name: "CFexpress Type B, 325GB", price: "$10" },
        { name: "SD UHS-II SDXC, 128GB", price: "$5" },
        { name: "SD UHS-II SDXC, 256GB", price: "$6" },
        { name: "SD UHS-II SDXC, 512GB", price: "$8" },
        { name: "Micro UHS-II SDXC, 256GB", price: "$6" },
        { name: "CFast, 256GB", price: "$8" },
        { name: "CFast, 640GB", price: "$10" },
        { name: "CFast, 1TB", price: "$12" },
        { name: "CFexpress + SD Card Reader", price: "$12" },
        { name: "CFast + SD Card Reader", price: "$12" },
        { name: "2TB SSD USB-C", price: "$10" },
      ] },
    ],
  },
];

/** The ShootPod mobile studio — featured on gear + the hub. */
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
