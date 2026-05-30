import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE, FOOTER_COLUMNS } from "@/lib/content/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="surface-dark border-t border-hairline">
      <Container size="wide" className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand + contact */}
          <div>
            {/* Wordmark — "photospace Denver" both set in the same display
                serif so it reads as one mark, with "Denver" in the
                photospace lime green from the brand wordmark
                (--color-brand-green = #97b800). */}
            <Link href="/" className="inline-flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold tracking-tight text-bone">
                photospace
              </span>
              <span className="font-display text-xl font-medium tracking-tight text-[var(--color-brand-green)]">
                Denver
              </span>
            </Link>
            <p className="measure-tight mt-4 text-sm text-muted">
              A purpose-built photo &amp; video studio for rent in Denver since {SITE.foundedYear} —
              and a full gear-rental house for shoots that happen on location.
            </p>
            <address className="mt-6 space-y-1 text-sm not-italic text-muted">
              <div className="text-bone whitespace-nowrap">{SITE.address.street}</div>
              <div className="text-bone">{SITE.address.unit}</div>
              <div className="text-bone">
                {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
              </div>
              <div>
                <a href={SITE.contact.phoneHref} className="transition-colors hover:text-tungsten">
                  {SITE.contact.phone}
                </a>
              </div>
              <div>
                <a href={SITE.contact.emailHref} className="transition-colors hover:text-tungsten">
                  {SITE.contact.email}
                </a>
              </div>
              <div className="pt-2 text-xs">{SITE.hours.pickup}</div>
              <div className="text-xs">{SITE.hours.studio}</div>
            </address>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h2 className="eyebrow">{col.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted transition-colors hover:text-bone">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE.legalName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/policies" className="transition-colors hover:text-bone">Policies</Link>
            <Link href="/studio-facts" className="transition-colors hover:text-bone">Studio Facts</Link>
            <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bone">
              Instagram
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
