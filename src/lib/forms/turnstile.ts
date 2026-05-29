/**
 * Server-side Cloudflare Turnstile verification.
 *
 * Mirrors the Resend no-key fallback in /api/inquiry: if TURNSTILE_SECRET_KEY
 * is unset (local dev, or before keys are provisioned) verification is skipped
 * so forms still work end-to-end. Once the secret is set, a valid token is
 * required. The client widget (TurnstileField) injects the token under the
 * field name "cf-turnstile-response".
 */
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string | undefined,
  ip?: string | null,
): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true };
  if (!token) return { ok: false, error: "Please complete the spam check and try again." };

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean };
    return data.success ? { ok: true } : { ok: false, error: "Spam check failed. Please try again." };
  } catch {
    return { ok: false, error: "Couldn't verify the spam check. Please try again." };
  }
}
