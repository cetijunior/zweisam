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
