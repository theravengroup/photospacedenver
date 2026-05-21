/**
 * The rental process — calm, operator-voiced.
 * Five steps. The "register once" reality of first-time gear
 * customers is acknowledged inside step 01 rather than as a
 * separate step (keeps the visible path simple).
 */

export type ProcessStep = {
  index: string;
  title: string;
  body: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    index: "01",
    title: "Tell us what you need",
    body: "Send your shoot dates, the gear list (or a brief), and any unknowns. First-time on-location gear renters register once — takes a minute.",
  },
  {
    index: "02",
    title: "We confirm and send the estimate",
    body: "We check availability against your dates, advise on anything we'd swap or add, and send a written estimate — usually same business day.",
  },
  {
    index: "03",
    title: "Pick up — or we deliver",
    body: "Pick up at the Kalamath St. shop, or schedule local Denver delivery. Out-of-town crews: we can stage on arrival.",
  },
  {
    index: "04",
    title: "Shoot",
    body: "Call us if anything comes up. We've been doing this in Denver since 2008 — the answer is usually a fast yes.",
  },
  {
    index: "05",
    title: "Return",
    body: "Drop off when you're done. We'll handle the rest.",
  },
];
