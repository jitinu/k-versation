delete from public.country_baseline where country_code = 'BR';

insert into public.country_baseline (country_code, country_name, members) values
  ('SE', 'Sweden', 23)
on conflict (country_code) do update
  set country_name = excluded.country_name, members = excluded.members;
