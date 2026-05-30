import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getFreeBusy } from "@/lib/google/calendar";
import type { BusyWindow, AvailabilityResult } from "./types";

/**
 * Availability resolver — server-only. Combines four conflict sources into a
 * single answer:
 *   1. Google Calendar busy windows (existing Acuity events + admin events)
 *   2. Confirmed / pending-payment / pending-approval bookings in our DB
 *   3. Active (non-expired) holds
 *   4. Admin-created manual blocks
 *
 * + 2-hour buffer on both sides (Dan's rule)
 * + 12-hour minimum self-book lead time (sub-12h → requires admin approval)
 * + 90-day max advance window
 *
 * Defaults are pulled from constants here so the rules are documented in one
 * place; callers can override per call if needed (e.g. admin manual booking).
 */

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

export const DEFAULT_BUFFER_HOURS = 2;
export const DEFAULT_MIN_LEAD_HOURS = 12;
export const DEFAULT_MAX_ADVANCE_DAYS = 90;

/**
 * Fetch every busy window in a given range, from all 4 sources, in parallel.
 * GCal failure is logged + ignored (we don't want a 1-sec GCal hiccup to take
 * down the booking flow); a retry queue will be added in Phase 3 for writes.
 */
export async function fetchBusyWindows(input: {
  rangeStart: Date;
  rangeEnd: Date;
}): Promise<BusyWindow[]> {
  const sb = supabaseAdmin();
  const rangeStartIso = input.rangeStart.toISOString();
  const rangeEndIso = input.rangeEnd.toISOString();
  const nowIso = new Date().toISOString();

  const [gcalBusy, bookingsRes, holdsRes, blocksRes] = await Promise.all([
    getFreeBusy(input.rangeStart, input.rangeEnd).catch((err) => {
      console.error("[availability] gcal fetch failed:", err);
      return [] as { start: Date; end: Date }[];
    }),
    sb
      .from("bookings")
      .select("start_at, end_at")
      .in("status", ["pending_payment", "pending_approval", "confirmed"])
      .lt("start_at", rangeEndIso)
      .gt("end_at", rangeStartIso),
    sb
      .from("holds")
      .select("start_at, end_at")
      .gt("expires_at", nowIso)
      .lt("start_at", rangeEndIso)
      .gt("end_at", rangeStartIso),
    sb
      .from("manual_blocks")
      .select("start_at, end_at")
      .lt("start_at", rangeEndIso)
      .gt("end_at", rangeStartIso),
  ]);

  const windows: BusyWindow[] = [];
  for (const b of gcalBusy) {
    windows.push({ start: b.start, end: b.end, source: "gcal" });
  }
  for (const row of bookingsRes.data ?? []) {
    windows.push({
      start: new Date(row.start_at),
      end: new Date(row.end_at),
      source: "booking",
    });
  }
  for (const row of holdsRes.data ?? []) {
    windows.push({
      start: new Date(row.start_at),
      end: new Date(row.end_at),
      source: "hold",
    });
  }
  for (const row of blocksRes.data ?? []) {
    windows.push({
      start: new Date(row.start_at),
      end: new Date(row.end_at),
      source: "manual_block",
    });
  }
  return windows;
}

export async function checkAvailability(input: {
  start: Date;
  end: Date;
  bufferHours?: number;
  minLeadHours?: number;
  maxAdvanceDays?: number;
  now?: Date;
}): Promise<AvailabilityResult> {
  const bufferHours = input.bufferHours ?? DEFAULT_BUFFER_HOURS;
  const minLeadHours = input.minLeadHours ?? DEFAULT_MIN_LEAD_HOURS;
  const maxAdvanceDays = input.maxAdvanceDays ?? DEFAULT_MAX_ADVANCE_DAYS;
  const now = input.now ?? new Date();

  if (input.end.getTime() <= input.start.getTime()) {
    return {
      available: false,
      requiresApproval: false,
      conflicts: [],
      reasons: ["end_before_start"],
    };
  }

  const maxAdvanceCutoff = new Date(now.getTime() + maxAdvanceDays * DAY_MS);
  if (input.start.getTime() > maxAdvanceCutoff.getTime()) {
    return {
      available: false,
      requiresApproval: false,
      conflicts: [],
      reasons: [`beyond max advance window (${maxAdvanceDays} days)`],
    };
  }

  // Expand window by buffer on both sides for the conflict fetch
  const bufferedStart = new Date(input.start.getTime() - bufferHours * HOUR_MS);
  const bufferedEnd = new Date(input.end.getTime() + bufferHours * HOUR_MS);
  const busy = await fetchBusyWindows({ rangeStart: bufferedStart, rangeEnd: bufferedEnd });

  const conflicts: BusyWindow[] = [];
  for (const b of busy) {
    if (
      b.start.getTime() < bufferedEnd.getTime() &&
      b.end.getTime() > bufferedStart.getTime()
    ) {
      conflicts.push(b);
    }
  }

  if (conflicts.length > 0) {
    return {
      available: false,
      requiresApproval: false,
      conflicts,
      reasons: [
        `${conflicts.length} conflict${conflicts.length === 1 ? "" : "s"} within ${bufferHours}h buffer`,
      ],
    };
  }

  // Lead-time check — if otherwise available but inside lead window, mark requires_approval
  const leadCutoff = new Date(now.getTime() + minLeadHours * HOUR_MS);
  if (input.start.getTime() < leadCutoff.getTime()) {
    return {
      available: true,
      requiresApproval: true,
      conflicts: [],
      reasons: [`inside ${minLeadHours}h lead window — requires admin approval`],
    };
  }

  return { available: true, requiresApproval: false, conflicts: [], reasons: [] };
}
