import { GEAR_CATEGORIES, type GearItem } from "@/lib/content/gear-data";
import { usd } from "@/lib/content/pricing-data";

/** Full gear catalog — one block per category, with anchor ids matching the
 *  old /gear/<x>/ redirect targets (#cameras, #flash, …). */
export function GearGrid() {
  return (
    <div className="space-y-16">
      {GEAR_CATEGORIES.map((cat) => (
        <div key={cat.slug} id={cat.anchor} className="scroll-mt-28">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-4">
            <h3 className="font-display text-display-md">{cat.title}</h3>
            <div className="hidden flex-wrap gap-2 sm:flex">
              {cat.brands.slice(0, 6).map((b) => (
                <span key={b} className="rounded-pill border border-hairline px-2.5 py-1 text-xs text-muted">
                  {b}
                </span>
              ))}
            </div>
          </div>
          <p className="measure mt-4 text-muted">{cat.blurb}</p>
          <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
            {cat.items.map((item) => (
              <GearRow key={item.name} item={item} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function GearRow({ item }: { item: GearItem }) {
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5">
      <span className="min-w-0">
        <span className="text-base">{item.name}</span>
        {item.brand && <span className="ml-2 text-xs text-muted">{item.brand}</span>}
        {item.note && <span className="block text-xs text-muted">{item.note}</span>}
      </span>
      <span className="shrink-0 whitespace-nowrap text-sm text-muted">
        {typeof item.price === "number" ? `${usd(item.price)}${item.unit ?? "/day"}` : "Inquire"}
      </span>
    </li>
  );
}
