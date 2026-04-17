create table public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  client_event_id uuid not null,
  sleep_duration_min integer not null check (sleep_duration_min between 1 and 1440),
  sleep_quality integer check (sleep_quality between 1 and 5),
  morning_energy integer check (morning_energy between 1 and 5),
  logged_at timestamptz not null default now(),
  logged_date date not null default ((now() at time zone 'utc')::date),
  note text,
  created_at timestamptz not null default now()
);

create unique index sleep_logs_profile_client_event_idx
  on public.sleep_logs(profile_id, client_event_id);

create index sleep_logs_profile_date_idx
  on public.sleep_logs(profile_id, logged_date);

create index sleep_logs_profile_logged_at_idx
  on public.sleep_logs(profile_id, logged_at desc);

alter table public.sleep_logs enable row level security;

-- RLS is enabled without anon/client policies in the MVP trust-boundary phase.
-- Server routes must validate Telegram init data, derive the profile from
-- profiles.telegram_user_id, and use privileged Supabase access without
-- accepting profile_id, logged_at, logged_date, XP, rank, streak, quest, or
-- notification values from the client.
