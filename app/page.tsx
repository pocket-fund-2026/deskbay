import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AREAS, CAFES, FACTORS, cafesByArea } from "@/lib/cafes";
import { tier } from "@/lib/scoreTier";
import Skyline, { type SkylineVariant } from "@/components/Skyline";
import PinBadge from "@/components/PinBadge";
import Logo, { Wordmark } from "@/components/Logo";
import Footer from "@/components/Footer";
import { COLLECTIONS, collectionCount } from "@/lib/collections";
import Reveal from "@/components/Reveal";
import areaPhotos from "@/data/areaPhotos.json";
import ThemeToggle from "@/components/ThemeToggle";
import { TiltCard } from "@/components/TiltCard";
import NumberPop from "@/components/NumberPop";
import StaggerLines from "@/components/StaggerLines";

type AreaPhoto = { url: string; alt: string };
const AREA_PHOTOS = areaPhotos as Record<string, AreaPhoto>;

const AREA_STYLES: { variant: SkylineVariant; pin: string }[] = [
  { variant: "warm", pin: "#d97b3f" },
  { variant: "stone", pin: "#7fa8b0" },
  { variant: "teal", pin: "#5fb0ac" },
  { variant: "moss", pin: "#8fae5c" },
  { variant: "plum", pin: "#b581ae" },
  { variant: "slate", pin: "#7d8fd6" },
  { variant: "amber", pin: "#d9a03f" },
  { variant: "rust", pin: "#c66b4a" },
  { variant: "ocean", pin: "#5a9aa8" },
];

const EDITOR_PICKS = [
  "bombay-coffee-house-waterfield-road",
  "kala-ghoda-cafe-kala-ghoda",
  "araku-coffee-apollo-bunder",
]
  .map((slug) => CAFES.find((c) => c.slug === slug))
  .filter((c): c is NonNullable<typeof c> => Boolean(c));

const SCORED = CAFES.filter((c) => c.workability !== null).length;
const UNSCORED = CAFES.length - SCORED;

const LANDMARKS = ["cafe-mondegar-colaba", "leopold-cafe-bar-colaba", "yazdani-bakery-fort"]
  .map((slug) => CAFES.find((c) => c.slug === slug))
  .filter((c): c is NonNullable<typeof c> => Boolean(c));

export const metadata: Metadata = {
  // The root layout's title.template only applies to child segments, not to
  // a page in the same segment, so the homepage carries the brand itself.
  title: "Bombay Cafe Map: Mumbai cafes you can actually work from",
  description: `${SCORED} Mumbai cafes scored on plug points, wifi, noise and seating, so you know which ones will let you sit for three hours. Every finding cited.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className="wa-grid flex min-h-dvh flex-col bg-ink text-paper">
      <header className="wa-rise sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-paper/10 bg-ink/80 px-6 py-4 backdrop-blur-md sm:px-10">
        <div className="flex items-center gap-2 font-display text-[clamp(1.5rem,3.4vw,2rem)] leading-none tracking-tight">
          <Logo size={26} />
          <Wordmark />
        </div>
        <div className="flex items-center gap-4">
          <nav className="wa-mono hidden items-center gap-6 text-paper/65 sm:flex">
            <Link href="/collections" className="-my-2 py-2 transition-colors hover:text-paper">Lists</Link>
            <Link href="/blog" className="-my-2 py-2 transition-colors hover:text-paper">Blog</Link>
            <Link href="/mumbai" className="-my-2 flex items-center gap-1.5 py-2 transition-colors hover:text-paper">
              Explore Mumbai <span className="text-[13px] leading-none">+</span>
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-10">
        {/* The proposition used to sit below all nine area cards, roughly
            3,400px down on a phone. Someone landing here has to be told what
            this is before they are asked to pick a neighbourhood, and it
            holds the page better centred than ranged left against nothing. */}
        <div className="grid items-center gap-10 py-6 lg:grid-cols-[1.25fr_1fr] lg:py-12">
          <div>
            <p className="wa-mono text-accent-text">Mumbai · scored on evidence</p>
            <h1 className="font-display mt-4 text-[clamp(2rem,5vw,3.3rem)] font-medium leading-[1.05] tracking-tight">
              <StaggerLines
                lines={[
                  "Mumbai cafes you can",
                  <span key="a"><em className="not-italic text-accent-text">actually</em> work from.</span>,
                ]}
              />
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-paper/70">
              Somewhere to plug in, somewhere to sit, a connection that holds, and nobody minding
              that you stay. Every cafe graded on {FACTORS.length} weighted factors, every finding cited.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link href="/mumbai" className="wa-btn wa-btn--solid !bg-paper !text-ink">Open the map</Link>
              <Link href="/collections" className="wa-btn">Best-of lists</Link>
              <Link href="/about" className="wa-btn">How we score</Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              { n: SCORED, l: "cafes scored" },
              { n: UNSCORED, l: "listed, scoring in progress" },
              { n: Object.keys(AREAS).length, l: "areas, Bandra to Navi Mumbai" },
              { n: FACTORS.length, l: "weighted factors per cafe" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-paper/12 bg-paper/[0.03] p-5">
                <dt className="sr-only">{s.l}</dt>
                <dd>
                  <span className="font-display block text-[clamp(2rem,4vw,2.8rem)] font-medium leading-none tracking-tight">
                    <NumberPop value={s.n} />
                  </span>
                  <span className="wa-mono mt-2 block text-paper/65">{s.l}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Straight after the pitch, because "where can I plug in" is the
            question people actually arrive with, not "which suburb". */}
        <div className="mt-12">
          <p className="wa-mono mb-4 text-paper/65">Start from what you need today</p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {COLLECTIONS.map((collection, i) => (
              <Reveal key={collection.slug} delay={Math.min(i, 5) * 60} className={`h-full ${i === COLLECTIONS.length - 1 ? "max-lg:[&:nth-child(odd)]:col-span-2 lg:[&:nth-child(4n+3)]:col-span-2" : ""}`}>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="group flex h-full flex-col justify-between rounded-xl border border-paper/12 bg-paper/[0.02] p-4 transition-[transform,border-color,background-color] duration-300 [transition-timing-function:var(--wa-spring)] hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/[0.07]"
                >
                  <span className="text-[14.5px] font-medium leading-snug">{collection.question}</span>
                  <span className="mt-4 flex items-baseline justify-between gap-2">
                    <span className="wa-mono text-paper/65">{collection.name}</span>
                    <span className="font-display text-2xl leading-none text-accent-text"><NumberPop value={collectionCount(collection)} /></span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <p className="wa-mono mb-4 mt-12 text-paper/65">Explore by area</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(Object.values(AREAS)).map((area, i) => {
            const areaCafes = cafesByArea(area.slug);
            const count = areaCafes.length;
            const scoredCount = areaCafes.filter((c) => c.workability !== null).length;
            const style = AREA_STYLES[i % AREA_STYLES.length];
            return (
              <TiltCard key={area.slug} className="!overflow-visible !rounded-2xl">
              <Link
                href={`/mumbai?area=${area.slug}`}
                className="wa-fade wa-area-card group relative flex min-h-[210px] flex-col justify-end overflow-hidden rounded-2xl border border-paper/12 transition-[transform,box-shadow,border-color] duration-300 [transition-timing-function:var(--wa-spring)] hover:-translate-y-1 sm:min-h-0 sm:aspect-[16/10] lg:aspect-[4/3]"
                style={{
                  animationDelay: `${i * 90}ms`,
                  // The lift on hover uses each area's own pin color for its
                  // shadow (applied by the .wa-area-card:hover rule in
                  // globals.css) rather than a generic dark drop-shadow — the
                  // same color-per-area coding the pins and score dots
                  // already use elsewhere, so the hover state ties back to
                  // something the reader has already learned to read.
                  ["--area-glow" as string]: `${style.pin}55`,
                }}
              >
                <span className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]">
                  {AREA_PHOTOS[area.slug] ? (
                    <Image
                      src={AREA_PHOTOS[area.slug].url}
                      alt={AREA_PHOTOS[area.slug].alt}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <Skyline variant={style.variant} />
                  )}
                </span>
                <span className="wa-mono absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-paper/15 bg-ink/85 px-2.5 py-1 text-paper/80 backdrop-blur-sm">
                  <PinBadge color={style.pin} size={11} />
                  {scoredCount === count ? count : `${scoredCount}/${count} scored`}
                </span>
                <span className="relative z-10 bg-gradient-to-t from-ink via-ink/90 to-transparent p-6 pt-14">
                  <span className="font-display block text-xl font-medium tracking-tight sm:text-2xl">
                    {area.name}
                  </span>
                  <span className="mt-2 line-clamp-2 block max-w-md text-[14px] leading-relaxed text-paper/70">
                    {area.description}
                  </span>
                  <span className="wa-mono mt-3 block text-paper/65">{area.streets}</span>
                </span>
              </Link>
              </TiltCard>
            );
          })}
        </div>

        <Reveal className="mt-12">
          <p className="wa-mono mb-4 text-paper/65">A few we&apos;d actually go back to</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {EDITOR_PICKS.map((cafe) => {
              const t = tier(cafe.workability);
              return (
                <Link
                  key={cafe.slug}
                  href={`/mumbai?area=${cafe.area}`}
                  className="block rounded-xl border border-paper/12 p-4 transition-[transform,background-color] duration-300 [transition-timing-function:var(--wa-spring)] hover:-translate-y-0.5 hover:bg-paper/[0.04]"
                >
                  <div className="flex items-center gap-2">
                    <PinBadge color={t.color} />
                    <p className="font-display text-[15px] font-medium leading-snug">{cafe.name}</p>
                    {cafe.workability !== null && (
                      <span className="wa-mono ml-auto rounded-full px-2 py-0.5 text-ink" style={{ background: t.color }}>{cafe.workability.toFixed(1)}</span>
                    )}
                  </div>
                  <p className="wa-mono mt-1.5 text-paper/65">{cafe.neighborhood}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-paper/65">
                    {cafe.whyWeRecommend}
                  </p>
                </Link>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="mt-12 pb-4" delay={100}>
          <p className="wa-mono mb-4 text-paper/65">Mumbai institutions worth seeing (not for laptops)</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {LANDMARKS.map((cafe) => (
              <Link
                key={cafe.slug}
                href={`/mumbai/${cafe.slug}`}
                className="group overflow-hidden rounded-xl border border-paper/12 transition-colors hover:bg-paper/[0.04]"
              >
                {cafe.images[0] && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={cafe.images[0].url}
                      alt={cafe.images[0].alt}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="font-display text-[15px] font-medium leading-snug">{cafe.name}</p>
                  <p className="wa-mono mt-1 text-paper/65">{cafe.neighborhood}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-paper/65">{cafe.editorialNote}</p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>

      <Footer />
    </main>
  );
}
