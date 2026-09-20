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
    'Daniel sits down to talk about the ordinary stories that connect Korean culture, family, and the places we call home. The conversation finds belonging in details that can seem small until they follow us across borders. It is an invitation to keep talking after the table is cleared.',
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
    'Growing up between Korean and English means learning to live inside small misunderstandings, private jokes, and unexpected freedoms. Daniel explores how translation can shape belonging rather than simply transfer words. The conversation asks what it means to carry more than one home in your voice.',
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
    'Daniel reflects on the meals that carry memory across generations. He considers what remains when a family table gets a little smaller each year. Chuseok becomes a way to talk about food, absence, and the traditions we keep remaking.',
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
    'K-pop makes ambition look polished, but its real story begins with practice and persistence. Daniel talks about performance, discipline, and the complicated promise of always pushing further. The conversation also asks what courage looks like before anyone is watching.',
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
    'Seoul and the Bay Area can feel worlds apart, yet both run on late nights, restless energy, and the search for community. Daniel traces their similarities and the tensions that make each place distinct. Looking at one city through the other reveals new ways to belong.',
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
    'Hanbok carries history in its lines, colors, and movement, but it is not frozen in the past. Daniel talks about wearing tradition in the present tense and why a living wardrobe keeps changing. The conversation asks how people make heritage their own.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/across-the-table.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/hanbok-then-and-now.jpg',
    2520,
    '2026-04-12T00:00:00Z'
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
