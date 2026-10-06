"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { useBrand } from "@/components/brand/BrandProvider";
import {
  ImageReveal,
  KineticWords,
  ParallaxFrame,
  Reveal,
  ScrollWords,
  useHorizontalDrift,
} from "@/components/motion/primitives";
import { useIsMobile } from "@/lib/useIsMobile";
import {
  getTagline,
  mediaAlt,
  projectSlug,
  projectTitle,
} from "@/lib/data/selectors";
import type { MediaItem, Project, SiteData } from "@/lib/data/types";

export function Hero({ cover }: { cover: MediaItem }) {
  const brand = useBrand();
  const locale = useLocale() as "de" | "en";
  const t = useTranslations("home");
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, reduce ? 1 : mobile ? 1.18 : 1.14],
  );
  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduce ? 0 : mobile ? 100 : 80],
  );

  const tagline = getTagline(brand, locale);
  const parts = tagline.split(/[.。]/).filter(Boolean);
  const primary = (parts[0] ?? tagline).trim();
  const accent = (parts[1] ?? "").trim();

  useEffect(() => {
    if (reduce) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => undefined);
  }, [reduce]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink sm:min-h-[620px]"
    >
      <motion.div
        style={{ scale, y: imgY }}
        className="absolute inset-0 will-change-transform"
      >
        {reduce ? (
          <Image
            src="/brand/hero-poster.jpg"
            alt={mediaAlt(cover, locale)}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/brand/hero-poster.jpg"
            aria-hidden
          >
            <source src="/brand/hero.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/15" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pt-28 text-white md:px-8">
        <div
          className="mx-auto w-full max-w-7xl pb-10 sm:pb-14 md:pb-20"
          style={{
            paddingBottom: "max(2.75rem, calc(1.75rem + var(--safe-bottom)))",
          }}
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 text-[0.62rem] font-medium uppercase tracking-[0.26em] text-white/70 sm:mb-5 sm:text-[0.68rem] sm:tracking-[0.28em]"
          >
            {brand.studioName}
            <span className="mx-2 text-white/35 sm:mx-3">/</span>
            {t("kicker")}
          </motion.p>

          <KineticWords
            text={primary}
            className="max-w-4xl font-[family-name:var(--font-syne)] text-[clamp(2.15rem,9.5vw,5.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white"
          />
          {accent ? (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 max-w-xl font-[family-name:var(--font-instrument)] text-[clamp(1.15rem,4.2vw,1.85rem)] italic text-white/75 sm:mt-5"
            >
              {accent}.
            </motion.p>
          ) : null}

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-8 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8"
          >
            <Link
              href="/work"
              className="btn-line btn-line-light w-full justify-center sm:w-auto"
            >
              {t("cta")}
            </Link>
            <Link
              href="/contact"
              className="btn-ghost justify-center text-white sm:justify-start"
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function MomentsRail({
  data,
  projects,
}: {
  data: SiteData;
  projects: Project[];
}) {
  const locale = useLocale() as "de" | "en";
  const t = useTranslations("home");
  const mobile = useIsMobile();
  const { ref, x } = useHorizontalDrift(mobile ? 120 : 220);

  return (
    <section className="overflow-hidden border-t border-line pb-20 pt-16 md:pb-32 md:pt-28">
      <div className="mb-8 flex items-end justify-between gap-4 px-5 md:mb-12 md:px-8">
        <Reveal>
          <ScrollWords
            text={t("moments")}
            className="font-[family-name:var(--font-syne)] text-[1.85rem] font-medium tracking-tight sm:text-3xl md:text-5xl"
          />
        </Reveal>
        <Reveal delay={0.08}>
          <Link href="/work" className="btn-ghost shrink-0 text-[0.7rem]">
            {t("viewAllWork")}
          </Link>
        </Reveal>
      </div>

      <div ref={ref} className="px-5 md:px-8">
        <motion.div style={{ x }} className="flex gap-4 md:gap-7">
          {projects.map((project, i) => {
            const cover = data.media.find((m) => m.id === project.coverMediaId);
            if (!cover) return null;
            return (
              <div
                key={project.id}
                className="w-[78vw] max-w-[320px] shrink-0 sm:w-[60vw] md:w-[360px]"
              >
                <Link href={`/work/${projectSlug(project)}`} className="group block">
                  <ImageReveal delay={Math.min(i, 4) * 0.05}>
                    <ParallaxFrame
                      className="relative aspect-[3/4] bg-line"
                      strength={mobile ? 32 : 48}
                    >
                      <Image
                        src={cover.url}
                        alt={mediaAlt(cover, locale)}
                        fill
                        className="scale-110 object-cover transition duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.14] group-active:scale-[1.14]"
                        sizes="(max-width:768px) 80vw, 360px"
                      />
                    </ParallaxFrame>
                  </ImageReveal>
                  <Reveal delay={0.08}>
                    <p className="mt-4 font-[family-name:var(--font-syne)] text-[0.95rem] font-medium tracking-tight sm:mt-5 sm:text-base">
                      {projectTitle(project, locale)}
                    </p>
                    <p className="mt-1 text-sm text-muted">{project.location}</p>
                  </Reveal>
                </Link>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
