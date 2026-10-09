"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useBrand } from "@/components/brand/BrandProvider";
import { DrawLine, Reveal } from "@/components/motion/primitives";
import { Link } from "@/i18n/navigation";
import { whatsappUrl } from "@/lib/contact";
import { SERVICES, type Service } from "@/lib/services";

const ease = [0.22, 1, 0.36, 1] as const;

const QUESTIONS = {
  occasion: ["love", "baby", "party", "milestone", "justUs"],
  who: ["two", "family", "friends", "crowd"],
  mood: ["golden", "playful", "evening", "secret"],
} as const;
type QuestionKey = keyof typeof QUESTIONS;
type Answers = Partial<Record<QuestionKey, string>>;
const ORDER = Object.keys(QUESTIONS) as QuestionKey[];

/** Which answers each service fits; the quiz scores services by matches (occasion counts double). */
const FIT: Record<string, string[]> = {
  "paarshooting-berlin": ["love", "two", "golden"],
  "verlobungsshooting-berlin": ["love", "two", "golden", "evening"],
  "heiratsantrag-fotograf-berlin": ["love", "two", "secret", "golden"],
  "standesamt-fotograf-berlin": ["love", "milestone", "crowd", "family", "evening"],
  "jahrestag-fotoshooting-berlin": ["love", "two", "golden", "secret"],
  "gender-reveal-fotograf-berlin": ["baby", "family", "friends", "playful", "secret"],
  "babyparty-fotograf-berlin": ["baby", "friends", "playful"],
  "babybauch-shooting-berlin": ["baby", "two", "golden"],
  "familienshooting-berlin": ["baby", "family", "playful", "golden", "justUs"],
  "taufe-fotograf-berlin": ["baby", "milestone", "family", "crowd"],
  "geburtstag-fotograf-berlin": ["party", "friends", "evening"],
  "kindergeburtstag-fotograf-berlin": ["party", "family", "playful"],
  "runder-geburtstag-fotograf-berlin": ["party", "milestone", "crowd", "secret", "evening"],
  "jga-fotograf-berlin": ["party", "friends", "playful"],
  "dinnerparty-fotograf-berlin": ["party", "friends", "evening"],
  "firmenfeier-fotograf-berlin": ["party", "crowd", "evening"],
  "henna-abend-fotograf-berlin": ["milestone", "love", "crowd", "family", "evening"],
  "einschulung-fotograf-berlin": ["milestone", "family", "playful"],
  "abschluss-fotoshooting-berlin": ["milestone", "friends", "golden"],
  "outdoor-fotoshooting-berlin": ["justUs", "two", "friends", "golden"],
};

function rank(answers: Answers): Service[] {
  const score = (s: Service) => {
    const fit = FIT[s.slug] ?? [];
    return ORDER.reduce(
      (sum, q) => sum + (answers[q] && fit.includes(answers[q]!) ? (q === "occasion" ? 2 : 1) : 0),
      0,
    );
  };
  return [...SERVICES].sort((a, b) => score(b) - score(a)).slice(0, 3);
}

/** Three-tap quiz that points visitors to the service that fits their occasion. */
export function ShootFinder() {
  const t = useTranslations("finder");
  const de = useLocale() === "de";
  const brand = useBrand();
  const reduce = useReducedMotion();
  const [answers, setAnswers] = useState<Answers>({});
  const step = ORDER.findIndex((q) => !answers[q]);
  const done = step === -1;
  const results = done ? rank(answers) : [];
  const [top, ...alts] = results;

  const pick = (q: QuestionKey, value: string) => setAnswers((a) => ({ ...a, [q]: value }));
  const back = () => {
    const last = done ? ORDER.length - 1 : step - 1;
    if (last < 0) return;
    setAnswers((a) => {
      const next = { ...a };
      delete next[ORDER[last]];
      return next;
    });
  };

  const summary = ORDER.map((q) => answers[q] && t(`${q}.options.${answers[q]}` as "occasion.options.love")).join(" · ");
  const topName = top ? (de ? top.nameDe : top.nameEn) : "";

  return (
    <section id="finder" className="scroll-mt-16 border-t border-line py-12 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 md:gap-12 md:grid-cols-12 md:px-8">
        <Reveal className="md:col-span-4">
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.28em] text-muted sm:text-[0.68rem]">
            {t("eyebrow")}
          </p>
          <h2 className="font-[family-name:var(--font-syne)] text-[1.85rem] font-medium leading-[1.08] tracking-tight sm:text-3xl md:text-5xl">
            {t("title")}
          </h2>
          <DrawLine className="mt-6 max-w-16" />
          <p className="mt-6 hidden text-base leading-relaxed text-ink-soft md:block">{t("intro")}</p>
          <div className="mt-6 flex gap-2 md:mt-8" aria-hidden>
            {ORDER.map((q, i) => (
              <span
                key={q}
                className={`h-px flex-1 transition-colors duration-500 ${
                  done || i < step ? "bg-accent" : i === step ? "bg-ink" : "bg-line-strong"
                }`}
              />
            ))}
          </div>
        </Reveal>

        <div className="md:col-span-7 md:col-start-6" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {!done ? (
              <motion.div
                key={ORDER[step]}
                initial={reduce ? false : { opacity: 0, x: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={reduce ? undefined : { opacity: 0, x: -24, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease }}
              >
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-muted tabular-nums">
                  {String(step + 1).padStart(2, "0")} / {String(ORDER.length).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-[family-name:var(--font-instrument)] text-3xl italic leading-tight md:text-4xl">
                  {t(`${ORDER[step]}.q`)}
                </h3>
                <div className="mt-5 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 md:mt-8">
                  {QUESTIONS[ORDER[step]].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => pick(ORDER[step], opt)}
                      className="group flex min-h-14 items-center justify-between bg-paper px-5 py-4 text-left transition-colors duration-500 hover:bg-paper-elevated"
                    >
                      <span className="font-[family-name:var(--font-syne)] text-base font-medium tracking-tight">
                        {t(`${ORDER[step]}.options.${opt}` as "occasion.options.love")}
                      </span>
                      <span aria-hidden className="text-muted transition-transform duration-500 group-hover:translate-x-1 group-hover:text-ink">
                        →
                      </span>
                    </button>
                  ))}
                </div>
                {step > 0 ? (
                  <button type="button" onClick={back} className="btn-ghost mt-6 text-[0.7rem]">
                    ← {t("back")}
                  </button>
                ) : null}
              </motion.div>
            ) : top ? (
              <motion.div
                key="result"
                initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease }}
              >
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-muted">{t("resultEyebrow")}</p>
                <p className="mt-2 text-sm text-muted">{summary}</p>
                <div className="mt-6 border border-line bg-paper-elevated p-6 md:p-8">
                  <h3 className="font-[family-name:var(--font-syne)] text-2xl font-medium tracking-tight md:text-3xl">
                    {topName}
                  </h3>
                  <p className="mt-3 font-[family-name:var(--font-instrument)] text-lg italic leading-snug text-ink-soft md:text-xl">
                    {de ? top.shortDe : top.shortEn}
                  </p>
                  <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
                    {(de ? top.includesDe : top.includesEn).map((i) => (
                      <li key={i} className="flex gap-2.5">
                        <span aria-hidden className="text-accent">—</span>
                        {i}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                    {brand.whatsapp ? (
                      <a
                        href={whatsappUrl(brand.whatsapp, t("waText", { studio: brand.studioName, service: topName, answers: summary }))}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 text-sm font-medium text-white transition hover:brightness-105"
                      >
                        {t("whatsapp")}
                      </a>
                    ) : null}
                    <Link href={`/services/${top.slug}`} className="btn-ghost">
                      {t("details")} →
                    </Link>
                  </div>
                </div>
                {alts.length ? (
                  <div className="mt-6">
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-muted">{t("alsoFits")}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {alts.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
                        >
                          {de ? s.nameDe : s.nameEn}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="mt-6 flex gap-6">
                  <button type="button" onClick={back} className="btn-ghost text-[0.7rem]">
                    ← {t("back")}
                  </button>
                  <button type="button" onClick={() => setAnswers({})} className="btn-ghost text-[0.7rem]">
                    {t("restart")}
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
