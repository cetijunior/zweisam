"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardUploadPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setStatus("");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const res = await fetch("/api/media", { method: "POST", body: form });
    setPending(false);
    if (!res.ok) {
      setStatus("Upload failed");
      return;
    }
    setStatus("Uploaded — appearing in library");
    formEl.reset();
    router.refresh();
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold">
        Upload
      </h1>
      <p className="mt-2 text-ink/55">
        Drop photos here. Stored locally for now; swap to Supabase Storage later.
      </p>
      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-dashed border-black/20 bg-white p-8"
      >
        <input
          name="file"
          type="file"
          accept="image/*"
          required
          className="w-full text-sm"
        />
        <input
          name="altDe"
          placeholder="Alt text (DE)"
          className="w-full border-b border-black/15 py-2 outline-none"
        />
        <input
          name="altEn"
          placeholder="Alt text (EN)"
          className="w-full border-b border-black/15 py-2 outline-none"
        />
        <input type="hidden" name="projectId" value="proj-uploads" />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-6 py-3 text-sm text-cream disabled:opacity-60"
        >
          {pending ? "Uploading…" : "Upload photo"}
        </button>
        {status ? <p className="text-sm text-ink/60">{status}</p> : null}
      </form>
    </div>
  );
}
