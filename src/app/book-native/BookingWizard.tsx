"use client";

/**
 * Client orchestrator for /book-native. Holds the reducer state, fetches the
 * live pricing preview from /api/booking/quote whenever a price-affecting
 * field changes, creates the booking + intent on transition into payment,
 * and routes to the success page after Stripe redirects (or the inline
 * ConfirmationStep for the $0 path).
 */

import { useEffect, useReducer, useCallback, useMemo, useRef } from "react";
import {
  INITIAL_STATE,
  wizardReducer,
  type StepId,
  type WizardState,
} from "./state";
import { Stepper } from "./parts/Stepper";
import { PriceSummary } from "./parts/PriceSummary";
import { ServiceStep } from "./steps/ServiceStep";
import { DateTimeStep } from "./steps/DateTimeStep";
import { AddonsStep } from "./steps/AddonsStep";
import { IntakeStep } from "./steps/IntakeStep";
import { PaymentStep } from "./steps/PaymentStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";

export function BookingWizard() {
  const [state, dispatch] = useReducer(wizardReducer, INITIAL_STATE);

  const set = useCallback((patch: Partial<WizardState>) => dispatch({ type: "set", patch }), []);
  const next = useCallback(() => dispatch({ type: "next" }), []);
  const back = useCallback(() => dispatch({ type: "back" }), []);
  const goto = useCallback((step: StepId) => dispatch({ type: "goto", step }), []);

  // Live pricing preview — refetch whenever a price-affecting input changes.
  // Skip on intake/payment/confirmation: by then the price is locked into the
  // server-created booking. Debounced.
  const debouncedFetchRef = useRef<number | null>(null);
  const livePriceInputs = useMemo(
    () =>
      JSON.stringify({
        slug: state.appointmentTypeSlug,
        startAt: state.startAt,
        endAt: state.endAt,
        addons: state.addonSlugs,
      }),
    [state.appointmentTypeSlug, state.startAt, state.endAt, state.addonSlugs],
  );

  useEffect(() => {
    if (!state.appointmentTypeSlug || !state.hours) return;
    // Only need a live price once the user has at least picked a service.
    // startAt/endAt drive availability — we can preview pricing without them
    // by passing now+24h as a placeholder, but the cleaner UX is to wait
    // until step 2 has a time. Either way works for pricing math.
    if (debouncedFetchRef.current) window.clearTimeout(debouncedFetchRef.current);
    debouncedFetchRef.current = window.setTimeout(() => {
      void (async () => {
        set({ livePricingLoading: true, livePricingError: null });
        try {
          // Placeholder times if user hasn't picked a slot yet — pricing is
          // duration-driven and doesn't actually depend on start/end value.
          const start =
            state.startAt ??
            new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString();
          const end =
            state.endAt ??
            new Date(
              new Date(start).getTime() + state.hours! * 60 * 60 * 1000,
            ).toISOString();
          const res = await fetch("/api/booking/quote", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              appointmentTypeSlug: state.appointmentTypeSlug,
              startAt: start,
              endAt: end,
              addonSlugs: state.addonSlugs,
              paymentMethod: "card",
            }),
          });
          const json = await res.json();
          if (!res.ok) {
            set({ livePricing: null, livePricingError: json.error ?? "quote_error", livePricingLoading: false });
          } else {
            set({ livePricing: json.pricing, livePricingError: null, livePricingLoading: false });
          }
        } catch {
          set({ livePricing: null, livePricingError: "network_error", livePricingLoading: false });
        }
      })();
    }, 250);
    return () => {
      if (debouncedFetchRef.current) window.clearTimeout(debouncedFetchRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livePriceInputs, state.hours, set]);

  // Submit booking to /api/booking/checkout when leaving Intake → Payment.
  const handleIntakeContinue = useCallback(async () => {
    set({ livePricingLoading: true, livePricingError: null });
    try {
      const res = await fetch("/api/booking/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          appointmentTypeSlug: state.appointmentTypeSlug,
          startAt: state.startAt,
          endAt: state.endAt,
          addonSlugs: state.addonSlugs,
          customerFirstName: state.customerFirstName,
          customerLastName: state.customerLastName,
          customerEmail: state.customerEmail,
          customerPhone: state.customerPhone,
          customerAdditionalEmails: state.additionalEmails,
          customGearRequest: state.customGearRequest || null,
          policiesAccepted: state.policiesAccepted,
          paymentMethod: "card",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        set({
          livePricingLoading: false,
          livePricingError:
            json.error === "not_available"
              ? "Slot was just taken — please pick another."
              : json.error ?? "Couldn't reserve slot — try again.",
        });
        // Knock the user back to the date step if the slot vanished
        if (json.error === "not_available" || json.error === "requires_approval") {
          goto("datetime");
        }
        return;
      }

      if (json.requiresPayment === false) {
        // $0 booking — already confirmed by the server. Skip Stripe step.
        set({
          bookingId: json.bookingId,
          requiresPayment: false,
          livePricingLoading: false,
        });
        goto("confirmation");
        return;
      }

      set({
        bookingId: json.bookingId,
        clientSecret: json.clientSecret,
        publishableKey: json.publishableKey,
        expiresAt: json.expiresAt,
        requiresPayment: true,
        livePricing: json.pricing,
        livePricingLoading: false,
      });
      next();
    } catch {
      set({
        livePricingLoading: false,
        livePricingError: "Network error — try again.",
      });
    }
  }, [state, set, next, goto]);

  // For paid bookings, Stripe redirects to /book-native/success directly;
  // no inline ConfirmationStep render. But if the user lands here in
  // confirmation state after the $0 path, render it.
  const currentStep = state.step;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 pb-24 lg:pb-0">
      <div>
        <Stepper current={currentStep} onJumpBack={goto} />

        {currentStep === "service" && (
          <ServiceStep state={state} onChange={set} onContinue={next} />
        )}
        {currentStep === "datetime" && (
          <DateTimeStep state={state} onChange={set} onContinue={next} onBack={back} />
        )}
        {currentStep === "addons" && (
          <AddonsStep state={state} onChange={set} onContinue={next} onBack={back} />
        )}
        {currentStep === "intake" && (
          <IntakeStep
            state={state}
            onChange={set}
            onContinue={handleIntakeContinue}
            onBack={back}
          />
        )}
        {currentStep === "payment" && <PaymentStep state={state} onBack={back} />}
        {currentStep === "confirmation" && <ConfirmationStep state={state} />}
      </div>

      <PriceSummary state={state} />

      {/* Hidden noscript guard so search engines see a meaningful skeleton */}
      <noscript>
        <p className="text-sm text-muted">
          The booking flow needs JavaScript. Email {""}
          <a href="mailto:hello@photospacedenver.com">hello@photospacedenver.com</a>{" "}
          and we&apos;ll book you by hand.
        </p>
      </noscript>
    </div>
  );
}
