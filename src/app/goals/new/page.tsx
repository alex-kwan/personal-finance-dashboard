import Link from "next/link";
import { AppShell } from "../../_components/app-shell";
import { CreateGoalForm } from "../../_components/create-goal-form";

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

        <CreateGoalForm />
      </div>
    </AppShell>
  );
}
