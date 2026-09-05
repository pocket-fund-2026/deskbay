import { listSubmissions } from "@/lib/submissions";
import { AREAS } from "@/lib/cafes";
import { approveAction, rejectAction, retryGeocodeAction } from "./actions";

export const dynamic = "force-dynamic";

function SubmissionCard({
  s,
  showActions,
}: {
  s: Awaited<ReturnType<typeof listSubmissions>>[number];
  showActions: boolean;
}) {
  const hasCoords = s.latitude !== null && s.longitude !== null;
  return (
    <div className="rounded-xl border border-paper/12 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[16px] font-medium">{s.name}</p>
          <p className="wa-mono mt-1 text-paper/40">
            {s.neighborhood} · {AREAS[s.area]?.name ?? s.area}
          </p>
        </div>
        <span
          className={`wa-mono shrink-0 rounded-full border px-2 py-1 ${
            s.status === "approved"
              ? "border-green-500/30 text-green-400"
              : s.status === "rejected"
                ? "border-red-500/30 text-red-400"
                : "border-paper/15 text-paper/50"
          }`}
        >
          {s.status}
        </span>
      </div>

      <p className="mt-2.5 text-[13.5px] text-paper/70">{s.address}</p>
      {!hasCoords && (
        <p className="wa-mono mt-1 text-red-400">Couldn&apos;t geocode this address — fix and retry below.</p>
      )}

      <div className="mt-2 flex flex-wrap gap-3 text-[13px]">
        {s.website && (
          <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-paper/50 underline">
            website
          </a>
        )}
        {s.instagram && (
          <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="text-paper/50 underline">
            instagram
          </a>
        )}
        {s.submitterEmail && <span className="text-paper/40">from {s.submitterEmail}</span>}
      </div>

      {s.notes && <p className="mt-2.5 text-[13.5px] leading-relaxed text-paper/60">{s.notes}</p>}

      <p className="wa-mono mt-3 text-paper/30">Submitted {new Date(s.createdAt).toLocaleString()}</p>

      {showActions && (
        <div className="mt-4 space-y-3 border-t border-paper/10 pt-4">
          {!hasCoords && (
            <form action={retryGeocodeAction} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={s.id} />
              <input
                type="text"
                name="address"
                defaultValue={s.address}
                className="min-w-[240px] flex-1 rounded-lg border border-paper/15 bg-paper/5 px-3 py-2 text-[13px] outline-none focus:border-accent"
              />
              <button type="submit" className="wa-btn border-paper/15">
                Retry geocode
              </button>
            </form>
          )}
          <div className="flex gap-2">
            {hasCoords && (
              <form action={approveAction}>
                <input type="hidden" name="id" value={s.id} />
                <button type="submit" className="wa-btn wa-btn--solid !bg-paper !text-ink">
                  Approve — goes live immediately
                </button>
              </form>
            )}
            <form action={rejectAction}>
              <input type="hidden" name="id" value={s.id} />
              <button type="submit" className="wa-btn border-paper/15">
                Reject
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function AdminPage() {
  const submissions = await listSubmissions();
  const pending = submissions.filter((s) => s.status === "pending");
  const reviewed = submissions.filter((s) => s.status !== "pending");

  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-[24px] font-medium">Cafe submissions</h1>
        <p className="wa-mono mt-2 text-paper/40">{pending.length} pending review</p>

        <div className="mt-6 space-y-3">
          {pending.length === 0 && <p className="text-paper/50">Nothing waiting on review.</p>}
          {pending.map((s) => (
            <SubmissionCard key={s.id} s={s} showActions />
          ))}
        </div>

        {reviewed.length > 0 && (
          <>
            <p className="wa-mono mb-3 mt-10 text-paper/40">Reviewed</p>
            <div className="space-y-3">
              {reviewed.map((s) => (
                <SubmissionCard key={s.id} s={s} showActions={false} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
