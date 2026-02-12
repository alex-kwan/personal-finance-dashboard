import Link from "next/link";
import { AddCategoryPanel } from "../_components/add-category-panel";
import { AppShell } from "../_components/app-shell";
import { CategoryGroupsCard } from "../_components/category-groups-card";
import { CategorySummaryStrip } from "../_components/category-summary-strip";
import { CategoryTable } from "../_components/category-table";

export default function CategoriesPage() {
  const summaryItems = [
    { label: "Total Categories", value: "10" },
    { label: "Expense Categories", value: "7" },
    { label: "Income Categories", value: "3" },
  ];

  const groups = [
    { title: "Income", categories: ["Salary", "Freelance", "Investments"] },
    {
      title: "Expense",
      categories: ["Housing", "Food", "Transportation", "Utilities", "Entertainment", "Health", "Shopping"],
    },
  ];

  const rows = [
    { name: "Salary", type: "Income" as const, usageCount: 2 },
    { name: "Freelance", type: "Income" as const, usageCount: 4 },
    { name: "Housing", type: "Expense" as const, usageCount: 6 },
    { name: "Food", type: "Expense" as const, usageCount: 9 },
    { name: "Transportation", type: "Expense" as const, usageCount: 5 },
    { name: "Utilities", type: "Expense" as const, usageCount: 3 },
  ];

  return (
    <AppShell
      title="Categories"
      description="Manage your income and expense categories used across transactions."
    >
      <div className="space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Dashboard
        </Link>

        <CategorySummaryStrip items={summaryItems} />
        <CategoryGroupsCard groups={groups} />
        <CategoryTable rows={rows} />
        <AddCategoryPanel />
      </div>
    </AppShell>
  );
}
