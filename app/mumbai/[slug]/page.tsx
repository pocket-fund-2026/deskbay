import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AREAS, CAFES, getCafe } from "@/lib/cafes";
import { tier, SCORE_ROWS, EVIDENCE_ORDER } from "@/lib/scoreTier";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";

export function generateStaticParams() {
  return CAFES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cafe = getCafe(slug);
  if (!cafe) return {};

  const title = `${cafe.name} — ${cafe.neighborhood}, Mumbai`;
  const description = `${cafe.editorialNote} Workability ${cafe.workability !== null ? `${cafe.workability.toFixed(1)}/5` : "not yet scored"} on wifi, power, quiet and seating, with every finding cited.`;
  const image = cafe.images[0]?.url ?? "/opengraph-image";

  return {
    title,
    description,
    alternates: { canonical: `/mumbai/${cafe.slug}` },
    openGraph: {
      title: `${title} · Bombay Cafe Map`,
      description,
      url: `${SITE_URL}/mumbai/${cafe.slug}`,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Bombay Cafe Map`,
      description,
      images: [image],
    },
  };
}

function ScoreBar({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex items-center gap-2">
      <span className="wa-mono w-16 shrink-0 text-paper/45">{label}</span>
      <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-paper/[0.07]">
        <div
          className="h-full rounded-full"
          style={{ width: `${((value ?? 0) / 5) * 100}%`, background: tier(value).color }}
        />
      </div>
      <span className="wa-mono w-4 text-right text-paper/50">{value ?? "–"}</span>
    </div>
  );
}

export default async function CafePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cafe = getCafe(slug);
  if (!cafe) notFound();

  const areaName = AREAS[cafe.area].name;

  const cafeLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: cafe.name,
    url: cafe.website ?? undefined,
    image: cafe.images.map((i) => i.url),
    address: {
      "@type": "PostalAddress",
      streetAddress: cafe.address,
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: cafe.latitude, longitude: cafe.longitude },
    ...(cafe.openingHours ? { openingHours: cafe.openingHours } : {}),
    ...(cafe.menuUrl ? { hasMenu: cafe.menuUrl } : {}),
    ...(cafe.publicRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: cafe.publicRating.value,
            reviewCount: cafe.publicRating.count,
          },
        }
      : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bombay Cafe Map", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Mumbai", item: `${SITE_URL}/mumbai` },
      { "@type": "ListItem", position: 3, name: areaName, item: `${SITE_URL}/mumbai?area=${cafe.area}` },
      { "@type": "ListItem", position: 4, name: cafe.name, item: `${SITE_URL}/mumbai/${cafe.slug}` },
    ],
  };

  const reviewLd =
    cafe.workability !== null
      ? {
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: { "@type": "CafeOrCoffeeShop", name: cafe.name, image: cafe.images.map((i) => i.url) },
          reviewRating: {
            "@type": "Rating",
            ratingValue: cafe.workability,
            bestRating: 5,
            worstRating: 0,
          },
          author: { "@type": "Organization", name: "Bombay Cafe Map", url: SITE_URL },
          reviewBody: cafe.editorialNote,
          ...(cafe.lastVerifiedAt ? { datePublished: cafe.lastVerifiedAt } : {}),
        }
      : null;

  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cafeLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {reviewLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewLd) }}
        />
      )}

      <div className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <nav className="wa-mono flex flex-wrap gap-1.5 text-paper/40">
            <Link href="/" className="-my-1.5 py-1.5 transition-colors hover:text-paper">Bombay Cafe Map</Link>
            <span>/</span>
            <Link href="/mumbai" className="-my-1.5 py-1.5 transition-colors hover:text-paper">Mumbai</Link>
            <span>/</span>
            <Link href={`/mumbai?area=${cafe.area}`} className="-my-1.5 py-1.5 transition-colors hover:text-paper">{areaName}</Link>
          </nav>
          <ThemeToggle />
        </div>

        {cafe.images.length > 0 && (
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {cafe.images.slice(0, 4).map((img, i) => (
              <figure
                key={img.url}
                className={`relative overflow-hidden rounded-xl border border-paper/10 ${i === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 640px"
                  className="object-cover"
                />
                {img.credit && (
                  <figcaption className="wa-mono absolute bottom-1.5 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-paper/70">
                    {img.credit}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

        <div className={`flex items-start justify-between gap-4 ${cafe.images.length > 0 ? "mt-6" : "mt-5"}`}>
          <div>
            <h1 className="font-display text-[clamp(1.7rem,4vw,2.3rem)] font-medium leading-tight">
              {cafe.name}
            </h1>
            <p className="wa-mono mt-1.5 text-paper/40">
              {cafe.neighborhood} · {areaName}
            </p>
          </div>
          <div
            className="flex shrink-0 flex-col items-center justify-center rounded-full"
            style={{
              width: 62,
              height: 62,
              border: `2px solid ${tier(cafe.workability).color}`,
              boxShadow: `0 0 0 3px ${tier(cafe.workability).color}22`,
            }}
          >
            <div className="font-display text-[19px] leading-none">
              {cafe.workability !== null ? cafe.workability.toFixed(1) : "–"}
            </div>
            <div className="wa-mono mt-0.5 text-[8px] uppercase text-paper/45">/5</div>
          </div>
        </div>
        <p className="wa-mono mt-2" style={{ color: tier(cafe.workability).color }}>
          {tier(cafe.workability).label}
        </p>

        <p className="mt-4 text-[15px] leading-relaxed text-paper/75">{cafe.editorialNote}</p>
        {cafe.whyWeRecommend && cafe.whyWeRecommend !== cafe.editorialNote && (
          <p className="mt-3 text-[14px] leading-relaxed text-paper/55">{cafe.whyWeRecommend}</p>
        )}

        <div className="mt-5 flex flex-wrap gap-2 text-[12.5px]">
          {cafe.website && (
            <a href={cafe.website} target="_blank" rel="noopener noreferrer" className="wa-btn border-paper/15">
              Website
            </a>
          )}
          {cafe.instagram && (
            <a href={cafe.instagram} target="_blank" rel="noopener noreferrer" className="wa-btn border-paper/15">
              Instagram
            </a>
          )}
          {cafe.menuUrl && (
            <a href={cafe.menuUrl} target="_blank" rel="noopener noreferrer" className="wa-btn border-paper/15">
              Order / menu
            </a>
          )}
          <a href={cafe.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="wa-btn border-paper/15">
            Directions
          </a>
          <Link href={`/mumbai?area=${cafe.area}`} className="wa-btn wa-btn--solid !bg-paper !text-ink">
            See on the map
          </Link>
        </div>

        {cafe.openingHours && <p className="wa-mono mt-5 text-paper/40">{cafe.openingHours}</p>}
        <p className="mt-1 text-[13.5px] leading-relaxed text-paper/50">{cafe.address}</p>

        <div className="mt-6 space-y-1.5">
          {SCORE_ROWS.filter((r) => cafe.scores[r.key] !== null).map((r) => (
            <ScoreBar key={r.key} label={r.label} value={cafe.scores[r.key]} />
          ))}
        </div>
        {SCORE_ROWS.some((r) => cafe.scores[r.key] === null) && (
          <p className="wa-mono mt-2 text-paper/30">
            Not enough evidence:{" "}
            {SCORE_ROWS.filter((r) => cafe.scores[r.key] === null)
              .map((r) => r.label)
              .join(", ")}
          </p>
        )}

        {cafe.toggles.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {cafe.toggles.map((t) => (
              <span key={t} className="wa-mono rounded-full border border-paper/10 px-2 py-1 text-paper/50">
                {t}
              </span>
            ))}
          </div>
        )}

        {cafe.publicRating && (
          <p className="wa-mono mt-4 text-paper/40">
            {cafe.publicRating.value.toFixed(1)}★ public rating ({cafe.publicRating.count}) —{" "}
            {cafe.publicRating.source}
          </p>
        )}

        {cafe.synthesis && (
          <div
            className="mt-7 rounded-lg border-l-2 bg-paper/[0.03] p-4"
            style={{ borderColor: tier(cafe.workability).color }}
          >
            <p className="wa-mono mb-1.5 text-paper/40">Verdict</p>
            <p className="text-[14px] leading-relaxed text-paper/70">{cafe.synthesis}</p>
          </div>
        )}

        <div className="mt-7">
          <p className="wa-mono mb-2 text-paper/40">Where the scores come from</p>
          <ul className="space-y-3">
            {EVIDENCE_ORDER.filter(({ key }) => cafe.evidence[key]).map(({ key, label }) => (
              <li key={key} className="border-l-2 border-paper/10 pl-3">
                <p className="text-[12.5px] font-medium text-paper/60">{label}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-paper/50">{cafe.evidence[key]}</p>
              </li>
            ))}
          </ul>
        </div>

        {cafe.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {cafe.tags.map((t) => (
              <span key={t} className="wa-mono text-paper/30">
                #{t.replace(/\s+/g, "-")}
              </span>
            ))}
          </div>
        )}

        {cafe.sources.length > 0 && (
          <p className="wa-mono mt-6 text-paper/30">
            Sources: {cafe.sources.join(" · ")} — verified {cafe.lastVerifiedAt}
          </p>
        )}

        {cafe.images.some((i) => i.creditUrl) ? (
          <p className="wa-mono mt-3 text-paper/25">
            Photos via Wikimedia Commons, licensed{" "}
            {[...new Set(cafe.images.map((i) => i.license).filter(Boolean))].join(", ")}.
          </p>
        ) : (
          <p className="wa-mono mt-3 text-paper/25">
            No photo yet —{" "}
            <Link href="/submit" className="underline hover:text-paper/60">send us one</Link>.
          </p>
        )}

        <Link href="/mumbai" className="wa-btn wa-btn--solid mt-10 !bg-paper !text-ink">
          ← All cafes
        </Link>
      </div>
    </main>
  );
}
