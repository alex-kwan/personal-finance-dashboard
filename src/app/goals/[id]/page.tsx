import { GoalStatus } from "@prisma/client";
import { getCurrentUserId } from "@/lib/current-user";
import { getGoalByIdForUser } from "@/lib/goals";
import { notFound } from "next/navigation";
import { AppShell } from "../../_components/app-shell";
import { GoalDetailView } from "../../_components/goal-detail-view";
import { UpdateGoalProgressForm } from "../../_components/update-goal-progress-form";

type GoalDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  const goal = await getGoalByIdForUser(userId, id);

  if (!goal) {
    notFound();
  }

  const statusLabel =
    goal.status === GoalStatus.COMPLETED
      ? "Completed"
      : goal.status === GoalStatus.PAUSED
        ? "Paused"
        : "In Progress";

  return (
    <AppShell title="Goal Detail" description="Inspect one savings goal and monitor contribution progress.">
      <div className="space-y-6">
        <GoalDetailView
          id={goal.id}
          name={goal.name}
          status={statusLabel}
          progressPercent={`${goal.progressPercent}%`}
          amountText={`$${goal.currentAmount.toLocaleString()} saved of $${goal.targetAmount.toLocaleString()} target`}
          progressValue={goal.progressPercent}
          contributions={[
            {
              date: goal.updatedAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              amount: `+$${goal.currentAmount.toLocaleString()}`,
              note: goal.description ?? "Latest saved amount",
            },
          ]}
        />

        <UpdateGoalProgressForm
          goalId={goal.id}
          initialCurrentAmount={goal.currentAmount}
          initialTargetAmount={goal.targetAmount}
          initialStatus={goal.status}
          initialDescription={goal.description}
        />
      </div>
    </AppShell>
  );
}
