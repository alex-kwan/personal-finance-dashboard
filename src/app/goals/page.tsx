import { PlaceholderPage } from "../_components/placeholder-page";

export default function GoalsPage() {
  return (
    <PlaceholderPage
      title="Savings Goals"
      description="Static placeholder for goals list and progress overview."
      links={[
        { href: "/goals/new", label: "Create New Goal" },
        { href: "/goals/sample-goal", label: "Open Sample Goal" },
        { href: "/dashboard", label: "Back to Dashboard" },
      ]}
    />
  );
}
