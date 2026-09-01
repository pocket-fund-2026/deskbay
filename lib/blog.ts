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
      "Our highest-scored cafes on the workability model, ranked — pulled straight from the same cited data behind the map, not a separate opinion.",
    date: "2026-09-01",
    readingTime: "6 min read",
  },
  {
    slug: "whats-new-in-mumbais-cafe-scene",
    title: "What's new in Mumbai's cafe scene",
    description:
      "Recent openings, expansions and where the city's specialty coffee culture is heading — with sources.",
    date: "2026-09-01",
    readingTime: "5 min read",
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
