"use client";

import { useEffect, useState } from "react";
import type { Inquiry } from "@/lib/data/types";

export default function DashboardInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);

  async function load() {
    const res = await fetch("/api/inquiries/admin");
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    // Initial fetch; state updates land asynchronously after the response.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function setStatus(id: string, status: Inquiry["status"]) {
    await fetch("/api/inquiries/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold">
        Inquiries
      </h1>
      <p className="mt-2 text-ink/55">Messages from the contact form.</p>
      <div className="mt-8 space-y-4">
        {items.length === 0 ? (
          <p className="text-ink/50">No inquiries yet.</p>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-black/10 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-ink/55">
                    {item.email} · {item.eventType} · {item.eventDate || "—"}
                  </p>
                </div>
                <span className="rounded-full bg-ink/5 px-3 py-1 text-xs uppercase tracking-wide">
                  {item.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed">{item.message}</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus(item.id, "read")}
                  className="rounded-full bg-ink/5 px-3 py-1 text-xs"
                >
                  Mark read
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(item.id, "archived")}
                  className="rounded-full bg-ink/5 px-3 py-1 text-xs"
                >
                  Archive
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
