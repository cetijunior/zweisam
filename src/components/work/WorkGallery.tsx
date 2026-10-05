"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DrawLine, ImageReveal, Reveal, ScrollWords } from "@/components/motion/primitives";
import { categoryName, mediaAlt, projectSlug, projectTitle } from "@/lib/data/selectors";
import { Lightbox, type LightboxItem } from "@/components/work/Lightbox";
import { StoryCards } from "@/components/work/ShootView";
import type { CategorySlug, SiteData } from "@/lib/data/types";

export function WorkGallery({
  data,
  initialCategory,
}: {
  data: SiteData;
  initialCategory?: string;
}) {
  const t = useTranslations("work");
  const locale = useLocale() as "de" | "en";
  const [active, setActive] = useState<string>(initialCategory ?? "all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const categories = [...data.categories].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  const projects = useMemo(() => {
    return data.projects
      .filter((p) => p.published)
      .filter((p) => {
        if (active === "all") return true;
        const cat = categories.find((c) => c.slug === active);
        return cat ? p.categoryIds.includes(cat.id) : true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [active, categories, data.projects]);

  const images = useMemo(() => {
    return projects.flatMap((p) =>
      data.media
        .filter((m) => m.projectId === p.id && m.published)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((m) => ({ media: m, project: p })),
    );
  }, [data.media, projects]);

  const lightboxItems: LightboxItem[] = images.map(({ media, project }) => ({
    id: media.id,
    url: media.url,
    width: media.width,
    height: media.height,
    alt: mediaAlt(media, locale),
    caption: projectTitle(project, locale),
    href: `/work/${projectSlug(project)}`,
  }));

  return (
    <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
      <Reveal>
        <ScrollWords
          as="h1"
          text={t("title")}
          className="font-[family-name:var(--font-syne)] text-4xl font-medium tracking-tight sm:text-5xl md:text-7xl"
        />
        <DrawLine className="mt-6 max-w-14 sm:mt-8 sm:max-w-16" />
      </Reveal>

      <div className="sticky top-14 z-20 -mx-5 mt-8 bg-paper/90 px-5 py-2 backdrop-blur-md md:static md:mx-0 md:mt-12 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <div className="filter-scroll md:flex md:flex-wrap md:gap-x-6 md:gap-y-3 md:overflow-visible md:px-0">
          <FilterChip
            label={t("all")}
            active={active === "all"}
            onClick={() => {
              setActive("all");
              setLightbox(null);
            }}
          />
          {categories.map((cat) => (
            <FilterChip
              key={cat.id}
              label={categoryName(cat, locale)}
              active={active === cat.slug}
              onClick={() => setActive(cat.slug)}
            />
          ))}
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="-mx-5 mt-8 px-5 md:mx-0 md:mt-12 md:px-0">
          <p className="mb-4 text-[0.65rem] uppercase tracking-[0.24em] text-muted">
            {t("stories")}
          </p>
          <StoryCards data={data} projects={projects} />
          <p className="mb-2 mt-14 text-[0.65rem] uppercase tracking-[0.24em] text-muted">
            {t("allPhotos")}
          </p>
        </div>
      ) : null}

      {images.length === 0 ? (
        <p className="mt-16 text-muted">{t("empty")}</p>
      ) : (
        <div className="mt-6 columns-1 gap-3 sm:mt-10 sm:columns-2 sm:gap-5 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {images.map(({ media, project }, i) => (
              <motion.div
                key={media.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.55,
                  delay: (i % 6) * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mb-3 break-inside-avoid sm:mb-5"
              >
                <ImageReveal delay={(i % 5) * 0.03}>
                  <button
                    type="button"
                    onClick={() => setLightbox(i)}
                    className="group relative block w-full overflow-hidden text-left"
                  >
                    <Image
                      src={media.url}
                      alt={mediaAlt(media, locale)}
                      width={media.width}
                      height={media.height}
                      className="h-auto w-full object-cover transition duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-active:scale-[1.04]"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <div className="caption-touch pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:translate-y-2 sm:p-4">
                      <p className="font-[family-name:var(--font-syne)] text-sm font-medium text-white">
                        {projectTitle(project, locale)}
                      </p>
                    </div>
                  </button>
                </ImageReveal>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Lightbox items={lightboxItems} index={lightbox} onChange={setLightbox} />
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[0.68rem] uppercase tracking-[0.18em] transition-colors ${
        active ? "text-ink" : "text-muted hover:text-ink"
      }`}
    >
      <span className="relative">
        {label}
        {active ? (
          <motion.span
            layoutId="work-filter"
            className="absolute -bottom-1 left-0 h-px w-full bg-ink"
          />
        ) : null}
      </span>
    </button>
  );
}

export type { CategorySlug };
