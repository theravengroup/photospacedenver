import Link from "next/link";
import { CONTACT, LINKS, SITE } from "../_data/site";
import { Wordmark } from "./Wordmark";
import { OutboundIcon } from "./OutboundIcon";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink text-paper">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-12 py-16 lg:py-24">
        {/* Top: brand + columns */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <Wordmark variant="stack" tone="light" />
            <p className="mt-6 max-w-sm text-base leading-relaxed text-fog">
              Denver&rsquo;s home for professional production. Photo and video
              equipment rentals, in-studio and on-location, since {SITE.yearFounded}.
            </p>
          </div>

          {/* Visit */}
          <div className="lg:col-span-3">
            <p className="eyebrow eyebrow-light mb-5">Visit</p>
            <address className="not-italic text-base leading-relaxed text-paper">
              <a
                href={CONTACT.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-copper-soft transition-colors"
              >
                {CONTACT.address.line1}
                <br />
                {CONTACT.address.line2}
              </a>
            </address>
            <div className="mt-5 space-y-1 text-sm text-fog">
              <p>{CONTACT.hours.primary}</p>
              <p>{CONTACT.hours.secondary}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <p className="eyebrow eyebrow-light mb-5">Contact</p>
            <div className="space-y-2 text-base">
              <a
                href={CONTACT.phoneHref}
                className="block hover:text-copper-soft transition-colors"
              >
                {CONTACT.phone}
              </a>
              <a
                href={CONTACT.emailHref}
                className="block hover:text-copper-soft transition-colors"
              >
                {CONTACT.email}
              </a>
            </div>
          </div>

          {/* Studio link */}
          <div className="lg:col-span-2">
            <p className="eyebrow eyebrow-light mb-5">Studio Division</p>
            <a
              href={SITE.studioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-base hover:text-copper-soft transition-colors"
            >
              photospace.studio
              <OutboundIcon />
            </a>
            <p className="mt-3 text-sm text-fog">
              Studio rentals and memberships.
            </p>
          </div>
        </div>

        {/* Bottom: legal + utility */}
        <div className="mt-16 flex flex-col gap-4 border-t border-hair-light pt-8 text-xs text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} PhotoSpace. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/gear" className="hover:text-paper transition-colors">
              Gear
            </Link>
            <Link href={LINKS.services} className="hover:text-paper transition-colors">
              Services
            </Link>
            <Link href={LINKS.estimate} className="hover:text-paper transition-colors">
              Estimate
            </Link>
            <a
              href={SITE.studioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-paper transition-colors"
            >
              Studio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
