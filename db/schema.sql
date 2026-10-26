-- Voicemail submissions. Run once against DATABASE_URL (Neon SQL editor, or:
--   psql "$DATABASE_URL" -f db/schema.sql
-- Safe to re-run on an existing table — the CREATE is `if not exists` and the ALTERs below add
-- columns `if not exists`, so this file stays the single source of truth as the schema grows.
--
-- Audio bytes live in Vercel Blob, not in this table — `audio_url` just points at them.
-- There's no separate "date left" column: `created_at` is the real timestamp, and the API/
-- frontend format it as MM/DD/YYYY for display. sender_key links repeat senders together
-- (normalized email, falling back to normalized phone digits).
--
-- category/confidence/email_sent are the moderation gate: every message is summarized and
-- stored regardless, but only ones the model classifies as a genuine compliment/inquiry/
-- comment/question (not spam/inappropriate/junk) above a confidence threshold get emailed —
-- see MIN_CONFIDENCE_TO_EMAIL in api/voicemail.js. email_sent reflects whether a notification
-- actually went out (false either because it was gated out or because Resend itself failed).

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
