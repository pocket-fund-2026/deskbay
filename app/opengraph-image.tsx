import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(160deg,#f7efe0 0%,#f0e3cc 55%,#e8d5b3 100%)",
          color: "#2b1810",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 4, textTransform: "uppercase", opacity: 0.6, color: "#b5651d" }}>
          Bombay Cafe Map
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 74,
            fontWeight: 600,
            marginTop: 20,
            lineHeight: 1.1,
          }}
        >
          <span>Find a Mumbai cafe</span>
          <span>you can actually work from</span>
        </div>
        <div style={{ fontSize: 26, marginTop: 28, opacity: 0.65 }}>
          Wifi · Power · Noise · Seating — Bandra &amp; South Bombay
        </div>
      </div>
    ),
    { ...size }
  );
}
