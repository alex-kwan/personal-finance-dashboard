import Link from "next/link";

type ContributionItem = {
  date: string;
  amount: string;
  note: string;
};

type GoalDetailViewProps = {
  id: string;
  name: string;
  status: string;
  progressPercent: string;
  amountText: string;
  progressValue: number;
  contributions: ContributionItem[];
};

export function GoalDetailView({
  id,
  name,
  status,
  progressPercent,
  amountText,
  progressValue,
  contributions,
}: GoalDetailViewProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Goal</p>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ID: {id}</p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
            {status}
          </span>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{progressPercent}</p>
          </div>
          <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-3 rounded-full bg-blue-600"
              style={{ width: `${Math.max(0, Math.min(100, progressValue))}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{amountText}</p>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Contribution History</h4>
        <ul className="mt-4 divide-y divide-gray-100 dark:divide-gray-700">
          {contributions.map((contribution, index) => (
            <li key={`${contribution.date}-${index}`} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{contribution.note}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{contribution.date}</p>
              </div>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">{contribution.amount}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/goals"
          className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Back to Goals
        </Link>
        <Link
          href={`/goals/${id}`}
          className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Update Progress
        </Link>
      </div>
    </div>
  );
}
