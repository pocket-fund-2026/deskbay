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
        <nav className="wa-mono hidden items-center gap-6 text-paper/45 sm:flex">
          <Link href="/collections" className="transition-colors hover:text-paper">Lists</Link>
          <Link href="/blog" className="transition-colors hover:text-paper">Blog</Link>
          <Link href="/mumbai" className="flex items-center gap-1.5 transition-colors hover:text-paper">
            Explore Mumbai <span className="text-[13px] leading-none">+</span>
          </Link>
        </nav>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-10">
        <p className="wa-mono mb-4 text-paper/45 sm:hidden">Explore Mumbai</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(Object.values(AREAS)).map((area, i) => {
            const count = cafesByArea(area.slug).length;
            const style = AREA_STYLES[i % AREA_STYLES.length];
            return (
              <Link
                key={area.slug}
                href={`/mumbai?area=${area.slug}`}
                className="wa-fade group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-paper/12 sm:aspect-[16/10] lg:aspect-[4/3]"
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
                <span className="wa-mono absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-paper/15 bg-ink/60 px-2.5 py-1 text-paper/70 backdrop-blur-sm">
                  <PinBadge color={style.pin} size={11} />
                  {count}
                </span>
                <span className="relative z-10 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent p-6">
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

        <div className="mt-10 max-w-2xl">
          <h1 className="text-[15px] font-normal leading-relaxed text-paper/80">
            Mumbai cafes you can actually work from, scored on what decides whether you last
            three hours: somewhere to plug in, somewhere to sit, a connection that holds, and
            whether anyone minds you staying.{" "}
            <span className="text-paper/50">
              {CAFES.filter((c) => c.workability !== null).length} cafes across Mumbai are graded
              on the same {FACTORS.length} weighted factors, from published evidence, with every
              finding cited. Another{" "}
              {CAFES.filter((c) => c.workability === null).length} are
              listed with directory info while we work through scoring them properly.
            </span>
          </h1>
        </div>

        <Reveal className="mt-12">
          <p className="wa-mono mb-4 text-paper/40">Start from what you need today</p>
          <div className="flex flex-wrap gap-2">
            {COLLECTIONS.map((collection) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="wa-mono flex items-center gap-2 rounded-full border border-paper/12 px-3.5 py-2 text-paper/60 transition-colors hover:bg-paper/[0.04] hover:text-paper"
              >
                {collection.name}
                <span className="text-paper/30">{collectionCount(collection)}</span>
              </Link>
            ))}
          </div>
        </Reveal>

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
