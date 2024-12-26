import { useState, useEffect } from "react";
import ExpenseTrendChart from "../components/charts/ExpenseTrendChart";
import AssetAllocationChart from "../components/charts/AssetAllocationChart";
import axiosInstance from "../axiosConfig";

export default function Dashboard() {
  const [financeData, setFinanceData] = useState({
    trends: [],
    assets: [],
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      totalBalance: 0,
    },
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axiosInstance.get("/transactions/summary");
        setFinanceData((prevData) => ({
          ...prevData,
          summary: response.data,
        }));
      } catch (error) {
        if (error.response?.status === 401) {
          console.error("User not authenticated. Redirecting to login...");
          // Handle unauthenticated state here
        } else {
          console.error("Error fetching summary data:", error);
        }
      }
    };

    fetchSummary();
    // Mock data for trends and assets - replace with actual API calls if needed
    const mockData = {
      trends: [
        { month: "Jan", amount: 1500, income: 4000 },
        { month: "Feb", amount: 1800, income: 4000 },
        { month: "Mar", amount: 1200, income: 4200 },
        { month: "Apr", amount: 2100, income: 4200 },
        { month: "May", amount: 1600, income: 4500 },
        { month: "Jun", amount: 1900, income: 4500 },
      ],
      assets: [
        { category: "Stocks", amount: 25000 },
        { category: "Cash", amount: 10000 },
        { category: "Real Estate", amount: 150000 },
        { category: "Crypto", amount: 5000 },
        { category: "Bonds", amount: 15000 },
      ],
    };

    setFinanceData((prevData) => ({
      ...prevData,
      trends: mockData.trends,
      assets: mockData.assets,
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Total Transactions
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {financeData?.summary?.total_transactions?.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Total Income
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ₹{financeData.summary?.total_income?.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Total Expenses
          </h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            ₹{financeData?.summary?.total_expense?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Expense Trends
          </h2>
          <ExpenseTrendChart data={financeData.trends} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Asset Allocation
          </h2>
          <AssetAllocationChart data={financeData.assets} />
        </div>
      </div>

      {/* Recent Transactions
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Recent Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {[
                {
                  id: 1,
                  date: "2024-01-20",
                  description: "Salary Deposit",
                  amount: 5000,
                  type: "income",
                },
                {
                  id: 2,
                  date: "2024-01-19",
                  description: "Rent Payment",
                  amount: -1500,
                  type: "expense",
                },
                {
                  id: 3,
                  date: "2024-01-18",
                  description: "Grocery Shopping",
                  amount: -200,
                  type: "expense",
                },
                {
                  id: 4,
                  date: "2024-01-17",
                  description: "Freelance Work",
                  amount: 1000,
                  type: "income",
                },
                {
                  id: 5,
                  date: "2024-01-16",
                  description: "Utility Bills",
                  amount: -150,
                  type: "expense",
                },
              ].map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {transaction.description}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {Math.abs(transaction.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
