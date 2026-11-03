export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  lastUpdated?: string;
  readingTime: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "15-best-cafes-to-work-from-in-mumbai",
    title: "The 15 best cafes to work from in Mumbai right now",
    description:
      "Our highest-scored cafes on the workability model, ranked and pulled straight from the same cited data behind the map, not a separate opinion.",
    date: "2026-09-01",
    lastUpdated: "2026-10-15",
    readingTime: "6 min read",
  },
  {
    slug: "whats-new-in-mumbais-cafe-scene",
    title: "What's new in Mumbai's cafe scene",
    description:
      "Recent openings, expansions and where the city's specialty coffee culture is heading, with sources.",
    date: "2026-09-01",
    lastUpdated: "2026-09-28",
    readingTime: "5 min read",
  },
  {
    slug: "best-cafes-to-work-from-in-bandra",
    title: "The best cafes to work from in Bandra",
    description:
      "Bandra has the best odds in the city of a table, a plug and three quiet hours. Our scored, cited ranking of where to actually get work done there.",
    date: "2026-09-24",
    lastUpdated: "2026-10-15",
    readingTime: "5 min read",
  },
  {
    slug: "best-cafes-to-work-from-in-south-bombay",
    title: "The best cafes to work from in South Bombay",
    description:
      "135 cafes across Fort, Colaba, Ballard Estate and Nariman Point — our scored, cited ranking of which ones actually hold up for a work session.",
    date: "2026-09-24",
    lastUpdated: "2026-10-15",
    readingTime: "5 min read",
  },
  {
    slug: "best-cafes-to-work-from-in-eastern-suburbs",
    title: "The best cafes to work from in the Eastern Suburbs",
    description:
      "Powai's lakeside cafes anchor a scene now spreading through Ghatkopar, Chembur and Mulund — our scored, cited ranking of which ones actually hold up for a work session.",
    date: "2026-09-25",
    lastUpdated: "2026-10-15",
    readingTime: "5 min read",
  },
  {
    slug: "best-cafes-to-work-from-in-thane",
    title: "The best cafes to work from in Thane",
    description:
      "Thane's own cafe scene is growing fast along Ghodbunder Road — our scored, cited ranking of where to actually get a table, a plug and some quiet.",
    date: "2026-09-25",
    lastUpdated: "2026-10-15",
    readingTime: "5 min read",
  },
  {
    slug: "best-cafes-to-work-from-in-andheri-juhu",
    title: "The best cafes to work from in Andheri & Juhu",
    description:
      "The widest stretch of cafes on the map, from airport-adjacent chains to film-crowd regulars — our scored, cited ranking of which ones actually hold up for a work session.",
    date: "2026-09-28",
    lastUpdated: "2026-10-15",
    readingTime: "5 min read",
  },
  {
    slug: "best-cafes-to-work-from-in-bkc",
    title: "The best cafes to work from in BKC",
    description:
      "Coffee built for the business district's schedule — our scored, cited ranking of which Bandra Kurla Complex cafes actually hold up for a laptop session.",
    date: "2026-10-12",
    lastUpdated: "2026-10-15",
    readingTime: "5 min read",
  },
  {
    slug: "best-cafes-to-work-from-in-malad-borivali",
    title: "The best cafes to work from in Malad & Borivali",
    description:
      "The far western suburbs' quieter cafe stretch from Goregaon to Borivali — our scored, cited ranking of where to get a table, a plug and a stable connection.",
    date: "2026-10-16",
    readingTime: "5 min read",
  },
  {
    slug: "best-cafes-to-work-from-in-central-mumbai",
    title: "The best cafes to work from in Central Mumbai",
    description:
      "Mill-district roasters in Worli and Lower Parel to old-Bombay rooms in Dadar and Matunga — our scored, cited ranking of which ones hold up for a work session.",
    date: "2026-10-16",
    readingTime: "5 min read",
  },
  {
    slug: "best-cafes-to-work-from-in-navi-mumbai",
    title: "The best cafes to work from in Navi Mumbai",
    description:
      "Planned-city cafes across Vashi, Nerul, Belapur and Kharghar — our scored, cited ranking of where to actually get work done, based on evidence rather than star ratings.",
    date: "2026-10-16",
    readingTime: "5 min read",
  },
  {
    slug: "best-cafes-with-wifi-in-mumbai",
    title: "Best Cafes With WiFi in Mumbai (Sourced)",
    description:
      "Which Mumbai cafes have wifi you can work on? Every wifi claim below names who made it, from a cafe's own site to Wikipedia, and we say what we could not verify.",
    date: "2026-10-14",
    lastUpdated: "2026-10-15",
    readingTime: "4 min read",
  },
  {
    slug: "best-cafes-with-power-outlets-in-mumbai",
    title: "Best Cafes With Power Outlets in Mumbai (Sourced)",
    description:
      "Which Mumbai cafes have plug points for laptops? Five cafes with a named source for their outlets, what each source says, and what we could not verify.",
    date: "2026-10-19",
    readingTime: "4 min read",
  },
  {
    slug: "best-cafes-in-mumbai-where-you-can-stay-three-hours",
    title: "Best Mumbai cafes where you can stay three hours",
    description:
      "Which Mumbai cafes are recorded as tolerating a long sit, ranked by workability score and broken down by area, from the same cited data as the map.",
    date: "2026-10-21",
    readingTime: "3 min read",
  },
  {
    slug: "which-mumbai-area-is-best-to-work-from-cafes-compared",
    title: "Which Mumbai area is best to work from? Nine areas compared",
    description:
      "Cafe count, average workability score and long-stay, wifi, plug and quiet counts for all nine Mumbai areas in one table.",
    date: "2026-10-24",
    readingTime: "3 min read",
  },
  {
    slug: "quiet-cafes-in-mumbai-to-work-from",
    title: "Quiet cafes in Mumbai to work from",
    description:
      "The Mumbai cafes recorded as quiet, ranked by workability score, with the count by area and what quiet does and does not tell you.",
    date: "2026-10-28",
    readingTime: "3 min read",
  },
  {
    slug: "best-mumbai-cafes-for-video-calls",
    title: "Best Mumbai cafes for video calls: fast wifi and a quiet room",
    description:
      "The Mumbai cafes recorded with both fast wifi and low noise, with any unverified wifi claim flagged. No speed tests claimed.",
    date: "2026-10-31",
    readingTime: "3 min read",
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
