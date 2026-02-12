import { AppShell } from "../_components/app-shell";
import { GoalsProgressCard } from "../_components/goals-progress-card";
import { QuickActions } from "../_components/quick-actions";
import { RecentTransactionsCard } from "../_components/recent-transactions-card";
import { StatRow } from "../_components/stat-row";
import { getCurrentUserId } from "@/lib/current-user";
import { getDashboardSnapshotForUser } from "@/lib/dashboard";
import { TransactionType } from "@prisma/client";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value: Date): string {
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  const snapshot = await getDashboardSnapshotForUser(userId, {
    recentTransactionsLimit: 5,
    topGoalsLimit: 3,
  });

  const avgGoalProgress =
    snapshot.topGoalProgress.length === 0
      ? 0
      : Math.round(
          snapshot.topGoalProgress.reduce((sum, goal) => sum + goal.progressPercent, 0) /
            snapshot.topGoalProgress.length,
        );

  const stats = [
    {
      label: "Total Income",
      value: formatCurrency(snapshot.incomeTotal),
      subtitle: "This month",
      valueClassName: "text-green-600 dark:text-green-400",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(snapshot.expenseTotal),
      subtitle: "This month",
      valueClassName: "text-red-600 dark:text-red-400",
    },
    {
      label: "Net Savings",
      value: formatCurrency(snapshot.netSavings),
      subtitle: "This month",
      valueClassName: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Goal Progress",
      value: `${avgGoalProgress}%`,
      subtitle: "Across all goals",
      valueClassName: "text-purple-600 dark:text-purple-400",
    },
  ];

  const quickActions = [
    { href: "/transactions/new", label: "+ Add Transaction", variant: "primary" as const },
    { href: "/goals/new", label: "+ Create Goal", variant: "secondary" as const },
    { href: "/reports", label: "View Reports", variant: "secondary" as const },
  ];

  const recentTransactions = [
    ...snapshot.recentTransactions.map((transaction) => ({
      name: transaction.description,
      meta: `${formatDate(transaction.date)} • ${transaction.category.name}`,
      amount: `${transaction.type === TransactionType.INCOME ? "+" : "-"}${formatCurrency(transaction.amount)}`,
      amountClassName:
        transaction.type === TransactionType.INCOME
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
    })),
  ];

  const goalProgress = [
    ...snapshot.topGoalProgress.map((goal, index) => ({
      name: goal.name,
      amountText: `${formatCurrency(goal.currentAmount)} / ${formatCurrency(goal.targetAmount)}`,
      progressPercent: goal.progressPercent,
      barClassName: index % 3 === 0 ? "bg-blue-600" : index % 3 === 1 ? "bg-green-600" : "bg-purple-600",
    })),
  ];

  return (
    <AppShell
      title="Dashboard"
      description="Welcome back! Here’s your financial overview and quick actions."
    >
      <div className="space-y-8">
        <StatRow stats={stats} />
        <QuickActions actions={quickActions} />
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RecentTransactionsCard transactions={recentTransactions} />
          <GoalsProgressCard goals={goalProgress} />
        </section>
      </div>
    </AppShell>
  );
}
