create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id bigint not null unique check (telegram_user_id > 0),
  telegram_username text,
  display_name text,
  level integer not null default 1 check (level >= 1),
  total_xp integer not null default 0 check (total_xp >= 0),
  rank_key text not null default 'unranked',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  goal_type text not null,
  target_value text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_paths (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  path_key text not null,
  is_active boolean not null default true,
  selected_at timestamptz not null default now()
);

create unique index user_paths_one_active_per_profile
  on public.user_paths(profile_id)
  where is_active;

create table public.daily_quests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  quest_date date not null default current_date,
  title text not null,
  domain text not null check (domain in ('body', 'nutrition', 'recovery', 'mind', 'language')),
  quest_type text not null check (quest_type in ('main', 'side', 'discipline', 'recovery')),
  xp_reward integer not null default 0 check (xp_reward >= 0),
  status text not null default 'assigned' check (status in ('assigned', 'completed', 'missed', 'skipped')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index daily_quests_profile_date_idx
  on public.daily_quests(profile_id, quest_date);

create table public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid not null references public.daily_quests(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  completed_at timestamptz not null default now(),
  quality_score integer check (quality_score between 0 and 100),
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  note text
);

create unique index quest_completions_one_per_quest_idx
  on public.quest_completions(quest_id);

create table public.weekly_checkins (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  week_start_date date not null,
  weight_kg numeric(6, 2),
  energy_score integer check (energy_score between 1 and 5),
  sleep_score integer check (sleep_score between 1 and 5),
  stress_score integer check (stress_score between 1 and 5),
  adherence_score integer check (adherence_score between 1 and 5),
  reflection text,
  summary text,
  created_at timestamptz not null default now()
);

create unique index weekly_checkins_one_per_week_idx
  on public.weekly_checkins(profile_id, week_start_date);

create table public.xp_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  source_type text not null,
  source_id uuid,
  amount integer not null check (amount <> 0),
  reason text not null,
  created_at timestamptz not null default now()
);

create index xp_events_profile_created_idx
  on public.xp_events(profile_id, created_at desc);

create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  streak_type text not null check (streak_type in ('daily_login', 'daily_quest', 'workout', 'nutrition', 'weekly_review')),
  current_count integer not null default 0 check (current_count >= 0),
  best_count integer not null default 0 check (best_count >= 0),
  last_activity_date date,
  updated_at timestamptz not null default now(),
  unique (profile_id, streak_type)
);

alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.user_paths enable row level security;
alter table public.daily_quests enable row level security;
alter table public.quest_completions enable row level security;
alter table public.weekly_checkins enable row level security;
alter table public.xp_events enable row level security;
alter table public.streaks enable row level security;

-- RLS is enabled without anon/client policies in the MVP trust-boundary phase.
-- Server routes must validate Telegram init data, derive the profile from
-- profiles.telegram_user_id, and use privileged Supabase access without
-- accepting profile_id from the client.
