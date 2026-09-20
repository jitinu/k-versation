create extension if not exists pgcrypto;

create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  name text not null check (char_length(name) between 1 and 80),
  country_code char(2) not null,
  country_name text not null,
  phone text,
  token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);
create index subscribers_country_idx on public.subscribers(country_code);

create type public.video_section as enum ('conversation', 'monologue', 'intro');

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  section public.video_section not null,
  title text not null,
  subtitle text,
  description text not null,
  video_url text not null,
  thumbnail_url text not null,
  duration_seconds int not null default 0,
  published_at timestamptz not null default now(),
  view_count bigint not null default 0,
  view_offset bigint not null default 0,
  comment_offset bigint not null default 0,
  created_at timestamptz not null default now()
);
create index videos_section_published_idx on public.videos(section, published_at desc);

create type public.reaction_kind as enum ('thumbs_up', 'heart', 'laugh', 'wow', 'fire');

create table public.reactions (
  video_id uuid not null references public.videos(id) on delete cascade,
  subscriber_id uuid not null references public.subscribers(id) on delete cascade,
  kind public.reaction_kind not null,
  created_at timestamptz not null default now(),
  primary key (video_id, subscriber_id, kind)
);

create table public.reaction_offsets (
  video_id uuid not null references public.videos(id) on delete cascade,
  kind public.reaction_kind not null,
  offset_count bigint not null default 0,
  primary key (video_id, kind)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  subscriber_id uuid not null references public.subscribers(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index comments_video_idx on public.comments(video_id, created_at desc);

create view public.comments_public with (security_invoker = false) as
select c.id, c.video_id, c.body, c.created_at, s.name as author_name
from public.comments c
join public.subscribers s on s.id = c.subscriber_id;
grant select on public.comments_public to anon, authenticated;

create table public.site_stats (
  id int primary key default 1 check (id = 1),
  impressions bigint not null default 0,
  impressions_offset bigint not null default 0,
  views_offset bigint not null default 0,
  members_offset bigint not null default 0,
  countries_offset bigint not null default 0,
  updated_at timestamptz not null default now()
);
insert into public.site_stats (id) values (1);

alter table public.subscribers enable row level security;
alter table public.videos enable row level security;
alter table public.reactions enable row level security;
alter table public.reaction_offsets enable row level security;
alter table public.comments enable row level security;
alter table public.site_stats enable row level security;

create policy "videos public read" on public.videos for select using (published_at <= now());
create policy "reactions public read" on public.reactions for select using (true);
create policy "reaction_offsets public read" on public.reaction_offsets for select using (true);
create policy "comments public read" on public.comments for select using (true);
create policy "site_stats public read" on public.site_stats for select using (true);

create or replace function public.record_impression()
returns void language sql security definer set search_path = public as $$
  update public.site_stats set impressions = impressions + 1, updated_at = now() where id = 1;
$$;
grant execute on function public.record_impression() to anon, authenticated;

create or replace function public.record_view(p_video_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.videos set view_count = view_count + 1 where id = p_video_id;
$$;
grant execute on function public.record_view(uuid) to anon, authenticated;

create or replace view public.video_display_stats as
select
  v.id as video_id,
  v.view_count + v.view_offset as views,
  (select count(*) from public.comments c where c.video_id = v.id) + v.comment_offset as comments,
  coalesce((
    select jsonb_object_agg(k.kind, coalesce(r.n, 0) + coalesce(o.offset_count, 0))
    from unnest(enum_range(null::public.reaction_kind)) as k(kind)
    left join (
      select kind, count(*) n
      from public.reactions
      where video_id = v.id
      group by kind
    ) r on r.kind = k.kind
    left join public.reaction_offsets o on o.video_id = v.id and o.kind = k.kind
  ), '{}'::jsonb) as reactions
from public.videos v;

create or replace function public.site_numbers()
returns table (impressions bigint, views bigint, members bigint, countries bigint)
language sql security definer stable set search_path = public as $$
  select
    s.impressions + s.impressions_offset,
    (select coalesce(sum(view_count + view_offset), 0) from public.videos) + s.views_offset,
    (select count(*) from public.subscribers) + s.members_offset,
    (select count(distinct country_code) from public.subscribers) + s.countries_offset
  from public.site_stats s where s.id = 1;
$$;
grant execute on function public.site_numbers() to anon, authenticated;

create or replace function public.members_by_country()
returns table (country_code char(2), country_name text, members bigint)
language sql security definer stable set search_path = public as $$
  select country_code, min(country_name), count(*)
  from public.subscribers
  group by country_code;
$$;
grant execute on function public.members_by_country() to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('videos', 'videos', true), ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;
create policy "media public read" on storage.objects for select using (bucket_id in ('videos', 'thumbnails'));
