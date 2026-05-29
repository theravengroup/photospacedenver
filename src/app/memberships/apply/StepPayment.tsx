import Script from "next/script";
import { SITE } from "@/lib/content/site-config";

/**
 * Stripe-hosted pricing table (PCI-safe — card data never touches our server).
 * The publishable key and pricing-table id are public by design. Both come from
 * the photospace Stripe account; configure in the environment to override:
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  (already set)
 *   NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID (defaults to the account's table below)
 */
const PRICING_TABLE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID ?? "prctbl_0Sf9kMJGRaKVwK8ZehxY63wD";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export function StepPayment() {
  return (
    <div className="space-y-10">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-tungsten">
          Application received · Step 4 of 4
        </p>
        <h2 className="font-display mt-2 text-display-md">Choose your plan and pay.</h2>
        <p className="mt-3 max-w-xl text-muted">
          First-month payment is required at signup. You can switch tiers later by emailing us. Monthly
          memberships for professional photographers and videographers.
        </p>
      </header>

      {PUBLISHABLE_KEY ? (
        <>
          <Script src="https://js.stripe.com/v3/pricing-table.js" strategy="afterInteractive" />
          <div
            className="overflow-hidden rounded-card border border-hairline bg-panel p-2 md:p-4"
            dangerouslySetInnerHTML={{
              __html: `<stripe-pricing-table pricing-table-id="${PRICING_TABLE_ID}" publishable-key="${PUBLISHABLE_KEY}"></stripe-pricing-table>`,
            }}
          />
        </>
      ) : (
        <div className="rounded-card border border-hairline bg-panel p-6 text-sm text-muted">
          Payment isn&rsquo;t configured in this environment yet. Your application has been received — we&rsquo;ll
          email you a secure checkout link to finish.
        </div>
      )}

      <div className="rounded-card border border-hairline bg-panel p-6 text-sm leading-relaxed text-muted">
        <p>
          <strong className="font-semibold text-ink">Heads up.</strong> Payment is handled securely by Stripe.
          After checkout, you&rsquo;ll receive a receipt and we&rsquo;ll provision your 24/7 access within one
          business day. Need help?{" "}
          <a href={SITE.contact.emailHref} className="text-tungsten underline-offset-4 hover:underline">
            {SITE.contact.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
