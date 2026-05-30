"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import {
  CalendarClock,
  Sunrise,
  Sun,
  Moon,
  Star,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DateRangeCalendar, type DateRange } from "@/components/ui/DateRangeCalendar";

const TZ = "America/Denver";
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});
const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  hour12: true,
});
const TIME_RANGE_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

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

type Bucket = "morning" | "afternoon" | "evening" | "late";
const BUCKET_ORDER: Bucket[] = ["morning", "afternoon", "evening", "late"];
const BUCKET_LABEL: Record<Bucket, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  late: "Late night",
};
const BUCKET_ICON: Record<Bucket, LucideIcon> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Moon,
  late: Star,
};
function denverHour(d: Date): number {
  const h = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    hour12: false,
  }).format(d);
  return parseInt(h, 10) % 24;
}
function bucketFor(d: Date): Bucket {
  const h = denverHour(d);
  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "late";
}
function dateISOLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function RescheduleShell({
  bookingId,
  status,
  appointmentLabel,
  appointmentHours,
  isMultiDay,
  currentStartAt,
  currentEndAt,
  customerFirstName,
}: {
  bookingId: string;
  status: string;
  /** Server passes this for future use (e.g. tour-specific copy) but the
   * picker UI itself is driven by isMultiDay + hours, so we don't need it
   * in the client component yet. */
  appointmentSlug?: string;
  appointmentLabel: string;
  appointmentHours: number;
  isMultiDay: boolean;
  currentStartAt: string;
  currentEndAt: string;
  customerFirstName: string;
}) {
  const router = useRouter();
  const oldStart = new Date(currentStartAt);
  const oldEnd = new Date(currentEndAt);

  // ─── Hourly state ─────────────────────────────────────────────────
  const [date, setDate] = useState<Date | undefined>(
    isMultiDay ? undefined : new Date(currentStartAt),
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsErr, setSlotsErr] = useState<string | null>(null);
  const [pickedSlot, setPickedSlot] = useState<Slot | null>(null);

  // ─── Multi-day state ──────────────────────────────────────────────
  const [range, setRange] = useState<DateRange | undefined>(
    isMultiDay
      ? { from: new Date(currentStartAt), to: new Date(currentEndAt) }
      : undefined,
  );

  // ─── Submit state ─────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Fetch slots for hourly when date/hours change
  useEffect(() => {
    if (isMultiDay || !date) return;
    let cancelled = false;
    void (async () => {
      if (!cancelled) {
        setSlotsLoading(true);
        setSlotsErr(null);
      }
      try {
        const res = await fetch("/api/booking/slots", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            dateISO: dateISOLocal(date),
            hours: appointmentHours,
            excludeBookingId: bookingId,
          }),
        });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setSlotsErr(json.error ?? "Couldn't load times");
          setSlots([]);
        } else {
          setSlots(json.slots ?? []);
        }
      } catch {
        if (!cancelled) setSlotsErr("Network error — try again");
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [date, appointmentHours, isMultiDay, bookingId]);

  // For multi-day, derive the YYYY-MM-DD bounds from the picked range
  const multiDayStartDate = range?.from ? dateISOLocal(range.from) : null;
  const multiDayEndDate = range?.to
    ? dateISOLocal(range.to)
    : range?.from
      ? dateISOLocal(range.from)
      : null;

  const canSubmit = isMultiDay
    ? !!multiDayStartDate && !!multiDayEndDate && multiDayEndDate >= multiDayStartDate
    : !!pickedSlot;

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setErr(null);
    try {
      const body: Record<string, unknown> = {};
      if (isMultiDay) {
        body.multiDayStartDate = multiDayStartDate;
        body.multiDayEndDate = multiDayEndDate;
      } else {
        body.startAt = pickedSlot!.startAt;
        body.endAt = pickedSlot!.endAt;
      }
      const res = await fetch(`/api/booking/reschedule/${bookingId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(
          json.error === "not_available"
            ? "That time was just taken — try another."
            : json.error === "requires_approval"
              ? "That time is inside the 12-hour lead window — call us to set it up."
              : json.error ?? "Couldn't reschedule — try again.",
        );
        setSubmitting(false);
        return;
      }
      router.push(`/booking/manage/${bookingId}?rescheduled=1`);
    } catch {
      setErr("Network error — try again");
      setSubmitting(false);
    }
  }

  const notReschedulable = !["pending_payment", "confirmed"].includes(status);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header>
        <div className="flex items-center gap-2 text-tungsten uppercase tracking-[0.16em] text-sm font-medium">
          <CalendarClock className="w-4 h-4" strokeWidth={1.75} />
          Reschedule
        </div>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">
          {notReschedulable
            ? "This booking can't be rescheduled."
            : `Pick a new time, ${customerFirstName}.`}
        </h1>
        {!notReschedulable && (
          <p className="text-base sm:text-lg text-muted mt-2">
            Currently scheduled for{" "}
            <strong className="text-current">{DATE_FMT.format(oldStart)}</strong>
            {!isMultiDay && (
              <>
                {" at "}
                <strong className="text-current">
                  {TIME_RANGE_FMT.format(oldStart)} – {TIME_RANGE_FMT.format(oldEnd)}
                </strong>
              </>
            )}
            . Pick a new {isMultiDay ? "date range" : "date and time"} below — same
            session, just a different slot.
          </p>
        )}
      </header>

      {notReschedulable && (
        <div className="glass-card rounded-card p-6 text-base">
          This booking is <strong>{status}</strong> — only pending or confirmed
          bookings can be rescheduled. Reach us at the contact details on your
          confirmation email if you need help.
          <div className="mt-4">
            <Link
              href={`/booking/manage/${bookingId}`}
              className="text-tungsten underline underline-offset-4"
            >
              ← Back to booking
            </Link>
          </div>
        </div>
      )}

      {!notReschedulable && !isMultiDay && (
        <HourlyPicker
          appointmentLabel={appointmentLabel}
          date={date}
          setDate={(d) => {
            setDate(d);
            setPickedSlot(null);
          }}
          slots={slots}
          slotsLoading={slotsLoading}
          slotsErr={slotsErr}
          pickedSlot={pickedSlot}
          setPickedSlot={setPickedSlot}
        />
      )}

      {!notReschedulable && isMultiDay && (
        <MultiDayPicker range={range} setRange={setRange} />
      )}

      {!notReschedulable && (
        <>
          {err && (
            <p className="text-sm text-amber-400 px-1" role="alert">
              {err}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <Link
              href={`/booking/manage/${bookingId}`}
              className="text-base text-muted hover:text-current underline underline-offset-4"
            >
              ← Cancel reschedule
            </Link>
            <button
              type="button"
              onClick={() => void submit()}
              disabled={!canSubmit || submitting}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-medium transition-all duration-200 ease-cinematic",
                canSubmit && !submitting
                  ? "bg-tungsten text-ink hover:bg-tungsten-soft hover:shadow-[0_8px_22px_-8px_rgba(200,132,43,0.55)] hover:-translate-y-px"
                  : "bg-panel text-muted border border-hairline cursor-not-allowed",
              )}
            >
              {submitting ? (
                "Saving…"
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save new time
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function HourlyPicker({
  appointmentLabel,
  date,
  setDate,
  slots,
  slotsLoading,
  slotsErr,
  pickedSlot,
  setPickedSlot,
}: {
  appointmentLabel: string;
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
  slots: Slot[];
  slotsLoading: boolean;
  slotsErr: string | null;
  pickedSlot: Slot | null;
  setPickedSlot: (s: Slot | null) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const max = new Date();
  max.setDate(max.getDate() + 90);

  const bookable = slots.filter(
    (s) => s.status === "available" || s.status === "requires_approval",
  );
  const grouped = new Map<Bucket, Slot[]>();
  for (const s of bookable) {
    const b = bucketFor(new Date(s.startAt));
    const arr = grouped.get(b) ?? [];
    arr.push(s);
    grouped.set(b, arr);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
      <div className="glass-card rounded-card p-4 flex justify-center text-bone">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          numberOfMonths={1}
          showOutsideDays
          disabled={{ before: today, after: max }}
          style={RDP_THEME}
          aria-label="Choose a new date"
        />
      </div>

      <div className="glass-card rounded-card p-5">
        <div className="text-xs uppercase tracking-[0.16em] text-muted mb-4">
          {date ? `Available times for ${appointmentLabel}` : "Pick a date first"}
        </div>
        {!date && <p className="text-base text-muted">Use the calendar to choose a date.</p>}
        {date && slotsLoading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 rounded-full bg-hairline/40 animate-pulse" />
            ))}
          </div>
        )}
        {date && !slotsLoading && slotsErr && (
          <p className="text-base text-amber-400">{slotsErr}</p>
        )}
        {date && !slotsLoading && !slotsErr && bookable.length === 0 && (
          <div className="rounded-card border border-hairline/60 p-6 text-center">
            <p className="text-base">Nothing available that day.</p>
            <p className="text-sm text-muted mt-2">Try the next day, or shorter notice.</p>
          </div>
        )}
        {date && !slotsLoading && !slotsErr && bookable.length > 0 && (
          <div className="space-y-5">
            {BUCKET_ORDER.map((bucket) => {
              const items = grouped.get(bucket);
              if (!items || items.length === 0) return null;
              const Icon = BUCKET_ICON[bucket];
              return (
                <section key={bucket}>
                  <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-tungsten font-medium mb-3">
                    <Icon className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                    {BUCKET_LABEL[bucket]}
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {items.map((s) => {
                      const isPicked = pickedSlot?.startAt === s.startAt;
                      const approvalOnly = s.status === "requires_approval";
                      return (
                        <button
                          key={s.startAt}
                          type="button"
                          disabled={approvalOnly}
                          onClick={() => setPickedSlot(s)}
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
    </div>
  );
}

function MultiDayPicker({
  range,
  setRange,
}: {
  range: DateRange | undefined;
  setRange: (r: DateRange | undefined) => void;
}) {
  const calendarDays =
    range?.from && range?.to
      ? Math.round((range.to.getTime() - range.from.getTime()) / (24 * 60 * 60 * 1000)) + 1
      : range?.from
        ? 1
        : 0;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
      <div className="glass-card rounded-card p-4">
        <DateRangeCalendar range={range} onSelect={setRange} />
      </div>
      <div className="glass-card rounded-card p-5">
        <h3 className="text-xs uppercase tracking-[0.16em] text-tungsten font-medium mb-3">
          New range
        </h3>
        {!range?.from && (
          <p className="text-base text-muted">Tap a start date on the calendar, then your end date.</p>
        )}
        {range?.from && (
          <div className="text-base">
            <div>
              <span className="text-muted">Start: </span>
              <span>{DATE_FMT.format(range.from)}</span>
            </div>
            <div className="mt-1">
              <span className="text-muted">End: </span>
              <span>{range.to ? DATE_FMT.format(range.to) : DATE_FMT.format(range.from)}</span>
            </div>
            <div className="mt-3 text-tungsten flex items-center gap-1">
              {calendarDays} calendar day{calendarDays === 1 ? "" : "s"}
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
