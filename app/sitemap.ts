import type { MetadataRoute } from "next";
import { AREAS } from "@/lib/cafes";

const BASE = "https://deskbay.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const areaUrls = Object.keys(AREAS).map((slug) => ({
    url: `${BASE}/mumbai?area=${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/mumbai`, changeFrequency: "weekly", priority: 0.9 },
    ...areaUrls,
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/submit`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
