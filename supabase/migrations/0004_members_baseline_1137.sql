insert into public.country_baseline (country_code, country_name, members) values
  ('US', 'United States', 382),
  ('KR', 'South Korea', 311),
  ('JP', 'Japan', 109),
  ('CA', 'Canada', 74),
  ('GB', 'United Kingdom', 66),
  ('CN', 'China', 58),
  ('TW', 'Taiwan', 55),
  ('SG', 'Singapore', 39),
  ('BR', 'Brazil', 23),
  ('AE', 'United Arab Emirates', 20)
on conflict (country_code) do update
  set country_name = excluded.country_name, members = excluded.members;

update public.site_stats
  set members_offset = (select sum(members) from public.country_baseline)
  where id = 1;
