import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import {
  DataErrorResponse,
  DataItemResponse,
  SavingsGoalDetailItem,
  SavingsGoalUpdateInput,
} from "@/lib/domain-types";
import { deleteGoalForUser, getGoalByIdForUser, updateGoalForUser } from "@/lib/goals";
import {
  errorToResponse,
  parseGoalStatus,
  parseNonNegativeNumber,
  parseOptionalDate,
  parsePositiveNumber,
  requireNonEmptyString,
} from "@/lib/api-validation";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

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
      updateData.name = requireNonEmptyString(body.name, "Goal name cannot be empty.");
    }

    if (body.targetAmount !== undefined) {
      updateData.targetAmount = parsePositiveNumber(body.targetAmount, "Target amount");
    }

    if (body.currentAmount !== undefined) {
      updateData.currentAmount = parseNonNegativeNumber(body.currentAmount, "Current amount");
    }

    if (body.deadline !== undefined) {
      updateData.deadline = parseOptionalDate(body.deadline, "Deadline");
    }

    if (body.status !== undefined) {
      const parsed = parseGoalStatus(body.status, {
        required: true,
        fieldName: "Status",
      });
      if (!parsed) {
        return NextResponse.json<DataErrorResponse>({ error: "Invalid goal status." }, { status: 400 });
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
    const mapped = errorToResponse(error, "Failed to update goal.");
    return NextResponse.json<DataErrorResponse>(mapped.body, { status: mapped.status });
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
