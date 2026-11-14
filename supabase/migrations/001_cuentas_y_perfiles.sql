-- CLEIN Chile 2027 · Etapa 1: cuentas y perfiles.
-- Ejecutar en el SQL Editor de un proyecto Supabase DEL EQUIPO (no del proyecto de pruebas de un tercero).
-- Compatible con las tablas de app_clein (profiles) para poder reutilizar datos más adelante.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  country_code text not null default 'CL' check (country_code ~ '^[A-Z]{2}$'),
  university_name text not null default '' check (char_length(university_name) <= 140),
  career text not null default '' check (char_length(career) <= 140),
  headline text not null default '' check (char_length(headline) <= 120),
  bio text not null default '' check (char_length(bio) <= 450),
  linkedin_url text not null default '' check (linkedin_url = '' or linkedin_url ~* '^https://'),
  portfolio_url text not null default '' check (portfolio_url = '' or portfolio_url ~* '^https://'),
  cv_url text not null default '' check (cv_url = '' or cv_url ~* '^https://'),
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Perfil propio" on public.profiles;
create policy "Perfil propio" on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Actualizar perfil propio" on public.profiles;
create policy "Actualizar perfil propio" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "Borrar perfil propio" on public.profiles;
create policy "Borrar perfil propio" on public.profiles for delete to authenticated
  using ((select auth.uid()) = id);

revoke all on public.profiles from anon, public;
grant select, update, delete on public.profiles to authenticated;

-- El perfil se crea solo al registrarse (no hay insert desde el navegador).
create or replace function public.crear_perfil_al_registrarse()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  nombre text;
  pais text;
begin
  nombre := left(coalesce(nullif(btrim(new.raw_user_meta_data->>'display_name'), ''),
                          nullif(btrim(new.raw_user_meta_data->>'full_name'), ''),
                          nullif(btrim(new.raw_user_meta_data->>'name'), ''),
                          nullif(split_part(new.email, '@', 1), ''),
                          'Participante CLEIN'), 80);
  pais := coalesce(nullif(new.raw_user_meta_data->>'country_code', ''), 'CL');
  if pais !~ '^[A-Z]{2}$' then pais := 'CL'; end if;
  insert into public.profiles (id, display_name, country_code)
    values (new.id, nombre, pais) on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function public.crear_perfil_al_registrarse() from public;

drop trigger if exists crear_perfil_al_registrarse on auth.users;
create trigger crear_perfil_al_registrarse after insert on auth.users
  for each row execute function public.crear_perfil_al_registrarse();

-- Nota: la visibilidad de perfiles con is_public (red de participantes) llega en la Etapa 3,
-- con una vista que expone solo campos públicos, no la tabla completa.
