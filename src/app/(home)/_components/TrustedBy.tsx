import { SectionShell } from "./SectionShell";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";
import { Marquee } from "./Marquee";
import { Testimonials } from "./Testimonials";
import { CLIENTS, CLIENTS_FEATURED } from "../_data/clients";

/**
 * Trust section. Two halves:
 *   1. Client logo strip (typographic — desktop marquee, mobile grid).
 *   2. Curated testimonials.
 */
export function TrustedBy() {
  return (
    <SectionShell tone="paper">
      <RevealOnScroll className="mb-10 lg:mb-14">
        <div className="reveal max-w-[44rem]">
          <SectionHeading
            eyebrow="Trusted by"
            title="Productions large and local."
            lead="Brands and agencies that have shot with PhotoSpace gear, in Denver and on location."
          />
        </div>
      </RevealOnScroll>

      {/* Desktop marquee */}
      <RevealOnScroll className="-mx-6 sm:-mx-8 lg:-mx-12">
        <div className="reveal relative">
          {/* Edge fades */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-paper to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-paper to-transparent"
          />
          <Marquee>
            <ClientStripRow clients={CLIENTS} />
          </Marquee>
        </div>
      </RevealOnScroll>

      {/* Mobile static grid */}
      <RevealOnScroll className="md:hidden">
        <ul className="reveal mt-2 grid grid-cols-2 gap-x-6 gap-y-5">
          {CLIENTS_FEATURED.map((c) => (
            <li
              key={c}
              className="text-sm font-medium tracking-tight text-graphite"
            >
              {c}
            </li>
          ))}
        </ul>
      </RevealOnScroll>

      {/* Testimonials */}
      <div className="mt-20 lg:mt-28">
        <Testimonials />
      </div>
    </SectionShell>
  );
}

function ClientStripRow({ clients }: { clients: ReadonlyArray<string> }) {
  return (
    <div className="flex items-center gap-x-12 gap-y-2 py-6">
      {clients.map((c) => (
        <span
          key={c}
          className="whitespace-nowrap text-xl font-medium tracking-tight text-graphite/85"
          style={{ letterSpacing: "-0.015em" }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}
