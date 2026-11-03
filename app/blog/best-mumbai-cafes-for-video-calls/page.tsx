import Link from "next/link";
import BlogShell, { H2, P, postMetadata } from "@/components/BlogShell";
import BlogCafeList from "@/components/BlogCafeList";
import { CAFES } from "@/lib/cafes";
import { DATA_AS_OF, byScore, inCollection } from "@/lib/blogData";

const SLUG = "best-mumbai-cafes-for-video-calls";
export const metadata = postMetadata(SLUG);

export default function Post() {
  const fast = inCollection("wifi-for-calls").list;
  const quiet = new Set(inCollection("quiet-enough-to-think").list.map((c) => c.slug));
  const both = byScore(fast.filter((c) => quiet.has(c.slug)));
  // Records where the wifi claim itself was searched for and not found are flagged, not hidden.
  const unverified = (c: (typeof both)[number]) => (/^No /i.test(c.evidence.wifi ?? "") ? "wifi claim not verified in our latest check" : null);
  const answer = `${fast.length} Mumbai cafes are recorded with fast wifi and ${both.length} of those are also recorded as quiet, which is the combination a video call needs. They are listed below with any cafe whose wifi claim we could not verify flagged. We have not run speed tests at these cafes. Counts as of ${DATA_AS_OF}.`;
  const faqs = [
    { q: "Which Mumbai cafes are good for video calls?", a: `${both.length} cafes are recorded with both fast wifi and a quiet room: ${both.slice(0, 4).map((c) => c.name).join(", ")}${both.length > 4 ? " and others" : ""}.` },
    { q: "Have you speed-tested the wifi?", a: "No. Wifi ratings come from the cafe's own site or named review sources, not our own measurements. Cafe pages show the evidence, including where a claim could not be confirmed." },
    { q: "How many Mumbai cafes have fast wifi?", a: `${fast.length} of ${CAFES.length} mapped cafes are recorded with fast wifi.` },
    { q: "What should I check before taking a call at a cafe?", a: "Test the wifi on arrival, sit away from the espresso machine, carry headphones with a mic, and avoid lunch hours." },
  ];
  return (
    <BlogShell slug={SLUG} answer={answer} faqs={faqs} sources={[
      { label: "Full list: Mumbai cafes where the wifi holds for a call", href: "/collections/wifi-for-calls" },
      { label: "How we score cafes", href: "/about" },
    ]}>
      <H2>Cafes with fast wifi and a quiet room</H2>
      <BlogCafeList cafes={both} note={unverified} />
      <H2>What about the other fast-wifi cafes?</H2>
      <P>{`The other ${fast.length - both.length} fast-wifi cafes are not recorded as quiet, so they suit uploads and browsing better than a long call. Browse them in the `}<Link href="/collections/wifi-for-calls" className="underline hover:text-paper">full wifi list</Link>{", and see how wifi claims are sourced in the "}<Link href="/blog/best-cafes-with-wifi-in-mumbai" className="underline hover:text-paper">WiFi guide</Link>.</P>
    </BlogShell>
  );
}
