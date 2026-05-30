"use client";

/**
 * Step 5 — Stripe Embedded Elements with PaymentElement (cards + Link
 * automatically surface based on dashboard config + customer email).
 *
 * The booking + PaymentIntent are created on transition INTO this step (in
 * BookingWizard) via POST /api/booking/checkout. By this point state has:
 *   - clientSecret (mounts Elements)
 *   - publishableKey (creates the Stripe instance)
 *   - bookingId (used in the return_url)
 *
 * On confirm, Stripe redirects to /book-native/success?booking_id=<id> where
 * we poll status until the webhook flips it to confirmed.
 */

import { useMemo, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Lock, Timer, CreditCard } from "lucide-react";
import { cn } from "@/lib/cn";
import type { WizardState } from "../state";

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function PaymentStep({
  state,
  onBack,
}: {
  state: WizardState;
  onBack: () => void;
}) {
  const stripePromise = useMemo<Promise<Stripe | null> | null>(() => {
    if (!state.publishableKey) return null;
    return loadStripe(state.publishableKey);
  }, [state.publishableKey]);

  if (!state.clientSecret || !stripePromise || !state.publishableKey) {
    return (
      <div className="space-y-4">
        <p className="text-muted text-sm">Preparing payment…</p>
        <div className="h-32 rounded-card border border-hairline bg-panel animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">Confirm and pay</h1>
        <p className="text-muted mt-2 text-sm sm:text-base">
          Secure payment via Stripe. Cards, Link, Apple/Google Pay where
          supported. We don&apos;t store your card — Stripe does.
        </p>
      </header>

      <div className="inline-flex items-center gap-2 text-xs text-muted">
        <Lock className="w-3.5 h-3.5 text-tungsten" strokeWidth={2} />
        Secure payment via Stripe — your card never touches our servers
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: state.clientSecret,
          appearance: {
            theme: "night",
            variables: {
              colorPrimary: "#c8842b",
              colorBackground: "#232019",
              colorText: "#e8e3d8",
              colorDanger: "#f59e0b",
              fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif",
              borderRadius: "10px",
              spacingUnit: "5px",
            },
            rules: {
              ".Input": {
                border: "1px solid rgba(244,241,234,0.12)",
                backgroundColor: "transparent",
              },
              ".Input:focus": {
                borderColor: "#c8842b",
                boxShadow: "0 0 0 1px #c8842b",
              },
              ".Label": {
                color: "#b7afa2",
                fontSize: "13px",
              },
              ".Tab": {
                border: "1px solid rgba(244,241,234,0.12)",
                backgroundColor: "transparent",
              },
              ".Tab:hover": { borderColor: "#c8842b" },
              ".Tab--selected": { borderColor: "#c8842b", color: "#c8842b" },
            },
          },
        }}
      >
        <CheckoutForm state={state} onBack={onBack} />
      </Elements>
    </div>
  );
}

function CheckoutForm({
  state,
  onBack,
}: {
  state: WizardState;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setErr(null);

    const returnUrl = new URL(
      `/book-native/success?booking_id=${encodeURIComponent(state.bookingId ?? "")}`,
      window.location.origin,
    ).toString();

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        receipt_email: state.customerEmail || undefined,
        payment_method_data: {
          billing_details: {
            name: `${state.customerFirstName} ${state.customerLastName}`.trim(),
            email: state.customerEmail || undefined,
            phone: state.customerPhone || undefined,
          },
        },
      },
    });

    if (error) {
      setErr(error.message ?? "Payment failed — please try again");
      setSubmitting(false);
    }
    // On success Stripe redirects; no further code runs here.
  }

  const totalCents = state.livePricing?.totalCents ?? 0;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="glass-card rounded-card p-5">
        <PaymentElement
          options={{
            layout: { type: "tabs", defaultCollapsed: false },
            wallets: { applePay: "auto", googlePay: "auto" },
          }}
        />
      </div>

      {state.expiresAt && (
        <p className="inline-flex items-center gap-2 text-xs text-muted">
          <Timer className="w-3.5 h-3.5" strokeWidth={1.75} />
          Your slot is held until{" "}
          {new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            timeZone: "America/Denver",
            timeZoneName: "short",
          }).format(new Date(state.expiresAt))}
          . Finish payment before then.
        </p>
      )}

      {err && (
        <p className="text-sm text-amber-400" role="alert">
          {err}
        </p>
      )}

      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="text-sm text-muted hover:text-current underline underline-offset-4"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-all duration-200 ease-cinematic",
            "bg-tungsten text-ink hover:bg-tungsten-soft hover:shadow-[0_10px_28px_-10px_rgba(200,132,43,0.6)] hover:-translate-y-px",
            submitting && "opacity-70 cursor-wait",
          )}
        >
          <CreditCard className="w-4 h-4" strokeWidth={2} />
          {submitting ? "Processing…" : `Confirm & pay ${dollars(totalCents)}`}
        </button>
      </div>
    </form>
  );
}
