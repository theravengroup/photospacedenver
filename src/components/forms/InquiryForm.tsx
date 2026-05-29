"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Honeypot } from "./Fields";
import { TurnstileField } from "./TurnstileField";
import { submitInquiry, type FormStatus } from "@/lib/forms/submit";

export function InquiryForm({
  type,
  page,
  submitLabel,
  successTitle,
  successBody,
  validate,
  children,
}: {
  type: "estimate" | "membership" | "contact" | "coi" | "registration";
  page: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  /** Optional pre-submit check (e.g. required uploads). Return an error string to block, or null to proceed. */
  validate?: (payload: Record<string, string>) => string | null;
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form)) as Record<string, string>;
    payload.type = type;

    const validationError = validate?.(payload);
    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    setStatus("sending");
    setError("");
    try {
      await submitInquiry(payload);
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
        <h3 className="font-display text-display-md">{successTitle}</h3>
        <p className="measure mx-auto mt-3 text-muted">{successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-6" data-page={page}>
      <Honeypot />
      {children}
      <TurnstileField />
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status === "sending"} tracking={{ type: `submit_${type}`, page, location: "form" }}>
          {status === "sending" ? "Sending…" : submitLabel}
        </Button>
        {status === "error" && (
          <p role="alert" className="text-sm text-studio-red">{error}</p>
        )}
      </div>
    </form>
  );
}
