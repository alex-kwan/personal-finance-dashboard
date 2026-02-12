import Link from "next/link";
import { AppShell } from "./app-shell";

type PlaceholderLink = {
  href: string;
  label: string;
};

type PlaceholderPageProps = {
  title: string;
  description: string;
  links?: PlaceholderLink[];
};

export function PlaceholderPage({
  title,
  description,
  links = [],
}: PlaceholderPageProps) {
  return (
    <AppShell title={title} description={description}>
      <div className="mx-auto max-w-4xl space-y-6">
        {links.length > 0 ? (
          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
