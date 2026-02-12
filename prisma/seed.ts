import { PrismaClient, TransactionType, GoalStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create expense categories
  const expenseCategories = [
    { name: 'Groceries', color: '#10B981', icon: '🛒' },
    { name: 'Rent', color: '#3B82F6', icon: '🏠' },
    { name: 'Utilities', color: '#F59E0B', icon: '⚡' },
    { name: 'Transportation', color: '#8B5CF6', icon: '🚗' },
    { name: 'Entertainment', color: '#EC4899', icon: '🎮' },
    { name: 'Healthcare', color: '#EF4444', icon: '🏥' },
    { name: 'Dining Out', color: '#F97316', icon: '🍽️' },
    { name: 'Shopping', color: '#6366F1', icon: '🛍️' },
  ];

  // Create income categories
  const incomeCategories = [
    { name: 'Salary', color: '#059669', icon: '💼' },
    { name: 'Freelance', color: '#0891B2', icon: '💻' },
    { name: 'Investment', color: '#7C3AED', icon: '📈' },
    { name: 'Gift', color: '#DB2777', icon: '🎁' },
  ];

  const createdExpenseCategories = [];
  const createdIncomeCategories = [];

  for (const cat of expenseCategories) {
    const category = await prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: cat.name,
          type: TransactionType.EXPENSE,
        },
      },
      update: {},
      create: {
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        type: TransactionType.EXPENSE,
        userId: user.id,
      },
    });
    createdExpenseCategories.push(category);
  }

  for (const cat of incomeCategories) {
    const category = await prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: cat.name,
          type: TransactionType.INCOME,
        },
      },
      update: {},
      create: {
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        type: TransactionType.INCOME,
        userId: user.id,
      },
    });
    createdIncomeCategories.push(category);
  }

  console.log('✅ Created categories:', expenseCategories.length + incomeCategories.length);

  // Create sample transactions
  const transactions = [
    // Income
    {
      amount: 5000,
      description: 'Monthly Salary',
      type: TransactionType.INCOME,
      categoryId: createdIncomeCategories[0].id,
      date: new Date('2026-02-01'),
    },
    {
      amount: 1500,
      description: 'Freelance Project',
      type: TransactionType.INCOME,
      categoryId: createdIncomeCategories[1].id,
      date: new Date('2026-02-05'),
    },
    // Expenses
    {
      amount: 1200,
      description: 'Monthly Rent',
      type: TransactionType.EXPENSE,
      categoryId: createdExpenseCategories[1].id,
      date: new Date('2026-02-01'),
    },
    {
      amount: 250,
      description: 'Grocery Shopping',
      type: TransactionType.EXPENSE,
      categoryId: createdExpenseCategories[0].id,
      date: new Date('2026-02-03'),
    },
    {
      amount: 150,
      description: 'Electric & Water Bill',
      type: TransactionType.EXPENSE,
      categoryId: createdExpenseCategories[2].id,
      date: new Date('2026-02-05'),
    },
    {
      amount: 80,
      description: 'Gas',
      type: TransactionType.EXPENSE,
      categoryId: createdExpenseCategories[3].id,
      date: new Date('2026-02-07'),
    },
    {
      amount: 60,
      description: 'Restaurant Dinner',
      type: TransactionType.EXPENSE,
      categoryId: createdExpenseCategories[6].id,
      date: new Date('2026-02-09'),
    },
    {
      amount: 40,
      description: 'Movie Tickets',
      type: TransactionType.EXPENSE,
      categoryId: createdExpenseCategories[4].id,
      date: new Date('2026-02-10'),
    },
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: {
        ...transaction,
        userId: user.id,
      },
    });
  }

  console.log('✅ Created transactions:', transactions.length);

  // Create sample savings goals
  const savingsGoals = [
    {
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 3500,
      status: GoalStatus.IN_PROGRESS,
      description: 'Build 6 months of living expenses',
      deadline: new Date('2026-12-31'),
    },
    {
      name: 'Vacation to Japan',
      targetAmount: 5000,
      currentAmount: 2000,
      status: GoalStatus.IN_PROGRESS,
      description: 'Summer 2027 trip',
      deadline: new Date('2027-06-30'),
    },
    {
      name: 'New Laptop',
      targetAmount: 2000,
      currentAmount: 1800,
      status: GoalStatus.IN_PROGRESS,
      description: 'MacBook Pro',
      deadline: new Date('2026-03-31'),
    },
  ];

  for (const goal of savingsGoals) {
    await prisma.savingsGoal.create({
      data: {
        ...goal,
        userId: user.id,
      },
    });
  }

  console.log('✅ Created savings goals:', savingsGoals.length);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
