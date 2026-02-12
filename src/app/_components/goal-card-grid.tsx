import Link from "next/link";

type GoalCardItem = {
  id: string;
  name: string;
  targetDate: string;
  progressText: string;
  progressWidthClassName: string;
  progressBarClassName?: string;
  status: string;
};

type GoalCardGridProps = {
  goals: GoalCardItem[];
};

export function GoalCardGrid({ goals }: GoalCardGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {goals.map((goal) => (
        <article
          key={goal.id}
          className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Target: {goal.targetDate}</p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              {goal.status}
            </span>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{goal.progressText}</p>
            <div className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full ${goal.progressWidthClassName} ${goal.progressBarClassName ?? "bg-blue-600"}`}
              />
            </div>
          </div>

          <div className="mt-5">
            <Link href={`/goals/${goal.id}`} className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View goal details
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
