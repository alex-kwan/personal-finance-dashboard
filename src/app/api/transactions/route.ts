import { TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import {
  createTransactionForUser,
  getTransactionTotalsForUser,
  listTransactionsForUser,
} from "@/lib/transactions";
import {
  DataErrorResponse,
  DataItemResponse,
  DataListResponse,
  TransactionDetailItem,
  TransactionListItem,
} from "@/lib/domain-types";

function parseType(typeParam: string | null): TransactionType | undefined {
  if (!typeParam) {
    return undefined;
  }

  if (typeParam === TransactionType.INCOME || typeParam === TransactionType.EXPENSE) {
    return typeParam;
  }

  return undefined;
}

function parseDate(value: string | null): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);

    const type = parseType(searchParams.get("type"));
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const startDate = parseDate(searchParams.get("startDate"));
    const endDate = parseDate(searchParams.get("endDate"));

    const [transactions, totals] = await Promise.all([
      listTransactionsForUser(userId, {
        type,
        categoryId,
        search,
        startDate,
        endDate,
      }),
      getTransactionTotalsForUser(userId, {
        categoryId,
        search,
        startDate,
        endDate,
      }),
    ]);

    const responseBody: DataListResponse<TransactionListItem> & {
      totals: { income: number; expenses: number; net: number };
    } = {
      data: transactions,
      total: transactions.length,
      totals,
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    return NextResponse.json<DataErrorResponse>(
      {
        error: "Failed to fetch transactions.",
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
      amount?: number;
      description?: string;
      type?: string;
      date?: string;
      categoryId?: string;
      notes?: string | null;
    };

    if (!body.description || !body.description.trim()) {
      return NextResponse.json<DataErrorResponse>(
        { error: "Description is required." },
        { status: 400 },
      );
    }

    if (body.amount === undefined || Number.isNaN(Number(body.amount)) || Number(body.amount) <= 0) {
      return NextResponse.json<DataErrorResponse>(
        { error: "Amount must be greater than 0." },
        { status: 400 },
      );
    }

    if (!body.categoryId) {
      return NextResponse.json<DataErrorResponse>(
        { error: "Category is required." },
        { status: 400 },
      );
    }

    const type = parseType(body.type ?? null);
    if (!type) {
      return NextResponse.json<DataErrorResponse>(
        { error: "Type must be INCOME or EXPENSE." },
        { status: 400 },
      );
    }

    const date = body.date ? new Date(body.date) : undefined;
    if (date && Number.isNaN(date.getTime())) {
      return NextResponse.json<DataErrorResponse>(
        { error: "Date is invalid." },
        { status: 400 },
      );
    }

    const created = await createTransactionForUser(userId, {
      amount: Number(body.amount),
      description: body.description.trim(),
      type,
      date,
      categoryId: body.categoryId,
      notes: body.notes ?? null,
    });

    const responseBody: DataItemResponse<TransactionDetailItem> = {
      data: created,
    };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("Category") ? 400 : 500;

    return NextResponse.json<DataErrorResponse>(
      {
        error: "Failed to create transaction.",
        details: message,
      },
      { status },
    );
  }
}
