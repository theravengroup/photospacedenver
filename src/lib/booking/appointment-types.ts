/**
 * Appointment types catalog — the canonical mapping of slug → duration + price.
 * Mirrors the Acuity ladder verbatim (verified against /docs/ACUITY_MIGRATION_MAP.md).
 *
 * Pure data only; safe to import from server + client code.
 */

import type { AppointmentType } from "./types";

export const APPOINTMENT_TYPES: AppointmentType[] = [
  // Free tour
  { slug: "tour", label: "Studio Tour (free)", hours: 20 / 60, basePriceCents: 0, group: "tour" },

  // Hourly ladder (Acuity-verbatim)
  { slug: "hourly-2",          label: "2 Hours",            hours: 2,  basePriceCents:  20000, group: "rental" },
  { slug: "hourly-3",          label: "3 Hours",            hours: 3,  basePriceCents:  29500, group: "rental" },
  { slug: "hourly-4",          label: "4 Hours",            hours: 4,  basePriceCents:  39000, group: "rental" },
  { slug: "hourly-5-halfday",  label: "5 Hours (halfday)",  hours: 5,  basePriceCents:  48500, group: "rental" },
  { slug: "hourly-6",          label: "6 Hours",            hours: 6,  basePriceCents:  57500, group: "rental" },
  { slug: "hourly-7",          label: "7 Hours",            hours: 7,  basePriceCents:  66500, group: "rental" },
  { slug: "hourly-8",          label: "8 Hours",            hours: 8,  basePriceCents:  75500, group: "rental" },
  { slug: "hourly-9",          label: "9 Hours",            hours: 9,  basePriceCents:  84000, group: "rental" },
  { slug: "hourly-10-fullday", label: "10 Hours (full day)", hours: 10, basePriceCents: 92500, group: "rental" },
  { slug: "hourly-11-fullday", label: "11 Hours (full day)", hours: 11, basePriceCents: 92500, group: "rental" },
  { slug: "hourly-12-fullday", label: "12 Hours (full day)", hours: 12, basePriceCents: 92500, group: "rental" },
];

export function appointmentTypeBySlug(slug: string): AppointmentType | undefined {
  return APPOINTMENT_TYPES.find((t) => t.slug === slug);
}
