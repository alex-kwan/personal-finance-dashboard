import { GoalStatus } from "@prisma/client";
import {
  createGoalForUser,
  deleteGoalForUser,
  getGoalByIdForUser,
  listGoalsForUser,
  updateGoalForUser,
} from "../src/lib/goals";
import { prisma } from "../src/lib/prisma";

async function main() {
  const demoUser = await prisma.user.findUnique({
    where: {
      email: "demo@example.com",
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!demoUser) {
    throw new Error("Demo user not found. Run `npm run db:seed` first.");
  }

  const beforeCount = (await listGoalsForUser(demoUser.id)).length;

  const created = await createGoalForUser(demoUser.id, {
    name: "Step4 Smoke Goal",
    targetAmount: 1234,
    currentAmount: 100,
    status: GoalStatus.IN_PROGRESS,
    description: "Temporary goal created by validate-goals-step4",
  });

  if (created.progressPercent !== 8) {
    throw new Error(`Expected initial progressPercent=8, received ${created.progressPercent}`);
  }

  const fetchedAfterCreate = await getGoalByIdForUser(demoUser.id, created.id);
  if (!fetchedAfterCreate) {
    throw new Error("Created goal was not found by getGoalByIdForUser.");
  }

  const updated = await updateGoalForUser(demoUser.id, created.id, {
    currentAmount: 350,
    status: GoalStatus.PAUSED,
  });

  if (!updated) {
    throw new Error("updateGoalForUser returned null for created goal.");
  }

  if (updated.status !== GoalStatus.PAUSED) {
    throw new Error(`Expected updated status=PAUSED, received ${updated.status}`);
  }

  if (updated.progressPercent !== 28) {
    throw new Error(`Expected updated progressPercent=28, received ${updated.progressPercent}`);
  }

  const deleted = await deleteGoalForUser(demoUser.id, created.id);
  if (!deleted) {
    throw new Error("deleteGoalForUser returned false for created goal.");
  }

  const fetchedAfterDelete = await getGoalByIdForUser(demoUser.id, created.id);
  if (fetchedAfterDelete) {
    throw new Error("Goal still exists after deleteGoalForUser.");
  }

  const afterCount = (await listGoalsForUser(demoUser.id)).length;
  if (afterCount !== beforeCount) {
    throw new Error(`Goal count mismatch after cleanup: before=${beforeCount}, after=${afterCount}`);
  }

  console.log("✅ Step 4 goals smoke check complete");
  console.log("User:", demoUser.email);
  console.log("Verified: create, read, update (status + amount), delete, cleanup");
}

main()
  .catch((error) => {
    console.error("❌ Step 4 goals smoke check failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
