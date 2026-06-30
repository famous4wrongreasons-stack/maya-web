import Script from "next/script";

const COUNTER_ID = (process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "110285869").trim();
const WEBVISOR_ENABLED = process.env.NEXT_PUBLIC_YANDEX_METRIKA_WEBVISOR !== "false";
const IS_VALID_COUNTER = /^\d+$/.test(COUNTER_ID || "");

export default function YandexMetrika() {
  if (!IS_VALID_COUNTER) return null;

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}", "ym");

            ym(${COUNTER_ID}, "init", {
              ssr: true,
              webvisor: ${WEBVISOR_ENABLED ? "true" : "false"},
              clickmap: true,
              ecommerce: "dataLayer",
              referrer: document.referrer,
              url: location.href,
              accurateTrackBounce: true,
              trackLinks: true,
            });
          `,
        }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${COUNTER_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
