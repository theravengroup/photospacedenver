import { SiteNav } from "./(home)/_components/SiteNav";
import { SiteFooter } from "./(home)/_components/SiteFooter";
import { Hero } from "./(home)/_components/Hero";
import { GearSection } from "./(home)/_components/GearSection";
import { BrandsWeCarry } from "./(home)/_components/BrandsWeCarry";
import { WhyPhotoSpace } from "./(home)/_components/WhyPhotoSpace";
import { PullStatement } from "./(home)/_components/PullStatement";
import { RentalProcess } from "./(home)/_components/RentalProcess";
import { TrustedBy } from "./(home)/_components/TrustedBy";
import { StudioBridge } from "./(home)/_components/StudioBridge";
import { FinalCTA } from "./(home)/_components/FinalCTA";
import { CONTACT, SITE } from "./(home)/_data/site";

export default function HomePage() {
  /**
   * JSON-LD structured data for LocalBusiness + Organization.
   * Inline in the page (not the layout) so the homepage owns its own
   * SEO surface area.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": SITE.url + "#localbusiness",
        name: "PhotoSpace Denver",
        url: SITE.url,
        telephone: CONTACT.phone,
        email: CONTACT.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: CONTACT.address.line1,
          addressLocality: "Denver",
          addressRegion: "CO",
          postalCode: "80223",
          addressCountry: "US",
        },
        foundingDate: "2008",
        description:
          "Denver's home for professional production. Photo and video equipment rentals, in-studio and on-location.",
        sameAs: [SITE.studioUrl],
        openingHours: "Mo-Fr 08:30-17:30",
      },
      {
        "@type": "Organization",
        "@id": SITE.url + "#organization",
        name: "PhotoSpace",
        url: SITE.url,
        subOrganization: [
          {
            "@type": "Organization",
            name: "PhotoSpace Studio",
            url: SITE.studioUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <SiteNav />
      <main id="main" className="flex-1">
        <Hero />
        <GearSection />
        <BrandsWeCarry />
        <WhyPhotoSpace />
        <PullStatement />
        <RentalProcess />
        <TrustedBy />
        <StudioBridge />
        <FinalCTA />
      </main>
      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
