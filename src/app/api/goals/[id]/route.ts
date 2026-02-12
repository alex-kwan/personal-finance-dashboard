import { GoalStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import {
  DataErrorResponse,
  DataItemResponse,
  SavingsGoalDetailItem,
  SavingsGoalUpdateInput,
} from "@/lib/domain-types";
import { deleteGoalForUser, getGoalByIdForUser, updateGoalForUser } from "@/lib/goals";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

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

export async function GET(_request: Request, { params }: Params) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    const goal = await getGoalByIdForUser(userId, id);

    if (!goal) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Goal not found.",
        },
        { status: 404 },
      );
    }

    const responseBody: DataItemResponse<SavingsGoalDetailItem> = {
      data: goal,
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    return NextResponse.json<DataErrorResponse>(
      {
        error: "Failed to fetch goal.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;
    const body = (await request.json()) as {
      name?: string;
      targetAmount?: number;
      currentAmount?: number;
      deadline?: string | null;
      status?: string;
      description?: string | null;
    };

    const updateData: SavingsGoalUpdateInput = {};

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json<DataErrorResponse>(
          {
            error: "Goal name cannot be empty.",
          },
          { status: 400 },
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.targetAmount !== undefined) {
      const value = Number(body.targetAmount);
      if (Number.isNaN(value) || value <= 0) {
        return NextResponse.json<DataErrorResponse>(
          {
            error: "Target amount must be greater than 0.",
          },
          { status: 400 },
        );
      }
      updateData.targetAmount = value;
    }

    if (body.currentAmount !== undefined) {
      const value = Number(body.currentAmount);
      if (Number.isNaN(value) || value < 0) {
        return NextResponse.json<DataErrorResponse>(
          {
            error: "Current amount cannot be negative.",
          },
          { status: 400 },
        );
      }
      updateData.currentAmount = value;
    }

    if (body.deadline !== undefined) {
      updateData.deadline = body.deadline ? new Date(body.deadline) : null;
    }

    if (body.status !== undefined) {
      const parsed = parseStatus(body.status);
      if (!parsed) {
        return NextResponse.json<DataErrorResponse>(
          {
            error: "Invalid goal status.",
          },
          { status: 400 },
        );
      }
      updateData.status = parsed;
    }

    if (body.description !== undefined) {
      updateData.description = body.description;
    }

    const goal = await updateGoalForUser(userId, id, updateData);

    if (!goal) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Goal not found.",
        },
        { status: 404 },
      );
    }

    const responseBody: DataItemResponse<SavingsGoalDetailItem> = {
      data: goal,
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    return NextResponse.json<DataErrorResponse>(
      {
        error: "Failed to update goal.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    const deleted = await deleteGoalForUser(userId, id);

    if (!deleted) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Goal not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json<DataErrorResponse>(
      {
        error: "Failed to delete goal.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
