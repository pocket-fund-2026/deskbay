import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-89FQDR1XDM";

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

const SITE_URL = "https://bombaycafemap.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bombay Cafe Map — find a Mumbai cafe you can actually work from",
    template: "%s · Bombay Cafe Map",
  },
  description:
    "A map of Mumbai cafes scored on wifi, power outlets, noise and seating — starting in Bandra and South Bombay, expanding citywide — so you know which one will let you stay three hours.",
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
    title: "Bombay Cafe Map — find a Mumbai cafe you can actually work from",
    description:
      "Cafes across Mumbai ranked on wifi, power outlets, noise and seating, starting with Bandra and South Bombay.",
    url: SITE_URL,
    siteName: "Bombay Cafe Map",
    locale: "en_IN",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bombay Cafe Map",
    description:
      "Cafes across Mumbai ranked on wifi, power outlets, noise and seating, starting with Bandra and South Bombay.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  verification: { google: "uKGJoLyvBJdHaTySPXTeOr5SqxC9CCnpWwbu28p3G2Y" },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bombay Cafe Map",
  url: SITE_URL,
  description:
    "A map of Mumbai cafes scored on wifi, power outlets, noise and seating, expanding across the city.",
  inLanguage: "en-IN",
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bombay Cafe Map",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-dvh font-sans antialiased">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        {children}
      </body>
    </html>
  );
}
