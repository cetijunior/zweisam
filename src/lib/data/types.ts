export type Locale = "de" | "en";

export type CategorySlug =
  | "couples"
  | "gender-reveal"
  | "birthdays"
  | "kids"
  | "gatherings"
  | "indoor"
  | "outdoor";

export interface SiteSettings {
  studioName: string;
  taglineDe: string;
  taglineEn: string;
  aboutHeadlineDe: string;
  aboutHeadlineEn: string;
  aboutBodyDe: string;
  aboutBodyEn: string;
  email: string;
  instagram: string;
  tiktok: string;
  handle: string;
  location: string;
  photographersDe: string;
  photographersEn: string;
  /** WhatsApp number in international format, digits only (e.g. 4915112345678). Empty hides the button. */
  whatsapp: string;
  phone: string;
  /** Impressum (§ 5 DDG): full legal name(s) of the responsible person(s) */
  legalName: string;
  /** Impressum: street + postcode/city, one line each */
  legalAddress: string;
  /** Impressum: USt-IdNr. or empty for Kleinunternehmer */
  vatId: string;
}

export interface Category {
  id: string;
  slug: CategorySlug;
  nameDe: string;
  nameEn: string;
  sortOrder: number;
}

export interface MediaItem {
  id: string;
  projectId: string;
  url: string;
  width: number;
  height: number;
  altDe: string;
  altEn: string;
  sortOrder: number;
  published: boolean;
  isCover: boolean;
}

export interface Project {
  id: string;
  titleDe: string;
  titleEn: string;
  location: string;
  date: string;
  featured: boolean;
  published: boolean;
  categoryIds: string[];
  coverMediaId: string | null;
  /** Short story shown on the shoot page */
  storyDe?: string;
  storyEn?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  locale: Locale;
  eventType: string;
  eventDate: string;
  message: string;
  status: "new" | "read" | "archived";
  createdAt: string;
}

export interface SiteData {
  settings: SiteSettings;
  categories: Category[];
  projects: Project[];
  media: MediaItem[];
  inquiries: Inquiry[];
}
