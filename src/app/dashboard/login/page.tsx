"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });
    setPending(false);
    if (!res.ok) {
      setError(res.status === 503 ? "Dashboard password is not configured" : "Wrong password");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-8 shadow-sm"
      >
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold">
          Studio login
        </h1>
        {process.env.NODE_ENV !== "production" ? (
          <p className="mt-2 text-sm text-ink/55">
            Dev password: <code className="text-ink">studio</code>
          </p>
        ) : null}
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          aria-label="Password"
          autoComplete="current-password"
          className="mt-6 w-full border-b border-black/20 bg-transparent py-3 outline-none"
        />
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-full bg-ink py-3 text-sm text-white disabled:opacity-60"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
