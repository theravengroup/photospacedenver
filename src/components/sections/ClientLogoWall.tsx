import { CLIENTS } from "@/lib/content/clients";

/**
 * "Trusted by" wall. Logo image assets aren't in the repo yet (TODO: pull from
 * media library — REBUILD_PLAN §16), so brands render as a refined type
 * marquee. Swap to <Image> per client once assets land.
 */
export function ClientLogoWall() {
  const row = [...CLIENTS, ...CLIENTS];
  return (
    <div className="marquee overflow-hidden" aria-label="Brands that have shot at PhotoSpace">
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
