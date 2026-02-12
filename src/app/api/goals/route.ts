import { GoalStatus } from "@prisma/client";
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

function parseStatus(statusParam: string | null): GoalStatus | undefined {
  if (!statusParam) {
    return undefined;
  }

  if (
    statusParam === GoalStatus.IN_PROGRESS ||
    statusParam === GoalStatus.COMPLETED ||
    statusParam === GoalStatus.PAUSED
  ) {
    return statusParam;
  }

  return undefined;
}

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const status = parseStatus(searchParams.get("status"));

    const goals = await listGoalsForUser(userId, status);

    const responseBody: DataListResponse<SavingsGoalListItem> = {
      data: goals,
      total: goals.length,
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    return NextResponse.json<DataErrorResponse>(
      {
        error: "Failed to fetch goals.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
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

    if (!body.name || !body.name.trim()) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Goal name is required.",
        },
        { status: 400 },
      );
    }

    if (body.targetAmount === undefined || Number.isNaN(Number(body.targetAmount))) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Target amount is required.",
        },
        { status: 400 },
      );
    }

    const targetAmount = Number(body.targetAmount);
    const currentAmount = body.currentAmount !== undefined ? Number(body.currentAmount) : 0;

    if (targetAmount <= 0) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Target amount must be greater than 0.",
        },
        { status: 400 },
      );
    }

    if (currentAmount < 0) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Current amount cannot be negative.",
        },
        { status: 400 },
      );
    }

    const status = body.status ? parseStatus(body.status) : undefined;
    if (body.status && !status) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Invalid goal status.",
        },
        { status: 400 },
      );
    }

    const createInput: SavingsGoalCreateInput = {
      name: body.name.trim(),
      targetAmount,
      currentAmount,
      status,
      deadline: body.deadline ? new Date(body.deadline) : null,
      description: body.description ?? null,
    };

    const goal = await createGoalForUser(userId, createInput);

    const responseBody: DataItemResponse<SavingsGoalListItem> = {
      data: goal,
    };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    return NextResponse.json<DataErrorResponse>(
      {
        error: "Failed to create goal.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
