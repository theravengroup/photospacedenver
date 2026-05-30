"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BOOKING, SITE } from "@/lib/content/site-config";
import { MultiDayRequest } from "@/components/forms/MultiDayRequest";

export type BookingVariant = "book" | "tour";

const CONTENT: Record<
  BookingVariant,
  { title: string; iframeTitle: string; steps: { n: string; title: string; body: string }[] }
> = {
  book: {
    title: "Reserve the studio",
    iframeTitle: "Book a studio session — photospace Denver",
    steps: [
      {
        n: "01",
        title: "Pick your block",
        body: "Choose a length — from a 2-hour minimum to a full day — and a time that works. Same rate, 24/7. Add lighting kits or an on-call assistant at checkout.",
      },
      {
        n: "02",
        title: "Lock it in",
        body: "Confirm your details and payment. No back-and-forth; the studio is yours.",
      },
      {
        n: "03",
        title: "Walk in ready",
        body: "Grip, lighting, and the tether station are set. Be shooting within fifteen minutes.",
      },
    ],
  },
  tour: {
    title: "Book a free studio tour",
    iframeTitle: "Book a free 20-minute studio tour — photospace Denver",
    steps: [
      {
        n: "01",
        title: "Pick a time",
        body: "Choose the free Studio Tour option below and a 20-minute slot that works — tours run 7 days a week.",
      },
      {
        n: "02",
        title: "Come by",
        body: "Stop in at 209 Kalamath St. (Unit 1). Free parking out front; the entrance is around the corner on W 2nd Ave.",
      },
      {
        n: "03",
        title: "See the space",
        body: "Walk the floor, see the cyc, meet the team, and ask anything. No pressure, no sales pitch.",
      },
    ],
  },
};

export function BookingModal({
  onClose,
  variant = "book",
}: {
  onClose: () => void;
  variant?: BookingVariant;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const c = CONTENT[variant];
  const titleId = `${variant}-modal-title`;

  // Move focus into the dialog on open, restore it on close, and close on Escape.
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

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm sm:p-6"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
    >
      <div className="my-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-hairline glass-overlay">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <h2 id={titleId} className="font-display text-display-md text-bone">{c.title}</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-bone"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* How it works — 3 steps */}
        <div className="grid grid-cols-3 gap-px bg-hairline border-b border-hairline">
          {c.steps.map((s) => (
            <div key={s.n} className="bg-ink px-4 py-5 sm:px-6">
              <p className="font-display text-xl text-tungsten">{s.n}</p>
              <p className="mt-1.5 text-sm font-medium text-bone">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Acuity iframe */}
        <div className="h-[440px] overflow-hidden sm:h-[500px]">
          <iframe
            src={BOOKING.acuityEmbed}
            title={c.iframeTitle}
            className="h-full w-full border-0"
            scrolling="yes"
          />
        </div>

        {/* Footer — variant-specific helper */}
        {variant === "book" ? (
          <div className="border-t border-hairline px-6 py-4 text-sm text-muted">
            Shooting more than one day? Multi-day bookings can&rsquo;t be booked here directly —{" "}
            <MultiDayRequest page="booking-modal">request your dates</MultiDayRequest>{" "}
            and we&rsquo;ll confirm availability.
          </div>
        ) : (
          <div className="border-t border-hairline px-6 py-4 text-sm text-muted">
            Tours are free and take about 20 minutes. Prefer to call ahead?{" "}
            <a href={SITE.contact.phoneHref} className="font-medium text-tungsten underline-offset-2 hover:underline">
              {SITE.contact.phone}
            </a>.
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
