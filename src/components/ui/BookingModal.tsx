"use client";

import { useEffect, useRef } from "react";
import { BOOKING } from "@/lib/content/site-config";

const STEPS = [
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
];

export function BookingModal({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="booking-modal-title"
    >
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-hairline bg-ink sm:rounded-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <h2 id="booking-modal-title" className="font-display text-display-md text-bone">Reserve the studio</h2>
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
          {STEPS.map((s) => (
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
            title="Book a studio session — photospace Denver"
            className="h-full w-full border-0"
            scrolling="yes"
          />
        </div>

      </div>
    </div>
  );
}
