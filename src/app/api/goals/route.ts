import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import {
  DataErrorResponse,
  DataItemResponse,
  DataListResponse,
  SavingsGoalCreateInput,
  SavingsGoalListItem,
} from "@/lib/domain-types";
import { createGoalForUser, listGoalsForUser } from "@/lib/goals";
import {
  ApiValidationError,
  errorToResponse,
  parseGoalStatus,
  parseNonNegativeNumber,
  parseOptionalDate,
  parsePositiveNumber,
  requireNonEmptyString,
} from "@/lib/api-validation";

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const status = parseGoalStatus(searchParams.get("status"), {
      fieldName: "Status",
    });

    const goals = await listGoalsForUser(userId, status);

    const responseBody: DataListResponse<SavingsGoalListItem> = {
      data: goals,
      total: goals.length,
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    const mapped = errorToResponse(error, "Failed to fetch goals.");
    return NextResponse.json<DataErrorResponse>(mapped.body, { status: mapped.status });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    const body = (await request.json()) as {
      name?: string;
      targetAmount?: number;
      currentAmount?: number;
      deadline?: string | null;
      status?: string;
      description?: string | null;
    };

    if (body.targetAmount === undefined) {
      throw new ApiValidationError("Target amount is required.");
    }

    const name = requireNonEmptyString(body.name, "Goal name is required.");
    const targetAmount = parsePositiveNumber(body.targetAmount, "Target amount");
    const currentAmount =
      body.currentAmount !== undefined
        ? parseNonNegativeNumber(body.currentAmount, "Current amount")
        : 0;
    const status = parseGoalStatus(body.status, {
      fieldName: "Status",
    });
    const deadline = parseOptionalDate(body.deadline, "Deadline");

    const createInput: SavingsGoalCreateInput = {
      name,
      targetAmount,
      currentAmount,
      status,
      deadline: deadline ?? null,
      description: body.description ?? null,
    };

    const goal = await createGoalForUser(userId, createInput);

    const responseBody: DataItemResponse<SavingsGoalListItem> = {
      data: goal,
    };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    const mapped = errorToResponse(error, "Failed to create goal.");
    return NextResponse.json<DataErrorResponse>(mapped.body, { status: mapped.status });
  }
}
