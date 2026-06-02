# UpTrack (WorkPulse)

Employee productivity tracking platform built with Next.js 16, React 19, Redux
Toolkit, and an **Appwrite** backend (authentication + database).

## Features

- Email/password authentication via Appwrite Auth (passwords hashed by Appwrite)
- Role-based dashboards: Root Admin, Admin, Employee
- Daily progress reports with task tagging, projects, and time tracking
- Contribution heatmaps and performance charts derived from real task data
- Employee onboarding and deactivation through a privileged server API
- Weekly AI review reports and company-wide summaries

## Architecture

| Concern | Where |
| --- | --- |
| Browser SDK (session + user-scoped reads/writes) | `lib/appwrite/client.ts` |
| Server SDK (admin API key, never sent to client) | `lib/appwrite/server.ts` |
| Collection/database ids | `lib/appwrite/config.ts` |
| Data-access functions + mappers | `lib/appwrite/api.ts` |
| Privileged admin endpoints | `app/api/users/*` |
| Redux state (hydrated from Appwrite) | `store/slices/*` |

Privileged operations (creating users, deactivating accounts) run **server-side**
in route handlers. The browser attaches a short-lived Appwrite JWT; the server
verifies the caller's identity and role before using the admin API key. The API
key lives only in `APPWRITE_API_KEY` and is never exposed to the client.

## Setup

### 1. Configure environment

Copy `.env.example` to `.env.local` and fill in the values from your Appwrite
Cloud project (Project ID and a server API key).

```bash
cp .env.example .env.local
```

The API key needs these scopes: `users.read`, `users.write`, `databases.read`,
`databases.write`, `collections.read`, `collections.write`, `attributes.read`,
`attributes.write`, `indexes.read`, `indexes.write`, `documents.read`,
`documents.write`.

> `.env.local` is gitignored — never commit it.

### 2. Provision the database schema

Creates the database, collections, attributes, and indexes. Idempotent.

```bash
npm run appwrite:setup
```

### 3. Seed demo data (optional)

Creates demo auth users + profiles, projects, generated tasks/reports, and AI
reports. All demo accounts share the password from `SEED_DEFAULT_PASSWORD`.

```bash
npm run appwrite:seed
```

Demo logins after seeding (password = `SEED_DEFAULT_PASSWORD`):

- Root admin: `ceo@workpulse.dev`
- Admin: `priya@workpulse.dev`
- Employee: `vikram@workpulse.dev`

### 4. Run the app

```bash
npm run dev
```

## Notes

- Install uses legacy peer deps because of a pre-existing `date-fns` /
  `react-day-picker` peer conflict: `npm install --legacy-peer-deps`.
- The demo UI pins "today" to **2026-02-10** in the daily report form; the seed
  script generates history up to that date (configurable via `SEED_START`).
- Collection permissions allow any authenticated user to read profiles/tasks
  (so managers can view their teams). Tighten these for a production deployment.
