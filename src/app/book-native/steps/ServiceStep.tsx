"use client";

/**
 * Step 1 — pick a session.
 *
 * Three tier cards (Quick / Half-day / Full-day) with a Tour CTA at the top.
 * Tapping a card expands it inline with exact-hour chips. Selecting an hour
 * locks in {appointmentTypeSlug, hours} and exposes the Continue button.
 */

import { cn } from "@/lib/cn";
import type { WizardState } from "../state";

type HourOption = {
  /** Label shown on the chip. */
  label: string;
  /** Actual hours the system books. For the "Full day" chip this is 12 — the
   * full block — even though Acuity historically priced 10/11/12 identically.
   * Collapsing to a single chip keeps the UI clean; the customer gets the
   * full 12h window for the same flat price. */
  hours: number;
  priceCents: number;
};

type Tier = {
  id: "quick" | "halfday" | "fullday";
  label: string;
  blurb: string;
  options: HourOption[];
  fromCents: number;
};

const TIERS: Tier[] = [
  {
    id: "quick",
    label: "Quick",
    blurb: "2–4 hours",
    options: [
      { label: "2h", hours: 2, priceCents: 20000 },
      { label: "3h", hours: 3, priceCents: 29500 },
      { label: "4h", hours: 4, priceCents: 39000 },
    ],
    fromCents: 20000,
  },
  {
    id: "halfday",
    label: "Half day",
    blurb: "5 hours flat",
    options: [{ label: "5h", hours: 5, priceCents: 48500 }],
    fromCents: 48500,
  },
  {
    id: "fullday",
    label: "Full day",
    blurb: "6–12 hours",
    options: [
      { label: "6h", hours: 6, priceCents: 57500 },
      { label: "7h", hours: 7, priceCents: 66500 },
      { label: "8h", hours: 8, priceCents: 75500 },
      { label: "9h", hours: 9, priceCents: 84000 },
      // The 10/11/12 Acuity rungs collapse into one chip — same flat $925,
      // books the full 12-hour window so the customer has the room all day.
      // Label is just "10–12h"; the parent card already says "Full day".
      { label: "10–12h", hours: 12, priceCents: 92500 },
    ],
    fromCents: 57500,
  },
];

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

function appointmentSlugForHours(hours: number): string {
  if (hours === 5) return "hourly-5-halfday";
  if (hours === 12) return "hourly-12-fullday";
  // 10/11 are still valid slugs server-side (admins can book them) but the
  // public UI no longer exposes them — every "Full day" pick uses the 12-hour
  // slug above.
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
    // Hours irrelevant for multi-day — pricing comes from the date range
    onChange({ appointmentTypeSlug: "multi-day", hours: 0 });
  }

  const tourSelected = state.appointmentTypeSlug === "tour";
  const multiDaySelected = state.appointmentTypeSlug === "multi-day";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">Book the studio</h1>
        <p className="text-muted mt-2 text-base sm:text-lg">
          1,900 sq ft of controllable daylight in Denver — remote-controlled
          blinds on every window, full cove, 24/7 keyless access. Photo or
          video. Pick a length and we&apos;ll find you a time.
        </p>
      </header>

      {/* Tour CTA — separate, free, low-stakes intro */}
      <button
        type="button"
        onClick={pickTour}
        className={cn(
          "w-full text-left bg-panel border rounded-card p-5 transition-colors",
          "flex items-center justify-between gap-4",
          tourSelected
            ? "border-tungsten ring-1 ring-tungsten/40"
            : "border-hairline hover:border-tungsten/60",
        )}
        aria-pressed={tourSelected}
      >
        <div>
          <div className="font-medium">Free studio tour</div>
          <div className="text-sm text-muted mt-1">
            20 minutes · meet us in person before you book a real session
          </div>
        </div>
        <span className="font-display text-lg text-tungsten">Free</span>
      </button>

      <div className="text-xs uppercase tracking-wider text-muted pt-2">or rent the studio</div>

      {/* Grid stretches every card to match the tallest in its row, so the
          single-option cards (Half-day, Multi-day) and the multi-option ones
          (Quick, Full-day) line up. mt-auto on each card's footer area
          pushes the pills / "Tap to pick" label to the bottom edge so they
          align across all four cards. */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {TIERS.map((tier) => {
          const isPicked =
            state.appointmentTypeSlug != null &&
            state.hours != null &&
            state.hours > 0 &&
            tier.options.some((o) => o.hours === state.hours) &&
            !tourSelected &&
            !multiDaySelected;
          const singleOption = tier.options.length === 1;

          // Single-option tier (Half day) → entire card is a single click target.
          if (singleOption) {
            const opt = tier.options[0];
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => pickOption(opt)}
                className={cn(
                  "h-full text-left bg-panel border rounded-card p-5 transition-colors",
                  "flex flex-col gap-2",
                  isPicked
                    ? "border-tungsten ring-1 ring-tungsten/40"
                    : "border-hairline hover:border-tungsten/60",
                )}
                aria-pressed={isPicked}
              >
                <div className="text-xs uppercase tracking-wider text-muted">{tier.label}</div>
                <div className="font-display text-2xl">{tier.blurb}</div>
                <div className="text-base text-muted">{dollars(opt.priceCents)}</div>
                {/* mt-auto pushes the action label to the bottom of the card
                    so it lines up with the chips row on the multi-option
                    tiers. */}
                <div className="text-sm text-tungsten mt-auto pt-2">
                  {isPicked ? "✓ Selected" : "Tap to pick"}
                </div>
              </button>
            );
          }

          // Multi-option tier → header + chips, always visible (no expand step)
          return (
            <div
              key={tier.id}
              className={cn(
                "h-full bg-panel border rounded-card p-5 transition-colors flex flex-col gap-3",
                isPicked
                  ? "border-tungsten ring-1 ring-tungsten/40"
                  : "border-hairline hover:border-tungsten/60",
              )}
            >
              <div className="flex flex-col gap-1">
                <div className="text-xs uppercase tracking-wider text-muted">{tier.label}</div>
                <div className="font-display text-2xl">{tier.blurb}</div>
                <div className="text-base text-muted">from {dollars(tier.fromCents)}</div>
              </div>
              {/* Chips pushed to card bottom so all 4 cards' action areas
                  share a baseline. */}
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {tier.options.map((opt) => {
                  const active = state.hours === opt.hours && !tourSelected;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => pickOption(opt)}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-sm border transition-colors",
                        active
                          ? "bg-tungsten text-ink border-tungsten"
                          : "border-hairline hover:border-tungsten",
                      )}
                    >
                      {opt.label}
                      <span
                        className={cn(
                          "ml-1",
                          active ? "text-ink/70" : "text-muted",
                        )}
                      >
                        · {dollars(opt.priceCents)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* 4th card — Multi-day. Whole card is the pick target. */}
        <button
          type="button"
          onClick={pickMultiDay}
          className={cn(
            "h-full text-left bg-panel border rounded-card p-5 transition-colors",
            "flex flex-col gap-2",
            multiDaySelected
              ? "border-tungsten ring-1 ring-tungsten/40"
              : "border-hairline hover:border-tungsten/60",
          )}
          aria-pressed={multiDaySelected}
        >
          <div className="text-xs uppercase tracking-wider text-muted">Multi-day</div>
          <div className="font-display text-2xl">2+ days</div>
          <div className="text-base text-muted">
            $925/day · cap at 4 days ($3,700)
          </div>
          {/* Bottom-aligned action area — matches the chips baseline on the
              other cards. */}
          <div className="mt-auto pt-2">
            <div className="text-sm text-tungsten">
              {multiDaySelected ? "✓ Selected" : "Tap to pick"}
            </div>
            <div className="text-xs text-muted/80 mt-1">
              Weekend (Sat + Sun) counts as one day.
            </div>
          </div>
        </button>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="button"
          disabled={!state.appointmentTypeSlug}
          onClick={onContinue}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors",
            state.appointmentTypeSlug
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
