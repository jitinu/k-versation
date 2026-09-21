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
    'todd-park-from-obama-s-white-house-to-fixing-american-healthcare',
    'conversation',
    'Todd Park: from Obama''s White House to fixing American healthcare',
    'Former U.S. Chief Technology Officer, co-founder of athenahealth and Devoted Health',
    'Todd Park served as the United States Chief Technology Officer under President Obama and went on to co-found athenahealth and Devoted Health with his brother Ed. He explains why American healthcare is a tangle of payment, incentives, and fragmentation rather than a failure of doctors and nurses, and what proactive, coordinated care could look like instead. Todd describes how AI is already cutting administrative work at Devoted, but only because the guardrails and data plumbing were built first. He also tells the story of his parents arriving in the late 1960s with almost nothing, his father''s seventy-plus patents, and his mother''s gentle, infinite love. His advice to kids from immigrant families: stop over-planning and fall in love with a mission.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/todd-park-from-obama-s-white-house-to-fixing-american-healthcare.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/todd-park-from-obama-s-white-house-to-fixing-american-healthcare.jpg',
    971,
    '2025-06-14T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'inside-k-pop-with-starship-s-sera-shim-ive-ai-songs-and-what-comes-next',
    'conversation',
    'Inside K-pop with Starship''s Sera Shim: IVE, AI songs, and what comes next',
    'Director of strategic planning at Starship Entertainment',
    'Sera Shim has spent more than fifteen years at Universal Music, Sony Music, and Starship Entertainment, where she works on strategy and international marketing for artists like IVE, MONSTA X, CRAVITY, and KiiiKiii. She breaks down why IVE caught on so fast at home and abroad, and why promoting K-pop globally has actually gotten harder as every region develops its own codes. Sera is candid about online hate as an artist mental-health crisis and how the company tries to respond. On AI-generated music, she admits the songs can sound impressive but feel like something you have already heard, and she worries more about copyright and artist identity than about quality. She also argues K-pop is an industry rather than a genre, and that Korea''s low birth rate will simply make groups more international.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/inside-k-pop-with-starship-s-sera-shim-ive-ai-songs-and-what-comes-next.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/inside-k-pop-with-starship-s-sera-shim-ive-ai-songs-and-what-comes-next.jpg',
    949,
    '2025-06-28T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'why-doesn-t-korea-produce-nba-players-a-former-kbl-pro-answers',
    'conversation',
    'Why doesn''t Korea produce NBA players? A former KBL pro answers',
    'Coach Logan, former Korean Basketball League player and Daniel''s own coach',
    'Logan played about seven seasons in the Korean Basketball League, spent six years as a head coach and director, and now happens to be Daniel''s basketball coach. He talks about the highs and crashes of a pro career, the mandatory military service in the middle of it, and how a goofy phone video with a friend accidentally turned into the popular content project Coxman. Logan explains why Korean players are often over-coached into predictable patterns while Japanese kids are given freedom to experiment, and what that does to confidence. He compares the basketball cultures of Korea, China, and Japan and is honest about why size, low youth participation, and short-term pressure keep Koreans out of the NBA. His advice is not a trick but persistence: keep training, take feedback, and make physical play feel normal from a young age.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/why-doesn-t-korea-produce-nba-players-a-former-kbl-pro-answers.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/why-doesn-t-korea-produce-nba-players-a-former-kbl-pro-answers.jpg',
    1314,
    '2025-07-12T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'yoonjong-park-built-an-app-52-million-people-use-he-says-coding-was-the-easy-part',
    'conversation',
    'Yoonjong Park built an app 52 million people use. He says coding was the easy part',
    'CTO of Photo Widget, former Coupang engineer, Korean Olympiad in Informatics medalist',
    'Yoonjong Park won a medal at the Korean Olympiad in Informatics, studied computer science at Seoul National University, worked in gaming and as a senior backend engineer at Coupang, and is now CTO of Photo Widget, an iPhone customization app with 52 million users worldwide. He learned to code to make games and then discovered that shipping a product means understanding users, designing features, and working with people outside engineering. Yoonjong compares life inside a giant company with life on a small team where you can just decide things. On AI, he uses ChatGPT for questions and Claude Code for programming, but he thinks the skill that matters most is expressing your own thinking clearly. He compares AI to the camera: painters did not disappear, because knowing what to make still mattered.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/yoonjong-park-built-an-app-52-million-people-use-he-says-coding-was-the-easy-part.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/yoonjong-park-built-an-app-52-million-people-use-he-says-coding-was-the-easy-part.jpg',
    784,
    '2025-07-26T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'jamie-gao-on-growing-up-inside-taiwan-s-exam-machine',
    'conversation',
    'Jamie Gao on growing up inside Taiwan''s exam machine',
    'Mandarin and literature teacher at The Nueva School, lead of its Taiwan exchange',
    'Jamie Gao grew up in Taiwan''s exam-centered school system and now teaches Mandarin and literature at The Nueva School, where she leads the Taiwan exchange program. She remembers an education where about ninety percent of learning pointed at quizzes and entrance exams, and explains why grades in East Asia carry family honor and social status, not just a score. Jamie is fair about both sides: exam culture builds endurance and discipline, but it can crush creativity, joy, and mental health, and turn failure into shame. She describes buxiban and hagwon as real help in overcrowded schools that nonetheless create an unequal shadow education system. She also has a blunt answer to whether her Nueva students would ace Korea''s CSAT, and a hope that AI becomes a tool for reflection rather than one more way to judge kids by output.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/jamie-gao-on-growing-up-inside-taiwan-s-exam-machine.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/jamie-gao-on-growing-up-inside-taiwan-s-exam-machine.jpg',
    1191,
    '2025-08-09T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    'heejung-ali-what-studying-in-korea-and-america-taught-two-phd-students-about-pressure',
    'conversation',
    'Heejung & Ali: what studying in Korea and America taught two PhD students about pressure',
    'A Seoul consultant turned Yonsei PhD student and an American PhD researcher in Korea',
    'Heejung is a management consultant with PwC and IBM in Seoul who is now doing a PhD in science and innovation policy at Yonsei University, and Ali is an American PhD student in public policy researching governance in Korea. Together they compare Daechi-dong''s hagwon culture, where private academies can start in preschool, with an American childhood where after-school clubs were mostly about having fun. They talk about why Korean students wait until an answer is perfect before speaking while American classrooms reward thinking out loud, and about parents who define success before kids can. The conversation reaches into Korea''s low birth rate, shrinking schools outside Seoul, and how hard it is to move countries for a degree. It ends on AI in universities: closed-book exams are back, students still try to sneak devices past cameras, and the real task is learning to live with the technology.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/heejung-ali-what-studying-in-korea-and-america-taught-two-phd-students-about-pressure.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/heejung-ali-what-studying-in-korea-and-america-taught-two-phd-students-about-pressure.jpg',
    1897,
    '2025-08-23T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000007',
    'codetree-ceo-lee-seung-yong-why-ai-makes-learning-to-code-more-important-not-less',
    'conversation',
    'CodeTree CEO Lee Seung-yong: why AI makes learning to code more important, not less',
    'Founder of Branch & Bound, the company behind Korea''s CodeTree coding platform',
    'Lee Seung-yong studied computer science at Seoul National University and founded Branch & Bound, whose CodeTree platform is used by major Korean tech companies for coding tests and programming education and is now expanding overseas. He explains why building an education startup in Korea is hard when the market is small and education is not seen as something that scales, and why Korea still makes a great test bed for new products. Seung-yong argues that AI raises the value of real computer-science fundamentals because someone has to customize it, debug it, and fit it to a real domain. CodeTree deliberately refuses to hand students answers, offering a hint only when a learner is about to give up. His advice to Gen Z is to find what you are good at and care about, then use AI to turn that into something people need.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/codetree-ceo-lee-seung-yong-why-ai-makes-learning-to-code-more-important-not-less.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/codetree-ceo-lee-seung-yong-why-ai-makes-learning-to-code-more-important-not-less.jpg',
    2125,
    '2025-09-06T00:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000008',
    'diane-rosenberg-on-forty-years-of-teaching-phones-and-what-kids-actually-need',
    'conversation',
    'Diane Rosenberg on forty years of teaching, phones, and what kids actually need',
    'Former head of school at The Nueva School',
    'Diane Rosenberg started as a middle-school teacher, never wanted to leave the classroom, and ended up as head of school at The Nueva School, where her first day as principal began with someone asking where the toilet paper was. She talks about what makes Nueva''s community work, why social-emotional learning belongs next to rigorous inquiry, and the school moments she misses most. Looking across four decades, she has watched anxiety, distraction, and isolation rise alongside phones and social media, and she makes a careful case for delaying smartphones without cutting kids off from emergencies or friends. On AI, she cares less about whether a student typed every sentence than whether they can fact-check, spot a fabricated source, and use writing to think. Her parting advice is simple: stay curious, ask questions, seek adventures, and follow your passions.',
    'http://127.0.0.1:54321/storage/v1/object/public/videos/videos/diane-rosenberg-on-forty-years-of-teaching-phones-and-what-kids-actually-need.mp4',
    'http://127.0.0.1:54321/storage/v1/object/public/thumbnails/thumbnails/diane-rosenberg-on-forty-years-of-teaching-phones-and-what-kids-actually-need.jpg',
    2528,
    '2025-09-20T00:00:00Z'
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
