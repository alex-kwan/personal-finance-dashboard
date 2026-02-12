type CategoryBreakdownItem = {
  name: string;
  amount: string;
  percentage: string;
};

type ReportCategoryBreakdownCardProps = {
  items: CategoryBreakdownItem[];
};

export function ReportCategoryBreakdownCard({
  items,
}: ReportCategoryBreakdownCardProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category Breakdown</h3>
      <ul className="mt-4 divide-y divide-gray-100 dark:divide-gray-700">
        {items.map((item) => (
          <li key={item.name} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.percentage} of monthly spend</p>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.amount}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
