import { GoalStatus, TransactionType } from "@prisma/client";
import { DataErrorResponse } from "./domain-types";

export class ApiValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiValidationError";
  }
}

export function parseTransactionType(
  value: string | null | undefined,
  options?: { required?: boolean; fieldName?: string },
): TransactionType | undefined {
  const fieldName = options?.fieldName ?? "Type";

  if (!value) {
    if (options?.required) {
      throw new ApiValidationError(`${fieldName} must be INCOME or EXPENSE.`);
    }
    return undefined;
  }

  if (value === TransactionType.INCOME || value === TransactionType.EXPENSE) {
    return value;
  }

  throw new ApiValidationError(`${fieldName} must be INCOME or EXPENSE.`);
}

export function parseGoalStatus(
  value: string | null | undefined,
  options?: { required?: boolean; fieldName?: string },
): GoalStatus | undefined {
  const fieldName = options?.fieldName ?? "Status";

  if (!value) {
    if (options?.required) {
      throw new ApiValidationError(
        `${fieldName} must be IN_PROGRESS, COMPLETED, or PAUSED.`,
      );
    }
    return undefined;
  }

  if (
    value === GoalStatus.IN_PROGRESS ||
    value === GoalStatus.COMPLETED ||
    value === GoalStatus.PAUSED
  ) {
    return value;
  }

  throw new ApiValidationError(
    `${fieldName} must be IN_PROGRESS, COMPLETED, or PAUSED.`,
  );
}

export function parsePositiveNumber(value: unknown, fieldName: string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new ApiValidationError(`${fieldName} must be greater than 0.`);
  }
  return parsed;
}

export function parseNonNegativeNumber(value: unknown, fieldName: string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new ApiValidationError(`${fieldName} cannot be negative.`);
  }
  return parsed;
}

export function parseOptionalDate(
  value: string | null | undefined,
  fieldName: string,
): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiValidationError(`${fieldName} is invalid.`);
  }

  return parsed;
}

export function requireNonEmptyString(
  value: string | null | undefined,
  message: string,
): string {
  if (!value || !value.trim()) {
    throw new ApiValidationError(message);
  }

  return value.trim();
}

export function errorToResponse(
  error: unknown,
  fallbackMessage: string,
): { status: number; body: DataErrorResponse } {
  if (error instanceof ApiValidationError) {
    return {
      status: 400,
      body: {
        error: error.message,
      },
    };
  }

  if (error instanceof Error && error.message.includes("Unique constraint")) {
    return {
      status: 409,
      body: {
        error: "Resource already exists with the same unique fields.",
      },
    };
  }

  if (error instanceof Error) {
    const normalized = error.message.toLowerCase();
    if (
      normalized.includes("not found for user") ||
      normalized.includes("must match category type")
    ) {
      return {
        status: 400,
        body: {
          error: error.message,
        },
      };
    }
  }

  return {
    status: 500,
    body: {
      error: fallbackMessage,
      details: error instanceof Error ? error.message : "Unknown error",
    },
  };
}