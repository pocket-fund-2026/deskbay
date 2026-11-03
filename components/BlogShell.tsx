import Link from "next/link";
import type { Metadata } from "next";
import { getPost } from "@/lib/blog";
import CoffeeHero from "@/components/CoffeeHero";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";

export function postMetadata(slug: string): Metadata {
  const post = getPost(slug)!;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: `${post.title} · Bombay Cafe Map`,
      description: post.description,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} · Bombay Cafe Map`,
      description: post.description,
      images: ["/opengraph-image"],
    },
  };
}

export const breadcrumbLd = (slug: string) => {
  const post = getPost(slug)!;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bombay Cafe Map", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };
};

type Faq = { q: string; a: string };
type Source = { label: string; href: string };

/** Layout for data-derived posts: the page body is computed from the cafe data, so it cannot drift from the map. */
export default function BlogShell({
  slug,
  answer,
  faqs,
  sources,
  children,
}: {
  slug: string;
  /** The direct answer, first thing on the page (what answer engines quote). */
  answer: string;
  faqs: Faq[];
  sources: Source[];
  children: React.ReactNode;
}) {
  const post = getPost(slug)!;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.lastUpdated ?? post.date,
    inLanguage: "en-IN",
    image: `${SITE_URL}/opengraph-image`,
    author: { "@type": "Organization", name: "Bombay Cafe Map", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Bombay Cafe Map", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const ld = (o: object) => (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />
  );
  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      {ld(articleLd)}
      {ld(breadcrumbLd(slug))}
      {ld(faqLd)}
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/blog" className="wa-mono -my-2 py-2 text-paper/65 transition-colors hover:text-paper">
            ← Blog
          </Link>
          <ThemeToggle />
        </div>
        <p className="wa-mono mt-6 text-paper/65">
          {post.date} · {post.readingTime}
        </p>
        <h1 className="font-display mt-2 text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-tight">{post.title}</h1>
        <div className="mt-6">
          <CoffeeHero />
        </div>
        <p className="mt-5 text-[15px] leading-relaxed text-paper/75">{answer}</p>
        {children}
        <h2 className="font-display mt-9 text-[20px] font-medium tracking-tight">Frequently asked questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="text-[15.5px] font-medium">{f.q}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-paper/65">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-9 rounded-xl border border-paper/10 bg-paper/[0.03] p-5">
          <p className="wa-mono mb-2 text-paper/65">Sources and method</p>
          <ul className="space-y-1.5 text-[13px] leading-relaxed text-paper/65">
            {sources.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="underline hover:text-paper">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

export const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display mt-9 text-[20px] font-medium tracking-tight">{children}</h2>
);
export const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-[14px] leading-relaxed text-paper/65">{children}</p>
);
