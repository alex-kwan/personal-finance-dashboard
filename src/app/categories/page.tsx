import Link from "next/link";
import { AddCategoryPanel } from "../_components/add-category-panel";
import { AppShell } from "../_components/app-shell";
import { CategoryGroupsCard } from "../_components/category-groups-card";
import { CategorySummaryStrip } from "../_components/category-summary-strip";
import { CategoryTable } from "../_components/category-table";
import { getCurrentUserId } from "@/lib/current-user";
import { listCategoriesForUser } from "@/lib/categories";
import { TransactionType } from "@prisma/client";

export default async function CategoriesPage() {
  const userId = await getCurrentUserId();
  const categories = await listCategoriesForUser(userId);

  const incomeCategories = categories.filter((category) => category.type === TransactionType.INCOME);
  const expenseCategories = categories.filter((category) => category.type === TransactionType.EXPENSE);

  const summaryItems = [
    { label: "Total Categories", value: String(categories.length) },
    { label: "Expense Categories", value: String(expenseCategories.length) },
    { label: "Income Categories", value: String(incomeCategories.length) },
  ];

  const groups = [
    { title: "Income", categories: incomeCategories.map((category) => category.name) },
    { title: "Expense", categories: expenseCategories.map((category) => category.name) },
  ];

  const rows = categories.map((category) => ({
    name: category.name,
    type: category.type === TransactionType.INCOME ? ("Income" as const) : ("Expense" as const),
    usageCount: category.usageCount ?? 0,
  }));

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
