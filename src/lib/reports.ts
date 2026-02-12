import { TransactionType } from "@prisma/client";
import { MonthlyReportSnapshot, MonthlyTotals } from "./domain-types";
import { prisma } from "./prisma";

function getMonthBounds(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  return { start, end };
}

function getPreviousYearMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }

  return { year, month: month - 1 };
}

export async function getMonthlyTotalsForUser(
  userId: string,
  year: number,
  month: number,
): Promise<MonthlyTotals> {
  const { start, end } = getMonthBounds(year, month);

  const [incomeAggregate, expenseAggregate] = await Promise.all([
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
  ]);

  const income = incomeAggregate._sum.amount ?? 0;
  const expenses = expenseAggregate._sum.amount ?? 0;

  return {
    year,
    month,
    income,
    expenses,
    net: income - expenses,
  };
}

export async function getMonthlyReportSnapshotForUser(
  userId: string,
  year: number,
  month: number,
): Promise<MonthlyReportSnapshot> {
  const currentTotals = await getMonthlyTotalsForUser(userId, year, month);

  const previousPeriod = getPreviousYearMonth(year, month);
  const previousTotals = await getMonthlyTotalsForUser(userId, previousPeriod.year, previousPeriod.month);

  const { start, end } = getMonthBounds(year, month);

  const categoryGroups = await prisma.transaction.groupBy({
    by: ["categoryId"],
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
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  const categoryIds = categoryGroups.map((group) => group.categoryId);
  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

  const totalExpense = currentTotals.expenses || 1;

  return {
    period: {
      year,
      month,
    },
    totals: {
      income: currentTotals.income,
      expenses: currentTotals.expenses,
      net: currentTotals.net,
    },
    categoryBreakdown: categoryGroups.map((group) => {
      const amount = group._sum.amount ?? 0;

      return {
        categoryId: group.categoryId,
        categoryName: categoryNameById.get(group.categoryId) ?? "Unknown",
        amount,
        percentage: Number(((amount / totalExpense) * 100).toFixed(2)),
      };
    }),
    monthOverMonth: {
      incomeDelta: currentTotals.income - previousTotals.income,
      expenseDelta: currentTotals.expenses - previousTotals.expenses,
      netDelta: currentTotals.net - previousTotals.net,
      previous: previousTotals,
      current: currentTotals,
    },
  };
}

export async function listRecentMonthlyTotalsForUser(
  userId: string,
  options?: {
    months?: number;
    referenceDate?: Date;
  },
): Promise<MonthlyTotals[]> {
  const months = options?.months ?? 6;
  const referenceDate = options?.referenceDate ?? new Date();

  const result: MonthlyTotals[] = [];

  for (let offset = 0; offset < months; offset += 1) {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth() + 1 - offset;
    const normalizedDate = new Date(year, month - 1, 1);

    const totals = await getMonthlyTotalsForUser(
      userId,
      normalizedDate.getFullYear(),
      normalizedDate.getMonth() + 1,
    );

    result.push(totals);
  }

  return result.reverse();
}
