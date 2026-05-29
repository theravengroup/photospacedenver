"use client";

import { useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { Field, AddressGroup, Checkbox, Honeypot } from "./Fields";
import { TurnstileField } from "./TurnstileField";
import { submitInquiry, type FormStatus } from "@/lib/forms/submit";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null;

const CARD_STYLE = {
  style: {
    base: {
      color: "#1a1a1a",
      fontSize: "16px",
      fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
      "::placeholder": { color: "#8a8a8a" },
    },
    invalid: { color: "#b23a2e" },
  },
};

function InnerForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stripe || !elements) return;

    const form = e.currentTarget;
    const p = Object.fromEntries(new FormData(form)) as Record<string, string>;

    if (p.company_website) return; // honeypot
    if (!p.authorize) {
      setStatus("error");
      setError("Please authorize the hold to continue.");
      return;
    }
    const dollars = Number(p.replacement_value);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      setStatus("error");
      setError("Enter a valid replacement value.");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      // 1) Create the authorization hold (no card data server-side).
      const res = await fetch("/api/stripe/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: dollars,
          invoice_number: p.invoice_number,
          name: p.name,
          email: p.email,
          organization: p.organization,
        }),
      });
      const hold = (await res.json().catch(() => ({}))) as { clientSecret?: string; error?: string };
      if (!res.ok || !hold.clientSecret) throw new Error(hold.error || "Couldn't start the hold.");

      // 2) Authorize the card via Stripe Elements.
      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card field isn't ready — please try again.");
      const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(hold.clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: p.name,
            email: p.email,
            phone: p.phone,
            address: {
              line1: p.billing_street,
              line2: p.billing_line2 || undefined,
              city: p.billing_city,
              state: p.billing_state,
              postal_code: p.billing_zip,
            },
          },
        },
      });
      if (stripeErr) throw new Error(stripeErr.message || "Card authorization failed.");
      if (paymentIntent?.status !== "requires_capture") {
        throw new Error("The hold didn't complete. Please try again or call us.");
      }

      // 3) Notify staff (Turnstile verified here; no card data sent).
      await submitInquiry({
        type: "card_hold",
        name: p.name,
        email: p.email,
        phone: p.phone,
        organization: p.organization,
        invoice_number: p.invoice_number,
        replacement_value: `$${dollars.toFixed(2)}`,
        billing_street: p.billing_street,
        billing_line2: p.billing_line2,
        billing_city: p.billing_city,
        billing_state: p.billing_state,
        billing_zip: p.billing_zip,
        billing_country: p.billing_country,
        stripe_payment_intent: paymentIntent.id,
        "cf-turnstile-response": p["cf-turnstile-response"] ?? "",
      });

      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-card border border-hairline bg-panel p-8 text-center">
        <h3 className="font-display text-display-md">Hold authorized.</h3>
        <p className="measure mx-auto mt-3 text-muted">
          We&rsquo;ve placed a hold (not a charge) for the replacement value. It&rsquo;s released when gear is returned in good
          condition. We&rsquo;ll confirm your rental shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-6">
      <Honeypot />

      <Checkbox
        name="policy_agreement"
        required
        label={
          <>
            I have read and agree to the{" "}
            <Link href="/policies" target="_blank" className="text-tungsten hover:underline">
              photospace policies
            </Link>
            .
          </>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Organization / company" name="organization" required autoComplete="organization" />
        <Field label="Invoice number" name="invoice_number" required />
        <Field label="Full name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
        <Field label="Replacement value (USD)" name="replacement_value" type="number" required placeholder="e.g. 4500" />
      </div>

      <AddressGroup label="Billing address (must match your card)" prefix="billing" required />

      <div className="block">
        <span className="mb-1.5 block text-sm text-muted">
          Card details<span className="text-tungsten"> *</span>
        </span>
        <div className="rounded-card border border-hairline bg-white px-4 py-3.5">
          <CardElement options={CARD_STYLE} />
        </div>
      </div>

      <Checkbox
        name="authorize"
        required
        label="I authorize photospace to place a hold on this card for the full replacement value of my rental, in lieu of a Certificate of Insurance."
      />

      <TurnstileField />

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status === "sending" || !stripe} tracking={{ type: "submit_card_hold", page: "no-insurance", location: "form" }}>
          {status === "sending" ? "Authorizing…" : "Authorize Hold"}
        </Button>
        {status === "error" && (
          <p role="alert" className="text-sm text-studio-red">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

export function CardHoldForm() {
  if (!stripePromise) {
    return (
      <div className="rounded-card border border-hairline bg-panel p-8">
        <h3 className="font-display text-display-md">Card holds aren&rsquo;t available online yet.</h3>
        <p className="measure mt-3 text-muted">
          Please submit a{" "}
          <Link href="/submit-coi" className="text-tungsten hover:underline">
            Certificate of Insurance
          </Link>{" "}
          instead, or call us and we&rsquo;ll take the hold over the phone.
        </p>
      </div>
    );
  }
  return (
    <Elements stripe={stripePromise}>
      <InnerForm />
    </Elements>
  );
}
