import { PlaceholderPage } from "../../_components/placeholder-page";

type GoalDetailPageProps = {
  params: {
    id: string;
  };
};

export default function GoalDetailPage({ params }: GoalDetailPageProps) {
  return (
    <PlaceholderPage
      title={`Goal: ${params.id}`}
      description="Static placeholder for a single savings goal detail page."
      links={[
        { href: "/goals", label: "Back to Goals" },
      ]}
    />
  );
}
