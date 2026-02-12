import { TransactionType } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import {
  createTransactionForUser,
  deleteTransactionForUser,
  getTransactionByIdForUser,
  getTransactionTotalsForUser,
  listTransactionsForUser,
  updateTransactionForUser,
} from "../src/lib/transactions";

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
    },
  });

  if (!incomeCategory) {
    throw new Error("No INCOME category available for demo user.");
  }

  const beforeCount = (await listTransactionsForUser(demoUser.id)).length;

  const created = await createTransactionForUser(demoUser.id, {
    amount: 321,
    description: "Step3 Smoke Transaction",
    type: TransactionType.INCOME,
    categoryId: incomeCategory.id,
    date: new Date("2026-02-12"),
    notes: "Created by step3 smoke test",
  });

  const fetched = await getTransactionByIdForUser(demoUser.id, created.id);
  if (!fetched) {
    throw new Error("Created transaction could not be fetched.");
  }

  const updated = await updateTransactionForUser(demoUser.id, created.id, {
    amount: 654,
    description: "Step3 Smoke Transaction Updated",
    notes: "Updated by step3 smoke test",
  });

  if (!updated) {
    throw new Error("Updated transaction returned null.");
  }

  if (updated.amount !== 654) {
    throw new Error(`Expected updated amount 654, received ${updated.amount}`);
  }

  const filteredBySearch = await listTransactionsForUser(demoUser.id, {
    search: "Smoke Transaction Updated",
  });
  if (!filteredBySearch.some((item) => item.id === created.id)) {
    throw new Error("Search filter did not return updated transaction.");
  }

  const filteredByType = await listTransactionsForUser(demoUser.id, {
    type: TransactionType.INCOME,
  });
  if (!filteredByType.some((item) => item.id === created.id)) {
    throw new Error("Type filter did not return created transaction.");
  }

  const totals = await getTransactionTotalsForUser(demoUser.id, {
    search: "Smoke Transaction Updated",
  });
  if (totals.income < 654) {
    throw new Error("Totals did not include updated transaction amount.");
  }

  const deleted = await deleteTransactionForUser(demoUser.id, created.id);
  if (!deleted) {
    throw new Error("deleteTransactionForUser returned false.");
  }

  const afterDelete = await getTransactionByIdForUser(demoUser.id, created.id);
  if (afterDelete) {
    throw new Error("Transaction still exists after delete.");
  }

  const afterCount = (await listTransactionsForUser(demoUser.id)).length;
  if (afterCount !== beforeCount) {
    throw new Error(`Transaction count mismatch after cleanup: before=${beforeCount}, after=${afterCount}`);
  }

  console.log("✅ Step 3 transactions smoke check complete");
  console.log("User:", demoUser.email);
  console.log("Verified: create, read, update, search/type filters, totals, delete, cleanup");
}

main()
  .catch((error) => {
    console.error("❌ Step 3 transactions smoke check failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
