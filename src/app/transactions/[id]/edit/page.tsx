import Link from "next/link";
import { AppShell } from "../../../_components/app-shell";
import { TransactionFormCard } from "../../../_components/transaction-form-card";

type EditTransactionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const { id } = await params;

  return (
    <AppShell
      title="Edit Transaction"
      description="Update transaction information and save your changes."
    >
      <div className="space-y-6">
        <Link
          href={`/transactions/${id}`}
          className="inline-flex text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Detail
        </Link>

        <TransactionFormCard
          title="Edit Transaction Details"
          submitLabel="Save Changes"
          submitHref={`/transactions/${id}`}
          cancelHref={`/transactions/${id}`}
          defaultType="Expense"
          defaultAmount="1200.00"
          defaultDate="Feb 1, 2026"
          defaultCategory="Housing"
          defaultNotes="Paid via bank transfer."
        />
      </div>
    </AppShell>
  );
}
