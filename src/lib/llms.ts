import { getPublishedProjects, projectSlug } from "@/lib/data/selectors";
import { readSiteData } from "@/lib/data/store";
import { BERLIN_AREAS, SERVICES } from "@/lib/services";
import { siteUrl } from "@/lib/site";

/** Markdown summary of the studio for AI assistants (llmstxt.org). `full` adds every service's details. */
export async function buildLlmsTxt(full: boolean) {
  const { settings, ...data } = await readSiteData();
  const shoots = getPublishedProjects({ settings, ...data });
  const contact = [
    settings.whatsapp ? `- WhatsApp (preferred, fastest reply): +${settings.whatsapp} – https://wa.me/${settings.whatsapp}` : "",
    `- Email: ${settings.email}`,
    `- Instagram: ${settings.instagram}`,
    `- Inquiry form: ${siteUrl}/de/contact`,
  ].filter(Boolean);

  const lines = [
    `# ${settings.studioName}`,
    "",
    `> ${settings.studioName} is a photography studio in Berlin, Germany, run by a couple. It photographs intimate celebrations and personal milestones – couple shoots, proposals, engagements, civil weddings, gender reveals, baby showers, maternity and family shoots, birthdays and kids' parties, christenings, henna nights and private or company parties – across all Berlin districts and Potsdam. Languages: German and English.`,
    "",
    `Tagline: "${settings.taglineDe}" / "${settings.taglineEn}"`,
    "",
    "## Contact & booking",
    ...contact,
    "- Typical reply time: within 24 hours. Prices on request, tailored to each celebration.",
    "",
    "## Services",
    ...SERVICES.map((s) => `- [${s.titleEn}](${siteUrl}/en/services/${s.slug}) / [${s.titleDe}](${siteUrl}/de/services/${s.slug}): ${s.shortEn}`),
    "",
    "## Areas served",
    `Berlin (all districts): ${BERLIN_AREAS.join(", ")}. Travel within Berlin at no extra charge.`,
    "",
    "## Key pages",
    `- [Home](${siteUrl}/de) – overview, services, process, FAQ`,
    `- [Services](${siteUrl}/en/services) – all occasions`,
    `- [Portfolio / Work](${siteUrl}/en/work)`,
    `- [About](${siteUrl}/en/about)`,
    `- [Contact / inquiry](${siteUrl}/en/contact)`,
    "",
    "## How a booking works",
    "1. Send a short message on WhatsApp or via the form with date, place and occasion.",
    "2. Short call or chat to plan mood, timing and people.",
    "3. The shoot – unobtrusive, natural, no stiff posing.",
    "4. Edited private online gallery, delivered in about two weeks.",
  ];

  if (shoots.length) {
    lines.push("", "## Portfolio stories", ...shoots.map((p) => `- [${p.titleEn}](${siteUrl}/en/work/${projectSlug(p)}) – ${p.location}`));
  }

  if (full) {
    lines.push("", "## Service details");
    for (const s of SERVICES) {
      lines.push(
        "",
        `### ${s.titleEn} (${s.titleDe})`,
        s.bodyEn,
        "",
        `Included: ${s.includesEn.join("; ")}.`,
        `Popular spots: ${s.spots.join(", ")}.`,
        `Q: ${s.faqEn.q} A: ${s.faqEn.a}`,
        `German search terms: ${s.keywordsDe.join(", ")}.`,
        `URL: ${siteUrl}/en/services/${s.slug}`,
      );
    }
  } else {
    lines.push("", "## Optional", `- [Full details for every service](${siteUrl}/llms-full.txt)`);
  }

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
