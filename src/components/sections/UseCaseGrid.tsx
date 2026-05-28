import Link from "next/link";
import { STUDIO } from "@/lib/content/studio-data";

/** "Built for the work" — the formats that walk in most, each linking to its
 *  high-intent landing page. Tone-agnostic (no surface-specific hover color). */
export function UseCaseGrid() {
  return (
    <div className="grid gap-px overflow-hidden rounded-card border border-hairline bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
      {STUDIO.useCases.map((u, i) => (
        <Link key={u.slug} href={u.href} className="group bg-panel p-7">
          <span className="text-xs tracking-[0.14em] text-tungsten">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="font-display mt-2 text-display-md transition-colors group-hover:text-tungsten">
            {u.title}
          </h3>
          <p className="mt-2 text-sm text-muted">{u.blurb}</p>
          <span className="mt-4 inline-block text-sm text-tungsten opacity-0 transition-opacity group-hover:opacity-100">
            Explore &rarr;
          </span>
        </Link>
      ))}
    </div>
  );
}
