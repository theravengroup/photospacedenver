/**
 * Tiny className combiner. Filters falsy values and joins with a space.
 * No dependency on clsx or tailwind-merge; we keep usage simple and
 * non-conflicting at the component level.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
