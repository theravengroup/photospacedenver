"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field, TextArea, SelectField, RadioGroup, AddressGroup, Honeypot } from "./Fields";
import { TurnstileField } from "./TurnstileField";
import { submitInquiry, type FormStatus } from "@/lib/forms/submit";

const RENTAL = {
  studio: "Studio only (daylight, or bringing your own lights)",
  studioGear: "Studio + gear",
  equipment: "Equipment only (taking gear on location)",
} as const;

export function EstimateForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  const [rentalType, setRentalType] = useState("");
  const [fulfillment, setFulfillment] = useState("");
  const [rentalAccount, setRentalAccount] = useState("");

  const needsRentalAccount = rentalAccount === "No";

  const showStudioDates = rentalType === RENTAL.studio || rentalType === RENTAL.studioGear;
  const showGearList = rentalType === RENTAL.studioGear || rentalType === RENTAL.equipment;
  const isEquipment = rentalType === RENTAL.equipment;
  const isPickup = isEquipment && fulfillment === "Pickup";
  const isDelivery = isEquipment && fulfillment === "Delivery";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    const payload = Object.fromEntries(new FormData(form)) as Record<string, string>;
    payload.type = "estimate";
    try {
      await submitInquiry(payload);
      setStatus("ok");
      form.reset();
      setRentalType("");
      setFulfillment("");
      setRentalAccount("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-card border border-hairline bg-panel p-8 text-center">
        <h3 className="font-display text-display-md">Quote request received.</h3>
        <p className="measure mx-auto mt-3 text-muted">
          Thanks — we&rsquo;ll review availability and follow up with a written quote, usually the same business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-7" data-page="request-estimate">
      <Honeypot />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Are you a photospace member?" name="member" required options={["No", "Yes"]} />
        <SelectField label="Do you have a rental account?" name="rental_account" required options={["No", "Yes"]} onChange={setRentalAccount} />
      </div>
      <p className="-mt-3 text-xs text-muted">
        Membership and a rental account are separate — a rental account is a one-time setup for taking gear out.
      </p>

      {needsRentalAccount && (
        <div role="status" className="flex items-start gap-3 rounded-card border border-tungsten/30 bg-tungsten/5 p-4">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="mt-0.5 shrink-0 text-tungsten">
            <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 8v4M9 5.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-sm leading-relaxed">
            <span className="font-medium text-ink">Estimates are free and open to anyone</span> — request away. To
            actually rent gear and take it on location, you&rsquo;ll need a one-time rental account.{" "}
            <Link href="/register" className="font-medium text-tungsten underline-offset-2 hover:underline">
              Set up your rental account &rarr;
            </Link>{" "}
            You can finish this estimate now and register before pickup.
          </p>
        </div>
      )}

      <RadioGroup
        label="For equipment, how will you cover replacement value?"
        name="insurance_method"
        required
        options={[
          "Submit a Certificate of Insurance",
          "Authorize a credit-card hold for replacement value",
        ]}
      />

      <RadioGroup
        label="Preferred payment method"
        name="payment_method"
        required
        options={["Credit Card (3.5% fee)", "ACH (1% fee)", "Pre-Paid Account"]}
      />

      <SelectField
        label="What type of rental?"
        name="rental_type"
        required
        options={[RENTAL.studio, RENTAL.studioGear, RENTAL.equipment]}
        onChange={setRentalType}
      />

      {rentalType === RENTAL.studio && (
        <p className="rounded-card border border-hairline bg-panel p-4 text-sm text-muted">
          Just the room — daylight or your own lights. List any add-ons (lighting, modifiers, grip) in the brief below and
          we&rsquo;ll quote them from the on-site gear house.
        </p>
      )}

      {showStudioDates && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Start date" name="start_date" type="date" required />
          <Field label="End date" name="end_date" type="date" required />
        </div>
      )}

      {isEquipment && (
        <SelectField
          label="Pickup or delivery?"
          name="fulfillment"
          required
          options={["Pickup", "Delivery"]}
          onChange={setFulfillment}
        />
      )}

      {isPickup && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Pickup date" name="pickup_date" type="date" required />
          <Field label="Pickup time" name="pickup_time" type="time" required />
          <Field label="Return date" name="return_date" type="date" required />
          <Field label="Return time" name="return_time" type="time" required />
        </div>
      )}

      {isDelivery && (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Delivery date" name="delivery_date" type="date" required />
            <Field label="Delivery time" name="delivery_time" type="time" required />
            <Field label="Collection date" name="collection_date" type="date" required />
            <Field label="Collection time" name="collection_time" type="time" required />
          </div>
          <AddressGroup label="Delivery address" prefix="delivery_addr" required />
          <AddressGroup label="Collection / pickup address" prefix="pickup_addr" required />
        </div>
      )}

      {showGearList && (
        <TextArea
          label="What gear / equipment / supplies are you requesting?"
          name="gear_list"
          required
          placeholder="Paste your full list — lighting, modifiers, cameras, lenses, grip, supplies."
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
      </div>

      <TurnstileField />

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={status === "sending"}
          tracking={{ type: "submit_estimate", page: "request-estimate", location: "form" }}
        >
          {status === "sending" ? "Sending…" : "Request a Quote"}
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
