import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { MembershipCards } from "@/components/sections/MembershipCards";
import { IncludedGrid } from "@/components/sections/IncludedGrid";
import { FaqList } from "@/components/sections/FaqList";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/Button";
import { MembershipCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { BOOKING, ANALYTICS_EVENTS } from "@/lib/content/site-config";
import { MEMBERSHIP_BENEFITS, MEMBERSHIP_TERMS, usd } from "@/lib/content/pricing-data";
import { faqsByTag } from "@/lib/content/faqs";

export const metadata = pageMeta({
  title: "Studio Memberships in Denver — photospace",
  description:
    "photospace Denver studio memberships: Spark (5 hrs, $425/mo), Creator (10 hrs, $895/mo), Visionary (20 hrs, $1,495/mo). 24/7 access, member rates, and discounted add-ons.",
  path: "/memberships",
  keywords: ["studio membership Denver", "photography studio membership Denver", "monthly studio access Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Memberships", path: "/memberships" },
];

const FOR = [
  "You shoot regularly — weekly or monthly content, client sessions, or campaigns.",
  "Content creators and growing brands batching recurring deliverables.",
  "Photographers and videographers who want a reliable home base at member rates.",
  "Podcasters, coaches, and founders recording on a steady cadence.",
];

const NOT_FOR = [
  "A single one-off shoot — just book hourly, no membership needed.",
  "Occasional, unpredictable use — the plan has a 90-day minimum.",
  "Teams that only need a full-day takeover once a year.",
];

export default function MembershipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Memberships"
        title="Create more. Pay less."
        lede="Three commitment levels, designed around how you actually shoot — recurring studio access at member rates, plus discounted camera, lens, and lighting add-ons."
        breadcrumbs={breadcrumbs}
      >
        <Button
          href={BOOKING.applyPath}
          size="md"
          tracking={{ type: "start_membership_application", event: ANALYTICS_EVENTS.startMembershipApplication, page: "memberships", location: "hero" }}
        >
          Apply for Membership
        </Button>
        <Button href="/pricing" variant="outline" size="md">Compare options</Button>
      </PageHero>

      <Section tone="light" containerSize="wide">
        <SectionHeading eyebrow="Choose your level" title="Built around how you shoot." />
        <div className="mt-10">
          <MembershipCards page="memberships" />
        </div>
      </Section>

      <Section tone="dark" className="grain" containerSize="wide">
        <SectionHeading
          eyebrow="What's included"
          title="Everything in a standard rental, plus more."
        />
        <div className="mt-10">
          <IncludedGrid items={MEMBERSHIP_BENEFITS} columns={3} />
        </div>
      </Section>

      <Section tone="light" containerSize="wide">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-card border border-hairline p-8">
            <h2 className="font-display text-display-md">Who it&rsquo;s for</h2>
            <ul className="mt-5 space-y-3">
              {FOR.map((f) => (
                <li key={f} className="flex gap-3 text-sm"><span className="text-tungsten">+</span>{f}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-card border border-hairline p-8">
            <h2 className="font-display text-display-md">Who it&rsquo;s not for</h2>
            <ul className="mt-5 space-y-3">
              {NOT_FOR.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-muted"><span>–</span>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="light" className="!pt-0" containerSize="wide">
        <SectionHeading eyebrow="How billing works" title="Straightforward terms." />
        <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Billing cycle", d: `Billed every ${MEMBERSHIP_TERMS.billingCycleDays} days.` },
            { t: "Minimum commitment", d: `${MEMBERSHIP_TERMS.minimumCommitmentDays}-day minimum, then auto-renews.` },
            { t: "Extra hours", d: `${usd(MEMBERSHIP_TERMS.extraHourRate)}/hr above your monthly hours.` },
            { t: "Rollover", d: "Hours don't roll over month to month." },
          ].map((x) => (
            <div key={x.t} className="border-t border-hairline pt-4">
              <dt className="font-medium">{x.t}</dt>
              <dd className="mt-1 text-sm text-muted">{x.d}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-xs text-muted">
          Cancel anytime in writing {MEMBERSHIP_TERMS.cancellationNoticeDays} days before your next billing
          date. A membership is not required to rent — anyone can book the studio. Full terms are
          presented in the application. {/* TODO(confirm): membership terms still current. */}
        </p>
      </Section>

      <Section tone="light" className="!pt-0">
        <SectionHeading eyebrow="FAQ" title="Membership questions." />
        <div className="mt-8">
          <FaqList faqs={faqsByTag("membership", "pricing", "content")} />
        </div>
      </Section>

      <FinalCTA
        eyebrow="Join the studio"
        title="Apply in about three minutes."
        body="Your information, the agreement, your signature, then payment. Welcome to the studio."
      >
        <Button
          href={BOOKING.applyPath}
          size="lg"
          tracking={{ type: "start_membership_application", event: ANALYTICS_EVENTS.startMembershipApplication, page: "memberships", location: "final" }}
        >
          Apply for Membership
        </Button>
        <MembershipCTA page="memberships" location="final" label="See the tiers" variant="outline" size="lg" />
      </FinalCTA>

      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          serviceSchema({
            name: "Studio memberships",
            description:
              "Monthly photo and video studio memberships in Denver with 24/7 access and member rates — Spark, Creator, and Visionary tiers.",
            path: "/memberships",
            serviceType: "Studio membership",
          }),
        ]}
      />
    </>
  );
}
