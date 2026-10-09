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
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useBrand } from "@/components/brand/BrandProvider";
import { ConsentLink } from "@/components/consent/Analytics";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useMounted } from "@/lib/useMounted";
import { getTagline } from "@/lib/data/selectors";
import { SERVICES, serviceName } from "@/lib/services";
import { formatPhone } from "@/lib/contact";

/** Most-searched occasions, linked from every page footer. */
const FOOTER_SERVICES = [
  "paarshooting-berlin",
  "gender-reveal-fotograf-berlin",
  "kindergeburtstag-fotograf-berlin",
  "geburtstag-fotograf-berlin",
  "familienshooting-berlin",
  "heiratsantrag-fotograf-berlin",
].map((slug) => SERVICES.find((s) => s.slug === slug)!);

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
  const mounted = useMounted();
  const { scrollY } = useScroll();

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
    // Sync once for restored scroll positions (e.g. reload mid-page).
    const frame = requestAnimationFrame(() => setScrolled(scrollY.get() > 36));
    return () => cancelAnimationFrame(frame);
  }, [scrollY]);

  const links = useMemo(
    () => [
      { href: "/" as const, label: brand.studioName, home: true },
      { href: "/work" as const, label: t("work") },
      { href: "/services" as const, label: t("services") },
      { href: "/about" as const, label: t("about") },
      { href: "/contact" as const, label: t("contact") },
    ],
    [brand.studioName, t],
  );

  const otherLocale = locale === "de" ? "en" : "de";
  const overHero = pathname === "/" && !scrolled && !open;

  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink focus:outline focus:outline-1"
      >
        {t("skip")}
      </a>
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
                    aria-current={active ? "page" : undefined}
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
              aria-label={open ? t("closeMenu") : t("openMenu")}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative z-[70] flex h-11 w-11 items-center justify-center md:hidden"
            >
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
          <MobileMenu
            links={links.filter((l): l is (typeof links)[number] & { href: "/work" | "/services" | "/about" | "/contact" } => !("home" in l && l.home))}
            onClose={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function SiteFooter() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tc = useTranslations("consent");
  const brand = useBrand();
  const locale = useLocale() as "de" | "en";
  const year = new Date().getFullYear();
  const tagline = getTagline(brand, locale);

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
                {FOOTER_SERVICES.map((svc) => (
                  <li key={svc.slug}>
                    <Link
                      href={`/services/${svc.slug}`}
                      className="text-ink/80 hover:text-ink"
                    >
                      {serviceName(svc, locale)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services" className="text-ink hover:text-accent">
                    {tn("services")} →
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="mb-4 text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                {t("connect")}
              </p>
              <ul className="space-y-3.5 text-sm">
                {brand.whatsapp ? (
                  <li>
                    <a
                      href={`https://wa.me/${brand.whatsapp}`}
                      className="text-ink/80 hover:text-ink"
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp · {formatPhone(brand.whatsapp)}
                    </a>
                  </li>
                ) : null}
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
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/impressum" className="hover:text-ink">
              {tn("imprint")}
            </Link>
            <Link href="/datenschutz" className="hover:text-ink">
              {tn("privacy")}
            </Link>
            <ConsentLink className="hover:text-ink" label={tc("settings")} />
            <span>
              {t("studio")} · {brand.location}
            </span>
          </p>
          <p>
            {t("madeBy")}{" "}
            <a
              href="https://rritjesade.com"
              className="text-ink/70 underline decoration-line underline-offset-2 transition-colors hover:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              rritjesade.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Bottom-right shortcuts: WhatsApp chat (when configured) and back to top. */
export function FloatingActions() {
  const t = useTranslations("nav");
  const brand = useBrand();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 700));

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-4 z-40 flex flex-col items-end gap-2.5 md:right-6"
          style={{ bottom: "calc(1rem + var(--safe-bottom))" }}
        >
          <button
            type="button"
            aria-label={t("backToTop")}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-paper/90 text-ink backdrop-blur-md transition hover:border-ink"
          >
            <span aria-hidden>↑</span>
          </button>
          {brand.whatsapp ? (
            <a
              href={`https://wa.me/${brand.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              aria-label={t("whatsapp")}
              className="flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-medium text-white shadow-lg shadow-black/15 transition hover:brightness-105"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
