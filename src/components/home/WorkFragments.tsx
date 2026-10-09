"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import {
  DrawLine,
  ImageReveal,
  ParallaxFrame,
  Reveal,
  ScrollWords,
} from "@/components/motion/primitives";
import { useIsMobile } from "@/lib/useIsMobile";
import {
  categoryName,
  getCover,
  mediaAlt,
  projectTitle,
} from "@/lib/data/selectors";
import type { Category, SiteData } from "@/lib/data/types";

/** Landing mosaic — fragments of every work category */
export function WorkFragments({ data }: { data: SiteData }) {
  const t = useTranslations("home");
  const tw = useTranslations("work");
  const locale = useLocale() as "de" | "en";
  const mobile = useIsMobile();
  const [active, setActive] = useState<string>("all");

  const categories = [...data.categories].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  const images = useMemo(() => {
    const projects = data.projects.filter((p) => p.published);
    return projects
      .flatMap((p) =>
        data.media
          .filter((m) => m.projectId === p.id && m.published)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((m) => ({ media: m, project: p })),
      )
      .filter(({ project }) => {
        if (active === "all") return true;
        const cat = categories.find((c) => c.slug === active);
        return cat ? project.categoryIds.includes(cat.id) : true;
      });
  }, [active, categories, data.media, data.projects]);

  const preview = images.slice(
    0,
    active === "all" ? (mobile ? 6 : 12) : mobile ? 4 : 9,
  );

  return (
    <section className="border-t border-line py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <p className="mb-2 text-[0.65rem] uppercase tracking-[0.28em] text-muted sm:mb-3 sm:text-[0.68rem]">
              {tw("title")}
            </p>
            <ScrollWords
              text={t("workPreview")}
              className="font-[family-name:var(--font-syne)] text-[1.85rem] font-medium tracking-tight sm:text-3xl md:text-5xl"
            />
            <DrawLine className="mt-5 max-w-14 sm:mt-6 sm:max-w-16" />
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/work" className="btn-ghost text-[0.7rem]">
              {t("viewAllWork")}
            </Link>
          </Reveal>
        </div>

        <div className="sticky top-14 z-20 -mx-5 mt-8 bg-paper/90 px-5 py-2 backdrop-blur-md md:static md:mx-0 md:mt-12 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <div className="filter-scroll md:flex md:flex-wrap md:gap-x-6 md:gap-y-3 md:overflow-visible md:px-0">
            <FilterChip
              label={tw("all")}
              active={active === "all"}
              onClick={() => setActive("all")}
              layoutId="home-work-filter"
            />
            {categories.map((cat) => (
              <FilterChip
                key={cat.id}
                label={categoryName(cat, locale)}
                active={active === cat.slug}
                onClick={() => setActive(cat.slug)}
                layoutId="home-work-filter"
              />
            ))}
          </div>
        </div>

        <div className="mt-5 columns-2 gap-2 sm:mt-10 sm:gap-4 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {preview.map(({ media, project }, i) => (
              <motion.div
                key={`${active}-${media.id}`}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: (i % 6) * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mb-2 break-inside-avoid sm:mb-4"
              >
                <ImageReveal delay={(i % 4) * 0.03}>
                  <Link
                    href={`/work?c=${
                      categories.find((c) =>
                        project.categoryIds.includes(c.id),
                      )?.slug ?? "couples"
                    }`}
                    className="group relative block overflow-hidden"
                  >
                    <Image
                      src={media.url}
                      alt={mediaAlt(media, locale)}
                      width={media.width}
                      height={media.height}
                      className="h-auto w-full bg-line object-cover transition duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-active:scale-[1.03]"
                      sizes="(max-width:1024px) 50vw, 33vw"
                    />
                    <div className="caption-touch pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:translate-y-1 sm:p-4">
                      <p className="font-[family-name:var(--font-syne)] text-sm font-medium text-white">
                        {projectTitle(project, locale)}
                      </p>
                    </div>
                  </Link>
                </ImageReveal>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/** One visual tile per category — snap carousel on mobile */
export function CategoryChapters({
  data,
  categories,
}: {
  data: SiteData;
  categories: Category[];
}) {
  const locale = useLocale() as "de" | "en";
  const t = useTranslations("home");

  const tiles = categories.map((cat) => {
    const project = data.projects.find(
      (p) => p.published && p.categoryIds.includes(cat.id),
    );
    const cover = project ? getCover(data, project) : undefined;
    return { cat, cover, project };
  });

  return (
    <section className="pb-4 pt-10 md:px-8 md:pb-6 md:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="px-5 md:px-0">
          <Reveal>
            <ScrollWords
              text={t("categories")}
              className="font-[family-name:var(--font-syne)] text-[1.85rem] font-medium tracking-tight sm:text-3xl md:text-4xl"
            />
            <DrawLine className="mt-5 mb-6 max-w-20 md:mt-8 md:mb-12 md:max-w-24" />
          </Reveal>
        </div>

        {/* Mobile: horizontal snap. Desktop: grid */}
        <div className="h-scroll px-5 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-3">
          {tiles.map(({ cat, cover, project }, i) => (
            <Reveal key={cat.id} delay={Math.min(i, 5) * 0.05} className="md:contents">
              <Link
                href={`/work?c=${cat.slug}`}
                className="group relative block aspect-[3/4] w-[78vw] max-w-[300px] overflow-hidden bg-line sm:w-[55vw] md:aspect-[4/5] md:w-auto md:max-w-none"
              >
                {cover ? (
                  <ImageReveal
                    delay={Math.min(i, 4) * 0.04}
                    className="absolute inset-0"
                  >
                    <ParallaxFrame className="h-full w-full" strength={36}>
                      <Image
                        src={cover.url}
                        alt={mediaAlt(cover, locale)}
                        fill
                        className="scale-110 object-cover transition duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.16] group-active:scale-[1.16]"
                        sizes="(max-width:768px) 80vw, 33vw"
                      />
                    </ParallaxFrame>
                  </ImageReveal>
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6">
                  <p className="text-[0.62rem] uppercase tracking-[0.22em] text-white/60">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1.5 font-[family-name:var(--font-syne)] text-lg font-medium text-white sm:text-xl md:text-2xl">
                    {categoryName(cat, locale)}
                  </p>
                  {project ? (
                    <p className="mt-1 line-clamp-1 text-sm text-white/65">
                      {projectTitle(project, locale)}
                    </p>
                  ) : null}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  layoutId,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  layoutId: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 text-[0.65rem] uppercase tracking-[0.16em] transition-colors sm:text-[0.68rem] sm:tracking-[0.18em] ${
        active ? "text-ink" : "text-muted active:text-ink"
      }`}
    >
      <span className="relative pb-1.5">
        {label}
        {active ? (
          <motion.span
            layoutId={layoutId}
            className="absolute bottom-0 left-0 h-px w-full bg-ink"
          />
        ) : null}
      </span>
    </button>
  );
}
