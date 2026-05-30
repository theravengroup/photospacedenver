/**
 * confirmBooking — the single source of truth for "this booking is now real."
 *
 * Called from two places:
 *   1) The Stripe webhook on `payment_intent.succeeded`
 *   2) The checkout route's $0 path (free Studio Tour, 100%-off coupon)
 *
 * Effects (in this order, idempotent on already-confirmed):
 *   - Promote booking status to `confirmed`
 *   - Persist the Stripe charge id when supplied
 *   - Consume the paired hold (delete it; the slot is now reserved by the
 *     confirmed booking itself)
 *   - Write a GCal event on `photospace: studio` (errors logged but do NOT
 *     block confirmation — reconciliation happens out of band)
 *   - Record coupon redemption when the booking used a coupon (this is what
 *     enforces per-user usage limits on future bookings)
 *   - Send the customer confirmation email + admin notify (errors logged but
 *     do NOT block — the booking is real either way)
 *
 * Returns `{ ok: true, idempotent?: boolean }`.
 */

import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createEvent } from "@/lib/google/calendar";
import { recordCouponRedemption } from "@/lib/booking/coupons";
import { consumeMemberHours } from "@/lib/booking/member-hours";
import { sendBookingConfirmation } from "@/lib/booking/emails";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";
import { consumeHoldForBooking } from "@/lib/booking/holds";
import type { MemberTier } from "@/lib/booking/types";

type BookingRow = {
  id: string;
  status: string;
  appointment_type_slug: string;
  start_at: string;
  end_at: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_emails: string[] | null;
  customer_phone: string;
  custom_gear_request: string | null;
  coupon_code: string | null;
  total_cents: number;
  member_hours_applied: number | null;
};

export type ConfirmResult =
  | { ok: true; idempotent?: boolean; gcalEventId?: string | null }
  | { ok: false; reason: "booking_not_found" | "db_error"; details?: string };

export async function confirmBooking(opts: {
  bookingId: string;
  stripeChargeId?: string | null;
}): Promise<ConfirmResult> {
  const sb = supabaseAdmin();

  const { data: booking, error: readErr } = await sb
    .from("bookings")
    .select(
      "id, status, appointment_type_slug, start_at, end_at, customer_first_name, customer_last_name, customer_email, customer_emails, customer_phone, custom_gear_request, coupon_code, total_cents, member_hours_applied",
    )
    .eq("id", opts.bookingId)
    .maybeSingle();

  if (readErr) {
    return { ok: false, reason: "db_error", details: readErr.message };
  }
  if (!booking) {
    return { ok: false, reason: "booking_not_found" };
  }

  const row = booking as BookingRow;
  if (row.status === "confirmed") {
    return { ok: true, idempotent: true };
  }

  // 1. Promote status (+ charge id when present)
  const updatePayload: Record<string, unknown> = { status: "confirmed" };
  if (opts.stripeChargeId) {
    updatePayload.stripe_charge_id = opts.stripeChargeId;
  }
  await sb.from("bookings").update(updatePayload).eq("id", row.id);

  // 2. Consume the hold
  await consumeHoldForBooking(row.id);

  const appt = appointmentTypeBySlug(row.appointment_type_slug);
  const customerName = `${row.customer_first_name} ${row.customer_last_name}`.trim();
  const allEmails = [row.customer_email, ...(row.customer_emails ?? [])].filter(Boolean);

  // 3. GCal write — never block confirmation on GCal failure
  let gcalEventId: string | null = null;
  try {
    const gcalEvent = await createEvent({
      summary: `${appt?.label ?? row.appointment_type_slug} — ${customerName}`,
      description: [
        `Customer: ${customerName}`,
        `Email: ${allEmails.join(", ")}`,
        `Phone: ${row.customer_phone}`,
        row.custom_gear_request ? `\nCustom gear request:\n${row.custom_gear_request}` : null,
        `\nTotal: $${(row.total_cents / 100).toFixed(2)}`,
        `Booking ID: ${row.id}`,
      ]
        .filter(Boolean)
        .join("\n"),
      start: new Date(row.start_at),
      end: new Date(row.end_at),
    });
    gcalEventId = gcalEvent.id ?? null;
    if (gcalEventId) {
      await sb.from("bookings").update({ gcal_event_id: gcalEventId }).eq("id", row.id);
    }
  } catch (err) {
    console.error("[confirmBooking] gcal createEvent failed for", row.id, err);
  }

  // 4. Coupon redemption record
  if (row.coupon_code) {
    try {
      await recordCouponRedemption({
        couponCode: row.coupon_code,
        bookingId: row.id,
        customerEmail: row.customer_email,
      });
    } catch (err) {
      console.error("[confirmBooking] recordCouponRedemption failed for", row.id, err);
    }
  }

  // 4b. Member-hours consumption — decrement the member's bucket if the
  // pricing engine applied any free hours to this booking. Pulls tier from
  // the members table (keyed by the customer email).
  const memberHoursToConsume = Number(row.member_hours_applied ?? 0);
  if (memberHoursToConsume > 0) {
    try {
      const { data: memberRow } = await sb
        .from("members")
        .select("tier, email")
        .eq("email", row.customer_email.toLowerCase())
        .eq("status", "active")
        .maybeSingle();
      if (memberRow) {
        const consumeRes = await consumeMemberHours({
          memberEmail: memberRow.email,
          tier: memberRow.tier as MemberTier,
          hoursUsed: memberHoursToConsume,
        });
        if (!consumeRes.ok) {
          console.error(
            "[confirmBooking] consumeMemberHours failed for",
            row.id,
            consumeRes.reason,
          );
        }
      } else {
        console.warn(
          "[confirmBooking] booking applied member hours but no active member found for",
          row.customer_email,
          "— hours not decremented",
        );
      }
    } catch (err) {
      console.error("[confirmBooking] consumeMemberHours threw for", row.id, err);
    }
  }

  // 5. Emails — customer + admin notify
  try {
    await sendBookingConfirmation({
      toEmails: allEmails,
      appointmentSlug: row.appointment_type_slug,
      appointmentLabel: appt?.label ?? row.appointment_type_slug,
      startAt: new Date(row.start_at),
      endAt: new Date(row.end_at),
      totalCents: row.total_cents,
      bookingId: row.id,
      customerFirstName: row.customer_first_name,
    });
  } catch (err) {
    console.error("[confirmBooking] sendBookingConfirmation failed for", row.id, err);
  }

  return { ok: true, gcalEventId };
}
