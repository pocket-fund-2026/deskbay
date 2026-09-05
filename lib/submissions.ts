import { sql, ensureSchema } from "@/lib/db";
import { geocodeAddress } from "@/lib/geocode";
import { CAFES, type Cafe, type AreaSlug } from "@/lib/cafes";

export type Submission = {
  id: number;
  slug: string;
  name: string;
  area: AreaSlug;
  neighborhood: string;
  address: string;
  website: string | null;
  instagram: string | null;
  notes: string | null;
  submitterEmail: string | null;
  latitude: number | null;
  longitude: number | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt: string | null;
};

function slugify(name: string, neighborhood: string): string {
  const base = `${name}-${neighborhood}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "cafe";
}

/** Appends -2, -3, ... until the slug is free against both the static list and existing submissions. */
async function uniqueSlug(name: string, neighborhood: string): Promise<string> {
  const base = slugify(name, neighborhood);
  const staticSlugs = new Set(CAFES.map((c) => c.slug));
  const rows = await sql`SELECT slug FROM cafe_submissions WHERE slug LIKE ${base + "%"}`;
  const takenSlugs = new Set([...staticSlugs, ...(rows as { slug: string }[]).map((r) => r.slug)]);

  if (!takenSlugs.has(base)) return base;
  let i = 2;
  while (takenSlugs.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

export async function createSubmission(input: {
  name: string;
  area: string;
  neighborhood: string;
  address: string;
  website: string | null;
  instagram: string | null;
  notes: string | null;
  submitterEmail: string | null;
}) {
  await ensureSchema();
  const slug = await uniqueSlug(input.name, input.neighborhood);
  const geo = await geocodeAddress(input.address);

  await sql`
    INSERT INTO cafe_submissions
      (slug, name, area, neighborhood, address, website, instagram, notes, submitter_email, latitude, longitude)
    VALUES
      (${slug}, ${input.name}, ${input.area}, ${input.neighborhood}, ${input.address},
       ${input.website}, ${input.instagram}, ${input.notes}, ${input.submitterEmail},
       ${geo?.latitude ?? null}, ${geo?.longitude ?? null})
  `;

  return { slug, geocoded: geo !== null };
}

function rowToSubmission(r: Record<string, unknown>): Submission {
  return {
    id: Number(r.id),
    slug: r.slug as string,
    name: r.name as string,
    area: r.area as AreaSlug,
    neighborhood: r.neighborhood as string,
    address: r.address as string,
    website: (r.website as string | null) ?? null,
    instagram: (r.instagram as string | null) ?? null,
    notes: (r.notes as string | null) ?? null,
    submitterEmail: (r.submitter_email as string | null) ?? null,
    latitude: r.latitude === null ? null : Number(r.latitude),
    longitude: r.longitude === null ? null : Number(r.longitude),
    status: r.status as Submission["status"],
    createdAt: new Date(r.created_at as string).toISOString(),
    reviewedAt: r.reviewed_at ? new Date(r.reviewed_at as string).toISOString() : null,
  };
}

export async function listSubmissions(): Promise<Submission[]> {
  await ensureSchema();
  const rows = await sql`SELECT * FROM cafe_submissions ORDER BY created_at DESC LIMIT 200`;
  return (rows as Record<string, unknown>[]).map(rowToSubmission);
}

export async function retryGeocode(id: number, address: string) {
  await ensureSchema();
  const geo = await geocodeAddress(address);
  await sql`
    UPDATE cafe_submissions
    SET address = ${address}, latitude = ${geo?.latitude ?? null}, longitude = ${geo?.longitude ?? null}
    WHERE id = ${id}
  `;
  return geo !== null;
}

export async function approveSubmission(id: number) {
  await ensureSchema();
  const rows = await sql`SELECT latitude, longitude FROM cafe_submissions WHERE id = ${id}`;
  const row = rows[0] as { latitude: number | null; longitude: number | null } | undefined;
  if (!row || row.latitude === null || row.longitude === null) {
    throw new Error("Cannot approve a submission without valid coordinates — fix the address first.");
  }
  await sql`UPDATE cafe_submissions SET status = 'approved', reviewed_at = now() WHERE id = ${id}`;
}

export async function rejectSubmission(id: number) {
  await ensureSchema();
  await sql`UPDATE cafe_submissions SET status = 'rejected', reviewed_at = now() WHERE id = ${id}`;
}

function submissionToCafe(s: Submission): Cafe {
  const query = encodeURIComponent(`${s.name}, ${s.address}, Mumbai`);
  return {
    slug: s.slug,
    name: s.name,
    area: s.area,
    neighborhood: s.neighborhood,
    address: s.address,
    latitude: s.latitude as number,
    longitude: s.longitude as number,
    website: s.website,
    instagram: s.instagram,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${query}`,
    openingHours: null,
    editorialNote: s.notes || "Added by a reader, not yet independently verified against published sources.",
    whyWeRecommend:
      s.notes ||
      "A reader submission — listed as a directory entry while we work through verifying wifi, power and seating the same way as everywhere else on the map.",
    scores: { wifi: null, charging: null, quiet: null, seating: null, work: null },
    attrs: {},
    evidence: {},
    toggles: [],
    tags: ["reader-submitted"],
    sources: s.website ? [s.website] : [],
    lastVerifiedAt: s.createdAt.slice(0, 10),
    publicRating: null,
    synthesis: null,
    workability: null,
    images: [],
    menuUrl: null,
  };
}

/** Approved reader submissions, in the same shape as the static cafe list. */
export async function getApprovedCafes(): Promise<Cafe[]> {
  await ensureSchema();
  const rows = await sql`
    SELECT * FROM cafe_submissions
    WHERE status = 'approved' AND latitude IS NOT NULL AND longitude IS NOT NULL
    ORDER BY reviewed_at DESC
  `;
  return (rows as Record<string, unknown>[]).map(rowToSubmission).map(submissionToCafe);
}

export async function getApprovedCafeBySlug(slug: string): Promise<Cafe | null> {
  await ensureSchema();
  const rows = await sql`
    SELECT * FROM cafe_submissions
    WHERE slug = ${slug} AND status = 'approved' AND latitude IS NOT NULL AND longitude IS NOT NULL
  `;
  const row = rows[0] as Record<string, unknown> | undefined;
  return row ? submissionToCafe(rowToSubmission(row)) : null;
}
