import { ImageResponse } from "next/og";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#e8e8e3",
        color: "#080807",
        width: "1200px",
        height: "630px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 100,
        letterSpacing: "-.06em",
      }}
    >
      K-VERSATION
    </div>,
    { width: 1200, height: 630 },
  );
}
