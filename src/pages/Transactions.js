// src/pages/Transactions.js
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";


export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [formData, setFormData] = useState({
    // date: "",
    description: "",
    amount: "",
    category: "expense",
  });

  // Axios base configuration
  const API_BASE_URL = "http://localhost:8000";
  const axiosConfig = {
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/transactions/`, {
          params: { skip: 0, limit: 10 },
          ...axiosConfig,
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTransaction) {
        // Update existing transaction
        const response = await axios.put(
          `${API_BASE_URL}/transactions/${currentTransaction.id}`,
          {
            ...formData,
            amount:
              formData.category === "expense"
                ? -Math.abs(formData.amount)
                : Math.abs(formData.amount),
          },
          axiosConfig
        );
        setTransactions((prev) =>
          prev.map((t) => (t.id === response.data.id ? response.data : t))
        );
      } else {
        // Add new transaction
        const response = await axios.post(
          `${API_BASE_URL}/transactions/`,
          {
            ...formData,
            amount:
              formData.category === "expense"
                ? -Math.abs(formData.amount)
                : Math.abs(formData.amount),
          },
          axiosConfig
        );
        setTransactions((prev) => [...prev, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving transaction:", error);
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
      await axios.delete(`${API_BASE_URL}/transactions/${id}`, axiosConfig);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTransaction(null);
    setFormData({
      date: "",
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {["Date", "Description", "Category", "Amount", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
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

      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {currentTransaction ? "Edit Transaction" : "Add Transaction"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["description", "amount"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === "amount" ? "number" : "text"}
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        ))}
        {/* <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <input
            type="date" // Updated type for better UI
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div> */}
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
