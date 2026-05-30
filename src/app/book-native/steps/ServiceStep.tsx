"use client";

/**
 * Step 1 — pick a session.
 *
 * Three tier cards (Quick / Half-day / Full-day) with a Tour CTA at the top.
 * Tapping a card expands it inline with exact-hour chips. Selecting an hour
 * locks in {appointmentTypeSlug, hours} and exposes the Continue button.
 */

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { WizardState } from "../state";
import { APPOINTMENT_TYPES } from "@/lib/booking/appointment-types";

type Tier = {
  id: "quick" | "halfday" | "fullday";
  label: string;
  blurb: string;
  hours: number[]; // exact hour options to expose
  fromCents: number;
};

const TIERS: Tier[] = [
  { id: "quick",   label: "Quick",     blurb: "2–4 hours",  hours: [2, 3, 4],            fromCents: 20000 },
  { id: "halfday", label: "Half day",  blurb: "5 hours flat", hours: [5],                fromCents: 48500 },
  { id: "fullday", label: "Full day",  blurb: "6–12 hours", hours: [6, 7, 8, 9, 10, 11, 12], fromCents: 57500 },
];

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

function appointmentSlugForHours(hours: number): string {
  if (hours === 5) return "hourly-5-halfday";
  if (hours === 10) return "hourly-10-fullday";
  if (hours === 11) return "hourly-11-fullday";
  if (hours === 12) return "hourly-12-fullday";
  return `hourly-${hours}`;
}

function priceForHours(hours: number): number {
  const slug = appointmentSlugForHours(hours);
  return APPOINTMENT_TYPES.find((t) => t.slug === slug)?.basePriceCents ?? 0;
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
  function pickHours(hours: number) {
    onChange({ appointmentTypeSlug: appointmentSlugForHours(hours), hours });
  }

  const tourSelected = state.appointmentTypeSlug === "tour";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">Book the studio</h1>
        <p className="text-muted mt-2 text-sm sm:text-base">
          One photo studio in Denver — 1,800 sq ft, north-facing daylight, 24/7
          keyless access. Pick a session length and we&apos;ll find you a time.
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
            state.appointmentTypeSlug && state.hours != null && tier.hours.includes(state.hours);
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
                <div className="text-sm text-muted">from {dollars(tier.fromCents)}</div>
              </button>

              {isOpen && (
                <div className="border-t border-hairline p-4">
                  <div className="text-xs text-muted mb-2">Exact length</div>
                  <div className="flex flex-wrap gap-2">
                    {tier.hours.map((h) => {
                      const active = state.hours === h && !tourSelected;
                      return (
                        <button
                          key={h}
                          type="button"
                          onClick={() => pickHours(h)}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-sm border transition-colors",
                            active
                              ? "bg-tungsten text-ink border-tungsten"
                              : "border-hairline hover:border-tungsten",
                          )}
                        >
                          {h}h
                          <span className="text-muted ml-1">
                            ·{" "}
                            {tier.id === "fullday" && h >= 10
                              ? "$925"
                              : `$${(priceForHours(h) / 100).toFixed(0)}`}
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
