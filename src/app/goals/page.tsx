import Link from "next/link";
import { AppShell } from "../_components/app-shell";
import { GoalCardGrid } from "../_components/goal-card-grid";
import { GoalsSummaryStrip } from "../_components/goals-summary-strip";

export default function GoalsPage() {
  const summaryItems = [
    { label: "Total Goals", value: "5" },
    { label: "On Track", value: "3", valueClassName: "text-green-600 dark:text-green-400" },
    { label: "Achieved", value: "1", valueClassName: "text-blue-600 dark:text-blue-400" },
  ];

  const goals = [
    {
      id: "emergency-fund",
      name: "Emergency Fund",
      targetDate: "Dec 31, 2026",
      progressText: "$3,000 / $5,000",
      progressWidthClassName: "w-[60%]",
      progressBarClassName: "bg-blue-600",
      status: "On Track",
    },
    {
      id: "vacation-fund",
      name: "Vacation Fund",
      targetDate: "Aug 1, 2026",
      progressText: "$1,750 / $2,500",
      progressWidthClassName: "w-[70%]",
      progressBarClassName: "bg-green-600",
      status: "On Track",
    },
    {
      id: "new-laptop",
      name: "New Laptop",
      targetDate: "May 30, 2026",
      progressText: "$900 / $1,500",
      progressWidthClassName: "w-[60%]",
      progressBarClassName: "bg-purple-600",
      status: "At Risk",
    },
  ];

  return (
    <AppShell title="Savings Goals" description="Track goal progress and plan your savings milestones.">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/goals/new"
            className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + New Goal
          </Link>
        </div>

        <GoalsSummaryStrip items={summaryItems} />
        <GoalCardGrid goals={goals} />
      </div>
    </AppShell>
  );
}
