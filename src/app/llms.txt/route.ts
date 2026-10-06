import { buildLlmsTxt } from "@/lib/llms";

export const revalidate = 3600;

export function GET() {
  return buildLlmsTxt(false);
}
