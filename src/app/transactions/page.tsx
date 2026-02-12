import { PlaceholderPage } from "../_components/placeholder-page";

export default function TransactionsPage() {
  return (
    <PlaceholderPage
      title="Transactions"
      description="Static placeholder for the transactions list and filter view."
      links={[
        { href: "/transactions/new", label: "Add New Transaction" },
        { href: "/transactions/sample-transaction", label: "Open Sample Transaction" },
        { href: "/dashboard", label: "Back to Dashboard" },
      ]}
    />
  );
}
