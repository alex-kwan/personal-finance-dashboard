import Link from "next/link";
import { getCurrentUserId } from "@/lib/current-user";
import { getMonthlyTotalsForUser, listRecentMonthlyTotalsForUser } from "@/lib/reports";
import { AppShell } from "../_components/app-shell";
import { ReportChartPlaceholders } from "../_components/report-chart-placeholders";
import { ReportsKpiStrip } from "../_components/reports-kpi-strip";
import { ReportTypeCards } from "../_components/report-type-cards";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function ReportsPage() {
  const userId = await getCurrentUserId();
  const referenceDate = new Date();
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth() + 1;

  const [currentMonthTotals, recentMonthlyTotals] = await Promise.all([
    getMonthlyTotalsForUser(userId, year, month),
    listRecentMonthlyTotalsForUser(userId, { months: 6, referenceDate }),
  ]);

  const sixMonthIncome = recentMonthlyTotals.reduce((sum, item) => sum + item.income, 0);
  const sixMonthExpenses = recentMonthlyTotals.reduce((sum, item) => sum + item.expenses, 0);
  const sixMonthNet = recentMonthlyTotals.reduce((sum, item) => sum + item.net, 0);

  const reportCards = [
    {
      title: "Monthly Summary",
      description: "See aggregated monthly income, expenses, and savings trends.",
      href: `/reports/monthly?year=${year}&month=${month}`,
    },
    {
      title: "Spending Breakdown",
      description: "Review where money is going by top spending categories.",
      href: `/reports/monthly?year=${year}&month=${month}`,
    },
    {
      title: "Trend Analysis",
      description: "Compare changes month-over-month across key metrics.",
      href: `/reports/monthly?year=${year}&month=${month}`,
    },
  ];

  const kpiItems = [
    {
      label: "This Month Income",
      value: formatCurrency(currentMonthTotals.income),
      valueClassName: "text-green-600 dark:text-green-400",
    },
    {
      label: "This Month Expenses",
      value: formatCurrency(currentMonthTotals.expenses),
      valueClassName: "text-red-600 dark:text-red-400",
    },
    {
      label: "Net Savings",
      value: formatCurrency(currentMonthTotals.net),
      valueClassName: "text-blue-600 dark:text-blue-400",
    },
  ];

  const chartItems = [
    {
      title: "Income vs Expenses",
      subtitle: `Last 6 months: ${formatCurrency(sixMonthIncome)} income vs ${formatCurrency(sixMonthExpenses)} expenses.`,
    },
    {
      title: "Top Categories",
      subtitle: `Last 6 months net: ${formatCurrency(sixMonthNet)}. See monthly report for category breakdown.`,
    },
  ];

  return (
    <AppShell title="Reports" description="Explore analytics and financial performance summaries.">
      <div className="space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Dashboard
        </Link>

        <ReportTypeCards cards={reportCards} />
        <ReportsKpiStrip items={kpiItems} />
        <ReportChartPlaceholders charts={chartItems} />
      </div>
    </AppShell>
  );
}
