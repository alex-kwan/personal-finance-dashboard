import { PlaceholderPage } from "../../_components/placeholder-page";

type TransactionDetailPageProps = {
  params: {
    id: string;
  };
};

export default function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  return (
    <PlaceholderPage
      title={`Transaction: ${params.id}`}
      description="Static placeholder for transaction detail view."
      links={[
        { href: `/transactions/${params.id}/edit`, label: "Edit Transaction" },
        { href: "/transactions", label: "Back to Transactions" },
      ]}
    />
  );
}
