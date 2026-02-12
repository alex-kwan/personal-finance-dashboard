import { GoalStatus, TransactionType } from "@prisma/client";

export type CategoryItem = {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  type: TransactionType;
  usageCount?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryCreateInput = {
  name: string;
  type: TransactionType;
  color?: string | null;
  icon?: string | null;
};

export type CategoryUpdateInput = Partial<CategoryCreateInput>;

export type TransactionListItem = {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  date: Date;
  notes: string | null;
  category: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
    type: TransactionType;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionDetailItem = TransactionListItem;

export type TransactionListFilters = {
  type?: TransactionType;
  categoryId?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
};

export type TransactionCreateInput = {
  amount: number;
  description: string;
  type: TransactionType;
  date?: Date;
  categoryId: string;
  notes?: string | null;
};

export type TransactionUpdateInput = Partial<TransactionCreateInput>;

export type SavingsGoalListItem = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  status: GoalStatus;
  description: string | null;
  progressPercent: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SavingsGoalDetailItem = SavingsGoalListItem;

export type SavingsGoalCreateInput = {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: Date | null;
  status?: GoalStatus;
  description?: string | null;
};

export type SavingsGoalUpdateInput = Partial<SavingsGoalCreateInput>;

export type DashboardSnapshot = {
  incomeTotal: number;
  expenseTotal: number;
  netSavings: number;
  recentTransactions: TransactionListItem[];
  topGoalProgress: SavingsGoalListItem[];
};

export type MonthlyTotals = {
  year: number;
  month: number;
  income: number;
  expenses: number;
  net: number;
};

export type MonthlyReportSnapshot = {
  period: {
    year: number;
    month: number;
  };
  totals: {
    income: number;
    expenses: number;
    net: number;
  };
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
  }>;
  monthOverMonth: {
    incomeDelta: number;
    expenseDelta: number;
    netDelta: number;
    previous: MonthlyTotals;
    current: MonthlyTotals;
  };
};

export type DataListResponse<T> = {
  data: T[];
  total: number;
};

export type DataItemResponse<T> = {
  data: T;
};

export type DataErrorResponse = {
  error: string;
  details?: string;
};
