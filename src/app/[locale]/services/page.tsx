import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/primitives";
import { ShootFinder } from "@/components/features/ShootFinder";
import { AreasBlock, ServiceCard, ServiceCta } from "@/components/services/ServiceBits";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/StudioJsonLd";
import type { AppLocale } from "@/i18n/routing";
import { mediaAlt, serviceCovers } from "@/lib/data/selectors";
import { readSiteData } from "@/lib/data/store";
import { SERVICE_GROUPS, SERVICES } from "@/lib/services";
import { pageMetadata, siteUrl } from "@/lib/site";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale: loc, namespace: "services" });
  const { settings } = await readSiteData();
  return pageMetadata({
    locale: loc,
    path: "/services",
    title: `${loc === "de" ? "Leistungen – Fotograf für Feiern in Berlin" : "Services – celebration photographer in Berlin"} | ${settings.studioName}`,
    description: t("metaIndex"),
    settings,
    keywords: SERVICES.flatMap((s) => s.keywordsDe.slice(0, 1)),
  });
}

export default async function ServicesPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as AppLocale;
  const t = await getTranslations("services");
  const data = await readSiteData();
  const { settings } = data;
  const covers = serviceCovers(data);
  const groups = Object.keys(SERVICE_GROUPS) as (keyof typeof SERVICE_GROUPS)[];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("home"), url: `${siteUrl}/${loc}` },
          { name: t("eyebrow"), url: `${siteUrl}/${loc}/services` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: SERVICES.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: loc === "de" ? s.titleDe : s.titleEn,
            url: `${siteUrl}/${loc}/services/${s.slug}`,
          })),
        }}
      />
      <section className="mx-auto max-w-7xl px-5 pb-6 pt-24 md:px-8 md:pt-36">
        <Reveal>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-muted">{t("eyebrow")}</p>
          <h1 className="mt-5 max-w-4xl font-[family-name:var(--font-syne)] text-[clamp(2.2rem,6vw,4.5rem)] font-medium leading-[1.04] tracking-[-0.03em]">
            {t("indexTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">
            {t("indexIntro", { count: SERVICES.length })}
          </p>
        </Reveal>
      </section>

      <ShootFinder />

      {groups.map((g) => (
        <section key={g} className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-10">
          <h2 className="mb-5 text-[0.7rem] uppercase tracking-[0.24em] text-muted">
            {SERVICE_GROUPS[g][loc]}
          </h2>
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.filter((s) => s.group === g).map((s) => (
              <ServiceCard
                key={s.slug}
                href={`/services/${s.slug}`}
                name={loc === "de" ? s.nameDe : s.nameEn}
                short={loc === "de" ? s.shortDe : s.shortEn}
                image={covers[s.slug] ? { src: covers[s.slug]!.url, alt: `${mediaAlt(covers[s.slug]!, loc)} – ${loc === "de" ? s.nameDe : s.nameEn}` } : undefined}
              />
            ))}
          </div>
        </section>
      ))}

      <AreasBlock title={t("areasTitle")} body={t("areasBody")} prefix={t("photographer")} />
      <ServiceCta
        title={t("ctaTitle")}
        body={t("ctaBody")}
        whatsapp={settings.whatsapp}
        waText={t("waText", { studio: settings.studioName, service: t("eyebrow") })}
        waLabel={t("ctaWhatsapp")}
        formLabel={t("ctaForm")}
        formHref={`/${loc}/contact`}
      />
    </>
  );
}
