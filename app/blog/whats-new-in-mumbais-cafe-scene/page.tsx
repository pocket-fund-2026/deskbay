import Link from "next/link";
import type { Metadata } from "next";
import { getPost } from "@/lib/blog";
import { getCafe } from "@/lib/cafes";

const SITE_URL = "https://deskbay-blue.vercel.app";
const post = getPost("whats-new-in-mumbais-cafe-scene")!;

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

const boojee = getCafe("boojee-cafe-perry-road");

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
          A roundup of real openings and expansions reported recently, plus where the city&apos;s
          specialty coffee scene is actually heading — each claim sourced, same as the rest of
          this site.
        </p>

        <h2 className="font-display mt-9 text-[20px] font-medium tracking-tight">Recent openings and expansions</h2>

        <div className="mt-4 space-y-5">
          <div>
            <h3 className="font-medium text-[15.5px]">Third Wave Coffee&apos;s 200th store</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-paper/65">
              Third Wave Coffee opened its 200th cafe in Sindhi Society, Chembur — its ~40th in
              Mumbai — as part of a stated plan to add roughly 100 more cafes nationally through
              2026.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[15.5px]">Bombay Sweet Shop, Borivali</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-paper/65">
              Bombay Sweet Shop opened its first Borivali outpost in June 2026 — an all-day cafe,
              mithai shop and retail store serving chaat, sandwiches, coffee and mithai alongside
              its usual retail line.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[15.5px]">Boojee Cafe, BKC</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-paper/65">
              Boojee Cafe — already on Deskbay
              {boojee && (
                <>
                  {" "}
                  at its <Link href={`/mumbai/${boojee.slug}`} className="underline hover:text-paper">Perry Road, Bandra location</Link>
                </>
              )}{" "}
              — was reported in August 2026 to be opening a fifth Mumbai outlet in Bandra Kurla
              Complex.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[15.5px]">Cafe Quattro, Babulnath</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-paper/65">
              Cafe Quattro opened its second Mumbai location in Babulnath on 26 July 2026,
              extending into South Mumbai.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[15.5px]">GOAT Brew</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-paper/65">
              GOAT Brew opened as a new all-day cafe, restaurant and bar, founded by Lizaa Malik
              and Saurabh Pathak.
            </p>
          </div>
        </div>

        <h2 className="font-display mt-9 text-[20px] font-medium tracking-tight">Where the scene is heading</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-paper/65">
          Mumbai&apos;s specialty coffee culture keeps leaning into Indian-origin, direct-sourced
          beans — menus increasingly read like a map of the country&apos;s coffee-growing south,
          with roasters working single-origin lots from Chikmagalur and the Araku Valley. Brewing
          methods are diversifying beyond straight espresso into pour-overs, siphon bars and
          coffee cocktails, and cafes are positioning themselves as community spaces — cupping
          sessions, brewing classes and tasting flights — rather than just counters to grab a cup
          and go.
        </p>

        <div className="mt-9 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="wa-mono mb-2 text-paper/40">Sources</p>
          <ul className="space-y-1.5 text-[13px] leading-relaxed text-paper/55">
            <li>
              <a href="https://www.retail4growth.com/news/third-wave-coffee-opens-200th-cafe-in-mumbai-plans-100-new-cafes-by-2026-7640" target="_blank" rel="noopener noreferrer" className="underline hover:text-paper">
                Third Wave Coffee opens 200th cafe in Mumbai — retail4growth.com
              </a>
            </li>
            <li>
              <a href="https://www.timeout.com/mumbai/news/bombay-sweet-shop-arrives-in-borivali-with-chaat-coffee-and-cult-mithai-063026" target="_blank" rel="noopener noreferrer" className="underline hover:text-paper">
                Bombay Sweet Shop arrives in Borivali — Time Out Mumbai
              </a>
            </li>
            <li>
              <a href="https://www.timeout.com/mumbai/news/boojee-cafe-is-opening-a-new-outlet-at-one-bkc-in-mumbai-082026" target="_blank" rel="noopener noreferrer" className="underline hover:text-paper">
                Boojee Cafe opening at One BKC — Time Out Mumbai
              </a>
            </li>
            <li>
              <a href="https://www.indianretailer.com/news/cafe-quattro-opens-second-mumbai-cafe-mumbai" target="_blank" rel="noopener noreferrer" className="underline hover:text-paper">
                Cafe Quattro opens second Mumbai outlet — Indian Retailer
              </a>
            </li>
            <li>
              <a href="https://www.indianretailer.com/news/goat-brew-opens-new-cafe-and-bar-mumbai" target="_blank" rel="noopener noreferrer" className="underline hover:text-paper">
                GOAT Brew opens new cafe and bar — Indian Retailer
              </a>
            </li>
            <li>
              <a href="https://www.baristamagazine.com/indian-specialty-coffee-shines-in-mumbai-an-exclusive-guide-to-the-city/" target="_blank" rel="noopener noreferrer" className="underline hover:text-paper">
                An exclusive guide to Mumbai&apos;s specialty coffee scene — Barista Magazine
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
