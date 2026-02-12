import { NextResponse } from "next/server";
import { createCategoryForUser, listCategoriesForUser } from "@/lib/categories";
import { getCurrentUserId } from "@/lib/current-user";
import { DataErrorResponse, DataListResponse, DataItemResponse, CategoryItem } from "@/lib/domain-types";
import {
  ApiValidationError,
  errorToResponse,
  parseTransactionType,
  requireNonEmptyString,
} from "@/lib/api-validation";

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const type = parseTransactionType(searchParams.get("type"), {
      fieldName: "Type",
    });

    const categories = await listCategoriesForUser(userId, type);

    const responseBody: DataListResponse<CategoryItem> = {
      data: categories,
      total: categories.length,
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    const mapped = errorToResponse(error, "Failed to fetch categories.");
    return NextResponse.json<DataErrorResponse>(mapped.body, { status: mapped.status });
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

    const name = requireNonEmptyString(body.name, "Category name is required.");
    const type = parseTransactionType(body.type, {
      required: true,
      fieldName: "Category type",
    });

    if (!type) {
      throw new ApiValidationError("Category type must be INCOME or EXPENSE.");
    }

    const category = await createCategoryForUser(userId, {
      name,
      type,
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

    const mapped = errorToResponse(error, "Failed to create category.");
    return NextResponse.json<DataErrorResponse>(mapped.body, { status: mapped.status });
  }
}
