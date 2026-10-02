create table public.country_baseline (
  country_code char(2) primary key,
  country_name text not null,
  members bigint not null default 0
);
alter table public.country_baseline enable row level security;
create policy "country_baseline public read" on public.country_baseline for select using (true);

insert into public.country_baseline (country_code, country_name, members) values
  ('US', 'United States', 118),
  ('KR', 'South Korea', 96),
  ('JP', 'Japan', 34),
  ('GB', 'United Kingdom', 23),
  ('CN', 'China', 22),
  ('TW', 'Taiwan', 21),
  ('SG', 'Singapore', 16);

create or replace function public.members_by_country()
returns table (country_code char(2), country_name text, members bigint)
language sql security definer stable set search_path = public as $$
  select t.country_code, min(t.country_name), sum(t.members)::bigint
  from (
    select s.country_code, s.country_name, 1::bigint as members from public.subscribers s
    union all
    select b.country_code, b.country_name, b.members from public.country_baseline b
  ) t
  group by t.country_code;
$$;

create or replace function public.site_numbers()
returns table (impressions bigint, views bigint, members bigint, countries bigint)
language sql security definer stable set search_path = public as $$
  select
    s.impressions + s.impressions_offset,
    (select coalesce(sum(view_count + view_offset), 0) from public.videos) + s.views_offset,
    (select count(*) from public.subscribers) + s.members_offset,
    (select count(*) from (
      select country_code from public.subscribers
      union
      select country_code from public.country_baseline
    ) c) + s.countries_offset
  from public.site_stats s where s.id = 1;
$$;
