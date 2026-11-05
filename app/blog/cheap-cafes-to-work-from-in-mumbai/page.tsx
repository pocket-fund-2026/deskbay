import Link from "next/link";
import BlogShell, { H2, P, postMetadata } from "@/components/BlogShell";
import BlogCafeList from "@/components/BlogCafeList";
import { CAFES } from "@/lib/cafes";
import { DATA_AS_OF, byScore, countByArea, inCollection } from "@/lib/blogData";

const SLUG = "cheap-cafes-to-work-from-in-mumbai";
export const metadata = postMetadata(SLUG);

export default function Post() {
  const cheap = inCollection("under-500-a-session").list;
  const ranked = byScore(cheap);
  const scored = ranked.filter((c) => c.workability !== null);
  const recorded = CAFES.filter((c) => c.attrs?.avgFoodCost).length;
  const areas = countByArea(cheap).filter((a) => a.n > 0);
  const top = scored.slice(0, 3).map((c) => c.name).join(", ");
  const cost = (c: (typeof cheap)[number]) => `typically ${c.attrs?.avgFoodCost} a head`;
  const answer = `${cheap.length} Mumbai cafes are recorded at ₹500 a head or less, and ${scored.length} of them have a workability score. The top three by score are ${top}. Cost is the average food and drink spend recorded per cafe, not a measured bill. Counts as of ${DATA_AS_OF}.`;
  const faqs = [
    { q: "Which are the cheapest Mumbai cafes to work from?", a: `${cheap.length} cafes are recorded at ₹100–500 a head. The highest scored are ${top}.` },
    { q: "How much does a cafe working session cost in Mumbai?", a: `Among the ${cheap.length} cheaper cafes, recorded spend is ₹100–250 or ₹250–500 a head. Most mapped cafes list a higher figure, and ${CAFES.length - recorded} of ${CAFES.length} have no cost recorded at all.` },
    { q: "Are cheap cafes worse for working?", a: "Not by the data. Several of these score above 3.5 out of 5 for work, including long-stay tolerance and fast wifi. Cost tells you nothing about outlets or noise, so check each cafe page." },
    { q: "Where are the cheaper cafes?", a: `${areas.map((a) => `${a.area.name} (${a.n})`).join(", ")}.` },
  ];
  return (
    <BlogShell slug={SLUG} answer={answer} faqs={faqs} sources={[
      { label: "Full list: Mumbai cafes under ₹500 a session", href: "/collections/under-500-a-session" },
      { label: "How we score cafes", href: "/about" },
    ]}>
      <H2>Cafes at ₹500 a head or less, ranked by workability</H2>
      <BlogCafeList cafes={ranked} note={cost} />
      <H2>Where the cheaper cafes are</H2>
      <P>{`By area: ${areas.map((a) => `${a.area.name} ${a.n}`).join(", ")}. Cost is recorded for only ${recorded} of ${CAFES.length} mapped cafes, so a cafe missing here may simply have no figure yet, not a higher price.`}</P>
      <H2>What cost does not tell you</H2>
      <P>{"A low spend does not mean a cafe wants you to stay. Check the stay and wifi evidence on each page, and see the "}<Link href="/blog/best-cafes-in-mumbai-where-you-can-stay-three-hours" className="underline hover:text-paper">long-stay guide</Link>{" and the "}<Link href="/blog/best-cafes-with-wifi-in-mumbai" className="underline hover:text-paper">wifi guide</Link>{" for how those claims are sourced."}</P>
    </BlogShell>
  );
}
