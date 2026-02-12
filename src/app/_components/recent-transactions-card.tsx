import Link from "next/link";

type TransactionItem = {
  name: string;
  meta: string;
  amount: string;
  amountClassName: string;
};

type RecentTransactionsCardProps = {
  transactions: TransactionItem[];
};

export function RecentTransactionsCard({
  transactions,
}: RecentTransactionsCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        <Link
          href="/transactions"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          View all
        </Link>
      </div>
      <ul className="divide-y divide-gray-100 px-6 dark:divide-gray-700">
        {transactions.map((transaction) => (
          <li key={`${transaction.name}-${transaction.amount}`} className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{transaction.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.meta}</p>
            </div>
            <span className={`font-semibold ${transaction.amountClassName}`}>{transaction.amount}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
