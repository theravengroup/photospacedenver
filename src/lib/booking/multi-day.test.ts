import { describe, it, expect } from "vitest";
import { countBillableDays, MULTI_DAY_RATE_CENTS } from "./multi-day";

/**
 * The pricing rule (Dan-confirmed):
 *   - $925/day flat
 *   - Sat + Sun count as 1 billable day together
 *   - Billable days capped at 4 ($3,700)
 *
 * Date-of-week reference (May 2026):
 *   Mon May 25, Tue 26, Wed 27, Thu 28, Fri 29, Sat 30, Sun 31, Mon Jun 1
 */

describe("countBillableDays — weekend collapse + 4-day cap", () => {
  it("3 weekdays Mon-Tue-Wed → 3 billable, $2,775", () => {
    const r = countBillableDays("2026-05-25", "2026-05-27");
    expect(r.calendarDays).toBe(3);
    expect(r.billableDays).toBe(3);
    expect(r.subtotalCents).toBe(3 * MULTI_DAY_RATE_CENTS);
    expect(r.savingsCents).toBe(0);
  });

  it("4 weekdays Mon-Thu → 4 billable, cap of $3,700, no savings", () => {
    const r = countBillableDays("2026-05-25", "2026-05-28");
    expect(r.calendarDays).toBe(4);
    expect(r.billableDays).toBe(4);
    expect(r.subtotalCents).toBe(4 * MULTI_DAY_RATE_CENTS);
    expect(r.savingsCents).toBe(0);
  });

  it("5 weekdays Mon-Fri → 5 raw billable, capped to 4 → $3,700, $925 saved", () => {
    const r = countBillableDays("2026-05-25", "2026-05-29");
    expect(r.calendarDays).toBe(5);
    expect(r.billableDaysRaw).toBe(5);
    expect(r.billableDays).toBe(4);
    expect(r.subtotalCents).toBe(4 * MULTI_DAY_RATE_CENTS);
    expect(r.savingsCents).toBe(MULTI_DAY_RATE_CENTS);
  });

  it("Mon-Sun (full week, 7 cal days) → 6 raw billable (5wd + 1 weekend), capped to 4 → $3,700", () => {
    const r = countBillableDays("2026-05-25", "2026-05-31");
    expect(r.calendarDays).toBe(7);
    expect(r.billableDaysRaw).toBe(6);
    expect(r.billableDays).toBe(4);
    expect(r.subtotalCents).toBe(4 * MULTI_DAY_RATE_CENTS);
    expect(r.savingsCents).toBe(2 * MULTI_DAY_RATE_CENTS);
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
