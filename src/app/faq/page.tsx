import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { FaqList } from "@/components/sections/FaqList";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { BookingCTA, EstimateCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { FAQS } from "@/lib/content/faqs";

export const metadata = pageMeta({
  title: "Studio Rental FAQ — PhotoSpace Denver",
  description:
    "Answers about renting PhotoSpace Denver: hourly pricing, what's included, video, memberships, booking, free tours, gear rental, delivery, and cancellation.",
  path: "/faq",
  keywords: ["studio rental FAQ Denver", "photo studio Denver questions"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered."
        lede="Everything about booking, pricing, gear, memberships, and how a day at PhotoSpace works."
        breadcrumbs={breadcrumbs}
      >
        <BookingCTA page="faq" location="hero" />
      </PageHero>

      <Section tone="light" containerSize="default">
        <FaqList faqs={FAQS} />
      </Section>

      <FinalCTA eyebrow="Still have a question?" title="Talk to a real person." body="Book a free tour, or request an estimate and we'll follow up.">
        <BookingCTA page="faq" location="final" size="lg" />
        <EstimateCTA page="faq" location="final" variant="outline" size="lg" />
      </FinalCTA>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
