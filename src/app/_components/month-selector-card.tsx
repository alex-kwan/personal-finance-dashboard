import Link from "next/link";

type MonthSelectorCardProps = {
  monthLabel: string;
  previousHref: string;
  nextHref: string;
};

export function MonthSelectorCard({ monthLabel, previousHref, nextHref }: MonthSelectorCardProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly View</h3>
        <div className="inline-flex items-center gap-2">
          <Link
            href={previousHref}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            ← Prev
          </Link>
          <span className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
            {monthLabel}
          </span>
          <Link
            href={nextHref}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Next →
          </Link>
        </div>
      </div>
    </section>
  );
}
