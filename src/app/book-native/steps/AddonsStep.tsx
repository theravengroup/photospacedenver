"use client";

/**
 * Step 3 — add-ons (optional). Grouped by category (Strobe / Video / Cyc /
 * Assistants) so the catalog is scannable. Each add-on card is one click
 * target with a real square checkbox + the full kit description.
 */

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { addonsForDuration } from "@/lib/booking/addons";
import type { WizardState } from "../state";
import type { Addon } from "@/lib/booking/types";

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

/**
 * Split labels like "Studio Digital Tech (1–5 hours)" so the parenthetical
 * qualifier sits on its own line under the main title — prevents ugly mid-
 * range wraps like "(1-\n5 hours)" inside narrow cards.
 */
function renderTitle(label: string) {
  const match = /^(.+?)\s*\((.+)\)\s*$/.exec(label);
  if (!match) {
    return (
      <span className="block font-medium text-base sm:text-lg">{label}</span>
    );
  }
  const [, head, qualifier] = match;
  return (
    <>
      <span className="block font-medium text-base sm:text-lg">{head}</span>
      <span className="block text-sm text-muted font-normal mt-0.5">
        {qualifier}
      </span>
    </>
  );
}

/** Display order + heading text for each group. */
const GROUP_ORDER: Addon["group"][] = ["strobe", "video", "cyc", "crew", "fee"];
const GROUP_LABELS: Record<Addon["group"], string> = {
  strobe: "Strobe lights",
  video: "Video lights",
  cyc: "Cyc wall",
  crew: "Assistants",
  fee: "Other",
};

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
  const available = useMemo(
    () => (state.hours ? addonsForDuration(state.hours) : []),
    [state.hours],
  );
  const [gearOpen, setGearOpen] = useState(!!state.customGearRequest);

  function toggle(slug: string) {
    const next = state.addonSlugs.includes(slug)
      ? state.addonSlugs.filter((s) => s !== slug)
      : [...state.addonSlugs, slug];
    onChange({ addonSlugs: next });
  }

  // Group the available add-ons by category for the section headings.
  const grouped = useMemo(() => {
    const g: Partial<Record<Addon["group"], Addon[]>> = {};
    for (const a of available) {
      (g[a.group] ||= []).push(a);
    }
    return g;
  }, [available]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">Add anything?</h1>
        <p className="text-muted mt-2 text-base sm:text-lg">
          Every booking comes with the cove, base lighting, and full grip kit.
          These are upgrades — skip if you don&apos;t need them.
        </p>
      </header>

      {available.length === 0 ? (
        <p className="text-muted text-base">No add-ons fit this session length.</p>
      ) : (
        <div className="space-y-8">
          {GROUP_ORDER.map((group) => {
            const items = grouped[group];
            if (!items || items.length === 0) return null;
            return (
              <section key={group} className="space-y-3">
                <h2 className="text-xs uppercase tracking-[0.16em] text-tungsten font-medium">
                  {GROUP_LABELS[group]}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map((a) => {
                    const active = state.addonSlugs.includes(a.slug);
                    return (
                      <button
                        key={a.slug}
                        type="button"
                        onClick={() => toggle(a.slug)}
                        className={cn(
                          "text-left bg-panel border rounded-card p-4 transition-colors",
                          "flex items-start justify-between gap-4",
                          active
                            ? "border-tungsten ring-1 ring-tungsten/40"
                            : "border-hairline hover:border-tungsten/60",
                        )}
                        aria-pressed={active}
                      >
                        <span className="flex items-start gap-3 min-w-0 flex-1">
                          {/* Real square checkbox — w-5 h-5 + shrink-0 + block
                              prevents flex parent from stretching it. */}
                          <span
                            className={cn(
                              "mt-0.5 grid place-items-center w-5 h-5 shrink-0 rounded border transition-colors",
                              active ? "bg-tungsten border-tungsten" : "border-hairline",
                            )}
                            aria-hidden
                          >
                            {active && (
                              <svg
                                viewBox="0 0 12 12"
                                className="w-3 h-3 text-ink fill-none stroke-current stroke-2"
                              >
                                <path
                                  d="M2 6.5l3 3L10 3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                          <span className="min-w-0">
                            {renderTitle(a.label)}
                            {a.description && (
                              <span className="block text-base text-muted mt-1 leading-snug">
                                {a.description}
                              </span>
                            )}
                          </span>
                        </span>
                        <span className="font-display text-lg shrink-0">
                          +{dollars(a.priceCents)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => setGearOpen((v) => !v)}
          className="text-base text-muted hover:text-current underline underline-offset-4"
          aria-expanded={gearOpen}
        >
          {gearOpen ? "Hide" : "Need something else?"}
        </button>
        {gearOpen && (
          <div className="mt-3">
            <label className="block text-base text-muted mb-2">
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
          className="text-base text-muted hover:text-current underline underline-offset-4"
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
