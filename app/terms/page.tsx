import Link from "next/link";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";
const TITLE = "Terms of Use";
const DESCRIPTION =
  "The terms for using Bombay Cafe Map: what the scores mean, the rules for votes, comments and submissions, and where liability stops.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Bombay Cafe Map", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Terms of Use", item: `${SITE_URL}/terms` },
  ],
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="font-display text-[19px] font-medium tracking-tight">{title}</h2>
      <div className="mt-2.5 space-y-2.5 text-[14.5px] leading-relaxed text-paper/70">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="wa-mono -my-2 py-2 text-paper/65 transition-colors hover:text-paper">
            ← Bombay Cafe Map
          </Link>
          <ThemeToggle />
        </div>

        <h1 className="font-display mt-6 text-[clamp(1.7rem,4vw,2.3rem)] font-medium leading-tight">
          Terms of Use
        </h1>
        <p className="wa-mono mt-2 text-paper/65">Last updated 15 September 2026</p>

        <p className="mt-5 text-[15px] leading-relaxed text-paper/75">
          Using Bombay Cafe Map means agreeing to these terms. They&apos;re short because the
          site does one thing: help you find a Mumbai cafe you can work from.
        </p>

        <Section title="The scores are an opinion, not a guarantee">
          <p>
            Workability scores are built from published evidence and cited on each cafe&apos;s
            page — see <Link href="/about" className="underline decoration-paper/30 underline-offset-2 hover:text-paper">how we score</Link>{" "}
            for the method. Wifi drops, cafes change their seating, and a listing can go stale
            between visits. Confirm anything that matters (hours, an outlet at your table)
            before you rely on it, and use the &ldquo;still true?&rdquo; check on a cafe&apos;s
            page if you find something wrong.
          </p>
        </Section>

        <Section title="Votes, comments and submissions">
          <p>
            Anyone can vote, comment, or submit a cafe without an account. In exchange: comments
            should be honest, about the cafe, and not abusive, spam, or someone else&apos;s
            copyrighted text. Submissions should be places that exist and that you believe
            belong on the map. We can remove or decline any of the three without notice,
            most often for spam caught after the fact rather than anything a real visitor
            would run into.
          </p>
        </Section>

        <Section title="Using the content">
          <p>
            The write-ups, scores and site design are Bombay Cafe Map&apos;s. Quoting a listing
            with a link back is fine; republishing the site&apos;s scored data wholesale as your
            own isn&apos;t, without asking first.
          </p>
        </Section>

        <Section title="No liability for what happens at a cafe">
          <p>
            Bombay Cafe Map isn&apos;t affiliated with the cafes it lists and isn&apos;t
            responsible for their prices, policies, or whether the table you wanted is free.
            The site is provided as-is, without warranty that any listing is current or
            complete.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            These terms may be updated as the site adds features. Continuing to use the site
            after a change means you accept the new terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms:{" "}
            <a
              href="https://www.instagram.com/bombaycafemap/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-paper/30 underline-offset-2 hover:text-paper"
            >
              message @bombaycafemap on Instagram
            </a>
            .
          </p>
        </Section>

        <p className="wa-mono mt-9 text-paper/65">
          See also the <Link href="/privacy" className="underline decoration-paper/20 underline-offset-2 hover:text-paper">Privacy Policy</Link>.
        </p>

        <Link href="/" className="wa-btn wa-btn--solid mt-6 !bg-paper !text-ink">
          Back to Bombay Cafe Map
        </Link>
      </div>
    </main>
  );
}
