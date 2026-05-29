import Link from "next/link";
import { SITE, BOOKING, ANALYTICS_EVENTS } from "@/lib/content/site-config";

const ITEM = "flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors";

/** Persistent Book · Tour · Call bar, mobile only. */
export function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline glass lg:hidden">
      <div
        className="grid grid-cols-3 pb-[max(0.25rem,env(safe-area-inset-bottom))]"
        style={{ color: "var(--color-bone)" }}
      >
        <Link
          href={BOOKING.bookPath}
          className={`${ITEM} text-bone hover:text-tungsten`}
          data-cta-location="mobile-sticky"
          data-cta-type="book_studio"
          data-event={ANALYTICS_EVENTS.clickBookStudio}
        >
          <CalendarIcon />
          Book
        </Link>
        <Link
          href={`${BOOKING.bookPath}#tour`}
          className={`${ITEM} border-x border-hairline text-bone hover:text-tungsten`}
          data-cta-location="mobile-sticky"
          data-cta-type="book_tour"
          data-event={ANALYTICS_EVENTS.clickBookTour}
        >
          <EyeIcon />
          Tour
        </Link>
        <a
          href={SITE.contact.phoneHref}
          className={`${ITEM} text-bone hover:text-tungsten`}
          data-cta-location="mobile-sticky"
          data-cta-type="call"
          data-event={ANALYTICS_EVENTS.clickCall}
        >
          <PhoneIcon />
          Call
        </a>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="2.5" y="3.5" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 7h13M6 2v3M12 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M1.5 9S4 4 9 4s7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5Z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M5 2.5 6.5 6 5 7.5c.8 1.7 2.3 3.2 4 4L10.5 10l3.5 1.5v3c0 .6-.5 1-1 1C7 15.5 2.5 11 2.5 4.5c0-.5.4-1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
