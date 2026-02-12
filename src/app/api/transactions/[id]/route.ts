import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import {
  deleteTransactionForUser,
  getTransactionByIdForUser,
  updateTransactionForUser,
} from "@/lib/transactions";
import {
  DataErrorResponse,
  DataItemResponse,
  TransactionDetailItem,
  TransactionUpdateInput,
} from "@/lib/domain-types";
import {
  ApiValidationError,
  errorToResponse,
  parseOptionalDate,
  parsePositiveNumber,
  parseTransactionType,
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

    const transaction = await getTransactionByIdForUser(userId, id);

    if (!transaction) {
      return NextResponse.json<DataErrorResponse>({ error: "Transaction not found." }, { status: 404 });
    }

    const responseBody: DataItemResponse<TransactionDetailItem> = {
      data: transaction,
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    return NextResponse.json<DataErrorResponse>(
      {
        error: "Failed to fetch transaction.",
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
      amount?: number;
      description?: string;
      type?: string;
      date?: string;
      categoryId?: string;
      notes?: string | null;
    };

    const updateInput: TransactionUpdateInput = {};

    if (body.amount !== undefined) {
      const amount = parsePositiveNumber(body.amount, "Amount");
      updateInput.amount = amount;
    }

    if (body.description !== undefined) {
      updateInput.description = requireNonEmptyString(
        body.description,
        "Description cannot be empty.",
      );
    }

    if (body.type !== undefined) {
      const type = parseTransactionType(body.type, {
        required: true,
        fieldName: "Type",
      });
      if (!type) {
        throw new ApiValidationError("Type must be INCOME or EXPENSE.");
      }
      updateInput.type = type;
    }

    if (body.date !== undefined) {
      const date = parseOptionalDate(body.date, "Date");
      if (date === null) {
        throw new ApiValidationError("Date is invalid.");
      }
      updateInput.date = date;
    }

    if (body.categoryId !== undefined) {
      if (!body.categoryId) {
        throw new ApiValidationError("Category is required.");
      }
      updateInput.categoryId = body.categoryId;
    }

    if (body.notes !== undefined) {
      updateInput.notes = body.notes;
    }

    const updated = await updateTransactionForUser(userId, id, updateInput);

    if (!updated) {
      return NextResponse.json<DataErrorResponse>({ error: "Transaction not found." }, { status: 404 });
    }

    const responseBody: DataItemResponse<TransactionDetailItem> = {
      data: updated,
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    const mapped = errorToResponse(error, "Failed to update transaction.");
    return NextResponse.json<DataErrorResponse>(mapped.body, { status: mapped.status });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    const deleted = await deleteTransactionForUser(userId, id);

    if (!deleted) {
      return NextResponse.json<DataErrorResponse>({ error: "Transaction not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json<DataErrorResponse>(
      {
        error: "Failed to delete transaction.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
