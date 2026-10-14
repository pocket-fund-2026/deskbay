import Link from "next/link";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";

const SITE_URL = "https://bombaycafemap.com";
const TITLE = "Contact";
const DESCRIPTION =
  "How to reach Bombay Cafe Map: corrections to a cafe's details, new cafe suggestions, removal requests and press questions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Bombay Cafe Map", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
  ],
};

const contactLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Bombay Cafe Map",
  url: `${SITE_URL}/contact`,
};

const linkClass = "underline decoration-paper/30 underline-offset-2 hover:text-paper";

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

export default function ContactPage() {
  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-paper sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
      />
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="wa-mono -my-2 py-2 text-paper/65 transition-colors hover:text-paper">
            ← Bombay Cafe Map
          </Link>
          <ThemeToggle />
        </div>

        <h1 className="font-display mt-6 text-[clamp(1.7rem,4vw,2.3rem)] font-medium leading-tight">
          Contact
        </h1>

        <p className="mt-5 text-[15px] leading-relaxed text-paper/75">
          Bombay Cafe Map is a small, independently run site that scores Mumbai cafes on how
          good they are to work from. There is no support desk or phone line. The channels
          below are the ones this project actually monitors.
        </p>

        <Section title="Message us on Instagram">
          <p>
            The fastest way to reach the project is a direct message to{" "}
            <a
              href="https://www.instagram.com/bombaycafemap/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              @bombaycafemap on Instagram
            </a>
            . It is the only channel currently monitored, so please use it for anything that is
            not a new cafe suggestion.
          </p>
        </Section>

        <Section title="Suggest a cafe">
          <p>
            Know a Mumbai cafe that belongs on the map? Use the{" "}
            <Link href="/submit" className={linkClass}>
              submission form
            </Link>
            . Every submission is reviewed before anything is published, and a cafe only gets a
            workability score once there is published evidence to cite.
          </p>
        </Section>

        <Section title="Corrections and removal requests">
          <p>
            If a cafe&apos;s address, hours or a cited finding is wrong, or you run a cafe and want
            an entry corrected, message us on Instagram with the cafe name and what should change.
            The same channel handles requests to remove a comment or vote, as described in the{" "}
            <Link href="/privacy" className={linkClass}>
              Privacy Policy
            </Link>
            .
          </p>
        </Section>

        <Section title="How scores work">
          <p>
            Questions about why a cafe scored the way it did are answered on the{" "}
            <Link href="/about" className={linkClass}>
              About page
            </Link>
            , which sets out the nine weighted factors and the sourcing rules. Scores are editorial
            and are not an official rating from the cafes themselves.
          </p>
        </Section>

        <Link href="/" className="wa-btn wa-btn--solid mt-10 !bg-paper !text-ink">
          Back to Bombay Cafe Map
        </Link>
      </div>
    </main>
  );
}
