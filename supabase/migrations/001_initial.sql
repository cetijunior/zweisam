-- Supabase schema for studio portfolio (connect later)
-- Apply via Supabase SQL editor or `supabase db push`

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role text not null default 'owner' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  studio_name text not null default 'Zweisam',
  tagline_de text not null default '',
  tagline_en text not null default '',
  about_headline_de text not null default '',
  about_headline_en text not null default '',
  about_body_de text not null default '',
  about_body_en text not null default '',
  email text not null default '',
  instagram text not null default '',
  tiktok text not null default '',
  handle text not null default '',
  location text not null default 'Berlin',
  photographers_de text not null default '',
  photographers_en text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_de text not null,
  name_en text not null,
  sort_order int not null default 0
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title_de text not null,
  title_en text not null,
  location text,
  shoot_date date,
  featured boolean not null default false,
  published boolean not null default false,
  cover_media_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  storage_path text not null,
  public_url text,
  width int,
  height int,
  alt_de text not null default '',
  alt_en text not null default '',
  blurhash text,
  sort_order int not null default 0,
  published boolean not null default false,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.projects
  drop constraint if exists projects_cover_media_id_fkey;

alter table public.projects
  add constraint projects_cover_media_id_fkey
  foreign key (cover_media_id) references public.media (id) on delete set null;

create table if not exists public.project_categories (
  project_id uuid not null references public.projects (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (project_id, category_id)
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  locale text not null default 'de',
  event_type text,
  event_date date,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

-- Storage bucket (run in dashboard or via storage API)
-- insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true);

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.media enable row level security;
alter table public.project_categories enable row level security;
alter table public.inquiries enable row level security;

-- Public read of published content
create policy "Public read categories"
  on public.categories for select using (true);

create policy "Public read published projects"
  on public.projects for select using (published = true);

create policy "Public read published media"
  on public.media for select using (published = true);

create policy "Public read site settings"
  on public.site_settings for select using (true);

create policy "Public insert inquiries"
  on public.inquiries for insert with check (true);

-- Authenticated owners/editors
create policy "Owners manage settings"
  on public.site_settings for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'editor')
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'editor')
  ));

create policy "Owners manage projects"
  on public.projects for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'editor')
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'editor')
  ));

create policy "Owners manage media"
  on public.media for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'editor')
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'editor')
  ));

create policy "Owners manage categories"
  on public.categories for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'editor')
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'editor')
  ));

create policy "Owners manage project_categories"
  on public.project_categories for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'editor')
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'editor')
  ));

create policy "Owners read inquiries"
  on public.inquiries for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'editor')
  ));

create policy "Owners update inquiries"
  on public.inquiries for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'editor')
  ));

create policy "Owners read profiles"
  on public.profiles for select
  using (auth.uid() = id or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  ));
