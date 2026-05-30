/**
 * GET /api/booking/cron/cleanup-holds
 *
 * Vercel cron entrypoint — runs hourly per vercel.json. Calls the
 * `expire_holds_and_bookings` Postgres function which:
 *   1. flips bookings with expired paired-holds from `pending_payment` → `expired`
 *   2. deletes holds that have been expired for >1h (keeps a small debug window)
 *
 * Auth: requires Authorization: Bearer ${CRON_SECRET} when CRON_SECRET is
 * set; otherwise this is a no-auth endpoint and could be hit by anyone.
 * Vercel cron always passes the configured cron secret as the bearer.
 */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  } else {
    // Defense-in-depth: refuse to run without CRON_SECRET in production.
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "CRON_SECRET is not set; refusing to run unauthenticated cron in prod" },
        { status: 503 },
      );
    }
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb.rpc("expire_holds_and_bookings");
  if (error) {
    console.error("[cron] expire_holds_and_bookings failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, expired_bookings: data, at: new Date().toISOString() });
}
