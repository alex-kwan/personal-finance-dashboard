import { prisma } from "../src/lib/prisma";
import { listCategoriesForUser } from "../src/lib/categories";
import { getDashboardSnapshotForUser } from "../src/lib/dashboard";
import { listGoalsForUser } from "../src/lib/goals";
import { getMonthlyReportSnapshotForUser } from "../src/lib/reports";
import { listTransactionsForUser } from "../src/lib/transactions";

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

  const [categories, transactions, goals, dashboard, monthlyReport] = await Promise.all([
    listCategoriesForUser(demoUser.id),
    listTransactionsForUser(demoUser.id),
    listGoalsForUser(demoUser.id),
    getDashboardSnapshotForUser(demoUser.id),
    getMonthlyReportSnapshotForUser(demoUser.id, 2026, 2),
  ]);

  console.log("✅ Data access smoke check complete");
  console.log("User:", demoUser.email);
  console.log("Categories:", categories.length);
  console.log("Transactions:", transactions.length);
  console.log("Goals:", goals.length);
  console.log("Dashboard net:", dashboard.netSavings);
  console.log("Monthly report net:", monthlyReport.totals.net);
}

main()
  .catch((error) => {
    console.error("❌ Data access smoke check failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
