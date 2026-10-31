alter table public.videos add column if not exists sort_rank integer;
create index if not exists videos_sort_rank_idx on public.videos(section, sort_rank);
