import { ImageResponse } from "next/og";

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
          background: "#0e0e0d",
          color: "#e8e3d8",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 120,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          position: "relative",
          borderRadius: 36,
        }}
      >
        <span style={{ marginTop: -6 }}>P</span>
        <span
          style={{ position: "absolute", bottom: 32, left: 52, right: 52, height: 6, background: "#c8842b", borderRadius: 4 }}
        />
      </div>
    ),
    { ...size },
  );
}
