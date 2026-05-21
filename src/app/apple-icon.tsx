import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 120,
          fontWeight: 500,
          letterSpacing: "-0.05em",
          position: "relative",
          borderRadius: 36,
        }}
      >
        <span style={{ marginTop: -6 }}>p</span>
        <span
          style={{
            position: "absolute",
            bottom: 32,
            left: 52,
            right: 52,
            height: 6,
            background: "#9c6e47",
            borderRadius: 4,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
