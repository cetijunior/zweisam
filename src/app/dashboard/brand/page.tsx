"use client";

import { FormEvent, useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/data/types";

const FIELDS: { key: keyof SiteSettings; label: string; multiline?: boolean }[] =
  [
    { key: "studioName", label: "Studio name (site-wide)" },
    { key: "handle", label: "Social handle" },
    { key: "location", label: "Location" },
    { key: "email", label: "Email" },
    { key: "instagram", label: "Instagram URL" },
    { key: "tiktok", label: "TikTok URL" },
    { key: "whatsapp", label: "WhatsApp number (digits only, with country code, e.g. 4915112345678)" },
    { key: "phone", label: "Phone (shown on contact page + Impressum)" },
    { key: "legalName", label: "Impressum: full legal name(s) — required by law" },
    { key: "legalAddress", label: "Impressum: street, postcode + city — required by law", multiline: true },
    { key: "vatId", label: "Impressum: USt-IdNr. (leave empty if Kleinunternehmer)" },
    { key: "taglineDe", label: "Tagline (DE)" },
    { key: "taglineEn", label: "Tagline (EN)" },
    { key: "photographersDe", label: "Photographers line (DE)" },
    { key: "photographersEn", label: "Photographers line (EN)" },
    { key: "aboutHeadlineDe", label: "About headline (DE)" },
    { key: "aboutHeadlineEn", label: "About headline (EN)" },
    { key: "aboutBodyDe", label: "About body (DE)", multiline: true },
    { key: "aboutBodyEn", label: "About body (EN)", multiline: true },
  ];

export default function DashboardBrandPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setPending(true);
    setSaved(false);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setPending(false);
    if (res.ok) {
      setSaved(true);
      setSettings(await res.json());
    }
  }

  if (!settings) {
    return <p className="text-ink/50">Loading brand…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold">
        Brand
      </h1>
      <p className="mt-2 text-ink/55">
        Change the studio name here — it updates the nav, hero, footer, metadata,
        and emails across the whole site.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        {FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-ink/45">
              {field.label}
            </span>
            {field.multiline ? (
              <textarea
                rows={4}
                value={settings[field.key] ?? ""}
                onChange={(e) =>
                  setSettings({ ...settings, [field.key]: e.target.value })
                }
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-ink/30"
              />
            ) : (
              <input
                value={settings[field.key] ?? ""}
                onChange={(e) =>
                  setSettings({ ...settings, [field.key]: e.target.value })
                }
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-ink/30"
              />
            )}
          </label>
        ))}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-6 py-3 text-sm text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save brand"}
        </button>
        {saved ? (
          <p className="text-sm text-emerald-700">
            Saved. Refresh the public site to see the new name everywhere.
          </p>
        ) : null}
      </form>
    </div>
  );
}
