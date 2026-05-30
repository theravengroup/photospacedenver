/**
 * Shared types + reducer for the /book-native wizard. All state is held in
 * one place so the right-side PriceSummary can react to every change without
 * prop-drilling.
 *
 * Pricing is NEVER trusted from this state. Every screen that needs a number
 * fetches from /api/booking/quote (server-authoritative). This state is just
 * a UX cache so we don't refetch on every render.
 */

import type { PricingResult } from "@/lib/booking/types";

export type StepId =
  | "service"
  | "datetime"
  | "multiday"
  | "addons"
  | "intake"
  | "payment"
  | "confirmation";

/**
 * Visible step order in the stepper. multiday + datetime occupy the same
 * "slot 2" — only one renders based on whether the user picked multi-day.
 */
export const STEP_ORDER: StepId[] = [
  "service",
  "datetime",
  "addons",
  "intake",
  "payment",
  "confirmation",
];

export const STEP_LABELS: Record<StepId, string> = {
  service: "Session",
  datetime: "Date & time",
  multiday: "Dates",
  addons: "Add-ons",
  intake: "Your info",
  payment: "Pay",
  confirmation: "Done",
};

export type WizardState = {
  step: StepId;

  // Step 1: Service
  appointmentTypeSlug: string | null;
  hours: number | null;

  // Step 2 (hourly): Date/time
  dateISO: string | null;
  startAt: string | null; // ISO
  endAt: string | null; // ISO

  // Step 2 (multi-day): date range as YYYY-MM-DD
  multiDayStartDate: string | null;
  multiDayEndDate: string | null;

  // Step 3: Add-ons
  addonSlugs: string[];
  customGearRequest: string;

  // Step 4: Intake
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  additionalEmails: string[];
  policiesAccepted: boolean;

  // Optional discount code (coupon or member-issued)
  couponCode: string;
  appliedCouponCode: string | null; // server-confirmed code that's currently applying
  couponError: string | null;       // server-supplied reason a code didn't apply

  // Step 5: Payment
  bookingId: string | null;
  clientSecret: string | null;
  publishableKey: string | null;
  expiresAt: string | null;
  requiresPayment: boolean;

  // Live preview
  livePricing: PricingResult | null;
  livePricingLoading: boolean;
  livePricingError: string | null;

  // Signed-in member info (set from the quote response so the wizard knows
  // whether to show the member status pill and how many hours are left).
  member: {
    signedIn: boolean;
    email: string | null;
    tier: "spark" | "creator" | "visionary" | null;
    hoursAvailable: number;
  };
};

export const INITIAL_STATE: WizardState = {
  step: "service",
  appointmentTypeSlug: null,
  hours: null,
  dateISO: null,
  startAt: null,
  endAt: null,
  multiDayStartDate: null,
  multiDayEndDate: null,
  addonSlugs: [],
  customGearRequest: "",
  customerFirstName: "",
  customerLastName: "",
  customerEmail: "",
  customerPhone: "",
  additionalEmails: [],
  policiesAccepted: false,
  couponCode: "",
  appliedCouponCode: null,
  couponError: null,
  member: { signedIn: false, email: null, tier: null, hoursAvailable: 0 },
  bookingId: null,
  clientSecret: null,
  publishableKey: null,
  expiresAt: null,
  requiresPayment: true,
  livePricing: null,
  livePricingLoading: false,
  livePricingError: null,
};

export type WizardAction =
  | { type: "set"; patch: Partial<WizardState> }
  | { type: "goto"; step: StepId }
  | { type: "next" }
  | { type: "back" }
  | { type: "reset" };

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "set":
      return { ...state, ...action.patch };
    case "goto":
      return { ...state, step: action.step };
    case "next": {
      const idx = STEP_ORDER.indexOf(state.step);
      const nextStep = STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)];
      return { ...state, step: nextStep };
    }
    case "back": {
      const idx = STEP_ORDER.indexOf(state.step);
      const prevStep = STEP_ORDER[Math.max(idx - 1, 0)];
      return { ...state, step: prevStep };
    }
    case "reset":
      return INITIAL_STATE;
    default:
      return state;
  }
}
