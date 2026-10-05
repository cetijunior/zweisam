"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";

export interface LightboxItem {
  id: string;
  url: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  /** Link to the full shoot page, shown under the photo */
  href?: string;
}

/** Fullscreen viewer with arrow keys, swipe, and a counter. `index` null = closed. */
export function Lightbox({
  items,
  index,
  onChange,
}: {
  items: LightboxItem[];
  index: number | null;
  onChange: (index: number | null) => void;
}) {
  const t = useTranslations("lightbox");
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const item = index !== null ? items[index] : undefined;
  const count = items.length;

  const go = useCallback(
    (delta: number) => {
      if (index === null || count === 0) return;
      onChange((index + delta + count) % count);
    },
    [count, index, onChange],
  );

  useEffect(() => {
    if (index === null) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus?.focus?.();
    };
  }, [go, index, onChange]);

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col bg-[#0d0c0b]/[0.97] text-white"
          onClick={() => onChange(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-3 md:px-8"
            style={{ paddingTop: "calc(0.75rem + var(--safe-top))" }}
          >
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/60 tabular-nums">
              {String((index ?? 0) + 1).padStart(2, "0")} {t("of")}{" "}
              {String(count).padStart(2, "0")}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => onChange(null)}
              className="min-h-11 min-w-11 text-[0.68rem] uppercase tracking-[0.2em] text-white/70 hover:text-white"
            >
              {t("close")}
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 md:px-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-full w-full items-center justify-center"
              >
                <Image
                  src={item.url}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="100vw"
                  className="max-h-full w-auto max-w-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {count > 1 ? (
              <>
                <NavButton label={t("prev")} side="left" onClick={() => go(-1)} />
                <NavButton label={t("next")} side="right" onClick={() => go(1)} />
              </>
            ) : null}
          </div>

          <div
            className="flex min-h-16 flex-col items-center justify-center gap-1 px-5 py-4 text-center"
            style={{ paddingBottom: "calc(1rem + var(--safe-bottom))" }}
            onClick={(e) => e.stopPropagation()}
          >
            {item.caption ? (
              <p className="font-[family-name:var(--font-syne)] text-sm font-medium">
                {item.caption}
              </p>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="btn-ghost text-[0.65rem] text-white/80"
                onClick={() => onChange(null)}
              >
                {t("viewShoot")} →
              </Link>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function NavButton({
  label,
  side,
  onClick,
}: {
  label: string;
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-white hover:text-white md:flex ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      <span aria-hidden className="text-xl">
        {side === "left" ? "←" : "→"}
      </span>
    </button>
  );
}
