// Own thumbnails (palette + pin mark), not Instagram's images: those URLs expire and the
// embed script would load third-party JS/cookies. Captions are omitted until someone confirms
// what each post shows. shortcut: hand-edited list, swap for the API only if reels change often.
const REELS = [
  { url: "https://www.instagram.com/p/Dfje9hQuJQL/", bg: "var(--color-roast)", fg: "var(--color-sand)" },
  { url: "https://www.instagram.com/p/DfWpR0xBYmQ/", bg: "var(--color-accent)", fg: "var(--color-porcelain)" },
  { url: "https://www.instagram.com/p/Dfl6L3YsL_2/", bg: "var(--color-park)", fg: "var(--color-roast)" },
];

export default function ReelStrip() {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="wa-mono text-paper/65">From our Instagram</p>
        <a
          href="https://www.instagram.com/bombaycafemap/"
          target="_blank"
          rel="noopener noreferrer me"
          className="wa-mono text-accent-text underline-offset-4 hover:underline"
        >
          @bombaycafemap
        </a>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:max-w-xl">
        {REELS.map((r, i) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch Bombay Cafe Map reel ${i + 1} on Instagram`}
            className="group relative flex aspect-[9/16] flex-col items-center justify-between overflow-hidden rounded-xl p-3 transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: r.bg, color: r.fg }}
          >
            <span className="wa-mono text-[11px] opacity-80">Instagram</span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-current transition-transform duration-300 group-hover:scale-110">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </span>
            <span className="wa-mono text-[11px]">Watch</span>
          </a>
        ))}
      </div>
    </div>
  );
}
