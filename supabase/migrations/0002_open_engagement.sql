begin;

alter table public.reactions drop constraint reactions_pkey;
alter table public.reactions drop constraint reactions_subscriber_id_fkey;
alter table public.reactions rename column subscriber_id to actor_id;
alter table public.reactions add primary key (video_id, actor_id, kind);

alter table public.comments alter column subscriber_id drop not null;
alter table public.comments add column actor_id uuid;
alter table public.comments add column author_name text;

create or replace view public.comments_public with (security_invoker = false) as
select
  c.id,
  c.video_id,
  c.body,
  c.created_at,
  coalesce(s.name, c.author_name, 'K-VERSATION guest') as author_name
from public.comments c
left join public.subscribers s on s.id = c.subscriber_id;

grant select on public.video_display_stats to anon, authenticated;

alter publication supabase_realtime add table public.reactions;
alter publication supabase_realtime add table public.comments;

commit;
