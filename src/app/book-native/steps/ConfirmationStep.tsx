"use client";

/**
 * Step 6 — terminal "done" screen for the $0 path (free Studio Tour, 100%-off
 * coupon). For paid bookings Stripe redirects to /book-native/success, which
 * has its own polling shell.
 */

import Link from "next/link";
import { SITE } from "@/lib/content/site-config";
import type { WizardState } from "../state";

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
  minute: "2-digit",
  timeZoneName: "short",
});

export function ConfirmationStep({ state }: { state: WizardState }) {
  const start = state.startAt ? new Date(state.startAt) : null;
  const end = state.endAt ? new Date(state.endAt) : null;

  return (
    <div className="space-y-6">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-tungsten/40 bg-tungsten/10 px-3 py-1 text-xs uppercase tracking-wider text-tungsten">
          confirmed
        </div>
        <h1 className="font-display text-3xl sm:text-4xl mt-3">You&apos;re booked</h1>
        <p className="text-muted mt-2 text-sm sm:text-base">
          A confirmation email is on the way to {state.customerEmail}. See you
          at the studio.
        </p>
      </header>

      <div className="bg-panel border border-hairline rounded-card p-6 space-y-4">
        {state.bookingId && (
          <div className="flex justify-between items-baseline gap-3 text-sm">
            <span className="text-muted">Confirmation #</span>
            <span className="font-mono text-xs break-all">{state.bookingId}</span>
          </div>
        )}
        {start && end && (
          <div className="flex justify-between items-baseline gap-3 text-sm">
            <span className="text-muted">When</span>
            <span className="text-right">
              <div>{DATE_FMT.format(start)}</div>
              <div className="text-muted">
                {TIME_FMT.format(start)} – {TIME_FMT.format(end)}
              </div>
            </span>
          </div>
        )}
        <div className="flex justify-between items-baseline gap-3 text-sm">
          <span className="text-muted">Where</span>
          <span className="text-right">
            <div>{SITE.address.line1}</div>
            <div className="text-muted">
              {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
            </div>
          </span>
        </div>
      </div>

      <div className="bg-panel border border-hairline rounded-card p-6">
        <h2 className="text-xs uppercase tracking-wider text-muted mb-3">
          Before you arrive
        </h2>
        <ul className="space-y-2 text-sm">
          <li>· 24/7 keyless access — door code lands in your confirmation email</li>
          <li>· {SITE.address.directionsNote} — street parking on the block</li>
          <li>· Bring your own paper if you need a specific seamless color</li>
          <li>· Questions before then? {SITE.contact.email} · {SITE.contact.phone}</li>
        </ul>
      </div>

      <div className="flex gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium border border-hairline hover:border-tungsten hover:text-tungsten transition-colors"
        >
          ← Home
        </Link>
        <Link
          href="/book-native"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium bg-tungsten text-ink hover:bg-tungsten-soft transition-colors"
        >
          Book another
        </Link>
      </div>
    </div>
  );
}
