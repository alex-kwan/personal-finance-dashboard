import Link from "next/link";

type ReportTypeCard = {
  title: string;
  description: string;
  href: string;
};

type ReportTypeCardsProps = {
  cards: ReportTypeCard[];
};

export function ReportTypeCards({ cards }: ReportTypeCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{card.description}</p>
          <div className="mt-4">
            <Link href={card.href} className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              Open report
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
