/**
 * Shared types for the booking system. Server + (some) client code reads these.
 * Plain types only — no runtime side effects so this file is safe everywhere.
 */

export type BookingStatus =
  | "draft"
  | "held"
  | "pending_payment"
  | "pending_approval"
  | "confirmed"
  | "cancelled"
  | "expired";

export type MemberTier = "spark" | "creator" | "visionary";

export type PaymentMethod = "card" | "ach" | "comp";

export type AppointmentType = {
  /** Stable, URL/db-safe identifier. */
  slug: string;
  /** Customer-facing label (matches Acuity wording where possible). */
  label: string;
  /** Duration in hours. */
  hours: number;
  /** Acuity-equivalent base price, in cents. */
  basePriceCents: number;
  /** Grouping for the picker UI. */
  group: "tour" | "rental";
  /** If true, booking enters `pending_approval` (e.g. multi-day, future overnight). */
  requiresApproval?: boolean;
};

export type Addon = {
  slug: string;
  label: string;
  /** What's actually in the kit / what the crew does. Shown in the booking
   * picker so customers know exactly what they're paying for. */
  description?: string;
  priceCents: number;
  group: "strobe" | "video" | "cyc" | "crew" | "fee";
  /** If set, addon is hidden unless booking duration ≥ this many hours. */
  minHours?: number;
  /** If set, addon is hidden unless booking duration ≤ this many hours. */
  maxHours?: number;
};

export type SelectedAddon = {
  slug: string;
  quantity?: number;
};

export type Coupon = {
  code: string;
  type: "percent" | "fixed";
  /** percent: 1-100. fixed: cents. */
  value: number;
  usage_limit: "unlimited" | "n_total" | "1_per_user" | "n_per_user";
  max_total_uses: number | null;
  max_uses_per_user: number | null;
  email_allowlist: string[] | null;
  applies_to_types: string[] | null;
  valid_from: string | null;
  valid_until: string | null;
  stackable: boolean;
  active: boolean;
  notes: string | null;
  created_at: string;
};

export type PricingInput = {
  appointment: { slug: string; hours: number; basePriceCents: number };
  addons: { slug: string; label: string; priceCents: number }[];
  member: { hoursAvailable: number; tier: MemberTier } | null;
  coupon: { code: string; type: "percent" | "fixed"; value: number } | null;
  paymentMethod: PaymentMethod;
};

export type PricingLineItem = {
  key: string;
  label: string;
  amountCents: number; // negative = discount
};

export type PricingResult = {
  basePriceCents: number;
  addons: { slug: string; label: string; priceCents: number }[];
  addonsTotalCents: number;
  memberHoursApplied: number;
  memberDiscountCents: number;
  couponCode: string | null;
  couponDiscountCents: number;
  subtotalCents: number;
  processingFeeCents: number;
  totalCents: number;
  lineItems: PricingLineItem[];
  currency: "usd";
};

export type BusyWindow = {
  start: Date;
  end: Date;
  source: "gcal" | "booking" | "hold" | "manual_block";
};

export type AvailabilityResult = {
  available: boolean;
  requiresApproval: boolean;
  conflicts: BusyWindow[];
  reasons: string[];
};
