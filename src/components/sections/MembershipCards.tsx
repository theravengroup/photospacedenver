import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { BOOKING, ANALYTICS_EVENTS } from "@/lib/content/site-config";
import { MEMBERSHIP_TIERS, usd } from "@/lib/content/pricing-data";

export function MembershipCards({ page }: { page?: string }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {MEMBERSHIP_TIERS.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex flex-col rounded-card border p-7",
            t.featured ? "border-tungsten bg-panel" : "border-hairline",
          )}
        >
          <div className="flex h-6 items-center">
            {t.badge && <span className="eyebrow">{t.badge}</span>}
          </div>
          <h3 className="font-display text-display-md">{t.name}</h3>
          <p className="mt-1 text-sm text-muted">{t.hoursPerMonth} hours / month</p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-display text-5xl leading-none">{usd(t.price)}</span>
            <span className="text-muted">/mo</span>
          </div>
          <p className="mt-1 text-xs text-muted">≈ {usd(t.effectiveHourly)}/hr effective</p>
          <p className="measure mt-4 flex-1 text-sm text-muted">{t.blurb}</p>
          <div className="mt-6">
            <Button
              href={BOOKING.applyPath}
              variant={t.featured ? "primary" : "outline"}
              size="md"
              className="w-full"
              tracking={{
                type: "start_membership_application",
                event: ANALYTICS_EVENTS.startMembershipApplication,
                page,
                location: `membership-${t.id}`,
              }}
            >
              Apply for {t.name}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
