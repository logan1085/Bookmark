import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #f5f0eb 0%, #e8e0d8 50%, #d6cdc4 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative top-right circle */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(120, 113, 108, 0.08)",
            display: "flex",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#1c1917",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "28px",
              fontWeight: 900,
            }}
          >
            B
          </span>
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 900,
            color: "#1c1917",
            letterSpacing: "-2px",
            lineHeight: 1,
            marginBottom: "24px",
            display: "flex",
          }}
        >
          Bookmark
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: 500,
            color: "#78716c",
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          Three links. Every week. No noise.
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "3px",
              background: "#1c1917",
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#a8a29e",
              letterSpacing: "2px",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            AI-curated reading digests
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
