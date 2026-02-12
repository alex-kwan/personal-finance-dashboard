import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { DataErrorResponse, DataItemResponse, CategoryItem } from "@/lib/domain-types";
import { updateCategoryForUser } from "@/lib/categories";
import { errorToResponse, parseTransactionType, requireNonEmptyString } from "@/lib/api-validation";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    const body = (await request.json()) as {
      name?: string;
      type?: string;
      color?: string | null;
      icon?: string | null;
    };

    const updateData: {
      name?: string;
      type?: ReturnType<typeof parseTransactionType>;
      color?: string | null;
      icon?: string | null;
    } = {};

    if (body.name !== undefined) {
      updateData.name = requireNonEmptyString(body.name, "Category name cannot be empty.");
    }

    if (body.type !== undefined) {
      updateData.type = parseTransactionType(body.type, {
        required: true,
        fieldName: "Category type",
      });
    }

    if (body.color !== undefined) {
      updateData.color = body.color;
    }

    if (body.icon !== undefined) {
      updateData.icon = body.icon;
    }

    const category = await updateCategoryForUser(userId, id, updateData);

    if (!category) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Category not found.",
        },
        { status: 404 },
      );
    }

    const responseBody: DataItemResponse<CategoryItem> = {
      data: category,
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json<DataErrorResponse>(
        {
          error: "Category already exists for this type.",
        },
        { status: 409 },
      );
    }

    const mapped = errorToResponse(error, "Failed to update category.");
    return NextResponse.json<DataErrorResponse>(mapped.body, { status: mapped.status });
  }
}
