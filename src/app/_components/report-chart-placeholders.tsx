type ChartPlaceholderItem = {
  title: string;
  subtitle: string;
};

type ReportChartPlaceholdersProps = {
  charts: ChartPlaceholderItem[];
};

export function ReportChartPlaceholders({ charts }: ReportChartPlaceholdersProps) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {charts.map((chart) => (
        <article
          key={chart.title}
          className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{chart.title}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{chart.subtitle}</p>
          <div className="mt-5 flex h-48 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-900/40 dark:text-gray-400">
            Chart Placeholder
          </div>
        </article>
      ))}
    </section>
  );
}
