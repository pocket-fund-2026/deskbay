import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import CoffeeHero from "@/components/CoffeeHero";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";
const TITLE = "Blog";
const DESCRIPTION = "Notes on Mumbai's cafe scene: best-of lists pulled from our own data, and what's actually new.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `${TITLE} · Bombay Cafe Map`,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog`,
    type: "website",
    images: ["/opengraph-image"],
  },
};

const POSTS = BLOG_POSTS.map((p, i) => ({ p, i }))
  .sort((a, b) => b.p.date.localeCompare(a.p.date) || b.i - a.i)
  .map(({ p }) => p);

export default function BlogIndex() {
  return (
    <main className="min-h-dvh bg-ink px-6 py-6 text-paper sm:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="wa-mono -my-2 py-2 text-paper/65 transition-colors hover:text-paper">
            ← Bombay Cafe Map
          </Link>
          <ThemeToggle />
        </div>
        <h1 className="font-display mt-4 text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-tight">
          Blog
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-paper/65">{DESCRIPTION}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {POSTS.map((post, i) => {
            const wide = i === 0 || (i === POSTS.length - 1 && i % 2 === 1);
            return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`group flex flex-col overflow-hidden rounded-xl border border-paper/12 transition-all hover:-translate-y-0.5 hover:bg-paper/[0.04] hover:shadow-lg ${
                wide ? "sm:col-span-2 sm:flex-row" : ""
              }`}
            >
              <div className={wide ? "sm:w-2/5 sm:shrink-0" : ""}>
                <div className={`[&>div]:rounded-none [&>div]:border-0 [&>div]:aspect-[16/5] ${wide ? "sm:[&>div]:aspect-auto sm:[&>div]:h-full" : "sm:[&>div]:aspect-auto sm:[&>div]:h-28"}`}>
                  <CoffeeHero />
                </div>
              </div>
              <div className="flex flex-col justify-center p-4">
                <p className="wa-mono text-paper/65">
                  {i === 0 ? "Latest · " : ""}
                  {post.date} · {post.readingTime}
                </p>
                <h2
                  className={`font-display mt-1 font-medium leading-snug group-hover:underline ${
                    wide ? "text-[22px]" : "text-[17px]"
                  }`}
                >
                  {post.title}
                </h2>
                <p className="mt-1.5 line-clamp-3 text-[13.5px] leading-relaxed text-paper/65">
                  {post.description}
                </p>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
