import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://deskbay-blue.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Deskbay — find a Mumbai cafe you can actually work from",
    template: "%s · Deskbay",
  },
  description:
    "A map of Mumbai cafes scored on wifi, power outlets, noise and seating — across Bandra and South Bombay — so you know which one will let you stay three hours.",
  keywords: [
    "work friendly cafes Mumbai",
    "cafes with wifi Mumbai",
    "laptop friendly cafes Bandra",
    "cafes to work from South Bombay",
    "best cafes Bandra",
    "coworking cafes Mumbai",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Deskbay — find a Mumbai cafe you can actually work from",
    description:
      "Every cafe in Bandra and South Bombay ranked on wifi, power outlets, noise and seating.",
    url: SITE_URL,
    siteName: "Deskbay",
    locale: "en_IN",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deskbay",
    description:
      "Every cafe in Bandra and South Bombay ranked on wifi, power outlets, noise and seating.",
    images: ["/opengraph-image"],
  },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
