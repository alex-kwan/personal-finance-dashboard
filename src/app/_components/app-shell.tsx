import Link from "next/link";
import { ReactNode } from "react";

type AppShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const primaryNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/transactions", label: "Transactions", icon: "💳" },
  { href: "/categories", label: "Categories", icon: "📁" },
  { href: "/goals", label: "Savings Goals", icon: "🎯" },
  { href: "/reports", label: "Reports", icon: "📈" },
];

export function AppShell({ title, description, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="hidden w-64 border-r border-gray-200 bg-white md:flex md:flex-col dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">💰 Finance Dashboard</h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {primaryNavLinks.map((navLink) => (
            <Link
              key={navLink.href}
              href={navLink.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span>{navLink.icon}</span>
              <span>{navLink.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              D
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Demo User</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">demo@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800 md:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
