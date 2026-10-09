"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

/** Drag-to-compare: the same frame as a flat "straight out of camera" look vs. the studio's edit. */
export function EditCompare({ src, alt }: { src: string; alt: string }) {
  const t = useTranslations("craft");
  const [pos, setPos] = useState(50);

  return (
    <div className="relative aspect-[4/5] select-none overflow-hidden bg-line sm:aspect-[5/4]">
      <Image src={src} alt={alt} fill sizes="(max-width:768px) 100vw, 60vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          sizes="(max-width:768px) 100vw, 60vw"
          className="object-cover [filter:saturate(0.55)_contrast(0.78)_brightness(1.08)_sepia(0.08)]"
        />
      </div>
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-white backdrop-blur">
        {t("raw")}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-white backdrop-blur">
        {t("edit")}
      </span>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-white/90" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/35 text-sm text-white backdrop-blur">
          ↔
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={t("sliderLabel")}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
