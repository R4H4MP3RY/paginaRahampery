-- Permisos de tablas. Los proyectos nuevos de Supabase no los otorgan automáticamente
-- a las tablas creadas por SQL. Las políticas RLS de 0001 y 0002 siguen limitando
-- qué filas puede ver o modificar cada rol; esto solo da el acceso mínimo por rol.
-- Ejecutar en Supabase: SQL Editor → pegar y correr.

grant usage on schema public to anon, authenticated, service_role;

-- Administradores: solo lectura para usuarios con sesión (RLS: solo admins).
grant select on public.admins to authenticated;
grant select, insert, update, delete on public.admins to service_role;

-- Cotizaciones: el público NO tiene acceso. Se insertan desde el servidor (service_role)
-- y los administradores las leen y actualizan desde el panel (RLS: solo admins).
grant select, update, delete on public.quote_requests to authenticated;
grant select, insert, update, delete on public.quote_requests to service_role;

-- Blog: lectura pública (RLS: solo publicados); escritura de administradores (RLS).
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant select, insert, update, delete on public.posts to service_role;
