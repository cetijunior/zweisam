import { NextRequest, NextResponse } from "next/server";
import { addInquiry } from "@/lib/data/store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(req: NextRequest) {
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
  if (!name || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 422 });
  }

  await addInquiry({
    name,
    email,
    locale: body.locale === "en" ? "en" : "de",
    eventType: field(body.eventType, 40),
    eventDate: field(body.eventDate, 20),
    message,
  });
  return NextResponse.json({ ok: true });
}
