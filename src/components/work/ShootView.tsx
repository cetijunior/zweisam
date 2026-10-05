"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  DrawLine,
  ImageReveal,
  KineticWords,
  ParallaxFrame,
  Reveal,
} from "@/components/motion/primitives";
import { Lightbox, type LightboxItem } from "@/components/work/Lightbox";
import {
  categoryName,
  getCover,
  mediaAlt,
  projectSlug,
  projectStory,
  projectTitle,
} from "@/lib/data/selectors";
import type { MediaItem, Project, SiteData } from "@/lib/data/types";

/** One photoshoot as a story: cover, details, full gallery, and the next shoot. */
export function ShootView({
  data,
  project,
  media,
  next,
}: {
  data: SiteData;
  project: Project;
  media: MediaItem[];
  next?: Project;
}) {
  const t = useTranslations("shoot");
  const locale = useLocale() as "de" | "en";
  const [open, setOpen] = useState<number | null>(null);
  const cover = getCover(data, project) ?? media[0];
  const title = projectTitle(project, locale);
  const story = projectStory(project, locale);
  const cats = data.categories.filter((c) => project.categoryIds.includes(c.id));
  const nextCover = next ? getCover(data, next) : undefined;
  const date = new Date(project.date).toLocaleDateString(
    locale === "de" ? "de-DE" : "en-GB",
    { month: "long", year: "numeric" },
  );

  const items: LightboxItem[] = media.map((m) => ({
    id: m.id,
    url: m.url,
    width: m.width,
    height: m.height,
    alt: mediaAlt(m, locale),
    caption: title,
  }));

  return (
    <article>
      <section className="relative h-[88svh] min-h-[520px] overflow-hidden bg-ink">
        {cover ? (
          <ParallaxFrame className="absolute inset-0" strength={60}>
            <Image
              src={cover.url}
              alt={mediaAlt(cover, locale)}
              fill
              priority
              sizes="100vw"
              className="scale-110 object-cover"
            />
          </ParallaxFrame>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-14 text-white md:px-8 md:pb-20">
          <Link
            href="/work"
            className="btn-ghost mb-6 self-start text-[0.65rem] text-white/75"
          >
            ← {t("back")}
          </Link>
          <p className="mb-4 text-[0.65rem] uppercase tracking-[0.26em] text-white/70">
            {cats.map((c) => categoryName(c, locale)).join(" · ")}
          </p>
          <KineticWords
            text={title}
            className="max-w-4xl font-[family-name:var(--font-syne)] text-[clamp(2.2rem,7vw,5rem)] font-medium leading-[1.04] tracking-[-0.03em]"
          />
          <p className="mt-5 font-[family-name:var(--font-instrument)] text-xl italic text-white/75">
            {project.location} — {date}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-8 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-muted">
              {t("photos", { count: media.length })}
            </p>
            <DrawLine className="mt-5 max-w-14" />
          </Reveal>
          {story ? (
            <Reveal delay={0.08} className="md:col-span-7 md:col-start-6">
              <p className="font-[family-name:var(--font-instrument)] text-[clamp(1.4rem,3vw,2rem)] leading-snug text-ink-soft">
                {story}
              </p>
            </Reveal>
          ) : null}
        </div>

        <div className="mt-12 columns-1 gap-3 sm:columns-2 sm:gap-5 lg:columns-3 md:mt-16">
          {media.map((m, i) => (
            <div key={m.id} className="mb-3 break-inside-avoid sm:mb-5">
              <ImageReveal delay={(i % 4) * 0.04}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group relative block w-full overflow-hidden"
                >
                  <Image
                    src={m.url}
                    alt={mediaAlt(m, locale)}
                    width={m.width}
                    height={m.height}
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="h-auto w-full bg-line object-cover transition duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </button>
              </ImageReveal>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <Reveal>
            <p className="font-[family-name:var(--font-syne)] text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight tracking-tight">
              {t("cta")}
            </p>
            <Link href="/contact" className="btn-line mt-8">
              {t("ctaButton")}
            </Link>
          </Reveal>
          {next && nextCover ? (
            <Reveal delay={0.08}>
              <Link
                href={`/work/${projectSlug(next)}`}
                className="group relative block aspect-[16/10] overflow-hidden bg-line"
              >
                <Image
                  src={nextCover.url}
                  alt={mediaAlt(nextCover, locale)}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover transition duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/65">
                    {t("next")} →
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-syne)] text-xl font-medium md:text-2xl">
                    {projectTitle(next, locale)}
                  </p>
                </div>
              </Link>
            </Reveal>
          ) : null}
        </div>
      </section>

      <Lightbox items={items} index={open} onChange={setOpen} />
    </article>
  );
}

/** Cover cards for each shoot — used on the Work page */
export function StoryCards({ data, projects }: { data: SiteData; projects: Project[] }) {
  const locale = useLocale() as "de" | "en";
  return (
    <div className="h-scroll md:grid md:grid-cols-3 md:gap-5 md:overflow-visible">
      {projects.map((p, i) => {
        const cover = getCover(data, p);
        if (!cover) return null;
        const count = data.media.filter((m) => m.projectId === p.id && m.published).length;
        return (
          <Reveal key={p.id} delay={Math.min(i, 5) * 0.05} className="md:contents">
            <Link
              href={`/work/${projectSlug(p)}`}
              className="group relative block aspect-[4/5] w-[72vw] max-w-[300px] overflow-hidden bg-line md:w-auto md:max-w-none"
            >
              <Image
                src={cover.url}
                alt={mediaAlt(cover, locale)}
                fill
                sizes="(max-width:768px) 72vw, 33vw"
                className="object-cover transition duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-5">
                <p className="text-[0.6rem] uppercase tracking-[0.22em] text-white/60">
                  {p.location} · {count}
                </p>
                <p className="mt-1.5 font-[family-name:var(--font-syne)] text-lg font-medium leading-tight">
                  {projectTitle(p, locale)}
                </p>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
