import Link from "next/link";
import type { Metadata } from "next";
import { CAFES } from "@/lib/cafes";
import { tier } from "@/lib/scoreTier";
import { getPost } from "@/lib/blog";

const SITE_URL = "https://deskbay-blue.vercel.app";
const post = getPost("15-best-cafes-to-work-from-in-mumbai")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    title: `${post.title} · Deskbay`,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    type: "article",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${post.title} · Deskbay`,
    description: post.description,
    images: ["/opengraph-image"],
  },
};

const TOP_15 = CAFES.filter((c) => c.workability !== null)
  .sort((a, b) => (b.workability as number) - (a.workability as number))
  .slice(0, 15);

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.description,
  datePublished: post.date,
  dateModified: post.date,
  author: { "@type": "Organization", name: "Deskbay" },
  publisher: { "@type": "Organization", name: "Deskbay", url: SITE_URL },
  mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
};

export default function Post() {
  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <div className="mx-auto max-w-2xl">
        <Link href="/blog" className="wa-mono text-paper/45 hover:text-paper">
          ← Blog
        </Link>
        <p className="wa-mono mt-6 text-paper/40">
          {post.date} · {post.readingTime}
        </p>
        <h1 className="font-display mt-2 text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-tight">
          {post.title}
        </h1>

        <p className="mt-5 text-[15px] leading-relaxed text-paper/75">
          This isn&apos;t a separate opinion piece — it&apos;s the top 15 out of the{" "}
          {CAFES.filter((c) => c.workability !== null).length} cafes we&apos;ve fully scored on
          Deskbay&apos;s nine-factor workability model, ranked by that same score. Every claim
          here traces back to the cited evidence on each cafe&apos;s own page.
        </p>

        <ol className="mt-8 space-y-5">
          {TOP_15.map((cafe, i) => {
            const t = tier(cafe.workability);
            return (
              <li key={cafe.slug} className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="wa-mono text-paper/35">#{i + 1}</p>
                    <Link href={`/mumbai/${cafe.slug}`} className="group">
                      <h2 className="font-display mt-1 text-[19px] font-medium leading-snug group-hover:underline">
                        {cafe.name}
                      </h2>
                    </Link>
                    <p className="wa-mono mt-1 text-paper/40">{cafe.neighborhood}</p>
                  </div>
                  <div
                    className="flex shrink-0 flex-col items-center justify-center rounded-full"
                    style={{ width: 46, height: 46, border: `2px solid ${t.color}` }}
                  >
                    <span className="font-display text-[14px] leading-none">
                      {cafe.workability?.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="mt-2.5 text-[14px] leading-relaxed text-paper/65">{cafe.whyWeRecommend}</p>
                <Link href={`/mumbai/${cafe.slug}`} className="wa-mono mt-1.5 inline-block text-paper/40 hover:text-paper">
                  Full profile and evidence →
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-[14px] leading-relaxed text-paper/65">
            Want the full picture, including the cafes that scored lower and why? See{" "}
            <Link href="/mumbai" className="underline hover:text-paper">the interactive map</Link>{" "}
            or read <Link href="/about" className="underline hover:text-paper">how we score</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
