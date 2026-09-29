import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { readSiteData } from "@/lib/data/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data = await readSiteData();
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale: loc, namespace: "contact" });
  return pageMetadata({
    locale: loc,
    path: "/contact",
    title: `${loc === "de" ? "Anfragen" : "Inquire"} — ${data.settings.studioName}`,
    description: t("intro"),
    settings: data.settings,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await readSiteData();
  const loc = locale as "de" | "en";
  const side =
    data.media.find((m) => m.id === "media-1") ?? data.media[0];

  return (
    <ContactForm
      sideImageUrl={side.url}
      sideImageAlt={loc === "de" ? side.altDe : side.altEn}
    />
  );
}
