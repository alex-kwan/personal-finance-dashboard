import { AppShell } from "../_components/app-shell";
import { GoalsProgressCard } from "../_components/goals-progress-card";
import { QuickActions } from "../_components/quick-actions";
import { RecentTransactionsCard } from "../_components/recent-transactions-card";
import { StatRow } from "../_components/stat-row";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Income",
      value: "$6,500.00",
      subtitle: "This month",
      valueClassName: "text-green-600 dark:text-green-400",
    },
    {
      label: "Total Expenses",
      value: "$1,780.00",
      subtitle: "This month",
      valueClassName: "text-red-600 dark:text-red-400",
    },
    {
      label: "Net Savings",
      value: "$4,720.00",
      subtitle: "This month",
      valueClassName: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Goal Progress",
      value: "68%",
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
    {
      name: "Monthly Salary",
      meta: "Feb 1, 2026 • Income",
      amount: "+$5,000.00",
      amountClassName: "text-green-600 dark:text-green-400",
    },
    {
      name: "Monthly Rent",
      meta: "Feb 1, 2026 • Housing",
      amount: "-$1,200.00",
      amountClassName: "text-red-600 dark:text-red-400",
    },
    {
      name: "Grocery Shopping",
      meta: "Feb 3, 2026 • Food",
      amount: "-$250.00",
      amountClassName: "text-red-600 dark:text-red-400",
    },
  ];

  const goalProgress = [
    {
      name: "Emergency Fund",
      amountText: "$3,000 / $5,000",
      widthClassName: "w-[60%]",
      barClassName: "bg-blue-600",
    },
    {
      name: "Vacation Fund",
      amountText: "$1,750 / $2,500",
      widthClassName: "w-[70%]",
      barClassName: "bg-green-600",
    },
    {
      name: "New Laptop",
      amountText: "$900 / $1,500",
      widthClassName: "w-[60%]",
      barClassName: "bg-purple-600",
    },
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
