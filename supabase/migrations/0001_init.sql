-- Sans Façon — schéma initial
-- À exécuter une fois dans Supabase (SQL Editor) ou via `npm run db:migrate`.
--
-- Sécurité : RLS est activé SANS aucune policy. L'API publique de Supabase
-- (clés anon / authenticated) ne peut donc rien lire ni écrire.
-- Seul le serveur du site, connecté avec DATABASE_URL, accède aux données.

create table if not exists public.bookings (
  id              uuid primary key default gen_random_uuid(),
  ref             text not null unique,
  token           text not null unique,
  name            text not null check (char_length(name) between 2 and 60),
  phone           text not null check (phone ~ '^\+[1-9][0-9]{7,14}$'),
  pack_id         text check (pack_id is null or char_length(pack_id) <= 40),
  requested_date  date not null,
  requested_time  time,                       -- null = « flexible »
  message         text check (message is null or char_length(message) <= 500),
  status          text not null default 'pending'
                    check (status in ('pending', 'confirmed', 'cancelled')),
  confirmed_date  date,
  confirmed_time  time,
  duration_min    integer not null default 60 check (duration_min between 15 and 600),
  admin_note      text check (admin_note is null or char_length(admin_note) <= 1000),
  source          text not null default 'web' check (source in ('web', 'admin')),
  ip_hash         text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint confirmed_has_slot check (
    status <> 'confirmed' or (confirmed_date is not null and confirmed_time is not null)
  )
);

create index if not exists bookings_status_idx on public.bookings (status, created_at desc);
create index if not exists bookings_confirmed_idx on public.bookings (confirmed_date) where status = 'confirmed';
create index if not exists bookings_requested_idx on public.bookings (requested_date) where status = 'pending';
create index if not exists bookings_phone_idx on public.bookings (phone, created_at desc);

-- Compteurs anti-abus (formulaire public, tentatives de connexion).
create table if not exists public.rate_limits (
  key           text not null,
  window_start  timestamptz not null,
  count         integer not null default 1,
  primary key (key, window_start)
);

alter table public.bookings enable row level security;
alter table public.rate_limits enable row level security;

-- Sur Supabase, retire aussi les droits des rôles de l'API publique.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.bookings, public.rate_limits from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on public.bookings, public.rate_limits from authenticated;
  end if;
end $$;
