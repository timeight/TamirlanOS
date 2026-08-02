import Script from "next/script";

const PROJECT_ID = "xw937qh0vc";

/**
 * Microsoft Clarity. Loaded after hydration so the boot sequence and the
 * desktop stay on the critical path; analytics never delays first paint.
 */
export function ClarityScript() {
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${PROJECT_ID}");`}
    </Script>
  );
}
