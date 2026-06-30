import { BRAND } from "@/data/brand";

const SITE_URL = "https://malesthetic.pro";

export default function BusinessStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${SITE_URL}/#business`,
    name: BRAND.name,
    alternateName: "Malesthetic",
    url: SITE_URL,
    telephone: BRAND.phoneRaw,
    priceRange: "₽₽",
    image: `${SITE_URL}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.address,
      addressLocality: BRAND.city,
      addressCountry: "RU",
    },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "22:00",
    }],
    sameAs: [
      BRAND.telegram,
      BRAND.instagram,
      BRAND.vk,
      BRAND.yandexMap,
      BRAND.twogisMap,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
