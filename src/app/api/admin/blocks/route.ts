/**
 * POST /api/admin/blocks
 *
 * Admin endpoint: insert a manual_blocks row that takes a date range out
 * of bookable availability. Gated by isAdmin() (same email allowlist as
 * the /admin pages).
 */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  startDate?: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endDate?: string;   // YYYY-MM-DD (defaults to startDate)
  endTime?: string;   // HH:mm
  reason?: string | null;
};

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  if (!body.startDate || !body.startTime || !body.endTime) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const endDate = body.endDate || body.startDate;
  const startIso = denverIso(body.startDate, body.startTime);
  const endIso = denverIso(endDate, body.endTime);
  if (!startIso || !endIso) {
    return NextResponse.json({ error: "invalid_datetime" }, { status: 400 });
  }
  if (new Date(endIso).getTime() <= new Date(startIso).getTime()) {
    return NextResponse.json({ error: "end_before_start" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("manual_blocks")
    .insert({
      start_at: startIso,
      end_at: endIso,
      reason: body.reason?.trim() || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "db_error", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}

/** Combine YYYY-MM-DD + HH:mm interpreted as America/Denver → UTC ISO. */
function denverIso(dateISO: string, time: string): string | null {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  if ([y, m, d, hh, mm].some((n) => !Number.isFinite(n))) return null;

  // Same trick we use elsewhere — read the Denver offset on that day via
  // Intl, then shift the UTC midnight by the offset + the chosen wall time.
  const utcMidnight = Date.UTC(y, m - 1, d);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    timeZoneName: "shortOffset",
    year: "numeric",
  });
  const parts = fmt.formatToParts(new Date(utcMidnight));
  const off = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT-7";
  const match = /GMT([+-]\d+)/.exec(off);
  const hoursOffset = match ? Number(match[1]) : -7;

  const local = new Date(utcMidnight - hoursOffset * 60 * 60 * 1000);
  local.setUTCHours(local.getUTCHours() + hh, mm);
  return local.toISOString();
}
