import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";
import { COLLECTIONS, collectionCount } from "@/lib/collections";

const LISTS = ["wifi-for-calls", "plug-points", "no-time-limit"];

/** Internal links at the end of a work-cafe guide: shortlists first, then sibling guides. */
export default function RelatedReading({ currentSlug }: { currentSlug: string }) {
  const lists = COLLECTIONS.filter((c) => LISTS.includes(c.slug));
  const guides = BLOG_POSTS.filter(
    (p) => p.slug !== currentSlug && (p.slug.startsWith("best-cafes") || p.slug.startsWith("15-best")),
  ).slice(0, 5);
  return (
    <nav aria-label="Related reading" className="mt-8 border-t border-paper/10 pt-6">
      <p className="wa-mono mb-2 text-paper/65">Shortlists from the same data</p>
      <ul className="space-y-1 text-[13.5px] text-paper/75">
        {lists.map((c) => (
          <li key={c.slug}>
            <Link href={`/collections/${c.slug}`} className="underline hover:text-paper">{c.title}</Link>
            <span className="wa-mono ml-2 text-paper/55">{collectionCount(c)} cafes</span>
          </li>
        ))}
        <li><Link href="/mumbai" className="underline hover:text-paper">The full Mumbai map</Link></li>
      </ul>
      <p className="wa-mono mb-2 mt-5 text-paper/65">More guides</p>
      <ul className="space-y-1 text-[13.5px] text-paper/75">
        {guides.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="underline hover:text-paper">{p.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
