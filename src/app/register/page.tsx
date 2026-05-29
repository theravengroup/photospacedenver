import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/content/site-config";

export const metadata = pageMeta({
  title: "Set Up a Rental Account — photospace Denver",
  description:
    "Register a rental account to take gear on location. One-time setup: your details, a driver's license, and two business references.",
  path: "/register",
  noindex: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Set Up a Rental Account", path: "/register" },
];

export default function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Rental account"
        title="Set up a rental account."
        lede="A one-time setup so you can take gear on location. Tell us about yourself, add a driver's license and two business references, and we'll get you approved — usually within a business day."
        breadcrumbs={breadcrumbs}
      />

      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <RegisterForm />

          <aside className="rounded-card border border-hairline p-7">
            <h2 className="font-display text-display-md">Good to know</h2>
            <ul className="mt-5 space-y-4 text-sm text-muted">
              <li>This is a one-time setup — you won&rsquo;t need to do it again for future rentals.</li>
              <li>References are ideally other rental houses or clients you&rsquo;ve worked with.</li>
              <li>
                For each on-location rental you&rsquo;ll either submit a{" "}
                <Link href="/insurance" className="text-tungsten hover:underline">
                  Certificate of Insurance
                </Link>{" "}
                or authorize a{" "}
                <Link href="/no-insurance" className="text-tungsten hover:underline">
                  card hold
                </Link>{" "}
                for replacement value.
              </li>
              <li>Just need the studio? No account required — book it directly.</li>
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
