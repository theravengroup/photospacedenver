"use client";

import { useEffect, useRef, useState } from "react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Field, TextArea } from "@/components/forms/Fields";

/**
 * Reusable "request multi-day dates" flow. Renders an inline trigger (its
 * children) that opens a single shared modal with start/end date pickers — used
 * anywhere multi-day studio bookings need to be requested rather than self-booked.
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

function MultiDayModal({ page, onClose }: { page: string; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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

  return (
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
              Multi-day shoots are by request, not self-booked. Pick your dates and we&rsquo;ll confirm availability.
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
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" required autoComplete="name" />
              <Field label="Email" name="email" type="email" required autoComplete="email" />
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First day" name="start_date" type="date" required />
              <Field label="Last day" name="end_date" type="date" required />
            </div>
            <TextArea
              label="What are you shooting?"
              name="details"
              placeholder="Project, crew size, and any gear or crew you'll need."
            />
          </InquiryForm>
        </div>
      </div>
    </div>
  );
}
