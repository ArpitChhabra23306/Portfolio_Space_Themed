import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Auto-generated Open Graph preview image — replaces the old blank/broken
 * static og.png. Rendered at build time by Next.js and served at
 * `/opengraph-image` so every social share (LinkedIn, X, WhatsApp, Slack)
 * shows a real branded card instead of an empty black box.
 */
export default async function Image() {
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
          backgroundColor: "#08080A",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(124,92,255,0.20) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(232,116,60,0.18) 0%, transparent 50%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* subtle scattered stars */}
        {[
          [80, 90], [220, 60], [340, 140], [1020, 80], [1100, 200],
          [60, 480], [180, 540], [980, 500], [1120, 460], [560, 40],
          [700, 560], [420, 520], [900, 130], [150, 320], [1050, 340],
        ].map(([x, y], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.5)",
            }}
          />
        ))}

        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            color: "#F5F5F7",
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          Arpit Chhabra
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 34,
            color: "#E8743C",
            fontStyle: "italic",
            display: "flex",
          }}
        >
          Full-Stack Developer
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 22,
            color: "#A1A1AA",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          MERN · Real-Time Systems · AI
        </div>
      </div>
    ),
    { ...size }
  );
}
