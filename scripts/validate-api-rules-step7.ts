import { TransactionType } from "@prisma/client";
import { GET as getCategories, POST as postCategory } from "../src/app/api/categories/route";
import { GET as getGoals, POST as postGoal } from "../src/app/api/goals/route";
import { PUT as putGoal } from "../src/app/api/goals/[id]/route";
import { GET as getTransactions, POST as postTransaction } from "../src/app/api/transactions/route";
import { PUT as putTransaction } from "../src/app/api/transactions/[id]/route";
import { prisma } from "../src/lib/prisma";

type Assertion = {
  name: string;
  passed: boolean;
  detail?: string;
};

async function expectStatus(
  name: string,
  invoke: () => Promise<Response>,
  expectedStatus: number,
): Promise<Assertion> {
  const response = await invoke();
  const payload = (await response.json()) as { error?: string; details?: string };

  if (response.status !== expectedStatus) {
    return {
      name,
      passed: false,
      detail: `expected ${expectedStatus}, received ${response.status} (${payload.error ?? "no error message"})`,
    };
  }

  return {
    name,
    passed: true,
    detail: payload.error,
  };
}

function request(url: string, init?: RequestInit): Request {
  return new Request(url, {
    headers: {
      "content-type": "application/json",
    },
    ...init,
  });
}

async function main() {
  const demoUser = await prisma.user.findUnique({
    where: {
      email: "demo@example.com",
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!demoUser) {
    throw new Error("Demo user not found. Run `npm run db:seed` first.");
  }

  const incomeCategory = await prisma.category.findFirst({
    where: {
      userId: demoUser.id,
      type: TransactionType.INCOME,
    },
    select: {
      id: true,
      type: true,
    },
  });

  const expenseCategory = await prisma.category.findFirst({
    where: {
      userId: demoUser.id,
      type: TransactionType.EXPENSE,
    },
    select: {
      id: true,
      type: true,
    },
  });

  if (!incomeCategory || !expenseCategory) {
    throw new Error("Required demo categories not found for relation integrity checks.");
  }

  const assertions: Assertion[] = [];

  assertions.push(
    await expectStatus(
      "categories GET rejects invalid type",
      () => getCategories(request("http://localhost/api/categories?type=INVALID")),
      400,
    ),
  );

  assertions.push(
    await expectStatus(
      "categories POST requires non-empty name",
      () =>
        postCategory(
          request("http://localhost/api/categories", {
            method: "POST",
            body: JSON.stringify({
              name: " ",
              type: TransactionType.INCOME,
            }),
          }),
        ),
      400,
    ),
  );

  assertions.push(
    await expectStatus(
      "categories POST requires valid enum type",
      () =>
        postCategory(
          request("http://localhost/api/categories", {
            method: "POST",
            body: JSON.stringify({
              name: "Bad Type Category",
              type: "INVALID",
            }),
          }),
        ),
      400,
    ),
  );

  assertions.push(
    await expectStatus(
      "goals GET rejects invalid status filter",
      () => getGoals(request("http://localhost/api/goals?status=INVALID")),
      400,
    ),
  );

  assertions.push(
    await expectStatus(
      "goals POST rejects negative currentAmount",
      () =>
        postGoal(
          request("http://localhost/api/goals", {
            method: "POST",
            body: JSON.stringify({
              name: "Invalid Goal",
              targetAmount: 1000,
              currentAmount: -10,
            }),
          }),
        ),
      400,
    ),
  );

  assertions.push(
    await expectStatus(
      "goals PUT rejects invalid deadline date",
      () =>
        putGoal(
          request("http://localhost/api/goals/goal-id", {
            method: "PUT",
            body: JSON.stringify({
              deadline: "not-a-date",
            }),
          }),
          { params: Promise.resolve({ id: "goal-id" }) },
        ),
      400,
    ),
  );

  assertions.push(
    await expectStatus(
      "transactions GET rejects invalid type filter",
      () => getTransactions(request("http://localhost/api/transactions?type=INVALID")),
      400,
    ),
  );

  assertions.push(
    await expectStatus(
      "transactions POST requires positive amount",
      () =>
        postTransaction(
          request("http://localhost/api/transactions", {
            method: "POST",
            body: JSON.stringify({
              description: "Invalid Amount",
              amount: 0,
              type: TransactionType.INCOME,
              categoryId: incomeCategory.id,
            }),
          }),
        ),
      400,
    ),
  );

  assertions.push(
    await expectStatus(
      "transactions POST rejects missing categoryId",
      () =>
        postTransaction(
          request("http://localhost/api/transactions", {
            method: "POST",
            body: JSON.stringify({
              description: "No Category",
              amount: 42,
              type: TransactionType.INCOME,
            }),
          }),
        ),
      400,
    ),
  );

  assertions.push(
    await expectStatus(
      "transactions POST rejects non-owned/missing category",
      () =>
        postTransaction(
          request("http://localhost/api/transactions", {
            method: "POST",
            body: JSON.stringify({
              description: "Bad Category",
              amount: 42,
              type: TransactionType.INCOME,
              categoryId: "missing-category-id",
            }),
          }),
        ),
      400,
    ),
  );

  assertions.push(
    await expectStatus(
      "transactions POST rejects category/type mismatch",
      () =>
        postTransaction(
          request("http://localhost/api/transactions", {
            method: "POST",
            body: JSON.stringify({
              description: "Type Mismatch",
              amount: 50,
              type: TransactionType.INCOME,
              categoryId: expenseCategory.id,
            }),
          }),
        ),
      400,
    ),
  );

  assertions.push(
    await expectStatus(
      "transactions PUT rejects invalid date",
      () =>
        putTransaction(
          request("http://localhost/api/transactions/tx-id", {
            method: "PUT",
            body: JSON.stringify({
              date: "not-a-date",
            }),
          }),
          { params: Promise.resolve({ id: "tx-id" }) },
        ),
      400,
    ),
  );

  const failures = assertions.filter((result) => !result.passed);

  if (failures.length > 0) {
    console.error("❌ Step 7 API validation checks failed");
    for (const failure of failures) {
      console.error(`- ${failure.name}: ${failure.detail}`);
    }
    process.exit(1);
  }

  console.log("✅ Step 7 API validation checks complete");
  for (const assertion of assertions) {
    console.log(`- ${assertion.name}`);
  }
}

main()
  .catch((error) => {
    console.error("❌ Step 7 API validation checks failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
