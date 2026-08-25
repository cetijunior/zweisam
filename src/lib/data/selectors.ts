import { createDefaultData } from "./defaults";
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
