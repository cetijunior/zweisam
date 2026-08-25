import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  deleteMedia,
  readSiteData,
  upsertMedia,
  upsertProject,
} from "@/lib/data/store";
import type { MediaItem, Project } from "@/lib/data/types";

function authorized(req: NextRequest) {
  const token = req.cookies.get("studio_auth")?.value;
  const expected = process.env.DASHBOARD_PASSWORD ?? "studio";
  return token === expected;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readSiteData();
  return NextResponse.json({
    media: data.media,
    projects: data.projects,
    categories: data.categories,
  });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const projectId = String(form.get("projectId") ?? "proj-uploads");
    const altDe = String(form.get("altDe") ?? "Upload");
    const altEn = String(form.get("altEn") ?? "Upload");

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const data = await readSiteData();
    let project = data.projects.find((p) => p.id === projectId);
    if (!project) {
      project = {
        id: projectId,
        titleDe: "Neue Uploads",
        titleEn: "New Uploads",
        location: data.settings.location,
        date: new Date().toISOString().slice(0, 10),
        featured: false,
        published: true,
        categoryIds: ["cat-gatherings"],
        coverMediaId: null,
      };
      await upsertProject(project);
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const id = `media-${crypto.randomUUID()}`;
    const filename = `${id}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    try {
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), bytes);
    } catch {
      return NextResponse.json(
        {
          error:
            "File uploads need a writable disk or Supabase Storage. Local uploads work in development; connect Storage before uploading in production.",
        },
        { status: 503 },
      );
    }

    const item: MediaItem = {
      id,
      projectId: project.id,
      url: `/uploads/${filename}`,
      width: 1600,
      height: 1200,
      altDe,
      altEn,
      sortOrder: data.media.filter((m) => m.projectId === project!.id).length,
      published: true,
      isCover: !project.coverMediaId,
    };

    await upsertMedia(item);
    if (!project.coverMediaId) {
      await upsertProject({ ...project, coverMediaId: item.id });
    }

    return NextResponse.json(item);
  }

  const body = await req.json();
  if (body.type === "project") {
    const project = await upsertProject(body.project as Project);
    return NextResponse.json(project);
  }
  if (body.type === "media") {
    const media = await upsertMedia(body.media as MediaItem);
    return NextResponse.json(media);
  }

  return NextResponse.json({ error: "Unknown payload" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  await deleteMedia(id);
  return NextResponse.json({ ok: true });
}
