import type { MetadataRoute } from "next";
import { readSiteData } from "@/lib/data/store";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { settings } = await readSiteData();
  return {
    name: `${settings.studioName} — ${settings.location}`,
    short_name: settings.studioName,
    description: settings.taglineEn,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f5f3",
    theme_color: "#1c1b1a",
    icons: [{ src: "/icon.png", sizes: "any", type: "image/png" }],
  };
}
