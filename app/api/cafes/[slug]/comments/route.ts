import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { getCafe } from "@/lib/cafes";

export const runtime = "nodejs";

const MAX_BODY_LENGTH = 500;
const RATE_LIMIT_WINDOW_SECONDS = 30;
const MAX_PER_DAY_PER_VISITOR = 20;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCafe(slug)) return NextResponse.json({ error: "Unknown cafe" }, { status: 404 });

  await ensureSchema();
  const rows = await sql`
    SELECT id, body, created_at AS "createdAt"
    FROM cafe_comments
    WHERE cafe_slug = ${slug}
    ORDER BY created_at DESC
    LIMIT 100
  `;
  return NextResponse.json({ comments: rows });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCafe(slug)) return NextResponse.json({ error: "Unknown cafe" }, { status: 404 });

  const raw = await req.json().catch(() => null);
  const visitorId = typeof raw?.visitorId === "string" ? raw.visitorId.slice(0, 100) : null;
  const body = typeof raw?.body === "string" ? raw.body.trim() : "";
  // Hidden field real visitors never fill in; a non-empty value means a bot
  // filled every input on the form, so silently pretend it worked.
  const honeypot = typeof raw?.company === "string" ? raw.company : "";

  if (!visitorId) {
    return NextResponse.json({ error: "Missing visitorId" }, { status: 400 });
  }
  if (honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }
  if (!body || body.length > MAX_BODY_LENGTH) {
    return NextResponse.json(
      { error: `Comment must be 1-${MAX_BODY_LENGTH} characters` },
      { status: 400 }
    );
  }

  await ensureSchema();

  const recent = await sql`
    SELECT created_at AS "createdAt" FROM cafe_comments
    WHERE visitor_id = ${visitorId} ORDER BY created_at DESC LIMIT 1
  `;
  const lastCreatedAt = (recent[0] as { createdAt: Date } | undefined)?.createdAt;
  if (lastCreatedAt && Date.now() - new Date(lastCreatedAt).getTime() < RATE_LIMIT_WINDOW_SECONDS * 1000) {
    return NextResponse.json({ error: "You're posting too fast — try again in a moment." }, { status: 429 });
  }

  const dailyCount = await sql`
    SELECT COUNT(*) AS count FROM cafe_comments
    WHERE visitor_id = ${visitorId} AND created_at > now() - INTERVAL '1 day'
  `;
  if (Number((dailyCount[0] as { count: string }).count) >= MAX_PER_DAY_PER_VISITOR) {
    return NextResponse.json({ error: "Daily comment limit reached." }, { status: 429 });
  }

  const inserted = await sql`
    INSERT INTO cafe_comments (cafe_slug, visitor_id, body)
    VALUES (${slug}, ${visitorId}, ${body})
    RETURNING id, body, created_at AS "createdAt"
  `;

  return NextResponse.json({ comment: inserted[0] }, { status: 201 });
}
