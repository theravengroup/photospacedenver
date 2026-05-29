"use client";

import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";

/**
 * A start → end date-range calendar themed for the photospace dark glass UI.
 * Built on react-day-picker (the accessible base shadcn's Calendar uses). All
 * theming is done with inline `--rdp-*` custom properties so no global CSS is
 * needed. Past dates are disabled.
 */

export type { DateRange };

// react-day-picker exposes its theme as CSS custom properties on the root.
const THEME = {
  "--rdp-accent-color": "var(--color-tungsten)",
  "--rdp-accent-background-color": "color-mix(in oklab, var(--color-tungsten) 22%, transparent)",
  "--rdp-day-width": "2.4rem",
  "--rdp-day-height": "2.4rem",
  "--rdp-day_button-width": "2.4rem",
  "--rdp-day_button-height": "2.4rem",
  "--rdp-day_button-border-radius": "0.55rem",
  "--rdp-selected-border": "1.5px solid var(--color-tungsten)",
  "--rdp-today-color": "var(--color-tungsten)",
  "--rdp-range_start-color": "var(--color-ink)",
  "--rdp-range_end-color": "var(--color-ink)",
  "--rdp-range_start-date-background-color": "var(--color-tungsten)",
  "--rdp-range_end-date-background-color": "var(--color-tungsten)",
  "--rdp-nav_button-width": "2rem",
  "--rdp-nav_button-height": "2rem",
} as React.CSSProperties;

export function DateRangeCalendar({
  range,
  onSelect,
}: {
  range: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex justify-center text-bone">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={onSelect}
        numberOfMonths={1}
        showOutsideDays
        disabled={{ before: today }}
        aria-label="Choose your first and last shoot day"
        style={THEME}
      />
    </div>
  );
}
