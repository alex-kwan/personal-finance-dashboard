import Link from "next/link";

type TransactionRow = {
  id: string;
  date: string;
  name: string;
  category: string;
  type: "Income" | "Expense";
  amount: string;
  amountClassName: string;
};

type TransactionTableProps = {
  rows: TransactionRow[];
};

export function TransactionTable({ rows }: TransactionTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.category}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.type}</td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${row.amountClassName}`}>
                  {row.amount}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="inline-flex items-center gap-3">
                    <Link href={`/transactions/${row.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                      View
                    </Link>
                    <Link
                      href={`/transactions/${row.id}/edit`}
                      className="text-gray-700 hover:underline dark:text-gray-300"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
