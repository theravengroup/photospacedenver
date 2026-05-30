"use client";

/**
 * Minimal progress indicator across the top of the wizard. Mobile shows just
 * the current step + total; desktop shows labelled dots + connecting line.
 * Past steps are clickable; future steps are not (you can't pay before
 * picking a date).
 */

import { STEP_LABELS, type StepId } from "../state";
import { cn } from "@/lib/cn";

export function Stepper({
  current,
  visibleSteps,
  onJumpBack,
}: {
  current: StepId;
  /** The path-specific step list. Hourly: [service, datetime, addons,
   *  intake, payment]. Multi-day: [service, multiday, intake, payment]. */
  visibleSteps: StepId[];
  onJumpBack: (step: StepId) => void;
}) {
  const visible = visibleSteps.filter((s) => s !== "confirmation");
  const currentIdx = visible.findIndex((s) => s === current);

  return (
    <nav aria-label="Booking progress" className="mb-8">
      {/* Mobile: compact "Step 2 of 5 — Date & time" */}
      <div className="md:hidden flex items-center justify-between text-sm">
        <span className="text-muted">
          {currentIdx >= 0 ? `Step ${currentIdx + 1} of ${visible.length}` : "Done"}
        </span>
        <span className="font-medium">{STEP_LABELS[current]}</span>
      </div>

      {/* Desktop: dot row with labels + connecting line */}
      <ol className="hidden md:flex items-center gap-0">
        {visible.map((step, idx) => {
          const isCurrent = step === current;
          const isPast = currentIdx > idx;
          const isClickable = isPast;
          const dotClasses = cn(
            "relative z-10 grid place-items-center rounded-full border transition-colors",
            "h-9 w-9 text-xs font-medium",
            isCurrent && "bg-tungsten text-ink border-tungsten",
            isPast && "border-tungsten text-tungsten",
            !isCurrent && !isPast && "border-hairline text-muted",
          );
          return (
            <li key={step} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onJumpBack(step)}
                className={cn(
                  "flex items-center gap-3 group",
                  isClickable ? "cursor-pointer" : "cursor-default",
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className={dotClasses}>{idx + 1}</span>
                <span
                  className={cn(
                    "text-sm",
                    isCurrent ? "text-current font-medium" : isPast ? "text-tungsten" : "text-muted",
                  )}
                >
                  {STEP_LABELS[step]}
                </span>
              </button>
              {idx < visible.length - 1 && (
                <span
                  className={cn(
                    "flex-1 h-px mx-4 transition-colors",
                    idx < currentIdx ? "bg-tungsten" : "bg-hairline",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
