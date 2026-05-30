"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  AlertCircle,
  CalendarX,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/cn";
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

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function ManageBookingShell({
  bookingId,
  status: initialStatus,
  appointmentLabel,
  startAt,
  endAt,
  customerFirstName,
  customerEmail,
  totalCents,
  isTour,
}: {
  bookingId: string;
  status: string;
  appointmentLabel: string;
  startAt: string;
  endAt: string;
  customerFirstName: string;
  customerEmail: string;
  totalCents: number;
  isTour: boolean;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const start = new Date(startAt);
  const end = new Date(endAt);
  // Date.now() at render is impure (lint rule react-hooks/purity); read it
  // once after mount via an async setter so set-state-in-effect is also
  // happy. Stale by definition (no live ticker) — acceptable: the user
  // re-loads when they want fresh data, and we re-check authoritatively
  // server-side at cancel time.
  const [hoursOut, setHoursOut] = useState<number>(0);
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (cancelled) return;
      setHoursOut((start.getTime() - Date.now()) / 3_600_000);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAt]);
  const beforeCutoff = hoursOut >= 72;

  async function cancel() {
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch(`/api/booking/cancel/${bookingId}`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error ?? "Couldn't cancel — please try again or call us.");
        setSubmitting(false);
        return;
      }
      setStatus("cancelled");
      setConfirming(false);
    } catch {
      setErr("Network error — try again or call us at " + SITE.contact.phone);
    } finally {
      setSubmitting(false);
    }
  }

  const alreadyCancelled = status === "cancelled";
  const alreadyExpired = status === "expired" || status === "draft";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <div className="text-base text-tungsten uppercase tracking-[0.16em] font-medium">
          Manage your booking
        </div>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">
          {alreadyCancelled
            ? "This booking is cancelled."
            : `Hi ${customerFirstName}.`}
        </h1>
        {!alreadyCancelled && (
          <p className="text-base sm:text-lg text-muted mt-2">
            Here&apos;s your reservation. You can cancel below, or reach us if
            you need to reschedule.
          </p>
        )}
      </header>

      <div className="glass-card rounded-card p-6 space-y-4">
        <Row k="Status" v={
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-base",
              alreadyCancelled ? "text-amber-400" : "text-tungsten",
            )}
          >
            {alreadyCancelled ? <CalendarX className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {status}
          </span>
        } />
        <Row k="Session" v={appointmentLabel} />
        <Row k="When" v={
          <>
            <div>{DATE_FMT.format(start)}</div>
            <div className="text-muted">
              {TIME_FMT.format(start)} – {TIME_FMT.format(end)}
            </div>
          </>
        } />
        <Row k="Where" v={
          <>
            <div>{SITE.address.line1}</div>
            <div className="text-muted">
              {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
            </div>
            <a
              href={SITE.address.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-tungsten hover:text-tungsten-soft underline underline-offset-4"
            >
              Get directions <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </>
        } />
        <Row k="Total" v={dollars(totalCents)} />
        <Row k="Confirmation #" v={
          <code className="text-xs font-mono text-muted">{bookingId}</code>
        } />
        <Row k="Account" v={
          <span className="text-muted text-sm">{customerEmail}</span>
        } />
      </div>

      {/* Cancellation panel */}
      {!alreadyCancelled && !alreadyExpired && (
        <div className="glass-card rounded-card p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-tungsten mt-0.5 shrink-0" />
            <div className="space-y-2">
              <h2 className="font-display text-xl">Cancellation policy</h2>
              <p className="text-base text-muted">
                Both windows result in <strong className="text-current">credit on file</strong>,
                rebookable within 60 days. We don&apos;t issue cash refunds — but
                the credit never expires before the 60-day window closes.
              </p>
              <ul className="text-sm text-muted space-y-1 pt-1">
                <li>
                  ·{" "}
                  <strong className="text-current">
                    {beforeCutoff ? "≥72 hours out" : "≥72 hours out"}
                  </strong>{" "}
                  — full credit, rebook anytime in 60 days.
                </li>
                <li>
                  ·{" "}
                  <strong className="text-current">
                    {!beforeCutoff ? "<72 hours out" : "<72 hours out"}
                  </strong>{" "}
                  — non-refundable, still rebookable for up to 60 days.
                </li>
              </ul>
              <p className="text-sm text-muted pt-2">
                You&apos;re currently <strong className="text-current">
                  {beforeCutoff
                    ? `~${Math.floor(hoursOut)} hours out`
                    : `inside the 72-hour window (~${Math.max(0, Math.floor(hoursOut))} hours away)`}
                </strong>
                . {beforeCutoff
                  ? "Cancelling now gives you a full credit."
                  : "Cancelling now means no cash refund, but the credit is still good for 60 days."}
              </p>
            </div>
          </div>

          {err && (
            <p className="text-sm text-amber-400" role="alert">{err}</p>
          )}

          {!confirming && (
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-medium border border-amber-400/60 text-amber-400 hover:bg-amber-400/10 transition-colors"
              >
                <CalendarX className="w-4 h-4" />
                Cancel this booking
              </button>
              <a
                href={`mailto:${SITE.contact.email}?subject=Reschedule booking ${bookingId}&body=Hi — I'd like to reschedule my booking (${bookingId}) for ${DATE_FMT.format(start)} at ${TIME_FMT.format(start)}. Could we move it to a new time? Thanks.`}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-medium border border-hairline text-bone hover:border-tungsten hover:text-tungsten transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Reschedule (email us)
              </a>
            </div>
          )}

          {confirming && (
            <div className="rounded-card border border-amber-400/40 bg-amber-400/5 p-4 space-y-3">
              <p className="text-base">
                Cancel <strong>{appointmentLabel}</strong> on{" "}
                <strong>{DATE_FMT.format(start)}</strong>?
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={cancel}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-medium bg-amber-400 text-ink hover:bg-amber-300 transition-colors disabled:opacity-60 disabled:cursor-wait"
                >
                  {submitting ? "Cancelling…" : "Yes, cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={submitting}
                  className="text-base text-muted hover:text-current underline underline-offset-4"
                >
                  Keep the booking
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {alreadyCancelled && (
        <div className="glass-card rounded-card p-6 text-base">
          This booking has been cancelled. Per policy, you have credit on file
          for <strong>60 days</strong>. Reply to your cancellation email or
          call <a href={SITE.contact.phoneHref} className="text-tungsten underline underline-offset-4">{SITE.contact.phone}</a>{" "}
          to rebook.
        </div>
      )}

      <div className="text-center pt-4">
        <Link
          href="/book-native"
          className="text-base text-muted hover:text-current underline underline-offset-4"
        >
          ← Back to booking
        </Link>
        {isTour && !alreadyCancelled && (
          <p className="text-sm text-muted mt-3">
            This is a Studio Tour — a staff member will meet you at the door at
            the time of your tour.
          </p>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-1 sm:gap-4 text-base">
      <dt className="text-sm uppercase tracking-[0.12em] text-muted">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
