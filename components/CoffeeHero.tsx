export default function CoffeeHero() {
  return (
    <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-paper/12">
      <svg viewBox="0 0 800 350" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="800" height="350" fill="#f0e3cc" />
        <circle cx="120" cy="80" r="140" fill="#e8d5b3" opacity="0.6" />
        <circle cx="700" cy="290" r="180" fill="#e0c79a" opacity="0.5" />
        {/* steam */}
        <g stroke="#b5651d" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.55">
          <path d="M360 90 C 350 65, 375 55, 365 30" />
          <path d="M400 90 C 390 60, 415 50, 405 20" />
          <path d="M440 90 C 430 65, 455 55, 445 30" />
        </g>
        {/* cup */}
        <path d="M330 130 h140 l-14 130 a20 20 0 0 1-20 18 h-72 a20 20 0 0 1-20-18 z" fill="#2b1810" />
        <path d="M330 130 h140 l-4 36 h-132 z" fill="#b5651d" />
        <path d="M470 145 q40 5 40 35 q0 32-42 34" fill="none" stroke="#2b1810" strokeWidth="10" />
        {/* saucer */}
        <ellipse cx="400" cy="292" rx="110" ry="14" fill="#2b1810" opacity="0.15" />
        {/* beans scattered */}
        <g fill="#2b1810" opacity="0.7">
          <ellipse cx="180" cy="250" rx="14" ry="9" transform="rotate(-20 180 250)" />
          <ellipse cx="210" cy="270" rx="14" ry="9" transform="rotate(15 210 270)" />
          <ellipse cx="600" cy="240" rx="14" ry="9" transform="rotate(35 600 240)" />
          <ellipse cx="630" cy="265" rx="14" ry="9" transform="rotate(-10 630 265)" />
        </g>
      </svg>
    </div>
  );
}
