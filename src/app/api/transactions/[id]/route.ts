import { TransactionType } from "@prisma/client";
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

type Params = {
  params: Promise<{
    id: string;
  }>;
};

function parseType(typeParam: string | null): TransactionType | undefined {
  if (!typeParam) {
    return undefined;
  }

  if (typeParam === TransactionType.INCOME || typeParam === TransactionType.EXPENSE) {
    return typeParam;
  }

  return undefined;
}

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
      const amount = Number(body.amount);
      if (Number.isNaN(amount) || amount <= 0) {
        return NextResponse.json<DataErrorResponse>({ error: "Amount must be greater than 0." }, { status: 400 });
      }
      updateInput.amount = amount;
    }

    if (body.description !== undefined) {
      if (!body.description.trim()) {
        return NextResponse.json<DataErrorResponse>({ error: "Description cannot be empty." }, { status: 400 });
      }
      updateInput.description = body.description.trim();
    }

    if (body.type !== undefined) {
      const type = parseType(body.type);
      if (!type) {
        return NextResponse.json<DataErrorResponse>({ error: "Type must be INCOME or EXPENSE." }, { status: 400 });
      }
      updateInput.type = type;
    }

    if (body.date !== undefined) {
      const date = new Date(body.date);
      if (Number.isNaN(date.getTime())) {
        return NextResponse.json<DataErrorResponse>({ error: "Date is invalid." }, { status: 400 });
      }
      updateInput.date = date;
    }

    if (body.categoryId !== undefined) {
      if (!body.categoryId) {
        return NextResponse.json<DataErrorResponse>({ error: "Category is required." }, { status: 400 });
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
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("Category") ? 400 : 500;

    return NextResponse.json<DataErrorResponse>(
      {
        error: "Failed to update transaction.",
        details: message,
      },
      { status },
    );
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
