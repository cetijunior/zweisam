import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPublishedProjects, projectSlug } from "@/lib/data/selectors";
import { readSiteData } from "@/lib/data/store";
import { SERVICES } from "@/lib/services";
import { PUBLIC_PATHS, siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await readSiteData();
  const shoots = getPublishedProjects(data).map((p) => ({
    path: `/work/${projectSlug(p)}`,
    priority: 0.6,
  }));
  const pages = PUBLIC_PATHS.map((path) => ({
    path,
    priority: path === "" ? 1 : path === "/impressum" || path === "/datenschutz" ? 0.2 : 0.8,
  }));

  const services = SERVICES.map((s) => ({
    path: `/services/${s.slug}`,
    priority: 0.8,
  }));

  return [...pages, ...services, ...shoots].flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
        ),
      },
    })),
  );
}
