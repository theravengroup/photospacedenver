/**
 * Slot generator — pure function that produces hourly candidate start times
 * within a date range and labels each one `available`, `requires_approval`,
 * or `blocked` based on busy windows + 2h buffer + 12h min-lead + 90-day
 * max-advance. The caller fetches busy windows (GCal + bookings + holds +
 * manual blocks) via `availability.fetchBusyWindows` and passes them in.
 *
 * No I/O — entirely testable with Dates + plain objects.
 */

import type { BusyWindow } from "./types";

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

export type GenerateSlotsInput = {
  rangeStart: Date;
  rangeEnd: Date;
  durationHours: number;
  busy: BusyWindow[];
  bufferHours: number;
  now: Date;
  minLeadHours: number;
  maxAdvanceDays: number;
  /** Slot increment in hours. 1 = every hour. */
  granularityHours: number;
};

export type SlotStatus = "available" | "requires_approval" | "blocked";

export type Slot = {
  start: Date;
  end: Date;
  status: SlotStatus;
  reasons: string[];
};

export function generateSlots(input: GenerateSlotsInput): Slot[] {
  const {
    rangeStart,
    rangeEnd,
    durationHours,
    busy,
    bufferHours,
    now,
    minLeadHours,
    maxAdvanceDays,
    granularityHours,
  } = input;

  if (durationHours <= 0) return [];
  if (granularityHours <= 0) return [];

  const results: Slot[] = [];
  const minLeadCutoff = new Date(now.getTime() + minLeadHours * HOUR_MS);
  const maxAdvanceCutoff = new Date(now.getTime() + maxAdvanceDays * DAY_MS);
  const durationMs = durationHours * HOUR_MS;
  const bufferMs = bufferHours * HOUR_MS;

  // Round cursor up to the next granularity-hour boundary on or after rangeStart.
  const cursor = new Date(rangeStart);
  cursor.setMinutes(0, 0, 0);
  while (cursor.getTime() < rangeStart.getTime()) {
    cursor.setTime(cursor.getTime() + granularityHours * HOUR_MS);
  }

  while (cursor.getTime() + durationMs <= rangeEnd.getTime()) {
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor.getTime() + durationMs);
    const reasons: string[] = [];
    let status: SlotStatus = "available";

    // Max advance check
    if (slotStart.getTime() > maxAdvanceCutoff.getTime()) {
      status = "blocked";
      reasons.push(`beyond max advance window (${maxAdvanceDays} days)`);
    }

    // Conflict check w/ buffer — slot is blocked if any busy window overlaps
    // [slotStart - buffer, slotEnd + buffer).
    if (status !== "blocked") {
      const bufferedStart = slotStart.getTime() - bufferMs;
      const bufferedEnd = slotEnd.getTime() + bufferMs;
      for (const b of busy) {
        if (b.start.getTime() < bufferedEnd && b.end.getTime() > bufferedStart) {
          status = "blocked";
          reasons.push(
            `conflicts with ${b.source} ${b.start.toISOString()}–${b.end.toISOString()}`,
          );
        }
      }
    }

    // Min lead time — if still "available" but inside lead window, mark requires_approval
    if (status === "available" && slotStart.getTime() < minLeadCutoff.getTime()) {
      status = "requires_approval";
      reasons.push(`inside ${minLeadHours}h lead window — admin must approve`);
    }

    results.push({ start: slotStart, end: slotEnd, status, reasons });
    cursor.setTime(cursor.getTime() + granularityHours * HOUR_MS);
  }

  return results;
}
