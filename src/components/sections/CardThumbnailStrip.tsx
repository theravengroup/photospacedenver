import Image from "next/image";

/**
 * CardThumbnailStrip — a small marquee of square thumbnails that slots
 * BELOW the hero image on each of the two homepage cards (studio · gear).
 *
 * - Pass `direction="left"` for studio (track scrolls right-to-left) and
 *   `direction="right"` for gear (track scrolls left-to-right). Visually
 *   mirrored motion across the pair.
 * - Server-shuffled per-render so refreshes get a fresh order. The list
 *   is duplicated once so the -50% / +50% loop is seamless.
 * - A hairline border-r between thumbnails per Dan's brief; the outer
 *   strip itself has a top hairline divider above it.
 * - prefers-reduced-motion stops the animation (handled in globals.css
 *   alongside the existing `.marquee-track` rule).
 */

type Props = {
  /** Public URLs (e.g. "/images/shot-gallery/shot-gallery-0001.webp") */
  images: string[];
  /** Visual direction the row drifts. */
  direction: "left" | "right";
  /** Alt-text prefix per thumbnail. */
  altPrefix: string;
  /** Marquee duration in seconds. Default 50. */
  durationSec?: number;
};

export function CardThumbnailStrip({
  images,
  direction,
  altPrefix,
  durationSec = 50,
}: Props) {
  if (images.length === 0) return null;

  // Component stays pure — the caller (page.tsx) shuffles per render.
  // Duplicate once so translateX(-50%) (or +50% for right) loops cleanly.
  const track = [...images, ...images];

  return (
    <>
      {/* Hairline divider above the strip */}
      <div className="h-px bg-hairline" aria-hidden />

      <div
        className="marquee overflow-hidden"
        aria-label={`${altPrefix} thumbnails`}
      >
        <div
          className="marquee-track flex"
          style={{
            animationDuration: `${durationSec}s`,
            animationDirection: direction === "right" ? "reverse" : "normal",
            width: "max-content",
          }}
        >
          {track.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative size-20 sm:size-24 shrink-0 border-r border-hairline last:border-r-0 bg-ink"
            >
              <Image
                src={src}
                alt={`${altPrefix} ${(i % images.length) + 1}`}
                fill
                sizes="96px"
                className="object-cover"
                /* Below-fold inside a card, no need to fire LCP work on these. */
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
