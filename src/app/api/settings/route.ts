import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/data/store";

function authorized(req: NextRequest) {
  const token = req.cookies.get("studio_auth")?.value;
  const expected = process.env.DASHBOARD_PASSWORD ?? "studio";
  return token === expected;
}

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const settings = await updateSettings(body);
  return NextResponse.json(settings);
}
