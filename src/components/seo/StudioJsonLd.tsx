import type { SiteSettings } from "@/lib/data/types";
import { getTagline } from "@/lib/data/selectors";
import { siteUrl } from "@/lib/site";
import { BERLIN_AREAS, SERVICES, serviceName } from "@/lib/services";

/** schema.org business data so search engines can show the studio as a local photographer. */
export function StudioJsonLd({
  settings,
  locale,
  image,
}: {
  settings: SiteSettings;
  locale: "de" | "en";
  image?: string;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": `${siteUrl}/#business`,
    additionalType: "https://schema.org/Photographer",
    name: settings.studioName,
    alternateName: [`${settings.studioName} Fotografie`, `${settings.studioName} Photography`, settings.handle].filter(Boolean),
    slogan: getTagline(settings, locale),
    logo: `${siteUrl}/icon.png`,
    priceRange: "€€",
    knowsLanguage: ["de", "en"],
    geo: { "@type": "GeoCoordinates", latitude: 52.52, longitude: 13.405 },
    description: getTagline(settings, locale),
    url: `${siteUrl}/${locale}`,
    email: settings.email,
    image: image ? new URL(image, siteUrl).toString() : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.location,
      addressCountry: "DE",
    },
    areaServed: [
      { "@type": "City", name: "Berlin" },
      ...BERLIN_AREAS.map((name) => ({ "@type": "Place", name })),
    ],
    telephone: settings.phone || (settings.whatsapp ? `+${settings.whatsapp}` : undefined),
    contactPoint: settings.whatsapp
      ? {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: `+${settings.whatsapp}`,
          email: settings.email,
          availableLanguage: ["German", "English"],
          url: `https://wa.me/${settings.whatsapp}`,
        }
      : undefined,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "de" ? "Fotografie-Leistungen" : "Photography services",
      itemListElement: SERVICES.map((svc) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: serviceName(svc, locale),
          url: `${siteUrl}/${locale}/services/${svc.slug}`,
        },
      })),
    },
    sameAs: [settings.instagram, settings.tiktok].filter(Boolean),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: settings.studioName,
    alternateName: [`${settings.studioName} Fotografie`, "klickberlin.com"],
    url: siteUrl,
    inLanguage: ["de", "en"],
    publisher: { "@id": `${siteUrl}/#business` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([json, website]).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** FAQPage data so the questions can appear as rich results. */
export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(json).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Any schema.org object as a JSON-LD script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
