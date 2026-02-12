import Link from "next/link";
import { AppShell } from "../_components/app-shell";
import { ReportChartPlaceholders } from "../_components/report-chart-placeholders";
import { ReportsKpiStrip } from "../_components/reports-kpi-strip";
import { ReportTypeCards } from "../_components/report-type-cards";

export default function ReportsPage() {
  const reportCards = [
    {
      title: "Monthly Summary",
      description: "See aggregated monthly income, expenses, and savings trends.",
      href: "/reports/monthly",
    },
    {
      title: "Spending Breakdown",
      description: "Review where money is going by top spending categories.",
      href: "/reports/monthly",
    },
    {
      title: "Trend Analysis",
      description: "Compare changes month-over-month across key metrics.",
      href: "/reports/monthly",
    },
  ];

  const kpiItems = [
    { label: "This Month Income", value: "$6,500", valueClassName: "text-green-600 dark:text-green-400" },
    { label: "This Month Expenses", value: "$1,780", valueClassName: "text-red-600 dark:text-red-400" },
    { label: "Net Savings", value: "$4,720", valueClassName: "text-blue-600 dark:text-blue-400" },
  ];

  const chartItems = [
    {
      title: "Income vs Expenses",
      subtitle: "Monthly comparison chart placeholder.",
    },
    {
      title: "Top Categories",
      subtitle: "Spending by category chart placeholder.",
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
