export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "15-best-cafes-to-work-from-in-mumbai",
    title: "The 15 best cafes to work from in Mumbai right now",
    description:
      "Our highest-scored cafes on the workability model, ranked and pulled straight from the same cited data behind the map, not a separate opinion.",
    date: "2026-09-01",
    readingTime: "6 min read",
  },
  {
    slug: "whats-new-in-mumbais-cafe-scene",
    title: "What's new in Mumbai's cafe scene",
    description:
      "Recent openings, expansions and where the city's specialty coffee culture is heading, with sources.",
    date: "2026-09-01",
    readingTime: "5 min read",
  },
  {
    slug: "best-cafes-to-work-from-in-bandra",
    title: "The best cafes to work from in Bandra",
    description:
      "Bandra has the best odds in the city of a table, a plug and three quiet hours. Our scored, cited ranking of where to actually get work done there.",
    date: "2026-09-24",
    readingTime: "5 min read",
  },
  {
    slug: "best-cafes-to-work-from-in-south-bombay",
    title: "The best cafes to work from in South Bombay",
    description:
      "135 cafes across Fort, Colaba, Ballard Estate and Nariman Point — our scored, cited ranking of which ones actually hold up for a work session.",
    date: "2026-09-24",
    readingTime: "5 min read",
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
