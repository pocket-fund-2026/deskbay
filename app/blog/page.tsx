import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import CoffeeHero from "@/components/CoffeeHero";

const SITE_URL = "https://deskbay-blue.vercel.app";
const TITLE = "Blog";
const DESCRIPTION = "Notes on Mumbai's cafe scene — best-of lists pulled from our own data, and what's actually new.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `${TITLE} · Deskbay`,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog`,
    type: "website",
    images: ["/opengraph-image"],
  },
};

export default function BlogIndex() {
  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="wa-mono text-paper/45 hover:text-paper">
          ← Deskbay
        </Link>
        <h1 className="font-display mt-6 text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-tight">
          Blog
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-paper/60">{DESCRIPTION}</p>

        <div className="mt-8 space-y-4">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-xl border border-paper/12 p-5 transition-colors hover:bg-paper/[0.04]"
            >
              <div className="mb-4 max-w-xs">
                <CoffeeHero />
              </div>
              <p className="wa-mono text-paper/40">
                {post.date} · {post.readingTime}
              </p>
              <h2 className="font-display mt-1.5 text-[19px] font-medium leading-snug">
                {post.title}
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-paper/60">{post.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
