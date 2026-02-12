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
import {
  ApiValidationError,
  errorToResponse,
  parseOptionalDate,
  parsePositiveNumber,
  parseTransactionType,
  requireNonEmptyString,
} from "@/lib/api-validation";

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);

    const type = parseTransactionType(searchParams.get("type"), { fieldName: "Type" });
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const startDate = parseOptionalDate(searchParams.get("startDate"), "Start date") ?? undefined;
    const endDate = parseOptionalDate(searchParams.get("endDate"), "End date") ?? undefined;

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
    const mapped = errorToResponse(error, "Failed to fetch transactions.");
    return NextResponse.json<DataErrorResponse>(mapped.body, { status: mapped.status });
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

    const description = requireNonEmptyString(body.description, "Description is required.");

    if (!body.categoryId) {
      throw new ApiValidationError("Category is required.");
    }

    if (body.amount === undefined) {
      throw new ApiValidationError("Amount must be greater than 0.");
    }

    const amount = parsePositiveNumber(body.amount, "Amount");
    const type = parseTransactionType(body.type, {
      required: true,
      fieldName: "Type",
    });

    if (!type) {
      throw new ApiValidationError("Type must be INCOME or EXPENSE.");
    }

    const date = parseOptionalDate(body.date, "Date") ?? undefined;

    const created = await createTransactionForUser(userId, {
      amount,
      description,
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
    const mapped = errorToResponse(error, "Failed to create transaction.");
    return NextResponse.json<DataErrorResponse>(mapped.body, { status: mapped.status });
  }
}
