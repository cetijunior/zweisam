import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutTeaser } from "@/components/about/AboutContent";
import { InquireTeaser } from "@/components/contact/ContactForm";
import { Hero, MomentsRail } from "@/components/home/HomeSections";
import { Faq, Marquee, Services } from "@/components/home/InfoSections";
import { FAQ_KEYS } from "@/lib/faq";
import { BusinessCard } from "@/components/features/BusinessCard";
import { CraftSection } from "@/components/features/CraftSection";
import { ProcessShowcase } from "@/components/features/ProcessShowcase";
import { ShootFinder } from "@/components/features/ShootFinder";
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
  return pageMetadata({
    locale: loc,
    path: "",
    title:
      loc === "de"
        ? `${settings.studioName} – Fotograf in Berlin für Paare, Gender Reveals & Feiern`
        : `${settings.studioName} – Photographer in Berlin for couples, gender reveals & celebrations`,
    description:
      loc === "de"
        ? `${settings.studioName}: Fotografen-Paar in Berlin für Paarshootings, Gender Reveals, Geburtstage, Kindergeburtstage, Taufen und Feiern. Natürlich, nah, ohne steifes Posieren – jetzt per WhatsApp anfragen.`
        : `${settings.studioName}: a photographer couple in Berlin for couple shoots, gender reveals, birthdays, kids' parties, christenings and celebrations. Natural, close, never stiff – message us on WhatsApp.`,
    settings,
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
  const processImages = ["media-1", "media-21", "media-10", "media-4", "media-5", "media-22"]
    .map((id) => data.media.find((m) => m.id === id)?.url)
    .filter((u): u is string => Boolean(u));
  const craftImage =
    data.media.find((m) => m.id === "media-7") ?? data.media[1] ?? hero;

  return (
    <>
      <StudioJsonLd settings={data.settings} locale={loc} image={hero.url} />
      <FaqJsonLd items={faq} />
      <Hero cover={hero} />
      <Marquee />
      <WorkFragments data={data} />
      <CategoryChapters data={data} categories={data.categories} />
      <Services />
      <ShootFinder />
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
      <ProcessShowcase images={processImages} />
      <CraftSection
        imageUrl={craftImage.url}
        imageAlt={loc === "de" ? craftImage.altDe : craftImage.altEn}
      />
      <MomentsRail data={data} projects={projects} />
      <Faq />
      <BusinessCard />
      <InquireTeaser
        imageUrl={inquireImage.url}
        imageAlt={loc === "de" ? inquireImage.altDe : inquireImage.altEn}
      />
    </>
  );
}
