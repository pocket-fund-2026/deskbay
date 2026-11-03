import Link from "next/link";
import Reveal from "@/components/Reveal";
import ScoreFill from "@/components/ScoreFill";
import BlogShell, { H2, P, postMetadata } from "@/components/BlogShell";
import { AREAS, CAFES } from "@/lib/cafes";
import { DATA_AS_OF, inCollection } from "@/lib/blogData";

const SLUG = "which-mumbai-area-is-best-to-work-from-cafes-compared";
export const metadata = postMetadata(SLUG);

const cols = ["no-time-limit", "wifi-for-calls", "plug-points", "quiet-enough-to-think"] as const;
const heads = ["Long stay", "Fast wifi", "Plugs", "Quiet"];

export default function Post() {
  const sets = cols.map((s) => new Set(inCollection(s).list.map((c) => c.slug)));
  const rows = Object.values(AREAS).map((a) => {
    const cafes = CAFES.filter((c) => c.area === a.slug);
    const scored = cafes.filter((c) => c.workability !== null);
    const avg = scored.length ? scored.reduce((s, c) => s + c.workability!, 0) / scored.length : 0;
    const n = sets.map((s) => cafes.filter((c) => s.has(c.slug)).length);
    return { a, total: cafes.length, scored: scored.length, avg, n, perScored: n.map((x) => (scored.length ? x / scored.length : 0)) };
  });
  const best = rows.slice().sort((x, y) => y.avg - x.avg)[0];
  const most = rows.slice().sort((x, y) => y.total - x.total)[0];
  const answer = `${best.a.name} has the highest average workability score (${best.avg.toFixed(2)} out of 5 across ${best.scored} scored cafes), while ${most.a.name} has the most cafes mapped (${most.total}). The table below compares all nine areas on the same data. Counts as of ${DATA_AS_OF}.`;
  const faqs = [
    { q: "Which area of Mumbai is best for working from cafes?", a: `By average workability score, ${best.a.name} leads at ${best.avg.toFixed(2)}/5. Averages hide the best individual cafes, so check the area guide before choosing.` },
    { q: "Which Mumbai area has the most work-friendly cafes?", a: `${most.a.name} has the most cafes mapped, ${most.total}, but a bigger count is not a better average.` },
    { q: "How are the areas compared?", a: "Every cafe is scored on nine weighted factors including power (22%), wifi (20%), seating and long-stay tolerance. The table counts cafes recorded as long-stay, fast wifi, plug points and quiet, using the same rules as our collection pages." },
  ];
  return (
    <BlogShell slug={SLUG} answer={answer} faqs={faqs} sources={[
      { label: "How we score cafes", href: "/about" },
      { label: "Browse the map by area", href: "/mumbai" },
    ]}>
      <H2>Nine Mumbai areas compared on cafe data</H2>
      <Reveal className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-[13px] text-paper/65">
          <caption className="sr-only">Mumbai areas compared by cafe count, average workability and recorded work features</caption>
          <thead>
            <tr className="border-b border-paper/12 text-paper/80">
              <th scope="col" className="py-2 pr-3 font-medium">Area</th>
              <th scope="col" className="py-2 pr-3 font-medium">Cafes</th>
              <th scope="col" className="py-2 pr-3 font-medium">Avg score</th>
              {heads.map((h) => <th key={h} scope="col" className="py-2 pr-3 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.sort((x, y) => y.avg - x.avg).map((r) => (
              <tr key={r.a.slug} className={`border-b border-paper/8 ${r.a.slug === best.a.slug ? "bg-accent/10" : ""}`}>
                <th scope="row" className="py-2 pr-3 font-medium">
                  <Link href={`/blog/best-cafes-to-work-from-in-${r.a.slug}`} className="underline hover:text-paper">{r.a.name}</Link>
                </th>
                <td className="py-2 pr-3">{r.total}</td>
                <td className="py-2 pr-3">{r.avg.toFixed(2)}<div className="mt-1 h-1 w-16 rounded-full bg-paper/10" aria-hidden><ScoreFill value={r.avg} /></div></td>
                {r.n.map((x, i) => <td key={i} className="py-2 pr-3">{x}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
      <P>Average score uses only cafes we have fully scored; the feature columns count cafes whose record meets that collection&apos;s rule, so an area with many cafes can show large numbers without a high average.</P>
      <H2>How to use this</H2>
      <P>Pick the column that matters most to your day. Calls need wifi and quiet; deep work needs long stay and plugs. Then open that area&apos;s guide for the ranked cafes. For a citywide view see the <Link href="/blog/15-best-cafes-to-work-from-in-mumbai" className="underline hover:text-paper">15 best cafes to work from in Mumbai</Link>.</P>
    </BlogShell>
  );
}
