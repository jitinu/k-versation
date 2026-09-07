create extension if not exists citext with schema extensions;
create extension if not exists pgcrypto with schema extensions;

create type public.media_kind as enum ('conversation', 'dispatch');
create type public.media_status as enum ('draft', 'published', 'archived');
create type public.reaction_kind as enum ('appreciate', 'insightful', 'inspired', 'curious');
create type public.analytics_event_type as enum (
  'site_impression',
  'video_page',
  'video_start',
  'video_view',
  'video_progress',
  'video_complete'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  username extensions.citext not null unique
    check (username::text ~ '^[A-Za-z0-9_]{3,24}$')
    check (lower(username::text) not in (
      'admin', 'administrator', 'daniel', 'host', 'kversation',
      'moderator', 'root', 'staff', 'support'
    )),
  email extensions.citext not null,
  country_code varchar(2) not null check (country_code ~ '^[A-Z]{2}$'),
  phone text check (phone is null or char_length(phone) <= 30),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_country_code_idx on public.profiles(country_code);

create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  kind public.media_kind not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 180),
  guest text check (guest is null or char_length(guest) <= 120),
  excerpt text not null check (char_length(excerpt) between 20 and 320),
  description text not null check (char_length(description) between 40 and 20000),
  status public.media_status not null default 'draft',
  published_at timestamptz,
  poster_url text,
  mux_upload_id text unique,
  mux_asset_id text unique,
  mux_playback_id text unique,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  captions_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_media_has_date check (
    status <> 'published' or published_at is not null
  )
);

create index media_kind_status_published_idx
  on public.media_items(kind, status, published_at desc);

create table public.reactions (
  media_id uuid not null references public.media_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction public.reaction_kind not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (media_id, user_id)
);

create index reactions_user_id_idx on public.reactions(user_id);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  media_id uuid not null references public.media_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 2000),
  hidden_at timestamptz,
  hidden_reason text check (hidden_reason is null or char_length(hidden_reason) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index comments_media_created_idx on public.comments(media_id, created_at desc);
create index comments_user_id_idx on public.comments(user_id);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null check (char_length(name) between 2 and 80),
  email extensions.citext not null,
  subject text check (subject is null or char_length(subject) <= 100),
  question text not null check (char_length(question) between 15 and 4000),
  status text not null default 'new' check (status in ('new', 'read', 'answered', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index questions_status_created_idx on public.questions(status, created_at desc);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique,
  event_type public.analytics_event_type not null,
  media_id uuid references public.media_items(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  playback_session_id uuid,
  path text check (path is null or char_length(path) <= 300),
  referrer text check (referrer is null or char_length(referrer) <= 500),
  progress smallint check (progress is null or progress in (25, 50, 75, 100)),
  visitor_hash text not null check (char_length(visitor_hash) = 64),
  country_code varchar(2),
  created_at timestamptz not null default now(),
  constraint video_event_has_media check (
    event_type = 'site_impression' or media_id is not null
  )
);

create index analytics_event_type_created_idx
  on public.analytics_events(event_type, created_at desc);
create index analytics_media_type_idx
  on public.analytics_events(media_id, event_type);
create unique index analytics_video_event_once_idx
  on public.analytics_events(playback_session_id, event_type, coalesce(progress, 0))
  where playback_session_id is not null;

create table public.metric_adjustments (
  id uuid primary key default gen_random_uuid(),
  metric text not null check (metric in (
    'site_impressions', 'video_views', 'reactions',
    'comments', 'members', 'countries_reached'
  )),
  target_id uuid references public.media_items(id) on delete cascade,
  adjustment bigint not null default 0,
  updated_at timestamptz not null default now(),
  unique nulls not distinct (metric, target_id),
  constraint per_item_adjustment_target check (
    (metric in ('video_views', 'reactions', 'comments') and target_id is not null)
    or (metric in ('site_impressions', 'members', 'countries_reached') and target_id is null)
  )
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metric text,
  target_id uuid,
  old_adjustment bigint,
  new_adjustment bigint,
  change_amount bigint,
  note text check (note is null or char_length(note) <= 500),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_created_idx on public.audit_logs(created_at desc);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.rate_limits (
  key text not null,
  occurred_at timestamptz not null default now()
);

create index rate_limits_key_time_idx on public.rate_limits(key, occurred_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger media_updated_at before update on public.media_items
for each row execute function public.set_updated_at();
create trigger reactions_updated_at before update on public.reactions
for each row execute function public.set_updated_at();
create trigger comments_updated_at before update on public.comments
for each row execute function public.set_updated_at();
create trigger questions_updated_at before update on public.questions
for each row execute function public.set_updated_at();
create trigger adjustments_updated_at before update on public.metric_adjustments
for each row execute function public.set_updated_at();
create trigger settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, username, email, country_code, phone)
  values (
    new.id,
    trim(new.raw_user_meta_data ->> 'name'),
    trim(new.raw_user_meta_data ->> 'username'),
    new.email,
    upper(trim(new.raw_user_meta_data ->> 'country_code')),
    nullif(trim(new.raw_user_meta_data ->> 'phone'), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.consume_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent_count integer;
begin
  delete from public.rate_limits
  where occurred_at < now() - interval '1 day';

  select count(*) into recent_count
  from public.rate_limits
  where key = p_key
    and occurred_at > now() - make_interval(secs => p_window_seconds);

  if recent_count >= p_limit then
    return false;
  end if;

  insert into public.rate_limits(key) values (p_key);
  return true;
end;
$$;

create or replace function public.set_metric_adjustment(
  p_metric text,
  p_target_id uuid,
  p_adjustment bigint,
  p_note text default null
)
returns public.metric_adjustments
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_value bigint := 0;
  result public.metric_adjustments;
begin
  select adjustment into old_value
  from public.metric_adjustments
  where metric = p_metric and target_id is not distinct from p_target_id;

  insert into public.metric_adjustments(metric, target_id, adjustment)
  values (p_metric, p_target_id, p_adjustment)
  on conflict (metric, target_id)
  do update set adjustment = excluded.adjustment
  returning * into result;

  insert into public.audit_logs(
    action, entity_type, entity_id, metric, target_id,
    old_adjustment, new_adjustment, change_amount, note
  ) values (
    'metric_adjustment', 'metric_adjustment', result.id, p_metric, p_target_id,
    coalesce(old_value, 0), p_adjustment, p_adjustment - coalesce(old_value, 0), p_note
  );

  return result;
end;
$$;

create or replace view public.public_media as
select
  media.*,
  coalesce(views.verified_views, 0)::bigint as verified_views,
  coalesce(view_adjustment.adjustment, 0)::bigint as view_adjustment,
  greatest(
    0,
    coalesce(views.verified_views, 0) + coalesce(view_adjustment.adjustment, 0)
  )::bigint as displayed_views,
  greatest(
    0,
    coalesce(reaction_totals.verified_reactions, 0)
      + coalesce(reaction_adjustment.adjustment, 0)
  )::bigint as reaction_count,
  greatest(
    0,
    coalesce(comment_totals.verified_comments, 0)
      + coalesce(comment_adjustment.adjustment, 0)
  )::bigint as comment_count
from public.media_items media
left join lateral (
  select count(*)::bigint as verified_views
  from public.analytics_events events
  where events.media_id = media.id and events.event_type = 'video_view'
) views on true
left join public.metric_adjustments view_adjustment
  on view_adjustment.metric = 'video_views' and view_adjustment.target_id = media.id
left join lateral (
  select count(*)::bigint as verified_reactions
  from public.reactions value where value.media_id = media.id
) reaction_totals on true
left join public.metric_adjustments reaction_adjustment
  on reaction_adjustment.metric = 'reactions' and reaction_adjustment.target_id = media.id
left join lateral (
  select count(*)::bigint as verified_comments
  from public.comments value
  where value.media_id = media.id and value.hidden_at is null
) comment_totals on true
left join public.metric_adjustments comment_adjustment
  on comment_adjustment.metric = 'comments' and comment_adjustment.target_id = media.id
where media.status = 'published' and media.published_at <= now();

create or replace view public.host_media as
select
  media.*,
  coalesce(views.verified_views, 0)::bigint as verified_views,
  coalesce(view_adjustment.adjustment, 0)::bigint as view_adjustment,
  greatest(
    0,
    coalesce(views.verified_views, 0) + coalesce(view_adjustment.adjustment, 0)
  )::bigint as displayed_views,
  greatest(
    0,
    coalesce(reaction_totals.verified_reactions, 0)
      + coalesce(reaction_adjustment.adjustment, 0)
  )::bigint as reaction_count,
  greatest(
    0,
    coalesce(comment_totals.verified_comments, 0)
      + coalesce(comment_adjustment.adjustment, 0)
  )::bigint as comment_count
from public.media_items media
left join lateral (
  select count(*)::bigint as verified_views
  from public.analytics_events events
  where events.media_id = media.id and events.event_type = 'video_view'
) views on true
left join public.metric_adjustments view_adjustment
  on view_adjustment.metric = 'video_views' and view_adjustment.target_id = media.id
left join lateral (
  select count(*)::bigint as verified_reactions
  from public.reactions value where value.media_id = media.id
) reaction_totals on true
left join public.metric_adjustments reaction_adjustment
  on reaction_adjustment.metric = 'reactions' and reaction_adjustment.target_id = media.id
left join lateral (
  select count(*)::bigint as verified_comments
  from public.comments value
  where value.media_id = media.id and value.hidden_at is null
) comment_totals on true
left join public.metric_adjustments comment_adjustment
  on comment_adjustment.metric = 'comments' and comment_adjustment.target_id = media.id;

create or replace view public.public_country_counts as
select
  profiles.country_code,
  case profiles.country_code
    when 'US' then 'United States'
    when 'KR' then 'South Korea'
    when 'CA' then 'Canada'
    when 'GB' then 'United Kingdom'
    when 'AU' then 'Australia'
    when 'JP' then 'Japan'
    when 'DE' then 'Germany'
    when 'FR' then 'France'
    when 'IN' then 'India'
    when 'SG' then 'Singapore'
    else profiles.country_code
  end as country_name,
  count(*)::bigint as member_count
from public.profiles
group by profiles.country_code;

create or replace view public.public_metrics as
select
  greatest(
    0,
    (select count(*) from public.analytics_events where event_type = 'site_impression')
      + coalesce((select adjustment from public.metric_adjustments
        where metric = 'site_impressions' and target_id is null), 0)
  )::bigint as site_impressions,
  coalesce((select sum(displayed_views) from public.public_media), 0)::bigint
    as total_video_views,
  greatest(
    0,
    (select count(*) from public.profiles)
      + coalesce((select adjustment from public.metric_adjustments
        where metric = 'members' and target_id is null), 0)
  )::bigint as total_members,
  greatest(
    0,
    (select count(distinct country_code) from public.profiles)
      + coalesce((select adjustment from public.metric_adjustments
        where metric = 'countries_reached' and target_id is null), 0)
  )::bigint as countries_reached;

create or replace view public.host_overview as
select
  count(*) filter (where kind = 'conversation')::bigint as conversations,
  count(*) filter (where kind = 'dispatch')::bigint as dispatches,
  (select count(*) from public.comments)::bigint as comments,
  (select count(*) from public.reactions)::bigint as reactions,
  (select count(*) from public.questions)::bigint as questions
from public.media_items;

alter table public.profiles enable row level security;
alter table public.media_items enable row level security;
alter table public.reactions enable row level security;
alter table public.comments enable row level security;
alter table public.questions enable row level security;
alter table public.analytics_events enable row level security;
alter table public.metric_adjustments enable row level security;
alter table public.audit_logs enable row level security;
alter table public.site_settings enable row level security;
alter table public.rate_limits enable row level security;

create policy "Members view their own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);
create policy "Members update their own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Published media is public"
on public.media_items for select
using (status = 'published' and published_at <= now());

create policy "Reactions are public"
on public.reactions for select using (true);
create policy "Members create reactions"
on public.reactions for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "Members update their reactions"
on public.reactions for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "Members remove their reactions"
on public.reactions for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Visible comments are public"
on public.comments for select
using (hidden_at is null or (select auth.uid()) = user_id);
create policy "Members create comments"
on public.comments for insert to authenticated
with check ((select auth.uid()) = user_id and hidden_at is null);
create policy "Members update their comments"
on public.comments for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "Members delete their comments"
on public.comments for delete to authenticated
using ((select auth.uid()) = user_id);

grant usage on schema public to anon, authenticated;
grant select on public.public_media, public.public_metrics, public.public_country_counts
  to anon, authenticated;
revoke all on public.profiles, public.media_items, public.reactions, public.comments
  from anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.reactions, public.comments to authenticated;
grant insert, update, delete on public.reactions, public.comments to authenticated;
revoke all on public.questions, public.analytics_events, public.metric_adjustments,
  public.audit_logs, public.site_settings, public.rate_limits from anon, authenticated;
revoke all on function public.set_metric_adjustment(text, uuid, bigint, text)
  from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer)
  to anon, authenticated;
