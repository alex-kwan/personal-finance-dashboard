import Link from "next/link";

type TransactionFormCardProps = {
  title: string;
  submitLabel: string;
  submitHref: string;
  cancelHref: string;
  defaultType?: "Income" | "Expense";
  defaultAmount?: string;
  defaultDate?: string;
  defaultCategory?: string;
  defaultNotes?: string;
};

export function TransactionFormCard({
  title,
  submitLabel,
  submitHref,
  cancelHref,
  defaultType = "Expense",
  defaultAmount = "",
  defaultDate = "",
  defaultCategory = "",
  defaultNotes = "",
}: TransactionFormCardProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
          <select
            defaultValue={defaultType}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
          >
            <option>Expense</option>
            <option>Income</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input
            type="text"
            defaultValue={defaultAmount}
            placeholder="0.00"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="text"
            defaultValue={defaultDate}
            placeholder="Feb 12, 2026"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <input
            type="text"
            defaultValue={defaultCategory}
            placeholder="Housing, Food, Salary..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
          <textarea
            defaultValue={defaultNotes}
            rows={4}
            placeholder="Optional details..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Link
          href={submitHref}
          className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {submitLabel}
        </Link>
        <Link
          href={cancelHref}
          className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Cancel
        </Link>
      </div>
    </section>
  );
}
