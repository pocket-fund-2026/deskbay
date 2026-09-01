"use client";

import { useState } from "react";

export default function SubmitForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Cafe submission: ${name || "Unnamed"}`);
    const body = encodeURIComponent(
      `Cafe name: ${name}\nAddress: ${address}\n\nWhy it belongs here:\n${notes}`
    );
    window.location.href = `mailto:submissions@deskbay.app?subject=${subject}&body=${body}`;
    setSent(true);
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
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
          placeholder="e.g. Kaya Kalp Bakehouse"
        />
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
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
          placeholder="Street, neighborhood, Mumbai"
        />
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
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
          placeholder="Wifi, outlets, seating, how long you've worked from there…"
        />
      </div>
      <button type="submit" className="wa-btn wa-btn--solid !bg-paper !text-ink">
        Send submission
      </button>
      {sent && (
        <p className="wa-mono text-paper/45">
          Opening your email client — send it through and we&apos;ll take it from there.
        </p>
      )}
    </form>
  );
}
