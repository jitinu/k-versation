insert into public.subscribers (id, email, name, country_code, country_name, phone)
values
  ('20000000-0000-0000-0000-000000000001', 'mina.park@example.com', 'Mina Park', 'KR', 'South Korea', null),
  ('20000000-0000-0000-0000-000000000002', 'jiho.kim@example.com', 'Jiho Kim', 'KR', 'South Korea', null),
  ('20000000-0000-0000-0000-000000000003', 'sora.lee@example.com', 'Sora Lee', 'KR', 'South Korea', null),
  ('20000000-0000-0000-0000-000000000004', 'olivia.chen@example.com', 'Olivia Chen', 'US', 'United States', null),
  ('20000000-0000-0000-0000-000000000005', 'james.chen@example.com', 'James Chen', 'US', 'United States', null),
  ('20000000-0000-0000-0000-000000000006', 'yuki.sato@example.com', 'Yuki Sato', 'JP', 'Japan', null),
  ('20000000-0000-0000-0000-000000000007', 'li.wei@example.com', 'Li Wei', 'CN', 'China', null),
  ('20000000-0000-0000-0000-000000000008', 'mei.lin@example.com', 'Mei Lin', 'TW', 'Taiwan', null),
  ('20000000-0000-0000-0000-000000000009', 'noor.khan@example.com', 'Noor Khan', 'AE', 'United Arab Emirates', null),
  ('20000000-0000-0000-0000-000000000010', 'george.wright@example.com', 'George Wright', 'GB', 'United Kingdom', null)
on conflict (id) do update set
  email = excluded.email,
  name = excluded.name,
  country_code = excluded.country_code,
  country_name = excluded.country_name,
  phone = excluded.phone;

insert into public.videos (
  id, slug, section, title, subtitle, description, video_url, thumbnail_url,
  duration_seconds, published_at
)
values
  (
    '10000000-0000-0000-0000-000000000001',
    'across-the-table',
    'conversation',
    'Across the Table',
    'A conversation about identity and belonging',
    'Daniel sits down to talk about the ordinary stories that connect Korean culture, family, and the places we call home.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/across-the-table.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/across-the-table.jpg?v=3',
    480,
    '2026-09-14T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'growing-up-between-two-languages',
    'conversation',
    'Growing up between two languages',
    'What translation teaches us about belonging',
    'A conversation about the small misunderstandings, private jokes, and unexpected freedom of growing up between Korean and English.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/across-the-table.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/growing-up-between-two-languages.jpg',
    1620,
    '2026-08-15T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'chuseok-at-my-grandmothers-table',
    'conversation',
    'Chuseok at my grandmother''s table',
    'Memory, food, and the shape of a family tradition',
    'Daniel reflects on the meals that carry memory across generations, and what remains when the table gets a little smaller each year.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/across-the-table.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/chuseok-at-my-grandmothers-table.jpg',
    2280,
    '2026-07-19T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'what-k-pop-gets-right-about-ambition',
    'conversation',
    'What K-pop gets right about ambition',
    'Discipline, polish, and the courage to keep going',
    'A thoughtful conversation about practice, performance, and the complicated promise of ambition in contemporary Korea.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/across-the-table.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/what-k-pop-gets-right-about-ambition.jpg',
    2880,
    '2026-06-28T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'seoul-through-a-bay-area-lens',
    'conversation',
    'Seoul through a Bay Area lens',
    'Two cities, one restless energy',
    'Daniel traces the similarities and productive tensions between Seoul and the Bay Area, from late-night work to finding community.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/across-the-table.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/seoul-through-a-bay-area-lens.jpg',
    1980,
    '2026-05-17T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    'hanbok-then-and-now',
    'conversation',
    'Hanbok, then and now',
    'A living tradition in a changing wardrobe',
    'A conversation about wearing history in the present tense, and why tradition becomes more meaningful when people make it their own.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/across-the-table.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/hanbok-then-and-now.jpg',
    2520,
    '2026-04-12T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000007',
    'between-two-worlds',
    'monologue',
    'Between Two Worlds',
    'A monologue on carrying home with you',
    'A quiet monologue on heritage, memory, and finding a place between cultures without having to choose only one.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/between-two-worlds.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/between-two-worlds.jpg?v=3',
    720,
    '2026-09-10T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000008',
    'why-i-started-k-versation',
    'intro',
    'Why I started K-VERSATION',
    'A note on curiosity, culture, and making room for one more story',
    'Daniel shares the personal question behind K-VERSATION and why the best way to understand a culture is often to listen first.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/between-two-worlds.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/why-i-started-k-versation.jpg',
    1440,
    '2026-08-02T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000009',
    'the-sound-of-home',
    'monologue',
    'The sound of home',
    'On accents, distance, and the voices we keep',
    'A personal reflection on the sounds that follow us across oceans, and the moment a familiar voice can make any place feel close.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/between-two-worlds.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/the-sound-of-home.jpg',
    2160,
    '2026-06-09T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000010',
    'a-seat-at-the-table',
    'monologue',
    'A seat at the table',
    'The quiet politics of being welcomed in',
    'Daniel considers the invitations, gestures, and everyday acts of generosity that turn a room into a community.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/between-two-worlds.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/a-seat-at-the-table.jpg',
    1740,
    '2026-04-26T00:00:00Z'
  )
on conflict (id) do update set
  slug = excluded.slug,
  section = excluded.section,
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  video_url = excluded.video_url,
  thumbnail_url = excluded.thumbnail_url,
  duration_seconds = excluded.duration_seconds,
  published_at = excluded.published_at;

insert into public.reactions (video_id, subscriber_id, kind)
values
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'heart'),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'thumbs_up')
on conflict do nothing;

insert into public.comments (video_id, subscriber_id, body)
values
  (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'This feels like the kind of conversation that keeps unfolding after the video ends.'
  )
on conflict do nothing;
