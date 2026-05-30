/**
 * Add-ons catalog — every selectable add-on with price (cents) + display label
 * (matches Acuity's wording where it exists) + duration-aware visibility rules.
 *
 * Pure data only.
 *
 * The two-tier tech add-ons (1-5h "halfday" / 6-12h "fullday") show only the
 * matching tier based on the chosen appointment duration — Dan's decision
 * 2026-05-29 (see /docs/ACUITY_MIGRATION_MAP.md § C).
 */

import type { Addon } from "./types";

export const ADDONS: Addon[] = [
  // Strobe
  { slug: "strobe-1",        label: "Strobe: Level One",                                     priceCents: 11000, group: "strobe" },
  { slug: "strobe-2",        label: "Strobe: Level Two",                                     priceCents: 18000, group: "strobe" },
  { slug: "strobe-3",        label: "Strobe: Level Three",                                   priceCents: 20000, group: "strobe" },
  { slug: "strobe-4",        label: "Strobe: Level Four",                                    priceCents: 27000, group: "strobe" },
  { slug: "strobe-pro",      label: "Strobe: Level Pro",                                     priceCents: 30000, group: "strobe" },

  // Video Lighting
  { slug: "video-1",         label: "Video Lighting: Level One",                             priceCents: 13500, group: "video" },
  { slug: "video-2",         label: "Video Lighting: Level Two",                             priceCents: 22500, group: "video" },
  { slug: "video-3",         label: "Video Lighting: Level Three",                           priceCents: 37500, group: "video" },
  { slug: "video-pro",       label: "Video Lighting: Pro (Ultimate Continuous Package)",     priceCents: 57500, group: "video" },

  // Cyclorama paint
  { slug: "cyc-white",       label: "Paint Cyc Wall (white)",                                priceCents: 17500, group: "cyc" },
  { slug: "cyc-custom",      label: "Paint Cyc Wall (custom color, provide paint 72h ahead)",priceCents: 60000, group: "cyc" },

  // Studio Digital Tech — two tiers (per Dan 2026-05-29)
  { slug: "tech-digital-half", label: "Studio Digital Tech (1-5 hours)",                     priceCents: 57500, group: "crew", maxHours: 5 },
  { slug: "tech-digital-full", label: "Studio Digital Tech (6-12 hours)",                    priceCents: 87500, group: "crew", minHours: 6 },

  // Studio Grip / Light Tech — two tiers (per Dan 2026-05-29)
  { slug: "tech-grip-half",   label: "Studio Grip/Light Tech (1-5 hours)",                   priceCents: 47500, group: "crew", maxHours: 5 },
  { slug: "tech-grip-full",   label: "Studio Grip/Light Tech (6-12 hours)",                  priceCents: 67500, group: "crew", minHours: 6 },
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
