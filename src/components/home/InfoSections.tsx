"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { DrawLine, Reveal, ScrollWords } from "@/components/motion/primitives";
import { FAQ_KEYS } from "@/lib/faq";
import { SERVICES } from "@/lib/services";

const SERVICE_COUNT = SERVICES.length;

const SERVICE_CARDS = [
  { key: "couples", slug: "paarshooting-berlin" },
  { key: "reveal", slug: "gender-reveal-fotograf-berlin" },
  { key: "party", slug: "kindergeburtstag-fotograf-berlin" },
  { key: "gathering", slug: "dinnerparty-fotograf-berlin" },
] as const;
const STEP_KEYS = ["s1", "s2", "s3", "s4"] as const;

/** Endless ribbon of what the studio photographs */
export function Marquee() {
  const t = useTranslations("home");
  const reduce = useReducedMotion();
  const words = t.raw("marquee") as string[];
  const row = [...words, ...words];

  return (
    <div
      aria-hidden
      className="overflow-hidden border-y border-line bg-paper-elevated py-5 md:py-7"
    >
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap md:gap-14"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
      >
        {row.map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-[family-name:var(--font-syne)] text-2xl font-medium tracking-tight md:gap-14 md:text-4xl"
          >
            {i % 2 ? (
              <span className="font-[family-name:var(--font-instrument)] font-normal italic text-accent">
                {w}
              </span>
            ) : (
              w
            )}
            <span className="text-base text-muted">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal>
      <p className="mb-3 text-[0.65rem] uppercase tracking-[0.28em] text-muted sm:text-[0.68rem]">
        {eyebrow}
      </p>
      <ScrollWords
        text={title}
        className="max-w-3xl font-[family-name:var(--font-syne)] text-[1.85rem] font-medium leading-[1.08] tracking-tight sm:text-3xl md:text-5xl"
      />
      <DrawLine className="mt-6 max-w-16" />
    </Reveal>
  );
}

export function Services() {
  const t = useTranslations("services");
  return (
    <section className="border-t border-line py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
          </div>
          <Reveal delay={0.08} className="md:col-span-4 md:col-start-9">
            <p className="text-base leading-relaxed text-ink-soft">{t("intro")}</p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
          {SERVICE_CARDS.map(({ key, slug }, i) => (
            <Reveal key={key} delay={i * 0.06} className="bg-paper">
              <Link
                href={`/services/${slug}`}
                className="group relative flex h-full flex-col p-6 transition-colors duration-500 hover:bg-paper-elevated md:p-8"
              >
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-6 font-[family-name:var(--font-syne)] text-xl font-medium tracking-tight md:text-2xl">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {t(`items.${key}.text`)}
                </p>
                <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
                  {(t.raw(`items.${key}.points`) as string[]).map((pt) => (
                    <li key={pt} className="flex gap-2.5">
                      <span aria-hidden className="text-accent">
                        —
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto flex items-center justify-between pt-8 font-[family-name:var(--font-instrument)] text-lg italic text-muted">
                  {t("onRequest")}
                  <span
                    aria-hidden
                    className="not-italic text-ink transition-transform duration-500 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </p>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 group-hover:scale-x-100"
                />
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/services" className="btn-line">
              {t("allServices", { count: SERVICE_COUNT })} →
            </Link>
            <Link href="/contact" className="btn-ghost">
              {t("cta")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Process() {
  const t = useTranslations("process");
  return (
    <section className="border-t border-line bg-paper-elevated py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
          {STEP_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 0.08}>
              <li className="relative list-none">
                <span className="font-[family-name:var(--font-instrument)] text-6xl italic leading-none text-accent md:text-7xl">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-[family-name:var(--font-syne)] text-lg font-medium tracking-tight">
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {t(`steps.${key}.text`)}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Faq() {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<string | null>("q1");
  return (
    <section className="border-t border-line py-16 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
        </div>
        <div className="md:col-span-7 md:col-start-6">
          {FAQ_KEYS.map((key) => {
            const isOpen = open === key;
            return (
              <div key={key} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${key}`}
                    onClick={() => setOpen(isOpen ? null : key)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left font-[family-name:var(--font-syne)] text-base font-medium tracking-tight md:py-6 md:text-lg"
                  >
                    {t(`items.${key}.q`)}
                    <motion.span
                      aria-hidden
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      className="text-xl font-light text-muted"
                    >
                      +
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`faq-${key}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 text-sm leading-relaxed text-ink-soft md:text-base">
                        {t(`items.${key}.a`)}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
