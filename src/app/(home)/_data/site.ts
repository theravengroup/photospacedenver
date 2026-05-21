/**
 * Single source of truth for site-wide constants:
 * brand, contact details, sister site link, primary CTAs.
 *
 * Update once here — propagates everywhere.
 */

export const SITE = {
  brand: "PhotoSpace",
  brandLong: "PhotoSpace Denver",
  tagline: "Denver's home for professional production",
  yearFounded: 2008,
  url: "https://photospacedenver.com",
  studioUrl: "https://photospace.studio",
} as const;

export const CONTACT = {
  phone: "(303) 284-6057",
  phoneHref: "tel:+13032846057",
  email: "hello@photospacedenver.com",
  emailHref: "mailto:hello@photospacedenver.com",
  address: {
    line1: "209 Kalamath St, Unit One",
    line2: "Denver, CO 80223",
  },
  hours: {
    primary: "Mon–Fri · 8:30am – 5:30pm",
    secondary: "24/7 by arrangement",
  },
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=209+Kalamath+St+Unit+One+Denver+CO+80223",
} as const;

/**
 * Destinations. Anything studio-related routes off-site to
 * photospace.studio. Gear / estimate / services point to the existing
 * paths on the live photospacedenver.com (until those pages get
 * rebuilt in a later pass).
 */
export const LINKS = {
  studio: SITE.studioUrl,
  bookStudio: SITE.studioUrl,
  studioMemberships: SITE.studioUrl + "#memberships",
  gear: "/gear",
  gearRegister: "/register",
  estimate: "/estimate",
  services: "/services",
  resources: "/resources",
} as const;

/**
 * Primary nav. Studio + booking are outbound to photospace.studio.
 */
export const NAV_PRIMARY: Array<{
  label: string;
  href: string;
  external?: boolean;
}> = [
  { label: "Gear", href: "#gear" },
  { label: "Why PhotoSpace", href: "#why" },
  { label: "Process", href: "#process" },
  { label: "Studio", href: SITE.studioUrl, external: true },
  { label: "Estimate", href: LINKS.estimate },
];
