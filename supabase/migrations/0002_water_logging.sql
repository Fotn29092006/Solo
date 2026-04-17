create table public.water_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  client_event_id uuid not null,
  amount_ml integer not null check (amount_ml between 1 and 5000),
  logged_at timestamptz not null default now(),
  logged_date date not null default ((now() at time zone 'utc')::date),
  note text,
  created_at timestamptz not null default now()
);

create unique index water_logs_profile_client_event_idx
  on public.water_logs(profile_id, client_event_id);

create index water_logs_profile_date_idx
  on public.water_logs(profile_id, logged_date);

create index water_logs_profile_logged_at_idx
  on public.water_logs(profile_id, logged_at desc);

alter table public.water_logs enable row level security;

-- RLS is enabled without anon/client policies in the MVP trust-boundary phase.
-- Server routes must validate Telegram init data, derive the profile from
-- profiles.telegram_user_id, and use privileged Supabase access without
-- accepting profile_id from the client.
