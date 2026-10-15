import { sql, ensureSchema } from "@/lib/db";

export type PendingComment = {
  id: number;
  cafeSlug: string;
  body: string;
  photoUrl: string | null;
  visitedOn: string | null;
  createdAt: string;
};

export async function listPendingComments(): Promise<PendingComment[]> {
  await ensureSchema();
  const rows = await sql`
    SELECT id, cafe_slug AS "cafeSlug", body, photo_url AS "photoUrl", visited_on AS "visitedOn", created_at AS "createdAt"
    FROM cafe_comments WHERE status = 'pending' ORDER BY created_at ASC LIMIT 200
  `;
  return rows as PendingComment[];
}

export async function setCommentStatus(id: number, status: "approved" | "rejected") {
  await ensureSchema();
  await sql`UPDATE cafe_comments SET status = ${status} WHERE id = ${id}`;
}
