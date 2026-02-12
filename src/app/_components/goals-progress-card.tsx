import Link from "next/link";

type GoalProgressItem = {
  name: string;
  amountText: string;
  progressPercent: number;
  barClassName: string;
};

type GoalsProgressCardProps = {
  goals: GoalProgressItem[];
};

export function GoalsProgressCard({ goals }: GoalsProgressCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goals Progress</h3>
        <Link href="/goals" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          View all
        </Link>
      </div>
      <div className="space-y-5 px-6 py-5">
        {goals.map((goal) => (
          <div key={goal.name}>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium text-gray-900 dark:text-white">{goal.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{goal.amountText}</p>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full ${goal.barClassName}`}
                style={{ width: `${Math.max(0, Math.min(100, goal.progressPercent))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
