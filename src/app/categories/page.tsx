import { PlaceholderPage } from "../_components/placeholder-page";

export default function CategoriesPage() {
  return (
    <PlaceholderPage
      title="Categories"
      description="Static placeholder for category management."
      links={[
        { href: "/transactions", label: "View Transactions" },
        { href: "/dashboard", label: "Back to Dashboard" },
      ]}
    />
  );
}
