"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Project } from "@/lib/data/types";

const NEW = "__new__";

function emptyProject(): Project {
  return {
    id: `proj-${crypto.randomUUID().slice(0, 8)}`,
    titleDe: "",
    titleEn: "",
    location: "Berlin",
    date: new Date().toISOString().slice(0, 10),
    featured: false,
    published: true,
    categoryIds: [],
    coverMediaId: null,
    storyDe: "",
    storyEn: "",
  };
}

/** Reads the real pixel size so the masonry grid keeps each photo's aspect ratio. */
async function imageSize(file: File) {
  try {
    const bmp = await createImageBitmap(file);
    const size = { width: bmp.width, height: bmp.height };
    bmp.close();
    return size;
  } catch {
    return { width: 1600, height: 1200 };
  }
}

const input =
  "mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-ink/30";
const label = "block text-xs uppercase tracking-[0.15em] text-ink/45";

export default function DashboardUploadPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string>(NEW);
  const [draft, setDraft] = useState<Project>(emptyProject);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function load() {
    const res = await fetch("/api/media");
    if (!res.ok) return;
    const data = await res.json();
    setProjects(data.projects);
    setCategories(data.categories);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  function pick(id: string) {
    setSelected(id);
    setStatus("");
    const existing = projects.find((p) => p.id === id);
    setDraft(existing ? { storyDe: "", storyEn: "", ...existing } : emptyProject());
  }

  function toggleCategory(id: string) {
    setDraft((d) => ({
      ...d,
      categoryIds: d.categoryIds.includes(id)
        ? d.categoryIds.filter((c) => c !== id)
        : [...d.categoryIds, id],
    }));
  }

  async function saveProject(project: Project) {
    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "project", project }),
    });
    if (!res.ok) throw new Error("Could not save shoot");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.titleDe || !draft.titleEn) {
      setStatus("Add a title in both languages.");
      return;
    }
    setPending(true);
    try {
      await saveProject(draft);
      let done = 0;
      for (const file of files) {
        setStatus(`Uploading ${done + 1} of ${files.length}…`);
        const { width, height } = await imageSize(file);
        const form = new FormData();
        form.set("file", file);
        form.set("projectId", draft.id);
        form.set("altDe", draft.titleDe);
        form.set("altEn", draft.titleEn);
        form.set("width", String(width));
        form.set("height", String(height));
        const res = await fetch("/api/media", { method: "POST", body: form });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? `Upload failed for ${file.name}`);
        }
        done++;
      }
      setStatus(
        files.length
          ? `Saved — ${done} photo${done === 1 ? "" : "s"} added. Set the cover in Library.`
          : "Shoot details saved.",
      );
      setFiles([]);
      setSelected(draft.id);
      await load();
      router.refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold">
        Photoshoots
      </h1>
      <p className="mt-2 text-ink/55">
        Each shoot becomes its own story page on the site (Work → Stories). Create a
        shoot, then drop in the whole set of photos.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <label className="block">
          <span className={label}>Shoot</span>
          <select value={selected} onChange={(e) => pick(e.target.value)} className={input}>
            <option value={NEW}>+ New shoot</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.titleEn || p.titleDe} ({p.date})
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Title (DE)</span>
            <input
              value={draft.titleDe}
              onChange={(e) => setDraft({ ...draft, titleDe: e.target.value })}
              className={input}
              required
            />
          </label>
          <label className="block">
            <span className={label}>Title (EN)</span>
            <input
              value={draft.titleEn}
              onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })}
              className={input}
              required
            />
          </label>
          <label className="block">
            <span className={label}>Location</span>
            <input
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              className={input}
            />
          </label>
          <label className="block">
            <span className={label}>Date</span>
            <input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              className={input}
            />
          </label>
        </div>

        <fieldset>
          <legend className={label}>Categories</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c) => {
              const on = draft.categoryIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCategory(c.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    on ? "border-ink bg-ink text-white" : "border-black/15 bg-white"
                  }`}
                >
                  {c.nameEn}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="block">
          <span className={label}>Story (DE) — optional, 1–3 sentences</span>
          <textarea
            rows={3}
            value={draft.storyDe ?? ""}
            onChange={(e) => setDraft({ ...draft, storyDe: e.target.value })}
            className={input}
          />
        </label>
        <label className="block">
          <span className={label}>Story (EN)</span>
          <textarea
            rows={3}
            value={draft.storyEn ?? ""}
            onChange={(e) => setDraft({ ...draft, storyEn: e.target.value })}
            className={input}
          />
        </label>

        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
            />
            Published
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
            />
            Featured (can become the homepage image)
          </label>
        </div>

        <label className="block rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center">
          <span className="block text-sm text-ink/60">
            {files.length
              ? `${files.length} photo${files.length === 1 ? "" : "s"} selected`
              : "Choose photos (JPEG, PNG, WebP, AVIF — max 15 MB each)"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="mt-4 w-full text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-6 py-3 text-sm text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : files.length ? "Save shoot & upload" : "Save shoot"}
        </button>
        {status ? <p className="text-sm text-ink/60">{status}</p> : null}
      </form>
    </div>
  );
}
