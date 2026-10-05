/** wa.me link for a WhatsApp number stored as digits with country code; text is pre-filled. */
export function whatsappUrl(number: string, text?: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function mailtoUrl(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Shown as "+49 151 1234 5678"-style text from stored digits. */
export function formatPhone(number: string) {
  const d = number.replace(/\D/g, "");
  if (d.startsWith("49") && d.length > 6) {
    const rest = d.slice(2);
    return `+49 ${rest.slice(0, 3)} ${rest.slice(3)}`;
  }
  return `+${d}`;
}
