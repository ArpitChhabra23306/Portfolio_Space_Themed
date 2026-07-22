import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Auto-generated favicon — an "AC" monogram on the site's ink-black background
 * with the ember accent, so the browser tab shows real branding instead of the
 * generic globe icon (there was no favicon file at all before this).
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
          backgroundColor: "#08080A",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#E8743C",
            fontFamily: "sans-serif",
            display: "flex",
          }}
        >
          AC
        </div>
      </div>
    ),
    { ...size }
  );
}
