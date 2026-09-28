import Link from "next/link";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";
const TITLE = "Glossary";
const DESCRIPTION =
  "Plain-language definitions for the coffee and work-from-cafe terms used across Bombay Cafe Map, from workability score to Irani cafe to third wave coffee.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: `${TITLE} · Bombay Cafe Map`,
    description: DESCRIPTION,
    url: `${SITE_URL}/glossary`,
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

type Term = {
  slug: string;
  term: string;
  definition: string;
  link?: { href: string; label: string };
};

const TERMS: Term[] = [
  {
    slug: "workability-score",
    term: "Workability score",
    definition:
      "Bombay Cafe Map's own rating (0–5) of how good a cafe actually is to sit and work from, built from nine weighted factors led by power and wifi. It is a separate axis from a public star rating: a cafe can be beloved and still score low here if you can't plug in or stay past an hour.",
    link: { href: "/about", label: "See the full methodology" },
  },
  {
    slug: "long-stay",
    term: "Long stay",
    definition:
      "One of the nine workability factors: whether a cafe will let you occupy a table for two or three hours without turning it over, chasing you off after one coffee, or enforcing a minimum spend that makes a work session expensive.",
    link: { href: "/about", label: "See all nine factors" },
  },
  {
    slug: "laptop-friendly-cafe",
    term: "Laptop-friendly cafe",
    definition:
      "A cafe that welcomes people working on a laptop for an extended session, rather than one built purely for quick turnover. In practice this means real outlets, a stable connection, seating at table height, and staff who don't treat a laptop as an imposition.",
  },
  {
    slug: "co-working-cafe",
    term: "Co-working cafe",
    definition:
      "A cafe that functions as an informal, unbooked alternative to a paid co-working space: dependable wifi and power for a full working day, without a membership. Distinct from a dedicated co-working space, which sells desks rather than coffee.",
  },
  {
    slug: "digital-nomad-cafe",
    term: "Digital nomad cafe",
    definition:
      "A cafe that attracts a regular crowd of remote workers and freelancers rather than mainly social or dine-in customers — usually identifiable by a cluster of laptops, a quieter volume than a typical cafe, and staff used to long single-person occupancy.",
  },
  {
    slug: "focus-noise-level",
    term: "Focus / noise level",
    definition:
      "One of the nine workability factors: whether the ambient volume, music, and layout let you actually concentrate, as opposed to a cafe that's merely quiet on a decibel meter but has music, a espresso machine, or foot traffic that breaks concentration.",
    link: { href: "/about", label: "See all nine factors" },
  },
  {
    slug: "calls-friendly",
    term: "Calls-friendly",
    definition:
      "Whether a cafe lets you take a video or voice call without annoying nearby tables or losing the call to background noise. Weighted lightly in the workability score, since it matters for some work sessions and not others.",
  },
  {
    slug: "peak-hours",
    term: "Peak hours",
    definition:
      "The stretch of the day a cafe is busiest and least reliable for a work session — typically weekend brunch hours or the post-lunch coffee rush on weekdays. The same cafe can be excellent to work from at 11am and unusable at 1pm.",
  },
  {
    slug: "third-wave-coffee",
    term: "Third wave coffee",
    definition:
      "The current era of coffee culture that treats coffee as an artisanal product rather than a commodity: traceable single-origin beans, lighter roasts, and brewing methods (pour-over, AeroPress) chosen to show off a specific bean's character rather than mask it with milk and sugar.",
  },
  {
    slug: "specialty-coffee",
    term: "Specialty coffee",
    definition:
      "Coffee graded above a quality threshold (typically 80+ on the Specialty Coffee Association's 100-point scale) at every stage from growing to roasting to brewing. Most of Mumbai's newer independent roasters position themselves as specialty coffee, as distinct from commodity-grade beans used in mass-market chains.",
  },
  {
    slug: "single-origin",
    term: "Single-origin coffee",
    definition:
      "Coffee sourced from one farm, estate, or defined growing region rather than blended from multiple sources. Roasters use it to highlight the specific flavor profile of that origin, and it's usually priced and marketed as a step above a house blend.",
  },
  {
    slug: "pour-over",
    term: "Pour-over",
    definition:
      "A manual brewing method where hot water is poured over ground coffee in a filter by hand, giving more control over extraction than an automatic drip machine. Common on the menu at specialty cafes and usually the slowest, most deliberate coffee option available.",
  },
  {
    slug: "flat-white",
    term: "Flat white",
    definition:
      "An espresso drink with a higher ratio of coffee to steamed milk than a latte, served in a smaller cup with a thin layer of microfoam. Became a default order at Mumbai's specialty cafes as the third wave scene grew through the 2020s.",
  },
  {
    slug: "roastery",
    term: "Roastery",
    definition:
      "A business that roasts green coffee beans itself, as opposed to a cafe that buys pre-roasted beans from someone else. Several of Mumbai's better work-friendly cafes are attached to or supplied by their own roastery, which tends to correlate with fresher beans and more staff knowledge of the coffee.",
  },
  {
    slug: "irani-cafe",
    term: "Irani cafe",
    definition:
      "A style of cafe unique to Mumbai and Pune, opened by Zoroastrian immigrants from Iran from the late 19th century onward: high ceilings, marble-topped tables, bentwood chairs, and a menu built around bun maska and Irani chai rather than espresso. A handful of the originals are still running in South Bombay and remain some of the city's most characterful places to sit with a laptop, even though they predate the concept by a century.",
  },
  {
    slug: "filter-coffee",
    term: "Filter coffee",
    definition:
      "South Indian decoction coffee, brewed strong and served with hot milk in a steel tumbler and dabara. Common on the menu at both Udupi restaurants and newer specialty cafes across Mumbai, and worth knowing as distinct from an espresso-based filter/drip coffee elsewhere.",
  },
  {
    slug: "wifi-speed",
    term: "Wifi speed (for work)",
    definition:
      "The practical bar for a cafe's wifi to support a work session isn't a headline speed test number but whether it holds up under real conditions: a video call without freezing, a file upload that doesn't time out, and no drop when the cafe fills up. Bombay Cafe Map scores this from reported real-use evidence rather than a single speed test, since wifi that's fast at 10am can fail at capacity by noon.",
    link: { href: "/about", label: "See how wifi is scored" },
  },
  {
    slug: "power-outlet-density",
    term: "Power outlet density",
    definition:
      "How many tables in a cafe actually have an accessible outlet within reach, as opposed to two sockets behind the counter that only the first arrivals get. The single heaviest-weighted factor in the workability score, since a dead laptop ends a work session regardless of how good everything else is.",
    link: { href: "/about", label: "See how power is scored" },
  },
  {
    slug: "workation",
    term: "Workation",
    definition:
      "Combining remote work with travel or leisure — working from a cafe or hotel in a city you're visiting rather than a home office. Mumbai's specialty cafe scene has grown partly on this demand, from both domestic remote workers and visiting digital nomads.",
  },
];

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Bombay Cafe Map", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Glossary", item: `${SITE_URL}/glossary` },
  ],
};

const definedTermSetLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Bombay Cafe Map Glossary",
  description: DESCRIPTION,
  url: `${SITE_URL}/glossary`,
  hasDefinedTerm: TERMS.map((t) => ({
    "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
    url: `${SITE_URL}/glossary#${t.slug}`,
    inDefinedTermSet: `${SITE_URL}/glossary`,
  })),
};

export default function GlossaryPage() {
  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetLd) }} />
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="wa-mono -my-2 py-2 text-paper/65 transition-colors hover:text-paper">
            ← Bombay Cafe Map
          </Link>
          <ThemeToggle />
        </div>

        <h1 className="font-display mt-6 text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-tight">
          Glossary
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-paper/75">
          The coffee and work-from-cafe terms used across this site, defined plainly. Some are
          general coffee-culture terms, some are Mumbai-specific, and a few &mdash; like
          workability score &mdash; are ours.
        </p>

        <nav aria-label="Jump to term" className="wa-mono mt-6 flex flex-wrap gap-x-3 gap-y-2 text-paper/65">
          {TERMS.map((t) => (
            <a key={t.slug} href={`#${t.slug}`} className="hover:text-paper">
              {t.term}
            </a>
          ))}
        </nav>

        <dl className="mt-8 divide-y divide-paper/10 border-t border-paper/10">
          {TERMS.map((t) => (
            <div key={t.slug} id={t.slug} className="scroll-mt-6 py-5">
              <dt className="font-display text-[17px] font-medium">{t.term}</dt>
              <dd className="mt-2 text-[14.5px] leading-relaxed text-paper/65">
                {t.definition}
                {t.link && (
                  <>
                    {" "}
                    <Link href={t.link.href} className="underline hover:text-paper">
                      {t.link.label}
                    </Link>
                    .
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 rounded-xl border border-paper/10 bg-paper/[0.03] p-5">
          <p className="text-[14px] leading-relaxed text-paper/65">
            Want to see these terms applied to real cafes? Browse{" "}
            <Link href="/mumbai" className="underline hover:text-paper">the interactive map</Link>{" "}
            or read <Link href="/about" className="underline hover:text-paper">how we score</Link>.
          </p>
        </div>

        <Link href="/mumbai" className="wa-btn wa-btn--solid mt-8 !bg-paper !text-ink">
          Back to the map
        </Link>
      </div>
    </main>
  );
}
