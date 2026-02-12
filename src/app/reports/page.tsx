import { PlaceholderPage } from "../_components/placeholder-page";

export default function ReportsPage() {
  return (
    <PlaceholderPage
      title="Reports"
      description="Static placeholder for analytics and report entry points."
      links={[
        { href: "/reports/monthly", label: "Open Monthly Report" },
        { href: "/dashboard", label: "Back to Dashboard" },
      ]}
    />
  );
}
