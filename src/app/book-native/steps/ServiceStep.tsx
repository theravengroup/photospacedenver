"use client";

/**
 * Step 1 — pick a session.
 *
 * Three tier cards (Quick / Half-day / Full-day) with a Tour CTA at the top.
 * Tapping a card expands it inline with exact-hour chips. Selecting an hour
 * locks in {appointmentTypeSlug, hours} and exposes the Continue button.
 */

import { useState } from "react";
import Link from "next/link";
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
      // The 10/11/12 Acuity rungs collapse into one "Full day" chip — same
      // flat $925, books the full 12-hour window so the customer has the
      // room all day.
      { label: "Full day · 10–12h", hours: 12, priceCents: 92500 },
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
  const [openTier, setOpenTier] = useState<Tier["id"] | null>(() => {
    if (state.hours === 5) return "halfday";
    if (state.hours && state.hours >= 6) return "fullday";
    if (state.hours && state.hours <= 4) return "quick";
    return null;
  });

  function pickTour() {
    onChange({ appointmentTypeSlug: "tour", hours: 20 / 60 });
    setOpenTier(null);
  }
  function pickOption(opt: HourOption) {
    onChange({
      appointmentTypeSlug: appointmentSlugForHours(opt.hours),
      hours: opt.hours,
    });
  }

  const tourSelected = state.appointmentTypeSlug === "tour";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">Book the studio</h1>
        <p className="text-muted mt-2 text-base sm:text-lg">
          1,900 sq ft of controllable daylight in Denver — remote-controlled
          blinds on every window, full cove, 24/7 keyless access. Photo or
          video. Pick a length and we&apos;ll find you a time.
        </p>
        <p className="mt-3 text-sm">
          <Link
            href="/request-estimate"
            className="text-tungsten underline underline-offset-4 hover:text-tungsten-soft"
          >
            Booking more than one day? Request a multi-day quote →
          </Link>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TIERS.map((tier) => {
          const isOpen = openTier === tier.id;
          const isPicked =
            state.appointmentTypeSlug != null &&
            state.hours != null &&
            tier.options.some((o) => o.hours === state.hours) &&
            !tourSelected;
          return (
            <div
              key={tier.id}
              className={cn(
                "bg-panel border rounded-card overflow-hidden transition-colors",
                isPicked
                  ? "border-tungsten ring-1 ring-tungsten/40"
                  : "border-hairline hover:border-tungsten/60",
              )}
            >
              <button
                type="button"
                onClick={() => setOpenTier(isOpen ? null : tier.id)}
                className="w-full text-left p-5 flex flex-col gap-2"
                aria-expanded={isOpen}
              >
                <div className="text-xs uppercase tracking-wider text-muted">{tier.label}</div>
                <div className="font-display text-2xl">{tier.blurb}</div>
                <div className="text-sm text-muted">
                  {tier.options.length === 1
                    ? dollars(tier.options[0].priceCents)
                    : `from ${dollars(tier.fromCents)}`}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-hairline p-4">
                  <div className="text-xs text-muted mb-2">Exact length</div>
                  <div className="flex flex-wrap gap-2">
                    {tier.options.map((opt) => {
                      const active = state.hours === opt.hours && !tourSelected;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => pickOption(opt)}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-sm border transition-colors",
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
              )}
            </div>
          );
        })}
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
