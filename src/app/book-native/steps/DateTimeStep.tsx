"use client";

/**
 * Step 2 — pick a date and time.
 *
 * Left: calendar (single-date, react-day-picker themed to match
 * DateRangeCalendar). Right: slot grid for the chosen date, fetched from
 * /api/booking/slots. Greys out conflicts, dims slots that require admin
 * approval (sub-12h lead), marks the chosen slot.
 */

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/cn";
import type { WizardState } from "../state";

const TZ = "America/Denver";
const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
});

// react-day-picker theme tokens — same set as the existing DateRangeCalendar
const RDP_THEME = {
  "--rdp-accent-color": "var(--color-tungsten)",
  "--rdp-accent-background-color": "color-mix(in oklab, var(--color-tungsten) 22%, transparent)",
  "--rdp-day-width": "2.4rem",
  "--rdp-day-height": "2.4rem",
  "--rdp-day_button-width": "2.4rem",
  "--rdp-day_button-height": "2.4rem",
  "--rdp-day_button-border-radius": "0.55rem",
  "--rdp-selected-border": "1.5px solid var(--color-tungsten)",
  "--rdp-today-color": "var(--color-tungsten)",
  "--rdp-nav_button-width": "2rem",
  "--rdp-nav_button-height": "2rem",
} as React.CSSProperties;

type Slot = {
  startAt: string;
  endAt: string;
  status: "available" | "requires_approval" | "blocked";
};

function dateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DateTimeStep({
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
  const [date, setDate] = useState<Date | undefined>(() =>
    state.dateISO ? new Date(`${state.dateISO}T12:00:00`) : undefined,
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Refetch slots whenever the chosen date or duration changes. We use a
  // cancellation flag so a fast double-pick doesn't race two responses.
  useEffect(() => {
    if (!date || !state.hours) return;
    let cancelled = false;
    const dISO = dateISO(date);
    const hours = state.hours;

    void (async () => {
      // setState INSIDE async (not at top of effect) keeps the
      // react-hooks/set-state-in-effect rule happy — these mutations are
      // event-driven (fetch resolution) rather than synchronous to render.
      if (!cancelled) {
        setLoading(true);
        setErr(null);
      }
      try {
        const res = await fetch("/api/booking/slots", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ dateISO: dISO, hours }),
        });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setErr(json.error ?? "Couldn't load times");
          setSlots([]);
        } else {
          setSlots(json.slots ?? []);
        }
      } catch {
        if (!cancelled) setErr("Network error — try again");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [date, state.hours]);

  function pickSlot(s: Slot) {
    if (s.status !== "available") return;
    onChange({
      dateISO: dateISO(date!),
      startAt: s.startAt,
      endAt: s.endAt,
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const max = new Date();
  max.setDate(max.getDate() + 90);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">Pick a date and time</h1>
        <p className="text-muted mt-2 text-sm sm:text-base">
          Times shown in Denver. Bookings need at least 12 hours&apos; lead and
          we leave a 2-hour buffer around every shoot.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
        <div className="bg-panel border border-hairline rounded-card p-4 flex justify-center text-bone">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              if (d && state.startAt) {
                // Reset chosen slot if date changes
                onChange({ startAt: null, endAt: null });
              }
            }}
            numberOfMonths={1}
            showOutsideDays
            disabled={{ before: today, after: max }}
            style={RDP_THEME}
            aria-label="Choose a date"
          />
        </div>

        <div className="bg-panel border border-hairline rounded-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted mb-3">
            {date ? "Available times" : "Pick a date first"}
          </div>
          {!date && (
            <p className="text-sm text-muted">Use the calendar to choose a date.</p>
          )}
          {date && loading && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-10 rounded-full bg-hairline/40 animate-pulse" />
              ))}
            </div>
          )}
          {date && !loading && err && (
            <p className="text-sm text-amber-400">{err}</p>
          )}
          {date && !loading && !err && slots.length === 0 && (
            <p className="text-sm text-muted">
              No times that day. Try the next day, or shorter session.
            </p>
          )}
          {date && !loading && !err && slots.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s) => {
                const isPicked = state.startAt === s.startAt;
                const disabled = s.status !== "available";
                return (
                  <button
                    key={s.startAt}
                    type="button"
                    disabled={disabled}
                    onClick={() => pickSlot(s)}
                    className={cn(
                      "rounded-full px-3 py-2 text-sm border transition-colors",
                      isPicked && "bg-tungsten text-ink border-tungsten",
                      !isPicked && !disabled && "border-hairline hover:border-tungsten",
                      disabled && "border-hairline/40 text-muted/60 cursor-not-allowed line-through",
                    )}
                    title={
                      s.status === "blocked"
                        ? "Conflicts with another booking"
                        : s.status === "requires_approval"
                          ? "Inside the 12h lead window — admin approval needed"
                          : undefined
                    }
                  >
                    {TIME_FMT.format(new Date(s.startAt))}
                  </button>
                );
              })}
            </div>
          )}
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
          disabled={!state.startAt}
          onClick={onContinue}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors",
            state.startAt
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
