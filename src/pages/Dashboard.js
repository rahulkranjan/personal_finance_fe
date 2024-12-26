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
  const [loadingSummary, setLoadingSummary] = useState(true); // Add loading state for summary

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true); // Start loading
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
      } finally {
        setLoadingSummary(false); // Stop loading
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
        {loadingSummary ? (
          <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-center">
              <div className="loader border-t-4 border-blue-600 w-8 h-8 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading...</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-center">
              <div className="loader border-t-4 border-blue-600 w-8 h-8 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading...</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-center">
              <div className="loader border-t-4 border-blue-600 w-8 h-8 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading...</span>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
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
    </div>
  );
}
