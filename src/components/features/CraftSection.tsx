"use client";

import { useTranslations } from "next-intl";
import { DrawLine, Reveal } from "@/components/motion/primitives";
import { EditCompare } from "@/components/features/EditCompare";
import { GoldenHour } from "@/components/features/GoldenHour";

/** Home section showing how we work: the edit (drag to compare) and why we chase golden hour. */
export function CraftSection({ imageUrl, imageAlt }: { imageUrl: string; imageAlt: string }) {
  const t = useTranslations("craft");
  return (
    <section id="craft" className="scroll-mt-16 border-t border-line py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.28em] text-muted sm:text-[0.68rem]">{t("eyebrow")}</p>
          <h2 className="max-w-3xl font-[family-name:var(--font-syne)] text-[1.85rem] font-medium leading-[1.08] tracking-tight sm:text-3xl md:text-5xl">
            {t("title")}
          </h2>
          <DrawLine className="mt-6 max-w-16" />
        </Reveal>
        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-7">
            <EditCompare src={imageUrl} alt={imageAlt} />
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{t("editBody")}</p>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-5">
            <GoldenHour />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
