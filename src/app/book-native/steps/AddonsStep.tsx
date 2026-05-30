"use client";

/**
 * Step 3 — add-ons (optional). Cards for each add-on the duration allows,
 * with toggle behavior + price. Custom gear request hides behind an expander.
 */

import { useState } from "react";
import { cn } from "@/lib/cn";
import { addonsForDuration } from "@/lib/booking/addons";
import type { WizardState } from "../state";

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export function AddonsStep({
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
  const available = state.hours ? addonsForDuration(state.hours) : [];
  const [gearOpen, setGearOpen] = useState(!!state.customGearRequest);

  function toggle(slug: string) {
    const next = state.addonSlugs.includes(slug)
      ? state.addonSlugs.filter((s) => s !== slug)
      : [...state.addonSlugs, slug];
    onChange({ addonSlugs: next });
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">Add anything?</h1>
        <p className="text-muted mt-2 text-sm sm:text-base">
          Every booking comes with the cove, base lighting, and full grip kit.
          These are upgrades — skip if you don&apos;t need them.
        </p>
      </header>

      {available.length === 0 ? (
        <p className="text-muted text-sm">No add-ons fit this session length.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {available.map((a) => {
            const active = state.addonSlugs.includes(a.slug);
            return (
              <button
                key={a.slug}
                type="button"
                onClick={() => toggle(a.slug)}
                className={cn(
                  "text-left bg-panel border rounded-card p-4 transition-colors",
                  "flex items-center justify-between gap-4",
                  active
                    ? "border-tungsten ring-1 ring-tungsten/40"
                    : "border-hairline hover:border-tungsten/60",
                )}
                aria-pressed={active}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={cn(
                      "mt-0.5 grid place-items-center size-5 rounded border transition-colors",
                      active ? "bg-tungsten border-tungsten" : "border-hairline",
                    )}
                    aria-hidden
                  >
                    {active && (
                      <svg viewBox="0 0 12 12" className="w-3 h-3 text-ink fill-none stroke-current stroke-2">
                        <path d="M2 6.5l3 3L10 3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{a.label}</span>
                    <span className="block text-xs text-muted mt-0.5 capitalize">{a.group}</span>
                  </span>
                </div>
                <span className="font-display text-base shrink-0">
                  +{dollars(a.priceCents)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => setGearOpen((v) => !v)}
          className="text-sm text-muted hover:text-current underline underline-offset-4"
          aria-expanded={gearOpen}
        >
          {gearOpen ? "Hide" : "Need something else?"}
        </button>
        {gearOpen && (
          <div className="mt-3">
            <label className="block text-sm text-muted mb-1.5">
              Tell us what you need (beauty dish, specific modifier, etc.)
            </label>
            <textarea
              value={state.customGearRequest}
              onChange={(e) => onChange({ customGearRequest: e.target.value })}
              rows={3}
              className="FIELD w-full"
              placeholder="e.g. one beauty dish + sock, two grids"
              maxLength={600}
            />
          </div>
        )}
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
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium bg-tungsten text-ink hover:bg-tungsten-soft transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
