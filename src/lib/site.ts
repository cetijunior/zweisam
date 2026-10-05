import type { Metadata } from "next";
import { routing, type AppLocale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/data/types";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/** Branded 1200×630 link-preview image (generated from the hero film still). */
export const DEFAULT_OG_IMAGE = {
  url: "/brand/og.jpg",
  width: 1200,
  height: 630,
  alt: "Klick Berlin — celebration photography",
};

export const PUBLIC_PATHS = [
  "",
  "/work",
  "/about",
  "/contact",
  "/impressum",
  "/datenschutz",
] as const;

export type PublicPath = (typeof PUBLIC_PATHS)[number] | `/work/${string}`;

/** Canonical + hreflang alternates + OpenGraph for one localized public page. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  settings,
  image,
  noindex,
}: {
  locale: AppLocale;
  path: PublicPath;
  title: string;
  description: string;
  settings: SiteSettings;
  image?: { url: string; alt: string };
  noindex?: boolean;
}): Metadata {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}${path}`]),
  );
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ...languages, "x-default": `/${routing.defaultLocale}${path}` },
    },
    openGraph: {
      type: "website",
      siteName: settings.studioName,
      title,
      description,
      url: `/${locale}${path}`,
      locale: locale === "de" ? "de_DE" : "en_US",
      images: [image ? { url: image.url, alt: image.alt } : DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image ? image.url : DEFAULT_OG_IMAGE.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
