"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Field, TextArea } from "@/components/forms/Fields";
import { DateRangeCalendar, type DateRange } from "@/components/ui/DateRangeCalendar";

/**
 * Reusable "request multi-day dates" flow. Renders an inline trigger (its
 * children) that opens a single shared modal with a start → end date-range
 * calendar — used anywhere multi-day studio bookings need to be requested
 * rather than self-booked.
 */
export function MultiDayRequest({
  children,
  className,
  page = "multi-day",
}: {
  children: React.ReactNode;
  className?: string;
  page?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className ?? "font-medium text-tungsten underline-offset-2 hover:underline"}
      >
        {children}
      </button>
      {open && <MultiDayModal page={page} onClose={() => setOpen(false)} />}
    </>
  );
}

/** Local YYYY-MM-DD (no UTC shift). */
function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** "May 30, 2026" */
function pretty(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function MultiDayModal({ page, onClose }: { page: string; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [range, setRange] = useState<DateRange | undefined>();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const from = range?.from;
  const to = range?.to;
  const dayCount = from && to ? Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1 : 0;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[210] flex justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm sm:p-6"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="multiday-title"
    >
      <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-hairline glass-overlay">
        <div className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-5">
          <div>
            <h2 id="multiday-title" className="font-display text-display-md text-bone">Request multi-day dates</h2>
            <p className="mt-1 text-sm text-muted">
              Multi-day shoots are by request, not self-booked. Pick your first and last day and we&rsquo;ll confirm availability.
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-bone"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          <InquiryForm
            type="estimate"
            page={page}
            submitLabel="Request these dates"
            successTitle="Request received."
            successBody="Thanks — we'll check the calendar for your dates and follow up to confirm availability, usually the same business day."
            validate={(payload) =>
              payload.start_date && payload.end_date
                ? null
                : "Please choose your first and last day on the calendar."
            }
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" required autoComplete="name" />
              <Field label="Email" name="email" type="email" required autoComplete="email" />
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
            </div>

            {/* Date-range calendar */}
            <div>
              <span className="mb-2 block text-base text-muted">
                Choose your dates <span className="text-tungsten">*</span>
              </span>
              <div className="rounded-card border border-hairline bg-ink/30 p-3 sm:p-4">
                <DateRangeCalendar range={range} onSelect={setRange} />
              </div>
              <p className="mt-2 text-sm" aria-live="polite">
                {from && to ? (
                  <span className="text-bone">
                    {pretty(from)} &rarr; {pretty(to)}
                    <span className="text-muted"> · {dayCount} day{dayCount === 1 ? "" : "s"}</span>
                  </span>
                ) : from ? (
                  <span className="text-muted">{pretty(from)} — now pick your last day.</span>
                ) : (
                  <span className="text-muted">Pick your first day, then your last day.</span>
                )}
              </p>
              <input type="hidden" name="start_date" value={from ? isoDate(from) : ""} readOnly />
              <input type="hidden" name="end_date" value={to ? isoDate(to) : ""} readOnly />
            </div>

            <TextArea
              label="What are you shooting?"
              name="details"
              placeholder="Project, crew size, and any gear or crew you'll need."
            />
          </InquiryForm>
        </div>
      </div>
    </div>,
    document.body
  );
}
