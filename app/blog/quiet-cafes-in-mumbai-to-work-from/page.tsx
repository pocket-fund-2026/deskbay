import Link from "next/link";
import BlogShell, { H2, P, postMetadata } from "@/components/BlogShell";
import BlogCafeList from "@/components/BlogCafeList";
import { CAFES } from "@/lib/cafes";
import { DATA_AS_OF, byScore, countByArea, inCollection } from "@/lib/blogData";

const SLUG = "quiet-cafes-in-mumbai-to-work-from";
export const metadata = postMetadata(SLUG);

export default function Post() {
  const { list } = inCollection("quiet-enough-to-think");
  const top = byScore(list).slice(0, 10);
  const areas = countByArea(list);
  const answer = `${list.length} of ${CAFES.length} Mumbai cafes are recorded as quiet, most of them in ${areas[0].area.name} (${areas[0].n}). The ten highest-scoring are below. Noise is the hardest thing to record without visiting at the right hour, so treat "quiet" as a reported tendency, not a decibel reading. Counts as of ${DATA_AS_OF}.`;
  const faqs = [
    { q: "Which are the quietest cafes in Mumbai to work from?", a: `Among ${list.length} cafes recorded as quiet, the highest-scoring are ${top.slice(0, 3).map((c) => c.name).join(", ")}.` },
    { q: "Which area of Mumbai has the most quiet cafes?", a: `${areas[0].area.name} has ${areas[0].n}, followed by ${areas[1].area.name} with ${areas[1].n}.` },
    { q: "When are Mumbai cafes quietest?", a: "It varies by cafe. Some notes on cafe pages say a room is quiet only off-peak, so check the evidence line on the cafe's page and avoid lunch and weekend evenings if you need focus." },
    { q: "Are quiet cafes good for calls?", a: "Quiet helps, but a call also needs wifi that holds. See the shortlist that has both." },
  ];
  return (
    <BlogShell slug={SLUG} answer={answer} faqs={faqs} sources={[
      { label: "Full list: Quiet Mumbai cafes you can think in", href: "/collections/quiet-enough-to-think" },
      { label: "How we score cafes", href: "/about" },
    ]}>
      <H2>Which Mumbai cafes are quietest?</H2>
      <BlogCafeList cafes={top} />
      <H2>Quiet cafes by area</H2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-paper/65">
        {areas.filter((a) => a.n > 0).map((a) => (
          <li key={a.area.slug}>
            <Link href={`/blog/best-cafes-to-work-from-in-${a.area.slug}`} className="underline hover:text-paper">{a.area.name}</Link>{`: ${a.n}`}
          </li>
        ))}
      </ul>
      <H2>What counts as quiet?</H2>
      <P>A cafe is included when its noise is recorded as quiet or its quiet score is 3.5 or higher out of 5. Read the evidence line on each cafe page: many are quiet only off-peak. For calls, see the <Link href="/blog/best-mumbai-cafes-for-video-calls" className="underline hover:text-paper">video-call shortlist</Link>.</P>
    </BlogShell>
  );
}
