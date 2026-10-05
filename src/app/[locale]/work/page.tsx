import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { WorkGallery } from "@/components/work/WorkGallery";
import { readSiteData } from "@/lib/data/store";
import { getTagline } from "@/lib/data/selectors";
import type { AppLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const data = await readSiteData();
  const { locale } = await params;
  const loc = locale as AppLocale;
  return pageMetadata({
    locale: loc,
    path: "/work",
    title: `${loc === "de" ? "Arbeit" : "Work"} — ${data.settings.studioName}`,
    description: getTagline(data.settings, loc),
    settings: data.settings,
  });
}

export default async function WorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ c?: string }>;
}) {
  const { locale } = await params;
  const { c } = await searchParams;
  setRequestLocale(locale);
  const data = await readSiteData();

  return <WorkGallery data={data} initialCategory={c} />;
}
