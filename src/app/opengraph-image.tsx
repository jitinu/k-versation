import { ImageResponse } from "next/og";

export const alt = "K-VERSATION — Korea, in conversation with the world";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f2efe8",
          color: "#243b5a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 5, textTransform: "uppercase" }}>
          Korea ↔ The World
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 112, fontWeight: 800, letterSpacing: -7 }}>
          K<span style={{ width: 100, height: 14, background: "#243b5a", margin: "0 16px" }} />VERSATION
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
          <span>Original conversations &amp; dispatches</span>
          <span>Hosted by Daniel Koo</span>
        </div>
      </div>
    ),
    size,
  );
}
