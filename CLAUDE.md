# Klick Berlin — project schematic

> Bilingual (DE/EN) site for a Berlin couple-photography studio covering intimate
> celebrations (couples, gender reveals, birthdays, kids parties), with cinematic
> motion and an owner dashboard. Client/portfolio project; the footer credits
> rritjesade.com. Schematic last verified: 2026-09-28.

@AGENTS.md

AGENTS.md is the Next.js boilerplate block. Project rules are below.

---

## 1. Project info

| | |
|---|---|
| Brand | Default **Klick Berlin**. The name is replaceable in Dashboard → Brand and flows through `site_settings` / `BrandProvider`. Never hardcode it |
| Status | Launched on Vercel (2026-08-25), rebranded with a hero film on 2026-09-03 |
| Content | Unsplash placeholders + Mixkit hero film, **dev only**. Swap in the studio's real work before calling it done |

## 2. Stack & methods

- Next.js 16.3 App Router · Tailwind v4 · `motion` · `next-themes` · zustand
- `next-intl` 4 for DE/EN: `src/i18n/{routing,request,navigation}.ts`, `messages/`, `src/app/[locale]`
- `src/proxy.ts` (Next 16's renamed middleware; must live in `src/`) handles locale routing and the dashboard gate. Auth helpers live in `src/lib/auth.ts`
- SEO: `src/lib/site.ts` `pageMetadata()` gives each public page canonical/hreflang/OG; `sitemap.ts` + `robots.ts`; set `NEXT_PUBLIC_SITE_URL` in production
- Data: `src/lib/data/store.ts`, Supabase document store in production, local JSON `data/site-data.json` in dev

## 3. Layout

```
src/app/[locale]/     public site (home, work, work/[slug], services, services/[slug], about, contact, impressum, datenschutz)
src/lib/services.ts   service catalogue (DE/EN) — drives service pages, footer, JSON-LD, sitemap, llms.txt
src/app/dashboard/    owner dashboard, gated by DASHBOARD_PASSWORD
src/app/api/          dashboard writes / uploads
src/components/       home work about contact layout brand motion theme dashboard
src/lib/data/         store (JSON now, Supabase later)
messages/             DE + EN strings
supabase/migrations/  001_initial.sql, 002_seed.sql
```

## 4. Commands

```bash
npm run dev    # /de and /dashboard (default password "studio")
npm run build && npm run lint
```

## 5. Rules

- Every string exists in both DE and EN under `messages/`.
- Production must set `DASHBOARD_PASSWORD`. Without it, login returns 503 (the "studio" default only works in dev).
- New public pages: use `pageMetadata()` and add the path to `PUBLIC_PATHS`.

## 6. Open ends

- Persistence: `store.ts` uses Supabase when `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set (whole `SiteData` in `site_document`, uploads in the public `portfolio` bucket, see `003_site_document.sql`), else the local JSON file. **Until those env vars are set on Vercel, dashboard edits and inquiries don't persist.** The relational tables in `001_initial.sql` are unused for now.
- Replace the placeholder imagery with the studio's own (Dashboard → Photoshoots creates a shoot + bulk-uploads its set).
- Impressum/Datenschutz read `legalName`/`legalAddress`/`vatId` from settings and show highlighted placeholders until filled in Dashboard → Brand.
- Inquiry emails go out via Resend only when `RESEND_API_KEY` + `INQUIRY_NOTIFY_EMAIL` are set (`src/lib/notify.ts`).
- Shoot slugs derive from `titleEn` (`projectSlug()`); renaming a shoot changes its URL.

## 7. Hosting

- Vercel project `klickberlin` (zweisam-dusky.vercel.app) is the only deployment; the duplicate `zweisam-web` was deleted on 2026-09-29.
- GitHub repo is still `cetijunior/zweisam`.
