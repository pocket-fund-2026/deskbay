import Link from "next/link";
import Reveal from "@/components/Reveal";
import ScoreFill from "@/components/ScoreFill";
import { AREAS, type Cafe } from "@/lib/cafes";

export default function BlogCafeList({ cafes, note }: { cafes: Cafe[]; note?: (c: Cafe) => string | null }) {
  return (
    <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[14px] leading-relaxed text-paper/65">
      {cafes.map((c, i) => (
        <li key={c.slug}>
          <Reveal delay={Math.min(i, 6) * 50}>
          <Link href={`/mumbai/${c.slug}`} className="underline hover:text-paper">
            {c.name}
          </Link>
          {`, ${c.neighborhood}, ${AREAS[c.area].name}`}
          {c.workability !== null && ` (workability ${c.workability.toFixed(1)}/5)`}
          {note?.(c) ? `: ${note(c)}` : ""}
          {c.workability !== null && (
            <div className="mt-1 h-1 w-40 rounded-full bg-paper/10" aria-hidden>
              <ScoreFill value={c.workability} />
            </div>
          )}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
