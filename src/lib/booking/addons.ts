/**
 * Add-ons catalog — every selectable add-on with price (cents) + display label
 * (matches Acuity's wording where it exists) + duration-aware visibility rules
 * + a `description` so customers know exactly what's in the kit.
 *
 * Descriptions are sourced from the canonical LIGHTING_KITS / STUDIO_CREW
 * declarations in `src/lib/content/pricing-data.ts` — keep them in sync.
 *
 * Pure data only.
 *
 * The two-tier tech add-ons (1-5h "halfday" / 6-12h "fullday") show only the
 * matching tier based on the chosen appointment duration — Dan's decision
 * 2026-05-29 (see /docs/ACUITY_MIGRATION_MAP.md § C).
 */

import type { Addon } from "./types";

export const ADDONS: Addon[] = [
  // Strobe — Profoto D4/Pro-8a packs + Chimera modifiers
  {
    slug: "strobe-1",
    label: "Strobe: Level One",
    description: "One light · Profoto D4 2400ws pack, 1 head, PocketWizard, reflector, softbox",
    priceCents: 11000,
    group: "strobe",
  },
  {
    slug: "strobe-2",
    label: "Strobe: Level Two",
    description: "2-point lighting · Profoto D4 2400ws pack, 2 heads, PocketWizard, 2 reflectors, 2 softboxes",
    priceCents: 18000,
    group: "strobe",
  },
  {
    slug: "strobe-3",
    label: "Strobe: Level Three",
    description: "3-point lighting · Profoto D4 2400ws pack, 3 heads, PocketWizard, 3 reflectors, 3 softboxes",
    priceCents: 20000,
    group: "strobe",
  },
  {
    slug: "strobe-4",
    label: "Strobe: Level Four",
    description: "4-point lighting · 2 Profoto D4 2400ws packs, 4 heads, PocketWizard, 4 reflectors, 4 softboxes",
    priceCents: 27000,
    group: "strobe",
  },
  {
    slug: "strobe-pro",
    label: "Strobe: Level Pro",
    description: "Ultimate package · 2 Profoto Pro-8a 2400ws packs (Air Remote), 4 Pro heads, 4 reflectors, 4 softboxes, beauty dish",
    priceCents: 30000,
    group: "strobe",
  },

  // Video Lighting — Fiilex / Astra / Nanlux LED
  {
    slug: "video-1",
    label: "Video Lighting: Level One",
    description: "3-light LED · 3 Fiilex P360 heads, 3 barndoors, 3 diffusers, 3 standard umbrellas",
    priceCents: 13500,
    group: "video",
  },
  {
    slug: "video-2",
    label: "Video Lighting: Level Two",
    description: "Panel kit · 2 Astra LED panels, 2 Chimera softboxes",
    priceCents: 22500,
    group: "video",
  },
  {
    slug: "video-3",
    label: "Video Lighting: Level Three",
    description: "High output · 2 Nanlux Dyno 650c",
    priceCents: 37500,
    group: "video",
  },
  {
    slug: "video-pro",
    label: "Video Lighting: Pro",
    description: "Ultimate continuous package · 2 Nanlux Dyno 650c + 2 Nanlux TK-280B",
    priceCents: 57500,
    group: "video",
  },

  // Cyclorama paint
  {
    slug: "cyc-white",
    label: "Paint cyc wall (white)",
    description: "Fresh white repaint of the cove. Done before your session — returned spotless for the next shoot.",
    priceCents: 17500,
    group: "cyc",
  },
  {
    slug: "cyc-custom",
    label: "Paint cyc wall (custom color)",
    description: "Custom color repaint — you supply the paint at least 72 hours ahead.",
    priceCents: 60000,
    group: "cyc",
  },

  // Studio Grip / Light Tech — two duration tiers (Dan's preferred order:
  // grip first, digital second).
  {
    slug: "tech-grip-half",
    label: "Studio Grip / Light Tech (1–5 hours)",
    description: "Builds sets and runs lighting — extra hands on the floor.",
    priceCents: 47500,
    group: "crew",
    maxHours: 5,
  },
  {
    slug: "tech-grip-full",
    label: "Studio Grip / Light Tech (6–12 hours)",
    description: "Full-day grip / light tech — set build, lighting, on-set support.",
    priceCents: 67500,
    group: "crew",
    minHours: 6,
  },

  // Studio Digital Tech — two duration tiers
  {
    slug: "tech-digital-half",
    label: "Studio Digital Tech (1–5 hours)",
    description: "Runs every part of a tethered shoot — Capture One, Lightroom, Phocus.",
    priceCents: 57500,
    group: "crew",
    maxHours: 5,
  },
  {
    slug: "tech-digital-full",
    label: "Studio Digital Tech (6–12 hours)",
    description: "Full-day digital tech — Capture One, Lightroom, Phocus, on-set workflow.",
    priceCents: 87500,
    group: "crew",
    minHours: 6,
  },
];

export function addonBySlug(slug: string): Addon | undefined {
  return ADDONS.find((a) => a.slug === slug);
}

/**
 * Return only the add-ons selectable for a given appointment duration.
 * Hides the wrong tier of the duration-aware tech add-ons.
 */
export function addonsForDuration(hours: number): Addon[] {
  return ADDONS.filter((a) => {
    if (a.minHours !== undefined && hours < a.minHours) return false;
    if (a.maxHours !== undefined && hours > a.maxHours) return false;
    return true;
  });
}
