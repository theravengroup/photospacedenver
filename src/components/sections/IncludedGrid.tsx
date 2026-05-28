/** A two-column checklist for "what's included" / benefits. */
export function IncludedGrid({ items, columns = 2 }: { items: readonly string[]; columns?: 2 | 3 }) {
  return (
    <ul className={`grid gap-x-8 gap-y-3.5 ${columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-base">
          <Check />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="mt-1 shrink-0 text-tungsten">
      <path d="M3.5 9.5 7 13l7.5-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
