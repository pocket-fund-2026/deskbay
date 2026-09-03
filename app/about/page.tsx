import Link from "next/link";
import type { Metadata } from "next";
import { CAFES, FACTORS } from "@/lib/cafes";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";
const TITLE = "About Bombay Cafe Map's scoring methodology";
const DESCRIPTION =
  "How Bombay Cafe Map scores Mumbai cafes on wifi, power, noise and seating — the nine weighted factors, sourcing rules, and what we will not fake.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${TITLE} · Bombay Cafe Map`,
    description: DESCRIPTION,
    url: `${SITE_URL}/about`,
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · Bombay Cafe Map`,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Bombay Cafe Map", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FACTORS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: `Weighted at ${f.weight}% of the workability score — Bombay Cafe Map's answer to "${f.question}" for each of the ${CAFES.filter((c) => c.workability !== null).length} fully-scored Mumbai cafes, scored from published evidence and left blank where the sources are too thin to average. The rest are listed as directory entries and not yet scored on this model.`,
    },
  })),
};

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="wa-mono -my-2 py-2 text-paper/45 transition-colors hover:text-paper">
              ← Bombay Cafe Map
            </Link>
            <ThemeToggle />
          </div>
          <nav className="wa-mono flex gap-4 text-paper/45">
            <Link href="/mumbai" className="hover:text-paper">The map</Link>
            <Link href="/blog" className="hover:text-paper">Blog</Link>
            <Link href="/submit" className="hover:text-paper">Submit a cafe</Link>
          </nav>
        </div>

        <h1 className="font-display mt-6 text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-tight">
          Find a cafe you can actually work from.
        </h1>

        <p className="mt-4 text-[15px] leading-relaxed text-paper/75">
          That is deliberately narrower than a restaurant rating. A room can serve excellent
          coffee and still be useless with a laptop, and the reverse is true more often than
          anyone admits.
        </p>

        <h2 className="font-display mt-10 text-[24px] font-normal tracking-tight">
          The nine factors
        </h2>
        <p className="mt-2.5 text-[15px] leading-relaxed text-paper/60">
          One weighted model, applied to the {CAFES.filter((c) => c.workability !== null).length}{" "}
          cafes across Mumbai we&apos;ve fully researched so far. It is weighted toward the
          two things that end a work session early — nowhere to plug in and a connection that
          drops — and it treats a bathroom as worth noting and almost nothing else. The other{" "}
          {CAFES.filter((c) => c.workability === null).length} cafes are on the map as directory
          listings — name, address, links — while we work through scoring them the same way.
        </p>
        <p className="mt-2.5 text-[15px] leading-relaxed text-paper/60">
          The scale runs stricter than most star ratings: a &quot;good&quot; wifi mention in one
          review isn&apos;t enough for a 4 here, and a cafe has to clear a higher bar to be called
          excellent at any single factor. A low workability score is not a verdict on the cafe —
          plenty of great cafes are bad places to open a laptop, and that&apos;s the entire
          question this site answers.
        </p>

        <ul className="mt-5 divide-y divide-paper/10 overflow-hidden rounded-xl border border-paper/12">
          {FACTORS.map((f) => (
            <li key={f.key} className="px-4 py-3.5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-medium">{f.label}</span>
                <span className="wa-mono shrink-0 tabular-nums text-paper/55">{f.weight}%</span>
              </div>
              <p className="mt-1 text-[13.5px] leading-snug text-paper-dim text-paper/55">
                {f.question}
              </p>
            </li>
          ))}
        </ul>
        <p className="wa-mono mt-3 text-paper/35">
          The percentages are the weights the code actually applies — this list is generated
          from the same table the score is computed from, so it cannot fall out of date.
        </p>

        <h2 className="font-display mt-10 text-[24px] font-normal tracking-tight">
          Where the factor scores come from
        </h2>
        <p className="mt-2.5 text-[15px] leading-relaxed text-paper/60">
          An unknown factor is left out, not scored zero. Names, addresses, hours and public
          ratings are what the cafe or a credible source publishes, attributed on the panel. A
          public rating is shown next to the workability score, never blended into it: they
          measure different things, and a cafe people love is often a cafe you cannot work in.
        </p>

        <h2 className="font-display mt-10 text-[24px] font-normal tracking-tight">
          What we will not fake
        </h2>
        <p className="mt-2.5 text-[15px] leading-relaxed text-paper/60">
          Every finding is cited. Where the sources are too thin to average a factor, the panel
          says so instead of printing a number.
        </p>

        <h2 className="font-display mt-10 text-[24px] font-normal tracking-tight">
          The scores should get better
        </h2>
        <p className="mt-2.5 text-[15px] leading-relaxed text-paper/60">
          Every cafe panel has a short feedback form — wifi, outlets, noise. It is anonymous and
          takes a few seconds. Reports go into a queue rather than straight onto the score, so a
          handful of votes cannot swing a listing, but enough of them will get it re-rated.
        </p>

        <Link href="/mumbai" className="wa-btn wa-btn--solid mt-10 !bg-paper !text-ink">
          Back to the map
        </Link>
      </div>
    </main>
  );
}
