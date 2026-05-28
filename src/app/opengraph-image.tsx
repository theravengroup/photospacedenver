import { ImageResponse } from "next/og";

export const alt =
  "PhotoSpace Denver — Denver's photo & video studio and gear-rental house. Studio rental, memberships, and gear since 2008.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded Open Graph image. Cinematic dark canvas, editorial serif headline,
 * restrained tungsten accent — mirrors the site. No external imagery.
 * Node runtime (default) so it prerenders statically.
 */
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0e0e0d 0%, #161513 70%, #232019 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, color: "#e8e3d8" }}>
          <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em", fontFamily: "Georgia, serif" }}>
            PhotoSpace
          </span>
          <span style={{ fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", color: "#c8842b" }}>
            Denver · since 2008
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 20, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8842b", marginBottom: 22 }}>
            Studio &amp; gear rental in Denver
          </span>
          <h1
            style={{
              fontSize: 92,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 0.98,
              color: "#e8e3d8",
              margin: 0,
              maxWidth: 960,
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            A real working studio,{" "}
            <span style={{ fontStyle: "italic", color: "#d8a45a" }}>built for the work.</span>
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#b7afa2",
            fontSize: 20,
            fontWeight: 500,
            borderTop: "1px solid rgba(244,241,234,0.14)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", gap: 24 }}>
            <span>Studio</span>
            <span style={{ color: "#6b6358" }}>·</span>
            <span>Gear</span>
            <span style={{ color: "#6b6358" }}>·</span>
            <span>Memberships</span>
            <span style={{ color: "#6b6358" }}>·</span>
            <span>Pricing</span>
          </div>
          <span style={{ color: "#c8842b" }}>photospacedenver.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
