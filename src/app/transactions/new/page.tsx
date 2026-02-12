import { PlaceholderPage } from "../../_components/placeholder-page";

export default function NewTransactionPage() {
  return (
    <PlaceholderPage
      title="New Transaction"
      description="Static placeholder for creating a transaction."
      links={[
        { href: "/transactions", label: "Save (Back to Transactions)" },
        { href: "/transactions", label: "Cancel" },
      ]}
    />
  );
}
