import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { WorkGallery } from "@/components/work/WorkGallery";
import { readSiteData } from "@/lib/data/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const data = await readSiteData();
  const { locale } = await params;
  return {
    title: `${locale === "de" ? "Arbeit" : "Work"} — ${data.settings.studioName}`,
  };
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
