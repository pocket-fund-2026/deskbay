import type { MetadataRoute } from "next";
import { AREAS, CAFES } from "@/lib/cafes";
import { BLOG_POSTS } from "@/lib/blog";

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

  const blogUrls = BLOG_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/mumbai`, changeFrequency: "weekly", priority: 0.9 },
    ...areaUrls,
    ...cafeUrls,
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.5 },
    ...blogUrls,
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/submit`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
