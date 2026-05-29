import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { EstimateForm } from "@/components/forms/EstimateForm";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/content/site-config";

export const metadata = pageMeta({
  title: "Request a Quote — photospace Denver",
  description:
    "Request a written quote for studio, gear, or a multi-day shoot. Send your dates and gear list — we'll confirm availability, usually the same business day.",
  path: "/request-estimate",
  noindex: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Request a Quote", path: "/request-estimate" },
];

export default function RequestEstimatePage() {
  return (
    <>
      <PageHero
        eyebrow="Quote"
        title="Request a quote."
        lede="Tell us what you need and when. We'll check availability, advise on anything we'd swap or add, and send a written quote — usually the same business day."
        breadcrumbs={breadcrumbs}
      />

      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <EstimateForm />

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
