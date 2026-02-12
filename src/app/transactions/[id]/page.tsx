import { TransactionType } from "@prisma/client";
import { getCurrentUserId } from "@/lib/current-user";
import { getTransactionByIdForUser } from "@/lib/transactions";
import { notFound } from "next/navigation";
import { AppShell } from "../../_components/app-shell";
import { TransactionDetailCard } from "../../_components/transaction-detail-card";

type TransactionDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  const transaction = await getTransactionByIdForUser(userId, id);

  if (!transaction) {
    notFound();
  }

  const formatDateTime = (value: Date) =>
    value.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (value: Date) =>
    value.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <AppShell
      title="Transaction Detail"
      description="Inspect transaction information and move to edit when needed."
    >
      <TransactionDetailCard
        id={transaction.id}
        name={transaction.description}
        date={formatDate(transaction.date)}
        category={transaction.category.name}
        type={transaction.type === TransactionType.INCOME ? "Income" : "Expense"}
        amount={`${transaction.type === TransactionType.INCOME ? "+" : "-"}${formatCurrency(transaction.amount)}`}
        amountClassName={
          transaction.type === TransactionType.INCOME
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }
        notes={transaction.notes}
        createdAt={formatDateTime(transaction.createdAt)}
        updatedAt={formatDateTime(transaction.updatedAt)}
      />
    </AppShell>
  );
}
