import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { EstimateCTA, BookingCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { FEES, usd } from "@/lib/content/pricing-data";

export const metadata = pageMeta({
  title: "Rental & Studio Policies — PhotoSpace Denver",
  description:
    "PhotoSpace Denver policies: insurance and liability, deposits and payment, cancellation and rescheduling, and studio-use terms.",
  path: "/policies",
  keywords: ["PhotoSpace Denver policies", "studio rental terms Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Policies", path: "/policies" },
];

// TODO(confirm): card processing fee 3% vs 3.5% (sources conflicted); have counsel review full legal text before launch.
const POLICIES: { id: string; title: string; paras: string[] }[] = [
  {
    id: "booking",
    title: "Booking, estimates & reservations",
    paras: [
      "Studio-only sessions (and the studio plus a preconfigured lighting kit) can be booked directly online. Gear and custom productions go through a written estimate.",
      `Nothing is reserved or guaranteed until you have (1) a rental account on file, (2) an approved estimate, and (3) a paid deposit or invoice. Estimates expire after five days. Minimum rental is ${usd(FEES.minimumRental)}.`,
    ],
  },
  {
    id: "payment",
    title: "Payment & deposits",
    paras: [
      `A ${FEES.depositPctOver3k}% deposit is required for rentals over $3,000; smaller rentals are paid in full to confirm.`,
      `A card processing fee of ${FEES.cardFeePct}% applies; ACH payments incur a ${FEES.achFeePct}% fee.`,
    ],
  },
  {
    id: "insurance",
    title: "Insurance",
    paras: [
      "For all rentals we must have either a certificate of insurance on file or a separate credit-card authorization for the full replacement value of your rental prior to gear pickup.",
      "First-time on-location renters register a rental account once, including a driver's license scan and two trade references.",
    ],
  },
  {
    id: "liability",
    title: "Liability waiver",
    paras: [
      "Studio and on-location use requires a signed liability waiver. You're responsible for the gear and space while in your care; damage, loss, or excessive cleaning may be billed.",
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation & rescheduling",
    paras: [
      "Reschedule or cancel a studio booking up to 72 hours before your start time for a full credit on file. Inside 72 hours, the booking is non-refundable but rebookable for up to 60 days.",
      "Members have a more flexible window — full details are in the membership terms.",
    ],
  },
  {
    id: "studio",
    title: "Studio use",
    paras: [
      `The cyclorama is provided on an as-is basis; a repaint is ${usd(FEES.cycRepaint)} plus paint at cost if a shoot marks it up. Large film/video productions or training may incur a power charge.`,
      "Please return the space and grip to the condition you found them. Off-hours access and Denver-metro delivery are available for an additional fee.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    paras: [
      "We collect the contact and billing information needed to set up your account, fulfill bookings, and reach you about a shoot. We don't sell your personal information.",
    ],
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    paras: [
      "Information on this site is provided in good faith and may change. Pricing and availability are confirmed in writing on your estimate or booking.",
    ],
  },
];

export default function PoliciesPage() {
  return (
    <>
      <PageHero
        eyebrow="Policies"
        title="Rental & studio policies."
        lede="The terms behind a smooth shoot — booking, insurance, payment, cancellation, and studio use."
        breadcrumbs={breadcrumbs}
      />

      <Section tone="light" containerSize="default">
        <div className="space-y-12">
          {POLICIES.map((p) => (
            <section key={p.id} id={p.id} className="scroll-mt-28 border-t border-hairline pt-6">
              <h2 className="font-display text-display-md">{p.title}</h2>
              <div className="measure mt-4 space-y-3 text-muted">
                {p.paras.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-12 text-xs text-muted">
          Questions about a specific booking? <Link href="/contact" className="text-tungsten hover:underline">Get in touch</Link>.
        </p>
      </Section>

      <FinalCTA eyebrow="Clear on the terms?" title="Book or request an estimate." tone="dark">
        <BookingCTA page="policies" location="final" size="lg" />
        <EstimateCTA page="policies" location="final" variant="outline" size="lg" />
      </FinalCTA>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
