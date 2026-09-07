-- Λέξις prototype: the sync store on Supabase (server/core/backend-supabase.ts).
-- Run once in the Supabase SQL editor. Row-level security is on with no
-- policies, so only the service-role key used by the server can read or write.

create table if not exists lexis_settings (
  owner       text        not null,
  key         text        not null,
  value       jsonb       not null,
  updated_at  timestamptz not null default now(),
  primary key (owner, key)
);

create table if not exists lexis_cards (
  id               text     primary key,
  owner            text     not null,
  folder           text     not null default 'recent',
  greek            text     not null,
  article          text,
  translation      text     not null,
  transliteration  text     not null default '',
  sentence         text     not null default '',
  grammar_note     text     not null default '',
  tag              text     not null default 'other',
  subject          text,
  picture          text,                 -- a data: URL, a few hundred KB when present
  tile             text,
  created_at       bigint   not null,    -- ms since the epoch
  due_at           bigint   not null,
  interval_days    integer  not null default 1,
  ease             real     not null default 2.5,
  repetitions      integer  not null default 0
);

create index if not exists lexis_cards_owner on lexis_cards (owner, created_at desc);

alter table lexis_settings enable row level security;
alter table lexis_cards    enable row level security;
