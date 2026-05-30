"use client";

/**
 * Step 4 — collect first/last/email/phone + policies. Optional fields
 * (additional CC emails) hidden behind an expander to keep the surface
 * minimal. Browser autofill enabled.
 */

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { WizardState } from "../state";

function emailValid(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}
function phoneValid(s: string): boolean {
  // Accept anything with at least 10 digits, ignoring punctuation
  return (s.replace(/\D/g, "").length >= 10);
}

export function IntakeStep({
  state,
  onChange,
  onContinue,
  onBack,
}: {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const [ccOpen, setCcOpen] = useState(state.additionalEmails.length > 0);
  const [ccDraft, setCcDraft] = useState("");

  const firstOk = state.customerFirstName.trim().length > 0;
  const lastOk = state.customerLastName.trim().length > 0;
  const emailOk = emailValid(state.customerEmail);
  const phoneOk = phoneValid(state.customerPhone);
  const canContinue = firstOk && lastOk && emailOk && phoneOk && state.policiesAccepted;

  function addCc() {
    const v = ccDraft.trim();
    if (!v || !emailValid(v) || state.additionalEmails.includes(v)) return;
    onChange({ additionalEmails: [...state.additionalEmails, v] });
    setCcDraft("");
  }
  function removeCc(email: string) {
    onChange({ additionalEmails: state.additionalEmails.filter((e) => e !== email) });
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">Your info</h1>
        <p className="text-muted mt-2 text-sm sm:text-base">
          Just the basics — we&apos;ll use this to confirm your booking and
          reach you if anything comes up.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="First name" required>
          <input
            type="text"
            autoComplete="given-name"
            value={state.customerFirstName}
            onChange={(e) => onChange({ customerFirstName: e.target.value })}
            className="FIELD w-full"
          />
        </Field>
        <Field label="Last name" required>
          <input
            type="text"
            autoComplete="family-name"
            value={state.customerLastName}
            onChange={(e) => onChange({ customerLastName: e.target.value })}
            className="FIELD w-full"
          />
        </Field>
        <Field label="Email" required>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            value={state.customerEmail}
            onChange={(e) => onChange({ customerEmail: e.target.value })}
            className="FIELD w-full"
          />
        </Field>
        <Field label="Phone" required>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={state.customerPhone}
            onChange={(e) => onChange({ customerPhone: e.target.value })}
            className="FIELD w-full"
            placeholder="(303) 555-0123"
          />
        </Field>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setCcOpen((v) => !v)}
          className="text-sm text-muted hover:text-current underline underline-offset-4"
          aria-expanded={ccOpen}
        >
          {ccOpen ? "Hide" : "Cc someone else? (producer, client, assistant)"}
        </button>
        {ccOpen && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                value={ccDraft}
                onChange={(e) => setCcDraft(e.target.value)}
                placeholder="email@example.com"
                className="FIELD flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCc();
                  }
                }}
              />
              <button
                type="button"
                onClick={addCc}
                disabled={!emailValid(ccDraft)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm border transition-colors",
                  emailValid(ccDraft)
                    ? "border-tungsten text-tungsten hover:bg-tungsten/10"
                    : "border-hairline text-muted cursor-not-allowed",
                )}
              >
                Add
              </button>
            </div>
            {state.additionalEmails.length > 0 && (
              <ul className="flex flex-wrap gap-2 pt-1">
                {state.additionalEmails.map((e) => (
                  <li
                    key={e}
                    className="inline-flex items-center gap-1.5 rounded-full bg-hairline/30 px-3 py-1 text-xs"
                  >
                    {e}
                    <button
                      type="button"
                      onClick={() => removeCc(e)}
                      className="text-muted hover:text-current"
                      aria-label={`Remove ${e}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <label className="flex items-start gap-3 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={state.policiesAccepted}
          onChange={(e) => onChange({ policiesAccepted: e.target.checked })}
          className="mt-1 accent-tungsten"
        />
        <span className="text-muted">
          I&apos;ve read and accept the{" "}
          <Link href="/policies" target="_blank" className="text-current underline underline-offset-4">
            studio policies
          </Link>{" "}
          (cancellation, damage, conduct).
        </span>
      </label>

      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted hover:text-current underline underline-offset-4"
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors",
            canContinue
              ? "bg-tungsten text-ink hover:bg-tungsten-soft"
              : "bg-panel text-muted border border-hairline cursor-not-allowed",
          )}
        >
          Continue to payment →
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm text-muted mb-1.5">
        {label}
        {required && <span className="text-tungsten ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
