import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AREAS, cafesByArea } from "@/lib/cafes";
import { tier } from "@/lib/scoreTier";
import { getPost } from "@/lib/blog";
import CoffeeHero from "@/components/CoffeeHero";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";
const post = getPost("best-cafes-to-work-from-in-eastern-suburbs")!;
const AREA = AREAS["eastern-suburbs"];

const SCORED = cafesByArea("eastern-suburbs").filter((c) => c.workability !== null);
const RANKED = [...SCORED].sort((a, b) => (b.workability as number) - (a.workability as number)).slice(0, 8);

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

function writeup(cafe: (typeof RANKED)[number]) {
  const parts: string[] = [cafe.editorialNote];
  if (cafe.whyWeRecommend && cafe.whyWeRecommend !== cafe.editorialNote) {
    parts.push(cafe.whyWeRecommend);
  }
  const ev = cafe.evidence;
  const evidenceBits = [ev.wifi, ev.charging, ev.quiet, ev.seating, ev.work].filter(
    (e): e is string => Boolean(e) && !parts.join(" ").includes(e as string)
  );
  parts.push(...evidenceBits.slice(0, 2));
  if (cafe.synthesis && !parts.join(" ").includes(cafe.synthesis)) parts.push(cafe.synthesis);
  return parts.join(" ");
}

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

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best cafe to work from in the Eastern Suburbs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `${RANKED[0].name} on ${RANKED[0].neighborhood} currently has Bombay Cafe Map's highest workability score in the Eastern Suburbs (${RANKED[0].workability}/5), based on cited evidence about its wifi, seating and noise levels.`,
      },
    },
    {
      "@type": "Question",
      name: "How many cafes has Bombay Cafe Map scored in the Eastern Suburbs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `${SCORED.length} of the ${cafesByArea("eastern-suburbs").length} Eastern Suburbs cafes on Bombay Cafe Map have a workability score, based on cited evidence rather than star ratings alone. See the full methodology at /about.`,
      },
    },
  ],
};

export default function Post() {
  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
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
        <h1 className="font-display mt-2 text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-tight">
          {post.title}
        </h1>

        <div className="mt-6">
          <CoffeeHero />
        </div>

        <p className="mt-5 text-[15px] leading-relaxed text-paper/75">
          {AREA.description} Bombay Cafe Map has scored {SCORED.length} Eastern Suburbs cafes on
          the same nine-factor workability model used across the city: wifi, power, seating,
          noise, and how long you can actually stay. This is the top {RANKED.length}, ranked by
          that score, with every claim traceable to the cited evidence on each cafe&apos;s own
          page &mdash; nothing here is invented to fill a paragraph.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-paper/75">
          The Eastern Suburbs span {AREA.streets}. Powai&apos;s lakeside cafes have the longest
          track record here and the highest concentration of laptop-friendly rooms, but the belt
          spreading through Ghatkopar, Chembur and Mulund is filling in fast &mdash; several of
          the highest scorers below sit well outside Powai and rarely show up in the usual
          &ldquo;work from a cafe in Mumbai&rdquo; lists.
        </p>

        <ol className="mt-8 space-y-5">
          {RANKED.map((cafe, i) => {
            const t = tier(cafe.workability);
            return (
              <li key={cafe.slug} className="border-t border-paper/10 pt-5 first:border-t-0 first:pt-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="wa-mono text-paper/65">#{i + 1}</p>
                    <Link href={`/mumbai/${cafe.slug}`} className="group">
                      <h2 className="font-display mt-1 text-[19px] font-medium leading-snug group-hover:underline">
                        {cafe.name}
                      </h2>
                    </Link>
                    <p className="wa-mono mt-1 text-paper/65">{cafe.neighborhood}</p>
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
                {cafe.images[0] && (
                  <div className="relative mt-3 aspect-[16/8] overflow-hidden rounded-lg border border-paper/10">
                    <Image
                      src={cafe.images[0].url}
                      alt={cafe.images[0].alt}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 640px"
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="mt-2.5 text-[14px] leading-relaxed text-paper/65">{writeup(cafe)}</p>
                <p className="wa-mono mt-2 text-paper/65">
                  {cafe.address}
                  {cafe.openingHours ? ` · ${cafe.openingHours}` : ""}
                </p>
                <Link href={`/mumbai/${cafe.slug}`} className="wa-mono mt-1 inline-block py-1.5 text-paper/65 transition-colors hover:text-paper">
                  Full profile and evidence →
                </Link>
              </li>
            );
          })}
        </ol>

        <h2 className="font-display mt-10 text-[20px] font-medium tracking-tight">
          Frequently asked
        </h2>
        <div className="mt-3 space-y-4">
          <div>
            <p className="font-medium text-[14.5px]">What is the best cafe to work from in the Eastern Suburbs?</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-paper/65">
              {RANKED[0].name} on {RANKED[0].neighborhood} currently has Bombay Cafe Map&apos;s
              highest workability score in the Eastern Suburbs ({RANKED[0].workability}/5), based on
              cited evidence about its wifi, seating and noise levels. See its{" "}
              <Link href={`/mumbai/${RANKED[0].slug}`} className="underline hover:text-paper">full profile</Link>.
            </p>
          </div>
          <div>
            <p className="font-medium text-[14.5px]">How many cafes has Bombay Cafe Map scored in the Eastern Suburbs?</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-paper/65">
              {SCORED.length} of the {cafesByArea("eastern-suburbs").length} Eastern Suburbs cafes on
              Bombay Cafe Map have a workability score, based on published evidence rather than
              star ratings alone. Read the{" "}
              <Link href="/about" className="underline hover:text-paper">full methodology</Link>.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-paper/10 bg-paper/[0.03] p-5">
          <p className="text-[14px] leading-relaxed text-paper/65">
            Want the full picture, including Eastern Suburbs cafes that scored lower and why? See{" "}
            <Link href="/mumbai" className="underline hover:text-paper">the interactive map</Link>{" "}
            or read <Link href="/about" className="underline hover:text-paper">how we score</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
