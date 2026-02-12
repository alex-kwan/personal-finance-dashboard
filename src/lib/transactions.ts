import { Prisma, TransactionType } from "@prisma/client";
import {
  TransactionCreateInput,
  TransactionDetailItem,
  TransactionListFilters,
  TransactionListItem,
  TransactionUpdateInput,
} from "./domain-types";
import { prisma } from "./prisma";

type TransactionWithCategory = Prisma.TransactionGetPayload<{
  include: {
    category: true;
  };
}>;

function mapTransaction(transaction: TransactionWithCategory): TransactionListItem {
  return {
    id: transaction.id,
    amount: transaction.amount,
    description: transaction.description,
    type: transaction.type,
    date: transaction.date,
    notes: transaction.notes,
    category: {
      id: transaction.category.id,
      name: transaction.category.name,
      color: transaction.category.color,
      icon: transaction.category.icon,
      type: transaction.category.type,
    },
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  };
}

function buildTransactionWhere(userId: string, filters?: TransactionListFilters): Prisma.TransactionWhereInput {
  return {
    userId,
    ...(filters?.type ? { type: filters.type } : {}),
    ...(filters?.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters?.search
      ? {
          OR: [
            {
              description: {
                contains: filters.search,
              },
            },
            {
              notes: {
                contains: filters.search,
              },
            },
            {
              category: {
                name: {
                  contains: filters.search,
                },
              },
            },
          ],
        }
      : {}),
    ...((filters?.startDate || filters?.endDate)
      ? {
          date: {
            ...(filters?.startDate ? { gte: filters.startDate } : {}),
            ...(filters?.endDate ? { lte: filters.endDate } : {}),
          },
        }
      : {}),
  };
}

export async function listTransactionsForUser(
  userId: string,
  filters?: TransactionListFilters,
): Promise<TransactionListItem[]> {
  const transactions = await prisma.transaction.findMany({
    where: buildTransactionWhere(userId, filters),
    include: {
      category: true,
    },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  return transactions.map(mapTransaction);
}

export async function getTransactionByIdForUser(
  userId: string,
  transactionId: string,
): Promise<TransactionDetailItem | null> {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
    },
    include: {
      category: true,
    },
  });

  return transaction ? mapTransaction(transaction) : null;
}

export async function createTransactionForUser(
  userId: string,
  input: TransactionCreateInput,
): Promise<TransactionDetailItem> {
  const category = await prisma.category.findFirst({
    where: {
      id: input.categoryId,
      userId,
    },
  });

  if (!category) {
    throw new Error("Category not found for user.");
  }

  if (category.type !== input.type) {
    throw new Error("Transaction type must match category type.");
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      categoryId: input.categoryId,
      amount: input.amount,
      description: input.description,
      type: input.type,
      date: input.date ?? new Date(),
      notes: input.notes ?? null,
    },
    include: {
      category: true,
    },
  });

  return mapTransaction(transaction);
}

export async function updateTransactionForUser(
  userId: string,
  transactionId: string,
  input: TransactionUpdateInput,
): Promise<TransactionDetailItem | null> {
  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
    },
  });

  if (!existingTransaction) {
    return null;
  }

  const nextType: TransactionType = input.type ?? existingTransaction.type;
  const nextCategoryId = input.categoryId ?? existingTransaction.categoryId;

  const category = await prisma.category.findFirst({
    where: {
      id: nextCategoryId,
      userId,
    },
  });

  if (!category) {
    throw new Error("Category not found for user.");
  }

  if (category.type !== nextType) {
    throw new Error("Transaction type must match category type.");
  }

  const transaction = await prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
      ...(input.amount !== undefined ? { amount: input.amount } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.date !== undefined ? { date: input.date } : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
    },
    include: {
      category: true,
    },
  });

  return mapTransaction(transaction);
}

export async function deleteTransactionForUser(userId: string, transactionId: string): Promise<boolean> {
  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!existingTransaction) {
    return false;
  }

  await prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });

  return true;
}

export async function getTransactionTotalsForUser(
  userId: string,
  filters?: Omit<TransactionListFilters, "type">,
): Promise<{ income: number; expenses: number; net: number }> {
  const [incomeAggregate, expenseAggregate] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        ...buildTransactionWhere(userId, filters),
        type: TransactionType.INCOME,
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.transaction.aggregate({
      where: {
        ...buildTransactionWhere(userId, filters),
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const income = incomeAggregate._sum.amount ?? 0;
  const expenses = expenseAggregate._sum.amount ?? 0;

  return {
    income,
    expenses,
    net: income - expenses,
  };
}
