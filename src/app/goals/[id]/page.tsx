import { PlaceholderPage } from "../../_components/placeholder-page";

type GoalDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { id } = await params;

  return (
    <PlaceholderPage
      title={`Goal: ${id}`}
      description="Static placeholder for a single savings goal detail page."
      links={[
        { href: "/goals", label: "Back to Goals" },
      ]}
    />
  );
}
