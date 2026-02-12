import Link from "next/link";
import { listCategoriesForUser } from "@/lib/categories";
import { getCurrentUserId } from "@/lib/current-user";
import { AppShell } from "../../_components/app-shell";
import { TransactionUpsertForm } from "../../_components/transaction-upsert-form";

export default async function NewTransactionPage() {
  const userId = await getCurrentUserId();
  const categories = await listCategoriesForUser(userId);

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

        <TransactionUpsertForm mode="create" categories={categories} />
      </div>
    </AppShell>
  );
}
