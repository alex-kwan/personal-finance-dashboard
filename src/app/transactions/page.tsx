import Link from "next/link";
import { TransactionType } from "@prisma/client";
import { listCategoriesForUser } from "@/lib/categories";
import { getCurrentUserId } from "@/lib/current-user";
import { getTransactionTotalsForUser, listTransactionsForUser } from "@/lib/transactions";
import { AppShell } from "../_components/app-shell";
import { TransactionFilterBar } from "../_components/transaction-filter-bar";
import { TransactionSummaryStrip } from "../_components/transaction-summary-strip";
import { TransactionTable } from "../_components/transaction-table";

type TransactionsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parseDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function formatDate(value: Date): string {
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const resolvedSearchParams = await searchParams;
  const userId = await getCurrentUserId();

  const categories = await listCategoriesForUser(userId);

  const categoryNameFilter = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;
  const categoryIdParam = typeof resolvedSearchParams.categoryId === "string" ? resolvedSearchParams.categoryId : undefined;
  const matchedCategoryByName =
    categoryNameFilter !== undefined
      ? categories.find((category) => category.name.toLowerCase() === categoryNameFilter.toLowerCase())
      : undefined;
  const effectiveCategoryId = categoryIdParam ?? matchedCategoryByName?.id;

  const typeParam = typeof resolvedSearchParams.type === "string" ? resolvedSearchParams.type : undefined;
  const type =
    typeParam === TransactionType.INCOME || typeParam === TransactionType.EXPENSE
      ? typeParam
      : undefined;

  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;
  const startDateParam =
    typeof resolvedSearchParams.startDate === "string" ? resolvedSearchParams.startDate : undefined;
  const endDateParam = typeof resolvedSearchParams.endDate === "string" ? resolvedSearchParams.endDate : undefined;
  const startDate = parseDate(startDateParam);
  const endDate = parseDate(endDateParam);

  const [transactions, totals] = await Promise.all([
    listTransactionsForUser(userId, {
      type,
      categoryId: effectiveCategoryId,
      search,
      startDate,
      endDate,
    }),
    getTransactionTotalsForUser(userId, {
      categoryId: effectiveCategoryId,
      search,
      startDate,
      endDate,
    }),
  ]);

  const summaryItems = [
    { label: "Income", value: formatCurrency(totals.income), valueClassName: "text-green-600 dark:text-green-400" },
    { label: "Expenses", value: formatCurrency(totals.expenses), valueClassName: "text-red-600 dark:text-red-400" },
    { label: "Net", value: formatCurrency(totals.net), valueClassName: "text-blue-600 dark:text-blue-400" },
  ];

  const rows = transactions.map((transaction) => ({
    id: transaction.id,
    date: formatDate(transaction.date),
    name: transaction.description,
    category: transaction.category.name,
    type: transaction.type === TransactionType.INCOME ? ("Income" as const) : ("Expense" as const),
    amount: `${transaction.type === TransactionType.INCOME ? "+" : "-"}${formatCurrency(transaction.amount)}`,
    amountClassName:
      transaction.type === TransactionType.INCOME
        ? "text-green-600 dark:text-green-400"
        : "text-red-600 dark:text-red-400",
  }));

  return (
    <AppShell
      title="Transactions"
      description="Browse, filter, and manage all income and expense activity."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/transactions/new"
            className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + Add Transaction
          </Link>
        </div>

        <TransactionFilterBar
          search={search}
          type={type}
          categoryId={effectiveCategoryId}
          startDate={startDateParam}
          endDate={endDateParam}
          categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        />
        <TransactionSummaryStrip items={summaryItems} />
        <TransactionTable rows={rows} />
      </div>
    </AppShell>
  );
}
