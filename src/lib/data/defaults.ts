import type { SiteData } from "./types";

/** Default brand — fully replaceable from Dashboard → Brand */
export const DEFAULT_SETTINGS = {
  studioName: "Klick Berlin",
  taglineDe: "Die kleinen Feiern. Die großen Gefühle.",
  taglineEn: "Small gatherings. Big feelings.",
  aboutHeadlineDe: "Zwei Blicke. Eine Geschichte.",
  aboutHeadlineEn: "Two lenses. One story.",
  aboutBodyDe:
    "Wir sind ein Paar hinter der Kamera — und fotografieren die Feiern dazwischen: Paarshootings, Gender Reveals, Geburtstage, Kinderfeste und Zusammenkünfte in Berlin. Drinnen und draußen. Nah, warm, echt.",
  aboutBodyEn:
    "We are a couple behind the camera — photographing the celebrations in between: couple sessions, gender reveals, birthdays, kids’ parties, and gatherings across Berlin. Indoors and outdoors. Close, warm, real.",
  email: "klickberlinevents@gmail.com",
  instagram: "https://instagram.com/klick_berlin",
  tiktok: "",
  handle: "@klick_berlin",
  location: "Berlin",
  photographersDe: "Ein Paar. Ein Studio.",
  photographersEn: "A couple. A studio.",
  whatsapp: "491792210021",
  phone: "",
  legalName: "",
  legalAddress: "",
  vatId: "",
} as const;

const cat = (
  id: string,
  slug: SiteData["categories"][number]["slug"],
  nameDe: string,
  nameEn: string,
  sortOrder: number,
) => ({ id, slug, nameDe, nameEn, sortOrder });

function m(
  id: string,
  projectId: string,
  url: string,
  width: number,
  height: number,
  altDe: string,
  altEn: string,
  sortOrder: number,
  isCover: boolean,
) {
  return {
    id,
    projectId,
    url,
    width,
    height,
    altDe,
    altEn,
    sortOrder,
    published: true,
    isCover,
  };
}

export function createDefaultData(): SiteData {
  const categories = [
    cat("cat-couples", "couples", "Paare", "Couples", 1),
    cat("cat-gender", "gender-reveal", "Gender Reveal", "Gender Reveal", 2),
    cat("cat-birthdays", "birthdays", "Geburtstage", "Birthdays", 3),
    cat("cat-kids", "kids", "Kinderfeste", "Kids Parties", 4),
    cat("cat-gatherings", "gatherings", "Zusammenkünfte", "Gatherings", 5),
    cat("cat-indoor", "indoor", "Indoor", "Indoor", 6),
    cat("cat-outdoor", "outdoor", "Outdoor", "Outdoor", 7),
  ];

  const projects: SiteData["projects"] = [
    {
      id: "proj-1",
      titleDe: "Goldene Stunde am Tempelhofer Feld",
      titleEn: "Golden Hour at Tempelhofer Feld",
      location: "Berlin Tempelhof",
      date: "2025-06-14",
      featured: true,
      published: true,
      categoryIds: ["cat-couples", "cat-outdoor"],
      coverMediaId: "media-1",
    },
    {
      id: "proj-2",
      titleDe: "Sommerfest im Park",
      titleEn: "Summer Party in the Park",
      location: "Berlin Prenzlauer Berg",
      date: "2025-04-02",
      featured: true,
      published: true,
      categoryIds: ["cat-gender", "cat-gatherings", "cat-outdoor"],
      coverMediaId: "media-4",
    },
    {
      id: "proj-3",
      titleDe: "Rund um die Oberbaumbrücke",
      titleEn: "Around the Oberbaumbrücke",
      location: "Berlin Kreuzberg",
      date: "2025-03-18",
      featured: true,
      published: true,
      categoryIds: ["cat-birthdays", "cat-kids", "cat-indoor"],
      coverMediaId: "media-7",
    },
    {
      id: "proj-4",
      titleDe: "Museumsinsel & Gendarmenmarkt",
      titleEn: "Museum Island & Gendarmenmarkt",
      location: "Berlin Mitte",
      date: "2025-02-09",
      featured: false,
      published: true,
      categoryIds: ["cat-couples", "cat-indoor"],
      coverMediaId: "media-10",
    },
    {
      id: "proj-5",
      titleDe: "Sonntag an der Spree",
      titleEn: "Sunday by the Spree",
      location: "Berlin Mitte",
      date: "2025-05-25",
      featured: false,
      published: true,
      categoryIds: ["cat-gatherings", "cat-kids", "cat-outdoor"],
      coverMediaId: "media-12",
    },
    {
      id: "proj-6",
      titleDe: "Abendlicht im Tiergarten",
      titleEn: "Evening Light in Tiergarten",
      location: "Berlin Tiergarten",
      date: "2025-07-01",
      featured: true,
      published: true,
      categoryIds: ["cat-couples", "cat-outdoor"],
      coverMediaId: "media-14",
    },
  ];

  const media: SiteData["media"] = [
    m("media-1", "proj-1", "https://images.unsplash.com/photo-1623685068754-2067aeb3b5c0?w=1600&q=80", 1600, 1067, "Paar im Abendlicht auf einer Wiese", "Couple in evening light on a meadow", 0, true),
    m("media-2", "proj-1", "https://images.unsplash.com/photo-1597070892633-54d9b794f33c?w=1600&q=80", 1600, 1067, "Sonnenuntergang über dem Tempelhofer Feld", "Sunset over Tempelhofer Feld", 1, false),
    m("media-3", "proj-1", "https://images.unsplash.com/photo-1684513290731-c1d83dd7dcdf?w=1600&q=80", 1600, 2400, "Weite Wiese am Tempelhofer Feld", "Open meadow at Tempelhofer Feld", 2, false),
    m("media-21", "proj-1", "https://images.unsplash.com/photo-1623685068723-60cb345b9924?w=1600&q=80", 1600, 1067, "Paar unter einem Baum im Gegenlicht", "Couple under a tree in backlight", 3, false),
    m("media-4", "proj-2", "https://images.unsplash.com/photo-1586463460313-1062ffc385e9?w=1600&q=80", 1600, 2000, "Familie macht ein Selfie im Park", "Family taking a selfie in the park", 0, true),
    m("media-5", "proj-2", "https://images.unsplash.com/photo-1706692343681-e68dded3b12e?w=1600&q=80", 1600, 1067, "Sommertag mit Freunden im Park", "Summer day with friends in the park", 1, false),
    m("media-6", "proj-2", "https://images.unsplash.com/photo-1711981030058-1b06eb3e51f6?w=1600&q=80", 1600, 2400, "Picknick auf der Wiese in Berlin", "Picnic on a Berlin lawn", 2, false),
    m("media-19", "proj-2", "https://images.unsplash.com/photo-1663028054729-221e69b860c6?w=1600&q=80", 1600, 2400, "Straßenfest in Berlin", "Street festival in Berlin", 3, false),
    m("media-7", "proj-3", "https://images.unsplash.com/photo-1590158789848-966103346371?w=1600&q=80", 1600, 1067, "Oberbaumbrücke über der Spree", "Oberbaumbrücke over the Spree", 0, true),
    m("media-8", "proj-3", "https://images.unsplash.com/photo-1728767547717-6ab36e55796b?w=1600&q=80", 1600, 2844, "Arkaden der Oberbaumbrücke", "Arcades of the Oberbaumbrücke", 1, false),
    m("media-9", "proj-3", "https://images.unsplash.com/photo-1655367541247-c2fe424f37ad?w=1600&q=80", 1600, 2400, "Sonnige Straße in Kreuzberg", "Sunlit street in Kreuzberg", 2, false),
    m("media-20", "proj-3", "https://images.unsplash.com/photo-1618749651770-a2613f10d391?w=1600&q=80", 1600, 1067, "Hochbahn und Fernsehturm", "Elevated U-Bahn and TV tower", 3, false),
    m("media-10", "proj-4", "https://images.unsplash.com/photo-1623685067341-63f9a3b482be?w=1600&q=80", 1600, 1067, "Paar in den Kolonnaden der Museumsinsel", "Couple in the colonnades on Museum Island", 0, true),
    m("media-11", "proj-4", "https://images.unsplash.com/photo-1776366816962-2405dd3d71a3?w=1600&q=80", 1600, 1200, "Paar in Mänteln auf dem Bahnsteig", "Couple in coats on a platform", 1, false),
    m("media-18", "proj-4", "https://images.unsplash.com/photo-1582395148362-ce7c64228068?w=1600&q=80", 1600, 1136, "Gendarmenmarkt bei Sonnenschein", "Gendarmenmarkt in sunshine", 2, false),
    m("media-22", "proj-4", "https://images.unsplash.com/photo-1591053165370-8690088d6017?w=1600&q=80", 1600, 2154, "Paar spaziert durch Berlin", "Couple strolling through Berlin", 3, false),
    m("media-12", "proj-5", "https://images.unsplash.com/photo-1591104610862-70d9c39075df?w=1600&q=80", 1600, 1067, "Bank an der Spree", "Bench by the Spree", 0, true),
    m("media-13", "proj-5", "https://images.unsplash.com/photo-1720543899037-3240e4b0fa88?w=1600&q=80", 1600, 2413, "Wiese am Spreeufer", "Lawn on the Spree riverbank", 1, false),
    m("media-17", "proj-5", "https://images.unsplash.com/photo-1706867615706-0b6485fc0590?w=1600&q=80", 1600, 1067, "Spaziergang an der Uferpromenade", "Walk along the riverside promenade", 2, false),
    m("media-23", "proj-5", "https://images.unsplash.com/photo-1538685634737-24b83e3fa2f8?w=1600&q=80", 1600, 2133, "Berliner Dom an der Spree", "Berlin Cathedral by the Spree", 3, false),
    m("media-14", "proj-6", "https://images.unsplash.com/photo-1623685067958-af4b406a0732?w=1600&q=80", 1600, 2400, "Paar im goldenen Licht im Park", "Couple in golden light in the park", 0, true),
    m("media-15", "proj-6", "https://images.unsplash.com/photo-1731192539284-0ee7325e25a8?w=1600&q=80", 1600, 1067, "Paar bei Sonnenuntergang am Wasser", "Couple at sunset by the water", 1, false),
    m("media-16", "proj-6", "https://images.unsplash.com/photo-1604179410128-8f1dd6ba024e?w=1600&q=80", 1600, 1069, "Teich im Tiergarten", "Pond in Tiergarten", 2, false),
    m("media-24", "proj-6", "https://images.unsplash.com/photo-1598261489186-8013f5baa35d?w=1600&q=80", 1600, 1324, "Trauerweide an der Spree", "Weeping willow by the Spree", 3, false),
    m("media-25", "proj-6", "https://images.unsplash.com/photo-1697588501622-f6914ce013a2?w=1600&q=80", 1600, 864, "Blick über den Tiergarten zum Fernsehturm", "View over Tiergarten to the TV tower", 4, false),
  ];

  return {
    settings: { ...DEFAULT_SETTINGS },
    categories,
    projects,
    media,
    inquiries: [
      {
        id: "inq-1",
        name: "Lena & Jonas",
        email: "lena@example.com",
        locale: "de",
        eventType: "Gender Reveal",
        eventDate: "2026-09-12",
        message:
          "Hallo! Wir planen ein kleines Gender Reveal im Park — seid ihr verfügbar?",
        status: "new",
        createdAt: new Date().toISOString(),
      },
    ],
  };
}
