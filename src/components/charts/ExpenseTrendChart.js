// src/components/charts/ExpenseTrendChart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useChartTheme } from "../../hooks/useChartTheme";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ExpenseTrendChart({ data }) {
  const theme = useChartTheme();
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Expenses",
        data: data.map((item) => item.amount),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        fill: false,
      },
      {
        label: "Income",
        data: data.map((item) => item.income),
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const options = {
    ...theme.options,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Finance Trends",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "₹" + value;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
}
