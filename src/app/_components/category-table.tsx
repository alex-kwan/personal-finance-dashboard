import Link from "next/link";

type CategoryRow = {
  name: string;
  type: "Income" | "Expense";
  usageCount: number;
};

type CategoryTableProps = {
  rows: CategoryRow[];
};

export function CategoryTable({ rows }: CategoryTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Usage
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.map((row) => (
              <tr key={`${row.type}-${row.name}`}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.usageCount} transactions</td>
                <td className="px-4 py-3 text-right text-sm">
                  <Link
                    href={`/transactions?category=${encodeURIComponent(row.name)}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View usage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
