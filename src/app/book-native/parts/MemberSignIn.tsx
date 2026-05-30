"use client";

/**
 * MemberSignIn — small panel that lives at the top of the booking wizard.
 *
 * - Not signed in: collapsed link "Member? Sign in to use your membership hours →".
 *   Clicking expands an email input + "Send sign-in link" button. We call
 *   Supabase Auth's signInWithOtp({ email }) which sends a magic link to
 *   {APP}/auth/callback?code=... — that route exchanges the code for a
 *   session cookie and redirects back here.
 *
 * - Signed in, no member record: shows the email + "Sign out" link.
 *
 * - Signed in as an active member: shows tier + free-hours balance pulled
 *   from the latest live-pricing call's `member` payload.
 *
 * The hours-balance number isn't stored here — the parent BookingWizard
 * forwards it from the live-pricing response.
 */

import { useState } from "react";
import { cn } from "@/lib/cn";
import { supabaseBrowser } from "@/lib/supabase/client";

export type MemberPreview = {
  signedIn: boolean;
  email: string | null;
  tier: "spark" | "creator" | "visionary" | null;
  hoursAvailable: number;
};

function emailValid(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export function MemberSignIn({ preview }: { preview: MemberPreview }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function sendLink() {
    if (!emailValid(email)) return;
    setStatus("sending");
    setError(null);
    try {
      const sb = supabaseBrowser();
      const { error: err } = await sb.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/book-native`,
          shouldCreateUser: true,
        },
      });
      if (err) {
        setStatus("error");
        setError(err.message);
        return;
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  // Signed in as an active member → show the status pill
  if (preview.signedIn && preview.tier) {
    return (
      <div className="bg-panel border border-tungsten/40 rounded-card px-4 py-3 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          <span className="text-tungsten font-medium uppercase tracking-wider text-xs mr-2">
            {preview.tier} member
          </span>
          <span className="text-muted">{preview.email}</span>
          <span className="block sm:inline sm:ml-3 mt-1 sm:mt-0 text-base">
            {preview.hoursAvailable === 0
              ? "No membership hours left this cycle"
              : `${preview.hoursAvailable} membership ${
                  preview.hoursAvailable === 1 ? "hour" : "hours"
                } available — applied automatically`}
          </span>
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-sm text-muted hover:text-current underline underline-offset-4"
          >
            Sign out
          </button>
        </form>
      </div>
    );
  }

  // Signed in but no active membership → still useful: show + offer sign-out
  if (preview.signedIn && !preview.tier) {
    return (
      <div className="bg-panel border border-hairline rounded-card px-4 py-3 mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="text-muted">
          Signed in as <span className="text-current">{preview.email}</span> — no
          active membership on file.
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-sm text-muted hover:text-current underline underline-offset-4"
          >
            Sign out
          </button>
        </form>
      </div>
    );
  }

  // Not signed in → collapsed link, expands to magic-link form
  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm text-tungsten hover:text-tungsten-soft underline underline-offset-4"
      >
        {open
          ? "Cancel"
          : "Member? Sign in to use your membership hours →"}
      </button>
      {open && status !== "sent" && (
        <div className="mt-3 flex flex-wrap gap-2 items-start max-w-md">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void sendLink();
              }
            }}
            placeholder="your member email"
            className="FIELD flex-1 min-w-0"
            disabled={status === "sending"}
          />
          <button
            type="button"
            onClick={() => void sendLink()}
            disabled={!emailValid(email) || status === "sending"}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm border transition-colors",
              emailValid(email) && status !== "sending"
                ? "border-tungsten text-tungsten hover:bg-tungsten/10"
                : "border-hairline text-muted cursor-not-allowed",
            )}
          >
            {status === "sending" ? "Sending…" : "Send sign-in link"}
          </button>
        </div>
      )}
      {status === "sent" && (
        <p className="mt-3 text-sm">
          <span className="text-tungsten">✓ Check your inbox.</span>{" "}
          <span className="text-muted">
            We sent a one-tap sign-in link to {email}. Open it on this device and
            you&apos;ll come right back here.
          </span>
        </p>
      )}
      {status === "error" && error && (
        <p className="mt-3 text-sm text-amber-400">
          Couldn&apos;t send the link: {error}
        </p>
      )}
    </div>
  );
}
