import { getCurrentUserId } from "../src/lib/current-user";
import {
  getMonthlyReportSnapshotForUser,
  getMonthlyTotalsForUser,
  listRecentMonthlyTotalsForUser,
} from "../src/lib/reports";

async function main() {
  const userId = await getCurrentUserId();

  const year = 2026;
  const month = 2;

  const [snapshot, totals, recent] = await Promise.all([
    getMonthlyReportSnapshotForUser(userId, year, month),
    getMonthlyTotalsForUser(userId, year, month),
    listRecentMonthlyTotalsForUser(userId, { months: 6, referenceDate: new Date(year, month - 1, 1) }),
  ]);

  if (snapshot.totals.income !== totals.income) {
    throw new Error(`Income mismatch: snapshot=${snapshot.totals.income}, totals=${totals.income}`);
  }

  if (snapshot.totals.expenses !== totals.expenses) {
    throw new Error(`Expenses mismatch: snapshot=${snapshot.totals.expenses}, totals=${totals.expenses}`);
  }

  if (snapshot.totals.net !== totals.net) {
    throw new Error(`Net mismatch: snapshot=${snapshot.totals.net}, totals=${totals.net}`);
  }

  const breakdownSum = snapshot.categoryBreakdown.reduce((sum, item) => sum + item.percentage, 0);
  if (snapshot.totals.expenses > 0 && Math.abs(100 - breakdownSum) > 0.5) {
    throw new Error(`Breakdown percentage total out of range: ${breakdownSum}`);
  }

  if (recent.length !== 6) {
    throw new Error(`Expected 6 recent monthly totals, received ${recent.length}`);
  }

  const previous = snapshot.monthOverMonth.previous;
  const current = snapshot.monthOverMonth.current;

  if (snapshot.monthOverMonth.incomeDelta !== current.income - previous.income) {
    throw new Error("Income delta does not match current - previous");
  }

  if (snapshot.monthOverMonth.expenseDelta !== current.expenses - previous.expenses) {
    throw new Error("Expense delta does not match current - previous");
  }

  if (snapshot.monthOverMonth.netDelta !== current.net - previous.net) {
    throw new Error("Net delta does not match current - previous");
  }

  console.log("✅ Step 6 reports smoke check complete");
  console.log(`Verified month ${year}-${String(month).padStart(2, "0")}`);
  console.log(`Breakdown percentage total: ${breakdownSum.toFixed(2)}%`);
}

main().catch((error) => {
  console.error("❌ Step 6 reports smoke check failed");
  console.error(error);
  process.exit(1);
});
