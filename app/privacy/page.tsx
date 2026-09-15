import Link from "next/link";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";
const TITLE = "Privacy Policy";
const DESCRIPTION =
  "What Bombay Cafe Map collects, why, and what it never does with it: analytics, the optional near-me location check, anonymous votes and comments, and cafe submissions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Bombay Cafe Map", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${SITE_URL}/privacy` },
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

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="wa-mono -my-2 py-2 text-paper/50 transition-colors hover:text-paper">
            ← Bombay Cafe Map
          </Link>
          <ThemeToggle />
        </div>

        <h1 className="font-display mt-6 text-[clamp(1.7rem,4vw,2.3rem)] font-medium leading-tight">
          Privacy Policy
        </h1>
        <p className="wa-mono mt-2 text-paper/45">Last updated 15 September 2026</p>

        <p className="mt-5 text-[15px] leading-relaxed text-paper/75">
          Bombay Cafe Map is a small, independently run site. This page lists everything the
          site collects, in plain terms, and says so directly where it collects nothing.
        </p>

        <Section title="Analytics">
          <p>
            The site uses Google Analytics to see which pages get read and roughly how visitors
            arrive (referrer, device type, approximate location from IP). Google Analytics sets
            cookies to do this. You can decline these when the cookie banner first appears, or
            change your choice any time from the link in the footer, and the rest of the site
            works exactly the same either way.
          </p>
        </Section>

        <Section title="&ldquo;Near me&rdquo;">
          <p>
            Turning on &ldquo;Near me&rdquo; asks your browser for your location, and the browser
            asks you first. That coordinate is used to sort the cafe list by distance in your
            own browser and is never sent to our servers or stored anywhere. Turning the toggle
            off, or refreshing the page, throws it away.
          </p>
        </Section>

        <Section title="Votes and comments">
          <p>
            Voting on a cafe or leaving a comment doesn&apos;t require an account. The site
            stores a random id in your browser&apos;s local storage the first time you do either,
            so you can change your own vote later and so the comment box can tell you&apos;re
            posting too fast — that id isn&apos;t linked to your name, email, or IP address
            anywhere in the database. Comments you post are public and shown on the cafe&apos;s
            page.
          </p>
        </Section>

        <Section title="Submitting a cafe">
          <p>
            The submission form asks for the cafe&apos;s details and, optionally, your email
            address in case we have follow-up questions. That email is stored only to review
            the submission and is never published or used for anything else. Leaving it blank
            doesn&apos;t affect whether the cafe gets added.
          </p>
        </Section>

        <Section title="What this site doesn&apos;t do">
          <p>
            No account system, no ad network, no third-party trackers beyond Google Analytics,
            and no selling or sharing of data with anyone else.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy, or a request to have a comment or vote removed:{" "}
            <a
              href="https://www.instagram.com/bombaycafemap/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-paper/30 underline-offset-2 hover:text-paper"
            >
              message @bombaycafemap on Instagram
            </a>{" "}
            — the only channel this project currently monitors.
          </p>
        </Section>

        <Link href="/" className="wa-btn wa-btn--solid mt-10 !bg-paper !text-ink">
          Back to Bombay Cafe Map
        </Link>
      </div>
    </main>
  );
}
