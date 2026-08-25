"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  DrawLine,
  ImageReveal,
  ParallaxFrame,
  Reveal,
  ScrollWords,
} from "@/components/motion/primitives";

export function AboutContent({
  title,
  headline,
  photographers,
  body,
  based,
  location,
  imageUrl,
  imageAlt,
  secondaryUrl,
  secondaryAlt,
  values,
  readMore,
}: {
  title: string;
  headline: string;
  photographers: string;
  body: string;
  based: string;
  location: string;
  imageUrl: string;
  imageAlt: string;
  secondaryUrl?: string;
  secondaryAlt?: string;
  values: { label: string; text: string }[];
  readMore?: string;
}) {
  return (
    <div className="overflow-hidden">
      {/* Hero band */}
      <section className="relative px-5 pt-28 md:px-8 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-muted">
              {title}
            </p>
            <DrawLine className="mt-6 max-w-12" />
            <ScrollWords
              as="h1"
              text={headline}
              className="mt-8 max-w-4xl font-[family-name:var(--font-syne)] text-[clamp(2.4rem,6vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.03em]"
            />
            <p className="mt-5 font-[family-name:var(--font-instrument)] text-2xl italic text-muted md:text-3xl">
              {photographers}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Asymmetric image pair */}
      <section className="mx-auto mt-16 grid max-w-7xl gap-4 px-5 md:mt-24 md:grid-cols-12 md:gap-6 md:px-8">
        <div className="md:col-span-7">
          <ImageReveal>
            <ParallaxFrame className="relative aspect-[4/5] bg-line md:aspect-[5/6]" strength={40}>
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="scale-110 object-cover"
                sizes="(max-width:768px) 100vw, 60vw"
                priority
              />
            </ParallaxFrame>
          </ImageReveal>
        </div>
        <div className="flex flex-col justify-end gap-6 md:col-span-5 md:pb-8">
          {secondaryUrl ? (
            <ImageReveal delay={0.12}>
              <ParallaxFrame
                className="relative aspect-[5/4] bg-line"
                strength={28}
              >
                <Image
                  src={secondaryUrl}
                  alt={secondaryAlt ?? ""}
                  fill
                  className="scale-110 object-cover"
                  sizes="40vw"
                />
              </ParallaxFrame>
            </ImageReveal>
          ) : null}
          <Reveal delay={0.15}>
            <p className="max-w-md text-[1.05rem] leading-relaxed text-ink-soft md:text-lg">
              {body}
            </p>
            <p className="mt-8 text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              {based} {location}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto mt-24 max-w-7xl border-t border-line px-5 py-20 md:mt-32 md:px-8 md:py-28">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {values.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                {String(i + 1).padStart(2, "0")} · {item.label}
              </p>
              <DrawLine className="mt-4 max-w-10" />
              <p className="mt-5 font-[family-name:var(--font-instrument)] text-xl italic leading-snug text-ink md:text-2xl">
                {item.text}
              </p>
            </Reveal>
          ))}
        </div>
        {readMore ? (
          <Reveal className="mt-16">
            <Link href="/contact" className="btn-line">
              {readMore}
            </Link>
          </Reveal>
        ) : null}
      </section>
    </div>
  );
}

/** Compact about fragment for the landing page */
export function AboutTeaser({
  title,
  headline,
  photographers,
  body,
  location,
  imageUrl,
  imageAlt,
  cta,
}: {
  title: string;
  headline: string;
  photographers: string;
  body: string;
  location: string;
  imageUrl: string;
  imageAlt: string;
  cta: string;
}) {
  const excerpt =
    body.length > 180 ? `${body.slice(0, 180).trim()}…` : body;

  return (
    <section className="border-t border-line px-5 py-16 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <ImageReveal>
            <ParallaxFrame
              className="relative aspect-[4/5] overflow-hidden bg-line sm:aspect-[5/6] md:aspect-[4/5]"
              strength={44}
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="scale-110 object-cover transition duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.14] active:scale-[1.14]"
                sizes="(max-width:768px) 100vw, 40vw"
              />
            </ParallaxFrame>
          </ImageReveal>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Reveal>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted sm:text-[0.68rem]">
              {title}
            </p>
            <DrawLine className="mt-4 max-w-12 sm:mt-5" />
            <ScrollWords
              text={headline}
              className="mt-6 font-[family-name:var(--font-syne)] text-[1.85rem] font-medium tracking-tight sm:mt-7 sm:text-3xl md:text-5xl"
            />
            <p className="mt-3 font-[family-name:var(--font-instrument)] text-lg italic text-muted sm:text-xl md:text-2xl">
              {photographers}
            </p>
            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink-soft sm:mt-7 sm:text-base">
              {excerpt}
            </p>
            <p className="mt-5 text-[0.7rem] uppercase tracking-[0.18em] text-muted sm:mt-6">
              {location}
            </p>
            <Link href="/about" className="btn-ghost mt-8 sm:mt-10">
              {cta}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
