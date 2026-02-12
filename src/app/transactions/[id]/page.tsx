import { AppShell } from "../../_components/app-shell";
import { TransactionDetailCard } from "../../_components/transaction-detail-card";

type TransactionDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  const { id } = await params;

  return (
    <AppShell
      title="Transaction Detail"
      description="Inspect transaction information and move to edit when needed."
    >
      <TransactionDetailCard
        id={id}
        name="Monthly Rent"
        date="Feb 1, 2026"
        category="Housing"
        type="Expense"
        amount="-$1,200.00"
        amountClassName="text-red-600 dark:text-red-400"
        notes="Paid via bank transfer."
      />
    </AppShell>
  );
}
