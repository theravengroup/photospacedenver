import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { ApplicationForm } from "./ApplicationForm";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMeta({
  title: "Membership Application — photospace Denver",
  description:
    "Apply for a photospace Denver studio membership in four quick steps — your information, the agreement, your signature, and payment.",
  path: "/memberships/apply",
  noindex: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Memberships", path: "/memberships" },
  { name: "Apply", path: "/memberships/apply" },
];

export default function MembershipApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Membership application."
        lede="Four quick steps — your information, the membership agreement, your signature, then payment. Takes about three minutes."
        breadcrumbs={breadcrumbs}
      />

      <Section tone="light" containerSize="default">
        <ApplicationForm />
      </Section>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
