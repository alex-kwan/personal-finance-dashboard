import { prisma } from "./prisma";

const DEMO_EMAIL = "demo@example.com";

export async function getCurrentUserId(): Promise<string> {
  const user = await prisma.user.findUnique({
    where: {
      email: DEMO_EMAIL,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error(`Demo user not found for ${DEMO_EMAIL}. Run npm run db:seed.`);
  }

  return user.id;
}
