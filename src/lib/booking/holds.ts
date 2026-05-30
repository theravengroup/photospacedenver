import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Holds wrapper — calls the `create_booking_hold` Postgres function which
 * atomically (a) acquires an advisory lock to serialize concurrent attempts,
 * (b) checks for conflicting bookings + holds + manual blocks (with 2h
 * buffer where appropriate), and (c) inserts both a `bookings` row
 * (status='pending_payment') and a paired `holds` row.
 *
 * Returns the new booking id + hold id + expiry on success; a typed reason
 * on conflict. The caller (checkout endpoint) renders the response.
 *
 * Note: GCal busy windows are NOT re-checked inside the function — that
 * remote API call happens in TypeScript before this call, via
 * `availability.checkAvailability`. The race window between those two
 * checks is sub-second.
 */

import type { PricingResult } from "./types";

export type CreateHoldInput = {
  appointmentTypeSlug: string;
  startAt: Date;
  endAt: Date;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    additionalEmails?: string[];
    phone: string;
    customGearRequest?: string | null;
  };
  pricing: PricingResult;
  policiesAcceptedAt: Date;
  ttlMinutes?: number;
  bufferMinutes?: number;
};

export type CreateHoldFailureReason =
  | "conflict_with_booking"
  | "conflict_with_hold"
  | "blocked"
  | "db_error";

export type CreateHoldResult =
  | { ok: true; bookingId: string; holdId: string; expiresAt: Date }
  | { ok: false; reason: CreateHoldFailureReason; details?: string };

export async function createBookingHold(input: CreateHoldInput): Promise<CreateHoldResult> {
  const sb = supabaseAdmin();
  const { pricing } = input;

  const { data, error } = await sb.rpc("create_booking_hold", {
    p_appointment_type_slug: input.appointmentTypeSlug,
    p_start: input.startAt.toISOString(),
    p_end: input.endAt.toISOString(),
    p_customer_first_name: input.customer.firstName,
    p_customer_last_name: input.customer.lastName,
    p_customer_email: input.customer.email,
    p_customer_emails: input.customer.additionalEmails ?? [],
    p_customer_phone: input.customer.phone,
    p_custom_gear_request: input.customer.customGearRequest ?? null,
    p_addons: pricing.addons,
    p_base_price_cents: pricing.basePriceCents,
    p_coupon_code: pricing.couponCode,
    p_coupon_discount_cents: pricing.couponDiscountCents,
    p_member_hours_applied: pricing.memberHoursApplied,
    p_member_discount_cents: pricing.memberDiscountCents,
    p_processing_fee_cents: pricing.processingFeeCents,
    p_total_cents: pricing.totalCents,
    p_policies_accepted_at: input.policiesAcceptedAt.toISOString(),
    p_ttl_minutes: input.ttlMinutes ?? 15,
    p_buffer_minutes: input.bufferMinutes ?? 120,
  });

  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("booking_window_conflict_with_booking"))
      return { ok: false, reason: "conflict_with_booking", details: msg };
    if (msg.includes("booking_window_conflict_with_hold"))
      return { ok: false, reason: "conflict_with_hold", details: msg };
    if (msg.includes("booking_window_blocked"))
      return { ok: false, reason: "blocked", details: msg };
    return { ok: false, reason: "db_error", details: msg };
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return { ok: false, reason: "db_error", details: "no row returned from create_booking_hold" };
  }
  const row = Array.isArray(data) ? data[0] : data;
  return {
    ok: true,
    bookingId: row.booking_id as string,
    holdId: row.hold_id as string,
    expiresAt: new Date(row.expires_at as string),
  };
}

/** Used by the webhook handler when payment succeeds — the booking row already
 *  blocks the window, so the paired hold can be deleted. */
export async function consumeHoldForBooking(bookingId: string): Promise<void> {
  const sb = supabaseAdmin();
  await sb.from("holds").delete().eq("booking_id", bookingId);
}

/** Used by the webhook handler when payment FAILS — both the hold and the
 *  pending booking are removed so the window frees up immediately. */
export async function releaseHoldForBooking(bookingId: string): Promise<void> {
  const sb = supabaseAdmin();
  await sb.from("holds").delete().eq("booking_id", bookingId);
  await sb
    .from("bookings")
    .update({ status: "expired" })
    .eq("id", bookingId)
    .eq("status", "pending_payment");
}
