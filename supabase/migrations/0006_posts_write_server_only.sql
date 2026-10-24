-- Blog: los artículos solo se crean y editan desde el servidor (acción savePost),
-- que genera content_html sanitizado. Así, aunque alguien robara la sesión de un
-- administrador, no podría guardar HTML arbitrario directamente con la API de Supabase.
-- Borrar sigue permitido a administradores (RLS "admins borran").
-- Ejecutar en Supabase: SQL Editor → pegar y correr.

revoke insert, update on public.posts from authenticated;
