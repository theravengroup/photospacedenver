"use client";

/**
 * MemberSignIn — prominent panel at the top of /book-native.
 *
 * Three states:
 *   1. Not signed in → tungsten-tinted glass panel with icon + headline +
 *      a "Sign in" CTA button. Clicking expands the magic-link form inline.
 *   2. Signed in, no active membership → neutral confirmation pill.
 *   3. Signed in as a member → tungsten-bordered status panel showing
 *      tier + email + remaining hours, with a sign-out link.
 *
 * The hours-balance number isn't stored here — the parent BookingWizard
 * forwards it from the live-pricing response via `preview`.
 */

import { useState } from "react";
import { Sparkles, Check, LogOut, Mail } from "lucide-react";
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

  // ─── State 3: signed-in active member ───────────────────────────────
  if (preview.signedIn && preview.tier) {
    return (
      <div
        className={cn(
          "mb-8 rounded-card border border-tungsten/50 p-5",
          "bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-tungsten)_10%,transparent),transparent_60%)]",
          "flex flex-wrap items-center gap-4",
        )}
      >
        <div
          className="grid place-items-center w-11 h-11 shrink-0 rounded-full bg-tungsten/20 text-tungsten"
          aria-hidden
        >
          <Check className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-xs uppercase tracking-[0.16em] text-tungsten font-medium">
              {preview.tier} member
            </span>
            <span className="text-sm text-muted truncate">{preview.email}</span>
          </div>
          <p className="mt-1 text-base sm:text-lg">
            {preview.hoursAvailable === 0 ? (
              "No membership hours left this cycle."
            ) : (
              <>
                <span className="font-display text-tungsten">
                  {preview.hoursAvailable}
                </span>{" "}
                membership {preview.hoursAvailable === 1 ? "hour" : "hours"}{" "}
                available — applied automatically at checkout.
              </>
            )}
          </p>
        </div>
        <form action="/auth/signout" method="post" className="shrink-0">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-current"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </form>
      </div>
    );
  }

  // ─── State 2: signed in but no membership ──────────────────────────
  if (preview.signedIn && !preview.tier) {
    return (
      <div className="mb-8 bg-panel border border-hairline rounded-card px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-base text-muted">
          Signed in as <span className="text-current">{preview.email}</span> — no
          active membership on file.
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-current"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </form>
      </div>
    );
  }

  // ─── State 1: not signed in — the prominent CTA ────────────────────
  return (
    <div
      className={cn(
        "mb-8 rounded-card border border-tungsten/45 p-5 sm:p-6",
        "bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-tungsten)_8%,transparent),transparent_55%)]",
        "transition-colors",
      )}
    >
      <div className="flex flex-wrap items-start gap-4">
        <div
          className="grid place-items-center w-12 h-12 shrink-0 rounded-full bg-tungsten/15 text-tungsten"
          aria-hidden
        >
          <Sparkles className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl sm:text-2xl">Already a member?</h2>
          <p className="text-base text-muted mt-1 max-w-md">
            Sign in and your membership hours auto-apply at checkout — no codes,
            no math.
          </p>
        </div>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border border-tungsten text-tungsten hover:bg-tungsten/10 transition-colors shrink-0"
          >
            <Mail className="w-4 h-4" />
            Sign in
          </button>
        )}
      </div>

      {open && status !== "sent" && (
        <div className="mt-5 pt-5 border-t border-hairline">
          <label className="block text-base text-muted mb-2">Member email</label>
          <div className="flex flex-wrap gap-2 items-start max-w-xl">
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
              placeholder="you@example.com"
              className="FIELD flex-1 min-w-0"
              disabled={status === "sending"}
              autoFocus
            />
            <button
              type="button"
              onClick={() => void sendLink()}
              disabled={!emailValid(email) || status === "sending"}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-3 text-base font-medium transition-colors shrink-0",
                emailValid(email) && status !== "sending"
                  ? "bg-tungsten text-ink hover:bg-tungsten-soft"
                  : "border border-hairline text-muted cursor-not-allowed",
              )}
            >
              <Mail className="w-4 h-4" />
              {status === "sending" ? "Sending…" : "Send sign-in link"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-base text-muted hover:text-current underline underline-offset-4 self-center pl-2"
            >
              Cancel
            </button>
          </div>
          <p className="text-sm text-muted mt-2">
            We&apos;ll email you a one-tap link. No password.
          </p>
        </div>
      )}

      {status === "sent" && (
        <div className="mt-5 pt-5 border-t border-hairline">
          <p className="text-base flex items-start gap-2">
            <Check className="w-5 h-5 text-tungsten mt-0.5 shrink-0" />
            <span>
              <span className="text-tungsten font-medium">Check your inbox.</span>{" "}
              <span className="text-muted">
                We sent a one-tap sign-in link to {email}. Open it on this
                device and you&apos;ll come right back here.
              </span>
            </span>
          </p>
        </div>
      )}

      {status === "error" && error && (
        <div className="mt-5 pt-5 border-t border-hairline">
          <p className="text-sm text-amber-400">
            Couldn&apos;t send the link: {error}
          </p>
        </div>
      )}
    </div>
  );
}
