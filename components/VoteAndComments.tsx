"use client";

import { useEffect, useState } from "react";
import { getVisitorId } from "@/lib/visitorId";

type Comment = { id: number; body: string; createdAt: string };

function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function VoteAndComments({ slug }: { slug: string }) {
  const [up, setUp] = useState<number | null>(null);
  const [down, setDown] = useState<number | null>(null);
  const [myVote, setMyVote] = useState<number | null>(null);
  const [voting, setVoting] = useState(false);

  const [comments, setComments] = useState<Comment[] | null>(null);
  const [draft, setDraft] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const visitorId = getVisitorId();
    fetch(`/api/cafes/${slug}/votes?visitorId=${encodeURIComponent(visitorId)}`)
      .then((r) => r.json())
      .then((d) => {
        setUp(d.up ?? 0);
        setDown(d.down ?? 0);
        setMyVote(d.myVote ?? null);
      })
      .catch(() => {
        setUp(0);
        setDown(0);
      });

    fetch(`/api/cafes/${slug}/comments`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []))
      .catch(() => setComments([]));
  }, [slug]);

  async function vote(value: 1 | -1) {
    if (voting) return;
    setVoting(true);
    const visitorId = getVisitorId();
    try {
      const res = await fetch(`/api/cafes/${slug}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, value }),
      });
      const d = await res.json();
      if (res.ok) {
        setUp(d.up);
        setDown(d.down);
        setMyVote(d.myVote);
      }
    } catch {
      /* offline or request failed — leave counts as they were */
    } finally {
      setVoting(false);
    }
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (posting || !draft.trim()) return;
    setPosting(true);
    setError(null);
    const visitorId = getVisitorId();
    try {
      const res = await fetch(`/api/cafes/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, body: draft.trim(), company }),
      });
      const d = await res.json();
      if (res.ok) {
        if (d.comment) setComments((cs) => [d.comment, ...(cs ?? [])]);
        setDraft("");
      } else {
        setError(d.error ?? "Couldn't post that comment.");
      }
    } catch {
      setError("Couldn't reach the server — try again.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mt-8 border-t border-paper/10 pt-6">
      <p className="wa-mono mb-3 text-paper/40">Been here? Say so</p>

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => vote(1)}
          disabled={voting}
          aria-pressed={myVote === 1}
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13.5px] transition-colors disabled:opacity-60 ${
            myVote === 1
              ? "border-accent/60 bg-accent/15 text-paper"
              : "border-paper/15 text-paper/60 hover:text-paper"
          }`}
        >
          <span aria-hidden>👍</span>
          {up ?? "–"}
        </button>
        <button
          onClick={() => vote(-1)}
          disabled={voting}
          aria-pressed={myVote === -1}
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13.5px] transition-colors disabled:opacity-60 ${
            myVote === -1
              ? "border-paper/40 bg-paper/10 text-paper"
              : "border-paper/15 text-paper/60 hover:text-paper"
          }`}
        >
          <span aria-hidden>👎</span>
          {down ?? "–"}
        </button>
        {myVote !== null && (
          <span className="wa-mono text-paper/35">Tap again to undo</span>
        )}
      </div>

      <form onSubmit={submitComment} className="mt-5 space-y-2.5">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Wifi held up, or it didn't — leave a note for the next person."
          className="w-full rounded-lg border border-paper/15 bg-paper/5 px-3.5 py-2.5 text-[14px] leading-relaxed outline-none focus:border-accent"
        />
        {/* Hidden from real visitors via CSS, not display:none — screen
            readers and simple bots that ignore stylesheets still see an
            empty-on-load field, so filling it in is a reliable spam tell. */}
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute h-0 w-0 overflow-hidden opacity-0"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={posting || !draft.trim()}
            className="wa-btn wa-btn--solid !bg-paper !text-ink disabled:opacity-50"
          >
            {posting ? "Posting…" : "Post comment"}
          </button>
          <span className="wa-mono text-paper/30">Anonymous · {draft.length}/500</span>
        </div>
        {error && <p className="text-[13px] text-red-400">{error}</p>}
      </form>

      <ul className="mt-5 space-y-3">
        {comments === null && <li className="wa-mono text-paper/30">Loading comments…</li>}
        {comments?.length === 0 && (
          <li className="wa-mono text-paper/30">No comments yet — be the first.</li>
        )}
        {comments?.map((c) => (
          <li key={c.id} className="rounded-lg border border-paper/10 p-3.5">
            <p className="text-[13.5px] leading-relaxed text-paper/75">{c.body}</p>
            <p className="wa-mono mt-1.5 text-paper/30">{timeAgo(c.createdAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
