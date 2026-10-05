# Celebration photography studio site

Bilingual (DE/EN) Next.js site for a Berlin couple photography studio — intimate celebrations (couples, gender reveals, birthdays, kids parties, gatherings), cinematic motion, and an owner dashboard.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

- Public site: [http://localhost:3000/de](http://localhost:3000/de)
- Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (password from `DASHBOARD_PASSWORD`, default `studio`)

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new) (framework: Next.js — auto-detected)
3. Set environment variable:
   - `DASHBOARD_PASSWORD` — required for production (do not leave as `studio`)
4. Deploy

The public portfolio builds from in-code defaults (Unsplash placeholders). On Vercel, the local JSON file / disk uploads are ephemeral — the marketing site still works; connect Supabase before relying on the dashboard for lasting content or file uploads.

## Go-live checklist (custom domain)

1. Vercel → Project → Settings → Domains: add the domain (and `www.`), set the DNS records the registrar shows; Vercel issues HTTPS automatically.
2. Environment variables (Production): `NEXT_PUBLIC_SITE_URL=https://<domain>`, `DASHBOARD_PASSWORD`, `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, optionally `RESEND_API_KEY` + `INQUIRY_NOTIFY_EMAIL` + `INQUIRY_FROM_EMAIL`. Redeploy after changing them.
3. Dashboard → Brand: fill in the Impressum name + address (legally required in Germany), email, WhatsApp, phone.
4. Dashboard → Photoshoots: create a shoot per set and upload the photos; each becomes a page at `/work/<title>`.
5. Google Search Console: add the domain, submit `https://<domain>/sitemap.xml`. Create a Google Business Profile linking to the site.
6. Send a test inquiry through the live form and check it arrives.

## Replaceable brand name

Open **Dashboard → Brand** and change **Studio name**. It flows through nav, hero, footer, metadata, and contact copy via `site_settings` / `BrandProvider`. Default brand is **Klick Berlin**.

## Stack

- Next.js App Router + Tailwind + Motion (Framer Motion)
- `next-intl` for DE/EN
- Local JSON store in `data/site-data.json` until Supabase is connected
- Schema ready in `supabase/migrations/`

## Connect Supabase later

1. Create a project and run `supabase/migrations/001_initial.sql` + `002_seed.sql`
2. Create public Storage bucket `portfolio`
3. Add keys from `.env.example`
4. Swap `src/lib/data/store.ts` reads/writes to Supabase (interface already matches the schema)

## Image credit

Placeholder photos from [Unsplash](https://unsplash.com) for development only. Hero film: [Couple walking hand in hand](https://mixkit.co/free-stock-video/couple-walking-hand-in-hand-4661/) (Mixkit).
