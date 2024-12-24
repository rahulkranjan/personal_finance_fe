// src/components/charts/AssetAllocationChart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useChartTheme } from "../../hooks/useChartTheme";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AssetAllocationChart({ data }) {
  const theme = useChartTheme();
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    ...theme.options,
    responsive: true,
    maintainAspectRatio: false, // Allow custom sizing
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Asset Allocation",
      },
    },
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
      style={{ width: "450px", height: "450px" }} // Adjust chart size
    >
      <Pie data={chartData} options={options} />
    </div>
  );
}
