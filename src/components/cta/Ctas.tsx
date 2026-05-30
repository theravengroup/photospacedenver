/**
 * Preset conversion CTAs. Each wraps <Button> with the canonical label,
 * destination, and tracking type/event. Pass `page`/`service` for analytics
 * context and `variant`/`size` to fit the layout.
 *
 * 2026-05-30 cutover: BookingCTA + TourCTA now link to /book-studio (the
 * native booking flow) instead of opening the Acuity iframe modal. The
 * BookingModal component is intentionally left in the codebase as a
 * rollback path until the real-card test confirms the native flow; remove
 * after Dan green-lights cutover.
 */
"use client";

import { Button, type ButtonProps } from "@/components/ui/Button";
import { CTA_LABELS, ANALYTICS_EVENTS, BOOKING } from "@/lib/content/site-config";

type Ctx = Pick<ButtonProps, "variant" | "size" | "className"> & {
  page?: string;
  service?: string;
  location?: string;
  label?: string;
};

export function BookingCTA({ page, service, location, label, variant = "primary", size = "md", className }: Ctx) {
  return (
    <Button
      href={BOOKING.bookPath}
      variant={variant}
      size={size}
      className={className}
      tracking={{ type: "book_studio", event: ANALYTICS_EVENTS.clickBookStudio, page, service, location }}
    >
      {label ?? CTA_LABELS.bookStudio}
    </Button>
  );
}

export function TourCTA({ page, service, location, label, variant = "outline", size = "md", className }: Ctx) {
  // Tour lands on /book-studio with ?session=tour so the wizard pre-selects
  // the Free Studio Tour card. The wizard reads this on mount.
  return (
    <Button
      href={`${BOOKING.bookPath}?session=tour`}
      variant={variant}
      size={size}
      className={className}
      tracking={{ type: "book_tour", event: ANALYTICS_EVENTS.clickBookTour, page, service, location }}
    >
      {label ?? CTA_LABELS.bookTour}
    </Button>
  );
}

export function EstimateCTA({ page, service, location, label, variant = "primary", size = "md", className }: Ctx) {
  return (
    <Button
      href={BOOKING.estimatePath}
      variant={variant}
      size={size}
      className={className}
      tracking={{ type: "request_estimate", event: ANALYTICS_EVENTS.requestEstimate, page, service, location }}
    >
      {label ?? CTA_LABELS.requestEstimate}
    </Button>
  );
}

export function MembershipCTA({ page, service, location, label, variant = "primary", size = "md", className }: Ctx) {
  return (
    <Button
      href="/memberships"
      variant={variant}
      size={size}
      className={className}
      tracking={{ type: "view_memberships", event: ANALYTICS_EVENTS.viewMemberships, page, service, location }}
    >
      {label ?? CTA_LABELS.viewMemberships}
    </Button>
  );
}
