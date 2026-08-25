"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/data/types";

const links = [
  { href: "/dashboard", label: "Library" },
  { href: "/dashboard/upload", label: "Upload" },
  { href: "/dashboard/brand", label: "Brand" },
  { href: "/dashboard/inquiries", label: "Inquiries" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [studioName, setStudioName] = useState("Studio");
  const isLogin = pathname.startsWith("/dashboard/login");

  useEffect(() => {
    if (isLogin) return;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s: SiteSettings) => setStudioName(s.studioName))
      .catch(() => undefined);
  }, [pathname, isLogin]);

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/dashboard/login");
    router.refresh();
  }

  if (isLogin) {
    return (
      <div className="min-h-screen bg-[#f3eee6] text-ink">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3eee6] text-ink">
      <header className="border-b border-black/10 bg-[#f3eee6]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
              Dashboard
            </p>
            <p className="font-[family-name:var(--font-syne)] text-xl font-bold">
              {studioName}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/de" className="text-ink/60 hover:text-ink">
              View site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-ink/60 hover:text-ink"
            >
              Log out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 pb-3">
          {links.map((link) => {
            const active =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm ${
                  active
                    ? "bg-[#1c1b1a] text-[#f6f5f3]"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
