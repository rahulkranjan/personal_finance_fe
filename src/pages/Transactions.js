import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axiosInstance from "../axiosConfig";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "expense",
  });
  const [loading, setLoading] = useState(false);

  // Fetch exchange rates
  const fetchExchangeRates = async () => {
    setLoadingRates(true);
    try {
      const response = await axiosInstance.get("/transactions/exchange-rate");
      const { rates, timestamp } = response.data.result;
      const datetime = dayjs(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss");
      setExchangeRates(rates);
      setLastUpdated(datetime);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/transactions/", {
          params: { skip: 0, limit: 10 },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTransaction) {
        // Update existing transaction
        const response = await axiosInstance.put(
          `/transactions/${currentTransaction.id}`,
          {
            ...formData,
            amount:
              formData.category === "expense"
                ? -Math.abs(formData.amount)
                : Math.abs(formData.amount),
          }
        );
        setTransactions((prev) =>
          prev.map((t) => (t.id === response.data.id ? response.data : t))
        );
      } else {
        // Add new transaction
        const response = await axiosInstance.post("/transactions/", {
          ...formData,
          amount:
            formData.category === "expense"
              ? -Math.abs(formData.amount)
              : Math.abs(formData.amount),
        });
        setTransactions((prev) => [...prev, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get("/transactions/report", {
        responseType: "blob", // Ensure response is handled as a blob
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const handleEdit = (transaction) => {
    setCurrentTransaction(transaction);
    setFormData({
      ...transaction,
      amount: Math.abs(transaction.amount),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTransaction(null);
    setFormData({
      description: "",
      amount: "",
      category: "expense",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Transactions
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download Report
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Transaction
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center px-4 py-2 bg-white dark:bg-gray-800">
        <div className="flex flex-wrap items-center space-x-4">
          {exchangeRates
            ? Object.entries(exchangeRates).map(([code, rate]) => (
                <span
                  key={code}
                  className="text-sm font-medium text-gray-800 dark:text-gray-200 bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded-lg"
                >
                  {code}: {rate.toFixed(2)}
                </span>
              ))
            : "Loading rates..."}
        </div>
        <button
          onClick={fetchExchangeRates}
          disabled={loadingRates}
          className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loadingRates ? "Refreshing..." : "Refresh Rates"}
        </button>
      </div>

      {lastUpdated && (
        <p className="px-4 text-xs text-gray-600 dark:text-gray-400">
          Last updated: {lastUpdated}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="loader border-t-4 border-blue-600 w-10 h-10 rounded-full animate-spin"></div>
          <p className="ml-4 text-blue-600 font-medium">Loading transactions...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {[
                  "Date",
                  "Description",
                  "Category",
                  "Amount",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                    {dayjs(transaction.date).format("YYYY-MM-DD")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                    {transaction.category}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap font-semibold ${
                      transaction.category === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    ₹{Math.abs(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {currentTransaction ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { field: "description", label: "Description", type: "text" },
                { field: "amount", label: "Amount", type: "number" },
              ].map(({ field, label, type }) => (
                <div key={field}>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {currentTransaction ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
