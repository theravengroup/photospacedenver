import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { CoiForm } from "@/components/forms/CoiForm";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/content/site-config";

export const metadata = pageMeta({
  title: "Insurance & Certificate of Insurance — photospace Denver",
  description:
    "Insurance requirements for renting gear from photospace Denver: name us as additional insured / loss payee, required coverage limits, and how to submit your Certificate of Insurance.",
  path: "/insurance",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Insurance", path: "/insurance" },
];

// Commercial General Liability minimums (from the photospace insurance requirements).
const CGL_LIMITS: [string, string][] = [
  ["Each Occurrence", "$1,000,000"],
  ["Damage to Rented Premises", "$1,000,000"],
  ["Medical Expense", "$10,000"],
  ["Personal & Advertising Injury", "$1,000,000"],
  ["General Aggregate", "$1,000,000"],
  ["Products Liability", "$1,000,000"],
];

const SPECIAL_COVERAGES: [string, string][] = [
  ["Vehicle rentals — Automobile Liability", "$1,000,000 combined single limit"],
  ["International shoots — Foreign Liability", "$1,000,000 per occurrence"],
  ["Aircraft filming — Aircraft Liability", "$5,000,000"],
];

export default function InsurancePage() {
  return (
    <>
      <PageHero
        eyebrow="Insurance"
        title="Certificate of Insurance."
        lede={`Renting gear on insurance? Your policy must name ${SITE.legalName} as additional insured / loss payee. The easiest path is to send your agent a link to this page — they can read the requirements and upload your certificate right here.`}
        breadcrumbs={breadcrumbs}
      />

      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-display-md">What your certificate must include</h2>
              <ul className="mt-5 space-y-3 text-muted">
                <li>Names <strong className="text-foreground">{SITE.legalName}</strong> as additional insured / loss payee.</li>
                <li>States the coverage is for rented photo/video studio and/or equipment (and/or rented vehicle).</li>
                <li>A policy value equal to or greater than the replacement value of the rented equipment.</li>
                <li>A policy that has been active for <strong className="text-foreground">at least 90 days</strong> — we can&rsquo;t accept newer policies.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-display-sm">Commercial General Liability — minimum limits</h3>
              <dl className="mt-4 divide-y divide-hairline border-y border-hairline">
                {CGL_LIMITS.map(([term, amount]) => (
                  <div key={term} className="flex items-center justify-between gap-6 py-3">
                    <dt className="text-sm text-muted">{term}</dt>
                    <dd className="font-display text-base text-foreground">{amount}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="font-display text-display-sm">If applicable</h3>
              <dl className="mt-4 divide-y divide-hairline border-y border-hairline">
                {SPECIAL_COVERAGES.map(([term, amount]) => (
                  <div key={term} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <dt className="text-sm text-muted">{term}</dt>
                    <dd className="font-display text-base text-foreground">{amount}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border-t border-hairline pt-10">
              <h2 className="font-display text-display-md">Upload your certificate</h2>
              <p className="measure mt-3 text-muted">
                Already insured? Send it over and we&rsquo;ll match it to your account. Agents are welcome to upload on a
                client&rsquo;s behalf.
              </p>
              <div className="mt-6">
                <CoiForm />
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-card border border-hairline p-7 lg:sticky lg:top-28">
            <h2 className="font-display text-display-md">Name us as</h2>
            <address className="mt-4 not-italic text-sm text-muted">
              <span className="block text-foreground">{SITE.legalName}</span>
              <span className="block whitespace-nowrap">{SITE.address.street}</span>
              <span className="block">{SITE.address.unit}</span>
              <span className="block">
                {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
              </span>
            </address>
            <p className="mt-2 text-xs text-muted">List us as additional insured / loss payee.</p>

            <ul className="mt-6 space-y-4 border-t border-hairline pt-6 text-sm text-muted">
              <li>
                No coverage? You can authorize a{" "}
                <Link href="/no-insurance" className="text-tungsten hover:underline">credit-card hold</Link>{" "}
                for replacement value instead.
              </li>
              <li>
                First time renting gear? Set up your{" "}
                <Link href="/register" className="text-tungsten hover:underline">rental account</Link>{" "}
                first.
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
