import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bombay Cafe Map",
    short_name: "Cafe Map",
    description:
      "Mumbai cafes scored on whether you can actually work from them — power, wifi, seating, and whether they'll let you stay.",
    start_url: "/mumbai",
    display: "standalone",
    background_color: "#f7efe0",
    theme_color: "#2b1810",
    orientation: "portrait",
    categories: ["travel", "food", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android crops home-screen icons to a squircle; the "any" icons would
      // lose their rounded corners and clip the cup, so it gets its own art
      // with the cup pulled into the safe zone.
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
