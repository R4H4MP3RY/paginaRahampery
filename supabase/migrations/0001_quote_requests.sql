-- Solicitudes de cotización de seguros enviadas desde el sitio.
-- Ejecutar en Supabase: SQL Editor → pegar y correr.

-- Administradores: usuarios de Supabase Auth con acceso al panel /admin.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- security definer para poder consultar admins desde las políticas sin exponer la tabla.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create policy "admins leen admins"
  on public.admins for select
  to authenticated
  using ((select public.is_admin()));

create type public.quote_status as enum ('nueva', 'en_proceso', 'cotizada', 'cerrada', 'descartada');

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) between 10 and 20),
  city text check (char_length(city) <= 120),
  insurance_type text not null check (char_length(insurance_type) <= 60),
  message text check (char_length(message) <= 2000),
  privacy_accepted_at timestamptz not null,
  status public.quote_status not null default 'nueva',
  admin_notes text
);

create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at desc);

-- RLS activo y SIN políticas para anon: el público no puede leer ni escribir directamente.
-- Las inserciones llegan solo desde el servidor (server action con la secret key,
-- después de validar datos y el anti-spam de Turnstile).
alter table public.quote_requests enable row level security;

create policy "admins leen cotizaciones"
  on public.quote_requests for select
  to authenticated
  using ((select public.is_admin()));

create policy "admins actualizan cotizaciones"
  on public.quote_requests for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "admins borran cotizaciones"
  on public.quote_requests for delete
  to authenticated
  using ((select public.is_admin()));

-- Después de crear tu usuario en Authentication → Users, date de alta como admin:
-- insert into public.admins (user_id) values ('<tu-user-id>');
