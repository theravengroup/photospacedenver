import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Dynamic favicon. Typographic: a single "p" set in the brand
 * lowercase mark on the warm-paper canvas, with the copper accent
 * underline. Reads at favicon sizes without needing a logo SVG.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1b1916",
          color: "#f4f1ea",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 44,
          fontWeight: 500,
          letterSpacing: "-0.05em",
          position: "relative",
        }}
      >
        <span style={{ marginTop: -2 }}>p</span>
        <span
          style={{
            position: "absolute",
            bottom: 10,
            left: 18,
            right: 18,
            height: 3,
            background: "#9c6e47",
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
