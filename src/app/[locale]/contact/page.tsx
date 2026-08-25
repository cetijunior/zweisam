import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { readSiteData } from "@/lib/data/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data = await readSiteData();
  return {
    title: `${locale === "de" ? "Anfragen" : "Inquire"} — ${data.settings.studioName}`,
  };
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
