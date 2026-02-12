import { AppShell } from "../../_components/app-shell";
import { GoalDetailView } from "../../_components/goal-detail-view";

type GoalDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { id } = await params;

  return (
    <AppShell title="Goal Detail" description="Inspect one savings goal and monitor contribution progress.">
      <GoalDetailView
        id={id}
        name="Emergency Fund"
        status="On Track"
        progressPercent="60%"
        amountText="$3,000 saved of $5,000 target"
        progressWidthClassName="w-[60%]"
        contributions={[
          { date: "Feb 10, 2026", amount: "+$250", note: "Automatic transfer" },
          { date: "Jan 25, 2026", amount: "+$300", note: "Manual contribution" },
          { date: "Jan 10, 2026", amount: "+$200", note: "Weekly savings" },
        ]}
      />
    </AppShell>
  );
}
