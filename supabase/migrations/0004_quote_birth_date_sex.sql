-- Fecha de nacimiento y sexo en las solicitudes de cotización.
-- Ejecutar en Supabase: SQL Editor → pegar y correr.
--
-- Son opcionales en la base de datos (NULL) para no romper las solicitudes ya guardadas
-- ni la versión 1 del sitio, que aún no envía estos campos. El formulario nuevo
-- los exige y los valida en el servidor.

alter table public.quote_requests
  add column if not exists birth_date date
    check (birth_date between date '1900-01-01' and current_date),
  add column if not exists sex text
    check (sex in ('femenino', 'masculino'));

comment on column public.quote_requests.birth_date is 'Fecha de nacimiento de quien solicita la cotización';
comment on column public.quote_requests.sex is 'Sexo de quien solicita (femenino | masculino); lo piden las aseguradoras para cotizar';
