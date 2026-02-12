import { PlaceholderPage } from "../../_components/placeholder-page";

export default function NewGoalPage() {
  return (
    <PlaceholderPage
      title="New Savings Goal"
      description="Static placeholder for creating a new savings goal."
      links={[
        { href: "/goals", label: "Save (Back to Goals)" },
        { href: "/goals", label: "Cancel" },
      ]}
    />
  );
}
