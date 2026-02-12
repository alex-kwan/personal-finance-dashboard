import Link from "next/link";
import { AppShell } from "../../_components/app-shell";
import { TransactionFormCard } from "../../_components/transaction-form-card";

export default function NewTransactionPage() {
  return (
    <AppShell
      title="New Transaction"
      description="Add a new income or expense transaction to your records."
    >
      <div className="space-y-6">
        <Link
          href="/transactions"
          className="inline-flex text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Transactions
        </Link>

        <TransactionFormCard
          title="Transaction Details"
          submitLabel="Save Transaction"
          submitHref="/transactions"
          cancelHref="/transactions"
        />
      </div>
    </AppShell>
  );
}
