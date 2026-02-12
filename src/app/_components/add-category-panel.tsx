"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { readApiErrorMessage, validateRequiredText } from "@/lib/form-validation";

export function AddCategoryPanel() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nameError = validateRequiredText(name, "Category name");
    if (nameError) {
      setError(nameError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          type,
        }),
      });

      if (!response.ok) {
        setError(await readApiErrorMessage(response, "Failed to create category."));
        return;
      }

      setName("");
      setType("EXPENSE");
      router.refresh();
    } catch {
      setError("Unexpected error while creating category.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Category</h3>

      <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Category name"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
          disabled={isSubmitting}
        />
        <select
          value={type}
          onChange={(event) => setType(event.target.value as "EXPENSE" | "INCOME")}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
          disabled={isSubmitting}
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Category"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      <div className="mt-4">
        <Link href="/transactions" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          View all transactions
        </Link>
      </div>
    </section>
  );
}
