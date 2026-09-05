import { NextRequest, NextResponse } from "next/server";
import { AREAS } from "@/lib/cafes";
import { createSubmission } from "@/lib/submissions";

export const runtime = "nodejs";

const MAX_LEN = 300;
const MAX_NOTES_LEN = 1000;

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  if (!raw) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  // Hidden field real visitors never fill in.
  if (typeof raw.company === "string" && raw.company.trim() !== "") {
    return NextResponse.json({ ok: true, slug: "" });
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const area = typeof raw.area === "string" ? raw.area : "";
  const neighborhood = typeof raw.neighborhood === "string" ? raw.neighborhood.trim() : "";
  const address = typeof raw.address === "string" ? raw.address.trim() : "";
  const website = typeof raw.website === "string" && raw.website.trim() ? raw.website.trim() : null;
  const instagram = typeof raw.instagram === "string" && raw.instagram.trim() ? raw.instagram.trim() : null;
  const notes = typeof raw.notes === "string" && raw.notes.trim() ? raw.notes.trim() : null;
  const submitterEmail =
    typeof raw.submitterEmail === "string" && raw.submitterEmail.trim() ? raw.submitterEmail.trim() : null;

  if (!name || name.length > MAX_LEN) {
    return NextResponse.json({ error: "Cafe name is required (max 300 characters)" }, { status: 400 });
  }
  if (!Object.prototype.hasOwnProperty.call(AREAS, area)) {
    return NextResponse.json({ error: "Pick a valid area" }, { status: 400 });
  }
  if (!neighborhood || neighborhood.length > MAX_LEN) {
    return NextResponse.json({ error: "Neighborhood is required (max 300 characters)" }, { status: 400 });
  }
  if (!address || address.length > MAX_LEN) {
    return NextResponse.json({ error: "Address is required (max 300 characters)" }, { status: 400 });
  }
  if (notes && notes.length > MAX_NOTES_LEN) {
    return NextResponse.json({ error: `Notes must be under ${MAX_NOTES_LEN} characters` }, { status: 400 });
  }

  try {
    const { slug } = await createSubmission({
      name,
      area,
      neighborhood,
      address,
      website,
      instagram,
      notes,
      submitterEmail,
    });
    return NextResponse.json({ ok: true, slug }, { status: 201 });
  } catch (err) {
    console.error("Failed to create submission:", err);
    return NextResponse.json({ error: "Something went wrong — try again." }, { status: 500 });
  }
}
