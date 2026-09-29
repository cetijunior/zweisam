import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutTeaser } from "@/components/about/AboutContent";
import { InquireTeaser } from "@/components/contact/ContactForm";
import { Hero, MomentsRail } from "@/components/home/HomeSections";
import {
  CategoryChapters,
  WorkFragments,
} from "@/components/home/WorkFragments";
import {
  getAboutBody,
  getAboutHeadline,
  getHeroImage,
  getPhotographersLine,
  getPublishedProjects,
  getTagline,
  mediaAlt,
} from "@/lib/data/selectors";
import type { AppLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { StudioJsonLd } from "@/components/seo/StudioJsonLd";
import { readSiteData } from "@/lib/data/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data = await readSiteData();
  const { settings } = data;
  const loc = locale as AppLocale;
  const hero = getHeroImage(data);
  return pageMetadata({
    locale: loc,
    path: "",
    title: `${settings.studioName} — ${settings.location}`,
    description: getTagline(settings, loc),
    settings,
    image: { url: hero.url, alt: mediaAlt(hero, loc) },
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tAbout = await getTranslations("about");
  const tHome = await getTranslations("home");
  const data = await readSiteData();
  const loc = locale as "de" | "en";
  const hero = getHeroImage(data);
  const projects = getPublishedProjects(data);
  const aboutImage =
    data.media.find((m) => m.id === "media-10") ?? data.media[0];
  const inquireImage =
    data.media.find((m) => m.id === "media-4") ?? data.media[2] ?? hero;

  return (
    <>
      <StudioJsonLd settings={data.settings} locale={loc} image={hero.url} />
      <Hero cover={hero} />
      <WorkFragments data={data} />
      <CategoryChapters data={data} categories={data.categories} />
      <AboutTeaser
        title={tAbout("title")}
        headline={getAboutHeadline(data.settings, loc)}
        photographers={getPhotographersLine(data.settings, loc)}
        body={getAboutBody(data.settings, loc)}
        location={data.settings.location}
        imageUrl={aboutImage.url}
        imageAlt={loc === "de" ? aboutImage.altDe : aboutImage.altEn}
        cta={tHome("aboutCta")}
      />
      <MomentsRail data={data} projects={projects} />
      <InquireTeaser
        imageUrl={inquireImage.url}
        imageAlt={loc === "de" ? inquireImage.altDe : inquireImage.altEn}
      />
    </>
  );
}
