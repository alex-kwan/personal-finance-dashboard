import { PlaceholderPage } from "../_components/placeholder-page";

export default function DashboardPage() {
  return (
    <PlaceholderPage
      title="Dashboard"
      description="Static placeholder for the dashboard overview screen."
      links={[
        { href: "/transactions", label: "Go to Transactions" },
        { href: "/goals", label: "Go to Savings Goals" },
        { href: "/reports", label: "Go to Reports" },
      ]}
    />
  );
}
