type TransactionFilterBarProps = {
  searchPlaceholder?: string;
};

export function TransactionFilterBar({
  searchPlaceholder = "Search transactions...",
}: TransactionFilterBarProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
        />

        <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200">
          <option>All Types</option>
          <option>Income</option>
          <option>Expense</option>
        </select>

        <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200">
          <option>All Categories</option>
          <option>Housing</option>
          <option>Food</option>
          <option>Salary</option>
        </select>

        <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200">
          <option>This Month</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>
    </section>
  );
}
