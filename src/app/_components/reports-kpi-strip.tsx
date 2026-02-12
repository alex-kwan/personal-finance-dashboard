type ReportsKpiItem = {
  label: string;
  value: string;
  valueClassName?: string;
};

type ReportsKpiStripProps = {
  items: ReportsKpiItem[];
};

export function ReportsKpiStrip({ items }: ReportsKpiStripProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
          <p className={`mt-2 text-2xl font-bold ${item.valueClassName ?? "text-gray-900 dark:text-white"}`}>
            {item.value}
          </p>
        </article>
      ))}
    </section>
  );
}
