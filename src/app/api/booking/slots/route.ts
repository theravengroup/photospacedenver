/**
 * POST /api/booking/slots
 *
 * Returns the list of hourly start slots for a given day + duration. Each slot
 * is labeled `available` | `requires_approval` | `blocked` based on:
 *   - GCal busy windows (Acuity bookings still live during parallel test)
 *   - native bookings (held / pending_payment / pending_approval / confirmed)
 *   - active holds
 *   - admin manual_blocks
 *   - 2h buffer between sessions
 *   - 12h minimum lead time
 *   - 90-day max advance
 *
 * Body: { dateISO: "2026-06-15", hours: 4 }
 * Returns: { slots: [{ startAt, endAt, status }] }
 *
 * Read-only; no DB writes; no auth. Rate-limited via Vercel platform defaults
 * for now; SEC-005 will tighten this in Phase 5.
 */

import { NextResponse } from "next/server";
import { generateSlots } from "@/lib/booking/slots";
import { fetchBusyWindows } from "@/lib/booking/availability";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TZ = "America/Denver";

type SlotsBody = {
  dateISO?: string;
  hours?: number;
};

export async function POST(req: Request) {
  let body: SlotsBody;
  try {
    body = (await req.json()) as SlotsBody;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  if (!body.dateISO || !/^\d{4}-\d{2}-\d{2}$/.test(body.dateISO)) {
    return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  }
  const hours = Number(body.hours);
  if (!Number.isFinite(hours) || hours <= 0 || hours > 12) {
    return NextResponse.json({ error: "invalid_hours" }, { status: 400 });
  }

  // Compute the calendar day's window in America/Denver, then convert to UTC
  // for the busy fetch. Start = local midnight, end = next-day midnight.
  // We use a simple string parse + Denver offset because Intl.DateTimeFormat
  // doesn't expose UTC instants directly.
  const dayStart = denverDayStart(body.dateISO);
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

  // Fetch a slightly-padded window so slots at the very start of the day still
  // see any buffered conflicts that bleed in from earlier.
  const padMs = 2 * 60 * 60 * 1000;
  const busy = await fetchBusyWindows({
    rangeStart: new Date(dayStart.getTime() - padMs),
    rangeEnd: new Date(dayEnd.getTime() + padMs),
  });

  const slots = generateSlots({
    rangeStart: dayStart,
    rangeEnd: dayEnd,
    durationHours: hours,
    busy,
    bufferHours: 2,
    now: new Date(),
    minLeadHours: 12,
    maxAdvanceDays: 90,
    granularityHours: 1,
  });

  return NextResponse.json({
    slots: slots.map((s) => ({
      startAt: s.start.toISOString(),
      endAt: s.end.toISOString(),
      status: s.status,
    })),
  });
}

/**
 * Convert YYYY-MM-DD (interpreted in America/Denver) to the UTC instant of
 * 00:00 local. Handles DST without a tz library by formatting a tentative
 * date with the locale and reading back the offset.
 */
function denverDayStart(dateISO: string): Date {
  const [y, m, d] = dateISO.split("-").map(Number);
  // First approximation: UTC midnight of that calendar date
  const utcMidnight = Date.UTC(y, m - 1, d);
  // Re-format in Denver and pull the actual offset for that wall-clock day
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    timeZoneName: "shortOffset",
    year: "numeric",
  });
  const parts = fmt.formatToParts(new Date(utcMidnight));
  const offsetPart = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT-7";
  // shortOffset looks like "GMT-6" (MDT) or "GMT-7" (MST)
  const match = /GMT([+-]\d+)/.exec(offsetPart);
  const hoursOffset = match ? Number(match[1]) : -7;
  // Denver is GMT-N, so midnight local = midnight UTC + (-N hours) flipped → +N
  return new Date(utcMidnight - hoursOffset * 60 * 60 * 1000);
}
