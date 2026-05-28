import Link from "next/link";

export type RelatedItem = { label: string; href: string; blurb?: string };

/** Internal-linking grid of related pages. */
export function RelatedPages({ items }: { items: RelatedItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-px overflow-hidden rounded-card border border-hairline bg-[var(--hairline)] sm:grid-cols-3">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className="group bg-panel p-6">
          <h3 className="font-medium transition-colors group-hover:text-tungsten">{i.label}</h3>
          {i.blurb && <p className="mt-1 text-sm text-muted">{i.blurb}</p>}
          <span className="mt-3 inline-block text-sm text-tungsten opacity-0 transition-opacity group-hover:opacity-100">
            &rarr;
          </span>
        </Link>
      ))}
    </div>
  );
}
