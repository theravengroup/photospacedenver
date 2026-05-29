import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { CoiForm } from "@/components/forms/CoiForm";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/content/site-config";

export const metadata = pageMeta({
  title: "Submit Certificate of Insurance — photospace Denver",
  description:
    "Upload your Certificate of Insurance for an equipment rental. We'll match it to your account and confirm your booking.",
  path: "/submit-coi",
  noindex: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Submit Certificate of Insurance", path: "/submit-coi" },
];

export default function SubmitCoiPage() {
  return (
    <>
      <PageHero
        eyebrow="Insurance"
        title="Submit your Certificate of Insurance."
        lede="Renting gear on a Certificate of Insurance? Upload it here and we'll match it to your rental account."
        breadcrumbs={breadcrumbs}
      />

      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <CoiForm />

          <aside className="rounded-card border border-hairline p-7">
            <h2 className="font-display text-display-md">Before you upload</h2>
            <ul className="mt-5 space-y-4 text-sm text-muted">
              <li>The policy holder must match the name on your rental account.</li>
              <li>
                See the requirements on our{" "}
                <Link href="/policies#insurance" className="text-tungsten hover:underline">
                  insurance policy
                </Link>
                .
              </li>
              <li>
                No coverage? You can authorize a{" "}
                <Link href="/no-insurance" className="text-tungsten hover:underline">
                  credit-card hold
                </Link>{" "}
                for replacement value instead.
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
