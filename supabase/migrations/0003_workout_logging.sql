create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  client_event_id uuid not null,
  workout_type text not null check (
    workout_type in ('strength', 'cardio', 'mobility', 'mixed', 'other')
  ),
  workout_name text,
  duration_min integer check (duration_min between 1 and 360),
  rpe integer check (rpe between 1 and 10),
  logged_at timestamptz not null default now(),
  logged_date date not null default ((now() at time zone 'utc')::date),
  note text,
  created_at timestamptz not null default now()
);

create unique index workout_logs_profile_client_event_idx
  on public.workout_logs(profile_id, client_event_id);

create index workout_logs_profile_date_idx
  on public.workout_logs(profile_id, logged_date);

create index workout_logs_profile_logged_at_idx
  on public.workout_logs(profile_id, logged_at desc);

alter table public.workout_logs enable row level security;

-- RLS is enabled without anon/client policies in the MVP trust-boundary phase.
-- Server routes must validate Telegram init data, derive the profile from
-- profiles.telegram_user_id, and use privileged Supabase access without
-- accepting profile_id, logged_at, logged_date, XP, rank, or streak values
-- from the client.
