import Link from "next/link";
import type { Metadata } from "next";
import SubmitForm from "./SubmitForm";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";
const TITLE = "Submit a cafe";
const DESCRIPTION = "Know a Mumbai cafe that belongs on Bombay Cafe Map? Tell us about it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/submit" },
  openGraph: {
    title: `${TITLE} · Bombay Cafe Map`,
    description: DESCRIPTION,
    url: `${SITE_URL}/submit`,
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · Bombay Cafe Map`,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Bombay Cafe Map", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Submit a cafe", item: `${SITE_URL}/submit` },
  ],
};

export default function SubmitPage() {
  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="wa-mono -my-2 py-2 text-paper/45 transition-colors hover:text-paper">
              ← Bombay Cafe Map
            </Link>
            <ThemeToggle />
          </div>
          <nav className="wa-mono flex gap-4 text-paper/45">
            <Link href="/mumbai" className="-my-1.5 inline-block py-1.5 transition-colors hover:text-paper">The map</Link>
            <Link href="/blog" className="-my-1.5 inline-block py-1.5 transition-colors hover:text-paper">Blog</Link>
            <Link href="/about" className="-my-1.5 inline-block py-1.5 transition-colors hover:text-paper">About</Link>
          </nav>
        </div>
        <h1 className="font-display mt-6 text-[clamp(1.6rem,3.6vw,2.1rem)] font-medium tracking-tight">
          Submit a cafe
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-paper/60">
          Know somewhere in Bandra or South Bombay that deserves a place on the map? Tell us the
          basics — we verify wifi, power and seating against published sources before it goes
          live.
        </p>
        <SubmitForm />
      </div>
    </main>
  );
}
