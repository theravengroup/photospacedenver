import { describe, it, expect } from "vitest";
import { generateSlots } from "./slots";
import type { BusyWindow } from "./types";

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

const NOW = new Date("2026-06-01T00:00:00Z"); // Mon Jun 1 midnight UTC

function hoursFromNow(n: number): Date {
  return new Date(NOW.getTime() + n * HOUR_MS);
}

const baseInput = {
  durationHours: 2,
  busy: [] as BusyWindow[],
  bufferHours: 2,
  now: NOW,
  minLeadHours: 12,
  maxAdvanceDays: 90,
  granularityHours: 1,
};

describe("generateSlots — empty calendar", () => {
  it("returns hourly slots that fit duration within range", () => {
    const slots = generateSlots({
      ...baseInput,
      rangeStart: new Date("2026-06-15T00:00:00Z"),
      rangeEnd: new Date("2026-06-15T12:00:00Z"),
    });
    // 12-hr window, 2-hr duration, hourly granularity → starts at 0..10h, 11 slots
    expect(slots.length).toBe(11);
    expect(slots.every((s) => s.status === "available")).toBe(true);
  });

  it("respects duration that doesn't fit (range too short)", () => {
    const slots = generateSlots({
      ...baseInput,
      durationHours: 24,
      rangeStart: new Date("2026-06-15T00:00:00Z"),
      rangeEnd: new Date("2026-06-15T12:00:00Z"),
    });
    expect(slots.length).toBe(0);
  });

  it("returns empty for zero/negative duration", () => {
    expect(
      generateSlots({
        ...baseInput,
        durationHours: 0,
        rangeStart: new Date("2026-06-15T00:00:00Z"),
        rangeEnd: new Date("2026-06-15T12:00:00Z"),
      }),
    ).toEqual([]);
  });
});

describe("generateSlots — busy windows + buffer", () => {
  it("a 10:00-12:00 busy window blocks 7:00-13:00 starts (with 2h buffer + 2h duration)", () => {
    const slots = generateSlots({
      ...baseInput,
      rangeStart: new Date("2026-06-15T06:00:00Z"),
      rangeEnd: new Date("2026-06-15T18:00:00Z"),
      busy: [
        {
          start: new Date("2026-06-15T10:00:00Z"),
          end: new Date("2026-06-15T12:00:00Z"),
          source: "booking",
        },
      ],
    });
    const byHour = (h: number) =>
      slots.find((s) => s.start.toISOString() === `2026-06-15T${String(h).padStart(2, "0")}:00:00.000Z`);
    // bufferedStart = 8, bufferedEnd = 14. Slot overlaps if slotStart < 14 AND slotEnd > 8.
    expect(byHour(6)?.status).toBe("available");  // 6→8: end NOT > 8, OK
    expect(byHour(7)?.status).toBe("blocked");    // 7→9: 9>8 + 7<14, conflict
    expect(byHour(12)?.status).toBe("blocked");   // 12→14: 12<14 + 14>8
    expect(byHour(13)?.status).toBe("blocked");   // 13→15: 13<14 + 15>8
    expect(byHour(14)?.status).toBe("available"); // 14→16: 14 NOT < 14
  });

  it("multiple busy windows compound", () => {
    const slots = generateSlots({
      ...baseInput,
      rangeStart: new Date("2026-06-15T00:00:00Z"),
      rangeEnd: new Date("2026-06-15T20:00:00Z"),
      busy: [
        { start: new Date("2026-06-15T08:00:00Z"), end: new Date("2026-06-15T10:00:00Z"), source: "booking" },
        { start: new Date("2026-06-15T15:00:00Z"), end: new Date("2026-06-15T17:00:00Z"), source: "gcal" },
      ],
    });
    expect(slots.filter((s) => s.status === "blocked").length).toBeGreaterThanOrEqual(2);
    expect(slots.find((s) => s.start.toISOString() === "2026-06-15T00:00:00.000Z")?.status).toBe("available");
  });

  it("each conflict source ends up in the reasons list", () => {
    const slots = generateSlots({
      ...baseInput,
      rangeStart: new Date("2026-06-15T09:00:00Z"),
      rangeEnd: new Date("2026-06-15T15:00:00Z"),
      busy: [
        { start: new Date("2026-06-15T11:00:00Z"), end: new Date("2026-06-15T12:00:00Z"), source: "manual_block" },
      ],
    });
    const blocked = slots.find((s) => s.status === "blocked");
    expect(blocked).toBeDefined();
    expect(blocked!.reasons.some((r) => r.includes("manual_block"))).toBe(true);
  });
});

describe("generateSlots — min lead time", () => {
  it("slots strictly inside the 12h window → requires_approval; at-or-after → available", () => {
    const slots = generateSlots({
      ...baseInput,
      rangeStart: hoursFromNow(2),
      rangeEnd: hoursFromNow(20),
    });
    const requiresApproval = slots.filter((s) => s.status === "requires_approval");
    const available = slots.filter((s) => s.status === "available");
    expect(requiresApproval.length).toBeGreaterThan(0);
    expect(available.length).toBeGreaterThan(0);
    for (const s of requiresApproval) {
      expect(s.start.getTime()).toBeLessThan(NOW.getTime() + 12 * HOUR_MS);
    }
    for (const s of available) {
      expect(s.start.getTime()).toBeGreaterThanOrEqual(NOW.getTime() + 12 * HOUR_MS);
    }
  });
});

describe("generateSlots — max advance", () => {
  it("slots beyond max advance days are blocked", () => {
    const rangeStart = new Date(NOW.getTime() + 91 * DAY_MS);
    const slots = generateSlots({
      ...baseInput,
      rangeStart,
      rangeEnd: new Date(rangeStart.getTime() + 6 * HOUR_MS),
    });
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every((s) => s.status === "blocked")).toBe(true);
    expect(slots[0].reasons.some((r) => r.includes("max advance"))).toBe(true);
  });

  it("slots inside max advance pass that check", () => {
    const rangeStart = new Date(NOW.getTime() + 60 * DAY_MS);
    const slots = generateSlots({
      ...baseInput,
      rangeStart,
      rangeEnd: new Date(rangeStart.getTime() + 6 * HOUR_MS),
    });
    expect(slots.every((s) => s.status === "available")).toBe(true);
  });
});

describe("generateSlots — granularity + alignment", () => {
  it("rounds rangeStart up to next granularity boundary", () => {
    const slots = generateSlots({
      ...baseInput,
      rangeStart: new Date("2026-06-15T09:37:00Z"), // mid-hour
      rangeEnd: new Date("2026-06-15T14:00:00Z"),
    });
    // First slot should start at 10:00 (next hour boundary), not 09:37
    expect(slots[0].start.toISOString()).toBe("2026-06-15T10:00:00.000Z");
  });

  it("granularity of 2 hours produces 2-hour-spaced starts", () => {
    const slots = generateSlots({
      ...baseInput,
      granularityHours: 2,
      rangeStart: new Date("2026-06-15T08:00:00Z"),
      rangeEnd: new Date("2026-06-15T16:00:00Z"),
    });
    const starts = slots.map((s) => s.start.toISOString());
    expect(starts).toEqual([
      "2026-06-15T08:00:00.000Z",
      "2026-06-15T10:00:00.000Z",
      "2026-06-15T12:00:00.000Z",
      "2026-06-15T14:00:00.000Z",
    ]);
  });
});
