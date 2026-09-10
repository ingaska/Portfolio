-- Ride Bingo bookings: run once in Supabase -> SQL Editor
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  bike        text not null,
  places      text[] not null default '{}',
  bingo       boolean not null default false,
  length      text,
  ride_when   text,
  level       text,
  channel     text,            -- WhatsApp | Telegram | Email
  contact     text not null,   -- number, handle or address
  price       text,
  status      text not null default 'new',   -- new | confirmed | done | cancelled (managed by you in the dashboard)
  page        text,
  user_agent  text
);

alter table public.bookings enable row level security;

-- Visitors (anon key) may only create rows. No select/update/delete policy for anon,
-- so nobody can read bookings from the page. Read them in the dashboard or with the service key.
create policy "anyone can create a booking"
  on public.bookings for insert to anon with check (true);

alter table public.bookings
  add constraint contact_len check (char_length(contact) between 3 and 120),
  add constraint bike_len    check (char_length(bike) <= 60);
