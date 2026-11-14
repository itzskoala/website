-- schema.sql

create extension if not exists pgcrypto;

create table if not exists voicemails (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  email             text,
  phone             text,
  sender_key        text,
  is_repeat_sender  boolean not null default false,
  audio_url         text not null,
  duration_seconds  integer,
  transcript        text,
  summary           text,
  category          text,
  confidence        real,
  email_sent        boolean not null default false,
  created_at        timestamptz not null default now()
);

alter table voicemails add column if not exists category text;
alter table voicemails add column if not exists confidence real;

create index if not exists voicemails_sender_key_idx on voicemails (sender_key);
create index if not exists voicemails_created_at_idx on voicemails (created_at desc);
