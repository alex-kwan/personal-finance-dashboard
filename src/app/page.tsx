export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            💰 Finance Dashboard
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span>💳</span>
            <span>Transactions</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span>📁</span>
            <span>Categories</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span>🎯</span>
            <span>Savings Goals</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span>📈</span>
            <span>Reports</span>
          </a>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              D
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                Demo User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                demo@example.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Welcome back! Here's your financial overview.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                + Add Transaction
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Income Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Income
                </h3>
                <span className="text-2xl">💵</span>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                $6,500.00
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This month
              </p>
            </div>

            {/* Expenses Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Expenses
                </h3>
                <span className="text-2xl">💸</span>
              </div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                $1,780.00
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This month
              </p>
            </div>

            {/* Net Savings Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Net Savings
                </h3>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                $4,720.00
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This month
              </p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Transactions
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-lg">💼</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Monthly Salary
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Feb 1, 2026
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    +$5,000.00
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <span className="text-lg">🏠</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Monthly Rent
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Feb 1, 2026
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    -$1,200.00
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <span className="text-lg">🛒</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Grocery Shopping
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Feb 3, 2026
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    -$250.00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
