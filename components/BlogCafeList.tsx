import Link from "next/link";
import { AREAS, type Cafe } from "@/lib/cafes";

export default function BlogCafeList({ cafes, note }: { cafes: Cafe[]; note?: (c: Cafe) => string | null }) {
  return (
    <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[14px] leading-relaxed text-paper/65">
      {cafes.map((c) => (
        <li key={c.slug}>
          <Link href={`/mumbai/${c.slug}`} className="underline hover:text-paper">
            {c.name}
          </Link>
          {`, ${c.neighborhood}, ${AREAS[c.area].name}`}
          {c.workability !== null && ` (workability ${c.workability.toFixed(1)}/5)`}
          {note?.(c) ? `: ${note(c)}` : ""}
        </li>
      ))}
    </ol>
  );
}
