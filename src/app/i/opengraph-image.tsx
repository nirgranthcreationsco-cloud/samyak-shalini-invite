import { ImageResponse } from "next/og";

export const alt = "You're invited to a wedding";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Static elegant OG — URL hash is not available to crawlers. */
export default function InviteOpenGraphImage() {
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
          background: "linear-gradient(165deg, #2A1518 0%, #3D1F24 45%, #0B1C2C 100%)",
          color: "#F7F0E6",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: "1px solid #C9A22766",
            borderRadius: 16,
            display: "flex",
          }}
        />
        <div style={{ fontSize: 36, color: "#C9A227", marginBottom: 20 }}>
          *
        </div>
        <div
          style={{
            fontSize: 28,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#C9A227",
            marginBottom: 28,
          }}
        >
          Wedding invitation
        </div>
        <div style={{ fontSize: 58, marginBottom: 18 }}>You&apos;re invited</div>
        <div style={{ fontSize: 22, opacity: 0.7, maxWidth: 640, textAlign: "center" }}>
          Scroll through a personal celebration — tap the link to open
        </div>
      </div>
    ),
    { ...size }
  );
}
