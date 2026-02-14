import { AppShell } from "./app-shell";

type ScreenLoadingStateProps = {
  title: string;
  description: string;
  blocks?: number;
};

export function ScreenLoadingState({
  title,
  description,
  blocks = 3,
}: ScreenLoadingStateProps) {
  return (
    <AppShell title={title} description={description}>
      <div className="space-y-6" aria-busy="true" aria-live="polite">
        <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="h-24 animate-pulse rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" />
          <div className="h-24 animate-pulse rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" />
          <div className="h-24 animate-pulse rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" />
        </div>

        {Array.from({ length: blocks }).map((_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          />
        ))}
      </div>
    </AppShell>
  );
}