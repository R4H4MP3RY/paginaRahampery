-- Límite de intentos del formulario de cotización.
-- Ejecutar en Supabase: SQL Editor → pegar y correr.
--
-- Se guarda solo un hash de la IP (no la IP) y la fecha. Los registros de más de
-- un día se borran solos al registrar nuevos intentos.

create table if not exists public.quote_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null check (char_length(ip_hash) = 64),
  created_at timestamptz not null default now()
);

create index if not exists quote_attempts_ip_created_idx on public.quote_attempts (ip_hash, created_at desc);

-- RLS activo y SIN políticas: solo el servidor (service_role) puede usarla.
alter table public.quote_attempts enable row level security;

-- Registra un intento y regresa true si sigue dentro del límite.
create or replace function public.register_quote_attempt(p_ip_hash text, p_max int, p_window interval)
returns boolean
language plpgsql
set search_path = ''
as $$
declare
  attempts int;
begin
  delete from public.quote_attempts where created_at < now() - interval '1 day';
  insert into public.quote_attempts (ip_hash) values (p_ip_hash);
  select count(*) into attempts
    from public.quote_attempts
    where ip_hash = p_ip_hash and created_at > now() - p_window;
  return attempts <= p_max;
end;
$$;

revoke execute on function public.register_quote_attempt(text, int, interval) from public, anon, authenticated;
grant execute on function public.register_quote_attempt(text, int, interval) to service_role;
grant select, insert, delete on public.quote_attempts to service_role;
