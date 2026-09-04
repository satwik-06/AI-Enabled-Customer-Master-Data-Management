# MDM Platform — Frontend

Enterprise console for the AI-Enabled Customer Master Data Management platform. Built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on `/login`.

## Demo accounts (mock auth, Phase 1)

| Role | Email | Password |
| --- | --- | --- |
| Sales / Account Manager | `sales@micron.com` | `sales123` |
| Data Steward / Admin | `steward@micron.com` | `steward123` |

There is no public sign-up. Auth state is a client-side mock (`src/lib/auth.tsx`) persisted to `localStorage` — swap it for real Supabase auth in Phase 2 without touching page components.

## Routes

- `/login` — secure enterprise login portal.
- `/search` — Customer 360 search: Golden Record card + collapsible source lineage panel. Available to all authenticated roles, read-only.
- `/stewardship` — exception review queue, side-by-side field comparison, AI insight box, Approve Merge / Override actions. **Steward-only**, both route-guarded (redirects non-stewards to `/search`) and hidden from the nav for other roles.
- `/operations` — data quality summary cards, per-source exception breakdown, pipeline activity log.

## Project structure

```
src/
  app/            route segments (login, search, stewardship, operations)
  components/     AppShell (sidebar/nav), ProtectedRoute (role guard), Badge
  lib/
    auth.tsx      mock AuthProvider / useAuth hook
    types.ts      shared domain types (mirrors intended backend schema)
    mockData.ts   hardcoded Golden Records, exceptions, DQ metrics, logs
```

## Integration plan (Phase 3)

All screens currently read from `src/lib/mockData.ts`. To wire up the real backend:

1. Replace `mockData.ts` reads with data-fetching hooks (e.g. Supabase client / REST calls) that return the same shapes defined in `src/lib/types.ts`.
2. Replace `src/lib/auth.tsx`'s `TEST_ACCOUNTS` login with real Supabase Auth (email/password or SSO), keeping the same `AuthUser` / `useAuth()` contract so `ProtectedRoute` and `AppShell` need no changes.
3. Wire the Stewardship `Approve Merge` / `Override / Edit` actions to their respective mutation endpoints instead of local component state.
