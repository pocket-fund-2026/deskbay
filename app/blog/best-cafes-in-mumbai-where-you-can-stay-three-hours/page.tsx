import Link from "next/link";
import BlogShell, { H2, P, postMetadata } from "@/components/BlogShell";
import BlogCafeList from "@/components/BlogCafeList";
import { AREAS, CAFES } from "@/lib/cafes";
import { DATA_AS_OF, byScore, countByArea, inCollection } from "@/lib/blogData";

const SLUG = "best-cafes-in-mumbai-where-you-can-stay-three-hours";
export const metadata = postMetadata(SLUG);

export default function Post() {
  const { list } = inCollection("no-time-limit");
  const top = byScore(list).slice(0, 10);
  const areas = countByArea(list);
  const lead = areas[0];
  const answer = `${list.length} of the ${CAFES.length} Mumbai cafes on our map are recorded as tolerating a long sit, and ${lead.area.name} has the most of them (${lead.n}). The ten highest-scoring are listed below. "Recorded" means a cafe's own site or a named review source says you can stay; we have not timed a stay at each one. Counts as of ${DATA_AS_OF}.`;
  const faqs = [
    { q: "Which Mumbai cafes let you work for three hours or more?", a: `${list.length} cafes on Bombay Cafe Map are recorded as allowing a long stay. The highest scoring are ${top.slice(0, 3).map((c) => c.name).join(", ")}.` },
    { q: "Which part of Mumbai has the most cafes that don't rush you?", a: `${lead.area.name}, with ${lead.n} cafes recorded as long-stay. ${areas[1].area.name} follows with ${areas[1].n}.` },
    { q: "Is there an unwritten rule for how long you can sit in a Mumbai cafe?", a: "No city-wide rule exists. It depends on the cafe, the hour and how full it is. Order something every hour or so, avoid peak lunch tables, and prefer cafes recorded as long-stay." },
    { q: "How current is this list?", a: `The records were last pulled on ${DATA_AS_OF}. Cafe policies change, so each cafe page shows when its evidence was last verified.` },
  ];
  return (
    <BlogShell slug={SLUG} answer={answer} faqs={faqs} sources={[
      { label: "Full list: Mumbai cafes that won't rush you", href: "/collections/no-time-limit" },
      { label: "How we score cafes", href: "/about" },
    ]}>
      <H2>Which Mumbai cafes are best for a three-hour stay?</H2>
      <P>Ranked by overall workability score among cafes recorded as long-stay:</P>
      <BlogCafeList cafes={top} />
      <H2>Where are the long-stay cafes?</H2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-paper/65">
        {areas.filter((a) => a.n > 0).map((a) => (
          <li key={a.area.slug}>
            <Link href={`/blog/best-cafes-to-work-from-in-${a.area.slug}`} className="underline hover:text-paper">{AREAS[a.area.slug as keyof typeof AREAS].name}</Link>
            {`: ${a.n}`}
          </li>
        ))}
      </ul>
      <H2>What does long-stay actually mean here?</H2>
      <P>{"A cafe counts if its record says guests can stay for hours or lists no time limit. It does not mean staff will never ask you to order again. Pair it with the power and wifi lists before you commit a morning: see the "}<Link href="/blog/best-cafes-with-power-outlets-in-mumbai" className="underline hover:text-paper">sourced plug-point guide</Link>{" and the "}<Link href="/blog/best-cafes-with-wifi-in-mumbai" className="underline hover:text-paper">wifi guide</Link>.</P>
    </BlogShell>
  );
}
