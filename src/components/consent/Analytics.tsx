"use client";

import Script from "next/script";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-MVTBXEQFV5";
const KEY = "klick-consent";
/** Fired by the footer "Cookie settings" link to reopen the banner. */
export const OPEN_CONSENT_EVENT = "klick:open-consent";

type Choice = "granted" | "denied" | null;

function readChoice(): Choice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Google Analytics loads only after the visitor accepts (required in Germany). */
export function Analytics() {
  const t = useTranslations("consent");
  const [choice, setChoice] = useState<Choice>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const c = readChoice();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(c);
    setOpen(c === null);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  function decide(c: "granted" | "denied") {
    try {
      localStorage.setItem(KEY, c);
    } catch {}
    if (c === "denied" && choice === "granted") {
      // Remove GA cookies and reload so the tag is gone.
      document.cookie.split(";").forEach((ck) => {
        const name = ck.split("=")[0].trim();
        if (name.startsWith("_ga")) {
          document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname.replace(/^www\./, "")}`;
          document.cookie = `${name}=; Max-Age=0; path=/`;
        }
      });
      location.reload();
      return;
    }
    setChoice(c);
    setOpen(false);
  }

  return (
    <>
      {choice === "granted" && GA_ID ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-label={t("title")}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 z-[90] mx-auto max-w-xl border border-line-strong bg-paper-elevated p-5 text-ink shadow-2xl shadow-black/20 md:inset-x-auto md:left-6 md:p-6"
            style={{ bottom: "calc(0.75rem + var(--safe-bottom))" }}
          >
            <p className="font-[family-name:var(--font-syne)] text-base font-medium">{t("title")}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {t("body")}{" "}
              <Link href="/datenschutz" className="underline underline-offset-2">
                {t("more")}
              </Link>
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => decide("granted")} className="btn-line border-ink">
                {t("accept")}
              </button>
              <button type="button" onClick={() => decide("denied")} className="btn-line">
                {t("decline")}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function ConsentLink({ className, label }: { className?: string; label: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
    >
      {label}
    </button>
  );
}
