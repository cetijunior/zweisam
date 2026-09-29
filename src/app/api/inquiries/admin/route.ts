import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { readSiteData, updateInquiryStatus } from "@/lib/data/store";

export async function GET(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readSiteData();
  return NextResponse.json(data.inquiries);
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await updateInquiryStatus(body.id, body.status);
  return NextResponse.json({ ok: true });
}
