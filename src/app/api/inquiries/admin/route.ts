import { NextRequest, NextResponse } from "next/server";
import { readSiteData, updateInquiryStatus } from "@/lib/data/store";

function authorized(req: NextRequest) {
  const token = req.cookies.get("studio_auth")?.value;
  const expected = process.env.DASHBOARD_PASSWORD ?? "studio";
  return token === expected;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readSiteData();
  return NextResponse.json(data.inquiries);
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await updateInquiryStatus(body.id, body.status);
  return NextResponse.json({ ok: true });
}
