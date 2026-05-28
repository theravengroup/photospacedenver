import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon — serif "P" mark on the ink canvas with a tungsten underline. */
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
          background: "#0e0e0d",
          color: "#e8e3d8",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 44,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          position: "relative",
        }}
      >
        <span style={{ marginTop: -2 }}>P</span>
        <span
          style={{ position: "absolute", bottom: 10, left: 18, right: 18, height: 3, background: "#c8842b", borderRadius: 2 }}
        />
      </div>
    ),
    { ...size },
  );
}
