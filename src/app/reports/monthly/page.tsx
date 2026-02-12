import Link from "next/link";
import { getCurrentUserId } from "@/lib/current-user";
import { getMonthlyReportSnapshotForUser } from "@/lib/reports";
import { AppShell } from "../../_components/app-shell";
import { MonthSelectorCard } from "../../_components/month-selector-card";
import { ReportCategoryBreakdownCard } from "../../_components/report-category-breakdown-card";
import { ReportComparisonCard } from "../../_components/report-comparison-card";
import { ReportsKpiStrip } from "../../_components/reports-kpi-strip";

type MonthlyReportPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercentDelta(current: number, previous: number): string {
  if (previous === 0) {
    return current === 0 ? "0.0%" : "+100.0%";
  }

  const delta = ((current - previous) / Math.abs(previous)) * 100;
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}%`;
}

function normalizeYearMonth(inputYear?: string, inputMonth?: string): { year: number; month: number } {
  const now = new Date();
  const parsedYear = inputYear ? Number(inputYear) : now.getFullYear();
  const parsedMonth = inputMonth ? Number(inputMonth) : now.getMonth() + 1;

  if (!Number.isInteger(parsedYear) || !Number.isInteger(parsedMonth)) {
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }

  const normalizedDate = new Date(parsedYear, parsedMonth - 1, 1);
  return {
    year: normalizedDate.getFullYear(),
    month: normalizedDate.getMonth() + 1,
  };
}

export default async function MonthlyReportPage({ searchParams }: MonthlyReportPageProps) {
  const resolvedSearchParams = await searchParams;
  const userId = await getCurrentUserId();

  const yearParam = typeof resolvedSearchParams.year === "string" ? resolvedSearchParams.year : undefined;
  const monthParam = typeof resolvedSearchParams.month === "string" ? resolvedSearchParams.month : undefined;
  const { year, month } = normalizeYearMonth(yearParam, monthParam);

  const snapshot = await getMonthlyReportSnapshotForUser(userId, year, month);

  const currentDate = new Date(year, month - 1, 1);
  const prevDate = new Date(year, month - 2, 1);
  const nextDate = new Date(year, month, 1);
  const monthLabel = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const monthlyKpis = [
    {
      label: "Income",
      value: formatCurrency(snapshot.totals.income),
      valueClassName: "text-green-600 dark:text-green-400",
    },
    {
      label: "Expenses",
      value: formatCurrency(snapshot.totals.expenses),
      valueClassName: "text-red-600 dark:text-red-400",
    },
    {
      label: "Net",
      value: formatCurrency(snapshot.totals.net),
      valueClassName: "text-blue-600 dark:text-blue-400",
    },
  ];

  const breakdownItems = snapshot.categoryBreakdown.map((item) => ({
    name: item.categoryName,
    amount: formatCurrency(item.amount),
    percentage: `${item.percentage.toFixed(1)}%`,
  }));

  const comparisonRows = [
    {
      metric: "Income",
      current: formatCurrency(snapshot.monthOverMonth.current.income),
      previous: formatCurrency(snapshot.monthOverMonth.previous.income),
      change: formatPercentDelta(
        snapshot.monthOverMonth.current.income,
        snapshot.monthOverMonth.previous.income,
      ),
      changeClassName:
        snapshot.monthOverMonth.incomeDelta >= 0
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
    },
    {
      metric: "Expenses",
      current: formatCurrency(snapshot.monthOverMonth.current.expenses),
      previous: formatCurrency(snapshot.monthOverMonth.previous.expenses),
      change: formatPercentDelta(
        snapshot.monthOverMonth.current.expenses,
        snapshot.monthOverMonth.previous.expenses,
      ),
      changeClassName:
        snapshot.monthOverMonth.expenseDelta <= 0
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
    },
    {
      metric: "Net Savings",
      current: formatCurrency(snapshot.monthOverMonth.current.net),
      previous: formatCurrency(snapshot.monthOverMonth.previous.net),
      change: formatPercentDelta(snapshot.monthOverMonth.current.net, snapshot.monthOverMonth.previous.net),
      changeClassName:
        snapshot.monthOverMonth.netDelta >= 0
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
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

        <MonthSelectorCard
          monthLabel={monthLabel}
          previousHref={`/reports/monthly?year=${prevDate.getFullYear()}&month=${prevDate.getMonth() + 1}`}
          nextHref={`/reports/monthly?year=${nextDate.getFullYear()}&month=${nextDate.getMonth() + 1}`}
        />
        <ReportsKpiStrip items={monthlyKpis} />
        <ReportCategoryBreakdownCard items={breakdownItems} />
        <ReportComparisonCard rows={comparisonRows} />
      </div>
    </AppShell>
  );
}
