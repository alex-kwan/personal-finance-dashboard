import Link from "next/link";

export function AddCategoryPanel() {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Category (Static)</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          type="text"
          placeholder="Category name"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
        />
        <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200">
          <option>Expense</option>
          <option>Income</option>
        </select>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          Add Category
        </button>
      </div>
      <div className="mt-4">
        <Link href="/transactions" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          View all transactions
        </Link>
      </div>
    </section>
  );
}
