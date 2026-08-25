import { promises as fs } from "fs";
import path from "path";
import { createDefaultData } from "./defaults";
import type {
  Inquiry,
  MediaItem,
  Project,
  SiteData,
  SiteSettings,
} from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "site-data.json");

/** In-memory fallback — Vercel’s filesystem is read-only at runtime */
let memoryCache: SiteData | null = null;

export async function readSiteData(): Promise<SiteData> {
  if (memoryCache) return memoryCache;

  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    memoryCache = JSON.parse(raw) as SiteData;
    return memoryCache;
  } catch {
    memoryCache = createDefaultData();
    await writeSiteData(memoryCache);
    return memoryCache;
  }
}

export async function writeSiteData(data: SiteData): Promise<void> {
  memoryCache = data;
  try {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // Ephemeral on serverless — memoryCache still holds the change for this instance
  }
}

export async function getSettings(): Promise<SiteSettings> {
  const data = await readSiteData();
  return data.settings;
}

export async function updateSettings(
  patch: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const data = await readSiteData();
  data.settings = { ...data.settings, ...patch };
  await writeSiteData(data);
  return data.settings;
}

export async function upsertMedia(item: MediaItem): Promise<MediaItem> {
  const data = await readSiteData();
  const idx = data.media.findIndex((m) => m.id === item.id);
  if (idx >= 0) data.media[idx] = item;
  else data.media.push(item);
  await writeSiteData(data);
  return item;
}

export async function deleteMedia(id: string): Promise<void> {
  const data = await readSiteData();
  data.media = data.media.filter((m) => m.id !== id);
  for (const p of data.projects) {
    if (p.coverMediaId === id) p.coverMediaId = null;
  }
  await writeSiteData(data);
}

export async function upsertProject(project: Project): Promise<Project> {
  const data = await readSiteData();
  const idx = data.projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) data.projects[idx] = project;
  else data.projects.push(project);
  await writeSiteData(data);
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  const data = await readSiteData();
  data.projects = data.projects.filter((p) => p.id !== id);
  data.media = data.media.filter((m) => m.projectId !== id);
  await writeSiteData(data);
}

export async function addInquiry(
  inquiry: Omit<Inquiry, "id" | "createdAt" | "status">,
): Promise<Inquiry> {
  const data = await readSiteData();
  const row: Inquiry = {
    ...inquiry,
    id: `inq-${crypto.randomUUID()}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  data.inquiries.unshift(row);
  await writeSiteData(data);
  return row;
}

export async function updateInquiryStatus(
  id: string,
  status: Inquiry["status"],
): Promise<void> {
  const data = await readSiteData();
  const row = data.inquiries.find((i) => i.id === id);
  if (row) row.status = status;
  await writeSiteData(data);
}
