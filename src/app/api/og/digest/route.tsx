import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const week = searchParams.get("week") ?? "";
  const year = searchParams.get("year") ?? "";
  const title = searchParams.get("title") ?? `Week ${week}, ${year}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #f5f0eb 0%, #e8e0d8 50%, #d6cdc4 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgba(120, 113, 108, 0.08)",
            display: "flex",
          }}
        />

        {/* Top section: Logo + badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#1c1917",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "20px",
                fontWeight: 900,
              }}
            >
              B
            </span>
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#1c1917",
              letterSpacing: "-0.5px",
              display: "flex",
            }}
          >
            Bookmark
          </span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#a8a29e",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginLeft: "8px",
              display: "flex",
            }}
          >
            Weekly Digest
          </span>
        </div>

        {/* Middle section: Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#1c1917",
              letterSpacing: "-2px",
              lineHeight: 1.1,
              maxWidth: "900px",
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 500,
              color: "#78716c",
              display: "flex",
            }}
          >
            Week {week} &middot; {year}
          </div>
        </div>

        {/* Bottom section: Article count */}
        <div
          style={{
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
            3 articles curated by AI
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
