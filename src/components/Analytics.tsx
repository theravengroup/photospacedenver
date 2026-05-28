import Script from "next/script";

/**
 * Analytics-ready slot. Renders nothing unless the matching env var is set, so
 * the site ships "prepared" without installing trackers. Add IDs in production:
 *   NEXT_PUBLIC_GA4_ID, NEXT_PUBLIC_CLARITY_ID, NEXT_PUBLIC_META_PIXEL_ID
 * CTA/form events flow through the data-event / data-cta-* attributes already
 * on buttons and forms.
 */
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA4_ID;
  const clarity = process.env.NEXT_PUBLIC_CLARITY_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  if (!ga && !clarity && !pixel) return null;

  return (
    <>
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}
      {clarity && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${clarity}");`}
        </Script>
      )}
      {pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
