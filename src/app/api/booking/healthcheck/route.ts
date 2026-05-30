/**
 * Booking-system integration smoke-test endpoint.
 *
 * Goal: prove that the Supabase + Google Calendar SDKs in this deployment are
 * actually wired correctly — without spinning up any user-visible UI.
 *
 * Protected by a shared secret (`BOOKING_HEALTHCHECK_TOKEN`). Pass either:
 *   - `Authorization: Bearer <token>` header, or
 *   - `?token=<token>` query string
 *
 * Returns JSON describing each subsystem's reachability. 200 only if both pass.
 *
 *   curl 'https://www.photospacedenver.com/api/booking/healthcheck?token=…'
 *
 * Not for end users — the token gate keeps it private. Remove once Phase 1
 * is fully verified end-to-end.
 */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getFreeBusy } from "@/lib/google/calendar";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SubsystemResult =
  | { ok: true; detail: Record<string, unknown> }
  | { ok: false; error: string };

function extractToken(req: Request): string | null {
  const url = new URL(req.url);
  const fromQuery = url.searchParams.get("token");
  if (fromQuery) return fromQuery;
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

async function checkSupabase(): Promise<SubsystemResult> {
  try {
    const sb = supabaseAdmin();
    // `head: true` returns no rows but exercises the connection + table + RLS-bypass.
    const { error, count } = await sb
      .from("bookings")
      .select("*", { head: true, count: "exact" });
    if (error) throw error;
    return { ok: true, detail: { reachable: true, bookings_count: count ?? 0 } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function checkGoogleCalendar(): Promise<SubsystemResult> {
  try {
    const now = new Date();
    const inOneDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const busy = await getFreeBusy(now, inOneDay);
    return { ok: true, detail: { reachable: true, busy_windows_next_24h: busy.length } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function GET(req: Request) {
  const expected = process.env.BOOKING_HEALTHCHECK_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "BOOKING_HEALTHCHECK_TOKEN is not set in this environment" },
      { status: 500 },
    );
  }
  const provided = extractToken(req);
  if (provided !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const [supabase, gcal] = await Promise.all([checkSupabase(), checkGoogleCalendar()]);
  const allOk = supabase.ok && gcal.ok;

  return NextResponse.json(
    {
      ok: allOk,
      checked_at: new Date().toISOString(),
      supabase,
      gcal,
    },
    { status: allOk ? 200 : 503 },
  );
}
