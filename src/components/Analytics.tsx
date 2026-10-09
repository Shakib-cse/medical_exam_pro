"use client";

import Script from "next/script";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  META_PIXEL_ID,
  trackPageView,
} from "@/lib/analytics";

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const fullUrl = searchParams?.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
      trackPageView(fullUrl);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  return (
    <>
      {/* Route change tracker for SPA navigations */}
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>

      {/* Google Tag (GA4 + Google Ads) */}
      {(GA_MEASUREMENT_ID || GOOGLE_ADS_ID) && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID || GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-tags" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());

              ${
                GA_MEASUREMENT_ID
                  ? `gtag('config', '${GA_MEASUREMENT_ID}', {
                      page_path: window.location.pathname,
                    });`
                  : ""
              }

              ${
                GOOGLE_ADS_ID
                  ? `gtag('config', '${GOOGLE_ADS_ID}');`
                  : ""
              }
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel (Facebook Pixel) */}
      {META_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt="Meta Pixel"
            />
          </noscript>
        </>
      )}
    </>
  );
}
