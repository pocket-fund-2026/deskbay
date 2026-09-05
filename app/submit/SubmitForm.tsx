"use client";

import { useState } from "react";
import { AREAS } from "@/lib/cafes";

export default function SubmitForm() {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [notes, setNotes] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot

  const [status, setStatus] = useState<"idle" | "posting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("posting");
    setError(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          area,
          neighborhood,
          address,
          website: website || null,
          instagram: instagram || null,
          notes: notes || null,
          submitterEmail: submitterEmail || null,
          company,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("error");
        setError(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setError("Couldn't reach the server — try again.");
    }
  }

  if (status === "done") {
    return (
      <p className="wa-mono mt-8 text-paper/60">
        Thanks — it&apos;s in the review queue. If it checks out it&apos;ll go straight on the map.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label className="wa-mono block text-paper/50" htmlFor="name">
          Cafe name
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-lg border border-paper/15 bg-paper/5 px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
          placeholder="e.g. Kaya Kalp Bakehouse"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="wa-mono block text-paper/50" htmlFor="area">
            Area
          </label>
          <select
            id="area"
            required
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="mt-2 w-full rounded-lg border border-paper/15 bg-ink px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
          >
            <option value="" disabled>
              Pick one
            </option>
            {Object.values(AREAS).map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="wa-mono block text-paper/50" htmlFor="neighborhood">
            Neighborhood
          </label>
          <input
            id="neighborhood"
            required
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="mt-2 w-full rounded-lg border border-paper/15 bg-paper/5 px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
            placeholder="e.g. Bandra West"
          />
        </div>
      </div>
      <div>
        <label className="wa-mono block text-paper/50" htmlFor="address">
          Address
        </label>
        <input
          id="address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-2 w-full rounded-lg border border-paper/15 bg-paper/5 px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
          placeholder="Street, landmark, Mumbai — specific enough to place on a map"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="wa-mono block text-paper/50" htmlFor="website">
            Website (optional)
          </label>
          <input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="mt-2 w-full rounded-lg border border-paper/15 bg-paper/5 px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
            placeholder="https://…"
          />
        </div>
        <div>
          <label className="wa-mono block text-paper/50" htmlFor="instagram">
            Instagram (optional)
          </label>
          <input
            id="instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="mt-2 w-full rounded-lg border border-paper/15 bg-paper/5 px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
            placeholder="https://instagram.com/…"
          />
        </div>
      </div>
      <div>
        <label className="wa-mono block text-paper/50" htmlFor="notes">
          Why it belongs here
        </label>
        <textarea
          id="notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1000}
          className="mt-2 w-full rounded-lg border border-paper/15 bg-paper/5 px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
          placeholder="Wifi, outlets, seating, how long you've worked from there…"
        />
      </div>
      <div>
        <label className="wa-mono block text-paper/50" htmlFor="submitterEmail">
          Your email (optional, in case we have questions)
        </label>
        <input
          id="submitterEmail"
          type="email"
          value={submitterEmail}
          onChange={(e) => setSubmitterEmail(e.target.value)}
          className="mt-2 w-full rounded-lg border border-paper/15 bg-paper/5 px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
        />
      </div>
      {/* Hidden from real visitors; a filled-in value is a reliable bot tell. */}
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />
      <button type="submit" disabled={status === "posting"} className="wa-btn wa-btn--solid !bg-paper !text-ink disabled:opacity-50">
        {status === "posting" ? "Sending…" : "Send submission"}
      </button>
      {status === "error" && <p className="text-[13px] text-red-400">{error}</p>}
    </form>
  );
}
