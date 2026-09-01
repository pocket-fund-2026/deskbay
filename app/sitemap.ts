import type { MetadataRoute } from "next";
import { AREAS, CAFES } from "@/lib/cafes";

const BASE = "https://deskbay-blue.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const areaUrls = Object.keys(AREAS).map((slug) => ({
    url: `${BASE}/mumbai?area=${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const cafeUrls = CAFES.map((c) => ({
    url: `${BASE}/mumbai/${c.slug}`,
    lastModified: c.lastVerifiedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/mumbai`, changeFrequency: "weekly", priority: 0.9 },
    ...areaUrls,
    ...cafeUrls,
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/submit`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
