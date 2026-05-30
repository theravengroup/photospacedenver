import "server-only";
import { google, type calendar_v3 } from "googleapis";

/**
 * Google Calendar wrapper for the booking system.
 *
 * Auth: a service account whose JSON credentials are stored base64-encoded in
 * `GOOGLE_SERVICE_ACCOUNT_KEY_B64`. The service-account email must be granted
 * "Make changes to events" on `GOOGLE_CALENDAR_ID` (the studio's calendar).
 *
 * Surface:
 *   - getFreeBusy(timeMin, timeMax) → busy windows on the studio calendar
 *   - createEvent(...)              → new event (returns eventId + htmlLink)
 *   - updateEvent(eventId, ...)     → patch existing event
 *   - cancelEvent(eventId)          → delete (or mark cancelled)
 *
 * Server-only: this module imports "server-only" so any accidental client
 * import fails the build (we never ship the service-account key to the browser).
 */

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TIMEZONE = "America/Denver";

function loadCredentials(): Record<string, unknown> {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_B64;
  if (!b64) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY_B64 is not set");
  try {
    return JSON.parse(Buffer.from(b64, "base64").toString("utf-8")) as Record<string, unknown>;
  } catch (err) {
    throw new Error(
      `Failed to decode GOOGLE_SERVICE_ACCOUNT_KEY_B64 as JSON: ${err instanceof Error ? err.message : "unknown error"}`,
    );
  }
}

function getCalendarClient(): calendar_v3.Calendar {
  const credentials = loadCredentials();
  const auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
  return google.calendar({ version: "v3", auth });
}

function getCalendarId(): string {
  const id = process.env.GOOGLE_CALENDAR_ID;
  if (!id) throw new Error("GOOGLE_CALENDAR_ID is not set");
  return id;
}

export type BusyWindow = { start: Date; end: Date };

/**
 * Return the busy windows on the studio calendar between `timeMin` and `timeMax`.
 * Used by the availability resolver to subtract from open hours and prevent
 * double-booking against externally-created GCal events.
 */
export async function getFreeBusy(timeMin: Date, timeMax: Date): Promise<BusyWindow[]> {
  const cal = getCalendarClient();
  const calendarId = getCalendarId();
  const res = await cal.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: TIMEZONE,
      items: [{ id: calendarId }],
    },
  });
  const windows = res.data.calendars?.[calendarId]?.busy ?? [];
  return windows.flatMap((w) =>
    w.start && w.end ? [{ start: new Date(w.start), end: new Date(w.end) }] : [],
  );
}

export type CreateEventInput = {
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  attendees?: { email: string; displayName?: string }[];
  /** Optional client-supplied id, used as Stripe-style idempotency for retries. */
  requestId?: string;
};

export type CalendarEvent = {
  id: string;
  htmlLink?: string;
  status?: string;
};

/** Create a booking event on the studio calendar. */
export async function createEvent(input: CreateEventInput): Promise<CalendarEvent> {
  const cal = getCalendarClient();
  const calendarId = getCalendarId();
  const res = await cal.events.insert({
    calendarId,
    requestBody: {
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.start.toISOString(), timeZone: TIMEZONE },
      end: { dateTime: input.end.toISOString(), timeZone: TIMEZONE },
      attendees: input.attendees,
      ...(input.requestId ? { id: undefined } : {}),
    },
  });
  if (!res.data.id) throw new Error("Google Calendar returned no event id");
  return { id: res.data.id, htmlLink: res.data.htmlLink ?? undefined, status: res.data.status ?? undefined };
}

/** Patch a booking event (e.g. reschedule, change summary). */
export async function updateEvent(
  eventId: string,
  patch: Partial<Omit<CreateEventInput, "requestId">>,
): Promise<CalendarEvent> {
  const cal = getCalendarClient();
  const calendarId = getCalendarId();
  const requestBody: calendar_v3.Schema$Event = {
    ...(patch.summary !== undefined ? { summary: patch.summary } : {}),
    ...(patch.description !== undefined ? { description: patch.description } : {}),
    ...(patch.start ? { start: { dateTime: patch.start.toISOString(), timeZone: TIMEZONE } } : {}),
    ...(patch.end ? { end: { dateTime: patch.end.toISOString(), timeZone: TIMEZONE } } : {}),
    ...(patch.attendees ? { attendees: patch.attendees } : {}),
  };
  const res = await cal.events.patch({ calendarId, eventId, requestBody });
  if (!res.data.id) throw new Error("Google Calendar returned no event id on patch");
  return { id: res.data.id, htmlLink: res.data.htmlLink ?? undefined, status: res.data.status ?? undefined };
}

/** Cancel (delete) a booking event. */
export async function cancelEvent(eventId: string): Promise<void> {
  const cal = getCalendarClient();
  const calendarId = getCalendarId();
  await cal.events.delete({ calendarId, eventId });
}
