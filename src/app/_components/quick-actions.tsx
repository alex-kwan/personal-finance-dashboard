import Link from "next/link";

type QuickAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type QuickActionsProps = {
  actions: QuickAction[];
};

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
      <div className="mt-4 flex flex-wrap gap-3">
        {actions.map((action) => (
          <Link
            key={action.href + action.label}
            href={action.href}
            className={
              action.variant === "primary"
                ? "inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                : "inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            }
          >
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
