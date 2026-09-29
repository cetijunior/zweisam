import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-start justify-center px-5 py-36 md:px-8">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-muted">404</p>
      <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-syne)] text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em]">
        {t("title")}
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
        {t("body")}
      </p>
      <Link href="/" className="btn-line mt-10">
        {t("cta")}
      </Link>
    </section>
  );
}
