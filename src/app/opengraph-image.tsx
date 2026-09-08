import { ImageResponse } from "next/og";

export const alt = "K-VERSATION — Korea, in conversation with the world";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(180deg, #132438 0%, #0d1826 55%, #080f19 100%)",
          color: "#f7f2e8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: "#d4a35f" }}>
          Korea ↔ The World
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 112, fontWeight: 800, letterSpacing: -7 }}>
          K<span style={{ width: 100, height: 14, background: "#d4a35f", margin: "0 16px" }} />VERSATION
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "rgba(247,242,232,0.82)" }}>
          <span>Original conversations &amp; dispatches</span>
          <span>Hosted by Daniel Koo</span>
        </div>
      </div>
    ),
    size,
  );
}
