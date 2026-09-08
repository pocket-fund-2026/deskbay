import type { Metadata } from "next";
import { CAFES } from "@/lib/cafes";
import { getApprovedCafes } from "@/lib/submissions";
import MumbaiScreen from "../MumbaiScreen";

/**
 * The "near me" entry point.
 *
 * Search Console has this site picking up "cafes near me where i can sit and
 * work", "coffee shops with wifi near me" and "closest coffee" on the generic
 * map page, which answers none of them — it opens on all of Mumbai and has no
 * idea where the reader is. This page is the same map with the location
 * request already turned on, and a title that matches what was typed.
 *
 * A static segment sitting next to /mumbai/[slug]: Next resolves the literal
 * path first, and no cafe slug is "near-me".
 */

export const dynamic = "force-dynamic";

const SITE_URL = "https://bombaycafemap.com";

const TITLE = "Cafes near me to work from in Mumbai";
const DESCRIPTION =
  "Share your location and see the closest Mumbai cafes you can actually work from, nearest first, filtered to the ones open right now.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/mumbai/near-me" },
  openGraph: {
    title: `${TITLE} · Bombay Cafe Map`,
    description: DESCRIPTION,
    url: `${SITE_URL}/mumbai/near-me`,
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

export default async function NearMePage() {
  const approved = await getApprovedCafes();
  const allCafes = [...CAFES, ...approved];

  // The crawler can't share a location, so it has to be able to read the
  // answer without one: a plain FAQ block saying what the page does and how
  // the ordering is decided.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I find a cafe near me to work from in Mumbai?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Turn on "Near me" and the map sorts all ${allCafes.length} cafes by straight-line distance from you, closest first. Each one carries a workability score built from wifi, power outlets, noise and seating, with the evidence for every finding cited on its page.`,
        },
      },
      {
        "@type": "Question",
        name: "Which cafes near me are open right now?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The “Open now” filter checks each cafe's recorded opening hours against the current time in Mumbai. Cafes whose hours we haven't verified are left out rather than guessed at, and the count of those is shown under the filter.",
        },
      },
      {
        "@type": "Question",
        name: "Does Bombay Cafe Map store my location?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The browser hands the coordinates to the page, the page sorts the list with them, and nothing is sent to a server or written down.",
        },
      },
    ],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bombay Cafe Map", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Mumbai", item: `${SITE_URL}/mumbai` },
      { "@type": "ListItem", position: 3, name: "Near me", item: `${SITE_URL}/mumbai/near-me` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <MumbaiScreen initialArea="all" allCafes={allCafes} initialNearMe />
    </>
  );
}
