import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutTeaser } from "@/components/about/AboutContent";
import { InquireTeaser } from "@/components/contact/ContactForm";
import { Hero, MomentsRail } from "@/components/home/HomeSections";
import { Faq, Marquee, Process, Services } from "@/components/home/InfoSections";
import { FAQ_KEYS } from "@/lib/faq";
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
import { FaqJsonLd, StudioJsonLd } from "@/components/seo/StudioJsonLd";
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
  const tFaq = await getTranslations("faq");
  const faq = FAQ_KEYS.map((k) => ({
    q: tFaq(`items.${k}.q`),
    a: tFaq(`items.${k}.a`),
  }));
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
      <FaqJsonLd items={faq} />
      <Hero cover={hero} />
      <Marquee />
      <WorkFragments data={data} />
      <CategoryChapters data={data} categories={data.categories} />
      <Services />
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
      <Process />
      <MomentsRail data={data} projects={projects} />
      <Faq />
      <InquireTeaser
        imageUrl={inquireImage.url}
        imageAlt={loc === "de" ? inquireImage.altDe : inquireImage.altEn}
      />
    </>
  );
}
