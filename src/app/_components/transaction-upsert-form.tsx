"use client";

import { TransactionType } from "@prisma/client";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  parsePositiveNumberInput,
  readApiErrorMessage,
  validateDateInput,
  validateRequiredText,
} from "@/lib/form-validation";

type CategoryOption = {
  id: string;
  name: string;
  type: TransactionType;
};

type TransactionUpsertFormProps = {
  mode: "create" | "edit";
  transactionId?: string;
  categories: CategoryOption[];
  defaultValues?: {
    description?: string;
    amount?: number;
    type?: TransactionType;
    categoryId?: string;
    date?: string;
    notes?: string | null;
  };
};

function toDateInputValue(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

export function TransactionUpsertForm({
  mode,
  transactionId,
  categories,
  defaultValues,
}: TransactionUpsertFormProps) {
  const router = useRouter();

  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [amount, setAmount] = useState(defaultValues?.amount ? String(defaultValues.amount) : "");
  const [type, setType] = useState<TransactionType>(defaultValues?.type ?? TransactionType.EXPENSE);
  const [categoryId, setCategoryId] = useState(defaultValues?.categoryId ?? "");
  const [date, setDate] = useState(defaultValues?.date ?? toDateInputValue());
  const [notes, setNotes] = useState(defaultValues?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === type),
    [categories, type],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const descriptionError = validateRequiredText(description, "Description");
    if (descriptionError) {
      setError(descriptionError);
      return;
    }

    const amountValidation = parsePositiveNumberInput(amount, "Amount");
    if (amountValidation.error || amountValidation.value === null) {
      setError(amountValidation.error ?? "Amount must be greater than 0.");
      return;
    }

    if (!categoryId) {
      setError("Category is required.");
      return;
    }

    if (!filteredCategories.some((category) => category.id === categoryId)) {
      setError("Category is invalid for selected transaction type.");
      return;
    }

    const dateError = validateDateInput(date, "Date");
    if (dateError) {
      setError(dateError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const endpoint = mode === "create" ? "/api/transactions" : `/api/transactions/${transactionId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
          amount: amountValidation.value,
          type,
          categoryId,
          date,
          notes: notes.trim() || null,
        }),
      });

      if (!response.ok) {
        setError(await readApiErrorMessage(response, "Failed to save transaction."));
        return;
      }

      if (mode === "create") {
        router.push("/transactions");
      } else {
        router.push(`/transactions/${transactionId}`);
      }
      router.refresh();
    } catch {
      setError("Unexpected error while saving transaction.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {mode === "create" ? "Transaction Details" : "Edit Transaction Details"}
      </h3>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Monthly Rent"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select
              value={type}
              onChange={(event) => {
                const nextType = event.target.value as TransactionType;
                setType(nextType);
                setCategoryId("");
              }}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
              disabled={isSubmitting}
            >
              <option value={TransactionType.EXPENSE}>Expense</option>
              <option value={TransactionType.INCOME}>Income</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
              disabled={isSubmitting}
            >
              <option value="">Select category</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional details..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            disabled={isSubmitting}
          />
        </div>

        {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : mode === "create" ? "Save Transaction" : "Save Changes"}
          </button>
          <Link
            href={mode === "create" ? "/transactions" : `/transactions/${transactionId}`}
            className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
