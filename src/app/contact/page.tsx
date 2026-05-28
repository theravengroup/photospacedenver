import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/Button";
import { TourCTA, BookingCTA } from "@/components/cta/Ctas";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/content/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE, ANALYTICS_EVENTS, CTA_LABELS } from "@/lib/content/site-config";

export const metadata = pageMeta({
  title: "Contact & Visit — photospace Denver",
  description:
    "Visit photospace Denver at 209 Kalamath St, Unit 1, Denver, CO 80223 — free parking and a load-in ramp. Call (303) 284-6057 or book a free 20-minute studio tour.",
  path: "/contact",
  keywords: ["photospace Denver location", "photo studio Denver address", "studio tour Denver"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(SITE.address.full)}&output=embed`;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact &amp; Visit"
        title="Come visit. Let&rsquo;s create."
        lede="Want to see the studio before you book? Stop by, take a free tour, and meet the team."
        breadcrumbs={breadcrumbs}
      >
        <TourCTA page="contact" location="hero" />
        <Button
          href={SITE.address.mapsHref}
          variant="outline"
          newTab
          tracking={{ type: "get_directions", page: "contact", location: "hero" }}
        >
          {CTA_LABELS.getDirections}
        </Button>
      </PageHero>

      <Section tone="light" containerSize="wide">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-display-md">The studio</h2>
            <address className="mt-5 space-y-4 not-italic">
              <div>
                <div className="text-sm uppercase tracking-[0.14em] text-muted">Address</div>
                <div className="mt-1">{SITE.address.full}</div>
                <div className="text-sm text-muted">{SITE.address.locationNote}</div>
                <div className="text-sm text-muted">{SITE.address.directionsNote}</div>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.14em] text-muted">Phone</div>
                <a
                  href={SITE.contact.phoneHref}
                  className="mt-1 inline-block hover:text-tungsten"
                  data-cta-type="call"
                  data-page="contact"
                  data-event={ANALYTICS_EVENTS.clickCall}
                >
                  {SITE.contact.phone}
                </a>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.14em] text-muted">Email</div>
                <a
                  href={SITE.contact.emailHref}
                  className="mt-1 inline-block hover:text-tungsten"
                  data-cta-type="email"
                  data-page="contact"
                  data-event={ANALYTICS_EVENTS.clickEmail}
                >
                  {SITE.contact.email}
                </a>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.14em] text-muted">Hours</div>
                <div className="mt-1 text-sm">{SITE.hours.pickup}</div>
                <div className="text-sm">{SITE.hours.studio}</div>
              </div>
            </address>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookingCTA page="contact" location="details" />
              <TourCTA page="contact" location="details" variant="outline" />
            </div>
          </div>

          <div className="overflow-hidden rounded-card border border-hairline">
            <iframe
              title="Map to photospace Denver, 209 Kalamath St, Unit 1"
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-80 w-full"
            />
          </div>
        </div>
      </Section>

      <FinalCTA eyebrow="The lights are on" title="Reserve your time." body="Book a session 24/7, or come by for a free 20-minute tour first.">
        <BookingCTA page="contact" location="final" size="lg" />
        <TourCTA page="contact" location="final" variant="outline" size="lg" />
      </FinalCTA>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
