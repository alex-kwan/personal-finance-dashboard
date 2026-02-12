import { TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { createCategoryForUser, listCategoriesForUser } from "@/lib/categories";
import { getCurrentUserId } from "@/lib/current-user";
import { DataErrorResponse, DataListResponse, DataItemResponse, CategoryItem } from "@/lib/domain-types";

function parseTypeParam(typeParam: string | null): TransactionType | undefined {
  if (!typeParam) {
    return undefined;
  }

  if (typeParam === TransactionType.INCOME || typeParam === TransactionType.EXPENSE) {
    return typeParam;
  }

  return undefined;
}

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const type = parseTypeParam(searchParams.get("type"));

    const categories = await listCategoriesForUser(userId, type);

    const responseBody: DataListResponse<CategoryItem> = {
      data: categories,
      total: categories.length,
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody: DataErrorResponse = {
      error: "Failed to fetch categories.",
      details: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    const body = (await request.json()) as {
      name?: string;
      type?: string;
      color?: string | null;
      icon?: string | null;
    };

    if (!body.name || !body.name.trim()) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Category name is required.",
        },
        { status: 400 },
      );
    }

    if (body.type !== TransactionType.INCOME && body.type !== TransactionType.EXPENSE) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Category type must be INCOME or EXPENSE.",
        },
        { status: 400 },
      );
    }

    const category = await createCategoryForUser(userId, {
      name: body.name.trim(),
      type: body.type,
      color: body.color ?? null,
      icon: body.icon ?? null,
    });

    const responseBody: DataItemResponse<CategoryItem> = {
      data: category,
    };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Category already exists for this type.",
        },
        { status: 409 },
      );
    }

    const responseBody: DataErrorResponse = {
      error: "Failed to create category.",
      details: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
