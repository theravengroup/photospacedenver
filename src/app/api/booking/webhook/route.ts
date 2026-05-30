/**
 * POST /api/booking/webhook
 *
 * Stripe webhook handler — the single point where bookings become `confirmed`,
 * GCal events get written, coupon redemptions are recorded, and confirmation
 * emails go out. Verifies the Stripe signature first; anything else is a 400
 * without touching the DB.
 *
 * Idempotency:
 *   - Stripe retries on non-2xx; same event id can arrive multiple times.
 *   - We use the booking row's `status` as the source of truth: a second
 *     `payment_intent.succeeded` for an already-`confirmed` booking is a no-op.
 *   - DB-level uniqueness on `bookings.stripe_intent_id` is a second line of
 *     defense against a corrupted intent metadata.
 */

import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { constructStripeEvent } from "@/lib/booking/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createEvent, cancelEvent } from "@/lib/google/calendar";
import { recordCouponRedemption } from "@/lib/booking/coupons";
import {
  sendBookingConfirmation,
  sendBookingCancellation,
} from "@/lib/booking/emails";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";
import { consumeHoldForBooking, releaseHoldForBooking } from "@/lib/booking/holds";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type BookingRow = {
  id: string;
  status: string;
  appointment_type_slug: string;
  start_at: string;
  end_at: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_emails: string[];
  customer_phone: string;
  custom_gear_request: string | null;
  coupon_code: string | null;
  total_cents: number;
  stripe_charge_id: string | null;
  gcal_event_id: string | null;
};

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = constructStripeEvent(rawBody, signature);
  } catch (err) {
    console.error(
      "[webhook] signature verification failed:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  const sb = supabaseAdmin();

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const bookingId = (pi.metadata?.booking_id ?? "").trim();
      if (!bookingId) {
        console.warn("[webhook] payment_intent.succeeded without booking_id metadata:", pi.id);
        return NextResponse.json({ ok: true, ignored: "no_booking_id" });
      }

      const { data: booking, error: bErr } = await sb
        .from("bookings")
        .select(
          "id, status, appointment_type_slug, start_at, end_at, customer_first_name, customer_last_name, customer_email, customer_emails, customer_phone, custom_gear_request, coupon_code, total_cents, stripe_charge_id, gcal_event_id",
        )
        .eq("id", bookingId)
        .maybeSingle();
      if (bErr) throw bErr;
      if (!booking) {
        console.warn("[webhook] booking not found for intent metadata:", bookingId);
        return NextResponse.json({ ok: true, ignored: "booking_not_found" });
      }
      const row = booking as BookingRow;

      // Idempotency: already confirmed → success no-op
      if (row.status === "confirmed") {
        return NextResponse.json({ ok: true, idempotent: true, bookingId });
      }

      const chargeId =
        typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id ?? null;

      await sb
        .from("bookings")
        .update({ status: "confirmed", stripe_charge_id: chargeId })
        .eq("id", bookingId);

      await consumeHoldForBooking(bookingId);

      const appt = appointmentTypeBySlug(row.appointment_type_slug);
      const customerName = `${row.customer_first_name} ${row.customer_last_name}`.trim();
      const allEmails = [row.customer_email, ...(row.customer_emails ?? [])].filter(Boolean);

      // GCal event (don't block confirmation on GCal failure)
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
        await sb
          .from("bookings")
          .update({ gcal_event_id: gcalEvent.id })
          .eq("id", bookingId);
      } catch (err) {
        // Reconciliation later — log loudly so an admin notices.
        console.error("[webhook] gcal createEvent failed for booking", bookingId, err);
      }

      // Coupon redemption record (per-user-limit enforcement on future bookings)
      if (row.coupon_code) {
        await recordCouponRedemption({
          couponCode: row.coupon_code,
          bookingId: row.id,
          customerEmail: row.customer_email,
        });
      }

      // Emails — customer + admin
      await sendBookingConfirmation({
        toEmails: allEmails,
        appointmentLabel: appt?.label ?? row.appointment_type_slug,
        startAt: new Date(row.start_at),
        endAt: new Date(row.end_at),
        totalCents: row.total_cents,
        bookingId: row.id,
        customerFirstName: row.customer_first_name,
      });

      return NextResponse.json({ ok: true, confirmed: bookingId });
    }

    if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const bookingId = (pi.metadata?.booking_id ?? "").trim();
      if (bookingId) {
        await releaseHoldForBooking(bookingId);
      }
      return NextResponse.json({ ok: true, payment_failed: bookingId });
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const { data: booking } = await sb
        .from("bookings")
        .select(
          "id, status, appointment_type_slug, start_at, end_at, customer_first_name, customer_last_name, customer_email, customer_emails, customer_phone, custom_gear_request, coupon_code, total_cents, stripe_charge_id, gcal_event_id",
        )
        .eq("stripe_charge_id", charge.id)
        .maybeSingle();
      if (booking) {
        const row = booking as BookingRow;
        if (row.status !== "cancelled") {
          await sb.from("bookings").update({ status: "cancelled" }).eq("id", row.id);
        }
        if (row.gcal_event_id) {
          try {
            await cancelEvent(row.gcal_event_id);
          } catch (err) {
            console.error("[webhook] gcal cancelEvent failed for booking", row.id, err);
          }
        }
        const allEmails = [row.customer_email, ...(row.customer_emails ?? [])].filter(Boolean);
        const appt = appointmentTypeBySlug(row.appointment_type_slug);
        await sendBookingCancellation({
          toEmails: allEmails,
          appointmentLabel: appt?.label ?? row.appointment_type_slug,
          startAt: new Date(row.start_at),
          bookingId: row.id,
          refundedCents: charge.amount_refunded ?? 0,
        });
      }
      return NextResponse.json({ ok: true, refunded: charge.id });
    }

    return NextResponse.json({ ok: true, ignored: event.type });
  } catch (err) {
    console.error(
      "[webhook] handler error:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: "handler_error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
