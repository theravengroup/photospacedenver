import Link from "next/link";
import { cn } from "@/lib/cn";

export type Crumb = { name: string; path: string };

/**
 * Visual breadcrumb trail. Pair with breadcrumbSchema() + <JsonLd> for the
 * structured-data equivalent. Always include Home as the first crumb.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-current">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="transition-colors hover:text-tungsten">
                  {item.name}
                </Link>
              )}
              {!last && <span aria-hidden className="opacity-40">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
