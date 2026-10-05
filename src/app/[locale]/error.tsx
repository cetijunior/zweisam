"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link } from "@/i18n/navigation";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  const tn = useTranslations("notFound");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-start justify-center px-5 py-36 md:px-8">
      <h1 className="max-w-2xl font-[family-name:var(--font-syne)] text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em]">
        {t("title")}
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">{t("body")}</p>
      <div className="mt-10 flex flex-wrap gap-6">
        <button type="button" onClick={reset} className="btn-line">
          {t("retry")}
        </button>
        <Link href="/" className="btn-ghost">
          {tn("cta")}
        </Link>
      </div>
    </section>
  );
}
