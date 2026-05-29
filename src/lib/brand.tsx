import React from "react";

/**
 * Render body copy with the lowercase "photospace" wordmark bolded wherever it
 * appears. Pass-through for non-string nodes. Used by the shared text
 * components (PageHero lede, SectionHeading intro, FinalCTA body) so the brand
 * is consistently emphasized site-wide without editing every string.
 */
export function brand(text: React.ReactNode): React.ReactNode {
  if (typeof text !== "string") return text;
  if (!text.includes("photospace")) return text;
  return text.split(/(photospace)/g).map((part, i) =>
    part === "photospace" ? (
      <strong key={i} className="font-semibold">
        photospace
      </strong>
    ) : (
      part
    ),
  );
}
