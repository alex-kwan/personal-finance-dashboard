import Link from "next/link";
import { TransactionDeleteButton } from "./transaction-delete-button";

type TransactionDetailCardProps = {
  id: string;
  name: string;
  date: string;
  category: string;
  type: "Income" | "Expense";
  amount: string;
  amountClassName: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export function TransactionDetailCard({
  id,
  name,
  date,
  category,
  type,
  amount,
  amountClassName,
  notes,
  createdAt,
  updatedAt,
}: TransactionDetailCardProps) {
  return (
    <section className="space-y-6">
      <article className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Transaction</p>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ID: {id}</p>
          </div>
          <p className={`text-2xl font-bold ${amountClassName}`}>{amount}</p>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{date}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{category}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{type}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Notes</p>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{notes ?? "—"}</p>
        </div>
      </article>

      <article className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Metadata
        </h4>
        <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-2">
          <p>Created: {createdAt}</p>
          <p>Updated: {updatedAt}</p>
        </div>
      </article>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/transactions/${id}/edit`}
          className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Edit Transaction
        </Link>
        <Link
          href="/transactions"
          className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Back to Transactions
        </Link>
        <TransactionDeleteButton transactionId={id} />
      </div>
    </section>
  );
}
