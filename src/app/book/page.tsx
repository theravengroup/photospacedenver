import Script from "next/script";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Steps } from "@/components/sections/Steps";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { BOOKING } from "@/lib/content/site-config";

export const metadata = pageMeta({
  title: "Book the Studio — PhotoSpace Denver",
  description:
    "Reserve the PhotoSpace Denver studio in under a minute — pick your block and lock it in. Free 20-minute studio tours available 7 days a week.",
  path: "/book",
  keywords: ["book photo studio Denver", "studio availability Denver", "reserve studio Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Book", path: "/book" },
];

const BOOK_STEPS = [
  { title: "Pick your block", body: "Choose a length — from a 2-hour minimum to a full day — and a time that works. Same rate, 24/7." },
  { title: "Lock it in", body: "Confirm your details and payment. No back-and-forth; the studio is yours." },
  { title: "Walk in ready", body: "Grip, lighting, and the tether station are set. Be shooting within fifteen minutes." },
];

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book"
        title="Reserve the studio in under a minute."
        lede="Pick a date, pick a time, lock it in — with live availability below. New here? Choose the free Studio Tour option to walk the space first."
        breadcrumbs={breadcrumbs}
      />

      <Section tone="light" containerSize="wide">
        <Steps steps={BOOK_STEPS} />
      </Section>

      <Section tone="light" id="tour" className="!pt-0" containerSize="wide">
        <SectionHeading eyebrow="Live availability" title="Book your session or a free tour." />
        <div className="mt-8 overflow-hidden rounded-card border border-hairline bg-panel">
          <iframe
            title="PhotoSpace Denver — book the studio (live availability)"
            src={BOOKING.acuityEmbed}
            className="w-full"
            style={{ minHeight: 1000, border: 0 }}
          />
        </div>
        <p className="mt-4 text-sm text-muted">
          Booking gear on location instead? <Link href="/request-estimate" className="text-tungsten hover:underline">Request an estimate</Link>.
        </p>
      </Section>

      <Script src="https://embed.acuityscheduling.com/js/embed.js" strategy="afterInteractive" />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
