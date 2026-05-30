/**
 * Multi-day pricing — pure helper functions for the "Multi-day" tier.
 *
 * Rules (Dan-confirmed 2026-05-30, updated after the cap was discovered to
 * collapse for week-and-longer bookings):
 *   - Daily rate = MULTI_DAY_RATE_CENTS ($925, same as the fullday flat)
 *   - Weekends (Sat + Sun) count as 1 billable day together
 *   - Sat-only or Sun-only by themselves count as 1 day
 *   - NO cap. Pricing scales linearly with billable days so 2 weeks costs
 *     2× a week, etc. (The earlier "4-day cap → $3,700 max" interpretation
 *     was wrong — a 2-week booking would price the same as 4 days, which
 *     made no business sense.)
 *
 * Examples (start/end both inclusive calendar dates):
 *   Mon–Tue–Wed                3 billable → $2,775
 *   Mon–Thu (4 weekday)        4 billable → $3,700
 *   Mon–Fri (5 weekday)        5 billable → $4,625
 *   Mon–Sun (whole week)       6 billable (5 weekdays + 1 weekend) → $5,550
 *   Fri–Sat–Sun–Mon            3 billable (Fri + weekend + Mon) → $2,775
 *   Sat alone                  1 billable → $925
 *   Sat–Sun                    1 billable → $925
 *   Sat–Mon                    2 billable (weekend + Mon) → $1,850
 *   2 weeks Mon–Sun × 2        12 billable → $11,100
 *
 * All dates are interpreted in America/Denver. Callers should pass plain
 * YYYY-MM-DD strings; the helper does the calendar walk without timezone math
 * (each day is just a date label).
 */

export const MULTI_DAY_RATE_CENTS = 92500; // $925 — same as fullday flat
export const MULTI_DAY_MIN_DAYS = 2;        // multi-day requires ≥ 2 calendar days

export type MultiDayBreakdown = {
  /** Calendar days from start to end inclusive (1-indexed; min 2 to be valid). */
  calendarDays: number;
  /** Billable days after weekend collapse (= billableDays; kept for back-compat). */
  billableDaysRaw: number;
  /** Billable days the customer is charged for. */
  billableDays: number;
  /** Subtotal in cents (billableDays × MULTI_DAY_RATE_CENTS). */
  subtotalCents: number;
  /** Always 0 now (no cap). Kept in the type so callers don't break. */
  savingsCents: number;
};

/**
 * Count billable days between two YYYY-MM-DD strings (inclusive on both ends),
 * collapsing each Sat+Sun pair into a single billable day. Sat-only and
 * Sun-only each count as 1. Then cap at MULTI_DAY_BILLABLE_CAP.
 */
export function countBillableDays(startISO: string, endISO: string): MultiDayBreakdown {
  if (!startISO || !endISO) {
    return { calendarDays: 0, billableDaysRaw: 0, billableDays: 0, subtotalCents: 0, savingsCents: 0 };
  }

  const start = parseISO(startISO);
  const end = parseISO(endISO);

  if (end.getTime() < start.getTime()) {
    return { calendarDays: 0, billableDaysRaw: 0, billableDays: 0, subtotalCents: 0, savingsCents: 0 };
  }

  const calendarDays =
    Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;

  // Walk the range day-by-day. Each weekday = 1. A Saturday "consumes" its
  // Sunday neighbor (if present) into a single billable day. A Sunday with no
  // preceding Saturday in the range counts on its own.
  let billable = 0;
  let i = 0;
  while (i < calendarDays) {
    const d = addDays(start, i);
    const dow = d.getDay(); // 0=Sun … 6=Sat
    if (dow === 6) {
      // Saturday — consumes following Sunday if it's also in the range
      const sundayInRange = i + 1 < calendarDays;
      billable += 1;
      i += sundayInRange ? 2 : 1;
    } else {
      billable += 1;
      i += 1;
    }
  }

  const billableDays = billable; // no cap — linear scaling
  const subtotalCents = billableDays * MULTI_DAY_RATE_CENTS;

  return {
    calendarDays,
    billableDaysRaw: billable,
    billableDays,
    subtotalCents,
    savingsCents: 0,
  };
}

/** Parse a YYYY-MM-DD string into a Date at local midnight (no TZ math). */
function parseISO(dateISO: string): Date {
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}
