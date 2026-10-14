import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CAFES } from "@/lib/cafes";
import { getPost } from "@/lib/blog";
import CoffeeHero from "@/components/CoffeeHero";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";
const SLUG = "best-cafes-with-wifi-in-mumbai";

// DRAFT GUARD: until this post is registered in lib/blog.ts it is not in the
// index or sitemap, and this route 404s instead of serving unlisted.
const post = getPost(SLUG);

export function generateMetadata(): Metadata {
  if (!post) return {};
  return {
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
}

const bySlug = (slug: string) => CAFES.find((c) => c.slug === slug)!;
const KOKOMO = bySlug("cafe-kokomo-santacruz-east");
const THIRD_WAVE = bySlug("third-wave-coffee-juhu-juhu");
const BLUE_TOKAI = bySlug("blue-tokai-seven-bungalows");
const BCH = bySlug("bombay-coffee-house-waterfield-road");
const SBUX_NP = bySlug("starbucks-nariman-point");
const SBUX_COLABA = bySlug("starbucks-colaba");
const SUBKO = bySlug("subko-coffee-mary-lodge-chapel-road");
const YAZDANI = bySlug("yazdani-bakery-fort");

const QUICK_ANSWER =
  "Cafe Kokomo in Santacruz East is the one cafe here whose own website lists wifi, plug points and an afternoon table to work from. Starbucks, Blue Tokai and Third Wave are the chains most often cited for wifi, on weaker evidence. No venue publishes a speed we could verify, so test it before an important call.";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Which Mumbai cafes have wifi you can work on?",
    a: "Cafe Kokomo in Santacruz East lists wifi and plug points on its own website. Bombay Coffee House on Waterfield Road is tagged with free Wi-Fi on district.in. Wikipedia's Tata Starbucks entry says free wifi is offered at Starbucks stores, which would include outlets such as Nariman Point and Colaba, but we have not tested individual outlets. An undated LBB roundup speaks well of the wifi at Blue Tokai and Third Wave.",
  },
  {
    q: "Do Mumbai cafes publish their wifi speed?",
    a: "Not in the sources we checked. No venue publishes a measured speed we could verify, so this post quotes no Mbps figures. Treat any specific speed claimed for a cafe as unverified unless it names a test.",
  },
  {
    q: "Is wifi enough to decide where to work from in Mumbai?",
    a: "No. Wifi says nothing about plug points, seating or whether you can stay for hours. Bombay Cafe Map's workability score uses nine weighted factors, with power at 22 percent and wifi at 20 percent, and each cafe page shows the evidence behind its scores.",
  },
];

const articleLd = post && {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.description,
  image: `${SITE_URL}/opengraph-image`,
  datePublished: post.date,
  dateModified: post.lastUpdated ?? post.date,
  author: { "@type": "Organization", name: "Bombay Cafe Map" },
  publisher: { "@type": "Organization", name: "Bombay Cafe Map", url: SITE_URL },
  mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
};

const breadcrumbLd = post && {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Bombay Cafe Map", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const LBB = "https://lbb.in/mumbai/best-work-friendly-cafes-mumbai";
const ROWS = [
  { cafe: KOKOMO, claim: "Lists wifi, plug points and a quiet table through the afternoon; answers yes to working there", who: "The cafe's own website (cafekokomo.com)", ext: "https://www.cafekokomo.com/" },
  { cafe: BCH, claim: "Tagged with free Wi-Fi; a reviewer calls it a chill place to work or study", who: "district.in listing", ext: "https://www.district.in/dining/mumbai/bombay-coffee-house-linking-road-bandra-west" },
  { cafe: SBUX_NP, claim: "Free wifi at Starbucks stores", who: "Wikipedia, Tata Starbucks (chain-wide)", ext: "https://en.wikipedia.org/wiki/Tata_Starbucks" },
  { cafe: BLUE_TOKAI, claim: "LBB says high-speed wifi and long stays are fine", who: "LBB roundup (undated, chain-wide)", ext: LBB },
  { cafe: THIRD_WAVE, claim: "LBB calls the wifi reliable, with no pressure to leave", who: "LBB roundup (undated, chain-wide)", ext: LBB },
];

function CafeLink({ c, children }: { c: (typeof CAFES)[number]; children?: React.ReactNode }) {
  return (
    <Link href={`/mumbai/${c.slug}`} className="underline hover:text-paper">
      {children ?? c.name}
    </Link>
  );
}

const h2 = "font-display mt-7 text-[20px] font-medium tracking-tight";
const lead = "mt-2 text-[15px] leading-relaxed text-paper/75";
const body = "mt-3 text-[14.5px] leading-relaxed text-paper/70";

export default function Post() {
  if (!post) notFound();
  return (
    <main className="min-h-dvh bg-ink px-6 py-6 text-paper sm:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
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
          {post.lastUpdated && post.lastUpdated !== post.date && <> · Updated {post.lastUpdated}</>}
        </p>
        <h1 className="font-display mt-1.5 text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-tight">
          {post.title}
        </h1>

        <div className="mt-4 max-h-36 overflow-hidden rounded-2xl [&>div]:aspect-[16/4]">
          <CoffeeHero />
        </div>

        <div className="mt-4 rounded-xl border border-paper/10 bg-paper/[0.03] p-5">
          <p className="wa-mono mb-2 text-paper/65">Quick answer</p>
          <p className="text-[14.5px] leading-relaxed text-paper/80">{QUICK_ANSWER}</p>
        </div>

        <p className="mt-4 text-[15px] leading-relaxed text-paper/75">
          Searches for cafes with wifi are common, and cafes usually claim a yes. This post names who
          makes each claim, so you can judge how far to trust it. If you want the broader pick, with
          power, seating and noise weighed in, start with our{" "}
          <Link href="/blog/15-best-cafes-to-work-from-in-mumbai" className="underline hover:text-paper">
            15 best cafes to work from in Mumbai
          </Link>
          . Where a venue&apos;s own site or a named publication says nothing about wifi, it is left out
          rather than assumed.
        </p>

        <h2 className={h2}>Which Mumbai cafes have wifi that is sourced?</h2>
        <p className={lead}>
          Five venues and chains have a wifi claim we could trace to a named source, and only one,
          Cafe Kokomo, makes it on its own website. The rest rely on a listing site, Wikipedia or an
          undated roundup, which is weaker evidence.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-[13px] leading-snug">
            <caption className="sr-only">Wifi claims for Mumbai cafes and who makes each claim</caption>
            <thead>
              <tr className="wa-mono border-b border-paper/15 text-paper/65">
                <th scope="col" className="py-2 pr-3 font-normal">Cafe</th>
                <th scope="col" className="py-2 pr-3 font-normal">What is claimed</th>
                <th scope="col" className="py-2 font-normal">Source</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.cafe.slug} className="border-b border-paper/10 align-top text-paper/75">
                  <td className="py-2 pr-3">
                    <CafeLink c={r.cafe} />
                    <span className="wa-mono block text-paper/55">{r.cafe.neighborhood}</span>
                  </td>
                  <td className="py-2 pr-3">{r.claim}</td>
                  <td className="py-2">
                    <a href={r.ext} rel="noopener" className="underline hover:text-paper">{r.who}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-paper/55">
          Sources read 2026-10-14. Pages change, so we plan to re-check these claims each quarter;
          treat anything older than that as due for a fresh look.
        </p>

        <h2 className={h2}>Which single cafe backs its wifi claim best?</h2>
        <p className={lead}>
          <CafeLink c={KOKOMO} /> in Santacruz East, because the claim comes from the cafe itself and
          is specific.
        </p>
        <p className={body}>
          Its website lists &ldquo;Wi-Fi, plug points and a quiet table through the afternoon&rdquo; under
          &ldquo;Work or catch up&rdquo;, and its FAQ answers &ldquo;Yes&rdquo; to working from the cafe
          (read 2026-10-14). Daily hours are 11am to 11pm, at 4, Pratap CHS, Shivaji Road, near Vakola
          Bridge. Our workability score for it is {KOKOMO.workability}/5. That is a venue&apos;s
          promise, not a speed test: it tells you wifi exists and is meant for work, not how fast it is.
          It is one of the cafes in our{" "}
          <Link href="/blog/best-cafes-to-work-from-in-andheri-juhu" className="underline hover:text-paper">
            ranking of Andheri and Juhu cafes
          </Link>.
        </p>

        <h2 className={h2}>Which chains are most often cited for wifi?</h2>
        <p className={lead}>
          Starbucks has the most widely stated claim: Wikipedia&apos;s Tata Starbucks entry says free wifi
          is offered at its stores. LBB&apos;s roundup mentions Blue Tokai and Third Wave wifi favourably,
          but that roundup is undated.
        </p>
        <p className={body}>
          The Starbucks claim would include outlets such as <CafeLink c={SBUX_NP} /> and{" "}
          <CafeLink c={SBUX_COLABA} />, though we have not tested individual outlets. Starbucks India&apos;s
          own wireless-internet help page, which we could only read as a search snippet, says free access
          is offered in stores that display Free Wi-Fi signs, so check for the sign. For Blue Tokai, LBB
          says all outlets provide high-speed WiFi; the Blue Tokai outlet we list is{" "}
          <CafeLink c={BLUE_TOKAI} />. For Third Wave, LBB says &ldquo;the wifi is reliable, and there&apos;s no
          pressure to leave&rdquo;, and district.in tags its Chowpatty outlet &ldquo;Good Wifi&rdquo;. The
          brand&apos;s own Juhu store page, which we link as <CafeLink c={THIRD_WAVE} />, lists only dining,
          takeaway and delivery and says nothing about wifi, so treat Third Wave as likely, not confirmed.
        </p>

        <h2 className={h2}>Is a wifi mention enough to work from a cafe?</h2>
        <p className={lead}>
          No. Wifi tells you nothing about plug points, noise, or whether you can keep a table for
          three hours, and the cafes that look best on wifi alone are not always the best to work from.
        </p>
        <p className={body}>
          <CafeLink c={SUBKO} /> is a favourite with laptop users, and its laptopfriendlycafe.com listing
          calls it good for working on a laptop &ldquo;without feeling rushed&rdquo;. That listing does not
          mention wifi, though, and our cafe page records reviewers describing limited seating, around
          eight to ten tables, which is part of why we score it {SUBKO.workability}/5. Our scoring uses nine
          weighted factors, with power at 22 percent and wifi at 20 percent, so a strong wifi claim alone
          cannot carry a cafe. Read the{" "}
          <Link href="/about" className="underline hover:text-paper">scoring method</Link> for the full
          list.
        </p>

        <h2 className={h2}>Places to skip for a work session</h2>
        <p className={lead}>
          Skip places built for a quick stop. <CafeLink c={YAZDANI} /> in Fort is the clearest case:
          Wikipedia describes it as a takeaway establishment with sit-down service closed as of 2023.
        </p>
        <p className={body}>
          That is a seating fact from Wikipedia. Separately, reviewers quoted on our Yazdani page say not
          to expect wifi or air-conditioning there, so treat it as a place to buy and leave.
        </p>

        <h2 className={h2}>Wifi questions answered</h2>
        <p className={lead}>
          Ask at the counter, then run a speed test before you open your first call.
        </p>
        <p className={body}>
          Ask whether wifi is free, whether there is a password, and whether it has a time or data
          limit; terms can differ by outlet, and the counter is the only reliable place to find out. Then
          test it on your own phone or laptop while your first coffee arrives, and keep mobile data as a
          fallback. Every cafe page on the{" "}
          <Link href="/mumbai" className="underline hover:text-paper">map</Link> shows the wifi evidence we hold
          for it, and our{" "}
          <Link href="/blog/best-cafes-to-work-from-in-south-bombay" className="underline hover:text-paper">
            South Bombay cafe ranking
          </Link>{" "}
          covers the south side of the city.
        </p>

        <h2 className={h2}>Frequently asked</h2>
        <div className="mt-3 space-y-4">
          {FAQS.map((f) => (
            <div key={f.q}>
              <h3 className="font-medium text-[14.5px]">{f.q}</h3>
              <p className="mt-1 text-[13.5px] leading-relaxed text-paper/65">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-paper/10 bg-paper/[0.03] p-5">
          <p className="text-[14px] leading-relaxed text-paper/65">
            Spotted a wifi claim that is wrong, or a cafe we should check?{" "}
            <Link href="/submit" className="underline hover:text-paper">Report a wifi claim</Link>, or read{" "}
            <Link href="/about" className="underline hover:text-paper">how we score</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
