/**
 * Brands and creators that have shot at photospace ("Trusted by top creators in
 * Denver & beyond"). Logo art lives at /public/images/clients/<slug>.png for 22
 * of 26; Nike, Denver Broncos, Jiberish, and Peter Yang have no mark. The wall
 * renders names as text (see ClientLogoWall), so the `logo` paths are kept as
 * ready data for a future logo treatment.
 *
 * Kevin Zacher, Jody Kivort, Joel Barhamand, and Peter Yang are photographers,
 * not brands; the order here is intentionally interleaved so they sit among the
 * brands rather than clustering at the end.
 * TODO(confirm): "Gary Land" was "Garty Land" in the prior audit; corrected to
 * the logo. mitch/staudinger-franke matched from WP mitch-tobias/franke.
 * TODO(confirm): permission/marks usage for each brand.
 */

export type Client = { name: string; slug: string; logo?: string };

export const CLIENTS: Client[] = [
  { name: "Nike", slug: "nike" },
  { name: "Get Outfitted", slug: "get-outfitted", logo: "/images/clients/get-outfitted.png" },
  { name: "Kevin Zacher", slug: "kevin-zacher", logo: "/images/clients/kevin-zacher.png" },
  { name: "Amazon", slug: "amazon", logo: "/images/clients/amazon.png" },
  { name: "Oakley", slug: "oakley", logo: "/images/clients/oakley.png" },
  { name: "Red Robin", slug: "red-robin", logo: "/images/clients/red-robin.png" },
  { name: "Under Armour", slug: "under-armour", logo: "/images/clients/under-armour.png" },
  { name: "Jody Kivort", slug: "jody-kivort", logo: "/images/clients/jody-kivort.png" },
  { name: "Marie Claire", slug: "marie-claire", logo: "/images/clients/marie-claire.png" },
  { name: "New Balance", slug: "new-balance", logo: "/images/clients/new-balance.png" },
  { name: "Mitch", slug: "mitch", logo: "/images/clients/mitch.png" },
  { name: "Allstate", slug: "allstate", logo: "/images/clients/allstate.png" },
  { name: "Peter Yang", slug: "peter-yang" },
  { name: "RH", slug: "rh", logo: "/images/clients/rh.png" },
  { name: "Swell", slug: "swell", logo: "/images/clients/swell.png" },
  { name: "Denver Broncos", slug: "denver-broncos" },
  { name: "Glo", slug: "glo", logo: "/images/clients/glo.png" },
  { name: "Joel Barhamand", slug: "joel-barhamand", logo: "/images/clients/joel-barhamand.png" },
  { name: "Buckle", slug: "buckle", logo: "/images/clients/buckle.png" },
  { name: "Integer", slug: "integer", logo: "/images/clients/integer.png" },
  { name: "Gary Land", slug: "gary-land", logo: "/images/clients/gary-land.png" },
  { name: "EZPZ", slug: "ezpz", logo: "/images/clients/ezpz.png" },
  { name: "Minute Key", slug: "minute-key", logo: "/images/clients/minute-key.png" },
  { name: "Fruit of the Loom", slug: "fruit-of-the-loom", logo: "/images/clients/fruit-of-the-loom.png" },
  { name: "Jiberish", slug: "jiberish" },
  { name: "Staudinger Franke", slug: "staudinger-franke", logo: "/images/clients/staudinger-franke.png" },
];

/** A trimmed 9-mark subset for a shorter marquee (the list is interleaved, not ranked). */
export const CLIENTS_FEATURED = CLIENTS.slice(0, 9);
