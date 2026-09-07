# K-VERSATION

K-VERSATION is an editorial video publication connecting people through stories, experiences, and perspectives related to South Korea. It includes public Conversations and Dispatches, membership, comments and reactions, first-party analytics, and a separate host studio.

## Stack

- Next.js 16, React 19, TypeScript
- Supabase Auth and PostgreSQL with row-level security
- Mux direct uploads and adaptive video playback
- Resend question notifications
- Vitest and Testing Library

## Local development

Use Node 22.20.0:

```bash
nvm use
npm install
cp .env.example .env.local
npm run dev
```

The public site remains usable without external credentials, but database-backed content, membership, engagement, analytics, host tools, uploads, and email require the corresponding environment variables.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical public origin |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only database administration |
| `HOST_PASSWORD_HASH` | Initial bcrypt host password hash |
| `HOST_SESSION_SECRET` | Random secret for signed host sessions |
| `MUX_TOKEN_ID` | Server-only Mux API token ID |
| `MUX_TOKEN_SECRET` | Server-only Mux API token secret |
| `MUX_WEBHOOK_SECRET` | Server-only Mux webhook signing secret |
| `RESEND_API_KEY` | Server-only Resend API key |
| `QUESTIONS_FROM_EMAIL` | Verified sender for question notifications |
| `QUESTIONS_TO_EMAIL` | Host question-notification recipient |

Never expose the service-role, host, Mux, or Resend secrets through `NEXT_PUBLIC_*` variables.

## Database

Apply the migration in `supabase/migrations/20260907060000_initial_schema.sql` to a Supabase project. It creates the normalized application schema, indexes, triggers, public aggregate views, RLS policies, rate limiting, metric adjustments, and audit logging.

After applying it:

1. Confirm Supabase Auth email verification and redirect URLs include `/auth/callback`.
2. Set `HOST_PASSWORD_HASH` to a bcrypt hash and `HOST_SESSION_SECRET` to a high-entropy random value.
3. Verify anonymous users can read the public views but cannot read `profiles`.
4. Verify authenticated members can only read and update their own profile and their own interactions.

## Mux

Create a Mux API access token and configure a webhook to:

```text
<NEXT_PUBLIC_SITE_URL>/api/mux/webhook
```

Subscribe to asset-ready and asset-error events. The host studio creates direct upload URLs without exposing Mux credentials to the browser.

## Resend

Verify the domain used by `QUESTIONS_FROM_EMAIL`. Questions are persisted first; when `RESEND_API_KEY` is configured, the server sends the host a notification without exposing the API key.

## Verification

```bash
npm run check
npm audit --audit-level=high
```

`npm run check` runs lint, TypeScript, unit tests, and a production build.

## Deployment

Deploy the Next.js application to a Node-compatible platform, configure all production environment variables there, apply the Supabase migration, and update Supabase/Mux callback URLs to the deployed HTTPS origin.

The Privacy Policy and Terms describe the implemented platform but should receive jurisdiction-specific legal review before launch.
