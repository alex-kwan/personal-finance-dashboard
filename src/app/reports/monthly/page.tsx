import Link from "next/link";
import { AppShell } from "../../_components/app-shell";
import { MonthSelectorCard } from "../../_components/month-selector-card";
import { ReportCategoryBreakdownCard } from "../../_components/report-category-breakdown-card";
import { ReportComparisonCard } from "../../_components/report-comparison-card";
import { ReportsKpiStrip } from "../../_components/reports-kpi-strip";

export default function MonthlyReportPage() {
  const monthlyKpis = [
    { label: "Income", value: "$6,500", valueClassName: "text-green-600 dark:text-green-400" },
    { label: "Expenses", value: "$1,780", valueClassName: "text-red-600 dark:text-red-400" },
    { label: "Net", value: "$4,720", valueClassName: "text-blue-600 dark:text-blue-400" },
  ];

  const breakdownItems = [
    { name: "Housing", amount: "$1,200", percentage: "67%" },
    { name: "Food", amount: "$250", percentage: "14%" },
    { name: "Transportation", amount: "$180", percentage: "10%" },
    { name: "Utilities", amount: "$150", percentage: "9%" },
  ];

  const comparisonRows = [
    {
      metric: "Income",
      current: "$6,500",
      previous: "$6,200",
      change: "+4.8%",
      changeClassName: "text-green-600 dark:text-green-400",
    },
    {
      metric: "Expenses",
      current: "$1,780",
      previous: "$1,950",
      change: "-8.7%",
      changeClassName: "text-green-600 dark:text-green-400",
    },
    {
      metric: "Net Savings",
      current: "$4,720",
      previous: "$4,250",
      change: "+11.1%",
      changeClassName: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <AppShell title="Monthly Report" description="Monthly financial summary with category and trend insights.">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/reports"
            className="inline-flex text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to Reports
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Back to Dashboard
          </Link>
        </div>

        <MonthSelectorCard monthLabel="February 2026" />
        <ReportsKpiStrip items={monthlyKpis} />
        <ReportCategoryBreakdownCard items={breakdownItems} />
        <ReportComparisonCard rows={comparisonRows} />
      </div>
    </AppShell>
  );
}
