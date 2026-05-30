"use client";

/**
 * Step 2 for multi-day bookings — replaces the hourly DateTimeStep. Range
 * picker (start + end date) using the existing themed DateRangeCalendar, with
 * a live day-breakdown and "tell us about the shoot" notes field.
 *
 * v1 deliberately skips add-ons; the customer's notes feed the booking's
 * custom_gear_request field so admin can append crew / lighting / paint by
 * hand after the booking lands.
 */

import { useEffect, useState } from "react";
import { CalendarRange, MessageSquare } from "lucide-react";
import { cn } from "@/lib/cn";
import { DateRangeCalendar, type DateRange } from "@/components/ui/DateRangeCalendar";
import type { WizardState } from "../state";

function dateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export function MultiDayStep({
  state,
  onChange,
  onContinue,
  onBack,
}: {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (state.multiDayStartDate && state.multiDayEndDate) {
      return {
        from: new Date(`${state.multiDayStartDate}T12:00:00`),
        to: new Date(`${state.multiDayEndDate}T12:00:00`),
      };
    }
    return undefined;
  });

  // Persist the range back into wizard state whenever it changes.
  useEffect(() => {
    if (range?.from && range?.to) {
      onChange({
        multiDayStartDate: dateISO(range.from),
        multiDayEndDate: dateISO(range.to),
      });
    } else if (range?.from && !range?.to) {
      // Allow single-day "multi-day" pick (start = end)
      onChange({
        multiDayStartDate: dateISO(range.from),
        multiDayEndDate: dateISO(range.from),
      });
    } else {
      onChange({ multiDayStartDate: null, multiDayEndDate: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range?.from?.getTime(), range?.to?.getTime()]);

  const canContinue =
    !!state.multiDayStartDate &&
    !!state.multiDayEndDate &&
    state.multiDayEndDate >= state.multiDayStartDate;

  // Day count summary — purely for display; the price comes from /api/booking/quote
  const calendarDays =
    range?.from && range?.to
      ? Math.round(
          (range.to.getTime() - range.from.getTime()) / (24 * 60 * 60 * 1000),
        ) + 1
      : range?.from
        ? 1
        : 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">Pick your dates</h1>
        <p className="text-muted mt-2 text-base sm:text-lg">
          The studio is yours for every day in the range. Weekends (Sat + Sun)
          count as one billable day; pricing caps at four days, so anything
          longer than a four-day shoot is the same $3,700 flat.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
        <div className="glass-card rounded-card p-4">
          <DateRangeCalendar range={range} onSelect={setRange} />
        </div>

        <div className="glass-card rounded-card p-5 space-y-4">
          <div>
            <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-tungsten font-medium mb-3">
              <CalendarRange className="w-4 h-4" strokeWidth={1.75} aria-hidden />
              Your range
            </h3>
            {!range?.from && (
              <p className="text-base text-muted">
                Tap a start date on the calendar, then tap your end date.
              </p>
            )}
            {range?.from && (
              <div className="text-base">
                <div>
                  <span className="text-muted">Start: </span>
                  <span>{DATE_FMT.format(range.from)}</span>
                </div>
                <div className="mt-1">
                  <span className="text-muted">End: </span>
                  <span>
                    {range.to ? DATE_FMT.format(range.to) : DATE_FMT.format(range.from)}
                  </span>
                </div>
                <div className="mt-2 text-tungsten">
                  {calendarDays} calendar day{calendarDays === 1 ? "" : "s"} —
                  see live total in summary →
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-hairline">
            <label className="flex items-center gap-2 text-base text-muted mb-2">
              <MessageSquare className="w-4 h-4 text-tungsten" strokeWidth={1.75} aria-hidden />
              Tell us about the shoot
              <span className="text-muted/70 font-normal">
                {" "}(optional — but helpful)
              </span>
            </label>
            <textarea
              value={state.customGearRequest}
              onChange={(e) => onChange({ customGearRequest: e.target.value })}
              rows={4}
              className="FIELD w-full"
              placeholder="What you're shooting, crew size, any lighting or paint needs, anything else we should know."
              maxLength={1200}
            />
            <p className="text-xs text-muted mt-2">
              Crew + lighting kits aren&apos;t included on multi-day bookings
              today — describe what you need and we&apos;ll add it to your
              invoice. Or text us first: (303) 284-6057.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted hover:text-current underline underline-offset-4"
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors",
            canContinue
              ? "bg-tungsten text-ink hover:bg-tungsten-soft"
              : "bg-panel text-muted border border-hairline cursor-not-allowed",
          )}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
