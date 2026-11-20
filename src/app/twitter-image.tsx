import { ImageResponse } from "next/og";

export const alt = "Wedding invitation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(165deg, #2A1518 0%, #3D1F24 50%, #1A1012 100%)",
          color: "#F7F0E6",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#C9A227",
            marginBottom: 24,
          }}
        >
          You&apos;re invited
        </div>
        <div style={{ fontSize: 56 }}>A celebration of love</div>
      </div>
    ),
    { ...size }
  );
}
