-- Blog: artículos e imágenes. Requiere 0001 (función public.is_admin).
-- Ejecutar en Supabase: SQL Editor → pegar y correr.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  title text not null check (char_length(title) between 3 and 160),
  excerpt text check (char_length(excerpt) <= 300),
  category text check (char_length(category) <= 60),
  -- content_json: formato del editor (para volver a editar).
  -- content_html: HTML ya sanitizado en el servidor (lo que ve el público).
  content_json jsonb not null default '{}'::jsonb,
  content_html text not null default '',
  cover_path text check (char_length(cover_path) <= 300),
  cover_alt text check (char_length(cover_alt) <= 200),
  seo_title text check (char_length(seo_title) <= 70),
  seo_description text check (char_length(seo_description) <= 170),
  status text not null default 'borrador' check (status in ('borrador', 'publicado')),
  published_at timestamptz,
  author_id uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_idx on public.posts (published_at desc) where status = 'publicado';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

-- Cualquiera puede leer artículos publicados.
create policy "publico lee publicados"
  on public.posts for select
  to anon, authenticated
  using (status = 'publicado' and published_at <= now());

-- Solo administradores escriben (y ven borradores).
create policy "admins leen todo"
  on public.posts for select
  to authenticated
  using ((select public.is_admin()));

create policy "admins crean"
  on public.posts for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "admins editan"
  on public.posts for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "admins borran"
  on public.posts for delete
  to authenticated
  using ((select public.is_admin()));

-- Imágenes del blog: bucket público (lectura por URL), escritura solo admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog', 'blog', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "admins suben imagenes blog"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog' and (select public.is_admin()));

create policy "admins editan imagenes blog"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog' and (select public.is_admin()));

create policy "admins borran imagenes blog"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog' and (select public.is_admin()));
