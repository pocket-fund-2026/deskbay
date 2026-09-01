import Link from "next/link";
import type { Metadata } from "next";
import { AREAS, CAFES, FACTORS } from "@/lib/cafes";
import Skyline from "@/components/Skyline";

const EDITOR_PICKS = [
  "bombay-coffee-house-waterfield-road",
  "kala-ghoda-cafe-kala-ghoda",
  "araku-coffee-apollo-bunder",
]
  .map((slug) => CAFES.find((c) => c.slug === slug))
  .filter((c): c is NonNullable<typeof c> => Boolean(c));

export const metadata: Metadata = {
  title: "Deskbay — find a Mumbai cafe you can actually work from",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className="wa-grid flex min-h-dvh flex-col bg-ink text-paper">
      <header className="wa-rise relative z-10 flex items-baseline justify-between gap-4 px-6 pt-7 sm:px-10">
        <div className="font-display text-[clamp(1.5rem,3.4vw,2rem)] leading-none tracking-tight">
          desk<em className="font-semibold not-italic italic">bay</em>
        </div>
        <Link
          className="wa-mono hidden items-center gap-1.5 text-paper/45 transition-colors hover:text-paper sm:flex"
          href="/mumbai"
        >
          Explore Mumbai <span className="text-[13px] leading-none">+</span>
        </Link>
      </header>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-10 sm:px-10">
        <p className="wa-mono mb-4 text-paper/45 sm:hidden">Explore Mumbai</p>
        <div className="grid gap-4 md:grid-cols-2">
          {(Object.values(AREAS)).map((area, i) => (
            <Link
              key={area.slug}
              href={`/mumbai?area=${area.slug}`}
              className="wa-fade group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-white/12 sm:aspect-[16/10]"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]">
                <Skyline variant={i === 0 ? "warm" : "stone"} />
              </span>
              <span className="relative z-10 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent p-6">
                <span className="font-display block text-2xl font-medium tracking-tight sm:text-3xl">
                  {area.name}
                </span>
                <span className="mt-2 block max-w-md text-[14px] leading-relaxed text-paper/70">
                  {area.description}
                </span>
                <span className="wa-mono mt-3 block text-paper/45">{area.streets}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 max-w-2xl">
          <h1 className="text-[15px] font-normal leading-relaxed text-paper/80">
            Cafes you can actually work from, scored on what decides whether you last three
            hours: somewhere to plug in, somewhere to sit, a connection that holds, and whether
            anyone minds you staying.{" "}
            <span className="text-paper/50">
              All {CAFES.length} are graded on the same {FACTORS.length} weighted factors, from
              published evidence, with every finding cited — and where the sources are too thin
              to average, the panel says so instead of printing a number.
            </span>
          </h1>
        </div>

        <div className="mt-12 max-w-2xl">
          <p className="wa-mono mb-4 text-paper/40">A few we&apos;d actually go back to</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {EDITOR_PICKS.map((cafe) => (
              <Link
                key={cafe.slug}
                href={`/mumbai?area=${cafe.area}`}
                className="rounded-xl border border-white/12 p-4 transition-colors hover:bg-white/[0.04]"
              >
                <p className="font-display text-[15px] font-medium leading-snug">{cafe.name}</p>
                <p className="wa-mono mt-1 text-paper/40">{cafe.neighborhood}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-paper/60">
                  {cafe.whyWeRecommend}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer className="wa-mono relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-5 text-paper/40 sm:px-10">
        <span>© 2026 Deskbay</span>
        <nav className="flex gap-5">
          <Link href="/mumbai" className="hover:text-paper">The map</Link>
          <Link href="/about" className="hover:text-paper">About</Link>
          <Link href="/submit" className="hover:text-paper">Submit a cafe</Link>
        </nav>
      </footer>
    </main>
  );
}
