// src/utils/mockData.js
export const generateMockTransactions = () => {
  return [
    {
      id: 1,
      date: "2024-01-15",
      description: "Salary",
      amount: 5000,
      type: "income",
      category: "Salary",
    },
    {
      id: 2,
      date: "2024-01-16",
      description: "Rent",
      amount: -1500,
      type: "expense",
      category: "Housing",
    },
    {
      id: 3,
      date: "2024-01-17",
      description: "Groceries",
      amount: -200,
      type: "expense",
      category: "Food",
    },
    {
      id: 4,
      date: "2024-01-18",
      description: "Freelance Work",
      amount: 1000,
      type: "income",
      category: "Extra Income",
    },
    {
      id: 5,
      date: "2024-01-19",
      description: "Internet Bill",
      amount: -80,
      type: "expense",
      category: "Utilities",
    },
  ];
};

export const categories = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Savings",
  "Entertainment",
  "Shopping",
  "Salary",
  "Extra Income",
];
