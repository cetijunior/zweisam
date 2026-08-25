"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { useBrand } from "@/components/brand/BrandProvider";
import {
  DrawLine,
  ImageReveal,
  ParallaxFrame,
  Reveal,
  ScrollWords,
} from "@/components/motion/primitives";

const EVENT_KEYS = [
  "couples",
  "gender-reveal",
  "birthdays",
  "kids",
  "gatherings",
  "other",
] as const;

export function ContactForm({
  sideImageUrl,
  sideImageAlt,
}: {
  sideImageUrl?: string;
  sideImageAlt?: string;
}) {
  const t = useTranslations("contact");
  const brand = useBrand();
  const locale = useLocale() as "de" | "en";
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        eventType: form.get("eventType"),
        eventDate: form.get("eventDate"),
        message: form.get("message"),
        locale,
      }),
    });
    setPending(false);
    setDone(true);
  }

  return (
    <div className="overflow-hidden">
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-28 md:grid-cols-12 md:gap-10 md:px-8 md:py-36">
        {/* Left panel */}
        <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
          <Reveal>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-muted">
              {t("title")}
            </p>
            <DrawLine className="mt-5 max-w-12" />
            <ScrollWords
              as="h1"
              text={t("subtitle")}
              className="mt-7 font-[family-name:var(--font-syne)] text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em]"
            />
            <p className="mt-6 max-w-sm text-base leading-relaxed text-ink-soft">
              {t("intro")}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 space-y-6 border-t border-line pt-10">
            <InfoRow label={t("labelEmail")} value={brand.email} href={`mailto:${brand.email}`} />
            <InfoRow label={t("labelLocation")} value={brand.location} />
            <InfoRow
              label={t("labelSocial")}
              value={brand.handle}
              href={brand.instagram}
              external
            />
          </Reveal>

          {sideImageUrl ? (
            <ImageReveal delay={0.15} className="mt-12 hidden md:block">
              <ParallaxFrame
                className="relative aspect-[4/5] overflow-hidden bg-line"
                strength={36}
              >
                <Image
                  src={sideImageUrl}
                  alt={sideImageAlt ?? ""}
                  fill
                  className="scale-110 object-cover"
                  sizes="40vw"
                />
              </ParallaxFrame>
            </ImageReveal>
          ) : null}
        </div>

        {/* Form */}
        <div className="md:col-span-6 md:col-start-7">
          {done ? (
            <Reveal>
              <div className="border border-line bg-paper-elevated px-8 py-14">
                <p className="font-[family-name:var(--font-instrument)] text-3xl italic text-ink">
                  {t("success")}
                </p>
                <a
                  href={`mailto:${brand.email}`}
                  className="btn-ghost mt-8 text-ink"
                >
                  {brand.email}
                </a>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={0.08}>
              <form
                onSubmit={onSubmit}
                className="space-y-8 border border-line bg-paper-elevated px-6 py-10 md:px-10 md:py-12"
              >
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field label={t("name")} name="name" required />
                  <Field label={t("email")} name="email" type="email" required />
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                      {t("eventType")}
                    </label>
                    <select
                      name="eventType"
                      required
                      className="w-full border-b border-line bg-transparent py-3 text-ink outline-none transition-colors focus:border-ink"
                    >
                      {EVENT_KEYS.map((key) => (
                        <option key={key} value={key} className="bg-paper text-ink">
                          {t(`eventTypes.${key}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Field label={t("eventDate")} name="eventDate" type="date" />
                </div>
                <div>
                  <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                    {t("message")}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    placeholder={t("messagePlaceholder")}
                    className="w-full resize-none border-b border-line bg-transparent py-3 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-ink"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className="btn-line mt-2 disabled:opacity-50"
                >
                  {pending ? t("sending") : t("submit")}
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  );
}

/** Compact inquire fragment for the landing page */
export function InquireTeaser({
  imageUrl,
  imageAlt,
}: {
  imageUrl: string;
  imageAlt: string;
}) {
  const t = useTranslations("home");
  const tc = useTranslations("contact");
  const brand = useBrand();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [1.12, 1],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [-30, 30],
  );

  return (
    <section
      ref={ref}
      className="relative min-h-[70vh] overflow-hidden border-t border-line md:min-h-[80vh]"
    >
      <motion.div
        style={{ scale, y }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
      </motion.div>

      <div
        className="relative z-10 mx-auto flex h-full min-h-[70vh] max-w-7xl flex-col items-start justify-end px-5 py-20 text-white md:min-h-[80vh] md:px-8 md:py-36"
        style={{
          paddingBottom: "max(5rem, calc(3rem + var(--safe-bottom)))",
        }}
      >
        <Reveal>
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/65 sm:text-[0.68rem]">
            {tc("title")}
          </p>
          <ScrollWords
            text={t("inquireHeadline")}
            className="mt-5 max-w-2xl font-[family-name:var(--font-syne)] text-[clamp(2rem,8vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white sm:mt-6"
          />
          <p className="mt-4 max-w-md font-[family-name:var(--font-instrument)] text-lg italic text-white/75 sm:mt-5 sm:text-xl md:text-2xl">
            {t("inquireSub")}
          </p>
          <div className="mt-8 flex w-full flex-col gap-4 sm:mt-12 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
            <Link
              href="/contact"
              className="btn-line btn-line-light w-full justify-center sm:w-auto"
            >
              {t("ctaSecondary")}
            </Link>
            <a
              href={`mailto:${brand.email}`}
              className="btn-ghost justify-center text-white sm:justify-start"
            >
              {brand.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = href ? (
    <a
      href={href}
      className="text-ink transition-colors hover:text-accent"
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {value}
    </a>
  ) : (
    <span className="text-ink">{value}</span>
  );

  return (
    <div>
      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-sm md:text-base">{content}</p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-muted">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border-b border-line bg-transparent py-3 text-ink outline-none transition-colors focus:border-ink"
      />
    </div>
  );
}
