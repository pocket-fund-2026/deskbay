import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AREAS } from "@/lib/cafes";
import { COLLECTIONS, collectionCafes, getCollection } from "@/lib/collections";
import { tier } from "@/lib/scoreTier";
import PinBadge from "@/components/PinBadge";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: `${collection.title} · Bombay Cafe Map`,
      description: collection.description,
      url: `${SITE_URL}/collections/${collection.slug}`,
      type: "website",
      images: ["/opengraph-image"],
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const cafes = collectionCafes(collection);

  // An ItemList tells Google this page is a ranked list rather than prose,
  // which is what a "best cafes for X" query is looking for.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    description: collection.description,
    numberOfItems: cafes.length,
    itemListElement: cafes.map((cafe, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/mumbai/${cafe.slug}`,
      name: cafe.name,
    })),
  };

  return (
    <main className="min-h-dvh bg-ink text-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/collections" className="wa-mono -my-2 py-2 text-paper/45 transition-colors hover:text-paper">
            ← All lists
          </Link>
          <ThemeToggle />
        </div>
        <p className="wa-mono mt-6 text-paper/40">{collection.question}</p>
        <h1 className="font-display mt-2 text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-tight">
          {collection.title}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-paper/65">{collection.blurb}</p>
        <p className="wa-mono mt-4 text-paper/40">
          {cafes.length} cafes · ranked by overall score
        </p>

        <ol className="mt-8 space-y-3">
          {cafes.map((cafe, i) => {
            const t = tier(cafe.workability);
            const reason = collection.reason(cafe);
            return (
              <li key={cafe.slug}>
                <Link
                  href={`/mumbai/${cafe.slug}`}
                  className="flex gap-4 rounded-xl border border-paper/12 p-4 transition-colors hover:bg-paper/[0.04]"
                >
                  <span className="wa-mono w-6 shrink-0 pt-1 text-paper/30">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="font-display block text-[17px] font-medium leading-snug">
                          {cafe.name}
                        </span>
                        <span className="wa-mono mt-1 block text-paper/40">
                          {cafe.neighborhood} · {AREAS[cafe.area].name}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2 rounded-lg border border-paper/12 px-2 py-1">
                        <PinBadge color={t.color} />
                        <span className="font-display text-[15px] leading-none">
                          {cafe.workability !== null ? cafe.workability.toFixed(1) : "–"}
                        </span>
                      </span>
                    </span>
                    {reason && (
                      <span className="wa-mono mt-2.5 inline-block rounded-full border border-paper/12 px-2.5 py-1 text-paper/55">
                        {reason}
                      </span>
                    )}
                    <span className="mt-2.5 block text-[13.5px] leading-relaxed text-paper/60">
                      {cafe.editorialNote}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 border-t border-paper/10 pt-6">
          <p className="wa-mono mb-3 text-paper/40">Other lists</p>
          <div className="flex flex-wrap gap-2">
            {COLLECTIONS.filter((c) => c.slug !== collection.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="wa-mono rounded-full border border-paper/12 px-3 py-1.5 text-paper/55 transition-colors hover:bg-paper/[0.04] hover:text-paper"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
