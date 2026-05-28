import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Field, TextArea, SelectField } from "@/components/forms/Fields";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/content/site-config";

export const metadata = pageMeta({
  title: "Request an Estimate — PhotoSpace Denver",
  description:
    "Request a written estimate for studio, gear, or production. Send your dates and gear list — we'll confirm availability, usually the same business day.",
  path: "/request-estimate",
  noindex: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Request an Estimate", path: "/request-estimate" },
];

export default function RequestEstimatePage() {
  return (
    <>
      <PageHero
        eyebrow="Estimate"
        title="Request an estimate."
        lede="Tell us what you need and when. We'll check availability, advise on anything we'd swap or add, and send a written estimate — usually the same business day."
        breadcrumbs={breadcrumbs}
      />

      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <InquiryForm
            type="estimate"
            page="request-estimate"
            submitLabel="Request an Estimate"
            successTitle="Estimate request received."
            successBody="Thanks — we'll review availability and follow up with a written estimate, usually the same business day."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" required autoComplete="name" />
              <Field label="Email" name="email" type="email" required autoComplete="email" />
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
              <SelectField
                label="What do you need?"
                name="rental_type"
                required
                options={["Studio only", "Studio + gear", "Gear only", "Production support"]}
              />
              <Field label="Start date" name="start_date" type="date" />
              <Field label="End date" name="end_date" type="date" />
            </div>
            <SelectField label="Pickup or delivery?" name="fulfillment" options={["Pickup at the shop", "Denver-metro delivery", "Not sure yet"]} />
            <TextArea
              label="Gear list / brief"
              name="details"
              placeholder="The gear you need (or a brief), shoot dates, and any unknowns."
            />
          </InquiryForm>

          <aside className="rounded-card border border-hairline p-7">
            <h2 className="font-display text-display-md">What happens next</h2>
            <ol className="mt-5 space-y-4 text-sm text-muted">
              <li><span className="text-tungsten">1.</span> We confirm availability for your dates and send a written estimate.</li>
              <li><span className="text-tungsten">2.</span> First-time on-location renters register an account once (license + insurance or a card hold for replacement value).</li>
              <li><span className="text-tungsten">3.</span> Approve the estimate and we schedule pickup or Denver-metro delivery.</li>
            </ol>
            <p className="mt-6 text-xs text-muted">
              Just need the studio for a day? You can book that directly on the{" "}
              <Link href="/book" className="text-tungsten hover:underline">booking page</Link>.
            </p>
            <p className="mt-4 text-xs text-muted">
              Prefer to talk? Call <a href={SITE.contact.phoneHref} className="text-tungsten hover:underline">{SITE.contact.phone}</a>.
            </p>
          </aside>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
