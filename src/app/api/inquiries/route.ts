import { NextRequest, NextResponse } from "next/server";
import { addInquiry, getSettings } from "@/lib/data/store";
import { notifyInquiry } from "@/lib/notify";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Per-instance limit: 5 inquiries per IP per 10 minutes. Stops casual spam floods. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function field(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (field(body.company, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = field(body.name, 120);
  const email = field(body.email, 200);
  const message = field(body.message, 5000);
  if (!name || !message || !EMAIL_RE.test(email) || body.consent !== true) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 422 });
  }

  const inquiry = await addInquiry({
    name,
    email,
    locale: body.locale === "en" ? "en" : "de",
    eventType: field(body.eventType, 40),
    eventDate: field(body.eventDate, 20),
    message,
  });
  const settings = await getSettings();
  await notifyInquiry(inquiry, settings.studioName).catch((err) =>
    console.error("Inquiry email failed", err),
  );
  return NextResponse.json({ ok: true });
}
