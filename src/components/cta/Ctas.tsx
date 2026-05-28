/**
 * Preset conversion CTAs. Each wraps <Button> with the canonical label,
 * destination, and tracking type/event. Pass `page`/`service` for analytics
 * context and `variant`/`size` to fit the layout.
 *
 * BookingCTA opens the Acuity scheduler in a modal (with the 3-step how-it-works
 * above the iframe) rather than navigating to /book.
 */
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { CTA_LABELS, ANALYTICS_EVENTS, BOOKING } from "@/lib/content/site-config";

// Lazy-load the modal so it doesn't add to the initial bundle
const BookingModal = dynamic(
  () => import("@/components/ui/BookingModal").then((m) => m.BookingModal),
  { ssr: false }
);

type Ctx = Pick<ButtonProps, "variant" | "size" | "className"> & {
  page?: string;
  service?: string;
  location?: string;
  label?: string;
};

export function BookingCTA({ page, service, location, label, variant = "primary", size = "md", className }: Ctx) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        tracking={{ type: "book_studio", event: ANALYTICS_EVENTS.clickBookStudio, page, service, location }}
        onClick={() => setOpen(true)}
      >
        {label ?? CTA_LABELS.bookStudio}
      </Button>
      {open && <BookingModal onClose={() => setOpen(false)} />}
    </>
  );
}

export function TourCTA({ page, service, location, label, variant = "outline", size = "md", className }: Ctx) {
  return (
    <Button
      href={BOOKING.bookPath}
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
