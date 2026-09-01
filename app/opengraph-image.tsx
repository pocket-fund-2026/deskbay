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
          background: "linear-gradient(160deg,#181512 0%,#2a2019 55%,#3a2a1c 100%)",
          color: "#f6f1e9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 4, textTransform: "uppercase", opacity: 0.55 }}>
          Deskbay
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
