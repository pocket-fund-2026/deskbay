import Link from "next/link";
import { AREAS } from "@/lib/cafes";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-paper/10 px-6 py-10 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-1.5 font-display text-[17px] tracking-tight">
            <Logo size={20} />
            Bombay Cafe <em className="font-semibold not-italic italic">Map</em>
          </div>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-paper/50">
            Mumbai cafes scored on whether you can actually work from them — wifi, power,
            seating, noise — with every finding cited.
          </p>
          <a
            href="https://www.instagram.com/bombaycafemap/"
            target="_blank"
            rel="noopener noreferrer me"
            aria-label="Bombay Cafe Map on Instagram"
            className="mt-4 inline-flex items-center gap-2 text-[13.5px] text-paper/65 transition-colors hover:text-paper"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
            </svg>
            @bombaycafemap
          </a>
        </div>

        <div>
          <p className="wa-mono mb-3 text-paper/40">Explore</p>
          <nav className="flex flex-col gap-3 text-[13.5px] sm:gap-2">
            <Link href="/mumbai" className="-my-1.5 py-1.5 text-paper/65 transition-colors hover:text-paper">The map</Link>
            <Link href="/collections" className="-my-1.5 py-1.5 text-paper/65 transition-colors hover:text-paper">Best-of lists</Link>
            <Link href="/blog" className="-my-1.5 py-1.5 text-paper/65 transition-colors hover:text-paper">Blog</Link>
            <Link href="/about" className="-my-1.5 py-1.5 text-paper/65 transition-colors hover:text-paper">How we score</Link>
            <Link href="/submit" className="-my-1.5 py-1.5 text-paper/65 transition-colors hover:text-paper">Submit a cafe</Link>
          </nav>
        </div>

        <div>
          <p className="wa-mono mb-3 text-paper/40">Areas</p>
          <nav className="flex flex-col gap-3 text-[13.5px] sm:gap-2">
            {Object.values(AREAS).map((area) => (
              <Link
                key={area.slug}
                href={`/mumbai?area=${area.slug}`}
                className="-my-1.5 py-1.5 text-paper/65 transition-colors hover:text-paper"
              >
                {area.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="wa-mono mx-auto mt-9 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-paper/10 pt-5 text-paper/35">
        <span>© 2026 Bombay Cafe Map</span>
        <span>Built for people who need a table for three hours</span>
      </div>
    </footer>
  );
}
