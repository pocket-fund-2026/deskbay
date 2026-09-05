import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// The Neon marketplace integration attaches its env vars under a
// resource-name prefix rather than a plain DATABASE_URL — this is the
// prefix Vercel assigned when the "bombaycafemapdb" database was connected
// to this project (Storage tab -> deskbay). If the database is ever
// recreated under a different name, this is the one line that needs to
// change.
//
// Marketplace secrets like this one are also intentionally unreadable
// outside the deployed runtime (Vercel returns an empty string for them to
// `vercel env pull`), so this can't be checked at module-load time — build
// (including `next build` run locally) would fail every time. The client is
// built lazily on first real query instead, inside a request handler where
// the real injected value is always present.
let client: NeonQueryFunction<false, false> | null = null;

function getClient(): NeonQueryFunction<false, false> {
  if (!client) {
    const connectionString = process.env.bombaycafemapdb_DATABASE_URL;
    if (!connectionString) throw new Error("bombaycafemapdb_DATABASE_URL is not set");
    client = neon(connectionString);
  }
  return client;
}

export const sql: NeonQueryFunction<false, false> = ((...args: Parameters<NeonQueryFunction<false, false>>) =>
  getClient()(...args)) as NeonQueryFunction<false, false>;

let schemaReady: Promise<void> | null = null;

/**
 * Marketplace Postgres has no migration runner attached, and this app is
 * small enough not to need one — each route ensures its own tables exist
 * before querying. Cached per warm serverless instance so it only runs the
 * DDL once per cold start, not on every request.
 */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS cafe_votes (
          id BIGSERIAL PRIMARY KEY,
          cafe_slug TEXT NOT NULL,
          visitor_id TEXT NOT NULL,
          value SMALLINT NOT NULL CHECK (value IN (1, -1)),
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          UNIQUE (cafe_slug, visitor_id)
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS cafe_votes_slug_idx ON cafe_votes (cafe_slug)`;

      await sql`
        CREATE TABLE IF NOT EXISTS cafe_comments (
          id BIGSERIAL PRIMARY KEY,
          cafe_slug TEXT NOT NULL,
          visitor_id TEXT NOT NULL,
          body TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS cafe_comments_slug_idx ON cafe_comments (cafe_slug, created_at DESC)`;

      await sql`
        CREATE TABLE IF NOT EXISTS cafe_submissions (
          id BIGSERIAL PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          area TEXT NOT NULL,
          neighborhood TEXT NOT NULL,
          address TEXT NOT NULL,
          website TEXT,
          instagram TEXT,
          notes TEXT,
          submitter_email TEXT,
          latitude DOUBLE PRECISION,
          longitude DOUBLE PRECISION,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          reviewed_at TIMESTAMPTZ
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS cafe_submissions_status_idx ON cafe_submissions (status, created_at DESC)`;
    })();
  }
  return schemaReady;
}
