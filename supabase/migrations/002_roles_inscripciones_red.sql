-- CLEIN Chile 2027 · Etapa 2: roles, aprobación de profesionales, inscripciones y red.
-- Ejecutar DESPUÉS de 001_cuentas_y_perfiles.sql, en el proyecto Supabase DEL EQUIPO.
-- Principio: lo sensible (aprobación, fechas, descuento, categoría) lo decide el servidor, no el navegador.

-- 1) Roles --------------------------------------------------------------------------------------
create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  primary key (user_id, role)
);
alter table public.user_roles enable row level security;
revoke all on public.user_roles from anon, authenticated;
-- Sin políticas: nadie lee ni escribe user_roles desde la API. Se asigna con SQL por una persona autorizada:
--   insert into public.user_roles(user_id, role) select id, 'admin' from auth.users where email = 'correo@dominio';

create or replace function public.es_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin');
$$;
revoke all on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated;

-- 2) Campos nuevos del perfil ---------------------------------------------------------------------
alter table public.profiles
  add column if not exists instagram text not null default '' check (instagram ~ '^[A-Za-z0-9._-]{0,40}$'),
  add column if not exists x_handle text not null default '' check (x_handle ~ '^[A-Za-z0-9._-]{0,40}$'),
  add column if not exists github_handle text not null default '' check (github_handle ~ '^[A-Za-z0-9._-]{0,40}$'),
  add column if not exists avatar_url text not null default '' check (avatar_url = '' or avatar_url ~* '^https://'),
  add column if not exists account_type text not null default 'student' check (account_type in ('student', 'professional')),
  add column if not exists pro_status text not null default 'none' check (pro_status in ('none', 'pending', 'approved', 'rejected'));

-- La persona NO puede cambiar su tipo de cuenta ni su estado de aprobación editando su fila.
create or replace function public.proteger_campos_perfil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (new.account_type is distinct from old.account_type or new.pro_status is distinct from old.pro_status)
     and current_setting('clein.permitir_cambio_tipo', true) is distinct from 'si' then
    raise exception 'El tipo de cuenta solo se cambia con las funciones autorizadas';
  end if;
  return new;
end;
$$;
drop trigger if exists proteger_campos_perfil on public.profiles;
create trigger proteger_campos_perfil before update on public.profiles
  for each row execute function public.proteger_campos_perfil();

-- La cuenta profesional se pide con función; solo un admin la aprueba.
create or replace function public.solicitar_profesional() returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform set_config('clein.permitir_cambio_tipo', 'si', true);
  update public.profiles
     set account_type = 'professional',
         pro_status = case when pro_status = 'approved' then 'approved' else 'pending' end
   where id = (select auth.uid());
end;
$$;

create or replace function public.volver_a_estudiante() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.inscripciones where user_id = (select auth.uid())) then
    raise exception 'Cancela tu inscripción antes de cambiar el tipo de cuenta';
  end if;
  perform set_config('clein.permitir_cambio_tipo', 'si', true);
  update public.profiles set account_type = 'student', pro_status = 'none' where id = (select auth.uid());
end;
$$;

create or replace function public.decidir_profesional(p_usuario uuid, p_aprobar boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.es_admin() then raise exception 'Sin permisos'; end if;
  perform set_config('clein.permitir_cambio_tipo', 'si', true);
  update public.profiles
     set pro_status = case when p_aprobar then 'approved' else 'rejected' end
   where id = p_usuario and account_type = 'professional';
end;
$$;

-- 3) Configuración del evento (fechas y descuento viven en la base, no en el navegador) ---------------
create table if not exists public.config_evento (
  id boolean primary key default true check (id),
  preinscripcion_hasta timestamptz not null,
  descuento_preinscripcion numeric not null default 0.10 check (descuento_preinscripcion between 0 and 1)
);
alter table public.config_evento enable row level security;
drop policy if exists "Leer configuración" on public.config_evento;
create policy "Leer configuración" on public.config_evento for select to anon, authenticated using (true);
revoke all on public.config_evento from anon, authenticated;
grant select on public.config_evento to anon, authenticated;
-- Valor de ejemplo; cambiarlo cuando el comité defina la fecha oficial:
insert into public.config_evento (id, preinscripcion_hasta) values (true, '2027-02-28 23:59:59-03') on conflict (id) do nothing;

-- 4) Inscripciones -------------------------------------------------------------------------------
create table if not exists public.inscripciones (
  user_id uuid primary key references auth.users(id) on delete cascade,
  estado text not null check (estado in ('preinscrito', 'inscrito', 'pagado')),
  categoria text not null check (categoria in ('student', 'professional')),
  descuento boolean not null default false,
  pais text not null check (pais ~ '^[A-Z]{2}$'),
  creada timestamptz not null default now()
);
alter table public.inscripciones enable row level security;
revoke all on public.inscripciones from anon, authenticated;
grant select on public.inscripciones to authenticated;
drop policy if exists "Inscripción propia" on public.inscripciones;
create policy "Inscripción propia" on public.inscripciones for select to authenticated
  using ((select auth.uid()) = user_id or public.es_admin());
-- Escribir solo con las funciones de abajo.

create or replace function public.inscribir(p_estado text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  yo uuid := (select auth.uid());
  per public.profiles%rowtype;
  cfg public.config_evento%rowtype;
  abierta boolean;
begin
  if yo is null then raise exception 'Sesión no válida'; end if;
  if p_estado not in ('preinscrito', 'inscrito') then raise exception 'Estado no válido'; end if;
  select * into per from public.profiles where id = yo;
  select * into cfg from public.config_evento limit 1;
  if per.account_type = 'professional' and per.pro_status <> 'approved' then
    raise exception 'Tu cuenta de profesional aún no está aprobada';
  end if;
  abierta := now() <= cfg.preinscripcion_hasta;
  if p_estado = 'preinscrito' and not abierta then raise exception 'La preinscripción ya cerró'; end if;
  insert into public.inscripciones (user_id, estado, categoria, descuento, pais)
    values (yo, p_estado, per.account_type, p_estado = 'preinscrito' and abierta, per.country_code);
end;
$$;

create or replace function public.confirmar_inscripcion() returns void
language sql security definer set search_path = '' as $$
  update public.inscripciones set estado = 'inscrito' where user_id = (select auth.uid()) and estado = 'preinscrito';
$$;

create or replace function public.cancelar_inscripcion() returns void
language sql security definer set search_path = '' as $$
  delete from public.inscripciones where user_id = (select auth.uid()) and estado <> 'pagado';
$$;
-- El paso a 'pagado' lo hará SOLO el webhook de la pasarela (con clave de servicio), nunca el navegador.

-- 5) Red de participantes -------------------------------------------------------------------------
create table if not exists public.seguimientos (
  seguidor uuid not null references auth.users(id) on delete cascade,
  seguido uuid not null references auth.users(id) on delete cascade,
  creado timestamptz not null default now(),
  primary key (seguidor, seguido),
  check (seguidor <> seguido)
);
alter table public.seguimientos enable row level security;
revoke all on public.seguimientos from anon, authenticated;
grant select, insert, delete on public.seguimientos to authenticated;
drop policy if exists "Mis seguimientos: leer" on public.seguimientos;
create policy "Mis seguimientos: leer" on public.seguimientos for select to authenticated using ((select auth.uid()) = seguidor);
drop policy if exists "Mis seguimientos: crear" on public.seguimientos;
create policy "Mis seguimientos: crear" on public.seguimientos for insert to authenticated with check ((select auth.uid()) = seguidor);
drop policy if exists "Mis seguimientos: borrar" on public.seguimientos;
create policy "Mis seguimientos: borrar" on public.seguimientos for delete to authenticated using ((select auth.uid()) = seguidor);

-- Solo campos públicos de quienes activaron su tarjeta.
create or replace function public.directorio() returns table (
  id uuid, display_name text, headline text, country_code text, university_name text, career text,
  avatar_url text, es_profesional boolean, linkedin_url text, instagram text, x_handle text, github_handle text, portfolio_url text
)
language sql stable security definer set search_path = '' as $$
  select p.id, p.display_name, p.headline, p.country_code, p.university_name, p.career, p.avatar_url,
         (p.account_type = 'professional' and p.pro_status = 'approved'),
         p.linkedin_url, p.instagram, p.x_handle, p.github_handle, p.portfolio_url
    from public.profiles p
   where p.is_public and p.id <> (select auth.uid()) and (select auth.uid()) is not null;
$$;
revoke all on function public.directorio() from public, anon;
grant execute on function public.directorio() to authenticated;

-- 6) Listado para administración -------------------------------------------------------------------
create or replace function public.admin_listar_usuarios() returns table (
  id uuid, email text, display_name text, country_code text, university_name text, career text,
  account_type text, pro_status text, estado text, categoria text, descuento boolean, pais text
)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.es_admin() then raise exception 'Sin permisos'; end if;
  return query
    select u.id, u.email::text, p.display_name, p.country_code, p.university_name, p.career,
           p.account_type, p.pro_status, i.estado, i.categoria, i.descuento, i.pais
      from auth.users u
      join public.profiles p on p.id = u.id
      left join public.inscripciones i on i.user_id = u.id;
end;
$$;
revoke all on function public.admin_listar_usuarios() from public, anon;
grant execute on function public.admin_listar_usuarios() to authenticated;

grant execute on function public.solicitar_profesional(), public.volver_a_estudiante(),
  public.decidir_profesional(uuid, boolean), public.inscribir(text), public.confirmar_inscripcion(),
  public.cancelar_inscripcion() to authenticated;
revoke execute on function public.solicitar_profesional(), public.volver_a_estudiante(),
  public.decidir_profesional(uuid, boolean), public.inscribir(text), public.confirmar_inscripcion(),
  public.cancelar_inscripcion(), public.proteger_campos_perfil() from public, anon;
