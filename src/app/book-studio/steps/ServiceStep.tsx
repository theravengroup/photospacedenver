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

import { Compass, CalendarDays, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { WizardState } from "../state";

type HourOption = {
  /** Label on the chip (e.g. "2h" or "10–12h"). */
  label: string;
  /** Actual hours the system books. */
  hours: number;
  priceCents: number;
  /** Named tier inscription rendered inside the chip when set (e.g.
   *  "Half day", "Full day"). These chips also get a tungsten border to
   *  visually denote they're the flat-rate / best-value pick — without
   *  needing the word "flat" anywhere in the UI. */
  flatLabel?: string;
};

type DurationGroup = {
  id: "short" | "long";
  /** Eyebrow label above the chip row. */
  label: string;
  options: HourOption[];
};

/**
 * Two duration groups, split by LENGTH (not by rate-model):
 *   SHORT SESSIONS    2 / 3 / 4 / 5h         (5h = Half day flat)
 *   LONGER SESSIONS   6 / 7 / 8 / 9 / 10–12h (10–12h = Full day flat)
 *
 * One consistent chip; the flat-rate ones inherit a tungsten border + a
 * micro-label inscription. No divider, no "hourly/flat" eyebrows, no
 * standalone "flat" word — the chip itself communicates the tier.
 */
const GROUPS: DurationGroup[] = [
  {
    id: "short",
    label: "Short sessions",
    options: [
      { label: "2h", hours: 2, priceCents: 20000 },
      { label: "3h", hours: 3, priceCents: 29500 },
      { label: "4h", hours: 4, priceCents: 39000 },
      { label: "5h", hours: 5, priceCents: 48500, flatLabel: "Half day" },
    ],
  },
  {
    id: "long",
    label: "Longer sessions",
    options: [
      { label: "6h", hours: 6, priceCents: 57500 },
      { label: "7h", hours: 7, priceCents: 66500 },
      { label: "8h", hours: 8, priceCents: 75500 },
      { label: "9h", hours: 9, priceCents: 84000 },
      { label: "10–12h", hours: 12, priceCents: 92500, flatLabel: "Full day" },
    ],
  },
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

      {/* The main length picker — two rows split by LENGTH (short ≤5h /
          longer ≥6h). Every chip is the same size; the flat-rate chips
          (5h Half day, 10–12h Full day) carry a tungsten border + a
          micro-label inscription so the tier communicates without needing
          the word "flat" or a separate column. */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xs uppercase tracking-[0.16em] text-muted font-medium">
            Choose a length
          </h2>
          <span className="h-px flex-1 bg-hairline" aria-hidden />
        </div>

        <div className="space-y-6">
          {GROUPS.map((group) => (
            <GroupRow
              key={group.id}
              group={group}
              hoursSelected={hoursSelected}
              onPick={pickOption}
            />
          ))}
        </div>
      </section>

      {/* Bottom bookend — multi-day. Special because it picks a date range,
          not an hour count. */}
      <BookendPanel
        icon={CalendarDays}
        eyebrow="Multi-day rental"
        headline="2+ days"
        sub="Weekend (Sat + Sun) counts as one billable day."
        trailingLabel="$925 / day"
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
 * GroupRow — eyebrow + horizontal chip row for one length group.
 *
 * All chips are uniform width; the flat-rate ones (`flatLabel` set) carry
 * a tungsten border + an inline tungsten micro-label inscription.
 * `items-stretch` keeps every chip the same height as the tallest (the
 * flat one) so the row reads as a single uniform menu — no awkward
 * height variations.
 */
function GroupRow({
  group,
  hoursSelected,
  onPick,
}: {
  group: DurationGroup;
  hoursSelected: number | null;
  onPick: (opt: HourOption) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-[0.16em] text-tungsten font-medium">
        {group.label}
      </h3>
      <div className="flex flex-wrap gap-2 items-stretch">
        {group.options.map((opt) => {
          const active = hoursSelected === opt.hours;
          const isFlat = !!opt.flatLabel;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onPick(opt)}
              aria-pressed={active}
              className={cn(
                "min-w-[7.5rem] rounded-card px-4 py-3 text-left transition-all duration-200 ease-cinematic",
                "border whitespace-nowrap flex flex-col justify-between",
                active
                  ? "bg-tungsten text-ink border-tungsten shadow-[0_8px_22px_-8px_rgba(200,132,43,0.5)]"
                  : isFlat
                    ? "border-tungsten/55 bg-panel hover:border-tungsten hover:-translate-y-px hover:bg-tungsten/5"
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
              {isFlat && (
                <span
                  className={cn(
                    "block text-[0.6875rem] uppercase tracking-[0.14em] font-medium mt-1",
                    active ? "text-ink/80" : "text-tungsten",
                  )}
                >
                  {opt.flatLabel}
                </span>
              )}
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
