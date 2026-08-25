"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { MediaItem, Project } from "@/lib/data/types";

export default function DashboardLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/media");
    if (!res.ok) return;
    const data = await res.json();
    setMedia(data.media);
    setProjects(data.projects);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePublish(item: MediaItem) {
    await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "media",
        media: { ...item, published: !item.published },
      }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/media?id=${id}`, { method: "DELETE" });
    load();
  }

  async function setCover(item: MediaItem) {
    const project = projects.find((p) => p.id === item.projectId);
    if (!project) return;
    await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "project",
        project: { ...project, coverMediaId: item.id },
      }),
    });
    await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "media",
        media: { ...item, isCover: true },
      }),
    });
    load();
  }

  if (loading) {
    return <p className="text-ink/50">Loading library…</p>;
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold">
        Library
      </h1>
      <p className="mt-2 text-ink/55">
        Publish, set covers, or remove images. Changes appear on the public site.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {media.map((item) => {
          const project = projects.find((p) => p.id === item.projectId);
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-black/10 bg-white"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={item.url}
                  alt={item.altEn}
                  fill
                  className="object-cover"
                  sizes="250px"
                  unoptimized={item.url.startsWith("/uploads")}
                />
              </div>
              <div className="space-y-2 p-3 text-xs">
                <p className="truncate font-medium">
                  {project?.titleEn ?? item.projectId}
                </p>
                <p className="text-ink/50">
                  {item.published ? "Published" : "Hidden"}
                  {item.isCover || project?.coverMediaId === item.id
                    ? " · Cover"
                    : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => togglePublish(item)}
                    className="rounded-full bg-ink/5 px-2 py-1 hover:bg-ink/10"
                  >
                    {item.published ? "Hide" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCover(item)}
                    className="rounded-full bg-ink/5 px-2 py-1 hover:bg-ink/10"
                  >
                    Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded-full bg-red-50 px-2 py-1 text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
