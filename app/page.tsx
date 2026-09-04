import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AREAS, CAFES, FACTORS, cafesByArea } from "@/lib/cafes";
import { tier } from "@/lib/scoreTier";
import Skyline, { type SkylineVariant } from "@/components/Skyline";
import PinBadge from "@/components/PinBadge";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { COLLECTIONS, collectionCount } from "@/lib/collections";
import Reveal from "@/components/Reveal";
import areaPhotos from "@/data/areaPhotos.json";
import ThemeToggle from "@/components/ThemeToggle";

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

const LANDMARKS = ["cafe-mondegar-colaba", "leopold-cafe-bar-colaba", "yazdani-bakery-fort"]
  .map((slug) => CAFES.find((c) => c.slug === slug))
  .filter((c): c is NonNullable<typeof c> => Boolean(c));

export const metadata: Metadata = {
  title: "Bombay Cafe Map — find a Mumbai cafe you can actually work from",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className="wa-grid flex min-h-dvh flex-col bg-ink text-paper">
      <header className="wa-rise relative z-10 flex items-baseline justify-between gap-4 px-6 pt-7 sm:px-10">
        <div className="flex items-center gap-2 font-display text-[clamp(1.5rem,3.4vw,2rem)] leading-none tracking-tight">
          <Logo size={26} />
          Bombay Cafe <em className="font-semibold not-italic italic">Map</em>
        </div>
        <div className="flex items-center gap-4">
          <nav className="wa-mono hidden items-center gap-6 text-paper/45 sm:flex">
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
        {/* The proposition used to sit below all nine area cards — roughly
            3,400px down on a phone. Someone landing here has to be told what
            this is before they are asked to pick a neighbourhood. */}
        <div className="max-w-2xl">
          <h1 className="font-display text-[clamp(1.6rem,4.6vw,2.6rem)] font-medium leading-[1.15] tracking-tight">
            Mumbai cafes you can{" "}
            <em className="not-italic text-accent">actually</em> work from.
          </h1>
          <p className="mt-4 text-[15.5px] leading-relaxed text-paper/70">
            Scored on what decides whether you last three hours: somewhere to plug in,
            somewhere to sit, a connection that holds, and whether anyone minds you staying.
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-paper/50">
            {CAFES.filter((c) => c.workability !== null).length} cafes graded on the same{" "}
            {FACTORS.length} weighted factors, from published evidence, with every finding
            cited. Another {CAFES.filter((c) => c.workability === null).length} are listed
            with directory info while we work through scoring them properly.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Link href="/mumbai" className="wa-btn wa-btn--solid !bg-paper !text-ink">
              Open the map
            </Link>
            <Link href="/collections" className="wa-btn">
              Best-of lists
            </Link>
            <Link href="/about" className="wa-btn">
              How we score
            </Link>
          </div>
        </div>

        {/* Straight after the pitch, because "where can I plug in" is the
            question people actually arrive with — not "which suburb". */}
        <div className="mt-10">
          <p className="wa-mono mb-3 text-paper/40">Start from what you need today</p>
          <div className="flex flex-wrap gap-2.5">
            {COLLECTIONS.map((collection) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="group flex items-center gap-2.5 rounded-full border border-paper/18 bg-paper/[0.03] py-2 pl-4 pr-2 text-[14px] font-medium text-paper/85 transition-colors hover:border-accent/50 hover:bg-accent/[0.08] hover:text-paper"
              >
                {collection.name}
                <span className="wa-mono rounded-full bg-paper/10 px-2 py-0.5 text-[11px] text-paper/55 transition-colors group-hover:bg-accent/25 group-hover:text-paper">
                  {collectionCount(collection)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <p className="wa-mono mb-4 mt-12 text-paper/40">Explore by area</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(Object.values(AREAS)).map((area, i) => {
            const count = cafesByArea(area.slug).length;
            const style = AREA_STYLES[i % AREA_STYLES.length];
            return (
              <Link
                key={area.slug}
                href={`/mumbai?area=${area.slug}`}
                className="wa-fade group relative flex min-h-[210px] flex-col justify-end overflow-hidden rounded-2xl border border-paper/12 sm:min-h-0 sm:aspect-[16/10] lg:aspect-[4/3]"
                style={{ animationDelay: `${i * 90}ms` }}
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
                  {count}
                </span>
                <span className="relative z-10 bg-gradient-to-t from-ink via-ink/90 to-transparent p-6 pt-14">
                  <span className="font-display block text-xl font-medium tracking-tight sm:text-2xl">
                    {area.name}
                  </span>
                  <span className="mt-2 block max-w-md text-[14px] leading-relaxed text-paper/70">
                    {area.description}
                  </span>
                  <span className="wa-mono mt-3 block text-paper/45">{area.streets}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <Reveal className="mt-12">
          <p className="wa-mono mb-4 text-paper/40">A few we&apos;d actually go back to</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {EDITOR_PICKS.map((cafe) => {
              const t = tier(cafe.workability);
              return (
                <Link
                  key={cafe.slug}
                  href={`/mumbai?area=${cafe.area}`}
                  className="rounded-xl border border-paper/12 p-4 transition-colors hover:bg-paper/[0.04]"
                >
                  <div className="flex items-center gap-2">
                    <PinBadge color={t.color} />
                    <p className="font-display text-[15px] font-medium leading-snug">{cafe.name}</p>
                  </div>
                  <p className="wa-mono mt-1.5 text-paper/40">{cafe.neighborhood}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-paper/60">
                    {cafe.whyWeRecommend}
                  </p>
                </Link>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="mt-12 pb-4" delay={100}>
          <p className="wa-mono mb-4 text-paper/40">Mumbai institutions worth seeing (not for laptops)</p>
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
                  <p className="wa-mono mt-1 text-paper/40">{cafe.neighborhood}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-paper/60">{cafe.editorialNote}</p>
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
