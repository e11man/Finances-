# Financial Planner MVP

A monthly-first financial planning app providing a 12-month budgeting grid, automatic rollover, and long-term projection simulator.

## Tech Stack

- **Next.js 14** (React, App Router)
- **TypeScript**
- **Tailwind CSS** for styling
- **Prisma + PostgreSQL** for persistence (bring your own Postgres – works great with Vercel Postgres)

## Getting Started Locally

```bash
pnpm install # or npm install / yarn

# Push Prisma schema to database (requires DATABASE_URL)
pnpm prisma:migrate

pnpm dev
```

Create `.env` from `.env.example` and set `DATABASE_URL`.

## Deploying to Vercel

1. Push code to GitHub on branch **`mvp-initial-vercel`**
2. In Vercel, “Import Project” → select GitHub repo.
3. Add environment variable `DATABASE_URL` pointing to Vercel Postgres or your own Postgres.
4. Framework preset: **Next.js** (defaults are fine). Build command is `next build`. Output dir handled automatically.
5. Click **Deploy** – the app should build without further config.

## Roadmap (post-MVP)

- Persist month data per logged-in user (Firebase Auth)
- Multi-month bulk edits (“Apply to selected months”)
- Plaid balance syncing
- Mobile UX polish & dark mode