import Link from "next/link";
import { GoalStatus } from "@prisma/client";
import { getCurrentUserId } from "@/lib/current-user";
import { listGoalsForUser } from "@/lib/goals";
import { AppShell } from "../_components/app-shell";
import { GoalCardGrid } from "../_components/goal-card-grid";
import { GoalsSummaryStrip } from "../_components/goals-summary-strip";

function getStatusLabel(status: GoalStatus): string {
  if (status === GoalStatus.COMPLETED) {
    return "Completed";
  }

  if (status === GoalStatus.PAUSED) {
    return "Paused";
  }

  return "In Progress";
}

function formatDate(date: Date | null): string {
  if (!date) {
    return "No deadline";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function GoalsPage() {
  const userId = await getCurrentUserId();
  const goalsData = await listGoalsForUser(userId);

  const summaryItems = [
    { label: "Total Goals", value: String(goalsData.length) },
    {
      label: "On Track",
      value: String(goalsData.filter((goal) => goal.status === GoalStatus.IN_PROGRESS).length),
      valueClassName: "text-green-600 dark:text-green-400",
    },
    {
      label: "Achieved",
      value: String(goalsData.filter((goal) => goal.status === GoalStatus.COMPLETED).length),
      valueClassName: "text-blue-600 dark:text-blue-400",
    },
  ];

  const goals = goalsData.map((goal) => ({
    id: goal.id,
    name: goal.name,
    targetDate: formatDate(goal.deadline),
    progressText: `$${goal.currentAmount.toLocaleString()} / $${goal.targetAmount.toLocaleString()}`,
    progressPercent: goal.progressPercent,
    progressBarClassName: goal.status === GoalStatus.COMPLETED ? "bg-green-600" : "bg-blue-600",
    status: getStatusLabel(goal.status),
  }));

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
