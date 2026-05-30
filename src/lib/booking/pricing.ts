/**
 * Pricing engine — pure, server-authoritative function that turns a fully
 * resolved set of pricing inputs into an itemized total. No DB calls, no GCal
 * calls; the caller pre-fetches the inputs (coupon, member-hours-available,
 * etc.) via the dedicated resolvers and passes them in. Easy to unit-test.
 *
 * Order of operations (Dan-confirmed model, 2026-05-29):
 *   1. Member free hours apply first → reduce base to `overage * $65/hr`.
 *      (Add-ons are NOT discounted by membership.)
 *   2. Coupon applies to (base_after_member + add-ons) subtotal — percent or
 *      fixed (cents), capped at subtotal so we never go negative.
 *   3. Processing fee (3% card / 1% ACH / 0 for comp) applied to the
 *      post-coupon subtotal and PASSED TO THE CUSTOMER as a line item.
 *
 * All monetary values are integer cents. Currency is USD.
 */

import type { PricingInput, PricingResult, PricingLineItem } from "./types";

const CARD_FEE_PCT = 3;
const ACH_FEE_PCT = 1;
/** $65/hr — `MEMBERSHIP_TERMS.extraHourRate`. Member overage rate. */
const MEMBER_EXTRA_HOUR_CENTS = 6500;

/**
 * Human-friendly duration for the "Studio booking — X" line item label.
 * Avoids the "0.3333… hrs" horror show that a literal `${hours}` produced
 * for the 20-minute tour.
 *
 * Examples:
 *   0.333… → "20 minutes"
 *   1      → "1 hour"
 *   1.5    → "1h 30m"
 *   5      → "5 hours"
 */
export function formatDuration(hours: number): string {
  const totalMin = Math.round(hours * 60);
  if (totalMin < 60) return `${totalMin} minutes`;
  if (totalMin % 60 === 0) {
    const h = totalMin / 60;
    return `${h} ${h === 1 ? "hour" : "hours"}`;
  }
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

export function calculatePricing(input: PricingInput): PricingResult {
  const { appointment, addons, member, coupon, paymentMethod } = input;
  const { hours, basePriceCents: canonicalBaseCents, slug } = appointment;

  const addonsTotalCents = addons.reduce((s, a) => s + a.priceCents, 0);

  // 1. Member free-hours
  let memberHoursApplied = 0;
  let memberDiscountCents = 0;
  let baseAfterMemberCents = canonicalBaseCents;
  if (member && hours > 0) {
    memberHoursApplied = Math.min(hours, Math.max(0, member.hoursAvailable));
    const overageHours = Math.max(0, hours - memberHoursApplied);
    baseAfterMemberCents = Math.round(overageHours * MEMBER_EXTRA_HOUR_CENTS);
    memberDiscountCents = canonicalBaseCents - baseAfterMemberCents;
  }

  // 2. Subtotal before coupon
  let subtotalCents = baseAfterMemberCents + addonsTotalCents;

  // 3. Coupon
  let couponDiscountCents = 0;
  let couponCode: string | null = null;
  if (coupon) {
    const raw =
      coupon.type === "percent"
        ? Math.round(subtotalCents * (coupon.value / 100))
        : coupon.value;
    couponDiscountCents = Math.max(0, Math.min(subtotalCents, raw));
    couponCode = coupon.code;
    subtotalCents -= couponDiscountCents;
  }

  // 4. Processing fee
  const feePct =
    paymentMethod === "card" ? CARD_FEE_PCT : paymentMethod === "ach" ? ACH_FEE_PCT : 0;
  const processingFeeCents = Math.round(subtotalCents * (feePct / 100));

  const totalCents = subtotalCents + processingFeeCents;

  // 5. Line items for receipts / order summary (sum = totalCents)
  const lineItems: PricingLineItem[] = [];
  lineItems.push({
    key: `appointment:${slug}`,
    label: `Studio booking — ${hours} hr${hours === 1 ? "" : "s"}`,
    amountCents: canonicalBaseCents,
  });
  for (const a of addons) {
    lineItems.push({ key: `addon:${a.slug}`, label: a.label, amountCents: a.priceCents });
  }
  if (memberDiscountCents > 0) {
    lineItems.push({
      key: "member-hours",
      label: `Member free hours (${memberHoursApplied} hr${memberHoursApplied === 1 ? "" : "s"} applied)`,
      amountCents: -memberDiscountCents,
    });
  }
  if (couponDiscountCents > 0 && couponCode) {
    lineItems.push({
      key: `coupon:${couponCode}`,
      label: `Coupon: ${couponCode}`,
      amountCents: -couponDiscountCents,
    });
  }
  if (processingFeeCents > 0) {
    lineItems.push({
      key: "processing-fee",
      label: `Processing fee (${feePct}% ${paymentMethod.toUpperCase()})`,
      amountCents: processingFeeCents,
    });
  }

  return {
    basePriceCents: canonicalBaseCents,
    addons,
    addonsTotalCents,
    memberHoursApplied,
    memberDiscountCents,
    couponCode,
    couponDiscountCents,
    subtotalCents,
    processingFeeCents,
    totalCents,
    lineItems,
    currency: "usd",
  };
}
