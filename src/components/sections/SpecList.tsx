import type { Spec } from "@/lib/content/studio-data";

/** A clean label/value spec table. Adapts to the parent Section tone. */
export function SpecList({ items }: { items: readonly Spec[] }) {
  return (
    <dl className="divide-y divide-[var(--hairline)] border-y border-hairline">
      {items.map((s) => (
        <div key={s.label} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
          <dt className="text-sm uppercase tracking-[0.14em] text-muted">{s.label}</dt>
          <dd className="text-base">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
