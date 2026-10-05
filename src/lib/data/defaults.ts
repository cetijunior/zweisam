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
      titleDe: "Sonntag am Tempelhofer Feld",
      titleEn: "Sunday at Tempelhofer Feld",
      location: "Berlin Neukölln",
      date: "2025-06-14",
      featured: true,
      published: true,
      categoryIds: ["cat-couples", "cat-outdoor"],
      coverMediaId: "media-1",
    },
    {
      id: "proj-2",
      titleDe: "Rosa oder Blau — Prenzlauer Berg",
      titleEn: "Pink or Blue — Prenzlauer Berg",
      location: "Berlin Prenzlauer Berg",
      date: "2025-04-02",
      featured: true,
      published: true,
      categoryIds: ["cat-gender", "cat-gatherings", "cat-outdoor"],
      coverMediaId: "media-4",
    },
    {
      id: "proj-3",
      titleDe: "Fünf Kerzen in Kreuzberg",
      titleEn: "Five Candles in Kreuzberg",
      location: "Berlin Kreuzberg",
      date: "2025-03-18",
      featured: true,
      published: true,
      categoryIds: ["cat-birthdays", "cat-kids", "cat-indoor"],
      coverMediaId: "media-7",
    },
    {
      id: "proj-4",
      titleDe: "Abendlicht im Atelier",
      titleEn: "Evening Light in the Atelier",
      location: "Berlin Mitte",
      date: "2025-02-09",
      featured: false,
      published: true,
      categoryIds: ["cat-couples", "cat-indoor"],
      coverMediaId: "media-10",
    },
    {
      id: "proj-5",
      titleDe: "Familienbrunch am Landwehrkanal",
      titleEn: "Family Brunch by the Canal",
      location: "Berlin Friedrichshain",
      date: "2025-05-25",
      featured: false,
      published: true,
      categoryIds: ["cat-gatherings", "cat-kids", "cat-outdoor"],
      coverMediaId: "media-12",
    },
    {
      id: "proj-6",
      titleDe: "Goldene Stunde, Tiergarten",
      titleEn: "Golden Hour, Tiergarten",
      location: "Berlin Tiergarten",
      date: "2025-07-01",
      featured: true,
      published: true,
      categoryIds: ["cat-couples", "cat-outdoor"],
      coverMediaId: "media-14",
    },
  ];

  const media: SiteData["media"] = [
    m("media-1", "proj-1", "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1600&q=80", 1600, 2400, "Paar umarmt sich im warmen Licht", "Couple embracing in warm light", 0, true),
    m("media-2", "proj-1", "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&q=80", 1600, 1067, "Paarspaziergang draußen", "Couple walking outdoors", 1, false),
    m("media-3", "proj-1", "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80", 1600, 1067, "Hände halten bei Sonnenuntergang", "Hands held at sunset", 2, false),
    m("media-4", "proj-2", "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80", 1600, 1067, "Feiernde Gruppe draussen", "Celebrating group outdoors", 0, true),
    m("media-5", "proj-2", "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80", 1600, 1067, "Bunte Partyballons", "Colorful party balloons", 1, false),
    m("media-6", "proj-2", "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1600&q=80", 1600, 1067, "Überraschungsmoment im Kreis", "Surprise moment together", 2, false),
    m("media-7", "proj-3", "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80", 1600, 1067, "Geburtstagstisch mit Blumen", "Birthday table with flowers", 0, true),
    m("media-8", "proj-3", "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80", 1600, 1067, "Kind lacht bei Feier", "Child laughing at a party", 1, false),
    m("media-9", "proj-3", "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1600&q=80", 1600, 1200, "Kinderparty Indoor", "Indoor kids party", 2, false),
    m("media-10", "proj-4", "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600&q=80", 1600, 1067, "Paarporträt im Studio", "Couple portrait indoors", 0, true),
    m("media-11", "proj-4", "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600&q=80", 1600, 1067, "Intimes Paarporträt", "Intimate couple portrait", 1, false),
    m("media-12", "proj-5", "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1600&q=80", 1600, 1067, "Familienpicknick draußen", "Family picnic outdoors", 0, true),
    m("media-13", "proj-5", "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1600&q=80", 1600, 1067, "Familie feiert zusammen", "Family celebrating together", 1, false),
    m("media-14", "proj-6", "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1600&q=80", 1600, 1067, "Paar im golden hour Licht", "Couple in golden hour light", 0, true),
    m("media-15", "proj-6", "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=80", 1600, 1067, "Romantischer Spaziergang", "Romantic walk", 1, false),
    m("media-16", "proj-6", "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=80", 1600, 1067, "Feiermoment mit Freunden", "Celebration with friends", 2, false),
    m("media-17", "proj-5", "https://images.unsplash.com/photo-1478144592103-25e218a04891?w=1600&q=80", 1600, 1067, "Tischfeier am Abend", "Evening table celebration", 2, false),
    m("media-18", "proj-4", "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=80", 1600, 1067, "Nahaufnahme Paar", "Close couple moment", 2, false),
    m("media-19", "proj-2", "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&q=80", 1600, 1067, "Festlicher Moment", "Festive gathering moment", 3, false),
    m("media-20", "proj-3", "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1600&q=80", 1600, 1067, "Torte und Kerzenlicht", "Cake and candlelight", 3, false),
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
