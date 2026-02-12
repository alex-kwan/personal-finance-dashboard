# Personal Finance Dashboard

A clean, full-stack dashboard built with Next.js that helps users manage their personal finances effectively.

## Core Features

- **Income Tracking** - Record and categorize income sources
- **Expense Management** - Track and categorize spending
- **Savings Goals** - Set and monitor progress toward financial goals
- **Monthly Summaries** - View aggregated financial data by month
- **Charts & Analytics** - Visualize spending patterns and trends

## Technology Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts or Chart.js
- **Authentication**: NextAuth.js (optional for MVP)

## Development Roadmap

### Phase 1: Foundation & Setup (Week 1)
**Priority: Critical**

1. **Project Setup**
   - Install dependencies (Prisma, shadcn/ui, chart library)
   - Configure Tailwind CSS and theme
   - Set up environment variables

2. **Database Schema Design**
   - Design Prisma models for:
     - Users (if multi-user)
     - Transactions (income/expenses)
     - Categories
     - Savings Goals
   - Run initial migration
   - Seed database with sample data

3. **Project Structure**
   - Set up folder structure (`/components`, `/lib`, `/app/api`)
   - Create utility functions (date formatters, currency helpers)
   - Configure TypeScript types

### Phase 2: Core UI Components (Week 1-2)
**Priority: High**

4. **Layout & Navigation**
   - Create main dashboard layout
   - Build responsive navigation/sidebar
   - Add page routing structure

5. **Reusable UI Components**
   - Install shadcn/ui components (Button, Card, Input, Select, Dialog)
   - Create custom components:
     - TransactionCard
     - StatCard (for summaries)
     - DateRangePicker
     - CategoryBadge

### Phase 3: Transaction Management (Week 2)
**Priority: Critical**

6. **API Routes**
   - `POST /api/transactions` - Create transaction
   - `GET /api/transactions` - List transactions (with filters)
   - `PUT /api/transactions/[id]` - Update transaction
   - `DELETE /api/transactions/[id]` - Delete transaction
   - `GET /api/categories` - List categories

7. **Transaction Features**
   - Transaction list/table view
   - Add transaction form (income/expense)
   - Edit/delete transactions
   - Filter by date range, category, type
   - Search functionality

### Phase 4: Dashboard Overview (Week 3)
**Priority: High**

8. **Summary Statistics**
   - Total income (current month)
   - Total expenses (current month)
   - Net savings (income - expenses)
   - Category breakdown

9. **Data Visualization**
   - Income vs Expenses chart (line/bar chart)
   - Expense breakdown by category (pie/donut chart)
   - Monthly trend chart (last 6-12 months)
   - Top spending categories

### Phase 5: Savings Goals (Week 3-4)
**Priority: Medium**

10. **Savings Goals API**
    - `POST /api/goals` - Create goal
    - `GET /api/goals` - List goals
    - `PUT /api/goals/[id]` - Update goal
    - `DELETE /api/goals/[id]` - Delete goal

11. **Goals UI**
    - Goals list with progress bars
    - Add/edit goal form
    - Progress tracking
    - Visual indicators (on track, behind, achieved)

### Phase 6: Monthly Reports (Week 4)
**Priority: Medium**

12. **Monthly Summary View**
    - Month selector/navigation
    - Aggregated statistics per month
    - Comparison with previous month
    - Export functionality (CSV/PDF - optional)

### Phase 7: Polish & Enhancement (Week 5)
**Priority: Low**

13. **User Experience**
    - Loading states and skeletons
    - Error handling and validation
    - Toast notifications
    - Mobile responsiveness testing
    - Dark mode support

14. **Performance Optimization**
    - Implement data caching
    - Optimize database queries
    - Add pagination for large datasets
    - Lazy loading for charts

### Phase 8: Optional Advanced Features (Future)
**Priority: Optional**

15. **Authentication**
    - User registration/login
    - Protected routes
    - User-specific data

16. **Additional Features**
    - Recurring transactions
    - Budget limits and alerts
    - Receipt upload
    - Multi-currency support
    - Data export/import

## Quick Start Build Order

For fastest MVP (Minimum Viable Product):

1. **Database** → Design schema and set up Prisma
2. **API Routes** → Build transaction CRUD endpoints
3. **Transaction Form** → Create UI to add income/expenses
4. **Transaction List** → Display all transactions
5. **Dashboard Stats** → Show basic summaries (total income, expenses, net)
6. **Basic Charts** → Add 1-2 simple visualizations
7. **Polish** → Style, responsive design, error handling

## Why This Project Stands Out

- **Full-Stack Proficiency** - Demonstrates both frontend and backend skills
- **Real-World Application** - Solves a practical problem everyone can relate to
- **Data Modeling** - Shows understanding of database design and relationships
- **UI/UX Design** - Showcases ability to create intuitive, attractive interfaces
- **Modern Tech Stack** - Uses current industry-standard tools and frameworks
