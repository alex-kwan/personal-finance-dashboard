# Client-Side Architecture Summary

## 1) High-level architecture (what this app is)

This application is a **Next.js App Router** finance dashboard that uses:

- **Server Components by default** for page rendering and data loading
- **Client Components** only for interactive UI (forms, delete buttons, optimistic-ish UX states)
- **Route Handlers** under `src/app/api/*` for mutation/query HTTP endpoints
- **Domain/data modules** under `src/lib/*` as the shared business + persistence layer
- **Prisma** (`src/lib/prisma.ts`) to talk to the database

Conceptually, it is layered like this:

1. **Route/Page layer** (`src/app/**/page.tsx`) decides screen composition.
2. **UI component layer** (`src/app/_components/*`) renders visual blocks.
3. **Domain/data layer** (`src/lib/*`) performs all data operations and business rules.
4. **Persistence layer** (`prisma/*`, `src/lib/prisma.ts`) executes DB queries.

## 2) How this maps to the file structure

### `src/app`

- `layout.tsx` is the root HTML/body wrapper and global CSS entrypoint.
- `page.tsx` redirects `/` to `/dashboard`.
- Feature routes (`dashboard`, `transactions`, `categories`, `goals`, `reports`) each define page-level server components.
- Nested routes (for example `transactions/[id]`, `transactions/new`, `goals/[id]`, `reports/monthly`) provide detail/create/edit flows.
- `loading.tsx` files provide route-level loading skeletons.

### `src/app/_components`

- `app-shell.tsx` is the shared screen chrome (sidebar, header, main content area).
- Feature cards/tables/strips render presentational sections.
- Interactive components marked with `"use client"` (for example transaction/goal/category forms) handle browser events, local form state, and API calls.

### `src/app/api`

- Resource endpoints:
	- `api/transactions` (+ `[id]`)
	- `api/categories` (+ `[id]`)
	- `api/goals` (+ `[id]`)
- These route handlers validate input and call `src/lib/*` functions.

### `src/lib`

- `current-user.ts`: resolves the effective user (`demo@example.com` seeded user).
- `dashboard.ts`, `transactions.ts`, `categories.ts`, `goals.ts`, `reports.ts`: domain read/write logic.
- `api-validation.ts`, `form-validation.ts`: API-side and client-side validation helpers.
- `domain-types.ts`: shared API/domain response and entity types.
- `prisma.ts`: singleton Prisma client.

### Other important directories

- `prisma/schema.prisma` + `prisma/seed.ts`: data model and sample data.
- `src/generated/prisma/*`: generated Prisma client artifacts.
- `scripts/*`: validation scripts used as project guardrails.

## 3) How files connect to render a screen

## A. Initial navigation/render path

When a user opens the app:

1. Request hits `src/app/layout.tsx` (root layout).
2. `src/app/page.tsx` redirects to `/dashboard`.
3. `src/app/dashboard/page.tsx` (server component) runs on server:
	 - calls `getCurrentUserId()` from `src/lib/current-user.ts`
	 - calls `getDashboardSnapshotForUser()` from `src/lib/dashboard.ts`
4. `src/lib/dashboard.ts` queries via Prisma + other lib functions.
5. Page maps data into props for presentational components.
6. Page renders `AppShell` + child UI cards; HTML is streamed/hydrated to browser.

The same shape is used by other routes:

- **Page server component** fetches domain data from `src/lib/*`
- **Page composes** reusable components from `src/app/_components/*`
- **UI renders** inside `AppShell`

## B. Loading states while server work runs

If a route has `loading.tsx` (e.g., dashboard/transactions/categories), Next.js can show that fallback while the server component is still fetching data. These loading files use `ScreenLoadingState`, which itself renders inside `AppShell` so layout remains stable.

## C. Mutation/update path (create/edit/delete)

For interactive changes (forms/buttons):

1. A client component (e.g., `transaction-upsert-form.tsx`) handles input + local validation.
2. It calls `fetch()` to `/api/...` route handlers.
3. Route handler validates input (`src/lib/api-validation.ts`) and calls domain function in `src/lib/*`.
4. Domain function performs Prisma writes and enforces business rules.
5. Client component handles response, then triggers navigation and/or `router.refresh()`.
6. `router.refresh()` causes affected server components to re-run and re-fetch fresh data.
7. Updated server-rendered UI is sent back and painted in place.

This is the key pattern that keeps logic centralized:

- **Client components**: interaction + submission UX
- **API routes**: request parsing/validation boundary
- **Lib modules**: actual domain/persistence logic
- **Server pages**: authoritative read/render pass

## 4) Practical feature-by-feature connection map

- **Dashboard**: `dashboard/page.tsx` → `lib/dashboard.ts` + transaction/goal libs → cards in `_components`.
- **Transactions list/detail/edit/new**:
	- Reads: pages call `lib/transactions.ts` (and categories where needed).
	- Writes: `transaction-upsert-form` / `transaction-delete-button` → `api/transactions` routes → `lib/transactions.ts`.
- **Categories**:
	- Read: `categories/page.tsx` → `lib/categories.ts`
	- Create/update: `add-category-panel` (create currently used) → `api/categories` routes → `lib/categories.ts`.
- **Goals**:
	- Read: `goals/page.tsx`, `goals/[id]/page.tsx` → `lib/goals.ts`
	- Write: `create-goal-form`, `update-goal-progress-form` → `api/goals` routes → `lib/goals.ts`.
- **Reports**:
	- Read-only server-rendered snapshots via `lib/reports.ts` in `reports/page.tsx` and `reports/monthly/page.tsx`.

## 5) Mental model in one sentence

Think of this app as **server-rendered feature pages that read from `lib/*`, plus small client-side islands that mutate through `api/*` and then refresh server-rendered state**.
