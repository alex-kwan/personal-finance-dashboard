import Link from "next/link";
import { getCurrentUserId } from "@/lib/current-user";
import { listCategoriesForUser } from "@/lib/categories";
import { getTransactionByIdForUser } from "@/lib/transactions";
import { notFound } from "next/navigation";
import { AppShell } from "../../../_components/app-shell";
import { TransactionUpsertForm } from "../../../_components/transaction-upsert-form";

type EditTransactionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  const [transaction, categories] = await Promise.all([
    getTransactionByIdForUser(userId, id),
    listCategoriesForUser(userId),
  ]);

  if (!transaction) {
    notFound();
  }

  const dateValue = transaction.date.toISOString().split("T")[0];

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

        <TransactionUpsertForm
          mode="edit"
          transactionId={id}
          categories={categories}
          defaultValues={{
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            categoryId: transaction.category.id,
            date: dateValue,
            notes: transaction.notes,
          }}
        />
      </div>
    </AppShell>
  );
}
