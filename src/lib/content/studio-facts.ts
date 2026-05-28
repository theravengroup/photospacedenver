/**
 * Single structured fact sheet for photospace Denver, assembled from the data
 * modules. Powers both the human-readable /studio-facts page and the
 * machine-readable /studio-facts.json export so they never drift.
 */

import { SITE, BOOKING, absoluteUrl } from "./site-config";
import { STUDIO } from "./studio-data";
import { STUDIO_PRICING, ACUITY_LADDER, MEMBERSHIP_TIERS, MEMBERSHIP_TERMS, SERVICE_PRICING, LIGHTING_KITS, TOUR, FEES } from "./pricing-data";

export function buildStudioFacts() {
  return {
    business: {
      name: SITE.name,
      alternateName: SITE.alternateName,
      founded: SITE.foundedYear,
      owner: SITE.owner,
      positioning: SITE.positioning,
      canonicalUrl: SITE.url,
    },
    location: {
      address: SITE.address.full,
      neighborhood: SITE.address.neighborhood,
      note: SITE.address.locationNote,
      directions: SITE.address.directionsNote,
      geo: SITE.geo,
      mapsUrl: SITE.address.mapsHref,
      serviceAreas: SITE.serviceAreas,
    },
    contact: {
      phone: SITE.contact.phone,
      email: SITE.contact.email,
      instagram: SITE.social.instagram,
    },
    hours: {
      gearPickup: SITE.hours.pickup,
      studio: SITE.hours.studio,
      eventVenue: SITE.hours.eventVenue,
    },
    studio: {
      totalSqFt: STUDIO.totalSqFt,
      shootingSqFt: STUDIO.shootingSqFt,
      cyclorama: STUDIO.cyc.dimensions,
      power: STUDIO.power,
      tetherSoftware: STUDIO.tetherSoftware,
      includedWithRental: STUDIO.included,
      amenities: STUDIO.amenities.map((a) => (a.detail ? `${a.name} — ${a.detail}` : a.name)),
      parking: "Free street parking; load-in ramp and outdoor deck.",
    },
    rentalRates: {
      hourly: { price: STUDIO_PRICING[0].price, note: "2-hour minimum, same rate 24/7" },
      halfDay: { hours: 5, price: 485 },
      fullDay: { hours: 10, price: 925, note: "covers 10–12 hours" },
      hourlyLadder: ACUITY_LADDER.map((r) => ({ hours: r.hours, price: r.price })),
      tour: { price: TOUR.price, durationMinutes: TOUR.durationMin },
      overtimePerHour: FEES.overtimeHourly,
      cycRepaint: FEES.cycRepaint,
      eventVenuePerDay: SERVICE_PRICING.eventVenue.price,
      minimumRental: FEES.minimumRental,
    },
    memberships: {
      tiers: MEMBERSHIP_TIERS.map((t) => ({
        name: t.name,
        hoursPerMonth: t.hoursPerMonth,
        pricePerMonth: t.price,
        effectiveHourly: t.effectiveHourly,
      })),
      terms: {
        billingCycleDays: MEMBERSHIP_TERMS.billingCycleDays,
        minimumCommitmentDays: MEMBERSHIP_TERMS.minimumCommitmentDays,
        autoRenew: MEMBERSHIP_TERMS.autoRenew,
        cancellationNoticeDays: MEMBERSHIP_TERMS.cancellationNoticeDays,
        hoursRollOver: MEMBERSHIP_TERMS.rollover,
        extraHourRate: MEMBERSHIP_TERMS.extraHourRate,
        notRequiredToRent: MEMBERSHIP_TERMS.notRequiredToRent,
      },
    },
    addOns: {
      lightingKits: [...LIGHTING_KITS.strobe, ...LIGHTING_KITS.video].map((k) => ({ name: k.name, price: k.price })),
      premium: "Phase One XF IQ4 150MP, Profoto B1X/B10X Plus/D2/Pro8a kits, premium Canon/Nikon/Sony/Fuji bodies and lenses, on-call assistants and digital techs.",
    },
    services: ["Location scouting", "Production management", "Drone services", "Camera cleaning", "Retouching", "ShootPod mobile studio"],
    booking: {
      bookStudioUrl: absoluteUrl(BOOKING.bookPath),
      requestEstimateUrl: absoluteUrl(BOOKING.estimatePath),
      applyMembershipUrl: absoluteUrl(BOOKING.applyPath),
      freeTour: TOUR.durationMin + "-minute studio tour, bookable 7 days a week",
    },
    policies: {
      insurance: "Certificate of insurance on file, or a credit-card authorization for full replacement value, required before gear pickup.",
      cancellation: "Full credit if cancelled/rescheduled ≥72 hours before a booking; inside 72 hours non-refundable but rebookable for 60 days.",
      deposit: `${FEES.depositPctOver3k}% deposit for rentals over $3,000.`,
      cardFeePercent: FEES.cardFeePct,
    },
    idealUseCases: STUDIO.useCases.map((u) => u.title),
    pages: {
      studio: absoluteUrl("/studio"),
      pricing: absoluteUrl("/studio-pricing"),
      memberships: absoluteUrl("/memberships"),
      gearRental: absoluteUrl("/gear-rental"),
      podcast: absoluteUrl("/podcast-studio-denver"),
      contact: absoluteUrl("/contact"),
      faq: absoluteUrl("/faq"),
    },
    lastUpdated: "2026-05-28",
  };
}

export type StudioFacts = ReturnType<typeof buildStudioFacts>;
