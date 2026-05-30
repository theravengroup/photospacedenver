/**
 * GET /api/booking/cron/send-reminders
 *
 * Hourly cron — sends a 24h-before reminder email to any confirmed booking
 * whose start_at is in the (now + 23h, now + 25h] window AND whose
 * reminder_sent_at is NULL.
 *
 * Window is 2h wide on purpose: hourly cron + 1h slop means a booking that
 * starts in exactly 24h will be picked up by the cron whose run lands
 * between 23h and 25h ahead. After sending, the row's reminder_sent_at
 * gets stamped so the next run can't double-fire.
 *
 * Gated by Authorization: Bearer ${CRON_SECRET} — Vercel cron sends this
 * automatically.
 */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendBookingReminder } from "@/lib/booking/emails";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Row = {
  id: string;
  appointment_type_slug: string;
  start_at: string;
  end_at: string;
  customer_first_name: string;
  customer_email: string;
  customer_emails: string[] | null;
};

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sb = supabaseAdmin();
  const now = Date.now();
  // 23h…25h ahead window
  const lowerIso = new Date(now + 23 * 3_600_000).toISOString();
  const upperIso = new Date(now + 25 * 3_600_000).toISOString();

  const { data, error } = await sb
    .from("bookings")
    .select(
      "id, appointment_type_slug, start_at, end_at, customer_first_name, customer_email, customer_emails",
    )
    .eq("status", "confirmed")
    .is("reminder_sent_at", null)
    .gte("start_at", lowerIso)
    .lt("start_at", upperIso);

  if (error) {
    console.error("[cron/send-reminders] query failed:", error.message);
    return NextResponse.json({ error: "db_error", details: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as Row[];
  const results: Array<{ id: string; ok: boolean; reason?: string }> = [];

  for (const row of rows) {
    const appt = appointmentTypeBySlug(row.appointment_type_slug);
    const allEmails = [row.customer_email, ...(row.customer_emails ?? [])].filter(Boolean);

    try {
      await sendBookingReminder({
        toEmails: allEmails,
        appointmentSlug: row.appointment_type_slug,
        appointmentLabel: appt?.label ?? row.appointment_type_slug,
        customerFirstName: row.customer_first_name,
        bookingId: row.id,
        startAt: new Date(row.start_at),
        endAt: new Date(row.end_at),
      });

      // Stamp so the next cron run can't double-send.
      await sb
        .from("bookings")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", row.id);

      results.push({ id: row.id, ok: true });
    } catch (err) {
      console.error("[cron/send-reminders] send failed for", row.id, err);
      results.push({
        id: row.id,
        ok: false,
        reason: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({
    ok: true,
    scanned: rows.length,
    sent: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}
