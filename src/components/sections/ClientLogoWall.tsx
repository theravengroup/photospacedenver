import { CLIENTS } from "@/lib/content/clients";

/**
 * "Trusted by" wall. Renders brand names in a refined type marquee — a
 * deliberate, coherent treatment. Logo art exists at /images/clients/<slug>.png
 * (see clients.ts), but the sources are low-res 200×100 PNGs and 3 brands have
 * no mark, so a mixed logo wall looks uneven; revisit with consistent, hi-res
 * logos for all brands before switching to images.
 */
export function ClientLogoWall() {
  const row = [...CLIENTS, ...CLIENTS];
  return (
    <div className="marquee overflow-hidden" aria-label="Brands that have shot at photospace">
      <div className="marquee-track flex items-center gap-12 py-2">
        {row.map((c, i) => (
          <span
            key={`${c.slug}-${i}`}
            aria-hidden={i >= CLIENTS.length}
            className="whitespace-nowrap text-lg font-medium uppercase tracking-[0.12em] text-muted"
          >
            {c.name}
          </span>
        ))}
      </div>
    </div>
  );
}
