"use client";

import { GoalStatus } from "@prisma/client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type UpdateGoalProgressFormProps = {
  goalId: string;
  initialCurrentAmount: number;
  initialTargetAmount: number;
  initialStatus: GoalStatus;
  initialDescription: string | null;
};

type UpdateGoalResponse = {
  error?: string;
};

export function UpdateGoalProgressForm({
  goalId,
  initialCurrentAmount,
  initialTargetAmount,
  initialStatus,
  initialDescription,
}: UpdateGoalProgressFormProps) {
  const router = useRouter();

  const [currentAmount, setCurrentAmount] = useState(String(initialCurrentAmount));
  const [targetAmount, setTargetAmount] = useState(String(initialTargetAmount));
  const [status, setStatus] = useState<GoalStatus>(initialStatus);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedCurrent = Number(currentAmount);
    const parsedTarget = Number(targetAmount);

    if (Number.isNaN(parsedCurrent) || parsedCurrent < 0) {
      setError("Current amount must be 0 or greater.");
      return;
    }

    if (Number.isNaN(parsedTarget) || parsedTarget <= 0) {
      setError("Target amount must be greater than 0.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentAmount: parsedCurrent,
          targetAmount: parsedTarget,
          status,
          description: description.trim() || null,
        }),
      });

      const payload = (await response.json()) as UpdateGoalResponse;

      if (!response.ok) {
        setError(payload.error ?? "Failed to update goal.");
        return;
      }

      router.refresh();
    } catch {
      setError("Unexpected error while updating goal.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Update Goal</h4>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Current Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={currentAmount}
              onChange={(event) => setCurrentAmount(event.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Target Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={targetAmount}
              onChange={(event) => setTargetAmount(event.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
              disabled={isSubmitting}
            />
          </div>
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

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            disabled={isSubmitting}
          />
        </div>

        {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

        <button
          type="submit"
          className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Updates"}
        </button>
      </form>
    </section>
  );
}
