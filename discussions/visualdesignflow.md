# Visual Design Flow (Static Screens)

This document translates the roadmap into a concrete set of static screens, route connections, and page sections for a cohesive MVP experience.

## 1) Experience Goal

Create a complete **browseable finance dashboard flow** with static screens first, then wire in data/actions.

Success criteria for this phase:
- Every sidebar item routes to a real page.
- Primary actions (Add, Edit, View details) navigate to a real screen.
- Every screen has clear sections and reusable UI blocks.

## 2) Recommended Route Map (App Router)

Use these routes as the initial static IA (information architecture):

- `/` → redirect to `/dashboard`
- `/dashboard`
- `/transactions`
- `/transactions/new`
- `/transactions/[id]` (detail view; static sample first)
- `/transactions/[id]/edit`
- `/categories`
- `/goals`
- `/goals/new`
- `/goals/[id]`
- `/reports`
- `/reports/monthly`

Optional (later):
- `/settings`

## 3) Global Layout + Navigation Structure

## Shared Layout Shell
All screens should share one shell:
- **Sidebar**: primary navigation links
- **Top header**: page title + subtitle + context actions
- **Main content region**: page-specific sections

## Sidebar Navigation Groups

### Core
- Dashboard (`/dashboard`)
- Transactions (`/transactions`)
- Categories (`/categories`)
- Savings Goals (`/goals`)
- Reports (`/reports`)

### Secondary (optional now)
- Settings (`/settings`)

## Header Pattern
For consistency across screens:
- Left: `Page title` + short descriptor
- Right: 1–2 primary actions max (example: `+ Add Transaction`)

## 4) Screen-by-Screen Plan (Sections + Components)

## A. Dashboard (`/dashboard`)
Purpose: high-level financial snapshot.

Sections:
1. **Stat Row**
   - Components: `StatCard` x3–4 (Income, Expenses, Net, Goal Progress)
2. **Quick Actions**
   - Components: action buttons (`Add Transaction`, `Create Goal`)
3. **Recent Transactions**
   - Components: transaction list/table preview (top 5)
4. **Goals Progress Preview**
   - Components: compact goal progress cards (top 2–3)

Connections:
- `View all transactions` → `/transactions`
- `Add Transaction` → `/transactions/new`
- `View all goals` → `/goals`
- `Create Goal` → `/goals/new`

---

## B. Transactions List (`/transactions`)
Purpose: full transaction management hub.

Sections:
1. **Filter/Search Bar**
   - Components: search input, type filter, category filter, date range
2. **Transaction Table/List**
   - Components: rows with date, category, type, amount, actions
3. **Summary Strip**
   - Components: totals for selected range (income/expense/net)

Connections:
- `+ Add Transaction` → `/transactions/new`
- Row click or `View` → `/transactions/[id]`
- `Edit` action → `/transactions/[id]/edit`
- Breadcrumb back to Dashboard → `/dashboard`

---

## C. New Transaction (`/transactions/new`)
Purpose: static form layout for creation flow.

Sections:
1. **Transaction Form Card**
   - Components: type toggle, amount, date, category select, notes
2. **Form Actions**
   - Components: `Save`, `Cancel`

Connections:
- `Save` (static phase: navigate) → `/transactions`
- `Cancel` → `/transactions`

---

## D. Transaction Detail (`/transactions/[id]`)
Purpose: inspect one transaction and branch to edit.

Sections:
1. **Detail Summary Card**
   - Components: amount, type, category, date, notes
2. **Metadata / Audit Row**
   - Components: created/updated placeholders
3. **Actions**
   - Components: `Edit`, `Delete` (Delete can be disabled/static)

Connections:
- `Edit` → `/transactions/[id]/edit`
- `Back to transactions` → `/transactions`

---

## E. Edit Transaction (`/transactions/[id]/edit`)
Purpose: mirror new-transaction layout for consistency.

Sections:
1. **Pre-filled Transaction Form**
2. **Form Actions**

Connections:
- `Save` (static phase: navigate) → `/transactions/[id]`
- `Cancel` → `/transactions/[id]`

---

## F. Categories (`/categories`)
Purpose: manage spend/income organization model.

Sections:
1. **Category Groups**
   - Components: grouped cards/list (`Income`, `Expense`)
2. **Category Table/List**
   - Components: name, type, usage count, actions
3. **Add Category Panel (inline or modal placeholder)**

Connections:
- `Create Category` can stay inline on this screen
- Category usage click → `/transactions?category={name}` (later dynamic)

---

## G. Goals List (`/goals`)
Purpose: track savings goals status.

Sections:
1. **Goals Summary Strip**
   - Components: total goals, on-track, achieved
2. **Goals Grid/List**
   - Components: `GoalCard` with progress bar and target date

Connections:
- `+ New Goal` → `/goals/new`
- Goal card click → `/goals/[id]`

---

## H. New Goal (`/goals/new`)
Purpose: static goal creation form.

Sections:
1. **Goal Form Card**
   - Components: goal name, target amount, current amount, target date
2. **Form Actions**

Connections:
- `Save` (static phase: navigate) → `/goals`
- `Cancel` → `/goals`

---

## I. Goal Detail (`/goals/[id]`)
Purpose: inspect one goal and progress state.

Sections:
1. **Goal Header**
   - Components: title, status badge, progress percentage
2. **Progress Visualization**
   - Components: large progress bar + amount summary
3. **Contribution History (static placeholder list)**
4. **Actions**
   - Components: `Update Progress`, `Edit Goal`

Connections:
- `Back to goals` → `/goals`
- `Update Progress` (later) can open inline form or route to edit

---

## J. Reports Landing (`/reports`)
Purpose: analytics entry point.

Sections:
1. **Report Type Cards**
   - Components: Monthly Summary, Spending Breakdown, Trends
2. **KPI Snapshot**
   - Components: high-level metric cards
3. **Chart Placeholder Row**
   - Components: 2 chart cards with static mock visuals

Connections:
- `Monthly Summary` card → `/reports/monthly`
- `Back to dashboard` → `/dashboard`

---

## K. Monthly Report (`/reports/monthly`)
Purpose: month-level summary page.

Sections:
1. **Month Selector Header**
2. **Monthly Stat Cards**
3. **Category Breakdown Section**
4. **Month-over-Month Comparison Section**

Connections:
- Month navigation previous/next (static for now)
- Breadcrumb to Reports → `/reports`

## 5) Reusable UI Components to Create Early

Start with these shared building blocks so static screens stay consistent:

- `AppShell` (sidebar + topbar layout)
- `SidebarNav`
- `PageHeader`
- `StatCard`
- `SectionCard`
- `TransactionTable` (accept mock data)
- `GoalCard`
- `EmptyState`
- `FilterBar`

## 6) Connection Flow (User Journey)

Primary journey for MVP:
1. Dashboard → Transactions List
2. Transactions List → New Transaction
3. New Transaction → Transactions List
4. Transactions List → Transaction Detail → Edit Transaction
5. Dashboard → Goals List → Goal Detail
6. Dashboard/Sidebar → Reports → Monthly Report

If all these transitions work with static pages, the UX foundation is complete before API wiring.

## 7) Suggested Build Sequence (Static First)

1. Build shared shell (`AppShell`, `SidebarNav`, `PageHeader`)
2. Create top-level pages: `/dashboard`, `/transactions`, `/categories`, `/goals`, `/reports`
3. Add secondary CRUD/detail pages: `/transactions/new`, `/transactions/[id]`, `/transactions/[id]/edit`, `/goals/new`, `/goals/[id]`, `/reports/monthly`
4. Add route links/buttons so every key CTA navigates somewhere
5. Replace duplicated page sections with reusable components

## 8) Done Definition for This Phase

You can consider "layout + navigation complete" when:
- All sidebar links are functional and route to real static pages.
- Every primary CTA routes to the expected next screen.
- Page headers, spacing, and cards are visually consistent.
- No screen is a dead end (every page has a clear back/next action).