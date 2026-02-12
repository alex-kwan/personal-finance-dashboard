"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type TransactionDeleteButtonProps = {
  transactionId: string;
};

type DeleteResponse = {
  error?: string;
};

export function TransactionDeleteButton({ transactionId }: TransactionDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    const confirmed = window.confirm("Delete this transaction?");
    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json()) as DeleteResponse;
        setError(payload.error ?? "Failed to delete transaction.");
        return;
      }

      router.push("/transactions");
      router.refresh();
    } catch {
      setError("Unexpected error while deleting transaction.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="inline-flex rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isDeleting ? "Deleting..." : "Delete Transaction"}
      </button>
      {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  );
}
