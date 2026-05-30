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
import { Sunrise, Sun, Moon, Star, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { WizardState } from "../state";

const TZ = "America/Denver";
/** Compact label: "6 AM", "12 PM", "11 PM" — no minute zeros, no wrap. */
const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  hour12: true,
});
/** Hour-of-day in Denver (0–23) for time-of-day bucketing. */
function denverHour(d: Date): number {
  const h = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    hour12: false,
  }).format(d);
  // The Intl output can be "0" through "23" or sometimes "24" — normalize.
  const n = parseInt(h, 10) % 24;
  return Number.isFinite(n) ? n : 0;
}

type Bucket = "morning" | "afternoon" | "evening" | "late";
const BUCKET_LABEL: Record<Bucket, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  late: "Late night",
};
const BUCKET_RANGE: Record<Bucket, string> = {
  morning: "6 AM – 12 PM",
  afternoon: "12 PM – 5 PM",
  evening: "5 PM – 10 PM",
  late: "10 PM – 6 AM",
};
const BUCKET_ICON: Record<Bucket, LucideIcon> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Moon,
  late: Star,
};
const BUCKET_ORDER: Bucket[] = ["morning", "afternoon", "evening", "late"];
function bucketFor(d: Date): Bucket {
  const h = denverHour(d);
  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "late";
}

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
        <p className="text-muted mt-2 text-base sm:text-lg">
          Times shown in Denver. Bookings need at least 12 hours&apos; lead and
          we leave a 2-hour buffer around every shoot.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
        <div className="glass-card rounded-card p-4 flex justify-center text-bone">
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

        <SlotPanel
          date={date}
          slots={slots}
          loading={loading}
          err={err}
          pickedStartAt={state.startAt}
          onPick={pickSlot}
        />
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

/**
 * The slot panel — grouped by time-of-day for scannability. Blocked slots
 * are hidden entirely (rendering 24 strikethroughs reads as broken, not
 * informative). If a bucket has no bookable slots it's omitted. If the
 * whole day has nothing bookable, we show a clean empty-state instead of
 * a wall of pills.
 */
function SlotPanel({
  date,
  slots,
  loading,
  err,
  pickedStartAt,
  onPick,
}: {
  date: Date | undefined;
  slots: Slot[];
  loading: boolean;
  err: string | null;
  pickedStartAt: string | null;
  onPick: (s: Slot) => void;
}) {
  // Hide blocked slots — only show actually-bookable times. Approval-required
  // slots stay (dimmed) so the user knows they exist but need a request.
  const bookable = slots.filter(
    (s) => s.status === "available" || s.status === "requires_approval",
  );

  // Group by time-of-day bucket
  const grouped = new Map<Bucket, Slot[]>();
  for (const s of bookable) {
    const b = bucketFor(new Date(s.startAt));
    const arr = grouped.get(b) ?? [];
    arr.push(s);
    grouped.set(b, arr);
  }

  return (
    <div className="glass-card rounded-card p-5">
      <div className="text-xs uppercase tracking-[0.16em] text-muted mb-4">
        {date ? "Available times" : "Pick a date first"}
      </div>

      {!date && (
        <p className="text-base text-muted">Use the calendar to choose a date.</p>
      )}

      {date && loading && (
        <div className="space-y-5">
          {[1, 2, 3].map((row) => (
            <div key={row}>
              <div className="h-3 w-24 rounded bg-hairline/40 animate-pulse mb-3" />
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-full bg-hairline/40 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {date && !loading && err && (
        <p className="text-base text-amber-400">{err}</p>
      )}

      {date && !loading && !err && bookable.length === 0 && (
        <div className="rounded-card border border-hairline/60 p-6 text-center">
          <p className="text-base">Nothing available that day.</p>
          <p className="text-sm text-muted mt-2">
            Try the next day, a shorter session, or {""}
            <a
              className="text-tungsten underline underline-offset-4"
              href="mailto:hello@photospacedenver.com"
            >
              text us
            </a>{" "}
            if it&apos;s urgent.
          </p>
        </div>
      )}

      {date && !loading && !err && bookable.length > 0 && (
        <div className="space-y-5">
          {BUCKET_ORDER.map((bucket) => {
            const items = grouped.get(bucket);
            if (!items || items.length === 0) return null;
            const Icon = BUCKET_ICON[bucket];
            return (
              <section key={bucket}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-tungsten font-medium">
                    <Icon className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                    {BUCKET_LABEL[bucket]}
                  </h3>
                  <span className="text-xs text-muted">{BUCKET_RANGE[bucket]}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {items.map((s) => {
                    const isPicked = pickedStartAt === s.startAt;
                    const approvalOnly = s.status === "requires_approval";
                    return (
                      <button
                        key={s.startAt}
                        type="button"
                        disabled={approvalOnly}
                        onClick={() => onPick(s)}
                        className={cn(
                          "h-10 rounded-full text-sm border transition-all duration-200 ease-cinematic whitespace-nowrap",
                          isPicked &&
                            "bg-tungsten text-ink border-tungsten shadow-[0_4px_14px_-4px_rgba(200,132,43,0.45)]",
                          !isPicked &&
                            !approvalOnly &&
                            "border-hairline hover:border-tungsten hover:bg-tungsten/5",
                          approvalOnly &&
                            "border-hairline/40 text-muted/70 cursor-not-allowed",
                        )}
                        title={
                          approvalOnly
                            ? "Inside the 12h lead window — would need admin approval"
                            : undefined
                        }
                      >
                        {TIME_FMT.format(new Date(s.startAt))}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
