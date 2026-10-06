import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { Analytics } from "@/components/consent/Analytics";
import { BrandProvider } from "@/components/brand/BrandProvider";
import {
  FloatingActions,
  SiteFooter,
  SiteHeader,
} from "@/components/layout/SiteChrome";
import { ScrollProgress } from "@/components/motion/primitives";
import { routing } from "@/i18n/routing";
import { readSiteData } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [messages, data] = await Promise.all([getMessages(), readSiteData()]);

  return (
    <NextIntlClientProvider messages={messages}>
      <BrandProvider settings={data.settings}>
        <ScrollProgress />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="min-h-screen outline-none">
          {children}
        </main>
        <SiteFooter />
        <FloatingActions />
        <Analytics />
        <VercelAnalytics />
      </BrandProvider>
    </NextIntlClientProvider>
  );
}
