"use client";

/**
 * Client shell for /book-studio/success — polls /api/booking/status for up
 * to ~30s until the webhook flips the booking to confirmed. Renders an
 * optimistic confirmation UI immediately so the user isn't staring at a
 * spinner during the typical 1-2s webhook delay.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/content/site-config";

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

type StatusResponse = {
  id: string;
  status: string;
  appointmentLabel: string;
  startAt: string;
  endAt: string;
  totalCents: number;
};

export function SuccessShell({ bookingId }: { bookingId: string }) {
  const [booking, setBooking] = useState<StatusResponse | null>(null);
  const [status, setStatus] = useState<"polling" | "confirmed" | "stale" | "missing">(
    bookingId ? "polling" : "missing",
  );

  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 15; // ~30s total at 2s intervals

    async function poll() {
      attempts++;
      try {
        const res = await fetch(`/api/booking/status?id=${encodeURIComponent(bookingId)}`);
        const json: StatusResponse = await res.json();
        if (cancelled) return;
        if (res.ok && json?.id) {
          setBooking(json);
          if (json.status === "confirmed") {
            setStatus("confirmed");
            return;
          }
        }
        if (attempts >= maxAttempts) {
          setStatus("stale");
          return;
        }
        setTimeout(poll, 2000);
      } catch {
        if (cancelled) return;
        if (attempts >= maxAttempts) setStatus("stale");
        else setTimeout(poll, 2000);
      }
    }
    void poll();
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  if (status === "missing") {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="font-display text-3xl">No booking id in this URL</h1>
        <p className="text-muted">
          If you just paid, give it a moment and refresh. If the issue
          persists, email {SITE.contact.email}.
        </p>
        <Link
          href="/book-studio"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium bg-tungsten text-ink hover:bg-tungsten-soft transition-colors"
        >
          Start a new booking
        </Link>
      </div>
    );
  }

  const start = booking?.startAt ? new Date(booking.startAt) : null;
  const end = booking?.endAt ? new Date(booking.endAt) : null;
  const total = booking ? `$${(booking.totalCents / 100).toFixed(2)}` : "—";
  const isConfirmed = status === "confirmed";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-3">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-wider ${
            isConfirmed
              ? "border-tungsten/40 bg-tungsten/10 text-tungsten"
              : "border-hairline bg-panel text-muted"
          }`}
        >
          {isConfirmed ? "confirmed" : status === "stale" ? "still processing" : "confirming…"}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl">
          {isConfirmed ? "You're booked" : "Almost there"}
        </h1>
        <p className="text-muted">
          {isConfirmed
            ? "A confirmation email is on the way. See you at the studio."
            : status === "stale"
              ? "Payment received — your booking is finalizing. Refresh in a moment, or check your email for the confirmation."
              : "Payment received. We're finalizing your booking — this usually takes a few seconds."}
        </p>
      </div>

      {booking && (
        <div className="bg-panel border border-hairline rounded-card p-6 space-y-4">
          <div className="flex justify-between items-baseline gap-3 text-sm">
            <span className="text-muted">Confirmation #</span>
            <span className="font-mono text-xs break-all">{booking.id}</span>
          </div>
          <div className="flex justify-between items-baseline gap-3 text-sm">
            <span className="text-muted">Session</span>
            <span>{booking.appointmentLabel}</span>
          </div>
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
              <div className="whitespace-nowrap">{SITE.address.street}</div>
              <div>{SITE.address.unit}</div>
              <div className="text-muted">
                {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
              </div>
            </span>
          </div>
          <div className="flex justify-between items-baseline gap-3 text-sm">
            <span className="text-muted">Total</span>
            <span className="font-display text-lg">{total}</span>
          </div>
        </div>
      )}

      <div className="bg-panel border border-hairline rounded-card p-6">
        <h2 className="text-xs uppercase tracking-wider text-muted mb-3">
          Before you arrive
        </h2>
        <ul className="space-y-2 text-sm">
          <li>· 24/7 keyless access — door code in your confirmation email</li>
          <li>· {SITE.address.directionsNote} — street parking on the block</li>
          <li>· Questions? {SITE.contact.email} · {SITE.contact.phone}</li>
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
          href="/book-studio"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium bg-tungsten text-ink hover:bg-tungsten-soft transition-colors"
        >
          Book another
        </Link>
      </div>
    </div>
  );
}
