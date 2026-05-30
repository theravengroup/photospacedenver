import { describe, it, expect } from "vitest";
import { countBillableDays, MULTI_DAY_RATE_CENTS } from "./multi-day";

/**
 * The pricing rule (Dan-confirmed 2026-05-30):
 *   - $925/day flat (MULTI_DAY_RATE_CENTS = 92500)
 *   - Sat + Sun count as 1 billable day together
 *   - NO cap — linear scaling. (The earlier "4-day cap" interpretation was
 *     wrong; a 2-week booking can't price the same as a 4-day booking.)
 *
 * Date-of-week reference (May 2026):
 *   Mon May 25, Tue 26, Wed 27, Thu 28, Fri 29, Sat 30, Sun 31, Mon Jun 1
 */

describe("countBillableDays — weekend collapse, no cap", () => {
  it("3 weekdays Mon-Tue-Wed → 3 billable, $2,775", () => {
    const r = countBillableDays("2026-05-25", "2026-05-27");
    expect(r.calendarDays).toBe(3);
    expect(r.billableDays).toBe(3);
    expect(r.subtotalCents).toBe(3 * MULTI_DAY_RATE_CENTS);
    expect(r.savingsCents).toBe(0);
  });

  it("4 weekdays Mon-Thu → 4 billable, $3,700", () => {
    const r = countBillableDays("2026-05-25", "2026-05-28");
    expect(r.calendarDays).toBe(4);
    expect(r.billableDays).toBe(4);
    expect(r.subtotalCents).toBe(4 * MULTI_DAY_RATE_CENTS);
    expect(r.savingsCents).toBe(0);
  });

  it("5 weekdays Mon-Fri → 5 billable, $4,625 (no cap)", () => {
    const r = countBillableDays("2026-05-25", "2026-05-29");
    expect(r.calendarDays).toBe(5);
    expect(r.billableDaysRaw).toBe(5);
    expect(r.billableDays).toBe(5);
    expect(r.subtotalCents).toBe(5 * MULTI_DAY_RATE_CENTS);
    expect(r.savingsCents).toBe(0);
  });

  it("Mon-Sun (full week) → 5 weekdays + 1 weekend = 6 billable, $5,550", () => {
    const r = countBillableDays("2026-05-25", "2026-05-31");
    expect(r.calendarDays).toBe(7);
    expect(r.billableDaysRaw).toBe(6);
    expect(r.billableDays).toBe(6);
    expect(r.subtotalCents).toBe(6 * MULTI_DAY_RATE_CENTS);
    expect(r.savingsCents).toBe(0);
  });

  it("2 weeks Mon → Sun → Sat → Sun → ... → 12 billable, $11,100", () => {
    // Mon May 25 → Sun Jun 7 (14 calendar days, 2 full weeks)
    const r = countBillableDays("2026-05-25", "2026-06-07");
    expect(r.calendarDays).toBe(14);
    // Each week = 5 weekdays + 1 weekend = 6 billable. 2 weeks = 12.
    expect(r.billableDays).toBe(12);
    expect(r.subtotalCents).toBe(12 * MULTI_DAY_RATE_CENTS);
  });

  it("Full month-ish (Mon May 25 → Fri Jun 19, 26 days) bills linearly", () => {
    const r = countBillableDays("2026-05-25", "2026-06-19");
    expect(r.calendarDays).toBe(26);
    // 26 calendar days = 4 full weeks (28d) minus 2 days. Mon-Sun×3 = 18
    // billable (3 weeks), then Mon-Fri last week = 5 weekdays. Total 23.
    // Walk it: Mon-Fri (5) + SatSun (1) + Mon-Fri (5) + SatSun (1) +
    // Mon-Fri (5) + SatSun (1) + Mon-Fri (5) = 23 billable days.
    expect(r.billableDays).toBe(23);
    expect(r.subtotalCents).toBe(23 * MULTI_DAY_RATE_CENTS);
  });

  it("Fri-Mon (Sat+Sun = 1) → 3 billable, $2,775", () => {
    const r = countBillableDays("2026-05-29", "2026-06-01");
    expect(r.calendarDays).toBe(4);
    expect(r.billableDaysRaw).toBe(3);
    expect(r.billableDays).toBe(3);
    expect(r.subtotalCents).toBe(3 * MULTI_DAY_RATE_CENTS);
  });

  it("Sat alone → 1 billable, $925", () => {
    const r = countBillableDays("2026-05-30", "2026-05-30");
    expect(r.calendarDays).toBe(1);
    expect(r.billableDays).toBe(1);
    expect(r.subtotalCents).toBe(MULTI_DAY_RATE_CENTS);
  });

  it("Sat-Sun together → 1 billable, $925", () => {
    const r = countBillableDays("2026-05-30", "2026-05-31");
    expect(r.calendarDays).toBe(2);
    expect(r.billableDays).toBe(1);
    expect(r.subtotalCents).toBe(MULTI_DAY_RATE_CENTS);
  });

  it("Sun alone → 1 billable (no preceding Saturday to consume it), $925", () => {
    const r = countBillableDays("2026-05-31", "2026-05-31");
    expect(r.calendarDays).toBe(1);
    expect(r.billableDays).toBe(1);
    expect(r.subtotalCents).toBe(MULTI_DAY_RATE_CENTS);
  });

  it("Sat-Mon → weekend(1) + Mon(1) = 2 billable, $1,850", () => {
    const r = countBillableDays("2026-05-30", "2026-06-01");
    expect(r.calendarDays).toBe(3);
    expect(r.billableDays).toBe(2);
    expect(r.subtotalCents).toBe(2 * MULTI_DAY_RATE_CENTS);
  });

  it("Empty or inverted range → zero", () => {
    expect(countBillableDays("", "").billableDays).toBe(0);
    expect(countBillableDays("2026-05-30", "2026-05-29").billableDays).toBe(0);
  });
});
