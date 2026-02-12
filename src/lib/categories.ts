import { Prisma, TransactionType } from "@prisma/client";
import {
  CategoryCreateInput,
  CategoryItem,
  CategoryUpdateInput,
} from "./domain-types";
import { prisma } from "./prisma";

function mapCategory(
  category: Prisma.CategoryGetPayload<{ include: { _count: { select: { transactions: true } } } }>,
): CategoryItem {
  return {
    id: category.id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    type: category.type,
    usageCount: category._count.transactions,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export async function listCategoriesForUser(userId: string, type?: TransactionType): Promise<CategoryItem[]> {
  const categories = await prisma.category.findMany({
    where: {
      userId,
      ...(type ? { type } : {}),
    },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return categories.map(mapCategory);
}

export async function getCategoryByIdForUser(
  userId: string,
  categoryId: string,
): Promise<CategoryItem | null> {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
    },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  return category ? mapCategory(category) : null;
}

export async function createCategoryForUser(
  userId: string,
  input: CategoryCreateInput,
): Promise<CategoryItem> {
  const category = await prisma.category.create({
    data: {
      userId,
      name: input.name,
      type: input.type,
      color: input.color ?? null,
      icon: input.icon ?? null,
    },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  return mapCategory(category);
}

export async function updateCategoryForUser(
  userId: string,
  categoryId: string,
  input: CategoryUpdateInput,
): Promise<CategoryItem | null> {
  const existingCategory = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
    },
  });

  if (!existingCategory) {
    return null;
  }

  const category = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.color !== undefined ? { color: input.color } : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
    },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  return mapCategory(category);
}
