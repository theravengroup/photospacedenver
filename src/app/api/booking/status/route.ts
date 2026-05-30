/**
 * GET /api/booking/status?id=<booking-id>
 *
 * Lightweight read-only endpoint the post-checkout success page polls until
 * the webhook flips the booking to `confirmed`. Returns only the bare minimum
 * — status + appointment label + when + total — so we don't leak PII via a
 * publicly-accessible status check.
 *
 * No auth in v1; the booking id is a UUID (effectively a bearer token).
 * Phase 5 will tighten this with Supabase Auth.
 */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id")?.trim();
  if (!id || !/^[0-9a-f-]{32,}$/i.test(id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("bookings")
    .select("id, status, appointment_type_slug, start_at, end_at, total_cents")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const appt = appointmentTypeBySlug(data.appointment_type_slug);
  return NextResponse.json({
    id: data.id,
    status: data.status,
    appointmentLabel: appt?.label ?? data.appointment_type_slug,
    startAt: data.start_at,
    endAt: data.end_at,
    totalCents: data.total_cents,
  });
}
