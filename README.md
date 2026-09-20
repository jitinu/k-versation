# K-VERSATION

K-VERSATION is an editorial video site sharing Korean culture through conversations and monologues by Daniel Koo.

## Run locally

1. Install Node 22 and run `npm install`.
2. Copy `.env.example` to `.env.local`. The site works without Supabase and shows friendly empty states until it is configured.
3. Run `npm run dev`, then open http://localhost:3000.

## Environment variables

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase browser key for video and comment reads |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for subscribers, counters, comments, reactions, and video uploads |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `HOST_PASSWORD` | Password for `/host` |
| `HOST_SESSION_SECRET` | Long random secret used for the host cookie |
| `RESEND_API_KEY` | Enables the Questions email form; Resend is only used for Questions |
| `QUESTIONS_TO_EMAIL` | Inbox receiving questions |
| `QUESTIONS_FROM_EMAIL` | Verified Resend sender |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional Plausible domain |

## Set up Supabase

Create a Supabase project, then paste `supabase/migrations/0001_init.sql` into the Supabase SQL editor and run it. If you use the Supabase CLI instead, link the project and run `supabase db push`. Visitors join a passwordless subscriber list with their email, name, country, and optional phone; a private token cookie identifies them for reactions and comments. Subscribers can be exported from host mode as CSV.

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

### Publishing many videos at once

Prepare a JSON manifest containing `file`, `section`, `publish`, `title`, `subtitle`, and
`description` for each video. Source files are located recursively by basename under the
attachments directory. The batch publisher transcodes each source to H.264/AAC MP4, creates a
non-black poster under `/home/ubuntu/posters-final/`, uploads both assets to local Supabase
Storage, and upserts the video metadata by slug:

```bash
npx tsx scripts/publish-manifest.ts \
  --manifest /home/ubuntu/content/manifest.json \
  --dir /home/ubuntu/attachments
```

For one-off publishing, use `scripts/add-video.ts`. Both commands share the implementation in
`scripts/lib/publish.ts`.

## Host mode

Visit `/host` and enter `HOST_PASSWORD`. Host mode shows subscriber growth, exports subscriber CSV, and adjusts displayed site and video numbers. Negative offsets are allowed but public numbers are clamped at zero.

## Deploy

Import the repository into Vercel, add the environment variables, and deploy. Apply the Supabase migration before enabling uploads. Subscriber identity is handled by the private `subscribers` table and `kv_sub` cookie rather than Supabase Auth.
