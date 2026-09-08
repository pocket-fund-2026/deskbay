import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { getCafe } from "@/lib/cafes";

export const runtime = "nodejs";

/**
 * "Is this still true?" — one tap per claim.
 *
 * Every score on this site cites evidence gathered on a particular day, and
 * `lastVerifiedAt` is the honest admission that it decays: wifi gets worse,
 * a cafe starts asking laptops to leave at noon, the plug behind the corner
 * table stops working. Nobody was ever going to re-audit 129 cafes by hand,
 * so this lets the person sitting in one right now say whether the three
 * things that matter most still hold.
 */

const FIELDS = ["wifi", "power", "stay"] as const;
type Field = (typeof FIELDS)[number];

function isField(v: unknown): v is Field {
  return typeof v === "string" && (FIELDS as readonly string[]).includes(v);
}

// The driver hands back `latest` as a Date, not the ISO string the client
// wants, so it's normalised below rather than relied on to serialise.
type Row = { field: Field; still_true: boolean; count: string; latest: string | Date | null };

async function summarise(slug: string) {
  const rows = (await sql`
    SELECT field, still_true, COUNT(*) AS count, MAX(created_at) AS latest
    FROM cafe_confirmations
    WHERE cafe_slug = ${slug}
    GROUP BY field, still_true
  `) as unknown as Row[];

  const fields = Object.fromEntries(
    FIELDS.map((f) => [f, { yes: 0, no: 0 }])
  ) as Record<Field, { yes: number; no: number }>;

  let lastConfirmedAt: string | null = null;
  for (const row of rows) {
    if (!isField(row.field)) continue;
    fields[row.field][row.still_true ? "yes" : "no"] = Number(row.count);
    if (!row.latest) continue;
    const iso = new Date(row.latest).toISOString();
    if (lastConfirmedAt === null || iso > lastConfirmedAt) lastConfirmedAt = iso;
  }

  return { fields, lastConfirmedAt };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCafe(slug)) return NextResponse.json({ error: "Unknown cafe" }, { status: 404 });

  await ensureSchema();
  const visitorId = req.nextUrl.searchParams.get("visitorId");
  const summary = await summarise(slug);

  const mine: Partial<Record<Field, boolean>> = {};
  if (visitorId) {
    const rows = (await sql`
      SELECT field, still_true FROM cafe_confirmations
      WHERE cafe_slug = ${slug} AND visitor_id = ${visitorId}
    `) as unknown as { field: Field; still_true: boolean }[];
    for (const row of rows) if (isField(row.field)) mine[row.field] = row.still_true;
  }

  return NextResponse.json({ ...summary, mine });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCafe(slug)) return NextResponse.json({ error: "Unknown cafe" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const visitorId = typeof body?.visitorId === "string" ? body.visitorId.slice(0, 100) : null;
  const field = body?.field;
  const stillTrue = body?.stillTrue;

  if (!visitorId || !isField(field) || typeof stillTrue !== "boolean") {
    return NextResponse.json(
      { error: "Expected { visitorId: string, field: 'wifi' | 'power' | 'stay', stillTrue: boolean }" },
      { status: 400 }
    );
  }

  await ensureSchema();

  // Answering the same way twice retracts it, matching how the vote buttons
  // on the same page already behave.
  const existing = (await sql`
    SELECT still_true FROM cafe_confirmations
    WHERE cafe_slug = ${slug} AND visitor_id = ${visitorId} AND field = ${field}
  `) as unknown as { still_true: boolean }[];

  if (existing[0]?.still_true === stillTrue) {
    await sql`
      DELETE FROM cafe_confirmations
      WHERE cafe_slug = ${slug} AND visitor_id = ${visitorId} AND field = ${field}
    `;
  } else {
    await sql`
      INSERT INTO cafe_confirmations (cafe_slug, visitor_id, field, still_true)
      VALUES (${slug}, ${visitorId}, ${field}, ${stillTrue})
      ON CONFLICT (cafe_slug, visitor_id, field)
      DO UPDATE SET still_true = EXCLUDED.still_true, created_at = now()
    `;
  }

  const summary = await summarise(slug);
  const mine: Partial<Record<Field, boolean>> = {};
  const rows = (await sql`
    SELECT field, still_true FROM cafe_confirmations
    WHERE cafe_slug = ${slug} AND visitor_id = ${visitorId}
  `) as unknown as { field: Field; still_true: boolean }[];
  for (const row of rows) if (isField(row.field)) mine[row.field] = row.still_true;

  return NextResponse.json({ ...summary, mine });
}
