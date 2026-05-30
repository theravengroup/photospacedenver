import "server-only";
import { SITE, CANONICAL_DOMAIN } from "@/lib/content/site-config";

/**
 * Branded HTML email layout for customer-facing transactional mail.
 *
 * Email-safe by design — uses tables for layout, inline CSS only, no web
 * fonts (Georgia for display, system sans for body — both are universally
 * available across Outlook/Gmail/Apple Mail/etc.).
 *
 * Brand pulls from the same tokens used on the site so it stays in sync:
 *   ink #0e0e0d · charcoal #1a1714 · bone #e8e3d8 · fog #b7afa2 · tungsten #c8842b
 *
 * Always paired with a `text` fallback in sendEmail — email clients that
 * refuse HTML still get the plain-text version.
 */

export type EmailDetailRow = {
  label: string;
  /** May contain a small amount of inline HTML — escape upstream if unsafe. */
  value: string;
};

export type BrandedEmailInput = {
  /** Hidden preheader shown in inbox preview (concise, ≤90 chars). */
  preheader: string;
  /** Tungsten eyebrow above the heading (e.g. "Confirmed", "Cancelled"). */
  eyebrow?: string;
  heading: string;
  intro?: string;
  /** Key/value rows shown in a small "booking details" card. */
  details?: EmailDetailRow[];
  /** Optional free-form HTML body inserted under the details card. */
  bodyHtml?: string;
  /** Optional CTA button. */
  cta?: { label: string; href: string };
  /** Optional secondary note (small italic line under the CTA). */
  footnote?: string;
};

const INK = "#0e0e0d";
const CHARCOAL = "#1a1714";
const BONE = "#e8e3d8";
const FOG = "#b7afa2";
const TUNGSTEN = "#c8842b";
const HAIRLINE = "rgba(244,241,234,0.12)";

const LOGO_URL = `${CANONICAL_DOMAIN}/images/brand/photospace-logo.png`;
const SITE_URL = CANONICAL_DOMAIN;

export function renderBrandedEmail(input: BrandedEmailInput): string {
  const detailsHtml = input.details?.length
    ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px 0;border:1px solid ${HAIRLINE};border-radius:10px;background-color:${CHARCOAL};">
      <tbody>
        ${input.details
          .map(
            (row, i) => `
          <tr>
            <td style="padding:14px 18px;${i > 0 ? `border-top:1px solid ${HAIRLINE};` : ""}">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td valign="top" align="left" style="color:${FOG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;width:32%;">${escapeHtml(row.label)}</td>
                  <td valign="top" align="right" style="color:${BONE};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.45;">${row.value}</td>
                </tr>
              </table>
            </td>
          </tr>`,
          )
          .join("")}
      </tbody>
    </table>`
    : "";

  const ctaHtml = input.cta
    ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 16px 0;">
      <tr>
        <td bgcolor="${TUNGSTEN}" style="border-radius:999px;">
          <a href="${escapeAttr(input.cta.href)}" style="display:inline-block;padding:14px 28px;color:${INK};text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-weight:600;font-size:15px;border-radius:999px;">${escapeHtml(input.cta.label)}</a>
        </td>
      </tr>
    </table>`
    : "";

  const eyebrowHtml = input.eyebrow
    ? `<div style="display:inline-block;padding:5px 12px;border:1px solid ${TUNGSTEN};border-radius:999px;color:${TUNGSTEN};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;margin-bottom:14px;">${escapeHtml(input.eyebrow)}</div>`
    : "";

  const introHtml = input.intro
    ? `<p style="margin:0 0 22px 0;color:${BONE};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:16px;line-height:1.55;">${escapeHtml(input.intro)}</p>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark light">
  <title>${escapeHtml(input.heading)}</title>
  <style>
    @media (max-width:600px) {
      .container { width:100% !important; padding:0 16px !important; }
      .card { padding:24px 20px !important; }
      h1.display { font-size:28px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${INK};color:${BONE};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <!-- Preheader (hidden, but used in inbox preview) -->
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    ${escapeHtml(input.preheader)}
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="${INK}" style="background-color:${INK};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Outer container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px;max-width:600px;">

          <!-- Logo header -->
          <tr>
            <td align="center" style="padding:0 0 28px 0;">
              <a href="${SITE_URL}" style="text-decoration:none;">
                <img src="${LOGO_URL}" alt="photospace Denver" width="180" style="display:block;border:0;outline:none;height:auto;max-width:180px;" />
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="card" bgcolor="${CHARCOAL}" style="background-color:${CHARCOAL};border:1px solid ${HAIRLINE};border-radius:14px;padding:36px 36px;">
              ${eyebrowHtml}
              <h1 class="display" style="margin:0 0 18px 0;color:${BONE};font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.15;font-weight:400;letter-spacing:-0.01em;">${escapeHtml(input.heading)}</h1>
              ${introHtml}
              ${detailsHtml}
              ${input.bodyHtml ?? ""}
              ${ctaHtml}
              ${
                input.footnote
                  ? `<p style="margin:6px 0 0 0;color:${FOG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;line-height:1.5;">${escapeHtml(input.footnote)}</p>`
                  : ""
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 8px 0 8px;color:${FOG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;line-height:1.6;">
              <strong style="color:${BONE};">${SITE.brand} Denver</strong><br>
              ${SITE.address.line1}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}<br>
              <a href="mailto:${SITE.contact.email}" style="color:${TUNGSTEN};text-decoration:none;">${SITE.contact.email}</a>
              &nbsp;·&nbsp;
              <a href="tel:${SITE.contact.phone.replace(/[^0-9+]/g, "")}" style="color:${TUNGSTEN};text-decoration:none;">${SITE.contact.phone}</a>
              <br><br>
              <span style="color:${FOG};font-size:12px;">Questions or changes? Just reply — we read every message.</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Minimal HTML-escape for user-supplied text in the template. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function escapeAttr(s: string): string {
  return escapeHtml(s);
}
