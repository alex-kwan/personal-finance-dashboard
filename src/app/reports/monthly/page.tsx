import { PlaceholderPage } from "../../_components/placeholder-page";

export default function MonthlyReportPage() {
  return (
    <PlaceholderPage
      title="Monthly Report"
      description="Static placeholder for monthly summary reporting."
      links={[
        { href: "/reports", label: "Back to Reports" },
        { href: "/dashboard", label: "Back to Dashboard" },
      ]}
    />
  );
}
