/**
 * Curated testimonials for the homepage trust section.
 *
 * Selected from the 17 real testimonials on the live site.
 * Each one was chosen for a distinct credibility job:
 *   - OMS Photography  → operator reliability + Denver positioning
 *   - Drew C           → sole-source / scale of inventory
 *   - Crispin Porter + Bogusky → top-tier agency attribution
 *
 * All quotes used verbatim (Drew C trimmed for layout, with original
 * meaning preserved). No fabrication.
 */

export type Testimonial = {
  quote: string;
  attribution: string;
  role?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Photospace always has the equipment I need for a shoot. Their equipment is always clean and in great working order. It's the premier resource for professional photographers working in, or on location in, Denver.",
    attribution: "OMS Photography",
  },
  {
    quote:
      "Truly the only professional photo studio available to creatives in Denver — an insane amount of equipment, a real cyc wall, and fully controllable curtains. Using this space has made me a better photographer.",
    attribution: "Drew C.",
  },
  {
    quote:
      "Thanks for the amazing studio space, great equipment, and easy booking process.",
    attribution: "Crispin Porter + Bogusky",
    role: "Agency",
  },
];
