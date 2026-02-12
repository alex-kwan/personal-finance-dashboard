import { GoalStatus, Prisma } from "@prisma/client";
import {
  SavingsGoalCreateInput,
  SavingsGoalDetailItem,
  SavingsGoalListItem,
  SavingsGoalUpdateInput,
} from "./domain-types";
import { prisma } from "./prisma";

type GoalRecord = Prisma.SavingsGoalGetPayload<Record<string, never>>;

function toProgressPercent(goal: GoalRecord): number {
  if (goal.targetAmount <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
}

function mapGoal(goal: GoalRecord): SavingsGoalListItem {
  return {
    id: goal.id,
    name: goal.name,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    deadline: goal.deadline,
    status: goal.status,
    description: goal.description,
    progressPercent: toProgressPercent(goal),
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
}

export async function listGoalsForUser(userId: string, status?: GoalStatus): Promise<SavingsGoalListItem[]> {
  const goals = await prisma.savingsGoal.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
  });

  return goals.map(mapGoal);
}

export async function getGoalByIdForUser(
  userId: string,
  goalId: string,
): Promise<SavingsGoalDetailItem | null> {
  const goal = await prisma.savingsGoal.findFirst({
    where: {
      id: goalId,
      userId,
    },
  });

  return goal ? mapGoal(goal) : null;
}

export async function createGoalForUser(
  userId: string,
  input: SavingsGoalCreateInput,
): Promise<SavingsGoalDetailItem> {
  const goal = await prisma.savingsGoal.create({
    data: {
      userId,
      name: input.name,
      targetAmount: input.targetAmount,
      currentAmount: input.currentAmount ?? 0,
      deadline: input.deadline ?? null,
      status: input.status ?? GoalStatus.IN_PROGRESS,
      description: input.description ?? null,
    },
  });

  return mapGoal(goal);
}

export async function updateGoalForUser(
  userId: string,
  goalId: string,
  input: SavingsGoalUpdateInput,
): Promise<SavingsGoalDetailItem | null> {
  const existingGoal = await prisma.savingsGoal.findFirst({
    where: {
      id: goalId,
      userId,
    },
  });

  if (!existingGoal) {
    return null;
  }

  const goal = await prisma.savingsGoal.update({
    where: {
      id: goalId,
    },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.targetAmount !== undefined ? { targetAmount: input.targetAmount } : {}),
      ...(input.currentAmount !== undefined ? { currentAmount: input.currentAmount } : {}),
      ...(input.deadline !== undefined ? { deadline: input.deadline } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
    },
  });

  return mapGoal(goal);
}

export async function deleteGoalForUser(userId: string, goalId: string): Promise<boolean> {
  const existingGoal = await prisma.savingsGoal.findFirst({
    where: {
      id: goalId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!existingGoal) {
    return false;
  }

  await prisma.savingsGoal.delete({
    where: {
      id: goalId,
    },
  });

  return true;
}
