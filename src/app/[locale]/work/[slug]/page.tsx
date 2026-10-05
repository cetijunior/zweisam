import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ShootView } from "@/components/work/ShootView";
import type { AppLocale } from "@/i18n/routing";
import {
  getCover,
  getProjectBySlug,
  getProjectMedia,
  getPublishedProjects,
  mediaAlt,
  projectSlug,
  projectStory,
  projectTitle,
} from "@/lib/data/selectors";
import { readSiteData } from "@/lib/data/store";
import { pageMetadata } from "@/lib/site";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await readSiteData();
  const project = getProjectBySlug(data, slug);
  if (!project) return {};
  const loc = locale as AppLocale;
  const cover = getCover(data, project);
  return pageMetadata({
    locale: loc,
    path: `/work/${projectSlug(project)}`,
    title: `${projectTitle(project, loc)} — ${data.settings.studioName}`,
    description:
      projectStory(project, loc) ||
      `${projectTitle(project, loc)} · ${project.location}`,
    settings: data.settings,
    image: cover ? { url: cover.url, alt: mediaAlt(cover, loc) } : undefined,
  });
}

export default async function ShootPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const data = await readSiteData();
  const project = getProjectBySlug(data, slug);
  if (!project) notFound();
  const media = getProjectMedia(data, project);
  if (media.length === 0) notFound();

  const all = getPublishedProjects(data);
  const next = all[(all.findIndex((p) => p.id === project.id) + 1) % all.length];

  return (
    <ShootView
      data={data}
      project={project}
      media={media}
      next={next && next.id !== project.id ? next : undefined}
    />
  );
}
