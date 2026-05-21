import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "PhotoSpace — Denver's home for professional production. Photo & video equipment rentals since 2008.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic Open Graph image.
 *
 * Typographic, brand-aligned. Industrial-neutral palette mirroring the
 * site canvas — warm paper background with charcoal type and a copper
 * accent rule. No external imagery required.
 */
export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #f4f1ea 0%, #ebe6db 60%, #d8d1c1 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top row: wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            color: "#1b1916",
          }}
        >
          <span
            style={{
              fontSize: 44,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            photospace
          </span>
          <span
            style={{
              fontSize: 14,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#6b6358",
            }}
          >
            Denver · since 2008
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 22,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#9c6e47",
              fontWeight: 500,
              marginBottom: 24,
            }}
          >
            Professional production rentals
          </span>
          <h1
            style={{
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 0.96,
              color: "#1b1916",
              margin: 0,
              maxWidth: "920px",
            }}
          >
            Denver&rsquo;s home for{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400 }}>
              professional production.
            </span>
          </h1>
        </div>

        {/* Bottom row: divisions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#322e27",
            fontSize: 20,
            fontWeight: 500,
            borderTop: "1px solid rgba(27,25,22,0.15)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", gap: 32 }}>
            <span>Gear rental</span>
            <span style={{ color: "#b7afa2" }}>·</span>
            <span>Studio division</span>
            <span style={{ color: "#b7afa2" }}>·</span>
            <span>Production support</span>
          </div>
          <span style={{ color: "#6b6358", fontWeight: 400 }}>
            photospacedenver.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
