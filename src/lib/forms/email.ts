import { SITE } from "@/lib/content/site-config";

/**
 * Shared transactional-email sender. Uses the Resend REST API (no SDK) when
 * RESEND_API_KEY is set; otherwise logs and reports not-delivered so flows work
 * end-to-end before email is wired. Configure in production:
 *   RESEND_API_KEY, INQUIRY_TO_EMAIL, INQUIRY_FROM_EMAIL
 */

export type EmailAttachment = {
  filename: string;
  /** Base64-encoded file content (no data: prefix). */
  content: string;
};

export async function sendEmail({
  subject,
  text,
  replyTo,
  attachments,
}: {
  subject: string;
  text: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}): Promise<{ ok: boolean; delivered: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL ?? SITE.contact.email;
  const from = process.env.INQUIRY_FROM_EMAIL ?? "photospace Denver <onboarding@resend.dev>";

  if (!apiKey) {
    // TODO(env): set RESEND_API_KEY in production to actually deliver these.
    console.info(`[email] (no RESEND_API_KEY) ${subject}\n${text}`);
    return { ok: true, delivered: false };
  }

  const payload: Record<string, unknown> = { from, to, subject, text };
  if (replyTo) payload.reply_to = replyTo;
  if (attachments?.length) payload.attachments = attachments;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("Resend send failed", res.status, await res.text());
    return { ok: false, delivered: false, error: "We couldn't send that just now — please call us." };
  }
  return { ok: true, delivered: true };
}
