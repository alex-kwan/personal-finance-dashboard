import { TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { DataErrorResponse, DataItemResponse, CategoryItem } from "@/lib/domain-types";
import { updateCategoryForUser } from "@/lib/categories";

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
      type?: TransactionType;
      color?: string | null;
      icon?: string | null;
    } = {};

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json<DataErrorResponse>(
          {
            error: "Category name cannot be empty.",
          },
          { status: 400 },
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.type !== undefined) {
      if (body.type !== TransactionType.INCOME && body.type !== TransactionType.EXPENSE) {
        return NextResponse.json<DataErrorResponse>(
          {
            error: "Category type must be INCOME or EXPENSE.",
          },
          { status: 400 },
        );
      }
      updateData.type = body.type;
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

    return NextResponse.json<DataErrorResponse>(
      {
        error: "Failed to update category.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
