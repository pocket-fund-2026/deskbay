import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { getCafe } from "@/lib/cafes";

export const runtime = "nodejs";

async function counts(slug: string) {
  const rows = await sql`
    SELECT
      COUNT(*) FILTER (WHERE value = 1) AS up,
      COUNT(*) FILTER (WHERE value = -1) AS down
    FROM cafe_votes WHERE cafe_slug = ${slug}
  `;
  const row = rows[0] as { up: string; down: string } | undefined;
  return { up: Number(row?.up ?? 0), down: Number(row?.down ?? 0) };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCafe(slug)) return NextResponse.json({ error: "Unknown cafe" }, { status: 404 });

  await ensureSchema();
  const visitorId = req.nextUrl.searchParams.get("visitorId");
  const { up, down } = await counts(slug);

  let myVote: number | null = null;
  if (visitorId) {
    const rows = await sql`
      SELECT value FROM cafe_votes WHERE cafe_slug = ${slug} AND visitor_id = ${visitorId}
    `;
    myVote = (rows[0] as { value: number } | undefined)?.value ?? null;
  }

  return NextResponse.json({ up, down, myVote });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCafe(slug)) return NextResponse.json({ error: "Unknown cafe" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const visitorId = typeof body?.visitorId === "string" ? body.visitorId.slice(0, 100) : null;
  const value = body?.value;
  if (!visitorId || (value !== 1 && value !== -1)) {
    return NextResponse.json({ error: "Expected { visitorId: string, value: 1 | -1 }" }, { status: 400 });
  }

  await ensureSchema();

  // Voting the same way again retracts the vote — a second click reads as
  // "undo" rather than being a no-op, which is what people expect from a
  // toggle button.
  const existing = await sql`
    SELECT value FROM cafe_votes WHERE cafe_slug = ${slug} AND visitor_id = ${visitorId}
  `;
  const existingValue = (existing[0] as { value: number } | undefined)?.value;

  let myVote: number | null;
  if (existingValue === value) {
    await sql`DELETE FROM cafe_votes WHERE cafe_slug = ${slug} AND visitor_id = ${visitorId}`;
    myVote = null;
  } else {
    await sql`
      INSERT INTO cafe_votes (cafe_slug, visitor_id, value)
      VALUES (${slug}, ${visitorId}, ${value})
      ON CONFLICT (cafe_slug, visitor_id) DO UPDATE SET value = EXCLUDED.value, created_at = now()
    `;
    myVote = value;
  }

  const { up, down } = await counts(slug);
  return NextResponse.json({ up, down, myVote });
}
