import Link from "next/link";
import { AppShell } from "../_components/app-shell";
import { TransactionFilterBar } from "../_components/transaction-filter-bar";
import { TransactionSummaryStrip } from "../_components/transaction-summary-strip";
import { TransactionTable } from "../_components/transaction-table";

export default function TransactionsPage() {
  const summaryItems = [
    { label: "Income", value: "$6,500.00", valueClassName: "text-green-600 dark:text-green-400" },
    { label: "Expenses", value: "$1,780.00", valueClassName: "text-red-600 dark:text-red-400" },
    { label: "Net", value: "$4,720.00", valueClassName: "text-blue-600 dark:text-blue-400" },
  ];

  const rows = [
    {
      id: "salary-feb",
      date: "Feb 1, 2026",
      name: "Monthly Salary",
      category: "Salary",
      type: "Income" as const,
      amount: "+$5,000.00",
      amountClassName: "text-green-600 dark:text-green-400",
    },
    {
      id: "rent-feb",
      date: "Feb 1, 2026",
      name: "Monthly Rent",
      category: "Housing",
      type: "Expense" as const,
      amount: "-$1,200.00",
      amountClassName: "text-red-600 dark:text-red-400",
    },
    {
      id: "groceries-feb",
      date: "Feb 3, 2026",
      name: "Grocery Shopping",
      category: "Food",
      type: "Expense" as const,
      amount: "-$250.00",
      amountClassName: "text-red-600 dark:text-red-400",
    },
    {
      id: "freelance-feb",
      date: "Feb 4, 2026",
      name: "Freelance Project",
      category: "Side Income",
      type: "Income" as const,
      amount: "+$850.00",
      amountClassName: "text-green-600 dark:text-green-400",
    },
  ];

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

        <TransactionFilterBar />
        <TransactionSummaryStrip items={summaryItems} />
        <TransactionTable rows={rows} />
      </div>
    </AppShell>
  );
}
