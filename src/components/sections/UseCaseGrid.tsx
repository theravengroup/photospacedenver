import { STUDIO } from "@/lib/content/studio-data";

/** "Built for the work" — the formats that walk in most. These are
 *  informational cards, not links: each format has a matching high-intent
 *  landing page that exists for search/LLM discovery via the sitemap, but we
 *  don't surface thin internal links to them here. */
export function UseCaseGrid() {
  return (
    <div className="grid gap-px overflow-hidden rounded-card border border-hairline bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
      {STUDIO.useCases.map((u, i) => (
        <div key={u.slug} className="bg-panel p-7">
          <span className="text-xs tracking-[0.14em] text-tungsten">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="font-display mt-2 text-display-md">{u.title}</h3>
          <p className="mt-2 text-sm text-muted">{u.blurb}</p>
        </div>
      ))}
    </div>
  );
}
