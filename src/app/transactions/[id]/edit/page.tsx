import { PlaceholderPage } from "../../../_components/placeholder-page";

type EditTransactionPageProps = {
  params: {
    id: string;
  };
};

export default function EditTransactionPage({ params }: EditTransactionPageProps) {
  return (
    <PlaceholderPage
      title={`Edit Transaction: ${params.id}`}
      description="Static placeholder for editing a transaction."
      links={[
        { href: `/transactions/${params.id}`, label: "Save (Back to Detail)" },
        { href: `/transactions/${params.id}`, label: "Cancel" },
      ]}
    />
  );
}
