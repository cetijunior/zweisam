import { promises as fs } from "fs";
import path from "path";
import { createDefaultData, DEFAULT_SETTINGS } from "./defaults";
import type {
  Inquiry,
  MediaItem,
  Project,
  SiteData,
  SiteSettings,
} from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "site-data.json");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DOC_ID = "main";
export const STORAGE_BUCKET = "portfolio";

/** Supabase persists edits across deploys and instances; without it we use the local JSON file. */
export const usingSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

function supabaseHeaders(extra: Record<string, string> = {}) {
  return {
    apikey: SUPABASE_KEY!,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    ...extra,
  };
}

async function readFromSupabase(): Promise<SiteData> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/site_document?id=eq.${DOC_ID}&select=data`,
    { headers: supabaseHeaders(), cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Supabase read failed: ${res.status}`);
  const rows = (await res.json()) as { data: SiteData }[];
  if (rows[0]) return rows[0].data;
  const seeded = createDefaultData();
  await writeToSupabase(seeded);
  return seeded;
}

async function writeToSupabase(data: SiteData): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/site_document`, {
    method: "POST",
    headers: supabaseHeaders({
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    }),
    body: JSON.stringify({
      id: DOC_ID,
      data,
      updated_at: new Date().toISOString(),
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase write failed: ${res.status}`);
}

/** Stores an upload in the public bucket (Supabase) or public/uploads (local); returns its URL. */
export async function saveUpload(
  filename: string,
  bytes: Buffer,
  contentType: string,
): Promise<string> {
  if (usingSupabase) {
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${filename}`,
      {
        method: "POST",
        headers: supabaseHeaders({ "Content-Type": contentType }),
        body: new Uint8Array(bytes),
      },
    );
    if (!res.ok) throw new Error(`Supabase upload failed: ${res.status}`);
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`;
  }
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), bytes);
  return `/uploads/${filename}`;
}

/** In-memory fallback — Vercel’s filesystem is read-only at runtime */
let memoryCache: SiteData | null = null;

/** Fills settings added after a document was first saved, so older data keeps working. */
function normalize(data: SiteData): SiteData {
  return { ...data, settings: { ...DEFAULT_SETTINGS, ...data.settings } };
}

export async function readSiteData(): Promise<SiteData> {
  if (usingSupabase) return normalize(await readFromSupabase());
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    memoryCache = normalize(JSON.parse(raw) as SiteData);
    return memoryCache;
  } catch {
    if (memoryCache) return memoryCache;
    memoryCache = createDefaultData();
    await writeSiteData(memoryCache);
    return memoryCache;
  }
}

export async function writeSiteData(data: SiteData): Promise<void> {
  if (usingSupabase) return writeToSupabase(data);
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
