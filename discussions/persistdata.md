# Prisma Data Persistence Plan (Prioritized)

Goal: move from static screen data to Prisma-backed read/edit flows in small, testable increments, while validating each screen as we go.

## Assumptions

- Database: SQLite (via Prisma)
- Seeded demo user exists: `demo@example.com`
- Current phase: single-user MVP (use one resolved `userId` server-side)
- UI routes are already scaffolded and statically built

## 1) Data Contract First (Foundation)

### Step 1.1 — Define shared domain types for UI + API payloads
Create TypeScript interfaces for:
- Transaction list/detail/create/update payloads
- Category list/create/update payloads
- Savings goal list/detail/create/update payloads
- Dashboard/report aggregate response shapes

Why first:
- Prevents drift between Prisma objects and screen component props.

Validation checkpoint:
- All page components compile against typed mock objects matching new interfaces.

---

### Step 1.2 — Add Prisma access layer in `src/lib`
Create focused query modules:
- `transactions.ts`
- `categories.ts`
- `goals.ts`
- `dashboard.ts`
- `reports.ts`

Each module should expose read/write functions with narrow signatures, e.g.:
- `listTransactionsForUser(...)`
- `getTransactionById(...)`
- `createTransaction(...)`
- `updateTransaction(...)`
- `deleteTransaction(...)`

Why first:
- Keeps route handlers thin and makes UI/server changes safer.

Validation checkpoint:
- Minimal script or route test confirms each module function returns expected shape for seeded data.

## 2) Categories First (Dependency for Transactions)

### Step 2.1 — Implement categories read APIs
Routes:
- `GET /api/categories` (list by user)

### Step 2.2 — Implement category create/update APIs
Routes:
- `POST /api/categories`
- `PUT /api/categories/[id]`

### Step 2.3 — Wire `/categories` screen
- Replace static arrays with data from API/server query.
- Keep add-category panel posting to API.

Validation checkpoint:
- `/categories` loads seeded categories.
- Creating category persists and appears after refresh.
- Duplicate category + type for same user returns clean validation error.

## 3) Transactions Core CRUD (Highest Product Value)

### Step 3.1 — Implement transaction read APIs
Routes:
- `GET /api/transactions` (filters: type, category, date range, search)
- `GET /api/transactions/[id]`

### Step 3.2 — Implement transaction write APIs
Routes:
- `POST /api/transactions`
- `PUT /api/transactions/[id]`
- `DELETE /api/transactions/[id]`

### Step 3.3 — Wire transactions screens
Pages:
- `/transactions` list + filters + summary strip
- `/transactions/new` create form submit
- `/transactions/[id]` detail from DB
- `/transactions/[id]/edit` prefill + save updates

Validation checkpoint:
- Create transaction from UI and see it in list + detail.
- Edit updates persist and show after reload.
- Delete removes item and summary totals update.
- Filter/search query params return expected subset.

## 4) Goals CRUD + Progress State

### Step 4.1 — Implement goals read/write APIs
Routes:
- `GET /api/goals`
- `GET /api/goals/[id]`
- `POST /api/goals`
- `PUT /api/goals/[id]`
- `DELETE /api/goals/[id]` (optional soft-delete behavior can be added later)

### Step 4.2 — Wire goals screens
Pages:
- `/goals`
- `/goals/new`
- `/goals/[id]`

Validation checkpoint:
- New goal appears in goals list.
- Editing `currentAmount` updates progress percent on detail/list.
- Status transitions (`IN_PROGRESS`, `COMPLETED`, `PAUSED`) are reflected in UI badges.

## 5) Dashboard Read Integration

### Step 5.1 — Build dashboard aggregate query
Use Prisma aggregate/grouping to provide:
- current month income total
- current month expense total
- net savings
- recent transactions
- top goal progress preview

### Step 5.2 — Wire `/dashboard`
- Replace static cards/lists with server-fetched data.

Validation checkpoint:
- Dashboard values match transaction/goal source screens.
- Adding/editing transaction or goal changes dashboard after refresh.

## 6) Reports Read Integration

### Step 6.1 — Build report query functions
- monthly totals
- category breakdown
- month-over-month comparison

### Step 6.2 — Wire `/reports` and `/reports/monthly`
- Replace KPI/chart placeholder values with DB-backed numbers.

Validation checkpoint:
- Monthly totals equal filtered transactions for selected month.
- Category percentages sum to ~100% (within rounding tolerance).

## 7) Validation + Guardrails (Run Throughout)

## API Validation Rules
- Validate required fields and enums (`TransactionType`, `GoalStatus`).
- Ensure relation integrity (`categoryId` exists and belongs to user).
- Reject negative/invalid amounts where not allowed.

## UI Validation Rules
- Required form fields
- Numeric input constraints
- Friendly error toasts/messages from API responses

## Step-by-step verification routine (for each completed feature)
1. Happy path create
2. Happy path edit
3. Invalid input path
4. Refresh and verify persistence
5. Verify related screens reflect change (cross-screen consistency)

## 8) Suggested Build Order (Execution Sequence)

1. Shared types + Prisma access layer
2. Categories API + categories screen
3. Transactions API + transaction screens
4. Goals API + goals screens
5. Dashboard aggregates + dashboard screen
6. Reports aggregates + reports screens
7. Final pass: validation UX + error states + loading states

## 9) Done Definition for Persistence Phase

Persistence integration is complete when:
- All create/edit screens write to Prisma via API routes.
- All list/detail/dashboard/report screens read from Prisma.
- Screen data remains consistent after full page refresh.
- Validation errors are shown clearly and do not crash navigation.
- Core flows pass manual QA: categories, transactions, goals, dashboard, reports.

## 10) Immediate Next Task (Start Here)

Start with **Categories API + screen wiring** because categories are required for clean transaction creation/editing.
