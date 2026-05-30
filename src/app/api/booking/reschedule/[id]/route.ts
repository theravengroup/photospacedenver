/**
 * POST /api/booking/reschedule/[id]
 *
 * Customer-driven reschedule. Bearer = booking UUID (same model as cancel).
 * Re-runs the live availability check against the new window — explicitly
 * excluding the booking-being-moved so it doesn't see itself as a conflict.
 *
 * Body (hourly):     { startAt, endAt }                       // ISO timestamps
 * Body (multi-day):  { multiDayStartDate, multiDayEndDate }   // YYYY-MM-DD
 *
 * Effects on success:
 *   1. Update booking.start_at / end_at
 *   2. Patch the GCal event to the new time (don't block on failure)
 *   3. Send a "rescheduled" branded email with old → new details
 *   4. Write audit_log entry
 *
 * Constraints:
 *   - Booking must be in a state that can move: pending_payment | confirmed
 *   - For hourly: end-start must equal the appointment's hours (±0.01)
 *   - New window must pass the same availability rules (12h lead, 2h buffer,
 *     90d max-advance) just like a fresh booking
 */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";
import { checkAvailability } from "@/lib/booking/availability";
import { updateEvent } from "@/lib/google/calendar";
import { sendBookingReschedule } from "@/lib/booking/emails";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ReschedBody = {
  startAt?: string;
  endAt?: string;
  multiDayStartDate?: string;
  multiDayEndDate?: string;
};

type BookingRow = {
  id: string;
  status: string;
  appointment_type_slug: string;
  start_at: string;
  end_at: string;
  customer_first_name: string;
  customer_email: string;
  customer_emails: string[] | null;
  total_cents: number;
  gcal_event_id: string | null;
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id || !/^[0-9a-f-]{32,}$/i.test(id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  let body: ReschedBody;
  try {
    body = (await req.json()) as ReschedBody;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data: booking, error: readErr } = await sb
    .from("bookings")
    .select(
      "id, status, appointment_type_slug, start_at, end_at, customer_first_name, customer_email, customer_emails, total_cents, gcal_event_id",
    )
    .eq("id", id)
    .maybeSingle();
  if (readErr) return NextResponse.json({ error: "db_error" }, { status: 500 });
  if (!booking) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const row = booking as BookingRow;
  const moveable = ["pending_payment", "confirmed"];
  if (!moveable.includes(row.status)) {
    return NextResponse.json(
      { error: "not_reschedulable", currentStatus: row.status },
      { status: 409 },
    );
  }

  const appt = appointmentTypeBySlug(row.appointment_type_slug);
  if (!appt) {
    return NextResponse.json({ error: "appointment_type_unknown" }, { status: 500 });
  }

  const isMultiDay = appt.slug === "multi-day";

  // Resolve the new window
  let newStart: Date | null = null;
  let newEnd: Date | null = null;
  if (isMultiDay) {
    if (!body.multiDayStartDate || !body.multiDayEndDate) {
      return NextResponse.json({ error: "missing_multi_day_dates" }, { status: 400 });
    }
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(body.multiDayStartDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.multiDayEndDate)
    ) {
      return NextResponse.json({ error: "invalid_multi_day_dates" }, { status: 400 });
    }
    newStart = denverMidnight(body.multiDayStartDate);
    newEnd = denverMidnight(body.multiDayEndDate, 1);
  } else {
    newStart = body.startAt ? new Date(body.startAt) : null;
    newEnd = body.endAt ? new Date(body.endAt) : null;
  }
  if (!newStart || !newEnd || isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
    return NextResponse.json({ error: "invalid_dates" }, { status: 400 });
  }
  if (newEnd.getTime() <= newStart.getTime()) {
    return NextResponse.json({ error: "end_before_start" }, { status: 400 });
  }

  // Same-window guard — if the customer hits Save without changing anything,
  // we don't want to fire an email + audit entry needlessly.
  const oldStart = new Date(row.start_at);
  const oldEnd = new Date(row.end_at);
  if (
    newStart.getTime() === oldStart.getTime() &&
    newEnd.getTime() === oldEnd.getTime()
  ) {
    return NextResponse.json({ ok: true, unchanged: true });
  }

  // Hourly: duration must match the appointment type
  if (!isMultiDay) {
    const actualHours = (newEnd.getTime() - newStart.getTime()) / 3_600_000;
    if (Math.abs(actualHours - appt.hours) > 0.01) {
      return NextResponse.json({ error: "duration_mismatch" }, { status: 400 });
    }
  }

  // Re-check availability with the booking-being-moved excluded
  const availability = await checkAvailability({
    start: newStart,
    end: newEnd,
    excludeBookingId: row.id,
  });
  if (!availability.available) {
    return NextResponse.json({ error: "not_available", availability }, { status: 409 });
  }
  if (availability.requiresApproval) {
    return NextResponse.json(
      { error: "requires_approval", reasons: availability.reasons },
      { status: 409 },
    );
  }

  // Update the booking row
  const { error: updateErr } = await sb
    .from("bookings")
    .update({
      start_at: newStart.toISOString(),
      end_at: newEnd.toISOString(),
    })
    .eq("id", row.id);
  if (updateErr) {
    return NextResponse.json(
      { error: "db_error", details: updateErr.message },
      { status: 500 },
    );
  }

  // Patch the GCal event (don't block on failure — admin can reconcile)
  if (row.gcal_event_id) {
    try {
      await updateEvent(row.gcal_event_id, { start: newStart, end: newEnd });
    } catch (err) {
      console.error("[reschedule] gcal updateEvent failed for", row.id, err);
    }
  }

  // Send branded reschedule email (old → new)
  const allEmails = [row.customer_email, ...(row.customer_emails ?? [])].filter(Boolean);
  try {
    await sendBookingReschedule({
      toEmails: allEmails,
      appointmentSlug: appt.slug,
      appointmentLabel: appt.label,
      customerFirstName: row.customer_first_name,
      bookingId: row.id,
      oldStart,
      oldEnd,
      newStart,
      newEnd,
      totalCents: row.total_cents,
    });
  } catch (err) {
    console.error("[reschedule] sendBookingReschedule failed for", row.id, err);
  }

  // Audit log
  try {
    await sb.from("audit_log").insert({
      actor: "customer_self_service",
      action: "booking_rescheduled",
      target_id: row.id,
      details: {
        old_start: oldStart.toISOString(),
        old_end: oldEnd.toISOString(),
        new_start: newStart.toISOString(),
        new_end: newEnd.toISOString(),
      },
    });
  } catch (err) {
    console.error("[reschedule] audit_log insert failed for", row.id, err);
  }

  return NextResponse.json({
    ok: true,
    rescheduled: true,
    newStart: newStart.toISOString(),
    newEnd: newEnd.toISOString(),
  });
}

/** YYYY-MM-DD (Denver) → UTC midnight Date. Mirrors /quote + /checkout. */
function denverMidnight(dateISO: string, addDay = 0): Date {
  const [y, m, d] = dateISO.split("-").map(Number);
  const utcMidnight = Date.UTC(y, m - 1, d + addDay);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    timeZoneName: "shortOffset",
    year: "numeric",
  });
  const parts = fmt.formatToParts(new Date(utcMidnight));
  const off = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT-7";
  const match = /GMT([+-]\d+)/.exec(off);
  const hoursOffset = match ? Number(match[1]) : -7;
  return new Date(utcMidnight - hoursOffset * 60 * 60 * 1000);
}
