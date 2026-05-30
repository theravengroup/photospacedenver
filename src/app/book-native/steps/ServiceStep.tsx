"use client";

/**
 * Step 1 — pick a session length.
 *
 * IA redesign (2026-05-30, Dan-confirmed):
 *   - One atomic unit: a duration chip. Every chip is identical in size +
 *     shape so the eye doesn't have to recalibrate per row.
 *   - Chips are grouped under category eyebrow rows that carry the
 *     pricing-model semantics (`· hourly` vs `· flat`).
 *   - Tour and Multi-day are full-width bookend panels because they're
 *     conceptually different choices (free pre-visit / multi-day) — they
 *     earn their own real estate instead of being squeezed into a chip row.
 *
 * The earlier 5-card grid mixed cards-with-picker-inside (Quick/Day) with
 * cards-that-are-themselves-the-pick (Half day/Full day/Multi-day), which
 * produced the visual mess Dan called out: irregular content, wrapped
 * display type, "Tap to pick" filler in the empty cards.
 */

import { Compass, Zap, Sunrise, Sun, Sunset, CalendarDays, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { WizardState } from "../state";

type HourOption = {
  /** Label on the chip (e.g. "2h" or "10–12h"). */
  label: string;
  /** Actual hours the system books. */
  hours: number;
  priceCents: number;
};

type DurationGroup = {
  id: "quick" | "halfday" | "longer" | "fullday";
  /** Eyebrow label above the chip row (e.g. "QUICK"). */
  label: string;
  /** Small subtitle after the label (e.g. "hourly" / "flat"). */
  rateModel: string;
  /** Lucide icon for the eyebrow. */
  icon: typeof Zap;
  options: HourOption[];
};

/** The four duration groups, in natural reading order (short → long).
 *  Paired below into 2 rows: [QUICK | HALF DAY], [LONGER | FULL DAY] — so
 *  each flat-rate option sits visually beside its hourly ladder. */
const GROUPS: DurationGroup[] = [
  {
    id: "quick",
    label: "Quick",
    rateModel: "hourly",
    icon: Zap,
    options: [
      { label: "2h", hours: 2, priceCents: 20000 },
      { label: "3h", hours: 3, priceCents: 29500 },
      { label: "4h", hours: 4, priceCents: 39000 },
    ],
  },
  {
    id: "halfday",
    label: "Half day",
    rateModel: "flat",
    icon: Sunrise,
    options: [{ label: "5h", hours: 5, priceCents: 48500 }],
  },
  {
    id: "longer",
    label: "Longer",
    rateModel: "hourly",
    icon: Sun,
    options: [
      { label: "6h", hours: 6, priceCents: 57500 },
      { label: "7h", hours: 7, priceCents: 66500 },
      { label: "8h", hours: 8, priceCents: 75500 },
      { label: "9h", hours: 9, priceCents: 84000 },
    ],
  },
  {
    id: "fullday",
    label: "Full day",
    rateModel: "flat",
    icon: Sunset,
    options: [{ label: "10–12h", hours: 12, priceCents: 92500 }],
  },
];

/** Group pairs for the 2-row layout. [hourly, flat]. */
const GROUP_PAIRS: [DurationGroup, DurationGroup][] = [
  [GROUPS[0], GROUPS[1]], // QUICK | HALF DAY
  [GROUPS[2], GROUPS[3]], // LONGER | FULL DAY
];

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

function appointmentSlugForHours(hours: number): string {
  if (hours === 5) return "hourly-5-halfday";
  if (hours === 12) return "hourly-12-fullday";
  return `hourly-${hours}`;
}

export function ServiceStep({
  state,
  onChange,
  onContinue,
}: {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  onContinue: () => void;
}) {
  function pickTour() {
    onChange({ appointmentTypeSlug: "tour", hours: 20 / 60 });
  }
  function pickOption(opt: HourOption) {
    onChange({
      appointmentTypeSlug: appointmentSlugForHours(opt.hours),
      hours: opt.hours,
    });
  }
  function pickMultiDay() {
    onChange({ appointmentTypeSlug: "multi-day", hours: 0 });
  }

  const tourSelected = state.appointmentTypeSlug === "tour";
  const multiDaySelected = state.appointmentTypeSlug === "multi-day";
  const hoursSelected = !tourSelected && !multiDaySelected ? state.hours : null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">Book the studio</h1>
        <p className="text-muted mt-2 text-base sm:text-lg">
          1,900 sq ft of controllable daylight in Denver — remote-controlled
          blinds on every window, full cove, 24/7 keyless access. Photo or
          video. Pick a length and we&apos;ll find you a time.
        </p>
      </header>

      {/* Top bookend — free tour. Special because it's a pre-visit, not a
          billable session. */}
      <BookendPanel
        icon={Compass}
        eyebrow="Free studio tour"
        headline="20 minutes"
        sub="See the space in person before you book a real session."
        trailingLabel="Free"
        selected={tourSelected}
        onClick={pickTour}
      />

      {/* The main length picker. One consistent chip; categories carry the
          rate-model context. Groups paired by row — each row has an hourly
          ladder on the left and its flat-rate counterpart on the right,
          separated by a vertical hairline divider. Parent grid uses
          `[auto_auto]` columns so the dividers align across both rows
          (Row 1's hourly = QUICK (3 chips); Row 2's hourly = LONGER
          (4 chips) — without a shared parent grid the divider positions
          would differ). */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xs uppercase tracking-[0.16em] text-muted font-medium">
            Choose a length
          </h2>
          <span className="h-px flex-1 bg-hairline" aria-hidden />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_auto] gap-x-10 gap-y-8">
          {GROUP_PAIRS.map(([hourly, flat]) => (
            <Pair key={hourly.id} hourly={hourly} flat={flat} hoursSelected={hoursSelected} onPick={pickOption} />
          ))}
        </div>
      </section>

      {/* Bottom bookend — multi-day. Special because it picks a date range,
          not an hour count. */}
      <BookendPanel
        icon={CalendarDays}
        eyebrow="Multi-day rental"
        headline="2+ days"
        sub="Weekend (Sat + Sun) counts as one billable day. Capped at 4 days."
        trailingLabel="$925 / day · cap $3,700"
        selected={multiDaySelected}
        onClick={pickMultiDay}
      />

      <div className="pt-4 flex justify-end">
        <button
          type="button"
          disabled={!state.appointmentTypeSlug}
          onClick={onContinue}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-medium transition-all duration-200 ease-cinematic",
            state.appointmentTypeSlug
              ? "bg-tungsten text-ink hover:bg-tungsten-soft hover:shadow-[0_8px_22px_-8px_rgba(200,132,43,0.55)] hover:-translate-y-px"
              : "bg-panel text-muted border border-hairline cursor-not-allowed",
          )}
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Pair — a single row of the length picker. Renders the hourly group as
 * the left column and its flat-rate counterpart as the right column,
 * separated by a vertical hairline divider on lg+. On mobile they stack
 * with no divider.
 */
function Pair({
  hourly,
  flat,
  hoursSelected,
  onPick,
}: {
  hourly: DurationGroup;
  flat: DurationGroup;
  hoursSelected: number | null;
  onPick: (opt: HourOption) => void;
}) {
  return (
    <>
      <GroupCol group={hourly} hoursSelected={hoursSelected} onPick={onPick} />
      <div className="lg:border-l lg:border-hairline lg:pl-10">
        <GroupCol group={flat} hoursSelected={hoursSelected} onPick={onPick} />
      </div>
    </>
  );
}

/**
 * GroupCol — eyebrow row + chip cluster for a single duration group.
 */
function GroupCol({
  group,
  hoursSelected,
  onPick,
}: {
  group: DurationGroup;
  hoursSelected: number | null;
  onPick: (opt: HourOption) => void;
}) {
  const GroupIcon = group.icon;
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <GroupIcon
          className="w-4 h-4 text-tungsten translate-y-0.5"
          strokeWidth={1.75}
          aria-hidden
        />
        <h3 className="text-sm uppercase tracking-[0.16em] text-tungsten font-medium">
          {group.label}
        </h3>
        <span className="text-sm text-muted">· {group.rateModel}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.options.map((opt) => {
          const active = hoursSelected === opt.hours;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onPick(opt)}
              aria-pressed={active}
              className={cn(
                "min-w-[7.5rem] rounded-card px-4 py-3 text-left transition-all duration-200 ease-cinematic",
                "border whitespace-nowrap",
                active
                  ? "bg-tungsten text-ink border-tungsten shadow-[0_8px_22px_-8px_rgba(200,132,43,0.5)]"
                  : "border-hairline bg-panel hover:border-tungsten hover:-translate-y-px hover:bg-tungsten/5",
              )}
            >
              <span
                className={cn(
                  "block font-display text-xl leading-tight",
                  active ? "text-ink" : "text-bone",
                )}
              >
                {opt.label}
              </span>
              <span
                className={cn(
                  "block text-sm mt-0.5",
                  active ? "text-ink/70" : "text-muted",
                )}
              >
                {dollars(opt.priceCents)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * BookendPanel — full-width tungsten-tinted glass panel used for the Tour
 * and Multi-day bookends. Same visual weight as a tier card but stretched
 * wide so it reads as "this is its own concept", not part of the chip row.
 */
function BookendPanel({
  icon: Icon,
  eyebrow,
  headline,
  sub,
  trailingLabel,
  selected,
  onClick,
}: {
  icon: typeof Compass;
  eyebrow: string;
  headline: string;
  sub: string;
  trailingLabel: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "w-full text-left rounded-card p-5 sm:p-6",
        "glass-card glass-card-hover",
        "flex flex-wrap items-center gap-4 sm:gap-6",
        selected && "glass-card--active",
      )}
    >
      <span className="icon-chip icon-chip--lg" aria-hidden>
        <Icon className="w-6 h-6" strokeWidth={1.75} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs uppercase tracking-[0.16em] text-tungsten font-medium">
          {eyebrow}
        </div>
        <div className="font-display text-2xl sm:text-3xl mt-1">{headline}</div>
        <div className="text-base text-muted mt-1.5">{sub}</div>
      </div>
      <div className="ml-auto text-right shrink-0">
        <div className="font-display text-lg text-tungsten">
          {trailingLabel}
        </div>
        <div className="text-sm text-tungsten/90 mt-1 flex items-center justify-end gap-1">
          {selected ? "✓ Selected" : (
            <>
              Tap to pick <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </div>
      </div>
    </button>
  );
}
