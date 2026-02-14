# Testing Architecture

## Goals

- Catch regressions early with fast tests.
- Validate business and persistence behavior with integration tests.
- Verify real user flows with end-to-end tests.
- Keep CI reliable and reasonably fast.

---

## 1) Test Layers

### A. Unit Tests (fastest, most isolated)

**What to test**
- Pure utility functions in `src/lib/*` (no DB, no network).
- Validation helpers (e.g., `parsePositiveNumberInput`, `validateRequiredText`).
- Data mapping/formatting logic.

**Good fit in this repo**
- `src/lib/form-validation.ts`
- formatting/mapping helpers in `src/lib/*` that do not use Prisma.

**Why**
- Fast feedback.
- Deterministic.
- Easy to run on every push/PR.

---

### B. Component Tests (UI behavior in isolation)

**What to test**
- Client components in `src/app/_components/*`:
	- input behavior
	- form validation UX
	- button states (disabled/loading/error)
	- callback/fetch invocation behavior (mocked)

**Good fit in this repo**
- `transaction-upsert-form.tsx`
- other interactive form/button/filter components.

**Why**
- Verifies UI logic without full browser E2E cost.
- Catches form and interaction regressions quickly.

---

### C. Integration Tests (server boundary + persistence)

**What to test**
1. **Lib + DB integration**
	 - Functions in `src/lib/*` that use Prisma and SQLite.
	 - Verify CRUD behavior, filters, totals, edge cases, and error handling.

2. **API route integration** (`src/app/api/*`)
	 - Request parsing + validation.
	 - Correct status codes (`200/201/400/404/500`).
	 - Response shape.
	 - Side effects in DB through lib calls.

**Why**
- Confirms server-side behavior and contracts.
- Ensures route handlers + lib + Prisma work together correctly.

---

### D. End-to-End Tests (highest confidence, slower)

**What to test**
- Core user journeys across pages:
	- navigate to dashboard/transactions/categories/goals/reports
	- create/edit/delete transaction
	- verify persisted updates appear in UI
	- error and loading states where applicable

**Why**
- Validates the app as users experience it in a real browser.

---

## 2) Coverage Matrix (What is tested where)

| Area | Unit | Component | Integration | E2E |
|---|---:|---:|---:|---:|
| `src/lib/form-validation.ts` | ✅ | - | - | - |
| Pure helpers in `src/lib/*` | ✅ | - | - | - |
| Prisma-backed lib modules (`dashboard`, `transactions`, etc.) | - | - | ✅ | ✅ (indirect) |
| API routes in `src/app/api/*` | - | - | ✅ | ✅ (indirect) |
| Client components in `src/app/_components/*` | - | ✅ | - | ✅ (indirect) |
| Page routes in `src/app/**/page.tsx` | - | - | - | ✅ |

---

## 3) CI Strategy

Run tests in CI in this order:

1. **Typecheck + lint**
2. **Unit + component tests**
3. **Integration tests** (test DB)
4. **E2E smoke tests** (critical flows only on PR; fuller suite on main/nightly)

### Recommended CI gates

- **On every PR**
	- lint
	- typecheck
	- unit/component
	- integration
	- small E2E smoke suite

- **On merge to `main` / nightly**
	- full E2E suite
	- optional coverage report

---

## 4) Test Data + Environment

- Use a dedicated **test SQLite database**.
- Reset DB between suites (or transaction rollback pattern).
- Seed minimal deterministic fixtures.
- Do not use production data/secrets in tests.

---

## 5) Suggested Commands

```bash
npm run lint
npm run typecheck
npm run test            # unit + component
npm run test:integration
npm run test:e2e
```

If scripts do not exist yet, add them to `package.json` and wire to your chosen tools (e.g., Vitest + React Testing Library + Playwright).

---

## 6) Practical First Milestone

1. Add unit tests for `src/lib/form-validation.ts`.
2. Add component tests for `transaction-upsert-form.tsx`.
3. Add integration tests for one API route (transactions create + validation errors).
4. Add one E2E flow: create transaction and verify it appears in transactions list and dashboard totals.
5. Expand route-by-route after baseline stability.

---

## 7) Suggested Testing Libraries

### Core

- **Vitest**: fast test runner for unit + integration tests.
- **@testing-library/react**: component behavior tests through user interactions.
- **@testing-library/user-event**: realistic typing/clicking for forms.
- **@testing-library/jest-dom**: expressive DOM assertions.
- **Playwright**: end-to-end browser tests.

### Optional but useful

- **MSW (Mock Service Worker)**: mock network calls in component tests.
- **supertest**: convenient request assertions for HTTP-style tests.
- **@vitest/coverage-v8**: code coverage in CI.

### Typical setup in this repo

- Unit/component tests under `src/**/*.test.ts(x)` with Vitest.
- Integration tests under `tests/integration/**` using a test SQLite DB.
- E2E tests under `tests/e2e/**` with Playwright.

---

## 8) Example Tests by Layer

### A. Unit test example (`src/lib/form-validation.ts`)

```ts
import { describe, expect, it } from "vitest";
import { parsePositiveNumberInput } from "@/lib/form-validation";

describe("parsePositiveNumberInput", () => {
	it("returns parsed number for valid input", () => {
		expect(parsePositiveNumberInput("12.5", "Amount")).toEqual({ value: 12.5, error: null });
	});

	it("returns validation error for invalid input", () => {
		expect(parsePositiveNumberInput("0", "Amount")).toEqual({
			value: null,
			error: "Amount must be greater than 0.",
		});
	});
});
```

### B. Component test example (`transaction-upsert-form.tsx`)

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TransactionUpsertForm } from "@/app/_components/transaction-upsert-form";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("TransactionUpsertForm", () => {
	it("shows validation error when amount is invalid", async () => {
		render(
			<TransactionUpsertForm
				mode="create"
				categories={[{ id: "cat-1", name: "Salary", type: "INCOME" as const }]}
			/>,
		);

		await userEvent.type(screen.getByLabelText(/Description/i), "Paycheck");
		await userEvent.type(screen.getByLabelText(/Amount/i), "0");
		await userEvent.click(screen.getByRole("button", { name: /Save Transaction/i }));

		expect(await screen.findByText("Amount must be greater than 0.")).toBeInTheDocument();
	});
});
```

### C. Integration test example (API route + DB)

```ts
import { describe, expect, it } from "vitest";

describe("POST /api/transactions", () => {
	it("returns 400 for invalid amount", async () => {
		const response = await fetch("http://localhost:3000/api/transactions", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				description: "Invalid",
				amount: 0,
				type: "EXPENSE",
				categoryId: "cat-id",
			}),
		});

		expect(response.status).toBe(400);
		const payload = await response.json();
		expect(payload.error).toContain("Amount");
	});
});
```

### D. E2E test example (Playwright)

```ts
import { test, expect } from "@playwright/test";

test("create transaction flow", async ({ page }) => {
	await page.goto("/transactions/new");
	await page.getByLabel("Description").fill("Groceries");
	await page.getByLabel("Amount").fill("45.99");
	await page.getByLabel("Type").selectOption("EXPENSE");
	await page.getByLabel("Category").selectOption({ index: 1 });
	await page.getByRole("button", { name: "Save Transaction" }).click();

	await expect(page).toHaveURL(/\/transactions$/);
	await expect(page.getByText("Groceries")).toBeVisible();
});
```

### E. What to assert for each area

- **Lib functions**: return values, thrown errors, edge cases.
- **API routes**: status codes, response JSON contract, DB side effects.
- **Components**: validation messages, loading/disabled state, submission behavior.
- **Pages (E2E)**: navigation, data visibility, persisted updates, error/loading UX.

---

## 9) CI Workflow YAML Sketch (GitHub Actions)

```yaml
name: CI

on:
	pull_request:
	push:
		branches: [main]

jobs:
	verify:
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v4
			- uses: actions/setup-node@v4
				with:
					node-version: 20
					cache: npm

			- name: Install dependencies
				run: npm ci

			- name: Typecheck
				run: npm run typecheck --if-present

			- name: Lint
				run: npm run lint --if-present

			- name: Unit + Component
				run: npm run test --if-present

			- name: Integration
				env:
					DATABASE_URL: file:./ci-test.db
				run: |
					npm run db:push --if-present
					npm run test:integration --if-present

	e2e-smoke:
		runs-on: ubuntu-latest
		if: github.event_name == 'pull_request'
		steps:
			- uses: actions/checkout@v4
			- uses: actions/setup-node@v4
				with:
					node-version: 20
					cache: npm
			- run: npm ci
			- run: npx playwright install --with-deps
			- run: npm run build
			- run: npm run test:e2e -- --grep @smoke

	e2e-full:
		runs-on: ubuntu-latest
		if: github.ref == 'refs/heads/main'
		steps:
			- uses: actions/checkout@v4
			- uses: actions/setup-node@v4
				with:
					node-version: 20
					cache: npm
			- run: npm ci
			- run: npx playwright install --with-deps
			- run: npm run build
			- run: npm run test:e2e
```

Notes:
- Keep `@smoke` tags on a minimal set of stable PR E2E tests.
- Run full E2E only on `main` (or nightly) to keep PR feedback fast.
- Use `--if-present` while scripts are being phased in.
