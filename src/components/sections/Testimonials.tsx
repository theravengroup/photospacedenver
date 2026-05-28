import { cn } from "@/lib/cn";
import type { Testimonial } from "@/lib/content/testimonials";

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((t) => (
        <figure
          key={t.name}
          className={cn(
            "flex flex-col rounded-card border border-hairline p-7",
            t.featured && "lg:col-span-2",
          )}
        >
          <blockquote className={cn("font-display leading-snug", t.featured ? "text-2xl" : "text-xl")}>
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-sm">
            <span className="block font-medium">{t.name}</span>
            <span className="block text-muted">{t.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
