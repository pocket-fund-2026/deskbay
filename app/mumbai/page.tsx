import type { Metadata } from "next";
import { AREAS, CAFES, cafesByArea, type AreaSlug } from "@/lib/cafes";
import MumbaiScreen from "./MumbaiScreen";

const SITE_URL = "https://bombaycafemap.com";

function resolveArea(area?: string): AreaSlug | "all" {
  return area && Object.prototype.hasOwnProperty.call(AREAS, area) ? (area as AreaSlug) : "all";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}): Promise<Metadata> {
  const { area: rawArea } = await searchParams;
  const area = resolveArea(rawArea);

  const title =
    area === "all"
      ? "Mumbai — cafes you can work from"
      : `${AREAS[area].name} — cafes you can work from`;
  const description =
    area === "all"
      ? "Cafes across Mumbai ranked on wifi, power outlets, noise and seating. Find one you can actually work from."
      : `Every work-friendly cafe in ${AREAS[area].name}, Mumbai, ranked on wifi, power outlets, noise and seating.`;
  const path = area === "all" ? "/mumbai" : `/mumbai?area=${area}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · Bombay Cafe Map`,
      description,
      url: `${SITE_URL}${path}`,
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Bombay Cafe Map`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function MumbaiPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area: rawArea } = await searchParams;
  const area = resolveArea(rawArea);
  const cafes = area === "all" ? CAFES : cafesByArea(area);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name:
      area === "all" ? "Cafes to work from in Mumbai" : `Cafes to work from in ${AREAS[area].name}`,
    numberOfItems: cafes.length,
    itemListElement: cafes.map((c, i) => ({
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

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bombay Cafe Map", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Mumbai", item: `${SITE_URL}/mumbai` },
      ...(area !== "all"
        ? [{ "@type": "ListItem", position: 3, name: AREAS[area].name, item: `${SITE_URL}/mumbai?area=${area}` }]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <MumbaiScreen initialArea={area} />
    </>
  );
}
