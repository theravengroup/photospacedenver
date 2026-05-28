/**
 * Brands that have shot at PhotoSpace ("Trusted by top creators in Denver
 * & beyond"). 19 logos from photospace.studio.
 *
 * TODO(assets): logo files must be added under /public/images/clients/<slug>.svg
 * (pull from WP/studio media: /images/<brand>-180px.webp). Until then the wall
 * renders the brand name in a refined type treatment.
 * TODO(confirm): permission/marks usage for each brand.
 */

export type Client = { name: string; slug: string; logo?: string };

export const CLIENTS: Client[] = [
  { name: "Nike", slug: "nike" },
  { name: "Under Armour", slug: "under-armour" },
  { name: "Amazon", slug: "amazon" },
  { name: "Denver Broncos", slug: "denver-broncos" },
  { name: "New Balance", slug: "new-balance" },
  { name: "Oakley", slug: "oakley" },
  { name: "Marie Claire", slug: "marie-claire" },
  { name: "Allstate", slug: "allstate" },
  { name: "RH", slug: "rh" },
  { name: "Buckle", slug: "buckle" },
  { name: "Fruit of the Loom", slug: "fruit-of-the-loom" },
  { name: "Swell", slug: "swell" },
  { name: "EZPZ", slug: "ezpz" },
  { name: "Glo", slug: "glo" },
  { name: "Integer", slug: "integer" },
  { name: "Jiberish", slug: "jiberish" },
  { name: "Garty Land", slug: "garty-land" },
  { name: "Mitch", slug: "mitch" },
  { name: "Staudinger Franke", slug: "staudinger-franke" },
];

/** A trimmed marquee subset of the most recognizable marks. */
export const CLIENTS_FEATURED = CLIENTS.slice(0, 9);
