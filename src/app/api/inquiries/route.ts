import { NextRequest, NextResponse } from "next/server";
import { addInquiry } from "@/lib/data/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const inquiry = await addInquiry({
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    locale: body.locale === "en" ? "en" : "de",
    eventType: String(body.eventType ?? ""),
    eventDate: String(body.eventDate ?? ""),
    message: String(body.message ?? ""),
  });
  return NextResponse.json(inquiry);
}
