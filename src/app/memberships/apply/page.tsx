import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Field, SelectField, TextArea, Checkbox } from "@/components/forms/Fields";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { MEMBERSHIP_TIERS, MEMBERSHIP_TERMS, usd } from "@/lib/content/pricing-data";

export const metadata = pageMeta({
  title: "Membership Application — photospace Denver",
  description: "Apply for a photospace Denver studio membership. Tell us about you and pick a tier — we'll follow up to complete the agreement and payment.",
  path: "/memberships/apply",
  noindex: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Memberships", path: "/memberships" },
  { name: "Apply", path: "/memberships/apply" },
];

const tierOptions = MEMBERSHIP_TIERS.map((t) => `${t.name} — ${t.hoursPerMonth} hrs/mo, ${usd(t.price)}/mo`);

export default function MembershipApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Membership application."
        lede="Tell us about you and pick a tier. We'll follow up to complete the agreement, signature, and payment — takes about three minutes to start."
        breadcrumbs={breadcrumbs}
      />

      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <InquiryForm
            type="membership"
            page="membership-apply"
            submitLabel="Submit Application"
            successTitle="Application received."
            successBody="Welcome — we'll be in touch shortly to complete your agreement, signature, and payment, and get you set up with 24/7 access."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" required autoComplete="name" />
              <Field label="Business (optional)" name="business" autoComplete="organization" />
              <Field label="Email" name="email" type="email" required autoComplete="email" />
              <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
              <Field label="City" name="city" autoComplete="address-level2" />
              <Field label="State" name="state" autoComplete="address-level1" />
            </div>
            <SelectField label="Which membership?" name="tier" required options={tierOptions} />
            <TextArea label="Anything we should know? (optional)" name="message" rows={4} placeholder="What you shoot, how often, and what you're hoping to get out of a membership." />
            <Checkbox
              name="agreement_ack"
              required
              label={`I understand membership is billed every ${MEMBERSHIP_TERMS.billingCycleDays} days with a ${MEMBERSHIP_TERMS.minimumCommitmentDays}-day minimum, and that photospace will follow up to complete the agreement, e-signature, and payment.`}
            />
          </InquiryForm>

          <aside className="rounded-card border border-hairline p-7">
            <h2 className="font-display text-display-md">How it works</h2>
            <ol className="mt-5 space-y-4 text-sm text-muted">
              <li><span className="text-tungsten">1.</span> Submit this application with your information and tier.</li>
              <li><span className="text-tungsten">2.</span> We send the membership agreement for e-signature.</li>
              <li><span className="text-tungsten">3.</span> Set up payment and get your 24/7 access — start shooting.</li>
            </ol>
            <p className="mt-6 text-xs text-muted">
              {/* TODO(Stripe + e-sign): wire native agreement signature + payment when keys/decision are in. */}
              Not ready to commit? A membership isn&rsquo;t required to rent — you can{" "}
              <Link href="/book" className="text-tungsten hover:underline">book the studio</Link> any time.
            </p>
          </aside>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
