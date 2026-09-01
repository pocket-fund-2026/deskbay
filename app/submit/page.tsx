import Link from "next/link";
import type { Metadata } from "next";
import SubmitForm from "./SubmitForm";

export const metadata: Metadata = {
  title: "Submit a cafe",
  description: "Know a Mumbai cafe that belongs on Deskbay? Tell us about it.",
  alternates: { canonical: "/submit" },
};

export default function SubmitPage() {
  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="wa-mono text-paper/45 hover:text-paper">
          ← Deskbay
        </Link>
        <h1 className="font-display mt-6 text-[clamp(1.6rem,3.6vw,2.1rem)] font-medium tracking-tight">
          Submit a cafe
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-paper/60">
          Know somewhere in Bandra or South Bombay that deserves a place on the map? Tell us the
          basics — we verify wifi, power and seating against published sources before it goes
          live.
        </p>
        <SubmitForm />
      </div>
    </main>
  );
}
