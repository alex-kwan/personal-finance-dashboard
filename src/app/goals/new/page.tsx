import Link from "next/link";
import { AppShell } from "../../_components/app-shell";
import { GoalFormCard } from "../../_components/goal-form-card";

export default function NewGoalPage() {
  return (
    <AppShell title="New Savings Goal" description="Create a savings target and track progress over time.">
      <div className="space-y-6">
        <Link
          href="/goals"
          className="inline-flex text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Goals
        </Link>

        <GoalFormCard
          title="Goal Details"
          submitLabel="Save Goal"
          submitHref="/goals"
          cancelHref="/goals"
        />
      </div>
    </AppShell>
  );
}
