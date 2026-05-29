import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { CardHoldForm } from "@/components/forms/CardHoldForm";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/content/site-config";

export const metadata = pageMeta({
  title: "Authorize a Card Hold — photospace Denver",
  description:
    "No Certificate of Insurance? Authorize a credit-card hold for your rental's replacement value. It's a hold, not a charge — released when gear is returned.",
  path: "/no-insurance",
  noindex: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Authorize a Card Hold", path: "/no-insurance" },
];

export default function NoInsurancePage() {
  return (
    <>
      <PageHero
        eyebrow="Replacement-value hold"
        title="Renting without insurance."
        lede="No Certificate of Insurance? Authorize a credit-card hold for your rental's replacement value. It's a hold, not a charge — released when the gear comes back in good condition."
        breadcrumbs={breadcrumbs}
      />

      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <CardHoldForm />

          <aside className="rounded-card border border-hairline p-7">
            <h2 className="font-display text-display-md">How the hold works</h2>
            <ul className="mt-5 space-y-4 text-sm text-muted">
              <li>We place an authorization hold for the replacement value — your card isn&rsquo;t charged.</li>
              <li>The hold is released when gear is returned in good condition.</li>
              <li>
                Have coverage instead? Submit a{" "}
                <Link href="/submit-coi" className="text-tungsten hover:underline">
                  Certificate of Insurance
                </Link>
                .
              </li>
              <li>
                See terms on our{" "}
                <Link href="/policies#insurance" className="text-tungsten hover:underline">
                  insurance policy
                </Link>
                .
              </li>
            </ul>
            <p className="mt-6 text-xs text-muted">
              Questions? Call <a href={SITE.contact.phoneHref} className="text-tungsten hover:underline">{SITE.contact.phone}</a>.
            </p>
          </aside>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
