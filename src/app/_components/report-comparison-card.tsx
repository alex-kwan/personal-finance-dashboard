type ComparisonRow = {
  metric: string;
  current: string;
  previous: string;
  change: string;
  changeClassName?: string;
};

type ReportComparisonCardProps = {
  rows: ComparisonRow[];
};

export function ReportComparisonCard({ rows }: ReportComparisonCardProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Month-over-Month Comparison</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Metric
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Current
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Previous
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.map((row) => (
              <tr key={row.metric}>
                <td className="px-3 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.metric}</td>
                <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300">{row.current}</td>
                <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300">{row.previous}</td>
                <td className={`px-3 py-3 text-sm font-semibold ${row.changeClassName ?? "text-gray-900 dark:text-white"}`}>
                  {row.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
