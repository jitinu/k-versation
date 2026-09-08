# K-VERSATION

K-VERSATION is a dark, editorial video site sharing Korean culture through conversations and monologues by Daniel Koo.

## Run locally

1. Install Node 22 and run `npm install`.
2. Copy `.env.example` to `.env.local`. The site works without Supabase and shows friendly empty states until it is configured.
3. Run `npm run dev`, then open http://localhost:3000.

## Environment variables

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase browser key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for counters and video uploads |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `HOST_PASSWORD` | Password for `/host` |
| `HOST_SESSION_SECRET` | Long random secret used for the host cookie |
| `RESEND_API_KEY` | Enables the Questions email form |
| `QUESTIONS_TO_EMAIL` | Inbox receiving questions |
| `QUESTIONS_FROM_EMAIL` | Verified Resend sender |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional Plausible domain |

## Set up Supabase

Create a Supabase project, then paste `supabase/migrations/0001_init.sql` into the Supabase SQL editor and run it. If you use the Supabase CLI instead, link the project and run `supabase db push`.

## Add a video

```bash
npx tsx scripts/add-video.ts \
  --file ./episode.mp4 \
  --section conversation \
  --title "A conversation title" \
  --description-file ./description.txt \
  --publish 2026-01-15
```

The script uses `ffprobe`, uploads the video and thumbnail to Supabase Storage, and creates the video record. Add `--thumbnail ./thumbnail.jpg` to provide a specific thumbnail. Without it, it extracts a frame at three seconds with `ffmpeg`. You can also upload media yourself and insert a row into `videos` in the SQL editor.

## Host mode

Visit `/host` and enter `HOST_PASSWORD`. Host mode adjusts displayed site and video numbers. Negative offsets are allowed but public numbers are clamped at zero.

## Deploy

Import the repository into Vercel, add the environment variables, and deploy. Apply the Supabase migration before enabling accounts or uploads.
