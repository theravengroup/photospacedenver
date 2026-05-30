/**
 * POST /api/booking/cancel/[id]
 *
 * Customer-driven cancellation. The booking id (UUID) acts as the bearer —
 * whoever has the link in their confirmation email can cancel. Cancellation
 * follows photospace policy (per /policies):
 *   - ≥72 hours before start → full credit on file (rebookable 60 days)
 *   - <72 hours              → non-refundable, but rebookable 60 days
 *
 * No automatic Stripe refund in either case (policy is credit, not cash).
 * Admin can issue an exceptional refund manually via Stripe Dashboard.
 *
 * Effects on success:
 *   1. booking.status → 'cancelled'
 *   2. cancel the GCal event so the slot frees up
 *   3. send cancellation email to the customer (branded HTML)
 *   4. write an audit-log entry
 */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { cancelEvent } from "@/lib/google/calendar";
import { sendBookingCancellation } from "@/lib/booking/emails";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";
import { rateLimit, clientIp, rateLimitHeaders } from "@/lib/booking/rate-limit";

const RATE_LIMIT = 10;
const RATE_REFILL_PER_SEC = 0.1;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type BookingRow = {
  id: string;
  status: string;
  appointment_type_slug: string;
  start_at: string;
  customer_email: string;
  customer_emails: string[] | null;
  total_cents: number;
  gcal_event_id: string | null;
};

const POLICY_CUTOFF_HOURS = 72;
const CREDIT_VALID_DAYS = 60;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const rl = rateLimit(`cancel:${clientIp(req)}`, RATE_LIMIT, RATE_REFILL_PER_SEC);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: rateLimitHeaders(rl, RATE_LIMIT) },
    );
  }

  const { id } = await params;
  if (!id || !/^[0-9a-f-]{32,}$/i.test(id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data: booking, error: readErr } = await sb
    .from("bookings")
    .select(
      "id, status, appointment_type_slug, start_at, customer_email, customer_emails, total_cents, gcal_event_id",
    )
    .eq("id", id)
    .maybeSingle();

  if (readErr) return NextResponse.json({ error: "db_error" }, { status: 500 });
  if (!booking) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const row = booking as BookingRow;
  if (row.status === "cancelled") {
    return NextResponse.json({ ok: true, alreadyCancelled: true });
  }
  if (!["pending_payment", "pending_approval", "confirmed", "held"].includes(row.status)) {
    return NextResponse.json(
      { error: "not_cancellable", currentStatus: row.status },
      { status: 409 },
    );
  }

  const start = new Date(row.start_at);
  const hoursOut = (start.getTime() - Date.now()) / 3_600_000;
  const beforeCutoff = hoursOut >= POLICY_CUTOFF_HOURS;

  // 1. Mark cancelled (always — both policy branches end in cancellation,
  // they just differ on whether the slot is "creditable" vs flat-cancel.)
  const { error: updateErr } = await sb
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", row.id);
  if (updateErr) {
    return NextResponse.json(
      { error: "db_error", details: updateErr.message },
      { status: 500 },
    );
  }

  // 2. Cancel GCal event (don't block cancellation if GCal fails)
  if (row.gcal_event_id) {
    try {
      await cancelEvent(row.gcal_event_id);
    } catch (err) {
      console.error("[cancel] gcal cancelEvent failed for", row.id, err);
    }
  }

  // 3. Send cancellation email — refunded amount is 0 per policy (credit only)
  const allEmails = [row.customer_email, ...(row.customer_emails ?? [])].filter(Boolean);
  const appt = appointmentTypeBySlug(row.appointment_type_slug);
  try {
    await sendBookingCancellation({
      toEmails: allEmails,
      appointmentLabel: appt?.label ?? row.appointment_type_slug,
      startAt: start,
      bookingId: row.id,
      refundedCents: 0,
    });
  } catch (err) {
    console.error("[cancel] sendBookingCancellation failed for", row.id, err);
  }

  // 4. Audit log
  try {
    await sb.from("audit_log").insert({
      actor: "customer_self_service",
      action: "booking_cancelled",
      target_id: row.id,
      details: {
        hours_out: Number(hoursOut.toFixed(2)),
        before_cutoff: beforeCutoff,
        policy_window_hours: POLICY_CUTOFF_HOURS,
        credit_valid_days: CREDIT_VALID_DAYS,
      },
    });
  } catch (err) {
    console.error("[cancel] audit_log insert failed for", row.id, err);
  }

  return NextResponse.json({
    ok: true,
    cancelled: true,
    creditEligible: beforeCutoff,
    creditValidDays: CREDIT_VALID_DAYS,
  });
}
