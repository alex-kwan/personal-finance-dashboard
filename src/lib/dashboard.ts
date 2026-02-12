import { TransactionType } from "@prisma/client";
import { DashboardSnapshot } from "./domain-types";
import { listGoalsForUser } from "./goals";
import { prisma } from "./prisma";
import { listTransactionsForUser } from "./transactions";

function getMonthBounds(referenceDate: Date): { start: Date; end: Date } {
  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);

  return { start, end };
}

export async function getDashboardSnapshotForUser(
  userId: string,
  options?: {
    referenceDate?: Date;
    recentTransactionsLimit?: number;
    topGoalsLimit?: number;
  },
): Promise<DashboardSnapshot> {
  const referenceDate = options?.referenceDate ?? new Date();
  const recentTransactionsLimit = options?.recentTransactionsLimit ?? 5;
  const topGoalsLimit = options?.topGoalsLimit ?? 3;

  const { start, end } = getMonthBounds(referenceDate);

  const [incomeAgg, expenseAgg, recentTransactions, goalProgress] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.INCOME,
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.EXPENSE,
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
    }),
    listTransactionsForUser(userId),
    listGoalsForUser(userId),
  ]);

  const incomeTotal = incomeAgg._sum.amount ?? 0;
  const expenseTotal = expenseAgg._sum.amount ?? 0;

  return {
    incomeTotal,
    expenseTotal,
    netSavings: incomeTotal - expenseTotal,
    recentTransactions: recentTransactions.slice(0, recentTransactionsLimit),
    topGoalProgress: goalProgress
      .sort((left, right) => right.progressPercent - left.progressPercent)
      .slice(0, topGoalsLimit),
  };
}
