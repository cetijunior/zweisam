import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ImageReveal, Reveal } from "@/components/motion/primitives";
import { EditCompare } from "@/components/features/EditCompare";
import { GoldenHour } from "@/components/features/GoldenHour";
import { AreasBlock, ServiceCard, ServiceCta } from "@/components/services/ServiceBits";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/StudioJsonLd";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { whatsappUrl } from "@/lib/contact";
import { getPublishedProjects, mediaAlt } from "@/lib/data/selectors";
import { readSiteData } from "@/lib/data/store";
import { BERLIN_AREAS, SERVICES, getService } from "@/lib/services";
import { pageMetadata, siteUrl } from "@/lib/site";

type Params = Promise<{ locale: string; slug: string }>;

/** Maps a service's portfolio category to the contact form's event type. */
const EVENT_TYPE: Record<string, string> = {
  couples: "couples",
  "gender-reveal": "gender-reveal",
  birthdays: "birthdays",
  kids: "kids",
};

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const svc = getService(slug);
  if (!svc) return {};
  const loc = locale as AppLocale;
  const { settings } = await readSiteData();
  return pageMetadata({
    locale: loc,
    path: `/services/${svc.slug}`,
    title: `${loc === "de" ? svc.titleDe : svc.titleEn} | ${settings.studioName}`,
    description: loc === "de" ? svc.shortDe : svc.shortEn,
    settings,
    keywords: svc.keywordsDe,
  });
}

export default async function ServicePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const svc = getService(slug);
  if (!svc) notFound();
  const loc = locale as AppLocale;
  const de = loc === "de";
  const t = await getTranslations("services");
  const data = await readSiteData();
  const { settings } = data;

  const name = de ? svc.nameDe : svc.nameEn;
  const title = de ? svc.titleDe : svc.titleEn;
  const faq = de ? svc.faqDe : svc.faqEn;
  const url = `${siteUrl}/${loc}/services/${svc.slug}`;
  const waText = t("waText", { studio: settings.studioName, service: name });

  const cat = data.categories.find((c) => c.slug === svc.category);
  const photos = getPublishedProjects(data)
    .filter((p) => cat && p.categoryIds.includes(cat.id))
    .flatMap((p) => data.media.filter((m) => m.projectId === p.id && m.published))
    .slice(0, 6);
  const related = SERVICES.filter((s) => s.group === svc.group && s.slug !== svc.slug).slice(0, 3);
  const eventType = EVENT_TYPE[svc.category] ?? "other";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: title,
          serviceType: name,
          description: de ? svc.bodyDe : svc.bodyEn,
          url,
          provider: { "@id": `${siteUrl}/#business`, name: settings.studioName },
          areaServed: [
            { "@type": "City", name: "Berlin" },
            ...BERLIN_AREAS.map((a) => ({ "@type": "Place", name: a })),
          ],
          availableChannel: settings.whatsapp
            ? { "@type": "ServiceChannel", serviceUrl: whatsappUrl(settings.whatsapp) }
            : undefined,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } },
          ],
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("home"), url: `${siteUrl}/${loc}` },
          { name: t("eyebrow"), url: `${siteUrl}/${loc}/services` },
          { name, url },
        ])}
      />

      <section className="mx-auto max-w-7xl px-5 pb-8 pt-24 md:px-8 md:pt-36">
        <Reveal>
          <nav aria-label="Breadcrumb" className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">
            <Link href="/" className="hover:text-ink">{t("home")}</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-ink">{t("eyebrow")}</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{name}</span>
          </nav>
          <h1 className="mt-6 max-w-4xl font-[family-name:var(--font-syne)] text-[clamp(2.2rem,6vw,4.5rem)] font-medium leading-[1.04] tracking-[-0.03em]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl font-[family-name:var(--font-instrument)] text-xl italic leading-snug text-ink-soft md:text-2xl">
            {de ? svc.shortDe : svc.shortEn}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            {settings.whatsapp ? (
              <a
                href={whatsappUrl(settings.whatsapp, waText)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 text-sm font-medium text-white transition hover:brightness-105"
              >
                {t("ctaWhatsapp")}
              </a>
            ) : null}
            <Link href={{ pathname: "/contact", query: { type: eventType } }} className="btn-ghost">
              {t("ctaForm")}
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-8 md:grid-cols-12 md:px-8">
        <Reveal className="md:col-span-7">
          <p className="text-base leading-relaxed text-ink-soft md:text-lg">{de ? svc.bodyDe : svc.bodyEn}</p>
          <h2 className="mt-10 font-[family-name:var(--font-syne)] text-xl font-medium">{t("faq")}</h2>
          <div className="mt-4 border-t border-line pt-4">
            <h3 className="font-medium">{faq.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{faq.a}</p>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="space-y-10 md:col-span-4 md:col-start-9">
          <div>
            <h2 className="text-[0.7rem] uppercase tracking-[0.24em] text-muted">{t("includes")}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {(de ? svc.includesDe : svc.includesEn).map((i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden className="text-accent">—</span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[0.7rem] uppercase tracking-[0.24em] text-muted">{t("spots")}</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{svc.spots.join(" · ")}</p>
          </div>
          <GoldenHour compact />
        </Reveal>
      </section>

      {photos.length ? (
        <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
          <Reveal className="mb-4 md:mb-6">
            <EditCompare src={photos[0].url} alt={`${mediaAlt(photos[0], loc)} – ${title}`} />
          </Reveal>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {photos.slice(1).map((m, i) => (
              <ImageReveal key={m.id} delay={(i % 3) * 0.05}>
                <div className="relative aspect-[4/5] bg-line">
                  <Image
                    src={m.url}
                    alt={`${mediaAlt(m, loc)} – ${title}`}
                    fill
                    sizes="(max-width:768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </ImageReveal>
            ))}
          </div>
          <Link href="/work" className="btn-ghost mt-6">{t("work")} →</Link>
        </section>
      ) : null}

      {related.length ? (
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <h2 className="mb-5 text-[0.7rem] uppercase tracking-[0.24em] text-muted">{t("related")}</h2>
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {related.map((s) => (
              <ServiceCard
                key={s.slug}
                href={`/services/${s.slug}`}
                name={de ? s.nameDe : s.nameEn}
                short={de ? s.shortDe : s.shortEn}
              />
            ))}
          </div>
        </section>
      ) : null}

      <AreasBlock title={t("areasTitle")} body={t("areasBody")} prefix={t("photographer")} />
      <ServiceCta
        title={t("ctaTitle")}
        body={t("ctaBody")}
        whatsapp={settings.whatsapp}
        waText={waText}
        waLabel={t("ctaWhatsapp")}
        formLabel={t("ctaForm")}
        formHref={`/${loc}/contact?type=${eventType}`}
      />
    </>
  );
}
