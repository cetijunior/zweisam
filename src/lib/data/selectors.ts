import { createDefaultData } from "./defaults";
import { SERVICES, type Service } from "@/lib/services";
import type { Locale, MediaItem, Project, SiteData } from "./types";

export function getTagline(settings: SiteData["settings"], locale: Locale) {
  return locale === "de" ? settings.taglineDe : settings.taglineEn;
}

export function getAboutHeadline(
  settings: SiteData["settings"],
  locale: Locale,
) {
  return locale === "de"
    ? settings.aboutHeadlineDe
    : settings.aboutHeadlineEn;
}

export function getAboutBody(settings: SiteData["settings"], locale: Locale) {
  return locale === "de" ? settings.aboutBodyDe : settings.aboutBodyEn;
}

export function getPhotographersLine(
  settings: SiteData["settings"],
  locale: Locale,
) {
  return locale === "de"
    ? settings.photographersDe
    : settings.photographersEn;
}

export function categoryName(
  cat: SiteData["categories"][number],
  locale: Locale,
) {
  return locale === "de" ? cat.nameDe : cat.nameEn;
}

export function projectTitle(project: Project, locale: Locale) {
  return locale === "de" ? project.titleDe : project.titleEn;
}

export function mediaAlt(item: MediaItem, locale: Locale) {
  return locale === "de" ? item.altDe : item.altEn;
}

export function getCover(
  data: SiteData,
  project: Project,
): MediaItem | undefined {
  if (project.coverMediaId) {
    return data.media.find((m) => m.id === project.coverMediaId);
  }
  return data.media
    .filter((m) => m.projectId === project.id && m.published)
    .sort((a, b) => a.sortOrder - b.sortOrder)[0];
}

export function getPublishedProjects(data: SiteData) {
  return data.projects
    .filter((p) => p.published)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedProjects(data: SiteData) {
  return getPublishedProjects(data).filter((p) => p.featured);
}

export function getHeroImage(data: SiteData): MediaItem {
  const featured = getFeaturedProjects(data)[0];
  if (featured) {
    const cover = getCover(data, featured);
    if (cover) return cover;
  }
  return data.media[0] ?? createDefaultData().media[0];
}

/** URL-safe slug for a shoot page, derived from its English title. */
export function projectSlug(project: Project) {
  const base = project.titleEn
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || project.id;
}

export function getProjectBySlug(data: SiteData, slug: string) {
  return getPublishedProjects(data).find(
    (p) => projectSlug(p) === slug || p.id === slug,
  );
}

export function getProjectMedia(data: SiteData, project: Project) {
  return data.media
    .filter((m) => m.projectId === project.id && m.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function projectStory(project: Project, locale: Locale) {
  return (locale === "de" ? project.storyDe : project.storyEn) ?? "";
}

/** Published photos from the portfolio category a service draws on. */
export function serviceMedia(data: SiteData, service: Service) {
  const cat = data.categories.find((c) => c.slug === service.category);
  if (!cat) return [];
  const projectIds = new Set(
    getPublishedProjects(data)
      .filter((p) => p.categoryIds.includes(cat.id))
      .map((p) => p.id),
  );
  return data.media
    .filter((m) => m.published && m.projectId && projectIds.has(m.projectId))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** One cover per service; services sharing a category get different photos where possible. */
export function serviceCovers(data: SiteData): Record<string, MediaItem | undefined> {
  const used: Record<string, number> = {};
  return Object.fromEntries(
    SERVICES.map((s) => {
      const pool = serviceMedia(data, s);
      const i = used[s.category] ?? 0;
      used[s.category] = i + 1;
      return [s.slug, pool.length ? pool[i % pool.length] : undefined];
    }),
  );
}
