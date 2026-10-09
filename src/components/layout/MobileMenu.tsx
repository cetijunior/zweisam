"use client";

import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useBrand } from "@/components/brand/BrandProvider";
import { goldenWindows } from "@/components/features/GoldenHour";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";
import { formatPhone, whatsappUrl } from "@/lib/contact";

const ease = [0.22, 1, 0.36, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { delay, duration: 0.5, ease },
});

type NavLink = { href: "/work" | "/services" | "/about" | "/contact"; label: string };

/** Live "golden hour in …" line for the menu tile; recomputed every minute. */
function useGoldenLabel() {
  const t = useTranslations("golden");
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const next = goldenWindows(now)[0];
  if (!next) return { live: false, label: "" };
  const live = next.start <= now;
  const mins = Math.max(0, Math.round(((live ? next.end : next.start) - now) / 60_000));
  const time = mins >= 60 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`;
  return { live, label: live ? t("now", { time }) : t("next", { time }) };
}

function Icon({ name }: { name: "instagram" | "tiktok" | "mail" | "phone" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true } as const;
  if (name === "instagram")
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  if (name === "tiktok")
    return (
      <svg {...common}>
        <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
        <path d="M14 3c.5 2.6 2.3 4.4 5 4.7" />
      </svg>
    );
  if (name === "mail")
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 6 8.5 7 8.5-7" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

/** Full-screen phone menu: pages, the interactive features, then every way to reach the studio. */
export function MobileMenu({ links, onClose }: { links: NavLink[]; onClose: () => void }) {
  const t = useTranslations("menu");
  const tNav = useTranslations("nav");
  const brand = useBrand();
  const pathname = usePathname();
  const locale = useLocale();
  const otherLocale = locale === "de" ? "en" : "de";
  const golden = useGoldenLabel();

  const features = [
    { href: "/#finder", eyebrow: t("finderEyebrow"), title: t("finderTitle") },
    { href: "/#craft", eyebrow: t("goldenEyebrow"), title: golden.label || t("goldenTitle"), golden: true },
    { href: "/contact#card", eyebrow: t("cardEyebrow"), title: t("cardTitle") },
  ];
  const socials = [
    brand.instagram ? { href: brand.instagram, label: "Instagram", icon: "instagram" as const } : null,
    brand.tiktok ? { href: brand.tiktok, label: "TikTok", icon: "tiktok" as const } : null,
  ].filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <motion.div
      key="mobile-menu"
      initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
      exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.5, ease }}
      className="fixed inset-0 z-[55] flex flex-col overflow-y-auto overscroll-contain bg-paper text-ink md:hidden"
      style={{ paddingTop: "calc(4rem + var(--safe-top))" }}
    >
      <nav className="px-5">
        {links.map((link, i) => {
          const active = pathname === link.href;
          return (
            <motion.div key={link.href} {...rise(0.08 + i * 0.06)}>
              <Link
                href={link.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className="group flex items-baseline gap-4 border-b border-line py-3.5"
              >
                <span className="w-6 text-[0.62rem] tabular-nums tracking-[0.2em] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`font-[family-name:var(--font-syne)] text-[2rem] font-medium leading-none tracking-tight ${active ? "" : "text-ink/80"}`}>
                  {link.label}
                </span>
                {active ? (
                  <span className="ml-auto font-[family-name:var(--font-instrument)] text-lg italic text-accent">●</span>
                ) : (
                  <span aria-hidden className="ml-auto text-muted transition-transform group-active:translate-x-1">→</span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <motion.div {...rise(0.35)} className="mt-7">
        <p className="px-5 text-[0.62rem] uppercase tracking-[0.24em] text-muted">{t("discover")}</p>
        <div className="h-scroll mt-3 px-5">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              onClick={onClose}
              className="flex w-[62vw] max-w-[240px] shrink-0 flex-col justify-between gap-6 rounded-2xl border border-line bg-paper-elevated p-4"
            >
              <span className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.22em] text-muted">
                {f.golden ? (
                  <span className="relative flex h-1.5 w-1.5">
                    {golden.live ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d9a25f] opacity-70" /> : null}
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#d9a25f]" />
                  </span>
                ) : null}
                {f.eyebrow}
              </span>
              <span className="font-[family-name:var(--font-instrument)] text-xl italic leading-snug">{f.title}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div {...rise(0.45)} className="mt-7 px-5">
        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-muted">{t("contact")}</p>
        {brand.whatsapp ? (
          <a
            href={whatsappUrl(brand.whatsapp, t("waText", { studio: brand.studioName }))}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex min-h-12 items-center justify-between rounded-full bg-[#25D366] px-5 text-sm font-medium text-white"
          >
            WhatsApp · {formatPhone(brand.whatsapp)}
            <span aria-hidden>→</span>
          </a>
        ) : null}
        <div className="mt-2 grid gap-2">
          {brand.email ? (
            <a href={`mailto:${brand.email}`} className="flex min-h-11 items-center gap-3 rounded-full border border-line px-5 text-sm">
              <Icon name="mail" />
              <span className="truncate">{brand.email}</span>
            </a>
          ) : null}
          {brand.phone ? (
            <a href={`tel:+${brand.phone.replace(/\D/g, "")}`} className="flex min-h-11 items-center gap-3 rounded-full border border-line px-5 text-sm">
              <Icon name="phone" />
              {formatPhone(brand.phone)}
            </a>
          ) : null}
        </div>
        {socials.length ? (
          <div className="mt-4 flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm"
              >
                <Icon name={s.icon} />
                {s.icon === "instagram" && brand.handle ? `@${brand.handle.replace(/^@/, "")}` : s.label}
              </a>
            ))}
          </div>
        ) : null}
      </motion.div>

      <div className="min-h-7 flex-1" />
      <motion.div
        {...rise(0.55)}
        className="flex items-center justify-between gap-4 border-t border-line px-5 pt-4"
        style={{ paddingBottom: "calc(1rem + var(--safe-bottom))" }}
      >
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={pathname}
            locale={otherLocale}
            onClick={onClose}
            className="rounded-full border border-line px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em]"
          >
            {otherLocale === "de" ? "Deutsch" : "English"}
          </Link>
        </div>
        <Link href="/contact" onClick={onClose} className="btn-line">
          {tNav("inquire")}
        </Link>
      </motion.div>
    </motion.div>
  );
}
