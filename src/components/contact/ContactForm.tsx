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
import { formatPhone, mailtoUrl, whatsappUrl } from "@/lib/contact";
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
  initialType,
}: {
  sideImageUrl?: string;
  sideImageAlt?: string;
  initialType?: string;
}) {
  const t = useTranslations("contact");
  const brand = useBrand();
  const locale = useLocale() as "de" | "en";
  const [sentVia, setSentVia] = useState<"whatsapp" | "email" | null>(null);
  const hasWhatsapp = Boolean(brand.whatsapp);

  /** Opens WhatsApp (primary) or the email app with the inquiry pre-written. */
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const via = hasWhatsapp && submitter?.value !== "email" ? "whatsapp" : "email";
    const form = new FormData(e.currentTarget);
    if (form.get("company")) return; // honeypot

    const eventKey = String(form.get("eventType") ?? "other");
    const eventLabel = t(`eventTypes.${eventKey}` as "eventTypes.other");
    const date = String(form.get("eventDate") ?? "");
    const lines = [
      t("compose.greeting", { studio: brand.studioName }),
      "",
      `${t("name")}: ${form.get("name")}`,
      form.get("email") ? `${t("email")}: ${form.get("email")}` : null,
      `${t("eventType")}: ${eventLabel}`,
      date ? `${t("eventDate")}: ${date}` : null,
      "",
      String(form.get("message") ?? ""),
    ].filter((l) => l !== null);
    const text = lines.join("\n").trim();

    if (via === "whatsapp") {
      window.open(whatsappUrl(brand.whatsapp, text), "_blank", "noopener");
    } else {
      window.location.href = mailtoUrl(
        brand.email,
        t("compose.subject", { event: eventLabel }),
        text,
      );
    }
    setSentVia(via);

    // Keep a copy in the dashboard too (best effort; needs a valid email).
    void fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        eventType: eventKey,
        eventDate: date,
        message: form.get("message"),
        consent: form.get("consent") === "on",
        locale,
      }),
    }).catch(() => undefined);
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
            <p className="mt-4 flex items-center gap-2.5 text-sm text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {t("response")}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 space-y-6 border-t border-line pt-10">
            {hasWhatsapp ? (
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                  {t("labelWhatsapp")} · {t("preferred")}
                </p>
                <a
                  href={whatsappUrl(brand.whatsapp, t("compose.quick", { studio: brand.studioName }))}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-white transition hover:brightness-105"
                >
                  <WhatsappIcon />
                  {formatPhone(brand.whatsapp)}
                </a>
              </div>
            ) : null}
            <InfoRow label={t("labelEmail")} value={brand.email} href={`mailto:${brand.email}`} />
            {brand.phone ? (
              <InfoRow
                label={t("labelPhone")}
                value={brand.phone}
                href={`tel:${brand.phone.replace(/\s/g, "")}`}
              />
            ) : null}
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
          {sentVia ? (
            <Reveal>
              <div
                role="status"
                className="border border-line bg-paper-elevated px-8 py-14"
              >
                <p className="font-[family-name:var(--font-instrument)] text-3xl italic text-ink">
                  {sentVia === "whatsapp" ? t("openedWhatsapp") : t("openedEmail")}
                </p>
                <p className="mt-4 text-sm text-ink-soft">{t("notOpened")}</p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
                  {hasWhatsapp ? (
                    <a
                      href={whatsappUrl(brand.whatsapp)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost text-ink"
                    >
                      WhatsApp {formatPhone(brand.whatsapp)}
                    </a>
                  ) : null}
                  <a href={`mailto:${brand.email}`} className="btn-ghost text-ink">
                    {brand.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setSentVia(null)}
                  className="mt-8 text-xs uppercase tracking-[0.18em] text-muted hover:text-ink"
                >
                  ← {t("back")}
                </button>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={0.08}>
              <form
                onSubmit={onSubmit}
                className="relative space-y-8 border border-line bg-paper-elevated px-6 py-10 md:px-10 md:py-12"
              >
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field label={t("name")} name="name" autoComplete="name" required />
                  <Field
                    label={t("email")}
                    name="email"
                    type="email"
                    autoComplete="email"
                    required={!hasWhatsapp}
                  />
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="field-eventType"
                      className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-muted"
                    >
                      {t("eventType")}
                    </label>
                    <select
                      id="field-eventType"
                      name="eventType"
                      required
                      defaultValue={
                        EVENT_KEYS.includes(initialType as (typeof EVENT_KEYS)[number])
                          ? initialType
                          : undefined
                      }
                      className="w-full border-b border-line bg-transparent py-3 text-ink outline-none transition-colors focus:border-ink"
                    >
                      {EVENT_KEYS.map((key) => (
                        <option key={key} value={key} className="bg-paper text-ink">
                          {t(`eventTypes.${key}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Field
                    label={t("eventDate")}
                    name="eventDate"
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="field-message"
                    className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-muted"
                  >
                    {t("message")}
                  </label>
                  <textarea
                    id="field-message"
                    name="message"
                    maxLength={5000}
                    required
                    rows={6}
                    placeholder={t("messagePlaceholder")}
                    className="w-full resize-none border-b border-line bg-transparent py-3 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-ink"
                  />
                </div>
                {/* Honeypot for bots; hidden from people and assistive tech */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                />
                <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
                  />
                  <span>
                    {t("consent")}{" "}
                    <Link href="/datenschutz" className="underline underline-offset-2 hover:text-ink">
                      {t("consentLink")}
                    </Link>
                    .
                  </span>
                </label>
                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:gap-8">
                  {hasWhatsapp ? (
                    <button
                      type="submit"
                      value="whatsapp"
                      className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 text-sm font-medium text-white transition hover:brightness-105"
                    >
                      <WhatsappIcon />
                      {t("sendWhatsapp")}
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    value="email"
                    className={hasWhatsapp ? "btn-ghost self-center text-ink sm:self-auto" : "btn-line"}
                  >
                    {t("sendEmail")}
                  </button>
                </div>
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
            {brand.whatsapp ? (
              <a
                href={whatsappUrl(brand.whatsapp, tc("compose.quick", { studio: brand.studioName }))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 text-sm font-medium text-white transition hover:brightness-105 sm:w-auto"
              >
                <WhatsappIcon />
                {tc("chatWhatsapp")}
              </a>
            ) : null}
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

function WhatsappIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
    </svg>
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
  autoComplete,
  required,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  min?: string;
}) {
  const id = `field-${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-muted"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        autoComplete={autoComplete}
        type={type}
        required={required}
        min={min}
        className="w-full border-b border-line bg-transparent py-3 text-ink outline-none transition-colors focus:border-ink"
      />
    </div>
  );
}
