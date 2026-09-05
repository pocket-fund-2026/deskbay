import Link from "next/link";
import type { Metadata } from "next";
import { COLLECTIONS, collectionCafes } from "@/lib/collections";
import { tier } from "@/lib/scoreTier";
import PinBadge from "@/components/PinBadge";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";
const TITLE = "Best-of lists";
const DESCRIPTION =
  "Mumbai cafes grouped by the thing you actually need today — a plug, quiet, a table you can spread out on, or somewhere that won't move you along.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/collections" },
  openGraph: {
    title: `${TITLE} · Bombay Cafe Map`,
    description: DESCRIPTION,
    url: `${SITE_URL}/collections`,
    type: "website",
    images: ["/opengraph-image"],
  },
};

export default function CollectionsIndex() {
  return (
    <main className="min-h-dvh bg-ink text-paper">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="wa-mono -my-2 py-2 text-paper/45 transition-colors hover:text-paper">
            ← Bombay Cafe Map
          </Link>
          <ThemeToggle />
        </div>
        <h1 className="font-display mt-6 text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-tight">
          Best-of lists
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-paper/65">{DESCRIPTION}</p>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-paper/45">
          Every list is a rule applied to the same data, not a hand-picked selection. Each cafe
          shows the recorded detail that put it there.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {COLLECTIONS.map((collection) => {
            const members = collectionCafes(collection);
            const top = members[0];
            const t = tier(top?.workability ?? null);
            return (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-paper/12 p-5 pl-6 transition-colors hover:bg-paper/[0.04]"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px] transition-[width] duration-200 group-hover:w-1"
                  style={{ background: t.color }}
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="wa-mono text-paper/40">{members.length} cafes</p>
                  {top && <PinBadge color={t.color} size={13} />}
                </div>
                <h2 className="font-display mt-1.5 text-[18px] font-medium leading-snug">
                  {collection.title}
                </h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-paper/60">
                  {collection.question}
                </p>
                {top && (
                  <p className="wa-mono mt-3 text-paper/35">
                    Top pick: <span className="text-paper/55">{top.name}</span>
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}
