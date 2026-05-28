import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { BOOKING, ANALYTICS_EVENTS } from "@/lib/content/site-config";
import { STUDIO_PRICING, usd } from "@/lib/content/pricing-data";

export function PricingCards({ page }: { page?: string }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {STUDIO_PRICING.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex flex-col rounded-card border p-7",
            t.featured ? "border-tungsten" : "border-hairline",
          )}
        >
          <div className="flex h-6 items-center">
            {t.badge && <span className="eyebrow">{t.badge}</span>}
          </div>
          <h3 className="font-display text-display-md">{t.name}</h3>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-display text-5xl leading-none">{usd(t.price)}</span>
            {t.unit && <span className="text-muted">{t.unit}</span>}
          </div>
          {t.detail && <p className="mt-2 text-sm text-muted">{t.detail}</p>}
          {t.blurb && <p className="measure mt-4 flex-1 text-sm text-muted">{t.blurb}</p>}
          <div className="mt-6">
            <Button
              href={BOOKING.bookPath}
              variant={t.featured ? "primary" : "outline"}
              size="md"
              className="w-full"
              tracking={{ type: "book_studio", event: ANALYTICS_EVENTS.clickBookStudio, page, location: `pricing-${t.id}` }}
            >
              Book {t.name.toLowerCase()}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
