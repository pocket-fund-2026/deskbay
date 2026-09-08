"use client";

import { useEffect, useState } from "react";
import { getVisitorId } from "@/lib/visitorId";

type Field = "wifi" | "power" | "stay";
type Counts = Record<Field, { yes: number; no: number }>;

type Summary = {
  fields: Counts;
  lastConfirmedAt: string | null;
  mine: Partial<Record<Field, boolean>>;
};

const EMPTY: Counts = { wifi: { yes: 0, no: 0 }, power: { yes: 0, no: 0 }, stay: { yes: 0, no: 0 } };

/**
 * The three questions worth re-asking. Deliberately phrased the way the
 * scores are — as the question the factor answers — so a reader is
 * confirming the same claim the page makes, not a vaguer one.
 */
const QUESTIONS: { field: Field; question: string }[] = [
  { field: "wifi", question: "Did the wifi hold up?" },
  { field: "power", question: "Could you plug in?" },
  { field: "stay", question: "Did they let you stay?" },
];

function agoLabel(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months <= 1 ? "a month ago" : `${months} months ago`;
}

export default function StillTrue({
  slug,
  lastVerifiedAt,
}: {
  slug: string;
  lastVerifiedAt: string;
}) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pending, setPending] = useState<Field | null>(null);

  useEffect(() => {
    const visitorId = getVisitorId();
    fetch(`/api/cafes/${slug}/confirmations?visitorId=${encodeURIComponent(visitorId)}`)
      .then((r) => r.json())
      .then((d) =>
        setSummary({
          fields: d.fields ?? EMPTY,
          lastConfirmedAt: d.lastConfirmedAt ?? null,
          mine: d.mine ?? {},
        })
      )
      .catch(() => setSummary({ fields: EMPTY, lastConfirmedAt: null, mine: {} }));
  }, [slug]);

  async function answer(field: Field, stillTrue: boolean) {
    if (pending) return;
    setPending(field);
    try {
      const res = await fetch(`/api/cafes/${slug}/confirmations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: getVisitorId(), field, stillTrue }),
      });
      const d = await res.json();
      if (res.ok) {
        setSummary({
          fields: d.fields ?? EMPTY,
          lastConfirmedAt: d.lastConfirmedAt ?? null,
          mine: d.mine ?? {},
        });
      }
    } catch {
      /* offline — leave the counts as they were rather than faking a save */
    } finally {
      setPending(null);
    }
  }

  const counts = summary?.fields ?? EMPTY;
  const mine = summary?.mine ?? {};
  const total = Object.values(counts).reduce((n, c) => n + c.yes + c.no, 0);

  return (
    <div className="mt-8 rounded-lg border border-paper/10 bg-paper/[0.02] p-4">
      <p className="wa-mono text-paper/40">Still true?</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-paper/50">
        We last checked this cafe on {lastVerifiedAt}. Wifi gets worse and rules change. If
        you&apos;re sitting there now, one tap keeps the next person honest.
      </p>

      <div className="mt-4 space-y-2.5">
        {QUESTIONS.map(({ field, question }) => {
          const c = counts[field];
          const answered = mine[field];
          return (
            <div key={field} className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[13.5px] text-paper/70">{question}</span>
              <span className="flex items-center gap-1.5">
                <button
                  onClick={() => answer(field, true)}
                  disabled={pending !== null}
                  aria-pressed={answered === true}
                  className={`wa-mono rounded-full border px-3 py-1.5 transition-colors disabled:opacity-60 ${
                    answered === true
                      ? "border-emerald-400/50 bg-emerald-400/10 text-paper"
                      : "border-paper/15 text-paper/55 hover:text-paper"
                  }`}
                >
                  Yes {c.yes > 0 && <span className="text-paper/40">{c.yes}</span>}
                </button>
                <button
                  onClick={() => answer(field, false)}
                  disabled={pending !== null}
                  aria-pressed={answered === false}
                  className={`wa-mono rounded-full border px-3 py-1.5 transition-colors disabled:opacity-60 ${
                    answered === false
                      ? "border-paper/40 bg-paper/10 text-paper"
                      : "border-paper/15 text-paper/55 hover:text-paper"
                  }`}
                >
                  No {c.no > 0 && <span className="text-paper/40">{c.no}</span>}
                </button>
              </span>
            </div>
          );
        })}
      </div>

      <p className="wa-mono mt-3.5 text-paper/30">
        {summary === null
          ? "Loading…"
          : total === 0
            ? "No reader checks yet."
            : `${total} reader ${total === 1 ? "check" : "checks"}${
                summary.lastConfirmedAt ? `, last ${agoLabel(summary.lastConfirmedAt)}` : ""
              }.`}
      </p>
    </div>
  );
}
