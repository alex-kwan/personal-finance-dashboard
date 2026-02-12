import { TransactionType } from "@prisma/client";

type TransactionFilterBarProps = {
  searchPlaceholder?: string;
  search?: string;
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  categories: Array<{
    id: string;
    name: string;
  }>;
};

export function TransactionFilterBar({
  searchPlaceholder = "Search transactions...",
  search,
  type,
  categoryId,
  startDate,
  endDate,
  categories,
}: TransactionFilterBarProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
      <form action="/transactions" className="mt-4 space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            name="search"
            defaultValue={search ?? ""}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
          />

          <select
            name="type"
            defaultValue={type ?? ""}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="">All Types</option>
            <option value={TransactionType.INCOME}>Income</option>
            <option value={TransactionType.EXPENSE}>Expense</option>
          </select>

          <select
            name="categoryId"
            defaultValue={categoryId ?? ""}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              name="startDate"
              defaultValue={startDate ?? ""}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            />
            <input
              type="date"
              name="endDate"
              defaultValue={endDate ?? ""}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <a
            href="/transactions"
            className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Reset
          </a>
        </div>
      </form>
    </section>
  );
}
