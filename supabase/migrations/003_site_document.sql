-- Persistence used by src/lib/data/store.ts today: the whole SiteData document
-- in one row. Only the server (service role key) reads/writes it; RLS with no
-- policies keeps it closed to the anon key, since inquiries contain personal data.

create table if not exists public.site_document (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_document enable row level security;

-- Public bucket for dashboard uploads (served directly to visitors).
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;
