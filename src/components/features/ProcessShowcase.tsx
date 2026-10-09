"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useBrand } from "@/components/brand/BrandProvider";
import { DrawLine, Reveal } from "@/components/motion/primitives";

const ease = [0.22, 1, 0.36, 1] as const;
const STEPS = ["s1", "s2", "s3", "s4"] as const;
const AUTO_MS = 6000;

/** Staggered child entrance shared by every demo screen. */
const item = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay: 0.15 + i * 0.35, ease },
});

function ChatDemo() {
  const t = useTranslations("process.demo");
  const brand = useBrand();
  return (
    <div className="flex h-full flex-col bg-[#efe7dd] dark:bg-[#1f1d1a]">
      <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-medium">
          {brand.studioName.slice(0, 1)}
        </span>
        <div>
          <p className="text-sm font-medium">{brand.studioName}</p>
          <p className="text-[0.68rem] text-white/70">{t("online")}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2 p-3 text-[0.8rem] md:gap-2.5 md:p-4 md:text-sm">
        <motion.p {...item(0)} className="ml-auto max-w-[80%] rounded-lg rounded-tr-none bg-[#d9fdd3] px-3 py-2 text-[#111] shadow-sm">
          {t("msg1")}
        </motion.p>
        <motion.p {...item(1)} className="max-w-[80%] rounded-lg rounded-tl-none bg-white px-3 py-2 text-[#111] shadow-sm">
          {t("msg2")}
        </motion.p>
        <motion.p {...item(2)} className="ml-auto max-w-[80%] rounded-lg rounded-tr-none bg-[#d9fdd3] px-3 py-2 text-[#111] shadow-sm">
          {t("msg3")}
        </motion.p>
        <motion.div {...item(3)} className="flex w-14 gap-1 rounded-lg bg-white px-3 py-3 shadow-sm">
          {[0, 1, 2].map((d) => (
            <motion.span
              key={d}
              className="h-1.5 w-1.5 rounded-full bg-[#999]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function PlanDemo({ images }: { images: string[] }) {
  const t = useTranslations("process.demo");
  const rows = [
    [t("planDate"), t("planDateValue")],
    [t("planPlace"), t("planPlaceValue")],
    [t("planLight"), t("planLightValue")],
    [t("planWho"), t("planWhoValue")],
  ];
  return (
    <div className="flex h-full flex-col bg-paper p-4 md:p-6">
      <p className="text-[0.62rem] uppercase tracking-[0.24em] text-muted">{t("planTitle")}</p>
      <dl className="mt-2 divide-y divide-line border-y border-line text-[0.8rem] md:mt-4 md:text-sm">
        {rows.map(([k, v], i) => (
          <motion.div key={k} {...item(i * 0.6)} className="flex justify-between gap-4 py-1.5 md:py-2.5">
            <dt className="text-muted">{k}</dt>
            <dd className="text-right">{v}</dd>
          </motion.div>
        ))}
      </dl>
      <p className="mt-3 text-[0.62rem] uppercase tracking-[0.24em] text-muted md:mt-5">{t("mood")}</p>
      <div className="mt-2 grid flex-1 grid-cols-3 gap-2 md:mt-3">
        {images.slice(0, 3).map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, rotate: i % 2 ? 6 : -6, scale: 0.85 }}
            animate={{ opacity: 1, rotate: i % 2 ? 2 : -2, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.4 + i * 0.25, ease }}
            className="relative min-h-14 overflow-hidden bg-line shadow-md"
          >
            <Image src={src} alt="" fill sizes="160px" className="object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ShootDemo({ image }: { image: string }) {
  const [shots, setShots] = useState(0);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setShots((s) => s + 1);
      setFlash(true);
      setTimeout(() => setFlash(false), 120);
    }, 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative h-full overflow-hidden bg-black">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.25 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 5, ease: "easeOut" }}
      >
        <Image src={image} alt="" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
      </motion.div>
      {/* Viewfinder chrome */}
      <div className="pointer-events-none absolute inset-4 text-white">
        {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
          <span key={c} className={`absolute h-6 w-6 border-white/80 ${c}`} />
        ))}
        <motion.span
          className="absolute left-1/2 top-[40%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 border border-[#7CFC00]"
          initial={{ scale: 1.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
        <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 pb-1 font-mono text-[0.68rem] tracking-wider text-white/90">
          <span>1/500 · f/2.0 · ISO 200</span>
          <span className="tabular-nums">● {String(shots).padStart(3, "0")}</span>
        </div>
      </div>
      <span className={`pointer-events-none absolute inset-0 bg-white transition-opacity duration-100 ${flash ? "opacity-40" : "opacity-0"}`} />
    </div>
  );
}

function GalleryDemo({ images }: { images: string[] }) {
  const t = useTranslations("process.demo");
  return (
    <div className="flex h-full flex-col bg-paper">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="font-[family-name:var(--font-syne)] text-sm font-medium">{t("galleryTitle")}</p>
        <motion.span {...item(2)} className="rounded-full bg-ink px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-paper">
          {t("download")} ↓
        </motion.span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-1.5 p-1.5">
        {images.slice(0, 6).map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease }}
            className="relative overflow-hidden bg-line"
          >
            <Image src={src} alt="" fill sizes="160px" className="object-cover" />
            {i === 1 ? <span className="absolute right-1.5 top-1.5 text-sm text-white drop-shadow">♥</span> : null}
          </motion.div>
        ))}
      </div>
      <p className="border-t border-line px-4 py-2.5 text-xs text-muted">{t("galleryMeta")}</p>
    </div>
  );
}

/** "How it works" told through four live mini-demos instead of text: chat, plan, shoot, gallery. */
export function ProcessShowcase({ images }: { images: string[] }) {
  const t = useTranslations("process");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20%" });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [active, paused, inView, reduce]);

  const screens = [
    <ChatDemo key="s1" />,
    <PlanDemo key="s2" images={images} />,
    <ShootDemo key="s3" image={images[3] ?? images[0]} />,
    <GalleryDemo key="s4" images={images} />,
  ];

  return (
    <section className="border-t border-line bg-paper-elevated py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.28em] text-muted sm:text-[0.68rem]">{t("eyebrow")}</p>
          <h2 className="max-w-3xl font-[family-name:var(--font-syne)] text-[1.85rem] font-medium leading-[1.08] tracking-tight sm:text-3xl md:text-5xl">
            {t("title")}
          </h2>
          <DrawLine className="mt-6 max-w-16" />
        </Reveal>

        <div ref={ref} className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:gap-8">
          <ol className="md:col-span-5" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {STEPS.map((key, i) => (
              <li key={key} className="border-t border-line last:border-b">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className="group relative flex w-full gap-4 py-3.5 text-left md:gap-5 md:py-5"
                >
                  <span
                    className={`font-[family-name:var(--font-instrument)] text-3xl italic leading-none md:text-4xl transition-colors duration-500 ${
                      active === i ? "text-accent" : "text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    <span className={`block font-[family-name:var(--font-syne)] text-lg font-medium tracking-tight transition-opacity duration-500 ${active === i ? "" : "opacity-55 group-hover:opacity-100"}`}>
                      {t(`steps.${key}.title`)}
                    </span>
                    <motion.span
                      initial={false}
                      animate={{ height: active === i ? "auto" : 0, opacity: active === i ? 1 : 0 }}
                      transition={{ duration: 0.5, ease }}
                      className="block overflow-hidden text-sm leading-relaxed text-ink-soft"
                    >
                      <span className="block pt-2">{t(`steps.${key}.text`)}</span>
                    </motion.span>
                  </span>
                  {active === i && !reduce && !paused ? (
                    <motion.span
                      key={`bar-${i}`}
                      className="absolute inset-x-0 -top-px h-px origin-left bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: inView ? 1 : 0 }}
                      transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                    />
                  ) : null}
                </button>
              </li>
            ))}
          </ol>

          <div className="md:col-span-7">
            <div className="relative aspect-[4/3.6] w-full overflow-hidden rounded-[18px] border border-line-strong shadow-[0_30px_60px_-25px_rgba(28,27,26,0.4)] sm:aspect-[16/11]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease }}
                >
                  {screens[active]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
