type StatItem = {
  label: string;
  value: string;
  subtitle: string;
  valueClassName: string;
};

type StatRowProps = {
  stats: StatItem[];
};

export function StatRow({ stats }: StatRowProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
          <p className={`mt-2 text-2xl font-bold ${stat.valueClassName}`}>{stat.value}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
        </article>
      ))}
    </section>
  );
}
