"use client";

/**
 * Sticky sidebar summary that mirrors the server's pricing breakdown. Updates
 * live as the customer changes choices. Empty-state shown until the user has
 * picked a duration. On mobile this collapses to a compact bar across the
 * bottom that expands on tap.
 */

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { WizardState } from "../state";
import { ChevronDown, Receipt } from "lucide-react";

const TZ = "America/Denver";
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  weekday: "short",
  month: "short",
  day: "numeric",
});
const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
});

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function PriceSummary({ state }: { state: WizardState }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop: sticky right rail */}
      <aside
        aria-label="Booking summary"
        className="hidden lg:block w-full max-w-sm sticky top-24 self-start"
      >
        <SummaryBody state={state} />
      </aside>

      {/* Mobile: bottom sheet w/ collapse */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full bg-panel border-t border-hairline px-5 py-4 flex items-center justify-between"
          aria-expanded={mobileOpen}
        >
          <span className="text-sm">
            <span className="text-muted">Total: </span>
            <span className="font-medium">
              {state.livePricing ? dollars(state.livePricing.totalCents) : "—"}
            </span>
          </span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", mobileOpen && "rotate-180")}
          />
        </button>
        {mobileOpen && (
          <div className="bg-panel border-t border-hairline px-5 py-4 max-h-[60vh] overflow-y-auto">
            <SummaryBody state={state} />
          </div>
        )}
      </div>
    </>
  );
}

function SummaryBody({ state }: { state: WizardState }) {
  const pricing = state.livePricing;

  return (
    <div className="glass-card rounded-card p-6">
      <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-tungsten font-medium mb-4">
        <Receipt className="w-4 h-4" strokeWidth={1.75} aria-hidden />
        Your booking
      </h3>

      {!state.hours && !state.appointmentTypeSlug && (
        <p className="text-base text-muted">Pick a session to see your total.</p>
      )}

      {state.appointmentTypeSlug && (
        <dl className="space-y-2 text-base">
          {state.appointmentTypeSlug === "multi-day" ? (
            <>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Session</dt>
                <dd className="text-right">Multi-day rental</dd>
              </div>
              {state.multiDayStartDate && state.multiDayEndDate && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Dates</dt>
                  <dd className="text-right">
                    <div>{DATE_FMT.format(new Date(`${state.multiDayStartDate}T12:00:00`))}</div>
                    <div className="text-muted">
                      → {DATE_FMT.format(new Date(`${state.multiDayEndDate}T12:00:00`))}
                    </div>
                  </dd>
                </div>
              )}
            </>
          ) : (
            <>
              {state.hours != null && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Session</dt>
                  <dd className="text-right">
                    {state.appointmentTypeSlug === "tour"
                      ? "Studio Tour (free)"
                      : `${state.hours} ${state.hours === 1 ? "hour" : "hours"}`}
                  </dd>
                </div>
              )}
              {state.startAt && state.endAt && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">When</dt>
                  <dd className="text-right">
                    <div>{DATE_FMT.format(new Date(state.startAt))}</div>
                    <div className="text-muted">
                      {TIME_FMT.format(new Date(state.startAt))} – {TIME_FMT.format(new Date(state.endAt))}
                    </div>
                  </dd>
                </div>
              )}
            </>
          )}
        </dl>
      )}

      {pricing && (
        <>
          <div className="my-4 border-t border-hairline" />
          <dl className="space-y-2 text-base">
            {pricing.lineItems
              .filter((li) => li.key !== "processing-fee")
              .map((li) => (
                <div key={li.key} className="flex justify-between gap-3">
                  <dt className="text-muted">{li.label}</dt>
                  <dd>{li.amountCents === 0 ? "Free" : dollars(li.amountCents)}</dd>
                </div>
              ))}
            {pricing.couponCode && pricing.couponDiscountCents > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Coupon {pricing.couponCode}</dt>
                <dd className="text-tungsten">−{dollars(pricing.couponDiscountCents)}</dd>
              </div>
            )}
            {pricing.processingFeeCents > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Processing fee</dt>
                <dd>{dollars(pricing.processingFeeCents)}</dd>
              </div>
            )}
          </dl>
          <div className="my-4 border-t border-hairline" />
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted uppercase tracking-wider">Total</span>
            <span className="font-display text-3xl">{dollars(pricing.totalCents)}</span>
          </div>
        </>
      )}

      {state.livePricingLoading && (
        <p className="text-xs text-muted mt-3">Updating price…</p>
      )}
      {state.livePricingError && (
        <p className="text-xs text-amber-400 mt-3">Couldn&apos;t recompute — try again.</p>
      )}
    </div>
  );
}
