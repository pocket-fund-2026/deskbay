"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCookieConsent, setCookieConsent } from "@/lib/cookieConsent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);
  }, []);

  if (!visible) return null;

  function choose(value: "accepted" | "declined") {
    setCookieConsent(value);
    setVisible(false);
  }

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-paper/15 bg-ink/95 px-5 backdrop-blur-sm"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))", paddingTop: "1rem" }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-[13px] leading-relaxed text-paper/70">
          This site uses Google Analytics to see which pages get read. It only turns on if you
          accept.{" "}
          <Link href="/privacy" className="underline decoration-paper/30 underline-offset-2 hover:text-paper">
            Privacy Policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => choose("declined")}
            className="wa-mono rounded-full border border-paper/15 px-4 py-2 text-paper/65 transition-colors hover:text-paper"
          >
            Decline
          </button>
          <button
            onClick={() => choose("accepted")}
            className="wa-mono rounded-full bg-paper px-4 py-2 text-ink transition-opacity hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
