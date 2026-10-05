import type { Inquiry } from "@/lib/data/types";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_TO = process.env.INQUIRY_NOTIFY_EMAIL;
const NOTIFY_FROM = process.env.INQUIRY_FROM_EMAIL ?? "Website <onboarding@resend.dev>";

/** New inquiries are emailed to the studio when RESEND_API_KEY + INQUIRY_NOTIFY_EMAIL are set. */
export const inquiryEmailEnabled = Boolean(RESEND_API_KEY && NOTIFY_TO);

export async function notifyInquiry(inquiry: Inquiry, studioName: string): Promise<void> {
  if (!inquiryEmailEnabled) return;
  const text = [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Event: ${inquiry.eventType || "-"}`,
    `Date: ${inquiry.eventDate || "-"}`,
    `Language: ${inquiry.locale.toUpperCase()}`,
    "",
    inquiry.message,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: NOTIFY_TO!.split(",").map((s) => s.trim()),
      reply_to: inquiry.email,
      subject: `${studioName}: new inquiry from ${inquiry.name}`,
      text,
    }),
  });
  if (!res.ok) {
    console.error("Inquiry email failed", res.status, await res.text().catch(() => ""));
  }
}
