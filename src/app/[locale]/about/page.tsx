import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutContent } from "@/components/about/AboutContent";
import {
  getAboutBody,
  getAboutHeadline,
  getPhotographersLine,
} from "@/lib/data/selectors";
import { readSiteData } from "@/lib/data/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data = await readSiteData();
  return {
    title: `${locale === "de" ? "Über uns" : "About"} — ${data.settings.studioName}`,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const data = await readSiteData();
  const loc = locale as "de" | "en";
  const portrait =
    data.media.find((m) => m.id === "media-10") ?? data.media[0];
  const secondary =
    data.media.find((m) => m.id === "media-14") ?? data.media[1];

  const values = [
    { label: t("values.v1.label"), text: t("values.v1.text") },
    { label: t("values.v2.label"), text: t("values.v2.text") },
    { label: t("values.v3.label"), text: t("values.v3.text") },
  ];

  return (
    <AboutContent
      title={t("title")}
      headline={getAboutHeadline(data.settings, loc)}
      photographers={getPhotographersLine(data.settings, loc)}
      body={getAboutBody(data.settings, loc)}
      based={t("based")}
      location={data.settings.location}
      imageUrl={portrait.url}
      imageAlt={loc === "de" ? portrait.altDe : portrait.altEn}
      secondaryUrl={secondary?.url}
      secondaryAlt={
        secondary
          ? loc === "de"
            ? secondary.altDe
            : secondary.altEn
          : undefined
      }
      values={values}
      readMore={t("cta")}
    />
  );
}
