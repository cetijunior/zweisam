"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { BrandMark } from "@/components/brand/BrandMark";
import { useBrand } from "@/components/brand/BrandProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getTagline, categoryName } from "@/lib/data/selectors";
import type { Category } from "@/lib/data/types";

const PAPER_RGB = {
  light: "246,245,243",
  dark: "17,16,15",
} as const;

const INK_RGB = {
  light: "28,27,26",
  dark: "240,235,228",
} as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const brand = useBrand();
  const pathname = usePathname();
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prefer live CSS vars so toggle + hydration never desync nav contrast from the theme.
  const paperRgb =
    mounted && resolvedTheme === "dark" ? PAPER_RGB.dark : PAPER_RGB.light;
  const inkRgb =
    mounted && resolvedTheme === "dark" ? INK_RGB.dark : INK_RGB.light;
  const themeKey = mounted && resolvedTheme === "dark" ? "dark" : "light";

  const bg = useTransform(
    scrollY,
    [0, 60],
    [`rgba(${paperRgb},0)`, `rgba(${paperRgb},0.94)`],
  );
  const border = useTransform(
    scrollY,
    [0, 60],
    [`rgba(${inkRgb},0)`, `rgba(${inkRgb},0.12)`],
  );

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 36);
  });

  useEffect(() => {
    setScrolled(scrollY.get() > 36);
  }, [scrollY]);

  const links = useMemo(
    () => [
      { href: "/" as const, label: brand.studioName, home: true },
      { href: "/work" as const, label: t("work") },
      { href: "/about" as const, label: t("about") },
      { href: "/contact" as const, label: t("contact") },
    ],
    [brand.studioName, t],
  );

  const otherLocale = locale === "de" ? "en" : "de";
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Explicit colors so light + dark both stay readable (Tailwind theme classes alone can fail on the transparent hero).
  const chromeStyle = overHero
    ? ({ color: "#ffffff", textShadow: "0 1px 18px rgba(0,0,0,0.45)" } as const)
    : ({ color: "var(--ink)", textShadow: "none" } as const);
  const mutedStyle = overHero
    ? ({ color: "rgba(255,255,255,0.78)", textShadow: "0 1px 14px rgba(0,0,0,0.4)" } as const)
    : ({ color: "color-mix(in srgb, var(--ink) 62%, transparent)", textShadow: "none" } as const);
  const burgerColor = overHero ? "#ffffff" : "var(--ink)";

  return (
    <>
      <motion.header
        key={themeKey}
        style={
          open
            ? {
                backgroundColor: `rgba(${paperRgb},0.98)`,
                borderBottomColor: `rgba(${inkRgb},0.1)`,
              }
            : { backgroundColor: bg, borderBottomColor: border }
        }
        className={`fixed inset-x-0 top-0 border-b backdrop-blur-md ${
          open ? "z-[60]" : "z-50"
        }`}
      >
        <div
          className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8"
          style={{
            height: "calc(3.5rem + var(--safe-top))",
            paddingTop: "var(--safe-top)",
          }}
        >
          <Link
            href="/"
            style={chromeStyle}
            onClick={(e) => {
              setOpen(false);
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="relative z-[70] font-[family-name:var(--font-syne)] text-[0.95rem] font-medium tracking-[0.04em] transition-[color,text-shadow] duration-300 md:text-base"
          >
            <BrandMark
              size={34}
              nameClassName="tracking-[0.04em]"
            />
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {links
              .filter((l) => !("home" in l && l.home))
              .map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={active ? chromeStyle : mutedStyle}
                    className="text-[0.7rem] uppercase tracking-[0.18em] transition-[color,text-shadow] duration-300 hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                );
              })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            {!open ? (
              <>
                <ThemeToggle
                  style={chromeStyle}
                  className="relative z-[70] transition-[color,text-shadow] duration-300"
                />
                <Link
                  href={pathname}
                  locale={otherLocale}
                  style={mutedStyle}
                  className="relative z-[70] px-1 text-[0.65rem] uppercase tracking-[0.2em] transition-[color,text-shadow] duration-300"
                >
                  {otherLocale}
                </Link>
                <Link
                  href="/contact"
                  style={chromeStyle}
                  className="btn-ghost relative z-[70] hidden transition-[color,text-shadow] duration-300 sm:inline-flex"
                >
                  {t("inquire")}
                </Link>
              </>
            ) : null}

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative z-[70] flex h-11 w-11 items-center justify-center md:hidden"
            >
              <span className="sr-only">{open ? "Close" : "Menu"}</span>
              {open ? (
                <span
                  aria-hidden
                  className="relative block h-4 w-4"
                  style={{ color: burgerColor }}
                >
                  <span
                    className="absolute left-1/2 top-1/2 block h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current"
                  />
                  <span
                    className="absolute left-1/2 top-1/2 block h-px w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current"
                  />
                </span>
              ) : (
                <span className="relative block h-3 w-5">
                  <span
                    className="absolute left-0 top-0 block h-px w-full"
                    style={{ backgroundColor: burgerColor }}
                  />
                  <span
                    className="absolute left-0 top-[5.5px] block h-px w-full"
                    style={{ backgroundColor: burgerColor }}
                  />
                  <span
                    className="absolute left-0 top-[11px] block h-px w-full"
                    style={{ backgroundColor: burgerColor }}
                  />
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[55] flex flex-col bg-paper text-ink md:hidden"
            style={{ paddingTop: "calc(4.5rem + var(--safe-top))" }}
          >
            <nav className="flex flex-1 flex-col justify-center px-6 pb-10">
              {links
                .filter((l) => !("home" in l && l.home))
                .map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{
                      delay: 0.08 + i * 0.07,
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-line py-5 font-[family-name:var(--font-syne)] text-3xl font-medium tracking-tight"
                    >
                      <span className="mr-4 text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center justify-between gap-4 border-t border-line px-6 py-6"
              style={{ paddingBottom: "calc(1.5rem + var(--safe-bottom))" }}
            >
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                  {brand.location}
                </p>
              </div>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn-line"
              >
                {t("inquire")}
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function SiteFooter({ categories = [] }: { categories?: Category[] }) {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const brand = useBrand();
  const locale = useLocale() as "de" | "en";
  const year = new Date().getFullYear();
  const tagline = getTagline(brand, locale);
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <BrandMark
              size={56}
              nameClassName="font-[family-name:var(--font-syne)] text-3xl font-medium tracking-tight md:text-4xl"
            />
            <p className="mt-4 max-w-sm font-[family-name:var(--font-instrument)] text-lg italic leading-snug text-muted md:text-xl">
              {tagline}
            </p>
            <p className="mt-5 text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              {brand.location}
            </p>
            <Link href="/contact" className="btn-line mt-8 w-full sm:w-auto">
              {t("cta")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7 md:grid-cols-3 md:gap-8">
            <div>
              <p className="mb-4 text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                {t("explore")}
              </p>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <Link href="/work" className="text-ink/80 hover:text-ink">
                    {tn("work")}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-ink/80 hover:text-ink">
                    {tn("about")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-ink/80 hover:text-ink">
                    {tn("contact")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-4 text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                {t("services")}
              </p>
              <ul className="space-y-3.5 text-sm">
                {sorted.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/work?c=${cat.slug}`}
                      className="text-ink/80 hover:text-ink"
                    >
                      {categoryName(cat, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="mb-4 text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                {t("connect")}
              </p>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <a
                    href={brand.instagram}
                    className="text-ink/80 hover:text-ink"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {brand.handle}
                  </a>
                </li>
                {brand.tiktok ? (
                  <li>
                    <a
                      href={brand.tiktok}
                      className="text-ink/80 hover:text-ink"
                      target="_blank"
                      rel="noreferrer"
                    >
                      TikTok
                    </a>
                  </li>
                ) : null}
                <li>
                  <a
                    href={`mailto:${brand.email}`}
                    className="break-all text-ink/80 hover:text-ink"
                  >
                    {brand.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[0.68rem] tracking-wide text-muted md:mt-16 md:flex-row md:items-center md:justify-between md:pt-8"
          style={{ paddingBottom: "var(--safe-bottom)" }}
        >
          <p>
            © {year} {brand.studioName}. {t("rights")}
          </p>
          <p>
            {t("studio")} · {brand.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
