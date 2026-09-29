import type { SiteSettings } from "@/lib/data/types";
import { getTagline } from "@/lib/data/selectors";
import { siteUrl } from "@/lib/site";

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
    "@type": "ProfessionalService",
    additionalType: "https://schema.org/Photographer",
    name: settings.studioName,
    description: getTagline(settings, locale),
    url: `${siteUrl}/${locale}`,
    email: settings.email,
    image: image ? new URL(image, siteUrl).toString() : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.location,
      addressCountry: "DE",
    },
    areaServed: settings.location,
    sameAs: [settings.instagram, settings.tiktok].filter(Boolean),
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
