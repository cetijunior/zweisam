"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useBrand } from "@/components/brand/BrandProvider";
import { DrawLine, Reveal } from "@/components/motion/primitives";
import { whatsappUrl } from "@/lib/contact";

const spring = { stiffness: 160, damping: 18, mass: 0.6 };

/** vCard 3.0 built from the brand settings, so "save contact" stays in sync with the dashboard. */
function vcard(b: ReturnType<typeof useBrand>) {
  const phone = b.whatsapp || b.phone;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${b.studioName}`,
    `ORG:${b.studioName}`,
    phone ? `TEL;TYPE=CELL:+${phone.replace(/\D/g, "")}` : "",
    b.email ? `EMAIL:${b.email}` : "",
    typeof window !== "undefined" ? `URL:${window.location.origin}` : "",
    b.instagram ? `X-SOCIALPROFILE;TYPE=instagram:${b.instagram}` : "",
    `ADR;TYPE=WORK:;;;${b.location || "Berlin"};;;Germany`,
    "END:VCARD",
  ];
  return lines.filter(Boolean).join("\r\n");
}

/** The studio's printed card as a tiltable, flippable object, plus one-tap ways to keep in touch. */
export function BusinessCard() {
  const t = useTranslations("card");
  const brand = useBrand();
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], reduce ? [0, 0] : [10, -10]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], reduce ? [0, 0] : [-14, 14]), spring);
  const glare = useTransform(
    [px, py] as never,
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.45), rgba(255,255,255,0) 55%)`,
  );

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  /** On first sight, turn the card over once so visitors discover there's a back. */
  const peek = () => {
    if (reduce) return;
    setTimeout(() => setFlipped(true), 500);
    setTimeout(() => setFlipped(false), 2300);
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([vcard(brand)], { type: "text/vcard" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${brand.studioName}.vcf` });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="card" className="scroll-mt-16 overflow-hidden border-t border-line bg-paper-elevated py-12 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 md:gap-12 md:grid-cols-12 md:px-8">
        <Reveal className="order-2 md:order-none md:col-span-4">
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.28em] text-muted sm:text-[0.68rem]">{t("eyebrow")}</p>
          <h2 className="font-[family-name:var(--font-syne)] text-[1.85rem] font-medium leading-[1.08] tracking-tight sm:text-3xl md:text-5xl">
            {t("title")}
          </h2>
          <DrawLine className="mt-6 hidden max-w-16 md:block" />
          <p className="mt-4 text-base leading-relaxed text-ink-soft md:mt-6">{t("body")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 md:mt-8">
            <button type="button" onClick={download} className="btn-line">
              {t("save")} ↓
            </button>
            {brand.whatsapp ? (
              <a
                href={whatsappUrl(brand.whatsapp, t("waText", { studio: brand.studioName }))}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                {t("whatsapp")}
              </a>
            ) : null}
            {brand.instagram ? (
              <a href={brand.instagram} target="_blank" rel="noreferrer" className="btn-ghost">
                Instagram {brand.handle ? `@${brand.handle.replace(/^@/, "")}` : ""}
              </a>
            ) : null}
          </div>
        </Reveal>

        {/* Not <Reveal>: its blur filter would flatten the 3D flip. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 md:order-none md:col-span-7 md:col-start-6"
        >
          <div className="[perspective:1600px]" onPointerMove={onMove} onPointerLeave={onLeave}>
            <motion.div style={{ rotateX, rotateY }} className="[transform-style:preserve-3d]">
              <motion.button
                type="button"
                onClick={() => setFlipped((f) => !f)}
                aria-label={flipped ? t("showFront") : t("showBack")}
                viewport={{ once: true, margin: "-25%" }}
                onViewportEnter={peek}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative block aspect-[1050/600] w-full cursor-pointer [transform-style:preserve-3d]"
              >
                {(["front", "back"] as const).map((side) => (
                  <span
                    key={side}
                    className={`absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_30px_60px_-20px_rgba(28,27,26,0.45),0_8px_20px_-8px_rgba(28,27,26,0.25)] [backface-visibility:hidden] ${
                      side === "back" ? "[transform:rotateY(180deg)]" : ""
                    }`}
                  >
                    <Image
                      src={`/business_card_${side}.png`}
                      alt={side === "front" ? t("altFront", { studio: brand.studioName }) : t("altBack")}
                      fill
                      sizes="(max-width:768px) 100vw, 60vw"
                      className="object-cover"
                    />
                    <motion.span aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: glare }} />
                  </span>
                ))}
              </motion.button>
            </motion.div>
          </div>
          <p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.24em] text-muted">{t("hint")}</p>
        </motion.div>
      </div>
    </section>
  );
}
