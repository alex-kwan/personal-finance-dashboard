type CategoryGroup = {
  title: string;
  categories: string[];
};

type CategoryGroupsCardProps = {
  groups: CategoryGroup[];
};

export function CategoryGroupsCard({ groups }: CategoryGroupsCardProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category Groups</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <article key={group.title} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
              {group.title}
            </h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.categories.map((category) => (
                <li
                  key={category}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                >
                  {category}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
