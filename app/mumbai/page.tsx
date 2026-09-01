import type { Metadata } from "next";
import { CAFES } from "@/lib/cafes";
import MumbaiScreen from "./MumbaiScreen";

export const metadata: Metadata = {
  title: "Mumbai — cafes you can work from",
  description:
    "Every cafe in Bandra and South Bombay ranked on wifi, power outlets, noise and seating. Find one you can actually work from.",
  alternates: { canonical: "/mumbai" },
};

export default async function MumbaiPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;
  const initialArea = area === "bandra" || area === "south-bombay" ? area : "all";

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Cafes to work from in Mumbai",
    numberOfItems: CAFES.length,
    itemListElement: CAFES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CafeOrCoffeeShop",
        name: c.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: c.address,
          addressLocality: "Mumbai",
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
        ...(c.website ? { url: c.website } : {}),
        geo: {
          "@type": "GeoCoordinates",
          latitude: c.latitude,
          longitude: c.longitude,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <MumbaiScreen initialArea={initialArea} />
    </>
  );
}
