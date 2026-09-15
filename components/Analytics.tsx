"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getCookieConsent, onCookieConsentChange } from "@/lib/cookieConsent";

/**
 * Google Analytics only starts once the cookie banner is accepted — loading
 * it unconditionally on every visit while asking for consent afterward
 * would make the banner theater. onCookieConsentChange lets an "Accept"
 * click start it immediately, without a reload.
 */
export default function Analytics({ measurementId }: { measurementId: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(getCookieConsent() === "accepted");
    return onCookieConsentChange((value) => setEnabled(value === "accepted"));
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');`}
      </Script>
    </>
  );
}
