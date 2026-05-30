import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Coupon } from "./types";

/**
 * Coupon resolver — server-only. Validates a code against the `coupons` table
 * and (for per-user limits) the `coupon_redemptions` log. Returns the
 * decline reason so the UI can show something useful.
 *
 * NOTE: `customerEmail` is trusted only as a *lookup key* — never as an
 * authorization signal. Anyone can guess a code + an email; the email
 * allowlist is the gate. (We tighten with Supabase Auth in 1.3.)
 */

export type CouponDeclineReason =
  | "not_found"
  | "inactive"
  | "not_yet_valid"
  | "expired"
  | "not_applicable_to_type"
  | "not_allowlisted"
  | "usage_limit_reached"
  | "already_used"
  | "db_error";

export type CouponResolution =
  | { ok: true; coupon: Coupon; discountCents: number }
  | { ok: false; reason: CouponDeclineReason };

export async function resolveCoupon(input: {
  code: string;
  customerEmail: string;
  appointmentTypeSlug: string;
  subtotalCents: number;
}): Promise<CouponResolution> {
  const sb = supabaseAdmin();
  const code = input.code.trim().toUpperCase();
  const email = input.customerEmail.toLowerCase().trim();

  const { data: coupon, error } = await sb
    .from("coupons")
    .select("*")
    .eq("code", code)
    .maybeSingle();
  if (error) return { ok: false, reason: "db_error" };
  if (!coupon) return { ok: false, reason: "not_found" };
  if (!coupon.active) return { ok: false, reason: "inactive" };

  const nowMs = Date.now();
  if (coupon.valid_from && new Date(coupon.valid_from).getTime() > nowMs) {
    return { ok: false, reason: "not_yet_valid" };
  }
  if (coupon.valid_until && new Date(coupon.valid_until).getTime() < nowMs) {
    return { ok: false, reason: "expired" };
  }

  if (coupon.applies_to_types && coupon.applies_to_types.length > 0) {
    if (!coupon.applies_to_types.includes(input.appointmentTypeSlug)) {
      return { ok: false, reason: "not_applicable_to_type" };
    }
  }

  if (coupon.email_allowlist && coupon.email_allowlist.length > 0) {
    const allow = coupon.email_allowlist.map((e: string) => e.toLowerCase().trim());
    if (!allow.includes(email)) return { ok: false, reason: "not_allowlisted" };
  }

  // Usage limits
  if (coupon.usage_limit === "n_total" && coupon.max_total_uses != null) {
    const { count } = await sb
      .from("coupon_redemptions")
      .select("*", { head: true, count: "exact" })
      .eq("coupon_code", coupon.code);
    if ((count ?? 0) >= coupon.max_total_uses) {
      return { ok: false, reason: "usage_limit_reached" };
    }
  }
  if (coupon.usage_limit === "1_per_user" || coupon.usage_limit === "n_per_user") {
    const { count } = await sb
      .from("coupon_redemptions")
      .select("*", { head: true, count: "exact" })
      .eq("coupon_code", coupon.code)
      .eq("customer_email", email);
    const limit = coupon.usage_limit === "1_per_user" ? 1 : (coupon.max_uses_per_user ?? 1);
    if ((count ?? 0) >= limit) return { ok: false, reason: "already_used" };
  }

  // Compute discount (capped at subtotal so total never goes negative)
  const rawDiscount =
    coupon.type === "percent"
      ? Math.round(input.subtotalCents * (coupon.value / 100))
      : coupon.value;
  const discountCents = Math.max(0, Math.min(input.subtotalCents, rawDiscount));

  return { ok: true, coupon: coupon as Coupon, discountCents };
}

/**
 * Record a redemption (call at booking confirmation, AFTER payment succeeds).
 * The booking row stores its own `coupon_code` + `coupon_discount_cents`
 * snapshot; this row exists for per-user-usage enforcement on future bookings.
 */
export async function recordCouponRedemption(input: {
  couponCode: string;
  bookingId: string;
  customerEmail: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const sb = supabaseAdmin();
  const { error } = await sb.from("coupon_redemptions").insert({
    coupon_code: input.couponCode.trim().toUpperCase(),
    booking_id: input.bookingId,
    customer_email: input.customerEmail.toLowerCase().trim(),
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
