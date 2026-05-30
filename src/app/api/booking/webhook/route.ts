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
import { cancelEvent } from "@/lib/google/calendar";
import { sendBookingCancellation } from "@/lib/booking/emails";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";
import { releaseHoldForBooking } from "@/lib/booking/holds";
import { confirmBooking } from "@/lib/booking/confirm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RefundBookingRow = {
  id: string;
  status: string;
  appointment_type_slug: string;
  start_at: string;
  customer_email: string;
  customer_emails: string[] | null;
  total_cents: number;
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

      const chargeId =
        typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id ?? null;

      const result = await confirmBooking({ bookingId, stripeChargeId: chargeId });
      if (!result.ok) {
        if (result.reason === "booking_not_found") {
          console.warn("[webhook] booking not found for intent metadata:", bookingId);
          return NextResponse.json({ ok: true, ignored: "booking_not_found" });
        }
        throw new Error(`confirm_failed:${result.reason}:${result.details ?? ""}`);
      }
      return NextResponse.json({
        ok: true,
        bookingId,
        idempotent: result.idempotent ?? false,
      });
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
          "id, status, appointment_type_slug, start_at, customer_email, customer_emails, total_cents, gcal_event_id",
        )
        .eq("stripe_charge_id", charge.id)
        .maybeSingle();
      if (booking) {
        const row = booking as RefundBookingRow;
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
