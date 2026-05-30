"use client";

/**
 * Client orchestrator for /book-studio. Holds the reducer state, fetches the
 * live pricing preview from /api/booking/quote whenever a price-affecting
 * field changes, creates the booking + intent on transition into payment,
 * and routes to the success page after Stripe redirects (or the inline
 * ConfirmationStep for the $0 path).
 *
 * Step routing:
 *   - Hourly path:    service → datetime → addons → intake → payment → confirmation
 *   - Multi-day path: service → multiday → intake → payment → confirmation
 *     (no add-ons in multi-day v1; customer's "tell us about the shoot" notes
 *      land in the booking's custom_gear_request field)
 *   - $0 path (free tour / 100%-off): skips payment, lands in confirmation
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
import { MemberSignIn } from "./parts/MemberSignIn";
import { ServiceStep } from "./steps/ServiceStep";
import { DateTimeStep } from "./steps/DateTimeStep";
import { MultiDayStep } from "./steps/MultiDayStep";
import { AddonsStep } from "./steps/AddonsStep";
import { IntakeStep } from "./steps/IntakeStep";
import { PaymentStep } from "./steps/PaymentStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";

export function BookingWizard() {
  const [state, dispatch] = useReducer(wizardReducer, INITIAL_STATE);

  const set = useCallback((patch: Partial<WizardState>) => dispatch({ type: "set", patch }), []);
  const goto = useCallback((step: StepId) => dispatch({ type: "goto", step }), []);

  const isMultiDay = state.appointmentTypeSlug === "multi-day";

  // Stepper shows only the steps that apply to the chosen path.
  const visibleSteps: StepId[] = isMultiDay
    ? ["service", "multiday", "intake", "payment", "confirmation"]
    : ["service", "datetime", "addons", "intake", "payment", "confirmation"];

  // Path-aware navigation. service → (multiday | datetime); multiday → intake;
  // datetime → addons; addons → intake.
  const fromService = useCallback(() => {
    goto(isMultiDay ? "multiday" : "datetime");
  }, [goto, isMultiDay]);
  const fromMultiDay = useCallback(() => goto("intake"), [goto]);
  const fromDateTime = useCallback(() => goto("addons"), [goto]);
  const fromAddons = useCallback(() => goto("intake"), [goto]);
  const backFromMultiDay = useCallback(() => goto("service"), [goto]);
  const backFromDateTime = useCallback(() => goto("service"), [goto]);
  const backFromAddons = useCallback(() => goto("datetime"), [goto]);
  const backFromIntake = useCallback(
    () => goto(isMultiDay ? "multiday" : "addons"),
    [goto, isMultiDay],
  );
  const backFromPayment = useCallback(() => goto("intake"), [goto]);

  // Live pricing preview — refetch whenever a price-affecting input changes.
  // Debounced 250ms.
  const debouncedFetchRef = useRef<number | null>(null);
  const livePriceInputs = useMemo(
    () =>
      JSON.stringify({
        slug: state.appointmentTypeSlug,
        startAt: state.startAt,
        endAt: state.endAt,
        mdStart: state.multiDayStartDate,
        mdEnd: state.multiDayEndDate,
        addons: state.addonSlugs,
        couponCode: state.couponCode.trim().toUpperCase(),
        // The coupon engine needs the email for allowlist / per-user-limit
        // checks; include it so live-preview reflects the real validation.
        email: state.customerEmail.trim().toLowerCase(),
      }),
    [
      state.appointmentTypeSlug,
      state.startAt,
      state.endAt,
      state.multiDayStartDate,
      state.multiDayEndDate,
      state.addonSlugs,
      state.couponCode,
      state.customerEmail,
    ],
  );

  useEffect(() => {
    if (!state.appointmentTypeSlug) return;
    // Multi-day needs a date range before we can preview.
    if (isMultiDay && (!state.multiDayStartDate || !state.multiDayEndDate)) return;
    // Hourly needs at least a duration; if no time yet we pass a placeholder
    // (pricing math is duration-driven, not time-driven).
    if (!isMultiDay && !state.hours) return;

    if (debouncedFetchRef.current) window.clearTimeout(debouncedFetchRef.current);
    debouncedFetchRef.current = window.setTimeout(() => {
      void (async () => {
        set({ livePricingLoading: true, livePricingError: null });
        try {
          const trimmedCoupon = state.couponCode.trim().toUpperCase();
          const body: Record<string, unknown> = {
            appointmentTypeSlug: state.appointmentTypeSlug,
            addonSlugs: state.addonSlugs,
            paymentMethod: "card",
            couponCode: trimmedCoupon || null,
            customerEmail: state.customerEmail.trim() || null,
          };
          if (isMultiDay) {
            body.multiDayStartDate = state.multiDayStartDate;
            body.multiDayEndDate = state.multiDayEndDate;
          } else {
            const start =
              state.startAt ??
              new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString();
            const end =
              state.endAt ??
              new Date(
                new Date(start).getTime() + state.hours! * 60 * 60 * 1000,
              ).toISOString();
            body.startAt = start;
            body.endAt = end;
          }

          const res = await fetch("/api/booking/quote", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
          });
          const json = await res.json();
          if (!res.ok) {
            set({
              livePricing: null,
              livePricingError: json.error ?? "quote_error",
              livePricingLoading: false,
            });
          } else {
            // Surface coupon validity back into wizard state so the UI can
            // render an applied chip OR a friendly error under the input.
            set({
              livePricing: json.pricing,
              livePricingError: null,
              livePricingLoading: false,
              appliedCouponCode: json.pricing?.couponCode ?? null,
              couponError: json.couponError ?? null,
              member: json.member ?? {
                signedIn: false,
                email: null,
                tier: null,
                hoursAvailable: 0,
              },
            });
          }
        } catch {
          set({
            livePricing: null,
            livePricingError: "network_error",
            livePricingLoading: false,
          });
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
      const trimmedCoupon = state.couponCode.trim().toUpperCase();
      const checkoutBody: Record<string, unknown> = {
        appointmentTypeSlug: state.appointmentTypeSlug,
        addonSlugs: state.addonSlugs,
        customerFirstName: state.customerFirstName,
        customerLastName: state.customerLastName,
        customerEmail: state.customerEmail,
        customerPhone: state.customerPhone,
        customerAdditionalEmails: state.additionalEmails,
        customGearRequest: state.customGearRequest || null,
        couponCode: trimmedCoupon || null,
        policiesAccepted: state.policiesAccepted,
        paymentMethod: "card",
      };
      if (isMultiDay) {
        checkoutBody.multiDayStartDate = state.multiDayStartDate;
        checkoutBody.multiDayEndDate = state.multiDayEndDate;
      } else {
        checkoutBody.startAt = state.startAt;
        checkoutBody.endAt = state.endAt;
      }

      const res = await fetch("/api/booking/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(checkoutBody),
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
        if (json.error === "not_available" || json.error === "requires_approval") {
          goto(isMultiDay ? "multiday" : "datetime");
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
      goto("payment");
    } catch {
      set({
        livePricingLoading: false,
        livePricingError: "Network error — try again.",
      });
    }
  }, [state, set, goto, isMultiDay]);

  const currentStep = state.step;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_24rem] gap-8 pb-24 lg:pb-0">
      <div>
        <MemberSignIn preview={state.member} />
        <Stepper current={currentStep} visibleSteps={visibleSteps} onJumpBack={goto} />

        {/* Step container — keyed by current step so React re-runs the fade-in
            animation on every step transition. */}
        <div key={currentStep} className="book-step-enter">
          {currentStep === "service" && (
            <ServiceStep state={state} onChange={set} onContinue={fromService} />
          )}
          {currentStep === "datetime" && (
            <DateTimeStep
              state={state}
              onChange={set}
              onContinue={fromDateTime}
              onBack={backFromDateTime}
            />
          )}
          {currentStep === "multiday" && (
            <MultiDayStep
              state={state}
              onChange={set}
              onContinue={fromMultiDay}
              onBack={backFromMultiDay}
            />
          )}
          {currentStep === "addons" && (
            <AddonsStep
              state={state}
              onChange={set}
              onContinue={fromAddons}
              onBack={backFromAddons}
            />
          )}
          {currentStep === "intake" && (
            <IntakeStep
              state={state}
              onChange={set}
              onContinue={handleIntakeContinue}
              onBack={backFromIntake}
            />
          )}
          {currentStep === "payment" && (
            <PaymentStep state={state} onBack={backFromPayment} />
          )}
          {currentStep === "confirmation" && <ConfirmationStep state={state} />}
        </div>
      </div>

      <PriceSummary state={state} />

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
