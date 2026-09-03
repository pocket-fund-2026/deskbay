import Link from "next/link";
import type { Metadata } from "next";
import { getPost } from "@/lib/blog";
import { getCafe, CAFES } from "@/lib/cafes";
import CoffeeHero from "@/components/CoffeeHero";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";
const post = getPost("whats-new-in-mumbais-cafe-scene")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    title: `${post.title} · Bombay Cafe Map`,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    type: "article",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${post.title} · Bombay Cafe Map`,
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
  author: { "@type": "Organization", name: "Bombay Cafe Map" },
  publisher: { "@type": "Organization", name: "Bombay Cafe Map", url: SITE_URL },
  mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
};

const boojee = getCafe("boojee-cafe-perry-road");

export default function Post() {
  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/blog" className="wa-mono -my-2 py-2 text-paper/45 transition-colors hover:text-paper">
            ← Blog
          </Link>
          <ThemeToggle />
        </div>
        <p className="wa-mono mt-6 text-paper/40">
          {post.date} · {post.readingTime}
        </p>
        <h1 className="font-display mt-2 text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-tight">
          {post.title}
        </h1>

        <div className="mt-6">
          <CoffeeHero />
        </div>

        <p className="mt-5 text-[15px] leading-relaxed text-paper/75">
          Mumbai&apos;s cafe scene doesn&apos;t sit still — chains keep opening new outlets in the
          suburbs, independents keep expanding into new neighborhoods, and the specialty coffee
          crowd keeps pushing what a Mumbai cafe menu looks like. This is a roundup of real
          openings and expansions reported recently, plus where the city&apos;s coffee culture is
          actually heading — each claim sourced, same standard as every cafe profile on this
          site. Nothing here is guessed at or paraphrased from a press release without checking
          it against an independent report first.
        </p>

        <h2 className="font-display mt-9 text-[20px] font-medium tracking-tight">Recent openings and expansions</h2>

        <div className="mt-4 space-y-5">
          <div>
            <h3 className="font-medium text-[15.5px]">Third Wave Coffee&apos;s 200th store</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-paper/65">
              Third Wave Coffee opened its 200th cafe in Sindhi Society, Chembur — its ~40th in
              Mumbai — as part of a stated plan to add roughly 100 more cafes nationally through
              2026. The chain has become one of the most reliable names on Bombay Cafe Map&apos;s own
              directory precisely because of that scale: a Third Wave branch is one of the few
              cafe formats consistent enough across suburbs like Andheri, Kandivali and Santacruz
              that its wifi and seating setup rarely varies from outlet to outlet.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[15.5px]">Bombay Sweet Shop, Borivali</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-paper/65">
              Bombay Sweet Shop opened its first Borivali outpost in June 2026 — an all-day cafe,
              mithai shop and retail store serving chaat, sandwiches, coffee and mithai alongside
              its usual retail line. It&apos;s a sign of where new cafe openings are landing:
              further out in the western suburbs, not just Bandra, which is also where most of
              Bombay Cafe Map&apos;s own newer, not-yet-scored directory listings have come from.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[15.5px]">Boojee Cafe, BKC</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-paper/65">
              Boojee Cafe — already on Bombay Cafe Map
              {boojee && (
                <>
                  {" "}
                  at its <Link href={`/mumbai/${boojee.slug}`} className="underline hover:text-paper">Perry Road, Bandra location</Link>
                </>
              )}{" "}
              — was reported in August 2026 to be opening a fifth Mumbai outlet in Bandra Kurla
              Complex, following the wider pattern of independent Bandra cafes following the
              office crowd into BKC rather than sticking to residential neighbourhoods.
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

        <h2 className="font-display mt-9 text-[20px] font-medium tracking-tight">
          Where Bombay Cafe Map&apos;s own coverage is growing
        </h2>
        <p className="mt-3 text-[14px] leading-relaxed text-paper/65">
          We track this expansion directly: Bombay Cafe Map now lists {CAFES.length} Mumbai cafes across
          seven areas, up from an initial 30 in Bandra and South Bombay. Newer areas like BKC,
          Thane and Navi Mumbai are still directory listings rather than fully scored, which is
          the honest state of coverage right now — a cafe appearing on the map is not the same as
          a cafe we&apos;ve verified is good to work from. See the{" "}
          <Link href="/about" className="underline hover:text-paper">methodology</Link> for the
          distinction.
        </p>

        <div className="mt-9 rounded-xl border border-paper/10 bg-paper/[0.03] p-5">
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
