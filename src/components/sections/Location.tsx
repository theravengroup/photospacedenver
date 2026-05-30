import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { TourCTA } from "@/components/cta/Ctas";
import { SITE } from "@/lib/content/site-config";

const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(SITE.address.full)}&output=embed`;

/** "Come visit" — aerial, address, and an embedded map so people can find us. */
export function Location() {
  return (
    <section className="surface-light relative overflow-hidden py-[var(--spacing-section)]">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Aerial + pin + address ribbon */}
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-hairline shadow-2xl">
            <Image
              src="/images/space/studio-drone-shot.jpg"
              alt="Aerial view of photospace in Denver — the studio, the rail line, and the Rockies on the horizon"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
            <div aria-hidden className="pointer-events-none absolute left-[37%] top-[46%] z-10 -translate-x-1/2 -translate-y-full">
              <MapPin
                className="size-10 animate-[pin-bob_2.4s_ease-in-out_infinite] fill-[var(--color-brand-green)] text-ink drop-shadow-[0_6px_12px_rgba(0,0,0,0.55)]"
                strokeWidth={1.5}
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent px-5 pb-4 pt-16">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-bone">
                {SITE.address.full} · {SITE.address.regionName}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="eyebrow">Come visit</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display mt-5 text-display-xl">
              Let&rsquo;s <span className="text-tungsten">create.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg text-muted">
              Want to see the studio before you book? Stop by, take a tour, and meet the team.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 size-5 shrink-0 text-tungsten" strokeWidth={1.5} aria-hidden />
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-muted">Studio</dt>
                  <dd className="mt-1 text-lg leading-snug">
                    {SITE.address.line1}
                    <br />
                    {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="mt-1 size-5 shrink-0 text-tungsten" strokeWidth={1.5} aria-hidden />
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-muted">Call</dt>
                  <dd className="mt-1">
                    <a href={SITE.contact.phoneHref} className="text-lg transition-colors hover:text-tungsten">
                      {SITE.contact.phone}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <TourCTA page="home" location="location" size="lg" />
              <Button href={SITE.address.mapsHref} variant="outline" size="lg">
                Get directions
              </Button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Embedded map */}
      <Reveal>
        <div className="mx-auto mt-16 max-w-[88rem] px-5 sm:px-8">
          <div className="relative h-[380px] w-full overflow-hidden rounded-card border border-hairline shadow-2xl md:h-[480px]">
            <iframe
              src={MAP_EMBED}
              title="photospace Denver location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
              allowFullScreen
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
