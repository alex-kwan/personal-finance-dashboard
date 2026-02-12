"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { GoalStatus } from "@prisma/client";
import {
  parseNonNegativeNumberInput,
  parsePositiveNumberInput,
  readApiErrorMessage,
  validateDateInput,
  validateRequiredText,
} from "@/lib/form-validation";

export function CreateGoalForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("0");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<GoalStatus>(GoalStatus.IN_PROGRESS);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nameError = validateRequiredText(name, "Goal name");
    if (nameError) {
      setError(nameError);
      return;
    }

    const parsedTarget = parsePositiveNumberInput(targetAmount, "Target amount");
    if (parsedTarget.error || parsedTarget.value === null) {
      setError(parsedTarget.error ?? "Target amount must be greater than 0.");
      return;
    }

    const parsedCurrent = parseNonNegativeNumberInput(currentAmount, "Current amount");
    if (parsedCurrent.error || parsedCurrent.value === null) {
      setError(parsedCurrent.error ?? "Current amount cannot be negative.");
      return;
    }

    const deadlineError = validateDateInput(deadline, "Target date");
    if (deadlineError) {
      setError(deadlineError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          targetAmount: parsedTarget.value,
          currentAmount: parsedCurrent.value,
          deadline: deadline || null,
          status,
          description: description.trim() || null,
        }),
      });

      if (!response.ok) {
        setError(await readApiErrorMessage(response, "Failed to create goal."));
        return;
      }

      router.push("/goals");
      router.refresh();
    } catch {
      setError("Unexpected error while creating goal.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goal Details</h3>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Goal Name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Emergency Fund"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Target Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={targetAmount}
              onChange={(event) => setTargetAmount(event.target.value)}
              placeholder="5000"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Current Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={currentAmount}
              onChange={(event) => setCurrentAmount(event.target.value)}
              placeholder="0"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Target Date</label>
            <input
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as GoalStatus)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
              disabled={isSubmitting}
            >
              <option value={GoalStatus.IN_PROGRESS}>In Progress</option>
              <option value={GoalStatus.COMPLETED}>Completed</option>
              <option value={GoalStatus.PAUSED}>Paused</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Optional notes"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            disabled={isSubmitting}
          />
        </div>

        {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Goal"}
          </button>
          <Link
            href="/goals"
            className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
